
import React, { useState } from 'react';
import { HardDrive, Lock, User as UserIcon, Loader2, AlertCircle, ExternalLink, Maximize, LogIn } from 'lucide-react';
import { signInAnonymously } from 'firebase/auth';
import { auth } from '../firebase';
import { apiService } from '../services/apiService';
import { User } from '../types';

interface LoginScreenProps {
  onLogin: (user: User) => void;
}

const LoginScreen: React.FC<LoginScreenProps> = ({ onLogin }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');

  // Pré-autenticação anônima ao montar para acelerar o processo posterior
  React.useEffect(() => {
    if (!auth.currentUser) {
      signInAnonymously(auth).catch(err => {
        console.warn("Pré-auth falhou, será tentado novamente no clique:", err.message);
      });
    }
  }, []);

  const handleSimpleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId.trim() || !password.trim()) {
      setError('Por favor, preencha todos os campos.');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Autenticação anônima para satisfazer as regras do Firestore (isAuthenticated)
      let currentFbUser = auth.currentUser;
      
      if (!currentFbUser) {
        try {
          // Tenta autenticar anonimamente. Se falhar por rede, podemos tentar novamente ou avisar.
          const result = await signInAnonymously(auth);
          currentFbUser = result.user;
        } catch (authErr: any) {
          console.error("Firebase Auth Error (Anonymous):", authErr.code, authErr.message);
          
          if (authErr.code === 'auth/network-request-failed') {
            throw new Error('Falha de conexão com o Firebase. Verifique sua internet ou se o serviço está bloqueado em sua rede corporativa.');
          }
          
          if (authErr.code === 'auth/admin-restricted-operation' || authErr.code === 'auth/operation-not-allowed') {
            throw new Error('O Acesso Anônimo está desativado no Console do Firebase. Vá em "Authentication > Sign-in method" e ative o provedor "Anônimo".');
          }
          throw authErr;
        }
      }

      // Check for master admin access first
      const masterPass = import.meta.env.VITE_GATE_PASSWORD || 'IncluirUsuario';
      const adminEmail = (import.meta.env.VITE_ADMIN_EMAIL || 'gibasuporte@gmail.com').toLowerCase();

      if (password === masterPass && (
        userId.toLowerCase() === 'admin' || 
        userId.toLowerCase() === 'gibasuporte' || 
        userId.toLowerCase() === adminEmail ||
        userId.toLowerCase() === 'giba'
      )) {
        // Use the actual Firebase Auth UID to satisfy firestore markers
        const adminUid = currentFbUser?.uid || 'admin_root_master';
        let userProfile = await apiService.getUserById(adminUid);
        
        if (!userProfile) {
          userProfile = {
            id: adminUid,
            username: 'Administrador Desktop',
            email: adminEmail,
            isAdmin: true,
          };
          await apiService.saveUser(userProfile);
        }
        
        localStorage.setItem('assetflow_auth_simulation', JSON.stringify(userProfile));
        onLogin(userProfile);
        return;
      }

      // Check standard users in Firestore
      if (password !== masterPass) {
        throw new Error('Senha incorreta.');
      }

      // Otimização: buscar pelo username diretamente
      const existingUser = await apiService.getUserByUsername(userId);

      if (existingUser) {
        localStorage.setItem('assetflow_auth_simulation', JSON.stringify(existingUser));
        onLogin(existingUser);
      } else {
        // Use actual Firebase UID
        const currentUid = auth.currentUser?.uid || `user_${Date.now()}`;
        const newUser: User = {
          id: currentUid,
          username: userId,
          email: `${userId.toLowerCase()}@local.app`,
          isAdmin: false
        };
        await apiService.saveUser(newUser);
        localStorage.setItem('assetflow_auth_simulation', JSON.stringify(newUser));
        onLogin(newUser);
      }
    } catch (err: any) {
      setError(err.message || 'Erro ao realizar login.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-dracula-bg p-4">
      <div className="w-full max-w-md animate-in fade-in zoom-in duration-500">
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-dracula-purple/20 rounded-3xl flex items-center justify-center text-dracula-purple mx-auto mb-4 shadow-xl shadow-dracula-purple/10">
            <HardDrive size={40} />
          </div>
          <h1 className="text-4xl font-black tracking-tight text-slate-900 dark:text-white mb-2">AssetFlow</h1>
          <p className="text-slate-500 dark:text-dracula-comment font-medium">Gestão de Ativos Corporativos</p>
        </div>

        <div className="bg-white dark:bg-dracula-darker p-8 rounded-[2.5rem] shadow-2xl border border-slate-100 dark:border-dracula-current">
          <form onSubmit={handleSimpleLogin} className="space-y-4">
            <div className="text-center mb-6">
              <h2 className="text-xl font-bold">Acesso ao Sistema</h2>
              <p className="text-xs text-slate-500 dark:text-dracula-comment mt-1 italic">Visto que o APK não suporta pop-ups do Google</p>
            </div>

            {error && (
              <div className="flex items-center gap-2 text-rose-500 text-sm font-bold bg-rose-50 dark:bg-rose-500/10 p-4 rounded-xl animate-in shake duration-300">
                <AlertCircle size={18} />
                <span>{error}</span>
              </div>
            )}

            <div className="space-y-4">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                  <UserIcon size={18} />
                </div>
                <input
                  type="text"
                  placeholder="Seu Nome ou Usuário"
                  value={userId}
                  onChange={(e) => setUserId(e.target.value)}
                  className="w-full pl-11 pr-4 py-4 bg-slate-50 dark:bg-dracula-bg border-2 border-slate-100 dark:border-dracula-current rounded-2xl outline-none focus:border-dracula-purple/50 transition-all"
                  required
                />
              </div>

              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                  <Lock size={18} />
                </div>
                <input
                  type="password"
                  placeholder="Senha de Acesso"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-11 pr-4 py-4 bg-slate-50 dark:bg-dracula-bg border-2 border-slate-100 dark:border-dracula-current rounded-2xl outline-none focus:border-dracula-purple/50 transition-all"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-4 bg-dracula-purple text-white rounded-2xl font-bold text-lg shadow-lg shadow-dracula-purple/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
              >
                {isLoading ? (
                  <Loader2 className="animate-spin" size={24} />
                ) : (
                  <>
                    <LogIn size={20} />
                    Entrar no Sistema
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        <p className="text-center mt-8 text-xs text-slate-400 dark:text-dracula-comment uppercase tracking-[0.2em] font-bold">
          Acesso Restrito à Equipe de TI
        </p>
      </div>
    </div>
  );
};

export default LoginScreen;
