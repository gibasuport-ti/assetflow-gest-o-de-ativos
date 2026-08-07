
import React, { useState, useRef, useEffect } from 'react';
import { X, Mail, FileSignature, PenTool } from 'lucide-react';
import { AssetExchange } from '../types';

interface SenderSignatureModalProps {
  exchange: AssetExchange;
  onClose: () => void;
  onConfirm: (id: string, signature: string) => void;
}

const SenderSignatureModal: React.FC<SenderSignatureModalProps> = ({ exchange, onClose, onConfirm }) => {
  const [step, setStep] = useState<'sign' | 'sending'>('sign');
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasSigned, setHasSigned] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.strokeStyle = '#1a5edb';
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
  }, [step]);

  const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
    setIsDrawing(true);
    draw(e);
  };

  const stopDrawing = () => {
    setIsDrawing(false);
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      ctx?.beginPath();
    }
  };

  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = ('touches' in e) ? e.touches[0].clientX - rect.left : (e as React.MouseEvent).clientX - rect.left;
    const y = ('touches' in e) ? e.touches[0].clientY - rect.top : (e as React.MouseEvent).clientY - rect.top;

    ctx.lineTo(x, y);
    ctx.stroke();
    setHasSigned(true);
  };

  const clear = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    ctx?.clearRect(0, 0, canvas.width, canvas.height);
    setHasSigned(false);
  };

  const handleSignAndSend = () => {
    const canvas = canvasRef.current;
    if (!canvas || !hasSigned) return;
    
    const signatureBase64 = canvas.toDataURL('image/png');
    setStep('sending');
    setTimeout(() => {
      onConfirm(exchange.id, signatureBase64);
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/80 dark:bg-dracula-bg/80 backdrop-blur-md animate-in fade-in duration-300">
      <div className="bg-white dark:bg-dracula-bg w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden border border-slate-200 dark:border-dracula-current">
        <div className="p-6 border-b border-slate-100 dark:border-dracula-current flex items-center justify-between bg-white dark:bg-dracula-darker">
          <div className="flex items-center gap-3">
            <div className="p-2 text-white rounded-lg shadow-lg transition-colors duration-300 bg-blue-600 shadow-blue-200 dark:shadow-black/20">
              <Mail size={20} />
            </div>
            <div>
              <h3 className="font-bold text-slate-800 dark:text-dracula-fg leading-none">
                Assinatura do Remetente (TI)
              </h3>
              <p className="text-[10px] text-slate-400 dark:text-dracula-comment mt-1 uppercase tracking-wider font-bold">Outlook AssetFlow</p>
            </div>
          </div>
          <button 
            onClick={onClose} 
            disabled={step === 'sending'}
            className="p-2 hover:bg-slate-100 dark:hover:bg-dracula-current rounded-xl transition-colors text-slate-500 dark:text-dracula-comment disabled:opacity-30"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-8">
          {step === 'sign' ? (
            <div className="space-y-6">
              
              <div className="p-4 bg-blue-50 dark:bg-dracula-cyan/10 border border-blue-100 dark:border-dracula-cyan/20 rounded-2xl">
                <p className="text-sm text-blue-800 dark:text-dracula-cyan leading-relaxed">
                  Ao assinar, o termo será preparado para envio via <strong>Outlook</strong> para <strong>{exchange.colaborador_email}</strong>.
                </p>
              </div>

              <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 dark:text-dracula-comment uppercase tracking-wider flex items-center gap-2">
                    <PenTool size={14} /> Assine no campo abaixo (TI)
                  </label>
                  <div className="border-2 border-dashed border-slate-200 dark:border-dracula-current rounded-2xl bg-white overflow-hidden touch-none">
                    <canvas
                      ref={canvasRef}
                      width={600}
                      height={200}
                      className="w-full cursor-crosshair"
                      onMouseDown={startDrawing}
                      onMouseUp={stopDrawing}
                      onMouseMove={draw}
                      onTouchStart={startDrawing}
                      onTouchEnd={stopDrawing}
                      onTouchMove={draw}
                    />
                  </div>
                  <div className="flex justify-end">
                    <button onClick={clear} className="text-xs font-bold text-rose-500 hover:underline">Limpar</button>
                  </div>
              </div>

              <button
                onClick={handleSignAndSend}
                disabled={!hasSigned}
                className="w-full py-4 text-white rounded-xl md:rounded-2xl font-bold shadow-xl transition-all flex items-center justify-center gap-2 group disabled:bg-slate-300 dark:disabled:bg-dracula-comment dark:disabled:text-dracula-fg/50 bg-blue-600 hover:bg-blue-700 shadow-blue-600/20"
              >
                <FileSignature size={18} className="group-hover:scale-110 transition-transform" />
                Confirmar Minha Assinatura
              </button>
            </div>
          ) : (
            <div className="py-10 flex flex-col items-center justify-center text-center space-y-6 transition-colors duration-200">
              <div className="relative">
                <div className="w-24 h-24 border-4 rounded-full animate-spin border-blue-50 dark:border-dracula-current border-t-blue-600"></div>
                <div className="absolute inset-0 flex items-center justify-center text-blue-600">
                  <Mail size={32} className="animate-pulse" />
                </div>
              </div>
              <div className="space-y-2">
                <h4 className="font-bold text-slate-800 dark:text-dracula-fg text-xl">
                    Processando Assinatura
                </h4>
                <p className="text-slate-500 dark:text-dracula-comment text-sm max-w-[250px] mx-auto">
                    Preparando o documento com sua assinatura digital...
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SenderSignatureModal;
