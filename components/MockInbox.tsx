
import React, { useState, useEffect } from 'react';
import { MockEmail, AssetExchange, LogoPreference, EquipmentCondition } from '../types';
import { Mail, Paperclip, PenLine, ChevronLeft, FileDown, CheckCircle2, ExternalLink, Sparkles, FileText, Trash2, ShieldAlert, Lock, X } from 'lucide-react';
import { generateAssetPDF, getPDFFileName } from '../services/pdfService';
import { apiService } from '../services/apiService';

interface MockInboxProps {
  emails: MockEmail[];
  exchanges: AssetExchange[];
  onUpdateEmails: (emails: MockEmail[]) => void;
  onOpenPortal: (exchange: AssetExchange) => void;
  logoPref: LogoPreference;
  onNotify?: (message: string, type: 'success' | 'error') => void;
}

const MockInbox: React.FC<MockInboxProps> = ({ emails, onUpdateEmails, exchanges, onOpenPortal, logoPref, onNotify }) => {
  const [selectedId, setSelectedId] = useState<string | null>(emails[0]?.id || null);
  const [viewMode, setViewMode] = useState<'text' | 'html'>('text');

  // Modal para confirmação e senha do administrador
  const [isClearModalOpen, setIsClearModalOpen] = useState(false);
  const [adminPassword, setAdminPassword] = useState('');
  const [isClearing, setIsClearing] = useState(false);
  const [passwordError, setPasswordError] = useState<string | null>(null);

  // Mantém um e-mail selecionado caso a lista mude
  useEffect(() => {
    if (!selectedId && emails.length > 0) {
      setSelectedId(emails[0].id);
    } else if (emails.length === 0) {
      setSelectedId(null);
    }
  }, [emails, selectedId]);

  const selectedEmail = emails.find(e => e.id === selectedId) || emails[0];
  
  // Procura o termo correspondente por ID ou por Envelope ID
  const currentExchange = exchanges.find(ex => 
    (selectedEmail?.exchangeId && String(ex.id) === String(selectedEmail.exchangeId)) ||
    (selectedEmail?.envelopeId && ex.docusign_envelope_id === selectedEmail.envelopeId)
  );

  const markAsRead = (id: string) => {
    onUpdateEmails(emails.map(e => e.id === id ? { ...e, read: true } : e));
    setSelectedId(id);
  };

  const handleClearInbox = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError(null);

    if (!adminPassword.trim()) {
      setPasswordError('Por favor, digite a senha do administrador.');
      return;
    }

    const expectedGatePassword = import.meta.env.VITE_GATE_PASSWORD || 'IncluirUsuario';
    const expectedDeleteKeyword = import.meta.env.VITE_DELETE_KEYWORD || 'excluiragora';

    // Validação de senha no cliente
    if (adminPassword !== expectedGatePassword && adminPassword !== expectedDeleteKeyword) {
      setPasswordError('Senha de administrador incorreta.');
      return;
    }

    setIsClearing(true);
    try {
      await apiService.clearAllEmails(adminPassword);
      onUpdateEmails([]);
      setSelectedId(null);
      setIsClearModalOpen(false);
      setAdminPassword('');
      if (onNotify) {
        onNotify('Caixa de entrada do Outlook limpa com sucesso.', 'success');
      }
    } catch (err: any) {
      console.error('Erro ao limpar emails:', err);
      setPasswordError(err.message || 'Erro ao limpar mensagens. Verifique a senha informada.');
    } finally {
      setIsClearing(false);
    }
  };

  if (emails.length === 0) {
    return (
      <div className="p-20 flex flex-col items-center justify-center text-center h-[500px] bg-white dark:bg-dracula-bg rounded-[2.5rem]">
        <div className="w-16 h-16 bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 rounded-3xl flex items-center justify-center mb-4 shadow-inner">
          <Mail size={32} />
        </div>
        <h3 className="font-bold text-lg text-slate-800 dark:text-slate-200">Caixa de Entrada Vazia</h3>
        <p className="text-xs text-slate-400 mt-1 max-w-sm leading-relaxed">
          Nenhuma mensagem de teste ou notificação pendente no momento. Novos despachos do DocuSign e notificações de termos aparecerão aqui.
        </p>
      </div>
    );
  }

  // Verifica se este e-mail é uma solicitação de assinatura pendente
  const isCompleted = currentExchange?.status === 'completed' || Boolean(currentExchange?.assinatura_colaborador);
  const isSignatureRequest = 
    Boolean(selectedEmail?.envelopeId) || 
    Boolean(selectedEmail?.signingUrl) || 
    selectedEmail?.subject?.toLowerCase().includes('assinatura') || 
    currentExchange?.status === 'pending_receiver' ||
    Boolean(currentExchange?.assinatura_ti && !currentExchange?.assinatura_colaborador);

  const canSign = isSignatureRequest && !isCompleted;

  const handleOpenSignature = async () => {
    if (currentExchange) {
      onOpenPortal(currentExchange);
      return;
    }

    // Se o termo ainda não foi carregado na memória, tenta buscar do backend
    if (selectedEmail?.exchangeId || selectedEmail?.envelopeId) {
      try {
        const identifier = selectedEmail.exchangeId || selectedEmail.envelopeId;
        const fetched = await apiService.getExchangeById(identifier);
        if (fetched) {
          onOpenPortal(fetched);
          return;
        }
      } catch (e) {
        console.warn('Erro ao buscar exchange:', e);
      }
    }

    // Fallback: Constrói objeto consistente a partir das informações do e-mail
    const fallbackExchange: AssetExchange = {
      id: selectedEmail?.exchangeId || `EX-${Date.now()}`,
      data_troca: new Date().toISOString().split('T')[0],
      colaborador_nome: selectedEmail?.to?.split('@')[0]?.replace(/\./g, ' ') || 'Colaborador',
      colaborador_email: selectedEmail?.to || '',
      operationType: 'delivery',
      entregue_tipo: 'Notebook',
      entregue_marca: 'Lenovo',
      entregue_modelo: 'ThinkPad',
      entregue_serial: 'Equipamento TI',
      entregue_processador: 'Intel Core i7',
      entregue_condicao: EquipmentCondition.NEW,
      entregue_memoria: '16GB',
      entregue_armazenamento: '512GB SSD',
      entregue_acessorios: ['Carregador USB-C', 'Mochila Corporativa'],
      entregue_observacoes: 'Entregue para atividades corporativas Cirion',
      devolvido_tipo: '',
      devolvido_marca: '',
      devolvido_modelo: '',
      devolvido_serial: '',
      devolvido_processador: '',
      devolvido_condicao: EquipmentCondition.USED,
      devolvido_memoria: '',
      devolvido_armazenamento: '',
      devolvido_acessorios: [],
      devolvido_observacoes: '',
      status: 'pending_receiver',
      docusign_envelope_id: selectedEmail?.envelopeId,
      timestamp: Date.now()
    };
    onOpenPortal(fallbackExchange);
  };

  return (
    <div className="flex h-[620px] lg:h-[720px] bg-white dark:bg-dracula-bg overflow-hidden relative rounded-[2.5rem]">
      
      {/* Painel Esquerdo: Lista de Mensagens */}
      <div className={`w-full lg:w-80 border-r border-slate-200 dark:border-dracula-current flex flex-col transition-all ${selectedId ? 'hidden lg:flex' : 'flex'}`}>
        <div className="p-4 bg-slate-50 dark:bg-dracula-darker border-b border-slate-200 dark:border-dracula-current flex items-center justify-between gap-2">
           <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5 min-w-0">
             <Mail size={13} className="text-blue-500 shrink-0" />
             <span className="truncate">Outlook • Cirion TI ({emails.length})</span>
           </div>
           
           <button
             type="button"
             onClick={() => {
               setPasswordError(null);
               setAdminPassword('');
               setIsClearModalOpen(true);
             }}
             className="px-2.5 py-1.5 bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/40 dark:hover:bg-rose-900/60 text-rose-600 dark:text-rose-400 border border-rose-200/60 dark:border-rose-900/50 rounded-xl text-[10px] font-bold flex items-center gap-1.5 transition-all shadow-xs shrink-0 cursor-pointer"
             title="Limpar mensagens de teste com senha do administrador"
           >
             <Trash2 size={12} />
             <span>Limpar</span>
           </button>
        </div>
        <div className="flex-1 overflow-y-auto">
          {emails.map(email => {
            const isEmailPending = email.envelopeId || email.subject?.toLowerCase().includes('assinatura');
            const isSelected = selectedEmail?.id === email.id;

            return (
              <div
                key={email.id}
                onClick={() => markAsRead(email.id)}
                className={`p-4 cursor-pointer border-b border-slate-100 dark:border-dracula-current transition-all ${isSelected ? 'bg-blue-50/80 dark:bg-dracula-current/80 border-l-4 border-l-blue-600' : 'hover:bg-slate-50 dark:hover:bg-white/5'}`}
              >
                <div className="flex justify-between items-start mb-1 gap-2">
                  <span className={`text-xs truncate ${!email.read ? 'font-bold text-slate-900 dark:text-white' : 'text-slate-500'}`}>
                    {email.from.split('<')[0]}
                  </span>
                  <div className="flex items-center gap-1.5 shrink-0">
                    {isEmailPending && (
                      <span className="w-2 h-2 rounded-full bg-amber-500" title="Assinatura Pendente" />
                    )}
                    {!email.read && <div className="w-2 h-2 bg-blue-600 rounded-full" />}
                  </div>
                </div>
                <h4 className="text-[11px] font-bold truncate text-slate-800 dark:text-slate-200">{email.subject}</h4>
                <p className="text-[10px] text-slate-400 truncate mt-1">{email.body.substring(0, 50)}...</p>
                
                {email.envelopeId && (
                  <div className="mt-2 flex items-center gap-1 text-[9px] font-mono text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/40 px-2 py-0.5 rounded-md w-fit">
                    <span>DocuSign:</span> <strong>{email.envelopeId}</strong>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Painel Direito: Detalhe do E-mail Selecionado */}
      <div className={`flex-1 flex flex-col bg-white dark:bg-dracula-bg ${!selectedId ? 'hidden lg:flex' : 'flex'}`}>
        {selectedEmail ? (
          <div className="flex flex-col h-full animate-in fade-in slide-in-from-right-4 duration-300">
            
            {/* Topbar do E-mail */}
            <div className="p-4 border-b border-slate-200 dark:border-dracula-current flex flex-wrap items-center justify-between gap-3 bg-slate-50/50 dark:bg-dracula-darker/50">
              <div className="flex items-center gap-3 min-w-0">
                <button onClick={() => setSelectedId(null)} className="lg:hidden p-2 bg-slate-100 dark:bg-slate-800 rounded-xl">
                  <ChevronLeft size={20} />
                </button>
                <div className="min-w-0">
                  <h2 className="font-bold text-sm lg:text-base text-slate-900 dark:text-white truncate">
                    {selectedEmail.subject}
                  </h2>
                  <div className="text-[10px] text-slate-400 truncate flex items-center gap-2 mt-0.5">
                    <span><strong>De:</strong> {selectedEmail.from}</span>
                    <span>•</span>
                    <span><strong>Para:</strong> {selectedEmail.to}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {selectedEmail.bodyHtml && (
                  <div className="flex items-center bg-slate-200 dark:bg-slate-800 p-0.5 rounded-xl text-[10px] font-bold">
                    <button
                      type="button"
                      onClick={() => setViewMode('text')}
                      className={`px-2.5 py-1 rounded-lg transition-colors ${viewMode === 'text' ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs' : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'}`}
                    >
                      Texto
                    </button>
                    <button
                      type="button"
                      onClick={() => setViewMode('html')}
                      className={`px-2.5 py-1 rounded-lg transition-colors flex items-center gap-1 ${viewMode === 'html' ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-xs' : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'}`}
                    >
                      <Sparkles size={11} /> HTML Oficial
                    </button>
                  </div>
                )}

                <a
                  href={`mailto:${encodeURIComponent(selectedEmail.to)}?subject=${encodeURIComponent(selectedEmail.subject)}&body=${encodeURIComponent(selectedEmail.body)}`}
                  className="px-3 py-1.5 bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/50 border border-blue-200 dark:border-blue-800 rounded-xl text-xs font-bold flex items-center gap-1.5 shrink-0 transition-colors"
                  title="Abrir no Microsoft Outlook Desktop / Web"
                >
                  <ExternalLink size={14} />
                  <span className="hidden sm:inline">Outlook</span>
                </a>
              </div>
            </div>
            
            {/* Conteúdo Principal do E-mail */}
            <div className="flex-1 p-6 overflow-y-auto">
              <div className="max-w-2xl mx-auto space-y-6">

                 {/* CARD DE AÇÃO PRIORITÁRIA: ASSINATURA DIGITAL DO DESTINATÁRIO */}
                 {canSign && (
                   <div className="p-6 bg-gradient-to-br from-[#001a4e] via-[#003087] to-[#1e3a8a] text-white rounded-3xl shadow-2xl border-2 border-blue-400/30 space-y-4 animate-in zoom-in-95 duration-200">
                     <div className="flex flex-wrap items-center justify-between gap-2">
                       <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-400 text-slate-950 font-black text-[11px] rounded-full uppercase tracking-wider shadow-sm">
                         <Sparkles size={13} className="animate-spin" /> Ação Requerida • Assinatura do Destinatário
                       </span>
                       {selectedEmail.envelopeId && (
                         <span className="text-[10px] font-mono opacity-80 bg-white/10 px-2 py-0.5 rounded">
                           Protocolo: {selectedEmail.envelopeId}
                         </span>
                       )}
                     </div>

                     <div className="space-y-1">
                       <h3 className="text-xl font-black tracking-tight text-white">
                         Termo de Responsabilidade de Ativos de TI
                       </h3>
                       <p className="text-xs text-blue-100 leading-relaxed">
                         O termo foi assinado pelo técnico responsável da Cirion TI e aguarda a sua assinatura eletrônica como destinatário. Clique no botão abaixo para revisar os dados do equipamento e assinar digitalmente:
                       </p>
                     </div>

                     <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
                       <button 
                         type="button"
                         id="btn-assinar-digitalmente-destinatario"
                         onClick={handleOpenSignature}
                         className="w-full sm:w-auto flex-1 bg-white hover:bg-slate-100 text-[#003087] py-4 px-6 rounded-2xl font-black text-sm shadow-2xl shadow-black/30 transition-all active:scale-95 flex items-center justify-center gap-2 cursor-pointer border border-white"
                       >
                         <PenLine size={20} className="text-blue-700" />
                         <span>✍️ ASSINAR DIGITALMENTE</span>
                       </button>

                       {selectedEmail.signingUrl && (
                         <a
                           href={selectedEmail.signingUrl}
                           target="_blank"
                           rel="noopener noreferrer"
                           className="w-full sm:w-auto px-5 py-4 bg-white/15 hover:bg-white/25 text-white rounded-2xl font-bold text-xs flex items-center justify-center gap-2 transition-colors border border-white/20 text-center cursor-pointer"
                           title="Abrir página de assinatura externa em nova aba"
                         >
                           <ExternalLink size={16} />
                           <span>Abrir em Nova Aba</span>
                         </a>
                       )}
                     </div>
                   </div>
                 )}

                 {/* Visualização do Corpo do E-mail */}
                 {viewMode === 'html' && selectedEmail.bodyHtml ? (
                   <div className="border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-xs bg-white text-slate-900 p-2">
                     <div 
                       className="email-html-wrapper" 
                       dangerouslySetInnerHTML={{ __html: selectedEmail.bodyHtml }} 
                     />
                   </div>
                 ) : (
                   <div className="text-sm leading-relaxed text-slate-800 dark:text-dracula-fg whitespace-pre-wrap bg-slate-50/60 dark:bg-white/5 p-6 rounded-2xl border border-slate-200/60 dark:border-dracula-current">
                     {selectedEmail.body}
                   </div>
                 )}
                 
                 {/* Anexo do PDF do Termo */}
                 {selectedEmail.attachment && currentExchange && (
                    <div className="p-4 bg-slate-50 dark:bg-dracula-darker rounded-2xl border border-slate-200 dark:border-dracula-current flex items-center justify-between">
                       <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-rose-500/10 text-rose-600 flex items-center justify-center">
                            <Paperclip size={20} />
                          </div>
                          <div>
                            <div className="text-xs font-bold text-slate-900 dark:text-white">{getPDFFileName(currentExchange)}</div>
                            <div className="text-[10px] text-slate-400">Documento Oficial Cirion TI (PDF)</div>
                          </div>
                       </div>
                       <button 
                         type="button"
                         onClick={() => {
                           const pdf = generateAssetPDF(currentExchange, logoPref);
                           if (pdf) pdf.save(getPDFFileName(currentExchange));
                         }} 
                         className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/40 rounded-xl transition-colors"
                         title="Baixar Termo em PDF"
                       >
                         <FileDown size={20} />
                       </button>
                    </div>
                 )}

                 {/* Botão de Concluído se já foi assinado */}
                 {isCompleted && currentExchange && (
                    <div className="text-center p-6 bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/50 rounded-2xl space-y-3">
                       <div className="flex items-center justify-center gap-2 text-emerald-700 dark:text-emerald-400 font-black text-sm">
                         <CheckCircle2 size={20} />
                         <span>ASSINATURA CONCLUÍDA PELO DESTINATÁRIO</span>
                       </div>
                       <p className="text-xs text-slate-600 dark:text-slate-400">
                         O termo foi validado juridicamente por ambas as partes e arquivado com sucesso no SharePoint M365.
                       </p>
                       <button 
                         type="button"
                         onClick={() => {
                           const pdf = generateAssetPDF(currentExchange, logoPref);
                           if (pdf) pdf.save(getPDFFileName(currentExchange));
                         }}
                         className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-xs shadow-md transition-all inline-flex items-center gap-2"
                       >
                         <FileDown size={16} /> Baixar Cópia Assinada (PDF)
                       </button>
                    </div>
                 )}
              </div>
            </div>
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center text-slate-400 text-sm">
            Selecione uma mensagem para visualizar
          </div>
        )}
      </div>

      {/* MODAL DE CONFIRMAÇÃO COM SENHA DO ADMINISTRADOR */}
      {isClearModalOpen && (
        <div className="fixed inset-0 z-[250] flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-dracula-bg w-full max-w-md rounded-3xl p-6 shadow-2xl border border-slate-200 dark:border-dracula-current">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-dracula-current mb-4">
              <div className="flex items-center gap-2 text-rose-600 dark:text-rose-400 font-bold text-sm">
                <ShieldAlert size={18} />
                <span>Limpar Mensagens do Outlook</span>
              </div>
              <button
                type="button"
                onClick={() => {
                  setIsClearModalOpen(false);
                  setPasswordError(null);
                  setAdminPassword('');
                }}
                className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            <div className="space-y-4">
              <div className="p-3.5 bg-rose-50 dark:bg-rose-950/30 border border-rose-200/60 dark:border-rose-900/40 rounded-2xl">
                <p className="text-xs text-rose-700 dark:text-rose-300 leading-relaxed font-medium">
                  Esta ação removerá permanentemente todos os e-mails e notificações de teste da caixa de entrada do Outlook interno. Para confirmar, digite a <strong>senha do administrador</strong>.
                </p>
              </div>

              <form onSubmit={handleClearInbox} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                    <Lock size={12} /> Senha do Administrador
                  </label>
                  <input
                    type="password"
                    id="admin-password-clear-emails"
                    autoFocus
                    placeholder="Digite a senha de administrador"
                    value={adminPassword}
                    onChange={(e) => {
                      setAdminPassword(e.target.value);
                      if (passwordError) setPasswordError(null);
                    }}
                    className="w-full p-3.5 bg-slate-50 dark:bg-dracula-darker border border-slate-200 dark:border-dracula-current rounded-2xl outline-none focus:ring-2 focus:ring-rose-500/40 focus:border-rose-500 text-sm font-bold text-center text-slate-900 dark:text-white transition-all"
                  />
                  {passwordError && (
                    <p className="text-xs text-rose-600 dark:text-rose-400 font-bold animate-in fade-in">
                      {passwordError}
                    </p>
                  )}
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setIsClearModalOpen(false);
                      setPasswordError(null);
                      setAdminPassword('');
                    }}
                    disabled={isClearing}
                    className="flex-1 py-3 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl font-bold text-xs hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors disabled:opacity-50"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    id="btn-confirm-clear-emails"
                    disabled={isClearing || !adminPassword.trim()}
                    className="flex-1 py-3 bg-rose-600 hover:bg-rose-700 text-white rounded-xl font-bold text-xs shadow-lg shadow-rose-600/30 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100 flex items-center justify-center gap-2"
                  >
                    {isClearing ? (
                      <>
                        <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>Limpando...</span>
                      </>
                    ) : (
                      <>
                        <Trash2 size={14} />
                        <span>Confirmar Limpeza</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MockInbox;
