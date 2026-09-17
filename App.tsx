
import React, { useState, useEffect } from 'react';
import { PlusCircle, ClipboardList, LogOut, CheckCircle2, AlertCircle, Mail, Loader2, HardDrive, PanelLeftClose, Menu, Image as ImageIcon, Sun, Moon, Settings, ShieldCheck, Maximize, Minimize, FileText, Link, User as UserIcon, Users, Lock, ExternalLink, CreditCard, Database, Smartphone, Globe, Download } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { View, AssetExchange, MockEmail, LogoPreference, User } from './types';
import AssetForm from './components/AssetForm';
import InventoryTable from './components/InventoryTable';
import MockInbox from './components/MockInbox';
import SenderSignatureModal from './components/SenderSignatureModal';
import ConfirmationModal from './components/ConfirmationModal';
import SignaturePortal from './components/SignaturePortal';
import DocuSignAgentModal from './components/DocuSignAgentModal';
import LoginScreen from './components/LoginScreen';
import UserManagement from './components/UserManagement';
import { SharePointMigrationModal } from './components/SharePointMigrationModal';
import { StandaloneAppModal } from './components/StandaloneAppModal';
import ErrorBoundary from './components/ErrorBoundary';
import { apiService } from './services/apiService';
import { msalService } from './services/msalService';
import { urlService } from './services/urlService';
import { MERCADO_PAGO_URL } from './constants';
import { generateAssetPDF, getPDFFileName } from './services/pdfService';
import { generatePromptPDF } from './services/promptPdfService';

