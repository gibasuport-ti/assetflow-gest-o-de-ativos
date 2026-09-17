
import React, { useRef, useState, useEffect } from 'react';
import { AssetExchange, LogoPreference } from '../types';
import { Check, X, PenTool, Download, ShieldCheck, Laptop, FileText } from 'lucide-react';
import { generateAssetPDF, getPDFFileName } from '../services/pdfService';

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
    ctx.lineWidth = 2.5;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
  }, []);

  const getCoordinates = (e: React.MouseEvent | React.TouchEvent | MouseEvent | TouchEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    if ('touches' in e && e.touches.length > 0) {
      return {
        x: (e.touches[0].clientX - rect.left) * scaleX,
        y: (e.touches[0].clientY - rect.top) * scaleY
      };
    }
    return {
      x: ((e as MouseEvent).clientX - rect.left) * scaleX,
      y: ((e as MouseEvent).clientY - rect.top) * scaleY
    };
  };

  const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
    if ('touches' in e) {
      e.preventDefault();
    }
    setIsDrawing(true);
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const coords = getCoordinates(e);
    ctx.beginPath();
    ctx.moveTo(coords.x, coords.y);
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing) return;
    if ('touches' in e) {
      e.preventDefault();
    }
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const coords = getCoordinates(e);
    ctx.lineTo(coords.x, coords.y);
    ctx.stroke();
    setHasSigned(true);
  };

  const clear = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setHasSigned(false);
  };

  const handleSave = () => {
    const canvas = canvasRef.current;
    if (!canvas || !hasSigned) return;
    
    const signatureBase64 = canvas.toDataURL('image/png');
    onSave(signatureBase64);
  };

  const handleDownloadPDF = () => {
    const pdf = generateAssetPDF(exchange, logoPref);
    if (pdf) {
      pdf.save(getPDFFileName(exchange));
    }
  };

  const equipDesc = [
    exchange.entregue_tipo,
    exchange.entregue_marca,
    exchange.entregue_modelo
  ].filter(Boolean).join(' ') || exchange.entregue_serial || 'Equipamento TI Cirion';

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-[250] flex items-center justify-center p-4">
      <div className="bg-white dark:bg-dracula-darker w-full max-w-2xl rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col max-h-[92vh] border border-slate-200 dark:border-dracula-current animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="p-6 bg-[#003087] text-white flex justify-between items-center relative overflow-hidden">
          <div className="relative z-10 space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded bg-white/20 text-white font-mono text-[10px] font-bold uppercase tracking-wider">
                DocuSign • Microsoft 365
              </span>
              {exchange.docusign_envelope_id && (
                <span className="px-2 py-0.5 rounded bg-blue-900/60 text-blue-200 font-mono text-[10px]">
                  {exchange.docusign_envelope_id}
                </span>
              )}
            </div>
            <h2 className="text-xl font-black tracking-tight">Assinatura do Destinatário</h2>
            <p className="text-xs text-blue-100">Termo de Responsabilidade e Movimentação de Ativos Cirion TI</p>
          </div>
          <button 
            type="button"
            onClick={onCancel} 
            className="p-2.5 hover:bg-white/10 rounded-full transition-colors relative z-10 cursor-pointer text-white"
            title="Fechar"
          >
            <X size={22} />
          </button>
        </div>

        {/* Corpo do Portal */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          
          {/* Card Resumo do Termo */}
          <div className="bg-slate-50 dark:bg-dracula-bg p-5 rounded-2xl border border-slate-200/80 dark:border-dracula-current space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-700 dark:text-slate-300">
                <Laptop size={16} className="text-blue-600" />
                <span>Equipamento Vinculado ao Colaborador</span>
              </div>
              <button
                type="button"
                onClick={handleDownloadPDF}
                className="text-xs font-bold text-blue-600 hover:text-blue-700 dark:text-blue-400 flex items-center gap-1 hover:underline cursor-pointer"
                title="Visualizar documento em formato PDF"
              >
                <FileText size={14} />
                <span>Visualizar Termo (PDF)</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-white dark:bg-slate-800/60 rounded-xl border border-slate-100 dark:border-white/5">
                <span className="text-slate-400 text-[10px] uppercase font-bold tracking-wider block">Destinatário (Colaborador)</span>
                <span className="font-bold text-slate-900 dark:text-white text-sm">{exchange.colaborador_nome}</span>
                {exchange.colaborador_email && (
                  <span className="text-[11px] text-slate-500 block truncate">{exchange.colaborador_email}</span>
                )}
              </div>

              <div className="p-3 bg-white dark:bg-slate-800/60 rounded-xl border border-slate-100 dark:border-white/5">
                <span className="text-slate-400 text-[10px] uppercase font-bold tracking-wider block">Operação & Data</span>
                <span className="font-bold text-slate-900 dark:text-white uppercase">{exchange.operationType === 'exchange' ? 'Troca de Equipamento' : (exchange.operationType as string) === 'return' || (exchange.operationType as string) === 'devolution' ? 'Devolução' : 'Entrega de Ativo'}</span>
                <span className="text-[11px] text-slate-500 block">Data: {exchange.data_troca || new Date().toISOString().split('T')[0]}</span>
              </div>

              <div className="p-3 bg-white dark:bg-slate-800/60 rounded-xl border border-slate-100 dark:border-white/5 sm:col-span-2">
                <span className="text-slate-400 text-[10px] uppercase font-bold tracking-wider block">Descrição do Equipamento</span>
                <span className="font-bold text-slate-900 dark:text-white">{equipDesc}</span>
                {exchange.entregue_serial && (
                  <div className="mt-1 flex items-center gap-1.5 text-slate-600 dark:text-slate-400 font-mono text-[11px]">
                    <span>Serial:</span> <strong className="text-blue-600 dark:text-blue-400">{exchange.entregue_serial}</strong>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Área de Captura de Assinatura */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-black uppercase tracking-wider text-slate-700 dark:text-slate-200 flex items-center gap-2">
                <PenTool size={15} className="text-blue-600" />
                <span>Assinatura Digital Manuscrita:</span>
              </label>
              <button 
                type="button"
                onClick={clear} 
                className="text-xs font-bold text-rose-500 hover:text-rose-600 hover:underline cursor-pointer px-2 py-0.5"
              >
                Limpar Traçado
              </button>
            </div>

            <div className="border-2 border-dashed border-blue-300 dark:border-blue-900/60 hover:border-blue-500 rounded-2xl bg-white dark:bg-slate-900 overflow-hidden touch-none relative shadow-inner">
              <canvas
                ref={canvasRef}
                width={700}
                height={220}
                className="w-full h-44 cursor-crosshair block"
                onMouseDown={startDrawing}
                onMouseUp={stopDrawing}
                onMouseMove={draw}
                onMouseLeave={stopDrawing}
                onTouchStart={startDrawing}
                onTouchEnd={stopDrawing}
                onTouchMove={draw}
              />
              
              {!hasSigned && (
                <div className="absolute inset-0 pointer-events-none flex flex-col items-center justify-center text-slate-400/60 dark:text-slate-600">
                  <PenTool size={28} className="mb-1 opacity-50" />
                  <span className="text-xs font-bold tracking-wide">Desenhe sua assinatura aqui (Mouse ou Tela Sensível ao Toque)</span>
                </div>
              )}
            </div>

            <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1">
              <p className="italic">
                Ao confirmar, você valida o recebimento do ativo com valor legal sob as normas corporativas da Cirion Technologies.
              </p>
              {hasSigned && (
                <span className="font-bold text-emerald-600 dark:text-emerald-400 shrink-0 flex items-center gap-1">
                  <Check size={12} /> Traço capturado
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Footer com Botões de Ação */}
        <div className="p-6 border-t border-slate-200 dark:border-dracula-current bg-slate-50 dark:bg-dracula-bg flex flex-col sm:flex-row gap-3">
          <button 
            type="button"
            onClick={onCancel}
            className="sm:flex-1 py-3.5 px-5 rounded-2xl font-bold text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-800 border border-slate-200 dark:border-white/10 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors text-xs text-center cursor-pointer"
          >
            Cancelar
          </button>
          <button 
            type="button"
            id="btn-confirmar-assinatura-destinatario"
            onClick={handleSave}
            disabled={!hasSigned}
            className={`sm:flex-1 py-3.5 px-6 rounded-2xl font-black text-xs text-white flex items-center justify-center gap-2 transition-all cursor-pointer ${hasSigned ? 'bg-[#003087] hover:bg-[#002266] shadow-xl shadow-blue-900/30 active:scale-98' : 'bg-slate-300 dark:bg-slate-700 cursor-not-allowed opacity-60'}`}
          >
            <Check size={18} /> 
            <span>CONFIRMAR E FINALIZAR ASSINATURA</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default SignaturePortal;
