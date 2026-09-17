import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallbackTitle?: string;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null
    };
  }

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('[ErrorBoundary caught error]:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="p-8 flex flex-col items-center justify-center min-h-[400px] text-center space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-rose-50 dark:bg-rose-950/40 text-rose-500 flex items-center justify-center">
            <AlertTriangle size={28} />
          </div>
          <div className="space-y-1 max-w-md">
            <h3 className="font-bold text-slate-900 dark:text-white text-base">
              {this.props.fallbackTitle || 'Ocorreu uma falha ao exibir este módulo'}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {this.state.error?.message || 'Houve um erro inesperado na renderização.'}
            </p>
          </div>
          <button
            type="button"
            onClick={() => {
              this.setState({ hasError: false, error: null });
              window.location.reload();
            }}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl flex items-center gap-2 cursor-pointer shadow-md transition-all"
          >
            <RefreshCw size={14} /> Recarregar Módulo
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
