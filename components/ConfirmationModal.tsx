
import React, { useState } from 'react';
import { AlertTriangle, Lock, Loader2 } from 'lucide-react';
import { securityService } from '../services/securityService';

interface ConfirmationModalProps {
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
  confirmLabel?: string;
  isDanger?: boolean;
  confirmationKeyword?: string;
  requireSecurityKeyword?: boolean;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({ 
  title, message, onConfirm, onCancel, confirmLabel = "Confirmar", isDanger = false, confirmationKeyword, requireSecurityKeyword = false
}) => {
  const [inputValue, setInputValue] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const needsKeyword = requireSecurityKeyword || Boolean(confirmationKeyword);

  const handleConfirmClick = async () => {
    if (!needsKeyword) {
      onConfirm();
      return;
    }

    if (!inputValue.trim()) {
      setErrorMsg('Por favor, informe a senha de segurança.');
      return;
    }

    setIsVerifying(true);
    setErrorMsg(null);
    try {
      if (confirmationKeyword && inputValue.toLowerCase() === confirmationKeyword.toLowerCase()) {
        onConfirm();
        return;
      }

      const check = await securityService.verifyDeleteKeyword(inputValue);
      if (check.authorized) {
        onConfirm();
      } else {
        setErrorMsg(check.message || 'Senha ou palavra-chave incorreta.');
      }
    } catch {
      setErrorMsg('Falha ao validar credenciais.');
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white dark:bg-dracula-bg w-full max-w-sm rounded-3xl p-6 shadow-2xl border border-white/10">
        <div className="flex flex-col items-center text-center gap-4">
          <div className={`p-4 rounded-full ${isDanger ? 'bg-rose-100 text-rose-600 dark:bg-rose-900/30 dark:text-rose-400' : 'bg-blue-100 text-blue-600'}`}>
            <AlertTriangle size={32} />
          </div>
          <div>
            <h3 className="text-xl font-bold mb-2 text-slate-900 dark:text-white">{title}</h3>
            <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">
              {message}
            </p>
          </div>
          
          {needsKeyword && (
            <div className="w-full text-left space-y-2 mt-2">
              <label className="text-xs font-bold text-slate-400 uppercase flex items-center gap-1">
                <Lock size={12} /> Senha de Segurança
              </label>
              <input 
                type="password"
                placeholder="Digite a confirmação aqui"
                className="w-full p-3 rounded-xl border-2 border-slate-200 dark:border-dracula-current bg-slate-50 dark:bg-dracula-darker text-center font-bold text-slate-700 dark:text-white outline-none focus:border-rose-400 transition-all"
                value={inputValue}
                onChange={(e) => {
                  setInputValue(e.target.value);
                  if (errorMsg) setErrorMsg(null);
                }}
                autoFocus
              />
              {errorMsg && (
                <p className="text-xs text-rose-500 font-bold text-center mt-1 animate-in fade-in">
                  {errorMsg}
                </p>
              )}
            </div>
          )}

          <div className="flex gap-3 w-full mt-4">
            <button 
              onClick={onCancel}
              disabled={isVerifying}
              className="flex-1 py-3 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl font-bold hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors disabled:opacity-50"
            >
              Cancelar
            </button>
            <button 
              onClick={handleConfirmClick}
              disabled={isVerifying || (needsKeyword && !inputValue.trim())}
              className={`flex-1 py-3 text-white rounded-xl font-bold transition-all active:scale-95 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100 flex items-center justify-center gap-2 ${isDanger ? 'bg-rose-500 hover:bg-rose-600 shadow-rose-500/30' : 'bg-blue-600 hover:bg-blue-700'}`}
            >
              {isVerifying ? <Loader2 size={18} className="animate-spin" /> : confirmLabel}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
