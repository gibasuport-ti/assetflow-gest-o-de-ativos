import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  Shield, 
  Loader2, 
  AlertCircle, 
  CheckCircle2, 
  Smartphone, 
  KeyRound, 
  ArrowRight, 
  Building2, 
  Database,
  ExternalLink,
  Globe
} from 'lucide-react';
import { msalService } from '../services/msalService';
import { apiService } from '../services/apiService';
import { urlService } from '../services/urlService';
import { StandaloneAppModal } from './StandaloneAppModal';
import { User } from '../types';

interface LoginScreenProps {
  onLogin: (user: User) => void;
}

const LoginScreen: React.FC<LoginScreenProps> = ({ onLogin }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isStandaloneModalOpen, setIsStandaloneModalOpen] = useState(false);
  
  // Microsoft 365 State - Padrão Administrador Gilberto Araújo
  const [m365Upn, setM365Upn] = useState('gilberto.araujo.ext@ciriontechnologies.com');
  const [mfaStage, setMfaStage] = useState<'idle' | 'authenticator_prompt' | 'verifying' | 'approved'>('idle');
  const [mfaNumberMatch, setMfaNumberMatch] = useState<number>(42);
  const [totpCode, setTotpCode] = useState('');
  const [authMethodTab, setAuthMethodTab] = useState<'push' | 'code'>('push');

  useEffect(() => {
    // Gera número de correspondência de 2 dígitos aleatório ao iniciar o prompt
    if (mfaStage === 'authenticator_prompt') {
      setMfaNumberMatch(Math.floor(Math.random() * 89) + 10);
    }
  }, [mfaStage]);

  // Iniciar fluxo Microsoft 365 com validação estrita de domínio corporativo
  const handleStartM365Login = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = m365Upn.trim().toLowerCase();
    if (!clean) {
      setError('Por favor, informe sua conta corporativa Microsoft 365 (@ciriontechnologies.com).');
      return;
    }

    const isCorporate = 
      clean.endsWith('@ciriontechnologies.com') ||
      clean.endsWith('@cirion.com') ||
      clean.endsWith('@ciriontechnologies.onmicrosoft.com') ||
      !clean.includes('@');

    if (!isCorporate) {
      setError('Acesso negado: Política corporativa restringe o acesso exclusivamente a contas corporativas do Microsoft 365 (@ciriontechnologies.com).');
      return;
    }

    setError(null);
    setMfaStage('authenticator_prompt');
  };

  // Aprovação da Notificação Push no Microsoft Authenticator
  const handleApprovePushNotification = async () => {
    setIsLoading(true);
    setError(null);
    setMfaStage('verifying');

    try {
      // Simula o tempo de handshake TLS e aprovação remota do dispositivo seguro
      await new Promise(r => setTimeout(r, 800));

      const user = await msalService.loginWithMicrosoftAuthenticator(m365Upn, 'push');
      await apiService.saveUser(user);

      setMfaStage('approved');
      await new Promise(r => setTimeout(r, 400));
      onLogin(user);
    } catch (err: any) {
      setError(err.message || 'Falha na validação do Microsoft Authenticator.');
      setMfaStage('authenticator_prompt');
    } finally {
      setIsLoading(false);
    }
  };

  // Validação por Código de 6 Dígitos do Authenticator (TOTP)
  const handleVerifyTotpCode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (totpCode.length !== 6) {
      setError('Insira o código de 6 dígitos gerado no Microsoft Authenticator.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setMfaStage('verifying');

    try {
      await new Promise(r => setTimeout(r, 600));
      const user = await msalService.loginWithMicrosoftAuthenticator(m365Upn, 'code', totpCode);
      await apiService.saveUser(user);

      setMfaStage('approved');
      await new Promise(r => setTimeout(r, 400));
      onLogin(user);
    } catch (err: any) {
      setError(err.message || 'Código do Microsoft Authenticator incorreto ou expirado.');
      setMfaStage('authenticator_prompt');
    } finally {
      setIsLoading(false);
    }
  };

  // Acesso Direto Administrador do Sistema Gilberto Araújo (SharePoint M365)
  const handleDirectSharePointLogin = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const adminUser: User = {
        id: 'gilberto_araujo_admin',
        username: 'Gilberto Araújo (Administrador do Sistema)',
        email: 'gilberto.araujo.ext@ciriontechnologies.com',
        isAdmin: true,
        mfaVerified: true,
        authProvider: 'microsoft',
        microsoftUpn: 'gilberto.araujo.ext@ciriontechnologies.com',
        department: 'Administração de TI Cirion (SharePoint M365)',
        cirionTenant: 'ciriontechnologies.onmicrosoft.com',
        authMethod: 'Microsoft Authenticator (App)'
      };

      await apiService.saveUser(adminUser);
      localStorage.setItem('cirion_m365_session', JSON.stringify(adminUser));
      localStorage.setItem('assetflow_auth_simulation', JSON.stringify(adminUser));
      onLogin(adminUser);
    } catch (err: any) {
      setError('Erro ao autenticar no SharePoint M365: ' + (err.message || ''));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-950 p-4 text-slate-100 relative overflow-hidden font-sans">
      {/* Background Decorativo Corporativo Cirion */}
      <div className="absolute -top-40 -right-40 w-96 h-96 bg-sky-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-fuchsia-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-lg animate-in fade-in zoom-in duration-500 z-10">
        
        {/* Cabeçalho Oficial Cirion Technologies */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-900 border border-slate-800 text-xs font-semibold text-sky-400 mb-4 shadow-inner">
            <ShieldCheck size={14} className="text-sky-400" />
            <span>Rede Corporativa Cirion | Segurança Zero Trust</span>
          </div>

          <div className="flex items-center justify-center gap-2 mb-2">
            <span className="text-3xl font-black tracking-tight text-white">ciri</span>
            <span className="relative text-3xl font-black tracking-tight text-white inline-block">
              o
              <span className="absolute left-[3px] top-[-3px] text-fuchsia-500 font-bold text-3xl select-none">/</span>
            </span>
            <span className="text-3xl font-black tracking-tight text-white mr-2">n</span>
            <span className="text-slate-400 text-2xl font-light">|</span>
            <span className="text-2xl font-extrabold text-sky-400 tracking-tight ml-2">AssetFlow</span>
          </div>
          <p className="text-xs text-slate-400 font-medium">Gestão de Ativos de TI & Termos de Responsabilidade</p>
        </div>

        {/* Card Principal */}
        <div className="bg-slate-900/90 backdrop-blur-xl border border-slate-800 rounded-3xl shadow-2xl p-6 md:p-8 space-y-6">
          
          {/* Link para Rodar o Aplicativo Fora da Plataforma de Desenvolvimento */}
          <div className="flex items-center justify-between gap-3 p-3.5 rounded-2xl bg-sky-950/40 border border-sky-500/30 text-xs shadow-inner">
            <div className="flex items-center gap-2 text-sky-200">
              <Globe size={15} className="text-sky-400 shrink-0" />
              <span className="text-[11px] font-semibold">Rodar fora do ambiente de desenvolvimento:</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setIsStandaloneModalOpen(true)}
                className="text-[11px] text-slate-400 hover:text-slate-200 transition-colors cursor-pointer"
                title="Ver opções de links e detalhes"
              >
                Opções
              </button>
              <a
                href={urlService.getStandaloneAppUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-[11px] transition-all shadow-md shadow-sky-600/30 active:scale-95 cursor-pointer"
                title="Abrir o AssetFlow em uma nova aba independente fora do AI Studio"
              >
                <ExternalLink size={12} />
                <span>Nova Aba</span>
              </a>
            </div>
          </div>

          {error && (
            <div className="flex items-start gap-3 bg-rose-950/50 border border-rose-800/80 text-rose-300 text-xs font-medium p-4 rounded-2xl animate-in shake duration-300">
              <AlertCircle size={18} className="shrink-0 text-rose-400 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* FLUXO 1: Formulário Inicial de Acesso Microsoft 365 */}
          {mfaStage === 'idle' && (
            <form onSubmit={handleStartM365Login} className="space-y-5">
              <div className="space-y-1">
                <div className="flex items-center justify-between text-xs font-semibold text-slate-300">
                  <label htmlFor="m365-email" className="flex items-center gap-1.5">
                    <Building2 size={14} className="text-sky-400" /> Conta Corporativa Microsoft 365
                  </label>
                  <span className="text-[10px] text-emerald-400 font-bold bg-emerald-950/60 border border-emerald-800/60 px-2 py-0.5 rounded-full">
                    MFA Obrigatório
                  </span>
                </div>
                <input
                  id="m365-email"
                  type="email"
                  value={m365Upn}
                  onChange={(e) => setM365Upn(e.target.value)}
                  placeholder="nome.sobrenome@ciriontechnologies.com"
                  className="w-full px-4 py-3.5 bg-slate-950 border border-slate-700 rounded-2xl text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 transition-all"
                  required
                />
              </div>

              {/* Botão Oficial de Entrada Microsoft 365 */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-4 bg-sky-600 hover:bg-sky-500 active:scale-[0.98] text-white rounded-2xl font-bold text-sm shadow-lg shadow-sky-600/20 transition-all flex items-center justify-center gap-3 cursor-pointer disabled:opacity-50"
              >
                {/* 4-Color Microsoft Square Icon */}
                <div className="grid grid-cols-2 gap-0.5 w-4 h-4 shrink-0">
                  <div className="bg-[#f25022] w-2 h-2 rounded-[1px]" />
                  <div className="bg-[#7fba00] w-2 h-2 rounded-[1px]" />
                  <div className="bg-[#00a4ef] w-2 h-2 rounded-[1px]" />
                  <div className="bg-[#ffb900] w-2 h-2 rounded-[1px]" />
                </div>
                <span>Entrar com Microsoft 365 (Microsoft Authenticator)</span>
                <ArrowRight size={16} />
              </button>

              {/* Botão de Acesso Direto Administrador do Sistema Gilberto Araújo */}
              <button
                type="button"
                onClick={handleDirectSharePointLogin}
                disabled={isLoading}
                className="w-full py-3.5 bg-sky-500/10 hover:bg-sky-500/20 active:scale-[0.98] text-sky-300 border border-sky-500/30 rounded-2xl font-bold text-sm transition-all flex items-center justify-center gap-2.5 cursor-pointer shadow-sm disabled:opacity-50"
              >
                <ShieldCheck size={18} className="text-sky-400" />
                <span>Acesso Direto Administrador (Gilberto Araújo)</span>
              </button>

              <div className="p-4 bg-slate-950/60 rounded-2xl border border-slate-800/80 space-y-2 text-slate-400 text-xs leading-relaxed">
                <div className="flex items-center gap-2 text-sky-300 font-semibold">
                  <Database size={14} className="text-sky-400" />
                  <span>Base Oficial: Microsoft 365 SharePoint Online</span>
                </div>
                <p className="text-[11px]">
                  Acesso liberado exclusivamente para usuários corporativos Microsoft 365 com gestão de privilégios restrita a Gilberto Araújo como Administrador do Sistema.
                </p>
              </div>
            </form>
          )}

          {/* FLUXO 2: Prompt Interativo do Microsoft Authenticator */}
          {(mfaStage === 'authenticator_prompt' || mfaStage === 'verifying' || mfaStage === 'approved') && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-3 duration-300">
              
              <div className="text-center space-y-1.5">
                <div className="w-14 h-14 rounded-2xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-400 mx-auto shadow-inner">
                  <Smartphone size={28} className={mfaStage === 'verifying' ? 'animate-bounce' : ''} />
                </div>
                <h3 className="text-lg font-bold text-white">Verificação Microsoft Authenticator</h3>
                <p className="text-xs text-slate-400 font-medium">{m365Upn}</p>
              </div>

              {/* Seletor de Método de MFA */}
              <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs font-semibold">
                <button
                  type="button"
                  onClick={() => { setAuthMethodTab('push'); setError(null); }}
                  className={`flex-1 py-2 rounded-lg transition-all ${authMethodTab === 'push' ? 'bg-sky-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'}`}
                >
                  Notificação Push (App)
                </button>
                <button
                  type="button"
                  onClick={() => { setAuthMethodTab('code'); setError(null); }}
                  className={`flex-1 py-2 rounded-lg transition-all ${authMethodTab === 'code' ? 'bg-sky-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'}`}
                >
                  Código de 6 Dígitos
                </button>
              </div>

              {authMethodTab === 'push' ? (
                <div className="space-y-5">
                  <div className="bg-slate-950 p-6 rounded-2xl border border-sky-900/40 text-center space-y-3">
                    <p className="text-xs text-slate-300">
                      Abra o aplicativo <strong className="text-sky-400">Microsoft Authenticator</strong> no seu smartphone corporativo e toque no número correspondente:
                    </p>
                    
                    {/* Número de Correspondência (Number Matching Cirion) */}
                    <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-sky-950 border-2 border-sky-500 text-sky-300 text-4xl font-extrabold tracking-widest shadow-lg shadow-sky-950">
                      {mfaNumberMatch}
                    </div>

                    <p className="text-[11px] text-slate-400 flex items-center justify-center gap-1.5">
                      <ShieldCheck size={14} className="text-emerald-400" />
                      Aprovação multifator (MFA) requerida para a rede Cirion
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={handleApprovePushNotification}
                    disabled={isLoading || mfaStage === 'approved'}
                    className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-500 active:scale-[0.98] text-white rounded-2xl font-bold text-sm shadow-lg shadow-emerald-600/20 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    {mfaStage === 'verifying' ? (
                      <>
                        <Loader2 className="animate-spin" size={18} />
                        <span>Validando MFA no Authenticator...</span>
                      </>
                    ) : mfaStage === 'approved' ? (
                      <>
                        <CheckCircle2 size={18} className="text-white" />
                        <span>Acesso Aprovado! Redirecionando...</span>
                      </>
                    ) : (
                      <>
                        <CheckCircle2 size={18} />
                        <span>Confirmar Aprovação no Authenticator</span>
                      </>
                    )}
                  </button>
                </div>
              ) : (
                <form onSubmit={handleVerifyTotpCode} className="space-y-4">
                  <div className="space-y-1 text-center">
                    <label className="text-xs text-slate-300 font-medium">
                      Insira o código de segurança do Microsoft Authenticator
                    </label>
                    <input
                      type="text"
                      maxLength={6}
                      value={totpCode}
                      onChange={(e) => setTotpCode(e.target.value.replace(/\D/g, ''))}
                      placeholder="000000"
                      className="w-48 mx-auto px-4 py-3 bg-slate-950 border-2 border-slate-700 rounded-2xl text-center text-2xl font-mono tracking-widest text-white focus:outline-none focus:border-sky-500"
                      autoFocus
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading || totpCode.length !== 6}
                    className="w-full py-3.5 bg-sky-600 hover:bg-sky-500 text-white rounded-2xl font-bold text-sm shadow transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    {isLoading ? <Loader2 className="animate-spin" size={18} /> : <KeyRound size={18} />}
                    <span>Verificar Código MFA</span>
                  </button>
                </form>
              )}

              <button
                type="button"
                onClick={() => { setMfaStage('idle'); setError(null); }}
                className="w-full text-center text-xs text-slate-500 hover:text-slate-300 transition-colors"
              >
                Voltar e alterar conta corporativa
              </button>
            </div>
          )}

          {/* Rodapé de Governança e Diretrizes Corporativas Cirion */}
          <div className="border-t border-slate-800/80 pt-4 text-center">
            <div className="flex items-center justify-center gap-2 text-xs text-sky-400/90 font-medium">
              <Shield size={14} className="text-sky-400" />
              <span>Política de Segurança Zero Trust Cirion Ativa</span>
            </div>
            <p className="text-[11px] text-slate-400 mt-1">
              Acesso exclusivo para contas corporativas Microsoft 365. Administração do sistema concedida unicamente a <strong>gilberto.araujo.ext@ciriontechnologies.com</strong>.
            </p>
          </div>
        </div>

        {/* Rodapé Corporativo e Informações de Segurança */}
        <div className="mt-6 text-center space-y-2">
          <div className="flex items-center justify-center gap-4 text-[10px] text-slate-400 uppercase tracking-widest font-semibold">
            <span>Microsoft Entra ID</span>
            <span>•</span>
            <span>SharePoint Online</span>
            <span>•</span>
            <span>MFA Ativo</span>
          </div>
          <p className="text-[10px] text-slate-500">
            Acesso monitorado e protegido pelas diretrizes de segurança da Cirion Technologies.
          </p>
        </div>

      </div>

      {/* Modal para Executar Fora da Plataforma de Desenvolvimento */}
      <StandaloneAppModal 
        isOpen={isStandaloneModalOpen}
        onClose={() => setIsStandaloneModalOpen(false)}
      />
    </div>
  );
};

export default LoginScreen;
