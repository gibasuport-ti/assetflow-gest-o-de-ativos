import { AppUrls } from '../types';

/**
 * Serviço responsável por gerenciar e resolver as URLs de execução da aplicação,
 * permitindo que o usuário execute o AssetFlow fora da plataforma de desenvolvimento
 * (AI Studio / iframe sandbox) em modo standalone, instalado como PWA ou em produção permanente.
 */
export const PROD_STANDALONE_URL = 'https://ais-pre-lgs7bvr5nueqhnb5fgrdow-28350001985.us-west1.run.app';
export const DEV_CONTAINER_URL = 'https://ais-dev-lgs7bvr5nueqhnb5fgrdow-28350001985.us-west1.run.app';
export const GITHUB_PAGES_URL = 'https://gibasuport-ti.github.io/AssetFlow';

export class UrlService {
  private deferredPrompt: any = null;

  constructor() {
    if (typeof window !== 'undefined') {
      window.addEventListener('beforeinstallprompt', (e) => {
        e.preventDefault();
        this.deferredPrompt = e;
      });
    }
  }

  /**
   * Detecta se a aplicação está rodando embutida em um iframe (como no AI Studio)
   */
  public isRunningInIframe(): boolean {
    if (typeof window === 'undefined') return false;
    try {
      return window.self !== window.top;
    } catch (e) {
      return true;
    }
  }

  /**
   * Verifica se o navegador suporta e está pronto para instalação como PWA
   */
  public canInstallPwa(): boolean {
    return !!this.deferredPrompt;
  }

  /**
   * Aciona a janela nativa de instalação do aplicativo no dispositivo
   */
  public async promptPwaInstall(): Promise<boolean> {
    if (!this.deferredPrompt) {
      return false;
    }
    try {
      this.deferredPrompt.prompt();
      const { outcome } = await this.deferredPrompt.userChoice;
      this.deferredPrompt = null;
      return outcome === 'accepted';
    } catch (err) {
      console.warn('Erro ao acionar instalação PWA:', err);
      return false;
    }
  }

  /**
   * Obtém as URLs de produção e desenvolvimento configuradas
   */
  public getAppUrls(): AppUrls {
    const isIframe = this.isRunningInIframe();

    const windowEnv = typeof window !== 'undefined' ? (window as any) : {};
    const metaEnv = typeof import.meta !== 'undefined' ? (import.meta as any).env || {} : {};

    const rawShared = windowEnv.SHARED_APP_URL || metaEnv.SHARED_APP_URL || metaEnv.VITE_SHARED_APP_URL || PROD_STANDALONE_URL;
    const rawDev = windowEnv.APP_URL || metaEnv.APP_URL || metaEnv.VITE_APP_URL || DEV_CONTAINER_URL;

    const sharedAppUrl = this.sanitizeUrl(rawShared, PROD_STANDALONE_URL);
    const devAppUrl = this.sanitizeUrl(rawDev, DEV_CONTAINER_URL);
    const githubPagesUrl = GITHUB_PAGES_URL;

    // A melhor URL para execução independente:
    // Se o usuário estiver no GitHub Pages ou em outro domínio fora do AI Studio, usa o origin atual.
    let standaloneUrl = '';
    if (typeof window !== 'undefined' && window.location.origin && !window.location.origin.includes('aistudio.google.com')) {
      standaloneUrl = window.location.origin;
    } else {
      standaloneUrl = sharedAppUrl || GITHUB_PAGES_URL || DEV_CONTAINER_URL;
    }

    return {
      standaloneUrl,
      sharedAppUrl,
      devAppUrl,
      githubPagesUrl,
      isInIframe: isIframe,
      canInstallPwa: this.canInstallPwa()
    };
  }

  /**
   * Retorna a melhor URL para rodar o app fora da plataforma de desenvolvimento
   */
  public getStandaloneAppUrl(): string {
    return this.getAppUrls().standaloneUrl;
  }

  /**
   * Abre o aplicativo diretamente em uma nova aba fora do ambiente de desenvolvimento
   */
  public openStandaloneApp(): void {
    const url = this.getStandaloneAppUrl();
    if (typeof window !== 'undefined') {
      window.open(url, '_blank', 'noopener,noreferrer');
    }
  }

  /**
   * Copia a URL de execução externa para a área de transferência
   */
  public async copyStandaloneLink(targetUrl?: string): Promise<boolean> {
    const url = targetUrl || this.getStandaloneAppUrl();
    if (typeof navigator !== 'undefined' && navigator.clipboard && navigator.clipboard.writeText) {
      try {
        await navigator.clipboard.writeText(url);
        return true;
      } catch (e) {
        console.warn('Falha ao usar clipboard API:', e);
      }
    }
    
    // Fallback manual
    if (typeof window !== 'undefined') {
      prompt('Copie o link para rodar fora da plataforma de desenvolvimento:', url);
      return true;
    }
    return false;
  }

  private sanitizeUrl(url: string | undefined, fallback: string): string {
    if (!url || typeof url !== 'string' || !url.trim()) return fallback;
    try {
      const parsed = new URL(url.trim());
      parsed.searchParams.delete('fullscreenApplet');
      parsed.searchParams.delete('showPreview');
      parsed.searchParams.delete('showAssistant');
      parsed.searchParams.delete('showFullscreenButton');
      return parsed.toString();
    } catch (e) {
      return url.trim();
    }
  }
}

export const urlService = new UrlService();
