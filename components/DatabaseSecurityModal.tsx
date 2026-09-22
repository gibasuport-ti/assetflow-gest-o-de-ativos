import React from 'react';
import { ShieldCheck, Lock, CheckCircle2, AlertTriangle, Key, Database, Github, Server, X } from 'lucide-react';

interface DatabaseSecurityModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUserEmail?: string;
}

export const DatabaseSecurityModal: React.FC<DatabaseSecurityModalProps> = ({
  isOpen,
  onClose,
  currentUserEmail = 'gibasuporte@gmail.com'
}) => {
  if (!isOpen) return null;

  const isMasterUser = 
    currentUserEmail.toLowerCase().trim() === 'gibasuporte@gmail.com' ||
    currentUserEmail.toLowerCase().trim() === 'gilberto.araujo.ext@ciriontechnologies.com';

  return (
    <div className="fixed inset-0 z-[600] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-white dark:bg-dracula-dark rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-purple-500/30 p-6 md:p-8 space-y-6 relative">
        
        {/* Botão Fechar */}
        <button
          onClick={onClose}
          className="absolute right-5 top-5 p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-dracula-bg transition-colors"
          title="Fechar"
        >
          <X size={20} />
        </button>

        {/* Cabeçalho */}
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-600 text-white flex items-center justify-center shadow-lg shadow-purple-500/30">
            <ShieldCheck size={32} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black tracking-wider uppercase bg-purple-100 text-purple-700 dark:bg-purple-900/50 dark:text-purple-300">
                Segurança Nível Zero-Trust
              </span>
              <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" /> Ativo
              </span>
            </div>
            <h3 className="text-xl font-black text-slate-900 dark:text-dracula-fg tracking-tight">
              Blindagem da Base de Dados & GitHub
            </h3>
            <p className="text-xs text-slate-500 dark:text-dracula-comment">
              Controle estrito de escrita e proteção contra acesso não autorizado
            </p>
          </div>
        </div>

        {/* Status do Usuário Atual */}
        <div className={`p-4 rounded-2xl border flex items-center justify-between gap-3 ${
          isMasterUser 
            ? 'bg-emerald-50 border-emerald-200 dark:bg-emerald-950/30 dark:border-emerald-800/40 text-emerald-900 dark:text-emerald-300' 
            : 'bg-amber-50 border-amber-200 dark:bg-amber-950/30 dark:border-amber-800/40 text-amber-900 dark:text-amber-300'
        }`}>
          <div className="flex items-center gap-3">
            <Key size={20} className={isMasterUser ? 'text-emerald-600 dark:text-emerald-400' : 'text-amber-600 dark:text-amber-400'} />
            <div>
              <p className="text-xs font-bold">
                Usuário Conectado: <span className="font-mono">{currentUserEmail}</span>
              </p>
              <p className="text-[11px] opacity-90">
                {isMasterUser 
                  ? 'Permissão Total: Administrador Master com autorização exclusiva de escrita e edição.' 
                  : 'Modo Protegido: Apenas leitura. Operações de gravação, edição e exclusão estão restritas a gibasuporte@gmail.com.'}
              </p>
            </div>
          </div>
        </div>

        {/* 3 Pilares da Blindagem */}
        <div className="space-y-4">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Camadas de Segurança Implementadas
          </h4>

          {/* Camada 1: Firestore Security Rules */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-dracula-bg border border-slate-200 dark:border-dracula-current space-y-2">
            <div className="flex items-center gap-2">
              <Database size={16} className="text-indigo-600 dark:text-indigo-400" />
              <h5 className="font-bold text-xs text-slate-800 dark:text-dracula-fg">
                1. Regras de Segurança do Firebase Firestore (firestore.rules)
              </h5>
            </div>
            <p className="text-xs text-slate-600 dark:text-dracula-comment leading-relaxed">
              O arquivo oficial <code className="px-1.5 py-0.5 rounded bg-slate-200 dark:bg-dracula-darker font-mono text-[10px]">firestore.rules</code> foi atualizado e implantado na nuvem com a função <code className="px-1.5 py-0.5 rounded bg-slate-200 dark:bg-dracula-darker font-mono text-[10px]">isOnlyGibaSuporte()</code>. Qualquer tentativa de inserção, modificação ou exclusão de dados originada por outro token ou usuário é <strong>bloqueada imediatamente no nível de banco de dados</strong> com erro <em>PERMISSION_DENIED</em>.
            </p>
          </div>

          {/* Camada 2: Servidor Node.js / Express Zero-Trust */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-dracula-bg border border-slate-200 dark:border-dracula-current space-y-2">
            <div className="flex items-center gap-2">
              <Server size={16} className="text-blue-600 dark:text-blue-400" />
              <h5 className="font-bold text-xs text-slate-800 dark:text-dracula-fg">
                2. Servidor Node.js com Middleware Zero-Trust (server.ts)
              </h5>
            </div>
            <p className="text-xs text-slate-600 dark:text-dracula-comment leading-relaxed">
              Todas as rotas de modificação da API (<code className="px-1 py-0.5 rounded bg-slate-200 dark:bg-dracula-darker font-mono text-[10px]">/api/sharepoint/exchanges</code>, <code className="px-1 py-0.5 rounded bg-slate-200 dark:bg-dracula-darker font-mono text-[10px]">/api/sharepoint/users</code>, <code className="px-1 py-0.5 rounded bg-slate-200 dark:bg-dracula-darker font-mono text-[10px]">/api/sharepoint/restore-baseline</code>) são protegidas pelo middleware <code className="px-1 py-0.5 rounded bg-slate-200 dark:bg-dracula-darker font-mono text-[10px]">authorizeDatabaseWrite</code>, respondendo com <strong>HTTP 403 Forbidden</strong> caso a requisição não seja de <strong>gibasuporte@gmail.com</strong>.
            </p>
          </div>

          {/* Camada 3: Blindagem no GitHub */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-dracula-bg border border-slate-200 dark:border-dracula-current space-y-2">
            <div className="flex items-center gap-2">
              <Github size={16} className="text-slate-800 dark:text-slate-200" />
              <h5 className="font-bold text-xs text-slate-800 dark:text-dracula-fg">
                3. Blindagem Absoluta contra Vazamento no GitHub (.gitignore)
              </h5>
            </div>
            <p className="text-xs text-slate-600 dark:text-dracula-comment leading-relaxed">
              O arquivo <code className="px-1.5 py-0.5 rounded bg-slate-200 dark:bg-dracula-darker font-mono text-[10px]">.gitignore</code> foi blindado para que <strong>nenhum banco de dados local</strong> (<code className="text-[10px]">sharepoint_db.json</code>, <code className="text-[10px]">emails_db.json</code>, <code className="text-[10px]">audit_logs.json</code>, <code className="text-[10px]">*.db</code>, <code className="text-[10px]">*.sqlite</code>, <code className="text-[10px]">*.bak</code>), PDFs de termos assinados (<code className="text-[10px]">Cartas_Firmadas_Local/</code>, <code className="text-[10px]">*.pdf</code>) ou arquivos de segredo (<code className="text-[10px]">.env*</code>, <code className="text-[10px]">firebase-adminsdk*.json</code>) possam ser enviados ou expostos no repositório GitHub.
            </p>
          </div>
        </div>

        {/* Guia de Repositório Privado no GitHub */}
        <div className="p-4 rounded-2xl bg-purple-500/10 border border-purple-500/30 space-y-2">
          <div className="flex items-center gap-2 text-purple-700 dark:text-purple-300 font-bold text-xs">
            <Lock size={15} />
            <span>Recomendação de Repositório Privado no GitHub:</span>
          </div>
          <ol className="text-xs text-slate-700 dark:text-dracula-fg space-y-1 list-decimal list-inside leading-relaxed">
            <li>No GitHub, acesse seu repositório <code className="font-mono text-[11px] text-purple-600 dark:text-purple-400">gibasuport-ti/AssetFlow</code>.</li>
            <li>Vá em <strong>Settings</strong> (Configurações) &gt; role até o final em <strong>Danger Zone</strong>.</li>
            <li>Em <strong>Change repository visibility</strong>, selecione <strong>Make private</strong>.</li>
            <li>Dessa forma, somente a sua conta terá visibilidade e acesso aos commits e configurações.</li>
          </ol>
        </div>

        {/* Rodapé com Botão de Confirmação */}
        <div className="flex justify-end pt-2">
          <button
            onClick={onClose}
            className="px-6 py-3 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-lg shadow-purple-600/30 transition-all cursor-pointer"
          >
            Entendido e Confirmado
          </button>
        </div>

      </div>
    </div>
  );
};
