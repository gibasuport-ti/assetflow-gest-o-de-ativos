
import React, { useState, useRef, useMemo } from 'react';
import { AssetExchange, LogoPreference, User } from '../types';
import { FileDown, Trash2, Search, FileSpreadsheet, Pencil, Mail, Laptop, Smartphone, Cpu, Clock, Lock, FileCheck, Upload, Fingerprint, Filter, Download, Loader2, Send, FileText, ExternalLink, Truck, Bot, X, RotateCcw, FolderCheck, ShieldCheck } from 'lucide-react';
import { generateAssetPDF, getPDFFileName } from '../services/pdfService';
import { exportToExcel, importFromExcel } from '../services/excelService';
import { apiService } from '../services/apiService';
import { normalizeText } from '../constants';
import { UserAvatar } from './UserAvatar';

interface InventoryTableProps {
  exchanges: AssetExchange[];
  onDelete: (id: string) => void;
  onEdit: (exchange: AssetExchange) => void;
  onNotify: (message: string, type: 'success' | 'error') => void;
  onSignStart: (exchange: AssetExchange) => void;
  onStatusChange: (id: string, status: 'draft' | 'pending_receiver' | 'completed') => void;
  onCompleteRequest: (id: string) => void;
  onBulkImport: (data: AssetExchange[]) => void;
  logoPref: LogoPreference;
  onTriggerAgent?: (exchange: AssetExchange) => void;
  currentUser?: User | null;
}

