
import React, { useRef, useState, useEffect } from 'react';
import { AssetExchange, LogoPreference } from '../types';
import { Check, X, PenTool, Download, Send } from 'lucide-react';
import { generateAssetPDF } from '../services/pdfService';

interface SignaturePortalProps {
  exchange: AssetExchange;
  logoPref: LogoPreference;
  onSave: (signature: string) => void;
  onCancel: () => void;
}

const SignaturePortal: React.FC<SignaturePortalProps> = ({ exchange, logoPref, onSave, onCancel }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasSigned, setHasSigned] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.strokeStyle = '#003087';
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
  }, []);

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

  const handleSave = () => {
    const canvas = canvasRef.current;
    if (!canvas || !hasSigned) return;
    
    const signatureBase64 = canvas.toDataURL('image/png');
    onSave(signatureBase64);
  };

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-dracula-darker w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        <div className="p-6 border-b dark:border-dracula-current flex justify-between items-center bg-dracula-purple text-white">
          <div>
            <h2 className="text-xl font-bold">Assinatura do Colaborador</h2>
            <p className="text-xs opacity-80">Termo de Responsabilidade de Equipamento</p>
          </div>
          <button onClick={onCancel} className="p-2 hover:bg-white/10 rounded-full transition-colors">
            <X size={24} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          <div className="bg-slate-50 dark:bg-dracula-bg p-4 rounded-2xl border dark:border-dracula-current">
            <h3 className="text-sm font-bold mb-2">Resumo do Termo</h3>
            <div className="grid grid-cols-2 gap-4 text-xs">
              <div>
                <span className="text-slate-400 block">Colaborador</span>
                <span className="font-bold">{exchange.colaborador_nome}</span>
              </div>
              <div>
                <span className="text-slate-400 block">Operação</span>
                <span className="font-bold uppercase">{exchange.operationType}</span>
              </div>
              <div>
                <span className="text-slate-400 block">Equipamento Entregue</span>
                <span className="font-bold">{exchange.entregue_serial || 'N/A'}</span>
              </div>
              <div>
                <span className="text-slate-400 block">Equipamento Devolvido</span>
                <span className="font-bold">{exchange.devolvido_serial || 'N/A'}</span>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold flex items-center gap-2">
              <PenTool size={16} className="text-dracula-purple" />
              Assine no campo abaixo:
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
            <div className="flex justify-between items-center">
              <p className="text-[10px] text-slate-400 italic">Ao assinar, você concorda com os termos de responsabilidade do equipamento.</p>
              <button onClick={clear} className="text-xs font-bold text-rose-500 hover:underline">Limpar</button>
            </div>
          </div>
        </div>

        <div className="p-6 border-t dark:border-dracula-current bg-slate-50 dark:bg-dracula-bg flex gap-3">
          <button 
            onClick={onCancel}
            className="flex-1 py-3 rounded-xl font-bold text-slate-500 bg-white dark:bg-dracula-darker border dark:border-dracula-current hover:bg-slate-50 transition-colors"
          >
            Cancelar
          </button>
          <button 
            onClick={handleSave}
            disabled={!hasSigned}
            className={`flex-1 py-3 rounded-xl font-bold text-white flex items-center justify-center gap-2 transition-all ${hasSigned ? 'bg-dracula-purple shadow-lg shadow-dracula-purple/20' : 'bg-slate-300 cursor-not-allowed'}`}
          >
            <Check size={18} /> Confirmar Assinatura
          </button>
        </div>
      </div>
    </div>
  );
};

export default SignaturePortal;
