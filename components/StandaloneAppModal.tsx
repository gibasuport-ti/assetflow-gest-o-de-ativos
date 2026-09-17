import React, { useState } from 'react';
import { 
  ExternalLink, 
  Copy, 
  Check, 
  Globe, 
  Laptop, 
  Smartphone, 
  ShieldCheck, 
  X, 
  CheckCircle2, 
  AlertCircle,
  Download,
  Share2,
  Sparkles
} from 'lucide-react';
import { urlService, PROD_STANDALONE_URL, GITHUB_PAGES_URL } from '../services/urlService';

interface StandaloneAppModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const StandaloneAppModal: React.FC<StandaloneAppModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [isInstalling, setIsInstalling] = useState(false);
  const [installSuccess, setInstallSuccess] = useState(false);
  const urls = urlService.getAppUrls();

  if (!isOpen) return null;

  const handleCopy = async (text: string, key: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedKey(key);
      setTimeout(() => setCopiedKey(null), 3000);
    } catch (e) {
      prompt('Copie o link abaixo:', text);
    }
  };

  const handleInstallPwa = async () => {
    setIsInstalling(true);
    const installed = await urlService.promptPwaInstall();
    setIsInstalling(false);
    if (installed) {
      setInstallSuccess(true);
      setTimeout(() => setInstallSuccess(false), 4000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-700/80 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Header */}
        <div className="p-6 border-b border-slate-800 flex items-center justify-between bg-slate-950/40">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-sky-500/10 border border-sky-500/30 rounded-2xl text-sky-400">
              <Globe size={24} />
            </div>
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                Execução Independente do AssetFlow
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-950/80 border border-emerald-800 text-emerald-300">
                  Offline-First & PWA
                </span>
              </h3>
              <p className="text-xs text-slate-400">
                Como executar o aplicativo livre de qualquer dependência da plataforma de desenvolvimento
              </p>
            </div>
          </div>
          <button 
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-white p-2 rounded-xl hover:bg-slate-800 transition-colors cursor-pointer"
            title="Fechar Janela"
          >
            <X size={20} />
          </button>
        </div>

        {/* Body Content */}
        <div className="p-6 overflow-y-auto space-y-5 text-slate-300">
          
          {/* Alerta explicativo da causa e da correção */}
          <div className="p-4 rounded-2xl border bg-sky-950/30 border-sky-800/60 text-sky-200 space-y-2">
            <div className="flex items-center gap-2 font-bold text-xs text-sky-300">
              <Sparkles size={16} className="text-sky-400" />
              <span>Entenda por que só abria com o AI Studio aberto e o que foi corrigido:</span>
            </div>
            <p className="text-[11px] leading-relaxed text-slate-300">
              O link de desenvolvimento (<code className="bg-slate-900/80 px-1 py-0.5 rounded text-sky-300">ais-dev-...</code>) é um container de edição que é pausado pelo Google quando a janela do editor é fechada.
            </p>
            <p className="text-[11px] leading-relaxed text-emerald-300 font-medium">
              ✓ <strong>Nova Correção Aplicada:</strong> Atualizamos o AssetFlow com arquitetura <strong>Offline-First Resiliente</strong> e suporte a <strong>PWA Nativo</strong>. O app agora abre instantaneamente mesmo sem conexão com o servidor de desenvolvimento e mantém todos os seus 61 ativos e termos salvos com segurança localmente!
            </p>
          </div>

          {/* Opções de Execução */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              3 Maneiras de Rodar Fora da Plataforma
            </h4>

            {/* Opção 1: Instalação PWA Direta no Computador / Celular */}
            <div className="bg-slate-950/80 border border-emerald-500/50 hover:border-emerald-500 rounded-2xl p-4 transition-all space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                  <span className="text-xs font-extrabold text-white">
                    Opção 1: Instalar como Aplicativo no Computador / Celular (PWA)
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300">
                    Recomendado
                  </span>
                </div>
              </div>

              <p className="text-[11px] text-slate-300 leading-relaxed">
                Transforma o AssetFlow em um aplicativo nativo na sua Área de Trabalho ou tela inicial do celular. Abre com 1 clique, sem precisar abrir o navegador nem o AI Studio.
              </p>

              <div className="flex flex-wrap items-center gap-2 pt-1">
                <button
                  type="button"
                  onClick={handleInstallPwa}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all shadow-md shadow-emerald-600/30 cursor-pointer"
                >
                  <Download size={14} />
                  <span>{installSuccess ? 'Instalado com Sucesso!' : 'Instalar Aplicativo Agora'}</span>
                </button>

                <span className="text-[11px] text-slate-400">
                  (Ou no menu do Chrome/Edge: clique em <strong>⋮</strong> &gt; <strong>Instalar AssetFlow</strong>)
                </span>
              </div>
            </div>

            {/* Opção 2: Produção Permanente 24/7 (Cloud Run) */}
            <div className="bg-slate-950/60 border border-slate-800 hover:border-slate-700 rounded-2xl p-4 transition-all space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Share2 size={15} className="text-indigo-400" />
                  <span className="text-xs font-bold text-white">
                    Opção 2: Link de Produção Permanente 24/7 (Cloud Run)
                  </span>
                </div>
                <span className="text-[10px] text-indigo-300 font-mono">Não desliga ao fechar editor</span>
              </div>

              <p className="text-[11px] text-slate-300 leading-relaxed">
                Para ter este link ativo permanentemente 24 horas por dia: clique no botão <strong>"Share" (Compartilhar)</strong> na barra superior do Google AI Studio. Uma vez compartilhado, a URL abaixo fica acessível para qualquer pessoa na rede da empresa.
              </p>

              <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs font-mono text-indigo-200 break-all select-all">
                <span className="truncate flex-1">{PROD_STANDALONE_URL}</span>
              </div>

              <div className="flex items-center justify-end gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => handleCopy(PROD_STANDALONE_URL, 'prod')}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-colors cursor-pointer"
                >
                  {copiedKey === 'prod' ? (
                    <>
                      <Check size={13} className="text-emerald-400" />
                      <span className="text-emerald-400">Copiado!</span>
                    </>
                  ) : (
                    <>
                      <Copy size={13} />
                      <span>Copiar Link de Produção</span>
                    </>
                  )}
                </button>

                <a
                  href={PROD_STANDALONE_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold transition-colors cursor-pointer"
                >
                  <ExternalLink size={13} />
                  <span>Acessar Link Permanente</span>
                </a>
              </div>
            </div>

            {/* Opção 3: GitHub Pages Independente */}
            <div className="bg-slate-950/60 border border-slate-800 hover:border-slate-700 rounded-2xl p-4 transition-all space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Globe size={15} className="text-sky-400" />
                  <span className="text-xs font-bold text-white">
                    Opção 3: Hospedagem Gratuita Independente no GitHub Pages
                  </span>
                </div>
                <span className="text-[10px] text-emerald-400 font-mono">100% Autônomo</span>
              </div>

              <p className="text-[11px] text-slate-300 leading-relaxed">
                Com o novo modo Offline-First, sua versão no GitHub Pages funciona de maneira autônoma, sem depender de nenhum servidor do AI Studio ativo.
              </p>

              <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs font-mono text-sky-200 break-all select-all">
                <span className="truncate flex-1">{GITHUB_PAGES_URL}</span>
              </div>

              <div className="flex items-center justify-end gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => handleCopy(GITHUB_PAGES_URL, 'gh')}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-colors cursor-pointer"
                >
                  {copiedKey === 'gh' ? (
                    <>
                      <Check size={13} className="text-emerald-400" />
                      <span className="text-emerald-400">Copiado!</span>
                    </>
                  ) : (
                    <>
                      <Copy size={13} />
                      <span>Copiar Link do GitHub</span>
                    </>
                  )}
                </button>

                <a
                  href={GITHUB_PAGES_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white text-xs font-semibold transition-colors cursor-pointer"
                >
                  <ExternalLink size={13} />
                  <span>Acessar no GitHub Pages</span>
                </a>
              </div>
            </div>

          </div>

          {/* Vantagens */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2">
            <div className="bg-slate-950/40 p-3 rounded-2xl border border-slate-800 space-y-1">
              <div className="flex items-center gap-1.5 text-sky-400 font-bold text-xs">
                <ShieldCheck size={14} />
                <span>Zero Trust</span>
              </div>
              <p className="text-[11px] text-slate-400 leading-snug">
                Autenticação com Microsoft Authenticator e rastreamento integral de movimentações.
              </p>
            </div>

            <div className="bg-slate-950/40 p-3 rounded-2xl border border-slate-800 space-y-1">
              <div className="flex items-center gap-1.5 text-emerald-400 font-bold text-xs">
                <Laptop size={14} />
                <span>61 Ativos Salvos</span>
              </div>
              <p className="text-[11px] text-slate-400 leading-snug">
                Histórico completo com Lenovo E14, monitores Dell e periféricos mantidos com segurança.
              </p>
            </div>

            <div className="bg-slate-950/40 p-3 rounded-2xl border border-slate-800 space-y-1">
              <div className="flex items-center gap-1.5 text-indigo-400 font-bold text-xs">
                <Smartphone size={14} />
                <span>Mobile & Desktop</span>
              </div>
              <p className="text-[11px] text-slate-400 leading-snug">
                Assinatura na tela de toque, leitor de código de barras pela câmera e emissão de PDFs.
              </p>
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/60 flex items-center justify-between">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-slate-400 hover:text-white text-xs font-medium transition-colors cursor-pointer"
          >
            Fechar
          </button>

          <div className="flex items-center gap-2">
            <a
              href={urls.standaloneUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-sky-600 to-emerald-600 hover:from-sky-500 hover:to-emerald-500 text-white font-bold text-xs shadow-lg shadow-sky-600/30 transition-all cursor-pointer"
            >
              <ExternalLink size={14} />
              <span>Abrir em Janela Independente Agora</span>
            </a>
          </div>
        </div>

      </div>
    </div>
  );
};