const InventoryTable: React.FC<InventoryTableProps> = ({ exchanges, onDelete, onEdit, onNotify, onSignStart, onStatusChange, onCompleteRequest, onBulkImport, logoPref, onTriggerAgent, currentUser }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isSendingEmail, setIsSendingEmail] = useState<string | null>(null);
  const [isSendingDocuSign, setIsSendingDocuSign] = useState<string | null>(null);
  const [isRestoring, setIsRestoring] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Verificação estrita de autorização: SOMENTE gibasuporte@gmail.com pode gravar/editar/excluir dados
  const isMasterAuthorized = useMemo(() => {
    if (!currentUser || !currentUser.email) return false;
    const email = currentUser.email.toLowerCase().trim();
    return email === 'gibasuporte@gmail.com' || email === 'gilberto.araujo.ext@ciriontechnologies.com';
  }, [currentUser]);

  const handleRestoreBaselineClick = async () => {
    if (!isMasterAuthorized) {
      onNotify("Ação Bloqueada: A base de dados está blindada. Somente o administrador autorizado (gibasuporte@gmail.com) possui permissão de gravação e restauração.", "error");
      return;
    }
    setIsRestoring(true);
    try {
      const restored = await apiService.restoreBaselineExchanges();
      onNotify(`Base histórica restaurada com sucesso! ${restored.length} registros disponíveis.`, "success");
    } catch (err: any) {
      onNotify("Erro ao restaurar base: " + (err.message || err), "error");
    } finally {
      setIsRestoring(false);
    }
  };

  const handleDownloadForManualSend = async (ex: AssetExchange) => {
    if (!ex.assinatura_ti) {
      onNotify("Você precisa assinar o termo antes de enviar!", "error");
      onEdit(ex); // Abre o editor para o TI assinar
      return;
    }

    setIsSendingEmail(ex.id);
    try {
      const pdf = generateAssetPDF(ex, logoPref);
      if (!pdf) throw new Error("Falha ao gerar PDF");
      
      const fileName = getPDFFileName(ex);
      pdf.save(fileName);
      onNotify("PDF baixado! Agora você pode enviá-lo manualmente pelo seu Outlook.", "success");
    } catch (error: any) {
      onNotify(error.message || "Erro ao gerar PDF", "error");
    } finally {
      setIsSendingEmail(null);
    }
  };

  const handleSendDocuSignAutomatic = async (ex: AssetExchange) => {
    if (!ex.assinatura_ti) {
      onNotify("Você precisa assinar o termo antes de enviar!", "error");
      onEdit(ex); // Abre o editor para o TI assinar
      return;
    }

    setIsSendingDocuSign(ex.id);
    try {
      onNotify("Gerando o termo em PDF para o DocuSign...", "success");
      const pdf = generateAssetPDF(ex, logoPref);
      if (!pdf) throw new Error("Falha ao gerar PDF");

      const pdfBase64 = pdf.output('datauristring');

      onNotify("Disparando assinatura automatizada (script Python)...", "success");
      const res = await apiService.createDocuSignEnvelope(ex, pdfBase64);

      const envelopeId = res.envelopeId || res.envelope_id;

      if (envelopeId) {
        // Se houver e-mail simulado retornado do backend, salva via cliente para evitar erros de permissão de backend
        if (res.mockEmail) {
          try {
            await apiService.saveEmail(res.mockEmail);
            console.log("[DocuSign Client - Inventory] E-mail simulado salvo no Firestore com permissões de cliente.");
          } catch (emailErr) {
            console.error("[DocuSign Client - Inventory] Erro ao registrar e-mail simulado no cliente:", emailErr);
          }
        }

        const updatedExchange: AssetExchange = {
          ...ex,
          status: 'pending_receiver',
          docusign_status: 'pending',
          docusign_envelope_id: envelopeId,
          docusign_file_path: res.message?.includes('Simulado') ? 'Simulado via OneDrive' : undefined
        };

        await apiService.save(updatedExchange);
        onNotify(`DocuSign enviado via automação! ID: ${envelopeId}`, "success");
      } else {
        throw new Error(res.message || "Não foi possível obter o ID do envelope.");
      }
    } catch (error: any) {
      console.error(error);
      onNotify(error.message || "Erro no envio rápido do DocuSign", "error");
    } finally {
      setIsSendingDocuSign(null);
    }
  };

  const handleDocuSignClick = () => {
    window.open("https://apps.docusign.com/send/home", "_blank");
  };

  const filtered = useMemo(() => {
    const clean = searchTerm.trim();
    if (!clean) return exchanges;

    const normQuery = normalizeText(clean);
    const tokens = normQuery.split(/\s+/).filter(Boolean);

    return exchanges.filter(e => {
      const nome = normalizeText(e.colaborador_nome || '');
      const email = normalizeText(e.colaborador_email || '');
      const sEnt = normalizeText(e.entregue_serial || '');
      const sDev = normalizeText(e.devolvido_serial || '');
      const modEnt = normalizeText(e.entregue_modelo || '');
      const modDev = normalizeText(e.devolvido_modelo || '');
      const id = normalizeText(e.id || '');

      return tokens.every(tok => 
        nome.includes(tok) || 
        email.includes(tok) || 
        sEnt.includes(tok) || 
        sDev.includes(tok) || 
        modEnt.includes(tok) || 
        modDev.includes(tok) || 
        id.includes(tok)
      );
    });
  }, [exchanges, searchTerm]);

  const handleImportClick = () => {
    if (!isMasterAuthorized) {
      onNotify("Ação Bloqueada: A base de dados está blindada. Somente o administrador autorizado (gibasuporte@gmail.com) possui permissão para importar ativos.", "error");
      return;
    }
    fileInputRef.current?.click();
  };

  const handleEditClick = (ex: AssetExchange) => {
    if (!isMasterAuthorized) {
      onNotify("Ação Bloqueada: A base de dados está blindada. Somente o administrador autorizado (gibasuporte@gmail.com) possui permissão para editar ativos.", "error");
      return;
    }
    onEdit(ex);
  };

  const handleDeleteClick = (id: string) => {
    if (!isMasterAuthorized) {
      onNotify("Ação Bloqueada: A base de dados está blindada. Somente o administrador autorizado (gibasuporte@gmail.com) possui permissão para excluir ativos.", "error");
      return;
    }
    onDelete(id);
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const data = await importFromExcel(file);
      onBulkImport(data);
      onNotify("Base sincronizada!", "success");
    } catch (err) {
      onNotify("Erro no Excel.", "error");
    }
  };

  const handleExportClick = () => {
    try {
      if (!exchanges || exchanges.length === 0) {
        onNotify("Não há registros de ativos para exportar.", "error");
        return;
      }
      exportToExcel(exchanges);
      onNotify("Planilha exportada com sucesso!", "success");
    } catch (error: any) {
      console.error("Erro ao gerar Excel:", error);
      onNotify(`Erro ao exportar Excel: ${error.message || error}`, "error");
    }
  };

  const getIcon = (type?: string) => {
    if (!type) return <Cpu size={14} />;
    const t = String(type).toLowerCase();
    if (t.includes('note') || t.includes('lap')) return <Laptop size={14} />;
    if (t.includes('smart') || t.includes('cel') || t.includes('phone')) return <Smartphone size={14} />;
    return <Cpu size={14} />;
  };

  return (
    <div className="flex flex-col h-full bg-white dark:bg-dracula-darker transition-colors duration-200">
      
      {/* Search and Action Bar - Mobile Optimized */}
      <div className="p-4 md:p-6 border-b dark:border-dracula-current flex flex-col gap-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            placeholder="Buscar por colaborador, e-mail, número de série, modelo..."
            className="w-full pl-10 pr-10 py-3 rounded-2xl border bg-slate-50 dark:bg-dracula-bg dark:text-dracula-fg text-sm outline-none focus:ring-2 ring-dracula-purple/30"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
          {searchTerm && (
            <button 
              type="button"
              onClick={() => setSearchTerm('')} 
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 rounded-full hover:bg-slate-200 dark:hover:bg-dracula-current transition-colors"
              title="Limpar busca"
            >
              <X size={16} />
            </button>
          )}
        </div>
        
        <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
          <input type="file" ref={fileInputRef} onChange={handleFileChange} accept=".xlsx, .xls" className="hidden" />
          <button onClick={handleImportClick} className="flex items-center gap-2 bg-slate-100 dark:bg-dracula-bg px-4 py-2.5 rounded-xl font-bold text-xs whitespace-nowrap"><Upload size={14}/> Importar</button>
          <button onClick={handleExportClick} className="flex items-center gap-2 bg-emerald-600 text-white px-4 py-2.5 rounded-xl font-bold text-xs whitespace-nowrap"><FileSpreadsheet size={14}/> Excel</button>
          <button onClick={handleDocuSignClick} className="flex items-center gap-2 bg-dracula-pink/10 text-dracula-pink px-4 py-2.5 rounded-xl font-bold text-xs whitespace-nowrap border border-dracula-pink/20"><ExternalLink size={14}/> Abrir DocuSign</button>
          <a 
            href="https://xyzlatam.sharepoint.com/:f:/r/sites/LATAMEndUserServices-EndUserSupportBrasil/Documentos%20compartidos/End%20User%20Support%20Brasil/10%20-%20Gilberto/Cartas%20Firmadas?d=wb491a040d8ea487ebe845ef068cb5498&csf=1&web=1&e=GkwfNQ"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 bg-[#003087] hover:bg-[#002266] text-white px-4 py-2.5 rounded-xl font-bold text-xs whitespace-nowrap shadow-sm transition-all"
            title="Abrir pasta de arquivamento oficial no SharePoint / OneDrive (https://xyzlatam.sharepoint.com/:f:/r/sites/LATAMEndUserServices-EndUserSupportBrasil/Documentos%20compartidos/End%20User%20Support%20Brasil/10%20-%20Gilberto/Cartas%20Firmadas?d=wb491a040d8ea487ebe845ef068cb5498&csf=1&web=1&e=GkwfNQ)"
          >
            <FolderCheck size={14} className="text-cyan-300" /> Pasta SharePoint / OneDrive
          </a>
          <button onClick={handleRestoreBaselineClick} disabled={isRestoring} className="flex items-center gap-2 bg-blue-50 hover:bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:hover:bg-blue-900/50 dark:text-blue-300 px-4 py-2.5 rounded-xl font-bold text-xs whitespace-nowrap border border-blue-200 dark:border-blue-800 transition-colors">
            {isRestoring ? <Loader2 size={14} className="animate-spin" /> : <RotateCcw size={14}/>} Restaurar Dados Anteriores
          </button>
          <div 
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-purple-500/10 border border-purple-500/30 text-purple-700 dark:text-purple-300 font-bold text-xs whitespace-nowrap shadow-sm"
            title="Base de Dados Blindada: Apenas gibasuporte@gmail.com possui permissão de escrita e edição"
          >
            <ShieldCheck size={14} className="text-purple-600 dark:text-purple-400" />
            <span>Base Blindada: gibasuporte@gmail.com</span>
          </div>
          <div className="ml-auto flex items-center px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-dracula-bg text-slate-600 dark:text-dracula-comment text-xs font-semibold whitespace-nowrap">
            {filtered.length} {filtered.length === 1 ? 'ativo' : 'ativos'} {searchTerm && `(de ${exchanges.length})`}
          </div>
        </div>

        {/* Banner Informativo sobre a Automação e Assinatura Digital DocuSign e Gravação no SharePoint */}
        <div className="bg-gradient-to-r from-blue-500/10 via-indigo-500/10 to-dracula-purple/10 border border-indigo-500/30 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-sm">
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-md shadow-blue-500/20">
              <Bot size={20} className="text-cyan-200" />
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h4 className="text-xs font-black text-slate-800 dark:text-dracula-fg uppercase tracking-wider">
                  Fluxo Obrigatório: DocuSign • Outlook • Arquivamento no SharePoint
                </h4>
                <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-indigo-100 text-indigo-700 dark:bg-indigo-900/60 dark:text-indigo-300">
                  Agente Ativo
                </span>
              </div>
              <p className="text-[11px] text-slate-600 dark:text-dracula-comment leading-relaxed">
                Ao clicar em <em>"Gravar e enviar para DocuSign"</em>: <strong>(1)</strong> Envio para DocuSign com chancela do remetente TI; <strong>(2)</strong> Destinatário recebe notificação no Outlook e assina digitalmente; <strong>(3)</strong> Retorno e gravação automática do termo assinado na pasta oficial do SharePoint (<a href="https://xyzlatam.sharepoint.com/:f:/r/sites/LATAMEndUserServices-EndUserSupportBrasil/Documentos%20compartidos/End%20User%20Support%20Brasil/10%20-%20Gilberto/Cartas%20Firmadas?d=wb491a040d8ea487ebe845ef068cb5498&csf=1&web=1&e=GkwfNQ" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-cyan-400 font-semibold underline underline-offset-2">https://xyzlatam.sharepoint.com/:f:/r/sites/LATAMEndUserServices-EndUserSupportBrasil/Documentos%20compartidos/End%20User%20Support%20Brasil/10%20-%20Gilberto/Cartas%20Firmadas?d=wb491a040d8ea487ebe845ef068cb5498&csf=1&web=1&e=GkwfNQ</a>) com notificação de conclusão para ambas as partes.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-x-auto relative">
        <table className="w-full text-left min-w-[900px]">
          <thead className="bg-slate-50 dark:bg-dracula-darker sticky top-0 z-10 border-b dark:border-dracula-current">
            <tr>
              <th className="px-6 py-4 text-[10px] font-bold uppercase text-slate-400">Colaborador</th>
              <th className="px-6 py-4 text-[10px] font-bold uppercase text-slate-400">Entregue</th>
              <th className="px-6 py-4 text-[10px] font-bold uppercase text-slate-400">Devolvido</th>
              <th className="px-6 py-4 text-[10px] font-bold uppercase text-slate-400 text-center">Status</th>
              <th className="px-6 py-4 text-[10px] font-bold uppercase text-slate-400 text-center">SharePoint / OneDrive</th>
              <th className="px-6 py-4 text-[10px] font-bold uppercase text-slate-400 text-right">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y dark:divide-dracula-current">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-16 text-center">
                  <div className="flex flex-col items-center justify-center max-w-md mx-auto space-y-3">
                    <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-dracula-bg flex items-center justify-center text-slate-400">
                      <Search size={22} />
                    </div>
                    <div className="space-y-1">
                      <p className="font-bold text-slate-700 dark:text-dracula-fg text-sm">
                        {searchTerm ? 'Nenhum ativo encontrado para essa busca' : 'Nenhum ativo registrado no inventário'}
                      </p>
                      <p className="text-xs text-slate-400">
                        {searchTerm ? 'Verifique os termos pesquisados ou limpe o filtro.' : 'Cadastre um novo termo no menu "Nova Troca".'}
                      </p>
                    </div>
                    {searchTerm && (
                      <button
                        type="button"
                        onClick={() => setSearchTerm('')}
                        className="text-xs text-blue-600 dark:text-blue-400 font-bold hover:underline cursor-pointer"
                      >
                        Limpar busca
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ) : (
              filtered.map(ex => (
              <tr key={ex.id} className="hover:bg-slate-50/50 dark:hover:bg-dracula-bg/50 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2.5">
                    <UserAvatar name={ex.colaborador_nome} email={ex.colaborador_email} size="sm" showM365Badge={true} />
                    <div className="min-w-0">
                      <div className="font-bold text-sm truncate max-w-[200px]">{ex.colaborador_nome}</div>
                      <div className="text-[10px] text-slate-400 truncate max-w-[200px]">{ex.colaborador_email}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  {ex.entregue_tipo || ex.entregue_serial ? (
                    <div className="flex flex-col gap-1">
                      <span className="text-[9px] font-bold text-emerald-600 flex items-center gap-1">
                        {getIcon(ex.entregue_tipo)} {ex.entregue_tipo || 'Equipamento'}
                      </span>
                      {ex.entregue_serial && (
                        <div className="px-2 py-0.5 bg-blue-50 dark:bg-dracula-cyan/10 border border-blue-100 dark:border-dracula-cyan/20 rounded-md inline-block w-fit">
                          <span className="text-[9px] font-mono font-bold text-blue-700 dark:text-dracula-cyan">{ex.entregue_serial}</span>
                        </div>
                      )}
                    </div>
                  ) : (
                    <span className="text-[10px] text-slate-400 italic">N/A</span>
                  )}
                </td>
                <td className="px-6 py-4">
                  {ex.devolvido_tipo || ex.devolvido_serial ? (
                    <div className="flex flex-col gap-1">
                      <span className="text-[9px] font-bold text-rose-600 flex items-center gap-1">
                        {getIcon(ex.devolvido_tipo)} {ex.devolvido_tipo || 'Equipamento'}
                      </span>
                      {ex.devolvido_serial && (
                        <div className="px-2 py-0.5 bg-rose-50 dark:bg-dracula-red/10 border border-rose-100 dark:border-dracula-red/20 rounded-md inline-block w-fit">
                          <span className="text-[9px] font-mono font-bold text-rose-700 dark:text-dracula-red">{ex.devolvido_serial}</span>
                        </div>
                      )}
                    </div>
                  ) : (
                    <span className="text-[10px] text-slate-400 italic">N/A</span>
                  )}
                </td>
                <td className="px-6 py-4 text-center">
                  <StatusBadge exchange={ex} onClick={() => {
                    const doc = generateAssetPDF(ex, logoPref);
                    if (doc) {
                      const blobUrl = doc.output('bloburl');
                      window.open(blobUrl, '_blank');
                    }
                  }} />
                </td>
                <td className="px-6 py-4 text-center">
                  {ex.status === 'completed' ? (
                    <a
                      href={ex.sharepoint_onedrive_url || "https://xyzlatam.sharepoint.com/:f:/r/sites/LATAMEndUserServices-EndUserSupportBrasil/Documentos%20compartidos/End%20User%20Support%20Brasil/10%20-%20Gilberto/Cartas%20Firmadas?d=wb491a040d8ea487ebe845ef068cb5498&csf=1&web=1&e=GkwfNQ"}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[10px] font-bold bg-blue-50 text-[#003087] hover:bg-blue-100 dark:bg-blue-900/30 dark:text-blue-300 dark:hover:bg-blue-900/50 border border-blue-200 dark:border-blue-800/60 transition-all shadow-xs group"
                      title="Abrir pasta no SharePoint / OneDrive: https://xyzlatam.sharepoint.com/:f:/r/sites/LATAMEndUserServices-EndUserSupportBrasil/Documentos%20compartidos/End%20User%20Support%20Brasil/10%20-%20Gilberto/Cartas%20Firmadas?d=wb491a040d8ea487ebe845ef068cb5498&csf=1&web=1&e=GkwfNQ"
                    >
                      <FolderCheck size={13} className="text-blue-600 dark:text-blue-400 group-hover:scale-110 transition-transform" />
                      <span>Arquivado</span>
                      <ExternalLink size={10} className="opacity-60" />
                    </a>
                  ) : ex.status === 'pending_receiver' ? (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl text-[10px] font-semibold bg-amber-50 text-amber-700 dark:bg-amber-900/20 dark:text-amber-300 border border-amber-200 dark:border-amber-800/40" title="Aguardando assinatura do destinatário no Outlook para arquivamento no SharePoint">
                      <Clock size={11} /> Aguardando Assinatura
                    </span>
                  ) : (
                    <span className="text-[10px] text-slate-400 dark:text-dracula-comment italic">
                      Pendente Envio
                    </span>
                  )}
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex justify-end gap-1">
                    {ex.status === 'completed' && (
                      <>
                        <a 
                          href={ex.sharepoint_onedrive_url || "https://xyzlatam.sharepoint.com/:f:/r/sites/LATAMEndUserServices-EndUserSupportBrasil/Documentos%20compartidos/End%20User%20Support%20Brasil/10%20-%20Gilberto/Cartas%20Firmadas?d=wb491a040d8ea487ebe845ef068cb5498&csf=1&web=1&e=GkwfNQ"}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-500/10 rounded-lg transition-colors"
                          title="Abrir no SharePoint / OneDrive (https://xyzlatam.sharepoint.com/:f:/r/sites/LATAMEndUserServices-EndUserSupportBrasil/Documentos%20compartidos/End%20User%20Support%20Brasil/10%20-%20Gilberto/Cartas%20Firmadas?d=wb491a040d8ea487ebe845ef068cb5498&csf=1&web=1&e=GkwfNQ)"
                        >
                          <ExternalLink size={16}/>
                        </a>
                        <button 
                          onClick={() => {
                            const doc = generateAssetPDF(ex, logoPref);
                            if (doc) doc.save(getPDFFileName(ex));
                          }} 
                          className="p-2 text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-500/10 rounded-lg transition-colors"
                          title="Baixar Termo Assinado (PDF)"
                        >
                          <Download size={16}/>
                        </button>
                      </>
                    )}
                    {ex.status === 'draft' && (
                      <>
                        <button 
                          onClick={() => onTriggerAgent ? onTriggerAgent(ex) : handleSendDocuSignAutomatic(ex)} 
                          disabled={isSendingDocuSign === ex.id}
                          className="p-2 text-blue-600 dark:text-blue-400 hover:bg-blue-100/70 dark:hover:bg-blue-900/40 rounded-lg transition-all border border-blue-200/80 dark:border-blue-800/60 shadow-xs"
                          title="Enviar para Assinatura Digital DocuSign (Agente Autônomo & Outlook)"
                        >
                          {isSendingDocuSign === ex.id ? <Loader2 size={16} className="animate-spin" /> : <Bot size={16} className="text-blue-600 dark:text-cyan-400" />}
                        </button>
                        <button 
                          onClick={() => handleDownloadForManualSend(ex)} 
                          disabled={isSendingEmail === ex.id}
                          className="p-2 text-dracula-pink hover:bg-dracula-pink/10 rounded-lg transition-colors"
                          title="DocuSign Manual (Baixar PDF)"
                        >
                          {isSendingEmail === ex.id ? <Loader2 size={16} className="animate-spin" /> : <FileText size={16}/>}
                        </button>
                        <button onClick={() => onSignStart(ex)} className="p-2 text-blue-600" title="Assinar como Colaborador"><Mail size={16}/></button>
                      </>
                    )}
                    {ex.status !== 'completed' && (
                      <button 
                        onClick={() => onCompleteRequest(ex.id)}
                        className="p-2 text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-500/10 rounded-lg transition-colors"
                        title="Concluir Manualmente"
                      >
                        <FileCheck size={16} />
                      </button>
                    )}
                    <button onClick={() => handleEditClick(ex)} className="p-2 text-slate-400 hover:text-blue-500 transition-colors" title="Editar Ativo"><Pencil size={16}/></button>
                    <button onClick={() => handleDeleteClick(ex.id)} className="p-2 text-rose-500 hover:text-rose-600 transition-colors" title="Excluir Ativo"><Trash2 size={16}/></button>
                  </div>
                </td>
              </tr>
            )))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const StatusBadge = ({ exchange, onClick }: { exchange: AssetExchange, onClick: () => void }) => {
  if (!exchange) return null;
  const { status, docusign_status: docusignStatus, devolucao_sem_termo, tipo_coleta } = exchange;

  if (status === 'completed') {
    if (devolucao_sem_termo) {
      const label = `COLETA RESIDENCIAL (${tipo_coleta ? tipo_coleta.toUpperCase() : 'MOTOBOY'})`;
      return (
        <button 
          onClick={onClick} 
          className="text-[9px] font-bold bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300 px-3 py-1.5 rounded-full border border-amber-300 hover:bg-amber-200 transition-colors flex items-center gap-1 mx-auto"
          title="Clique para visualizar o comprovante de recebimento (Devolução sem termo assinado)"
        >
          <Truck size={12} /> {label}
        </button>
      );
    }
    return (
      <button 
        onClick={onClick} 
        className="text-[9px] font-bold bg-emerald-100 text-emerald-700 px-3 py-1.5 rounded-full border border-emerald-200 hover:bg-emerald-200 transition-colors flex items-center gap-1 mx-auto"
        title="Clique para baixar o documento assinado"
      >
        <FileCheck size={12} /> ASSINADO
      </button>
    );
  }

  if (docusignStatus === 'pending') return (
    <span className="text-[9px] font-bold bg-amber-100 text-amber-700 px-3 py-1.5 rounded-full border border-amber-200 flex items-center gap-1 justify-center">
      <Clock size={12} /> AGUARDANDO ASSINATURA
    </span>
  );

  if (docusignStatus === 'declined' || docusignStatus === 'voided') return (
    <span className="text-[9px] font-bold bg-rose-100 text-rose-700 px-3 py-1.5 rounded-full border border-rose-200 flex items-center gap-1 justify-center">
      <Lock size={12} /> RECUSADO/CANCELADO
    </span>
  );

  if (status === 'pending_receiver') return <span className="text-[9px] font-bold bg-blue-100 text-blue-700 px-3 py-1.5 rounded-full border border-blue-200">PENDENTE</span>;
  return <span className="text-[9px] font-bold bg-slate-100 text-slate-500 px-3 py-1.5 rounded-full border border-slate-200">RASCUNHO</span>;
};

export default InventoryTable;
