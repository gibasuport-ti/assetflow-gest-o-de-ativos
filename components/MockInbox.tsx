
import React, { useState } from 'react';
import { MockEmail, AssetExchange, LogoPreference } from '../types';
import { Mail, Trash2, Clock, Paperclip, PenLine, ShieldCheck, X, ChevronLeft, FileDown, CheckCircle2 } from 'lucide-react';
import { generateAssetPDF, getPDFFileName } from '../services/pdfService';

interface MockInboxProps {
  emails: MockEmail[];
  exchanges: AssetExchange[];
  onUpdateEmails: (emails: MockEmail[]) => void;
  onOpenPortal: (exchange: AssetExchange) => void;
  logoPref: LogoPreference;
}

const MockInbox: React.FC<MockInboxProps> = ({ emails, onUpdateEmails, exchanges, onOpenPortal, logoPref }) => {
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const selectedEmail = emails.find(e => e.id === selectedId);
  const currentExchange = exchanges.find(ex => ex.id === selectedEmail?.exchangeId);

  const markAsRead = (id: string) => {
    onUpdateEmails(emails.map(e => e.id === id ? { ...e, read: true } : e));
    setSelectedId(id);
  };

  if (emails.length === 0) {
    return (
      <div className="p-20 flex flex-col items-center justify-center text-center h-[500px]">
        <Mail className="text-slate-200 dark:text-dracula-current mb-4" size={48} />
        <h3 className="font-bold">Inbox Vazia</h3>
      </div>
    );
  }

  return (
    <div className="flex h-[600px] lg:h-[700px] bg-white dark:bg-dracula-bg overflow-hidden relative">
      
      {/* List Panel - Hidden on Mobile if Detail is Open */}
      <div className={`w-full lg:w-80 border-r dark:border-dracula-current flex flex-col transition-all ${selectedId ? 'hidden lg:flex' : 'flex'}`}>
        <div className="p-4 bg-slate-50 dark:bg-dracula-darker border-b dark:border-dracula-current text-[10px] font-bold text-slate-400 uppercase tracking-widest">
           Outlook Mock ({emails.length})
        </div>
        <div className="flex-1 overflow-y-auto">
          {emails.map(email => (
            <div
              key={email.id}
              onClick={() => markAsRead(email.id)}
              className={`p-4 cursor-pointer border-b dark:border-dracula-current transition-colors ${selectedId === email.id ? 'bg-blue-50 dark:bg-dracula-current' : 'hover:bg-slate-50'}`}
            >
              <div className="flex justify-between items-start mb-1">
                <span className={`text-xs truncate ${!email.read ? 'font-bold' : 'text-slate-500'}`}>{email.from.split('<')[0]}</span>
                {!email.read && <div className="w-2 h-2 bg-blue-600 rounded-full"/>}
              </div>
              <h4 className="text-[11px] font-bold truncate">{email.subject}</h4>
              <p className="text-[10px] text-slate-400 truncate mt-1">{email.body.substring(0, 40)}...</p>
            </div>
          ))}
        </div>
      </div>

      {/* Detail Panel - Full Screen on Mobile */}
      <div className={`flex-1 flex flex-col bg-white dark:bg-dracula-bg ${!selectedId ? 'hidden lg:flex' : 'flex'}`}>
        {selectedEmail ? (
          <div className="flex flex-col h-full animate-in fade-in slide-in-from-right-4 duration-300">
            <div className="p-4 border-b dark:border-dracula-current flex items-center gap-4">
              <button onClick={() => setSelectedId(null)} className="lg:hidden p-2 bg-slate-100 rounded-xl"><ChevronLeft size={20}/></button>
              <div className="flex-1">
                <h2 className="font-bold text-sm lg:text-lg">{selectedEmail.subject}</h2>
                <div className="text-[10px] text-slate-400">{selectedEmail.from}</div>
              </div>
            </div>
            
            <div className="flex-1 p-6 overflow-y-auto">
              <div className="max-w-2xl mx-auto space-y-8">
                 <div className="text-sm leading-relaxed text-slate-700 dark:text-dracula-fg whitespace-pre-wrap">{selectedEmail.body}</div>
                 
                 {selectedEmail.attachment && currentExchange && (
                    <div className="p-4 bg-slate-50 dark:bg-dracula-darker rounded-2xl border flex items-center justify-between">
                       <div className="flex items-center gap-3">
                          <Paperclip className="text-rose-500" size={20}/>
                          <div>
                            <div className="text-xs font-bold">{getPDFFileName(currentExchange)}</div>
                            <div className="text-[10px] text-slate-400">142 KB</div>
                          </div>
                       </div>
                       <button onClick={() => {
                         const pdf = generateAssetPDF(currentExchange, logoPref);
                         if (pdf) pdf.save(getPDFFileName(currentExchange));
                       }} className="p-2 text-blue-600"><FileDown size={18}/></button>
                    </div>
                 )}

                 {/* Lógica do botão de assinatura */}
                 {currentExchange?.status === 'pending_receiver' && (
                    <div className="text-center pt-8 border-t">
                       <button 
                        onClick={() => onOpenPortal(currentExchange)}
                        className="w-full bg-dracula-purple text-white py-4 rounded-2xl font-bold shadow-xl transition-all active:scale-95 flex items-center justify-center gap-2"
                       >
                         <PenLine size={20} /> ASSINAR DIGITALMENTE
                       </button>
                    </div>
                 )}

                 {currentExchange?.status === 'completed' && (
                    <div className="text-center pt-8 border-t">
                       <button 
                        onClick={() => {
                          const pdf = generateAssetPDF(currentExchange, logoPref);
                          if (pdf) pdf.save(getPDFFileName(currentExchange));
                        }}
                        className="w-full bg-emerald-500 text-white py-4 rounded-2xl font-bold shadow-xl flex items-center justify-center gap-2 hover:bg-emerald-600 transition-all border border-emerald-400/50"
                       >
                         <CheckCircle2 size={20} /> ASSINATURA CONCLUÍDA
                       </button>
                       <p className="text-[10px] text-slate-400 mt-4 uppercase font-bold tracking-widest">O documento foi finalizado e enviado para arquivamento</p>
                    </div>
                 )}
              </div>
            </div>
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center text-slate-300">Selecione uma mensagem</div>
        )}
      </div>
    </div>
  );
};

export default MockInbox;
