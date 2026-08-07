
import React, { useState } from 'react';
import { AlertTriangle, Lock } from 'lucide-react';

interface ConfirmationModalProps {
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
  confirmLabel?: string;
  isDanger?: boolean;
  confirmationKeyword?: string;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({ 
  title, message, onConfirm, onCancel, confirmLabel = "Confirmar", isDanger = false, confirmationKeyword
}) => {
  const [inputValue, setInputValue] = useState('');
  const isConfirmDisabled = confirmationKeyword ? inputValue.toLowerCase() !== confirmationKeyword.toLowerCase() : false;

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
          
          {confirmationKeyword && (
            <div className="w-full text-left space-y-2 mt-2">
              <label className="text-xs font-bold text-slate-400 uppercase flex items-center gap-1">
                <Lock size={12} /> Senha de Segurança
              </label>
              <input 
                type="password"
                placeholder="Digite a senha aqui"
                className="w-full p-3 rounded-xl border-2 border-slate-200 dark:border-dracula-current bg-slate-50 dark:bg-dracula-darker text-center font-bold text-slate-700 dark:text-white outline-none focus:border-rose-400 transition-all"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                autoFocus
              />
            </div>
          )}

          <div className="flex gap-3 w-full mt-4">
            <button 
              onClick={onCancel}
              className="flex-1 py-3 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl font-bold hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
            >
              Cancelar
            </button>
            <button 
              onClick={onConfirm}
              disabled={isConfirmDisabled}
              className={`flex-1 py-3 text-white rounded-xl font-bold transition-all active:scale-95 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100 ${isDanger ? 'bg-rose-500 hover:bg-rose-600 shadow-rose-500/30' : 'bg-blue-600 hover:bg-blue-700'}`}
            >
              {confirmLabel}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
