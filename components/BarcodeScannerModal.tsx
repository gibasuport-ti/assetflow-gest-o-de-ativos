
import React, { useEffect, useRef, useState } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import { X, Loader2, Camera, AlertTriangle, Hash, AlignLeft } from 'lucide-react';

interface BarcodeScannerModalProps {
  onScan: (decodedText: string) => void;
  onClose: () => void;
  title: string;
}

const BarcodeScannerModal: React.FC<BarcodeScannerModalProps> = ({ onScan, onClose, title }) => {
  const [isInitializing, setIsInitializing] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [scanMode, setScanMode] = useState<'full' | 'last8'>('full');
  
  const scanModeRef = useRef<'full' | 'last8'>('full');
  useEffect(() => {
    scanModeRef.current = scanMode;
  }, [scanMode]);

  const scannerRef = useRef<Html5Qrcode | null>(null);
  const elementId = "qr-reader-container";

  useEffect(() => {
    let isMounted = true;

    const startScanner = async () => {
      try {
        try {
          const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } });
          stream.getTracks().forEach(track => track.stop());
        } catch (e) {
          console.warn("Permission pre-check failed or denied", e);
        }

        if (!isMounted) return;

        const html5QrCode = new Html5Qrcode(elementId);
        scannerRef.current = html5QrCode;

        const config = {
          fps: 15,
          qrbox: { width: 280, height: 200 },
          aspectRatio: 1.0
        };

        await html5QrCode.start(
          { facingMode: "environment" },
          config,
          (decodedText) => {
            if (scannerRef.current && isMounted) {
              let result = decodedText.trim();
              if (scanModeRef.current === 'last8') {
                result = result.slice(-8);
              }
              
              scannerRef.current.stop().then(() => {
                onScan(result);
              }).catch(e => {
                console.error("Stop error", e);
                onScan(result);
              });
            }
          },
          () => {}
        );
        
        if (isMounted) setIsInitializing(false);
      } catch (err: any) {
        console.error("Scanner init error", err);
        if (isMounted) {
          setError("Não foi possível acessar a câmera. Certifique-se de conceder a permissão.");
          setIsInitializing(false);
        }
      }
    };

    const timeout = setTimeout(startScanner, 400);

    return () => {
      isMounted = false;
      clearTimeout(timeout);
      if (scannerRef.current && scannerRef.current.isScanning) {
        scannerRef.current.stop().catch(e => console.error("Cleanup stop error", e));
      }
    };
  }, [onScan]);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/90 dark:bg-dracula-darker/90 backdrop-blur-md animate-in fade-in duration-300">
      <div className="bg-white dark:bg-dracula-bg w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden border border-slate-200 dark:border-dracula-current">
        <div className="p-5 border-b border-slate-100 dark:border-dracula-current flex items-center justify-between bg-white dark:bg-dracula-darker">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-dracula-purple text-white rounded-lg shadow-lg shadow-dracula-purple/20">
              <Camera size={20} />
            </div>
            <div>
              <h3 className="font-bold text-slate-800 dark:text-dracula-fg leading-none">Scanner de Ativos</h3>
              <p className="text-xs text-slate-500 dark:text-dracula-comment mt-1">{title}</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-slate-100 dark:hover:bg-dracula-current rounded-xl transition-colors text-slate-500 dark:text-dracula-comment"
          >
            <X size={20} />
          </button>
        </div>
        
        <div className="p-4 bg-slate-50 dark:bg-dracula-darker flex justify-center border-b border-slate-100 dark:border-dracula-current">
          <div className="flex p-1 bg-slate-200 dark:bg-dracula-bg rounded-xl w-full max-w-xs border dark:border-dracula-current">
            <button 
              onClick={() => setScanMode('full')}
              className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-bold transition-all ${scanMode === 'full' ? 'bg-white dark:bg-dracula-current text-dracula-purple dark:text-white shadow-sm' : 'text-slate-500 dark:text-dracula-comment hover:text-slate-700 dark:hover:text-dracula-fg'}`}
            >
              <AlignLeft size={14} /> Completo
            </button>
            <button 
              onClick={() => setScanMode('last8')}
              className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-bold transition-all ${scanMode === 'last8' ? 'bg-white dark:bg-dracula-current text-dracula-purple dark:text-white shadow-sm' : 'text-slate-500 dark:text-dracula-comment hover:text-slate-700 dark:hover:text-dracula-fg'}`}
            >
              <Hash size={14} /> Últimos 8
            </button>
          </div>
        </div>
        
        <div className="p-8 relative min-h-[400px] flex flex-col items-center justify-center bg-slate-50 dark:bg-dracula-bg">
          {isInitializing && !error && (
            <div className="absolute inset-0 z-10 bg-white/95 dark:bg-dracula-bg/95 flex flex-col items-center justify-center gap-4">
              <Loader2 className="text-dracula-purple animate-spin" size={48} />
              <div className="text-center px-6">
                <p className="text-slate-800 dark:text-dracula-fg font-bold text-lg">Iniciando Câmera</p>
                <p className="text-slate-500 dark:text-dracula-comment text-sm mt-1 leading-relaxed">Permita o acesso à câmera para realizar a leitura.</p>
              </div>
            </div>
          )}

          {error ? (
            <div className="text-center p-8 flex flex-col items-center">
              <div className="w-16 h-16 bg-rose-100 dark:bg-dracula-red/10 text-rose-600 dark:text-dracula-red rounded-full flex items-center justify-center mb-4">
                <AlertTriangle size={32} />
              </div>
              <h4 className="text-xl font-bold text-slate-800 dark:text-dracula-fg mb-2">Acesso à Câmera Negado</h4>
              <p className="text-slate-600 dark:text-dracula-comment text-sm max-w-xs mb-8">
                {error}
              </p>
              <button 
                onClick={onClose}
                className="w-full py-4 bg-dracula-purple text-white rounded-2xl font-bold shadow-xl shadow-dracula-purple/20 transition-all active:scale-95"
              >
                Voltar
              </button>
            </div>
          ) : (
            <>
              <div 
                id={elementId} 
                className="w-full max-w-sm aspect-square overflow-hidden rounded-2xl border-4 border-white dark:border-dracula-current bg-black shadow-2xl relative"
              >
                <div className="absolute inset-0 z-20 pointer-events-none">
                  <div className="w-full h-full border-[60px] border-black/30">
                     <div className="w-full h-full border-2 border-dracula-purple/50 rounded-sm relative">
                        <div className="absolute top-0 left-0 w-full h-1 bg-dracula-pink shadow-[0_0_15px_rgba(255,121,198,1)] animate-[scan_2.5s_linear_infinite]"></div>
                     </div>
                  </div>
                </div>
              </div>
              
              <style>{`
                @keyframes scan {
                  0% { top: 0; }
                  100% { top: 100%; }
                }
              `}</style>

              <div className="mt-8 text-center space-y-2 px-4">
                <p className="text-sm font-bold text-slate-800 dark:text-dracula-fg">Posicione o código no centro</p>
                <p className="text-xs text-slate-500 dark:text-dracula-comment max-w-[260px] mx-auto leading-relaxed">
                  Modo ativo: <span className="text-dracula-purple font-bold">{scanMode === 'full' ? 'Completo' : 'Últimos 8 dígitos'}</span>
                </p>
              </div>
            </>
          )}
        </div>

        <div className="p-6 bg-white dark:bg-dracula-darker border-t border-slate-100 dark:border-dracula-current flex justify-center">
          <button 
            onClick={onClose}
            className="w-full py-4 bg-slate-100 dark:bg-dracula-bg text-slate-700 dark:text-dracula-fg rounded-2xl text-sm font-bold hover:bg-slate-200 dark:hover:bg-dracula-current transition-all"
          >
            Voltar ao Formulário
          </button>
        </div>
      </div>
    </div>
  );
};

export default BarcodeScannerModal;
