
import React, { useState, useEffect } from 'react';
import { Shield, Trash2, User as UserIcon, ShieldAlert, Users, RefreshCcw, Mail, Fingerprint } from 'lucide-react';
import { User } from '../types';
import { apiService } from '../services/apiService';
import ConfirmationModal from './ConfirmationModal';

interface UserManagementProps {
  currentUser: User;
  onNotify: (message: string, type: 'success' | 'error') => void;
}

const UserManagement: React.FC<UserManagementProps> = ({ currentUser, onNotify }) => {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [userToDelete, setUserToDelete] = useState<string | null>(null);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    setIsRefreshing(true);
    try {
      const allUsers = await apiService.getAllUsers();
      // Sort users: admins first, then by username
      const sortedUsers = [...allUsers].sort((a, b) => {
        if (a.isAdmin && !b.isAdmin) return -1;
        if (!a.isAdmin && b.isAdmin) return 1;
        return a.username.localeCompare(b.username);
      });
      setUsers(sortedUsers);
    } catch (error) {
      onNotify('Erro ao carregar usuários.', 'error');
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleToggleAdmin = async (user: User) => {
    if (user.id === currentUser.id) {
      onNotify('Você não pode alterar suas próprias permissões.', 'error');
      return;
    }

    setIsLoading(true);
    try {
      const updatedUser = { ...user, isAdmin: !user.isAdmin };
      await apiService.saveUser(updatedUser);
      await loadUsers();
      onNotify(`Permissões de ${user.username} atualizadas.`, 'success');
    } catch (error) {
      onNotify('Erro ao atualizar permissões.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const confirmDeleteUser = async () => {
    if (!userToDelete) return;

    setIsLoading(true);
    try {
      await apiService.deleteUser(userToDelete);
      await loadUsers();
      onNotify('Perfil de usuário removido com sucesso.', 'success');
      setUserToDelete(null);
    } catch (error) {
      onNotify('Erro ao remover usuário.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteUser = (id: string) => {
    if (id === currentUser.id) {
      onNotify('Você não pode excluir seu próprio usuário.', 'error');
      return;
    }

    setUserToDelete(id);
  };

  return (
    <div className="p-4 md:p-8 space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-dracula-purple/10 text-dracula-purple rounded-2xl">
              <Users size={24} />
            </div>
            <div>
              <h3 className="text-2xl font-bold tracking-tight">Gestão de Usuários</h3>
              <p className="text-xs text-slate-500 dark:text-dracula-comment font-medium">Controle de acesso e permissões administrativas</p>
            </div>
          </div>
          <button 
            onClick={loadUsers}
            disabled={isRefreshing}
            className="flex items-center justify-center gap-2 px-4 py-2 bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-300 rounded-xl font-bold text-xs hover:bg-slate-200 dark:hover:bg-white/10 transition-all disabled:opacity-50"
          >
            <RefreshCcw size={14} className={isRefreshing ? 'animate-spin' : ''} />
            Recarregar Lista
          </button>
        </div>

        <div className="bg-amber-50 dark:bg-amber-500/5 border border-amber-200 dark:border-amber-500/20 p-4 rounded-2xl flex items-start gap-3">
          <ShieldAlert className="text-amber-500 shrink-0" size={20} />
          <p className="text-xs text-amber-800 dark:text-amber-400 font-medium">
            Novos usuários são criados automaticamente ao realizar o primeiro login social via Google. 
            Você pode promover usuários a administradores nesta tela para liberar acesso ao painel de gestão.
          </p>
        </div>

        <div className="grid gap-3">
          {isRefreshing && users.length === 0 ? (
             <div className="flex flex-col items-center justify-center py-20 text-slate-400">
                <RefreshCcw size={40} className="animate-spin mb-4 opacity-20" />
                <p className="font-medium">Buscando usuários...</p>
             </div>
          ) : users.length === 0 ? (
            <div className="text-center py-20 bg-slate-50 dark:bg-dracula-darker rounded-[2rem] border border-dashed border-slate-200 dark:border-dracula-current">
              <Users size={48} className="mx-auto text-slate-300 mb-4" />
              <p className="text-slate-500 font-bold">Nenhum usuário encontrado.</p>
            </div>
          ) : (
            users.map(user => (
              <div key={user.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-5 bg-white dark:bg-dracula-darker border border-slate-100 dark:border-dracula-current rounded-[1.5rem] group hover:shadow-lg transition-all gap-4">
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${user.isAdmin ? 'bg-dracula-purple/10 text-dracula-purple shadow-sm' : 'bg-slate-100 dark:bg-white/5 text-slate-400'}`}>
                    <UserIcon size={24} />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                       <p className="font-bold text-lg text-slate-800 dark:text-white truncate">{user.username}</p>
                       {user.id === currentUser.id && (
                        <span className="px-2 py-0.5 rounded-md text-[8px] font-black uppercase tracking-widest bg-emerald-500 text-white">
                          VOCÊ
                        </span>
                      )}
                    </div>
                    <div className="flex flex-col gap-1 mt-1">
                      <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-dracula-comment">
                        <Mail size={12} />
                        <span className="truncate">{user.email || 'Email não disponível'}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-[10px] text-slate-400 dark:text-dracula-comment/60">
                        <Fingerprint size={10} />
                        <span className="font-mono">{user.id}</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <button
                    onClick={() => handleToggleAdmin(user)}
                    disabled={isLoading || user.id === currentUser.id}
                    className={`flex-1 sm:flex-none px-4 py-2.5 rounded-xl transition-all flex items-center justify-center gap-2 font-bold text-xs ${
                      user.isAdmin 
                      ? 'text-amber-600 bg-amber-50 hover:bg-amber-100 dark:bg-amber-500/10 dark:hover:bg-amber-500/20' 
                      : 'text-dracula-purple bg-dracula-purple/5 hover:bg-dracula-purple/10'
                    } disabled:opacity-50`}
                    title={user.isAdmin ? "Remover Privilégios de Administrador" : "Conceder Privilégios de Administrador"}
                  >
                    {user.isAdmin ? <ShieldAlert size={16} /> : <Shield size={16} />}
                    <span className="sm:hidden lg:inline">{user.isAdmin ? "Remover Admin" : "Tornar Admin"}</span>
                  </button>

                  {user.id !== currentUser.id && (
                    <button
                      onClick={() => handleDeleteUser(user.id)}
                      disabled={isLoading}
                      className="p-2.5 text-slate-300 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 rounded-xl transition-all disabled:opacity-30"
                      title="Excluir Usuário permanentemente"
                    >
                      {isLoading && userToDelete === user.id ? <RefreshCcw size={18} className="animate-spin" /> : <Trash2 size={20} />}
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {userToDelete && (
        <ConfirmationModal 
          title="Excluir Usuário" 
          message={`Tem certeza que deseja remover permanentemente o perfil de ${users.find(u => u.id === userToDelete)?.username || 'este usuário'}? Esta ação removerá o acesso administrativo e o histórico do perfil.`}
          onConfirm={confirmDeleteUser}
          onCancel={() => setUserToDelete(null)}
          isDanger
          confirmLabel="Excluir agora"
          confirmationKeyword="Excluir"
        />
      )}
    </div>
  );
};

export default UserManagement;