// Componente de App principal
const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isAuthReady, setIsAuthReady] = useState(false);
  const [currentView, setCurrentView] = useState<View>('form');
  const [exchanges, setExchanges] = useState<AssetExchange[]>([]);
  const [emails, setEmails] = useState<MockEmail[]>([]);
  const [editingExchange, setEditingExchange] = useState<AssetExchange | null>(null);
  const [signingExchange, setSigningExchange] = useState<AssetExchange | null>(null);
  const [portalExchange, setPortalExchange] = useState<AssetExchange | null>(null);
  const [agentExchange, setAgentExchange] = useState<AssetExchange | null>(null);
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);
  const [itemToComplete, setItemToComplete] = useState<string | null>(null);
  const [notification, setNotification] = useState<{message: string, type: 'success' | 'error'} | null>(null);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isSharePointModalOpen, setIsSharePointModalOpen] = useState(false);
  const [isStandaloneModalOpen, setIsStandaloneModalOpen] = useState(false);
  const [showStartScreen, setShowStartScreen] = useState(() => {
    return window.location.hash === '#fullscreen';
  });
  
  const [isSidebarVisible, setIsSidebarVisible] = useState(() => {
    const saved = localStorage.getItem('sidebar_visible');
    return saved !== null ? JSON.parse(saved) : true;
  });

  const [userName, setUserName] = useState('gibasuporte');

  const [isEditingName, setIsEditingName] = useState(false);
  const [nameInput, setNameInput] = useState('');
  
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    const saved = localStorage.getItem('theme');
    return (saved === 'light' || saved === 'dark') ? saved : 'light';
  });
  
  const [logoPref, setLogoPref] = useState<LogoPreference>(() => {
    const saved = localStorage.getItem('logo_preference');
    return (saved === 'cirion' || saved === 'none') ? saved : 'none';
  });

  const [isSimulatingUser, setIsSimulatingUser] = useState(() => {
    const saved = localStorage.getItem('is_simulating_user');
    return saved === 'true';
  });

  // Assinatura direta para o destinatário via link de e-mail / Outlook (?sign=ID ou ?envelope=ID)
  const [directSigningExchange, setDirectSigningExchange] = useState<AssetExchange | null>(null);
  const [directSigningLoading, setDirectSigningLoading] = useState(false);
  const [directSigningCompleted, setDirectSigningCompleted] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const signId = params.get('sign') || params.get('envelope');
    if (signId) {
      setDirectSigningLoading(true);
      apiService.getExchangeById(signId)
        .then(ex => {
          if (ex) {
            setDirectSigningExchange(ex);
            if (ex.status === 'completed' || Boolean(ex.assinatura_colaborador)) {
              setDirectSigningCompleted(true);
            }
          }
        })
        .catch(err => {
          console.warn('[DocuSign] Erro ao carregar termo para assinatura direta:', err);
        })
        .finally(() => {
          setDirectSigningLoading(false);
        });
    }
  }, []);

  const actualIsAdmin = currentUser?.isAdmin;
  const effectiveIsAdmin = actualIsAdmin && !isSimulatingUser;

  useEffect(() => {
    localStorage.setItem('is_simulating_user', String(isSimulatingUser));
  }, [isSimulatingUser]);

  useEffect(() => {
    // Validação e higienização de sessão corporativa Microsoft 365
    const sanitizeUser = (user: User): User | null => {
      if (!user || !user.email) return null;
      const email = user.email.toLowerCase().trim();
      const isCorporate = 
        email.endsWith('@ciriontechnologies.com') ||
        email.endsWith('@cirion.com') ||
        email.endsWith('@ciriontechnologies.onmicrosoft.com') ||
        email === 'gibasuporte@gmail.com';
      
      if (!isCorporate) {
        return null;
      }

      // Exclusividade de Administrador do Sistema para Gilberto Araújo
      const isSystemAdmin = 
        email === 'gilberto.araujo.ext@ciriontechnologies.com' ||
        email === 'gilberto.araujo.ext' ||
        email === 'gibasuporte@gmail.com';

      return {
        ...user,
        isAdmin: isSystemAdmin,
        authProvider: 'microsoft'
      };
    };

    // Check for Microsoft 365 Entra ID / Authenticator session first
    const m365Session = msalService.getCurrentSession();
    const validM365User = m365Session ? sanitizeUser(m365Session) : null;

    if (validM365User) {
      setCurrentUser(validM365User);
      setUserName(validM365User.username);
      setNameInput(validM365User.username);
      setIsAuthReady(true);
    } else {
      // Check for saved session
      const savedSession = localStorage.getItem('cirion_m365_session') || localStorage.getItem('assetflow_auth_simulation');
      if (savedSession) {
        try {
          const user = JSON.parse(savedSession);
          const validUser = sanitizeUser(user);
          if (validUser) {
            setCurrentUser(validUser);
            setUserName(validUser.username);
            setNameInput(validUser.username);
          } else {
            localStorage.removeItem('assetflow_auth_simulation');
            localStorage.removeItem('cirion_m365_session');
            setCurrentUser(null);
          }
          setIsAuthReady(true);
        } catch (e) {
          localStorage.removeItem('assetflow_auth_simulation');
          localStorage.removeItem('cirion_m365_session');
          setCurrentUser(null);
          setIsAuthReady(true);
        }
      } else {
        setCurrentUser(null);
        setIsAuthReady(true);
      }
    }

    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);

  useEffect(() => {
    if (!currentUser) return;

    setIsInitialLoading(true);
    const unsubscribeExchanges = apiService.subscribeExchanges((data) => {
      setExchanges(data);
      setIsInitialLoading(false);
    });

    const unsubscribeEmails = apiService.subscribeEmails((data) => {
      setEmails(data);
    });

    return () => {
      unsubscribeExchanges();
      unsubscribeEmails();
    };
  }, [currentUser]);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch((err) => {
        console.error(`Erro ao tentar ativar tela cheia: ${err.message}`);
        showNotification("Erro ao ativar tela cheia", "error");
      });
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  };

  const handleShareLink = async () => {
    const standaloneUrl = urlService.getStandaloneAppUrl();
    const copied = await urlService.copyStandaloneLink();
    if (copied) {
      showNotification("Link para rodar fora da plataforma copiado com sucesso!", "success");
    } else {
      setIsStandaloneModalOpen(true);
    }
  };

  useEffect(() => {
    localStorage.setItem('logo_preference', logoPref);
  }, [logoPref]);

  useEffect(() => {
    localStorage.setItem('sidebar_visible', JSON.stringify(isSidebarVisible));
  }, [isSidebarVisible]);

  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const showNotification = (message: string, type: 'success' | 'error' = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 5000);
  };

  const handleLogout = async () => {
    localStorage.removeItem('assetflow_auth_simulation');
    localStorage.removeItem('cirion_m365_session');
    msalService.logout();
    setCurrentUser(null);
    setCurrentView('form');
  };

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('docusign') === 'success') {
      showNotification("Assinatura concluída com sucesso! O documento será processado em breve.", "success");
      // Clean up URL
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, []);

  const [docusignPendingAfterSignature, setDocusignPendingAfterSignature] = useState<string | null>(null);

  const handleSendDocuSignAutomaticFromApp = async (ex: AssetExchange) => {
    setIsLoading(true);
    try {
      showNotification("Gerando o termo em PDF para o DocuSign...", "success");
      const pdf = generateAssetPDF(ex, logoPref);
      if (!pdf) throw new Error("Falha ao gerar PDF");

      const pdfBase64 = pdf.output('datauristring');

      showNotification("Disparando assinatura automatizada (script Python)...", "success");
      const res = await apiService.createDocuSignEnvelope(ex, pdfBase64);

      const envelopeId = res.envelopeId || res.envelope_id;

      if (envelopeId) {
        // Se houver e-mail simulado retornado do backend, salva via cliente para evitar erros de permissão de backend
        if (res.mockEmail) {
          try {
            await apiService.saveEmail(res.mockEmail);
            console.log("[DocuSign Client] E-mail simulado salvo no Firestore com permissões de cliente.");
          } catch (emailErr) {
            console.error("[DocuSign Client] Erro ao registrar e-mail simulado no cliente:", emailErr);
          }
        }

        const updatedExchange: AssetExchange = {
          ...ex,
          status: 'pending_receiver',
          docusign_status: 'pending',
          docusign_envelope_id: envelopeId,
          docusign_file_path: res.message?.includes('Simulado') ? 'Simulado via OneDrive' : undefined
        };

        await apiService.save(updatedExchange);
        setExchanges(prev => prev.map(e => e.id === updatedExchange.id ? updatedExchange : e));
        showNotification(`DocuSign enviado via automação! ID: ${envelopeId}`, "success");
      } else {
        throw new Error(res.message || "Não foi possível obter o ID do envelope.");
      }
    } catch (error: any) {
      console.error(error);
      showNotification(error.message || "Erro no envio rápido do DocuSign", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveExchange = async (exchange: AssetExchange, isDocuSignDirect?: boolean) => {
    setIsLoading(true);
    try {
      const activeExchange = {
        ...exchange,
        id: exchange.id || Math.random().toString(36).substr(2, 9).toUpperCase()
      };

      await apiService.save(activeExchange);
      setEditingExchange(null);
      setCurrentView('inventory');

      if (isDocuSignDirect) {
        showNotification("Registro gravado. Ativando o Agente DocuSign & Outlook...", "success");
        setAgentExchange(activeExchange);
      } else {
        showNotification("Registro gravado.");
      }
    } catch (error) {
      console.error(error);
      showNotification("Erro ao salvar.", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteRequest = (id: string) => {
    setItemToDelete(id);
  };

  const handleCompleteRequest = (id: string) => {
    setItemToComplete(id);
  };

  const confirmDelete = async () => {
    if (!itemToDelete) return;
    setIsLoading(true);
    try {
      await apiService.delete(String(itemToDelete));
      showNotification("Registro removido.", "success");
    } catch (error) {
      console.error("Delete error:", error);
      showNotification("Erro ao remover.", "error");
    } finally {
      setIsLoading(false);
      setItemToDelete(null);
    }
  };

  const handleStatusChange = async (id: string, status: 'draft' | 'pending_receiver' | 'completed') => {
    setIsLoading(true);
    try {
      const exchange = exchanges.find(e => e.id === id);
      
      if (!exchange) {
        showNotification("Registro não encontrado.", "error");
        return;
      }

      const updated: AssetExchange = { ...exchange, status };
      await apiService.save(updated);
      showNotification(`Status atualizado para ${status === 'completed' ? 'Concluído' : status === 'pending_receiver' ? 'Pendente' : 'Rascunho'}.`, "success");
    } catch (error) {
      console.error("Status change error:", error);
      showNotification("Erro ao atualizar status.", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignSender = async (id: string, signature: string) => {
    const exchange = exchanges.find(e => e.id === id);
    if (!exchange) return;
    
    setIsLoading(true);
    try {
      const updated: AssetExchange = { 
          ...exchange, 
          assinatura_ti: signature, 
          status: 'draft' 
      };
      
      await apiService.save(updated);
      
      if (docusignPendingAfterSignature === id) {
        setDocusignPendingAfterSignature(null);
        showNotification("Termo assinado por você! Iniciando envio para DocuSign...", "success");
        await handleSendDocuSignAutomaticFromApp(updated);
      } else {
        showNotification("Termo assinado por você! Agora você pode enviá-lo via Outlook.");
      }
    } catch (error) {
      showNotification("Erro ao assinar.", "error");
    } finally {
      setIsLoading(false);
      setSigningExchange(null);
    }
  };

  const handleCollaboratorSignature = async (signature: string) => {
    if (!portalExchange) return;
    
    setIsLoading(true);
    try {
      const updated: AssetExchange = { 
        ...portalExchange, 
        assinatura_colaborador: signature, 
        status: 'completed',
        docusign_status: 'completed'
      };
      
      const pdf = generateAssetPDF(updated, logoPref);
      let pdfBase64 = '';
      if (pdf) {
        // Baixa no navegador do usuário
        try {
          pdf.save(getPDFFileName(updated));
        } catch (e) {
          console.warn('Falha no download local:', e);
        }
        pdfBase64 = pdf.output('datauristring');
      }

      // Envia confirmação de assinatura do destinatário para o backend
      try {
        await apiService.submitRecipientSignature(
          portalExchange.id,
          signature,
          portalExchange.colaborador_nome,
          pdfBase64
        );
      } catch (submitErr) {
        console.warn('Fallback submitRecipientSignature:', submitErr);
        await apiService.save(updated);
      }
      
      // Atualiza o estado local imediatamente
      setExchanges(prev => prev.map(e => e.id === updated.id ? updated : e));
      
      showNotification("Assinatura confirmada e registrada com sucesso! Documento arquivado.", "success");
    } catch (error: any) {
      showNotification("Erro ao finalizar assinatura: " + error.message, "error");
    } finally {
      setIsLoading(false);
      setPortalExchange(null);
    }
  };

  const handleDirectCollaboratorSignature = async (signature: string) => {
    if (!directSigningExchange) return;
    setIsLoading(true);
    try {
      const updated: AssetExchange = {
        ...directSigningExchange,
        assinatura_colaborador: signature,
        status: 'completed',
        docusign_status: 'completed'
      };

      const pdf = generateAssetPDF(updated, logoPref);
      let pdfBase64 = '';
      if (pdf) {
        try {
          pdf.save(getPDFFileName(updated));
        } catch (e) {
          console.warn('Falha no download do PDF direto:', e);
        }
        pdfBase64 = pdf.output('datauristring');
      }

      await apiService.submitRecipientSignature(
        directSigningExchange.id,
        signature,
        directSigningExchange.colaborador_nome,
        pdfBase64
      );

      setDirectSigningExchange(updated);
      setDirectSigningCompleted(true);
      showNotification("Assinatura confirmada e registrada com sucesso!", "success");
    } catch (err: any) {
      showNotification("Erro ao registrar assinatura: " + err.message, "error");
    } finally {
      setIsLoading(false);
    }
  };

  const [isUserGateOpen, setIsUserGateOpen] = useState(false);
  const [gatePassword, setGatePassword] = useState('');

  const handleUserGateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const requiredPassword = import.meta.env.VITE_GATE_PASSWORD || 'IncluirUsuario';
    if (gatePassword === requiredPassword) {
      setCurrentView('users');
      setIsUserGateOpen(false);
      setGatePassword('');
      showNotification("Acesso autorizado", "success");
    } else {
      showNotification("Senha de acesso incorreta", "error");
    }
  };

  const navTo = (view: View) => {
    if (currentView === view && view !== 'users') return;
    
    setEditingExchange(null);
    setSigningExchange(null);
    setPortalExchange(null);
    
    if (view === 'users') {
      if (currentView === 'users') return;
      
      // Se já for admin, pula o gate de senha
      if (effectiveIsAdmin) {
        setCurrentView('users');
      } else {
        setIsUserGateOpen(true);
      }
      return;
    }
    
    setCurrentView(view);
    // On mobile/narrow screens, close sidebar after navigation
    if (window.innerWidth < 1024) {
      setIsSidebarVisible(false);
    }
  };

  const handleUpdateEmail = async (updatedEmails: MockEmail[]) => {
    // Find the email that changed
    const changedEmail = updatedEmails.find(ue => {
      const original = emails.find(e => e.id === ue.id);
      return original && JSON.stringify(original) !== JSON.stringify(ue);
    });

    if (changedEmail) {
      try {
        await apiService.saveEmail(changedEmail);
      } catch (error) {
        console.error("Error updating email:", error);
      }
    }
  };


  const [isAiAnalyzing, setIsAiAnalyzing] = useState(false);

  const handleAiInsights = async () => {
    if (exchanges.length === 0) {
      showNotification("Sem dados para analisar.", "error");
      return;
    }
    
    setIsAiAnalyzing(true);
    try {
      const insights = await apiService.analyzeInventory(exchanges);
      alert("AI Insights:\n\n" + insights);
    } catch (err: any) {
      showNotification("Erro na análise inteligente.", "error");
    } finally {
      setIsAiAnalyzing(false);
    }
  };

  // Portal dedicado para o Destinatário via Link externo (?sign=ID ou ?envelope=ID)
  if (directSigningLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#001a4e] text-white p-6">
        <Loader2 className="animate-spin text-blue-400 mb-4" size={48} />
        <h2 className="text-lg font-bold">Carregando Termo de Responsabilidade...</h2>
        <p className="text-xs text-blue-200 mt-1">Conectando aos serviços DocuSign & SharePoint M365 Cirion</p>
      </div>
    );
  }

  if (directSigningExchange) {
    return (
      <div className="min-h-screen bg-[#001a4e] flex items-center justify-center p-4">
        {directSigningCompleted ? (
          <div className="bg-white dark:bg-slate-900 max-w-lg w-full rounded-3xl p-8 text-center space-y-5 shadow-2xl border border-blue-400/20 animate-in zoom-in-95">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
              <CheckCircle2 size={36} />
            </div>
            <div className="space-y-1">
              <span className="text-[10px] font-mono uppercase tracking-widest text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded">
                Assinatura Registrada
              </span>
              <h2 className="text-xl font-black text-slate-900 dark:text-white">
                Termo Assinado com Sucesso!
              </h2>
              <p className="text-xs text-slate-500 leading-relaxed">
                Olá, <strong>{directSigningExchange.colaborador_nome}</strong>! Sua assinatura foi vinculada eletronicamente e o termo de responsabilidade foi arquivado no SharePoint da Cirion Technologies.
              </p>
            </div>

            <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-200/60 dark:border-slate-700 text-left text-xs space-y-1.5">
              <div className="flex justify-between">
                <span className="text-slate-400">Equipamento:</span>
                <span className="font-bold text-slate-800 dark:text-white">{directSigningExchange.entregue_tipo || 'Notebook TI'}</span>
              </div>
              {directSigningExchange.entregue_serial && (
                <div className="flex justify-between">
                  <span className="text-slate-400">Serial:</span>
                  <span className="font-mono font-bold text-blue-600 dark:text-blue-400">{directSigningExchange.entregue_serial}</span>
                </div>
              )}
              {directSigningExchange.docusign_envelope_id && (
                <div className="flex justify-between">
                  <span className="text-slate-400">DocuSign ID:</span>
                  <span className="font-mono text-[11px] text-slate-600 dark:text-slate-300">{directSigningExchange.docusign_envelope_id}</span>
                </div>
              )}
            </div>

            <div className="flex flex-col gap-2 pt-2">
              <button
                type="button"
                onClick={() => {
                  const pdf = generateAssetPDF(directSigningExchange, logoPref);
                  if (pdf) pdf.save(getPDFFileName(directSigningExchange));
                }}
                className="w-full py-3.5 bg-[#003087] hover:bg-[#002266] text-white rounded-2xl font-bold text-xs flex items-center justify-center gap-2 shadow-lg transition-all cursor-pointer"
              >
                <Download size={16} /> Baixar Cópia do Termo (PDF)
              </button>

              <button
                type="button"
                onClick={() => setDirectSigningExchange(null)}
                className="w-full py-2.5 text-slate-500 hover:text-slate-800 dark:hover:text-white text-xs font-semibold transition-colors cursor-pointer"
              >
                Acessar AssetFlow Geral
              </button>
            </div>
          </div>
        ) : (
          <SignaturePortal
            exchange={directSigningExchange}
            logoPref={logoPref}
            onSave={handleDirectCollaboratorSignature}
            onCancel={() => setDirectSigningExchange(null)}
          />
        )}
      </div>
    );
  }

  if (!currentUser) {
    return <LoginScreen onLogin={(user) => {
      setCurrentUser(user);
      setUserName(user.username);
      setNameInput(user.username);
    }} />;
  }

  if (isInitialLoading && exchanges.length === 0 && !notification) {
    return (
      <div className="flex h-[100dvh] w-full items-center justify-center bg-slate-50 dark:bg-dracula-bg">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="animate-spin text-dracula-purple" size={48} />
          <p className="text-slate-500 dark:text-dracula-comment font-bold">Carregando AssetFlow...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-[100dvh] bg-slate-50 dark:bg-dracula-bg text-slate-900 dark:text-dracula-fg overflow-hidden">
      <aside className={`bg-slate-900 dark:bg-dracula-darker text-white flex-shrink-0 flex flex-col shadow-2xl transition-all duration-300 ease-in-out ${isSidebarVisible ? 'w-80' : 'w-0 opacity-0 overflow-hidden'}`}>
        <div className="p-8 flex items-center justify-between">
          <div className="flex flex-col">
            <div className="flex items-center gap-3">
              <HardDrive className="text-dracula-purple" size={24} />
              <h1 className="text-xl font-bold">AssetFlow</h1>
            </div>
            <div className="mt-1 flex gap-2">
              <span className={`text-[8px] font-black px-2 py-0.5 rounded-full border ${effectiveIsAdmin ? 'text-amber-400 border-amber-400/30 bg-amber-400/10' : MERCADO_PAGO_URL ? 'text-emerald-400 border-emerald-400/30 bg-emerald-400/10' : 'text-slate-500 border-slate-500/30'}`}>
                {effectiveIsAdmin ? 'ADMIN FULL ACCESS' : MERCADO_PAGO_URL ? 'PREMIUM' : 'FREE VERSION'}
              </span>
              {actualIsAdmin && isSimulatingUser && (
                <span className="text-[8px] font-black px-2 py-0.5 rounded-full border border-blue-500/30 text-blue-400 bg-blue-500/10 animate-pulse">
                  SIMULANDO USUÁRIO
                </span>
              )}
            </div>
          </div>
          <button onClick={() => setIsSidebarVisible(false)} className="p-2 hover:bg-slate-800 rounded-lg text-slate-500">
            <PanelLeftClose size={18} />
          </button>
        </div>

        <div className="px-6 mb-4">
          <div className="flex items-center gap-3 p-4 bg-white/5 rounded-2xl border border-white/10 group">
            <div className="w-10 h-10 rounded-full bg-dracula-purple/20 flex items-center justify-center text-dracula-purple shrink-0">
              <UserIcon size={20} />
            </div>
            <div className="flex flex-col min-w-0 flex-1">
              <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Rede Corporativa</span>
              {isEditingName ? (
                <div className="flex items-center gap-2 mt-1">
                  <input 
                    type="text" 
                    value={nameInput}
                    onChange={(e) => setNameInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        setUserName(nameInput);
                        setIsEditingName(false);
                      }
                    }}
                    className="bg-slate-800 border border-dracula-purple/50 rounded px-2 py-0.5 text-xs text-white w-full outline-none"
                    autoFocus
                  />
                </div>
              ) : (
                <div className="flex items-center justify-between gap-2">
                  <span className="text-sm font-bold truncate text-white" title={userName}>
                    {userName}
                  </span>
                  <button 
                    onClick={() => {
                      setNameInput(userName);
                      setIsEditingName(true);
                    }}
                    className="opacity-0 group-hover:opacity-100 p-1 hover:bg-white/10 rounded transition-all text-slate-400"
                    title="Editar Nome de Rede"
                  >
                    <Settings size={12} />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
        
        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
          <NavItem icon={PlusCircle} label="Nova Troca" active={currentView === 'form'} onClick={() => navTo('form')} />
          <NavItem icon={ClipboardList} label="Inventário" active={currentView === 'inventory'} onClick={() => navTo('inventory')} />
          <NavItem icon={Mail} label="Outlook" active={currentView === 'inbox'} onClick={() => navTo('inbox')} badge={emails.some(e => !e.read)} />
          <NavItem icon={ExternalLink} label="DocuSign" href="https://apps.docusign.com/send/home" />
          
          {actualIsAdmin && !isSimulatingUser && (
            <>
              <div className="pt-4 pb-2">
                <p className="px-4 text-[10px] font-bold text-slate-500 dark:text-dracula-comment uppercase tracking-widest">Administração</p>
              </div>
              <NavItem icon={Users} label="Usuários" active={currentView === 'users'} onClick={() => navTo('users')} />
            </>
          )}
        </nav>

        <div className="p-6 border-t border-slate-800 space-y-4">
           {MERCADO_PAGO_URL && !effectiveIsAdmin && (
             <a 
               href={MERCADO_PAGO_URL} 
               target="_blank" 
               rel="noopener noreferrer"
               className="w-full flex items-center justify-center gap-3 px-4 py-4 bg-gradient-to-r from-emerald-500 to-dracula-purple text-white rounded-2xl font-black text-xs shadow-lg shadow-dracula-purple/30 hover:scale-[1.02] transition-all group"
             >
               <CreditCard size={18} className="group-hover:rotate-12 transition-transform" />
               <span>ADQUIRIR VERSÃO FULL</span>
             </a>
           )}
           {MERCADO_PAGO_URL && !effectiveIsAdmin && (
             <p className="text-[9px] text-slate-500 text-center italic leading-tight px-2">
               Contribua com R$ 10,00 e nos incentive a criar mais ferramentas de automação corporativa.
             </p>
           )}
           
           {actualIsAdmin && (
             <button 
               onClick={() => setIsSimulatingUser(!isSimulatingUser)}
               className={`w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl border text-[10px] font-black transition-all ${
                 isSimulatingUser 
                   ? 'bg-amber-400 text-amber-900 border-amber-500' 
                   : 'bg-white/5 text-slate-400 border-white/10 hover:bg-white/10'
               }`}
             >
               <ShieldCheck size={14} />
               {isSimulatingUser ? 'REATIVAR MODO ADMIN' : 'SIMULAR VISÃO USUÁRIO'}
             </button>
           )}

           <button 
             type="button"
             onClick={() => setIsStandaloneModalOpen(true)}
             className="w-full flex items-center justify-center gap-2 px-4 py-2.5 mb-2 rounded-xl border border-sky-500/40 bg-sky-500/15 hover:bg-sky-500/25 text-sky-300 text-xs font-bold transition-all cursor-pointer shadow-sm"
             title="Executar aplicativo fora da plataforma de desenvolvimento em aba dedicada"
           >
             <ExternalLink size={14} />
             <span>Rodar Fora da Plataforma</span>
           </button>

           <button 
             type="button"
             onClick={() => setIsSharePointModalOpen(true)}
             className="w-full flex items-center justify-center gap-2 px-4 py-2.5 mb-3 rounded-xl border border-sky-500/30 bg-sky-500/10 hover:bg-sky-500/20 text-sky-400 text-xs font-bold transition-all cursor-pointer shadow-sm"
             title="Governança de Dados Cirion e Status da Base SharePoint M365"
           >
             <Database size={14} />
             <span>Base SharePoint M365</span>
           </button>
           <div className="flex items-center gap-2 mb-4">
             <button 
               onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')} 
               className="flex-1 flex justify-center p-2 bg-slate-800 rounded-xl hover:text-dracula-purple transition-colors"
               title="Alternar Tema"
             >
               {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
             </button>
             <button 
               onClick={toggleFullscreen} 
               className="flex-1 flex justify-center p-2 bg-slate-800 rounded-xl hover:text-dracula-purple transition-colors"
               title="Tela Cheia"
             >
               {isFullscreen ? <Minimize size={18} /> : <Maximize size={18} />}
             </button>
             <button 
               onClick={generatePromptPDF} 
               className="flex-1 flex justify-center p-2 bg-slate-800 rounded-xl hover:text-dracula-purple transition-colors"
               title="Baixar Prompt do App (PDF)"
             >
               <FileText size={18} />
             </button>
             <button 
               onClick={handleShareLink} 
               className="flex-1 flex justify-center p-2 bg-slate-800 rounded-xl hover:text-dracula-purple transition-colors"
               title="Copiar Link de Compartilhamento"
             >
               <Link size={18} />
             </button>
           </div>
           <button 
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 text-xs text-slate-500 hover:text-rose-400 transition-colors bg-white/5 rounded-xl"
           >
              <LogOut size={16} /> <span>Sair do Sistema</span>
           </button>
        </div>
      </aside>

      <main className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        
        {!isSidebarVisible && (
          <button 
            onClick={() => setIsSidebarVisible(true)}
            className="absolute left-6 top-8 z-50 p-2.5 bg-slate-900 text-white rounded-xl shadow-2xl hover:scale-105 transition-all"
            title="Abrir Menu"
          >
            <Menu size={24} />
          </button>
        )}

        {notification && (
          <div className="fixed top-6 right-6 z-[100] animate-in slide-in-from-right duration-300">
            <div className={`px-6 py-4 rounded-2xl shadow-2xl border flex items-center gap-3 ${notification.type === 'success' ? 'bg-emerald-50 border-emerald-200 text-emerald-800 dark:bg-dracula-green/20 dark:text-dracula-green' : 'bg-rose-50 border-rose-200 text-rose-800 dark:bg-dracula-red/20 dark:text-dracula-red'}`}>
              {notification.type === 'success' ? <CheckCircle2 size={20} /> : <AlertCircle size={20} />}
              <span className="font-bold text-sm">{notification.message}</span>
            </div>
          </div>
        )}

        <div className="flex-1 overflow-y-auto p-4 md:p-10 space-y-8 transition-all duration-300">
          <header className="space-y-1">
            <h2 className="text-3xl font-extrabold tracking-tight flex items-center justify-between w-full">
              <div className="flex items-center gap-3 flex-wrap">
                {currentView === 'form' ? 'Gestão de Ativos' : currentView === 'inventory' ? 'Inventário' : currentView === 'inbox' ? 'Outlook' : 'Gestão de Usuários'}
                <span className="text-xs font-bold px-3 py-1.5 bg-slate-100 dark:bg-white/5 rounded-xl text-slate-400 border border-slate-200 dark:border-white/10 uppercase tracking-widest">
                  {userName}
                </span>

                <div 
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-sky-500/10 border border-sky-500/30 text-sky-600 dark:text-sky-400 font-bold text-xs"
                  title="Base de Dados Oficial Microsoft 365 SharePoint Online ativa e operando em conformidade com as diretrizes de TI"
                >
                  <Database size={13} className="text-sky-500" />
                  <span>SharePoint M365: {exchanges.length} Ativos</span>
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                </div>

                <button
                  type="button"
                  onClick={() => setIsSharePointModalOpen(true)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-500/10 hover:bg-slate-500/20 border border-slate-500/30 text-slate-600 dark:text-slate-300 font-bold text-xs transition-all shadow-sm cursor-pointer"
                  title="Painel de Governança e Configurações do SharePoint Online M365"
                >
                  <Database size={13} className="text-sky-500" />
                  <span>Governança SharePoint</span>
                </button>

                <div 
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 font-bold text-xs"
                  title="Autenticação Corporativa Cirion com Microsoft Authenticator (MFA) verificada"
                >
                  <Smartphone size={13} className="text-emerald-500" />
                  <span>MFA Cirion Ativo</span>
                </div>

                {/* Ações para Executar Fora da Plataforma de Desenvolvimento */}
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => setIsStandaloneModalOpen(true)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-sky-500/10 hover:bg-sky-500/20 border border-sky-500/30 text-sky-600 dark:text-sky-300 font-bold text-xs transition-all shadow-sm cursor-pointer"
                    title="Opções de Link para Executar Fora da Plataforma de Desenvolvimento"
                  >
                    <Globe size={13} className="text-sky-500" />
                    <span>Rodar Fora da Plataforma</span>
                  </button>

                  <a
                    href={urlService.getStandaloneAppUrl()}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-sky-600 to-indigo-600 hover:from-sky-500 hover:to-indigo-500 text-white font-bold text-xs shadow-md shadow-sky-900/30 transition-all cursor-pointer"
                    title="Abrir o AssetFlow diretamente em uma nova aba do navegador"
                  >
                    <ExternalLink size={13} />
                    <span>Nova Aba</span>
                  </a>
                </div>
              </div>
              {currentView === 'inventory' && (
                <button 
                  onClick={handleAiInsights}
                  disabled={isAiAnalyzing}
                  className="flex items-center gap-2 px-4 py-2 bg-dracula-purple/10 text-dracula-purple border border-dracula-purple/30 rounded-2xl font-bold text-xs hover:bg-dracula-purple/20 transition-all disabled:opacity-50"
                >
                  {isAiAnalyzing ? <Loader2 size={16} className="animate-spin" /> : <ShieldCheck size={16} />}
                  Insights de Segurança (AI)
                </button>
              )}
            </h2>
            <p className="text-slate-500 text-sm font-medium">Sistema Corporativo de Gestão de Ativos</p>
          </header>

          <div className="bg-white dark:bg-dracula-darker rounded-[2.5rem] shadow-2xl border border-slate-100 dark:border-dracula-current min-h-[600px]">
            {currentView === 'form' && (
              <AssetForm 
                onSave={handleSaveExchange} 
                editingExchange={editingExchange} 
                onCancel={() => navTo('inventory')} 
                isAdmin={effectiveIsAdmin}
              />
            )}
            {currentView === 'inventory' && (
              <ErrorBoundary fallbackTitle="Falha ao carregar a tabela de inventário">
                <InventoryTable 
                  exchanges={exchanges} 
                  onDelete={handleDeleteRequest} 
                  onEdit={(ex) => { setEditingExchange(ex); setCurrentView('form'); }} 
                  onNotify={showNotification}
                  onSignStart={(ex) => {
                    if (!ex.assinatura_ti) {
                      setSigningExchange(ex);
                    } else {
                      setPortalExchange(ex);
                    }
                  }}
                  onStatusChange={handleStatusChange}
                  onCompleteRequest={handleCompleteRequest}
                  onBulkImport={(data) => { 
                     Promise.all(data.map(item => apiService.save(item))).then(() => {
                        showNotification("Importação concluída!", "success");
                     }).catch(() => showNotification("Erro na importação", "error"));
                  }}
                  logoPref={logoPref}
                  onTriggerAgent={(ex) => setAgentExchange(ex)}
                />
              </ErrorBoundary>
            )}
            {currentView === 'inbox' && (
              <MockInbox 
                emails={emails} 
                onUpdateEmails={handleUpdateEmail} 
                exchanges={exchanges}
                onOpenPortal={(ex) => setPortalExchange(ex)}
                logoPref={logoPref}
                onNotify={showNotification}
              />
            )}
            {currentView === 'users' && currentUser.isAdmin && (
              <UserManagement currentUser={currentUser} onNotify={showNotification} />
            )}
          </div>
        </div>
      </main>

      {agentExchange && (
        <DocuSignAgentModal
          exchange={agentExchange}
          logoPref={logoPref}
          currentUserName={userName}
          onClose={() => setAgentExchange(null)}
          onComplete={(updatedEx, mockEmail) => {
            setExchanges(prev => prev.map(e => e.id === updatedEx.id ? updatedEx : e));
            if (mockEmail) {
              setEmails(prev => [mockEmail, ...prev.filter(e => e.id !== mockEmail.id)]);
            }
            showNotification(`Agente DocuSign & Outlook despachou o processo com sucesso! ID: ${updatedEx.docusign_envelope_id}`, 'success');
          }}
          onOpenInbox={(_exId) => {
            setAgentExchange(null);
            setCurrentView('inbox');
          }}
          onOpenSignReceiverNow={(ex) => {
            setAgentExchange(null);
            setPortalExchange(ex);
          }}
        />
      )}

      {signingExchange && <SenderSignatureModal exchange={signingExchange} onClose={() => setSigningExchange(null)} onConfirm={(id, sig) => handleSignSender(id, sig)} />}
      
      {portalExchange && (
        <SignaturePortal 
          exchange={portalExchange} 
          logoPref={logoPref} 
          onSave={handleCollaboratorSignature} 
          onCancel={() => setPortalExchange(null)} 
        />
      )}
      
      {itemToDelete && (
        <ConfirmationModal 
          title="Excluir Registro" 
          message="Tem certeza que deseja excluir este item permanentemente? Esta ação não pode ser desfeita."
          onConfirm={confirmDelete}
          onCancel={() => setItemToDelete(null)}
          isDanger
          confirmLabel="Excluir"
          confirmationKeyword={import.meta.env.VITE_DELETE_KEYWORD || 'excluiragora'}
        />
      )}

      {itemToComplete && (
        <ConfirmationModal 
          title="Concluir Manualmente" 
          message="Deseja marcar este termo como CONCLUÍDO manualmente? Use esta opção apenas se a assinatura já foi coletada fisicamente."
          onConfirm={() => {
            handleStatusChange(itemToComplete, 'completed');
            setItemToComplete(null);
          }}
          onCancel={() => setItemToComplete(null)}
          confirmLabel="Concluir"
        />
      )}

      {isUserGateOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-md animate-in fade-in duration-300">
          <div className="bg-white dark:bg-dracula-bg w-full max-w-sm rounded-[2.5rem] shadow-2xl overflow-hidden border border-slate-200 dark:border-dracula-current">
            <div className="p-8 text-center space-y-6">
              <div className="w-16 h-16 bg-rose-500/10 text-rose-500 rounded-2xl flex items-center justify-center mx-auto">
                <Lock size={32} />
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-bold">Acesso Restrito</h3>
                <p className="text-sm text-slate-500 dark:text-dracula-comment">Digite a senha mestra para gerenciar usuários.</p>
              </div>
              <form onSubmit={handleUserGateSubmit} className="space-y-4">
                <input 
                  type="password"
                  autoFocus
                  value={gatePassword}
                  onChange={(e) => setGatePassword(e.target.value)}
                  placeholder="Senha de Inclusão"
                  className="w-full p-4 bg-slate-50 dark:bg-dracula-darker border border-slate-200 dark:border-dracula-current rounded-2xl outline-none focus:ring-2 focus:ring-dracula-purple/50 transition-all text-center"
                />
                <div className="flex gap-3">
                  <button 
                    type="button"
                    onClick={() => {
                      setIsUserGateOpen(false);
                      setGatePassword('');
                    }}
                    className="flex-1 py-4 bg-slate-100 dark:bg-white/5 text-slate-500 dark:text-dracula-comment rounded-2xl font-bold hover:bg-slate-200 transition-all"
                  >
                    Cancelar
                  </button>
                  <button 
                    type="submit"
                    className="flex-1 py-4 bg-dracula-purple text-white rounded-2xl font-bold shadow-lg shadow-dracula-purple/20 hover:scale-[1.02] transition-all"
                  >
                    Acessar
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
      <SharePointMigrationModal 
        isOpen={isSharePointModalOpen}
        onClose={() => setIsSharePointModalOpen(false)}
        currentExchanges={exchanges}
        onMigrationComplete={() => {
          showNotification("Base sincronizada com o Microsoft 365 SharePoint Online!", "success");
        }}
      />
      <StandaloneAppModal
        isOpen={isStandaloneModalOpen}
        onClose={() => setIsStandaloneModalOpen(false)}
      />
      {showStartScreen && (
        <div className="fixed inset-0 z-[500] flex items-center justify-center bg-slate-900 text-white">
          <div className="text-center space-y-8 p-8 max-w-md animate-in fade-in zoom-in duration-500">
            <div className="w-24 h-24 bg-dracula-purple/20 rounded-full flex items-center justify-center text-dracula-purple mx-auto mb-4">
              <HardDrive size={48} />
            </div>
            <div className="space-y-2">
              <h1 className="text-4xl font-black tracking-tight">AssetFlow</h1>
              <p className="text-slate-400 font-medium">Sistema de Gestão de Ativos TI Cirion</p>
            </div>
            <button 
              onClick={() => {
                document.documentElement.requestFullscreen().then(() => {
                  setShowStartScreen(false);
                }).catch(err => {
                  console.error(err);
                  setShowStartScreen(false);
                });
              }}
              className="w-full py-5 bg-dracula-purple text-white rounded-2xl font-bold text-xl shadow-2xl shadow-dracula-purple/40 hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-3"
            >
              <Maximize size={24} />
              Iniciar Aplicativo
            </button>
            <p className="text-xs text-slate-500 uppercase tracking-widest font-bold">Modo Quiosque Ativado</p>
          </div>
        </div>
      )}
    </div>
  );
};

const NavItem = ({ icon: Icon, label, active, onClick, badge, href }: any) => {
  const content = (
    <>
      <Icon size={20} className={active ? 'animate-pulse' : ''} />
      <span className="font-bold text-sm">{label}</span>
      {badge && <div className="absolute right-4 w-2 h-2 bg-dracula-pink rounded-full" />}
    </>
  );

  const className = `w-full flex items-center gap-4 px-4 py-4 rounded-xl transition-all relative ${active ? 'bg-dracula-purple text-white shadow-xl shadow-dracula-purple/20' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`;

  if (href) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={className}>
        {content}
      </a>
    );
  }

  return (
    <button onClick={onClick} className={className}>
      {content}
    </button>
  );
};

export default App;
