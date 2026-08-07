
import React, { useState, useRef } from 'react';
import { AssetExchange, LogoPreference } from '../types';
import { FileDown, Trash2, Search, FileSpreadsheet, Pencil, Mail, Laptop, Smartphone, Cpu, Clock, Lock, FileCheck, Upload, Fingerprint, Filter, Download, Loader2, Send, FileText, ExternalLink, Truck } from 'lucide-react';
import { generateAssetPDF, getPDFFileName } from '../services/pdfService';
import { exportToExcel, importFromExcel } from '../services/excelService';
import { apiService } from '../services/apiService';

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
}

const InventoryTable: React.FC<InventoryTableProps> = ({ exchanges, onDelete, onEdit, onNotify, onSignStart, onStatusChange, onCompleteRequest, onBulkImport, logoPref }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isSendingEmail, setIsSendingEmail] = useState<string | null>(null);
  const [isSendingDocuSign, setIsSendingDocuSign] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  const filtered = exchanges.filter(e => 
    e.colaborador_nome.toLowerCase().includes(searchTerm.toLowerCase()) || 
    e.entregue_serial.toLowerCase().includes(searchTerm.toLowerCase()) ||
    e.devolvido_serial.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleImportClick = () => fileInputRef.current?.click();

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

  const getIcon = (type: string) => {
    const t = type.toLowerCase();
    if (t.includes('note')) return <Laptop size={14} />;
    if (t.includes('smart')) return <Smartphone size={14} />;
    return <Cpu size={14} />;
  };

  return (
    <div className="flex flex-col h-full bg-white dark:bg-dracula-darker transition-colors duration-200">
      
      {/* Search and Action Bar - Mobile Optimized */}
      <div className="p-4 md:p-6 border-b dark:border-dracula-current flex flex-col gap-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            placeholder="Buscar..."
            className="w-full pl-10 pr-4 py-3 rounded-2xl border bg-slate-50 dark:bg-dracula-bg dark:text-dracula-fg text-sm outline-none focus:ring-2 ring-dracula-purple/30"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
          <input type="file" ref={fileInputRef} onChange={handleFileChange} accept=".xlsx, .xls" className="hidden" />
          <button onClick={handleImportClick} className="flex items-center gap-2 bg-slate-100 dark:bg-dracula-bg px-4 py-2.5 rounded-xl font-bold text-xs whitespace-nowrap"><Upload size={14}/> Importar</button>
          <button onClick={handleExportClick} className="flex items-center gap-2 bg-emerald-600 text-white px-4 py-2.5 rounded-xl font-bold text-xs whitespace-nowrap"><FileSpreadsheet size={14}/> Excel</button>
          <button onClick={handleDocuSignClick} className="flex items-center gap-2 bg-dracula-pink/10 text-dracula-pink px-4 py-2.5 rounded-xl font-bold text-xs whitespace-nowrap border border-dracula-pink/20"><ExternalLink size={14}/> Abrir DocuSign</button>
          <button className="flex items-center gap-2 bg-slate-100 dark:bg-dracula-bg px-4 py-2.5 rounded-xl font-bold text-xs whitespace-nowrap"><Filter size={14}/> Filtros</button>
        </div>

        {/* Banner Informativo sobre a Automação do DocuSign Python */}
        <div className="bg-dracula-purple/5 border border-dracula-purple/20 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-start gap-3">
            <Fingerprint className="text-dracula-purple shrink-0 mt-0.5" size={20} />
            <div className="space-y-1">
              <h4 className="text-xs font-bold text-slate-800 dark:text-dracula-fg">Automação de Assinatura via Python (DocuSign API)</h4>
              <p className="text-[11px] text-slate-500 dark:text-dracula-comment leading-relaxed">
                O envio automático é feito individualmente para cada registro de ativo no status <strong className="text-slate-700 dark:text-dracula-fg uppercase tracking-wider text-[9px] px-1.5 py-0.5 rounded bg-slate-100 dark:bg-dracula-bg">'Rascunho'</strong>. Procure pelo ícone de biometria <strong className="text-dracula-purple font-black">🟣 <Fingerprint className="inline" size={14} /></strong> na coluna de <strong>Ações</strong> na tabela de registros abaixo.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-x-auto relative">
        <table className="w-full text-left min-w-[800px]">
          <thead className="bg-slate-50 dark:bg-dracula-darker sticky top-0 z-10 border-b dark:border-dracula-current">
            <tr>
              <th className="px-6 py-4 text-[10px] font-bold uppercase text-slate-400">Colaborador</th>
              <th className="px-6 py-4 text-[10px] font-bold uppercase text-slate-400">Entregue</th>
              <th className="px-6 py-4 text-[10px] font-bold uppercase text-slate-400">Devolvido</th>
              <th className="px-6 py-4 text-[10px] font-bold uppercase text-slate-400 text-center">Status</th>
              <th className="px-6 py-4 text-[10px] font-bold uppercase text-slate-400 text-right">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y dark:divide-dracula-current">
            {filtered.map(ex => (
              <tr key={ex.id} className="hover:bg-slate-50/50 dark:hover:bg-dracula-bg/50 transition-colors">
                <td className="px-6 py-4">
                  <div className="font-bold text-sm">{ex.colaborador_nome}</div>
                  <div className="text-[10px] text-slate-400 truncate max-w-[120px]">{ex.colaborador_email}</div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex flex-col gap-1">
                    <span className="text-[9px] font-bold text-emerald-600 flex items-center gap-1">{getIcon(ex.entregue_tipo)} {ex.entregue_tipo}</span>
                    <div className="px-2 py-0.5 bg-blue-50 dark:bg-dracula-cyan/10 border border-blue-100 dark:border-dracula-cyan/20 rounded-md inline-block">
                      <span className="text-[9px] font-mono font-bold text-blue-700 dark:text-dracula-cyan">{ex.entregue_serial}</span>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex flex-col gap-1">
                    <span className="text-[9px] font-bold text-rose-600 flex items-center gap-1">{getIcon(ex.devolvido_tipo)} {ex.devolvido_tipo}</span>
                    <div className="px-2 py-0.5 bg-rose-50 dark:bg-dracula-red/10 border border-rose-100 dark:border-dracula-red/20 rounded-md inline-block">
                      <span className="text-[9px] font-mono font-bold text-rose-700 dark:text-dracula-red">{ex.devolvido_serial}</span>
                    </div>
                  </div>
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
                <td className="px-6 py-4 text-right">
                  <div className="flex justify-end gap-1">
                    {ex.status === 'completed' && (
                      <button 
                        onClick={() => {
                          const doc = generateAssetPDF(ex, logoPref);
                          if (doc) doc.save(getPDFFileName(ex));
                        }} 
                        className="p-2 text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-500/10 rounded-lg transition-colors"
                        title="Baixar Termo Assinado"
                      >
                        <Download size={16}/>
                      </button>
                    )}
                    {ex.status === 'draft' && (
                      <>
                        <button 
                          onClick={() => handleSendDocuSignAutomatic(ex)} 
                          disabled={isSendingDocuSign === ex.id}
                          className="p-2 text-dracula-purple hover:bg-dracula-purple/10 rounded-lg transition-colors"
                          title="DocuSign Automático (Executar Script Python)"
                        >
                          {isSendingDocuSign === ex.id ? <Loader2 size={16} className="animate-spin" /> : <Fingerprint size={16} />}
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
                    <button onClick={() => onEdit(ex)} className="p-2 text-slate-400"><Pencil size={16}/></button>
                    <button onClick={() => onDelete(ex.id)} className="p-2 text-rose-500"><Trash2 size={16}/></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const StatusBadge = ({ exchange, onClick }: { exchange: AssetExchange, onClick: () => void }) => {
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
