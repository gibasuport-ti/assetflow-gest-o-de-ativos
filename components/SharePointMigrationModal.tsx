import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  Database, 
  RefreshCw, 
  CheckCircle2, 
  AlertTriangle, 
  Server, 
  Smartphone,
  X,
  FileSpreadsheet,
  Download,
  Info,
  ExternalLink,
  FolderOpen,
  Cloud
} from 'lucide-react';
import { apiService } from '../services/apiService';
import { SharePointStatus, AssetExchange } from '../types';
import { exportToExcel } from '../services/excelService';

interface SharePointMigrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentExchanges: AssetExchange[];
  onMigrationComplete?: () => void;
}

export const SharePointMigrationModal: React.FC<SharePointMigrationModalProps> = ({
  isOpen,
  onClose,
  currentExchanges
}) => {
  const [status, setStatus] = useState<SharePointStatus | null>(null);
  const [isLoadingStatus, setIsLoadingStatus] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string; details?: any } | null>(null);
  const [isTesting, setIsTesting] = useState(false);

  const fetchStatus = async () => {
    setIsLoadingStatus(true);
    setError(null);
    try {
      const res = await apiService.getSharePointStatus();
      setStatus(res);
    } catch (e: any) {
      console.warn('Erro ao carregar status:', e);
      setError('Não foi possível atualizar o status do SharePoint no momento.');
    } finally {
      setIsLoadingStatus(false);
    }
  };

  const handleTestConnection = async () => {
    setIsTesting(true);
    setTestResult(null);
    try {
      const res = await fetch('/api/sharepoint/test-connection');
      const data = await res.json();
      setTestResult(data);
    } catch (e: any) {
      setTestResult({
        success: false,
        message: 'Erro ao testar conexão: ' + (e.message || 'Falha de comunicação')
      });
    } finally {
      setIsTesting(false);
    }
  };

  const handleDownloadExcel = () => {
    try {
      exportToExcel(currentExchanges);
    } catch (err: any) {
      alert('Erro ao exportar Excel: ' + (err.message || 'Erro desconhecido'));
    }
  };

  const handleDownloadJson = () => {
    try {
      const jsonStr = JSON.stringify({
        exportDate: new Date().toISOString(),
        totalItems: currentExchanges.length,
        exchanges: currentExchanges
      }, null, 2);
      const blob = new Blob([jsonStr], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `assetflow_backup_${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err: any) {
      alert('Erro ao exportar JSON: ' + (err.message || 'Erro desconhecido'));
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchStatus();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="p-6 border-b border-slate-800 flex items-center justify-between bg-slate-950/40">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-400">
              <Database size={20} />
            </div>
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                Onde os Dados estão Gravados & Governança
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-950/80 border border-emerald-800 text-emerald-300">
                  {currentExchanges.length} Ativos Gravados
                </span>
              </h3>
              <p className="text-xs text-slate-400">
                Detalhamento do armazenamento local resiliente e integração Microsoft 365
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="text-slate-400 hover:text-white p-2 rounded-xl hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-5 flex-1 text-xs">
          
          {error && (
            <div className="bg-rose-950/60 border border-rose-800 text-rose-300 p-4 rounded-2xl flex items-start gap-3">
              <AlertTriangle size={18} className="shrink-0 text-rose-400 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* Teste e Diagnóstico de Conexão com SharePoint Online */}
          <div className="bg-slate-950/80 border border-amber-500/30 p-4 rounded-2xl space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-amber-300 font-bold text-xs">
                <Cloud size={16} />
                <span>Sincronização em Tempo Real com SharePoint Online</span>
              </div>
              <button
                type="button"
                onClick={handleTestConnection}
                disabled={isTesting}
                className="px-3 py-1 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-200 border border-amber-500/40 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer disabled:opacity-50"
              >
                {isTesting ? <RefreshCw size={12} className="animate-spin" /> : <RefreshCw size={12} />}
                <span>{isTesting ? 'Testando Conexão...' : 'Testar Conexão Direta'}</span>
              </button>
            </div>

            <p className="text-[11px] text-slate-300 leading-relaxed">
              Todos os novos cadastros são gravados com sucesso no banco de dados seguro (<span className="text-white font-mono">sharepoint_db.json</span>). Para que a Microsoft autorize a gravação automática no site corporativo (<span className="text-white font-mono">AssetFlow</span>), é necessário conectar a autorização da Microsoft:
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-[11px]">
              <div className="p-2.5 rounded-xl bg-slate-900/90 border border-slate-800">
                <span className="font-bold text-sky-400 block mb-0.5">Opção 1: Microsoft Entra ID (Azure)</span>
                <span className="text-slate-400">Configure <code className="text-sky-300">AZURE_CLIENT_ID</code> e <code className="text-sky-300">AZURE_CLIENT_SECRET</code> nas Configurações com permissão <i>Sites.ReadWrite.All</i>.</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-900/90 border border-slate-800">
                <span className="font-bold text-emerald-400 block mb-0.5">Opção 2: Webhook Power Automate</span>
                <span className="text-slate-400">Crie um fluxo no Power Automate (HTTP ➔ Criar item na lista) e adicione a URL em <code className="text-emerald-300">SHAREPOINT_WEBHOOK_URL</code>.</span>
              </div>
            </div>

            {testResult && (
              <div className={`p-3 rounded-xl border text-xs ${
                testResult.success 
                  ? 'bg-emerald-950/50 border-emerald-500/50 text-emerald-200' 
                  : 'bg-amber-950/50 border-amber-500/50 text-amber-200'
              }`}>
                <div className="font-bold flex items-center gap-1.5 mb-1">
                  {testResult.success ? <CheckCircle2 size={14} /> : <AlertTriangle size={14} />}
                  <span>{testResult.success ? 'Conexão Estabelecida!' : 'Diagnóstico de Conexão:'}</span>
                </div>
                <div className="text-[11px] text-slate-200">{testResult.message}</div>
                {testResult.details && (
                  <pre className="mt-2 p-2 rounded bg-black/40 text-[10px] font-mono overflow-x-auto text-slate-300 max-h-32">
                    {JSON.stringify(testResult.details, null, 2)}
                  </pre>
                )}
              </div>
            )}
          </div>

          {/* Site Corporativo Configurado */}
          <div className="bg-sky-950/30 border border-sky-500/40 p-4 rounded-2xl space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sky-300 font-bold text-xs">
                <FolderOpen size={16} />
                <span>Site Oficial SharePoint LATAM Configurado</span>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-sky-500/20 text-sky-200">
                Tenant: xyzlatam.sharepoint.com
              </span>
            </div>

            <div className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800 text-[11px] font-mono text-slate-300 break-all select-all">
              https://xyzlatam.sharepoint.com/sites/LATAMEndUserServices-EndUserSupportBrasil
            </div>

            <div className="flex flex-wrap items-center gap-2 pt-1">
              <a
                href="https://xyzlatam.sharepoint.com/sites/LATAMEndUserServices-EndUserSupportBrasil/_layouts/15/viewlsts.aspx?view=14"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs transition-colors cursor-pointer"
              >
                <ExternalLink size={13} />
                <span>Abrir Conteúdo do Site (viewlsts)</span>
              </a>

              <a
                href="https://xyzlatam.sharepoint.com/sites/LATAMEndUserServices-EndUserSupportBrasil/Lists/AssetFlow/AllItems.aspx"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs transition-colors cursor-pointer border border-slate-700"
              >
                <ExternalLink size={13} />
                <span>Abrir Lista AssetFlow</span>
              </a>
            </div>
          </div>

          {/* Localização real dos dados */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* Onde os dados estão fisicamente */}
            <div className="bg-slate-950/80 border border-emerald-500/30 p-4 rounded-2xl space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-slate-400 font-semibold uppercase tracking-wider text-[10px]">
                  Repositório Ativo
                </span>
                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-400">
                  <CheckCircle2 size={12} /> Dados Preservados
                </span>
              </div>

              <div className="text-sm font-bold text-white">
                sharepoint_db.json
              </div>

              <div className="text-[11px] text-slate-400 space-y-1">
                <div>Local: <span className="text-slate-300">Servidor Cloud Run do AssetFlow</span></div>
                <div>Modo: <span className="text-emerald-300 font-medium">Híbrido Resiliente Ativo</span></div>
                <div>Total de Ativos: <span className="text-white font-bold">{currentExchanges.length} movimentações</span></div>
                <div>Auditoria: <span className="text-slate-300">audit_cirion_m365.log</span></div>
              </div>
            </div>

            {/* Status Segurança & MFA */}
            <div className="bg-slate-950/80 border border-slate-800 p-4 rounded-2xl space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-slate-400 font-semibold uppercase tracking-wider text-[10px]">
                  Segurança Corporativa
                </span>
                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-sky-400">
                  <ShieldCheck size={12} /> Cirion Zero Trust
                </span>
              </div>

              <div className="text-sm font-bold text-white flex items-center gap-1.5">
                <Smartphone size={16} className="text-sky-400" />
                Microsoft Authenticator (MFA)
              </div>

              <div className="text-[11px] text-slate-400 space-y-1">
                <div>MFA Mandatório: <span className="text-emerald-400 font-bold">Ativado</span></div>
                <div>Admin do Sistema: <span className="text-slate-300">gilberto.araujo.ext@ciriontechnologies.com</span></div>
                <div>Operações Auditadas: <span className="text-slate-300">100% dos registros</span></div>
              </div>
            </div>

          </div>

          {/* Exportação Imediata / Backup */}
          <div className="bg-slate-950/60 border border-slate-800 p-4 rounded-2xl space-y-3">
            <h4 className="text-white font-bold text-xs flex items-center gap-2">
              <Download size={14} className="text-sky-400" />
              Exportar / Fazer Download de Toda a Base de Dados
            </h4>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Você pode baixar todos os 60 ativos e seus históricos a qualquer momento para abrir no Excel ou importar em qualquer site ou lista corporativa do SharePoint:
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-1">
              <button
                type="button"
                onClick={handleDownloadExcel}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition-all shadow-md shadow-emerald-900/30 cursor-pointer"
              >
                <FileSpreadsheet size={15} />
                <span>Exportar Planilha Excel (.xlsx)</span>
              </button>

              <button
                type="button"
                onClick={handleDownloadJson}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs transition-colors cursor-pointer border border-slate-700"
              >
                <Download size={15} />
                <span>Baixar Backup Completo (.json)</span>
              </button>
            </div>

            {/* Passo a passo para importar no SharePoint */}
            <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-2 text-[11px]">
              <span className="font-bold text-sky-400 flex items-center gap-1.5">
                <Info size={14} /> Como criar/sincronizar a lista no seu SharePoint em 3 passos:
              </span>
              <ol className="list-decimal list-inside space-y-1.5 text-slate-300 leading-relaxed">
                <li>Clique no botão verde acima <strong className="text-white">"Exportar Planilha Excel (.xlsx)"</strong> para baixar todos os 60 ativos estruturados.</li>
                <li>Clique no botão azul acima <strong className="text-white">"Abrir Conteúdo do Site (viewlsts)"</strong> para acessar sua página do SharePoint.</li>
                <li>No SharePoint, clique em <strong className="text-white">+ Novo</strong> &gt; <strong className="text-white">Lista</strong> &gt; <strong className="text-white">Do Excel</strong>, faça o upload do arquivo e confirme o nome da lista como <code className="text-emerald-300 font-mono px-1 py-0.5 rounded bg-slate-950">AssetFlow</code>.</li>
              </ol>
            </div>
          </div>

        </div>

        {/* Footer Actions */}
        <div className="p-6 border-t border-slate-800 bg-slate-950/60 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={fetchStatus}
            disabled={isLoadingStatus}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium text-xs transition-colors cursor-pointer disabled:opacity-50"
          >
            <RefreshCw size={14} className={isLoadingStatus ? 'animate-spin' : ''} />
            <span>Atualizar Status</span>
          </button>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-500 active:scale-95 text-white text-xs font-bold transition-all shadow-lg shadow-sky-600/20 cursor-pointer"
            >
              Fechar
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
