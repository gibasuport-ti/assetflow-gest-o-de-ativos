
import React, { useState, useEffect, useRef } from 'react';
import { AssetExchange, EquipmentCondition, OperationType, AdditionalItem, Office365User, Office365ConnectorInfo } from '../types';
import { EQUIPMENT_TYPES, BRANDS, MODELS_LIST, PROCESSORS_LIST, MODEL_SPECS, MEMORY_LIST, STORAGE_LIST, AD_USERS, MERCADO_PAGO_URL, ACCESSORIES_OPTIONS, ACCESSORIES_WITH_SERIAL, normalizeText } from '../constants';
import { 
  User, Package, History, Send, ScanLine, Lock, Loader2, Search, Fingerprint, 
  CheckSquare, FileText, ArrowRightLeft, UserPlus, UserMinus, Plus, Trash2, 
  CreditCard, Truck, Bot, CheckCircle2, Building2, ShieldCheck, Mail, MapPin, 
  Briefcase, Sparkles, X, Info, ChevronRight, RefreshCw, Camera
} from 'lucide-react';
import BarcodeScannerModal from './BarcodeScannerModal';
import { UserAvatar } from './UserAvatar';
import { apiService } from '../services/apiService';

interface AssetFormProps {
  onSave: (exchange: AssetExchange, isDocuSignDirect?: boolean) => Promise<void> | void;
  editingExchange?: AssetExchange | null;
  onCancel?: () => void;
  isAdmin?: boolean;
}

// Componente Header Auxiliar
const SectionHeader = ({ icon: Icon, title, color }: any) => (
  <div className="flex items-center gap-3 mb-6 pb-2 border-b border-slate-100 dark:border-dracula-current">
    <div className={`p-2 rounded-lg ${color} shadow-sm`}><Icon size={18} className="text-white" /></div>
    <h3 className="text-lg font-bold">{title}</h3>
  </div>
);

const AssetForm: React.FC<AssetFormProps> = ({ onSave, editingExchange, onCancel, isAdmin = false }) => {
  const isReadOnly = editingExchange?.status === 'completed';
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestedUsers, setSuggestedUsers] = useState<Office365User[]>([]);
  const [isSearchingM365, setIsSearchingM365] = useState(false);
  const [m365ConnectorInfo, setM365ConnectorInfo] = useState<Office365ConnectorInfo | null>(null);
  const [selectedM365User, setSelectedM365User] = useState<Office365User | null>(null);
  const [showConnectorModal, setShowConnectorModal] = useState(false);
  const searchTimeoutRef = useRef<any>(null);
  const activeQueryRef = useRef<string>('');
  const adRef = useRef<HTMLDivElement>(null);

  const [formData, setFormData] = useState<AssetExchange>({
    id: '',
    operationType: 'exchange',
    status: 'draft',
    timestamp: Date.now(),
    colaborador_nome: '',
    colaborador_email: '',
    data_troca: new Date().toISOString().split('T')[0],
    entregue_tipo: EQUIPMENT_TYPES[0],
    entregue_marca: BRANDS[0],
    entregue_modelo: MODELS_LIST[0],
    entregue_serial: '',
    entregue_processador: PROCESSORS_LIST[0],
    entregue_condicao: EquipmentCondition.NEW,
    entregue_memoria: MEMORY_LIST[2],
    entregue_armazenamento: STORAGE_LIST[3],
    entregue_acessorios: [],
    entregue_acessorios_seriais: {},
    entregue_observacoes: 'Entrega referente a troca',
    devolvido_tipo: EQUIPMENT_TYPES[0],
    devolvido_marca: BRANDS[0],
    devolvido_modelo: MODELS_LIST[0],
    devolvido_serial: '',
    devolvido_processador: PROCESSORS_LIST[0],
    devolvido_condicao: EquipmentCondition.USED,
    devolvido_memoria: MEMORY_LIST[2],
    devolvido_armazenamento: STORAGE_LIST[3],
    devolvido_acessorios: [],
    devolvido_acessorios_seriais: {},
    devolvido_observacoes: 'Devolução referente a troca'
  });

  const [isCustomModel, setIsCustomModel] = useState({
    entregue: false,
    devolvido: false,
    adicionais: {} as Record<string, boolean>
  });

  const isFreeVersion = formData.operationType !== 'delivery' && !isAdmin;

  const [scannerConfig, setScannerConfig] = useState<{ 
    isOpen: boolean; 
    target: 'entregue' | 'devolvido'; 
    itemId?: string;
    accessoryKey?: string;
  }>({
    isOpen: false,
    target: 'entregue'
  });

  useEffect(() => {
    if (editingExchange) {
        // Migration logic for old 'observacoes' field if it exists in data but new fields don't
        const oldData = editingExchange as any;
        const normalizeAcc = (a: string) => (a === 'Teclado' || a === 'Kit combo Teclado e Mouse') ? 'Teclado e Mouse' : a;
        const entregueAccs = (editingExchange.entregue_acessorios || []).map(normalizeAcc);
        const devolvidoAccs = (editingExchange.devolvido_acessorios || []).map(normalizeAcc);

        const normalizeSerials = (serials?: Record<string, string>) => {
          if (!serials) return {};
          const next: Record<string, string> = { ...serials };
          if (next['Teclado']) {
            next['Teclado e Mouse'] = next['Teclado'];
          }
          if (next['Kit combo Teclado e Mouse']) {
            next['Teclado e Mouse'] = next['Kit combo Teclado e Mouse'];
          }
          return next;
        };

        setFormData({
            ...editingExchange,
            operationType: editingExchange.operationType || 'exchange', // Default for legacy records
            entregue_acessorios: entregueAccs,
            entregue_acessorios_seriais: normalizeSerials(editingExchange.entregue_acessorios_seriais),
            devolvido_acessorios: devolvidoAccs,
            devolvido_acessorios_seriais: normalizeSerials(editingExchange.devolvido_acessorios_seriais),
            entregue_observacoes: editingExchange.entregue_observacoes || oldData.observacoes || '',
            devolvido_observacoes: editingExchange.devolvido_observacoes || '',
            entregue_adicionais: editingExchange.entregue_adicionais || [],
            devolvido_adicionais: editingExchange.devolvido_adicionais || []
        });

        // Detect if models are custom
        const entregueCustom = editingExchange.entregue_modelo && !MODELS_LIST.filter(m => m !== 'Outros').includes(editingExchange.entregue_modelo);
        const devolvidoCustom = editingExchange.devolvido_modelo && !MODELS_LIST.filter(m => m !== 'Outros').includes(editingExchange.devolvido_modelo);
        
        const adicionaisCustom: Record<string, boolean> = {};
        [...(editingExchange.entregue_adicionais || []), ...(editingExchange.devolvido_adicionais || [])].forEach(item => {
          if (item.modelo && !MODELS_LIST.filter(m => m !== 'Outros').includes(item.modelo)) {
            adicionaisCustom[item.id] = true;
          }
        });

        setIsCustomModel({
          entregue: !!entregueCustom,
          devolvido: !!devolvidoCustom,
          adicionais: adicionaisCustom
        });
    }
  }, [editingExchange]);

  const addAdditionalItem = (target: 'entregue' | 'devolvido') => {
    const field = target === 'entregue' ? 'entregue_adicionais' : 'devolvido_adicionais';
    const newItem: AdditionalItem = {
      id: Math.random().toString(36).substr(2, 9).toUpperCase(),
      tipo: EQUIPMENT_TYPES[0],
      marca: BRANDS[0],
      modelo: MODELS_LIST[0],
      serial: ''
    };
    setFormData(prev => ({
      ...prev,
      [field]: [...(prev[field] || []), newItem]
    }));
  };

  const removeAdditionalItem = (target: 'entregue' | 'devolvido', id: string) => {
    const field = target === 'entregue' ? 'entregue_adicionais' : 'devolvido_adicionais';
    setFormData(prev => ({
      ...prev,
      [field]: (prev[field] || []).filter(item => item.id !== id)
    }));
  };

  const updateAdditionalItem = (target: 'entregue' | 'devolvido', id: string, updates: Partial<AdditionalItem>) => {
    const field = target === 'entregue' ? 'entregue_adicionais' : 'devolvido_adicionais';
    setFormData(prev => ({
      ...prev,
      [field]: (prev[field] || []).map(item => item.id === id ? { ...item, ...updates } : item)
    }));
  };

  // Update default observations when operation type changes
  useEffect(() => {
    if (!editingExchange) { // Only auto-update text for new forms
      if (formData.operationType === 'delivery') {
        setFormData(prev => ({ 
            ...prev, 
            entregue_observacoes: 'Entrega de equipamento novo' 
        }));
      } else if (formData.operationType === 'return') {
        setFormData(prev => ({ 
            ...prev, 
            devolvido_observacoes: 'Devolução de equipamento' 
        }));
      } else {
        setFormData(prev => ({ 
            ...prev, 
            entregue_observacoes: 'Entrega referente a troca',
            devolvido_observacoes: 'Devolução referente a troca'
        }));
      }
    }
  }, [formData.operationType, editingExchange]);

  // Carrega informações do Conector Office 365 na inicialização
  useEffect(() => {
    apiService.getOffice365ConnectorInfo().then(info => {
      setM365ConnectorInfo(info);
    }).catch(() => {});
  }, []);

  // Sincroniza usuário selecionado quando editando ou carregando formulário
  useEffect(() => {
    if (editingExchange?.colaborador_email) {
      const email = editingExchange.colaborador_email.toLowerCase();
      const match = (AD_USERS || []).find(u => u.email.toLowerCase() === email);
      if (match) {
        setSelectedM365User({
          id: `m365_${match.email}`,
          displayName: match.nome,
          mail: match.email,
          userPrincipalName: match.email,
          jobTitle: match.email.includes('.ext@') ? 'Prestador de Serviços TI' : 'Colaborador Corporativo',
          department: match.email.includes('araujo') ? 'LATAM End User Services & Support' : 'Cirion Technologies',
          officeLocation: 'Brasil',
          source: 'corporate_catalog'
        });
      } else if (editingExchange.colaborador_nome) {
        setSelectedM365User({
          id: `m365_${editingExchange.colaborador_email}`,
          displayName: editingExchange.colaborador_nome,
          mail: editingExchange.colaborador_email,
          userPrincipalName: editingExchange.colaborador_email,
          jobTitle: 'Colaborador Corporativo',
          department: 'Cirion Technologies',
          officeLocation: 'Brasil',
          source: 'corporate_catalog'
        });
      }
    }
  }, [editingExchange]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (adRef.current && !adRef.current.contains(e.target as Node)) setShowSuggestions(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Função de busca instantânea no catálogo corporativo unificado (Síncrona, 0ms de latência)
  const getCorporateCatalogMatches = (searchStr: string): Office365User[] => {
    const clean = (searchStr || '').trim();
    if (!clean) {
      // Quando vazio, retorna os primeiros 60 colaboradores estritamente em ordem alfabética A-Z
      return (AD_USERS || [])
        .slice(0, 60)
        .map((u, i) => ({
          id: `local_focus_${i}_${u.email}`,
          displayName: u.nome,
          mail: u.email,
          userPrincipalName: u.email,
          jobTitle: u.email.includes('.ext@') ? 'Prestador de Serviços TI' : 'Colaborador Corporativo',
          department: u.email.toLowerCase().includes('araujo') ? 'LATAM End User Services & Support' : 'Cirion Technologies',
          officeLocation: 'Brasil',
          companyName: 'Cirion Technologies',
          accountEnabled: true,
          source: 'corporate_catalog',
          photoUrl: `/api/office365/users/${encodeURIComponent(u.email)}/photo?name=${encodeURIComponent(u.nome)}`
        }));
    }

    const normalizedQuery = normalizeText(clean);
    const queryTokens = normalizedQuery.split(/\s+/).filter(Boolean);

    return (AD_USERS || [])
      .filter(u => {
        if (!u || !u.nome) return false;
        const normNome = normalizeText(u.nome);
        const normEmail = normalizeText(u.email || '');
        // Valida se cada token digitado está presente no nome ou no email corporativo
        return queryTokens.every(token => normNome.includes(token) || normEmail.includes(token));
      })
      .sort((a, b) => {
        const nameA = a.nome || '';
        const nameB = b.nome || '';
        const normA = normalizeText(nameA);
        const normB = normalizeText(nameB);
        
        // Prioriza quem começa exatamente com a busca digitada
        const aStarts = normA.startsWith(normalizedQuery);
        const bStarts = normB.startsWith(normalizedQuery);
        if (aStarts && !bStarts) return -1;
        if (!aStarts && bStarts) return 1;

        return nameA.localeCompare(nameB, 'pt-BR', { sensitivity: 'base' });
      })
      .slice(0, 80)
      .map((u, i) => ({
        id: `local_${i}_${u.email}`,
        displayName: u.nome,
        mail: u.email,
        userPrincipalName: u.email,
        jobTitle: u.email.includes('.ext@') ? 'Prestador de Serviços TI' : 'Colaborador Corporativo',
        department: u.email.toLowerCase().includes('araujo') ? 'LATAM End User Services & Support' : 'Cirion Technologies',
        officeLocation: 'Brasil',
        companyName: 'Cirion Technologies',
        accountEnabled: true,
        source: 'corporate_catalog',
        photoUrl: `/api/office365/users/${encodeURIComponent(u.email)}/photo?name=${encodeURIComponent(u.nome)}`
      }));
  };

  const searchOffice365Users = async (query: string) => {
    const trimmed = query.trim();
    if (!trimmed) return;

    setIsSearchingM365(true);
    try {
      const resp = await apiService.searchOffice365Users(trimmed);
      
      // Proteção contra condição de corrida: se o usuário já digitou outra coisa, descarta a resposta antiga!
      if (activeQueryRef.current.trim() !== trimmed) {
        return;
      }

      // Se a resposta trouxer usuários, mescla com os resultados locais sem sobrescrever para vazio
      if (resp && Array.isArray(resp.users) && resp.users.length > 0) {
        setSuggestedUsers(prev => {
          if (activeQueryRef.current.trim() !== trimmed) return prev;
          
          const map = new Map<string, Office365User>();
          // Começa mantendo os resultados locais imediatos
          for (const u of prev) {
            const key = (u.mail || u.userPrincipalName || u.displayName).toLowerCase().trim();
            map.set(key, u);
          }
          // Acrescenta novos colaboradores retornados pelo Graph API / Entra ID
          for (const u of resp.users) {
            const key = (u.mail || u.userPrincipalName || u.displayName).toLowerCase().trim();
            if (!map.has(key)) {
              map.set(key, u);
            }
          }

          return Array.from(map.values()).sort((a, b) => 
            (a.displayName || '').localeCompare(b.displayName || '', 'pt-BR', { sensitivity: 'base' })
          );
        });
      }
    } catch (e) {
      console.warn('Erro ao consultar Conector Office 365 remoto:', e);
    } finally {
      if (activeQueryRef.current.trim() === trimmed) {
        setIsSearchingM365(false);
      }
    }
  };

  const handleNameInput = (value: string) => {
    // Atualização imediata do formulário e do ponteiro da busca atual
    activeQueryRef.current = value;
    setFormData(prev => ({ ...prev, colaborador_nome: value }));

    if (selectedM365User && selectedM365User.displayName !== value) {
      setSelectedM365User(null);
    }

    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    const clean = value.trim();
    if (clean.length >= 1) {
      // 1. Resposta SÍNCRONA e IMEDIATA (0ms) - pesquisa local no catálogo
      const immediateMatches = getCorporateCatalogMatches(clean);
      setSuggestedUsers(immediateMatches);
      setShowSuggestions(true);

      // 2. Consulta complementar ao Conector Office 365 (Microsoft Graph) em background
      searchTimeoutRef.current = setTimeout(() => {
        searchOffice365Users(clean);
      }, 300);
    } else {
      // Se o campo estiver em branco mas o usuário estiver nele, mostra catálogo ordenado A-Z
      const initialUsers = getCorporateCatalogMatches('');
      setSuggestedUsers(initialUsers);
      setShowSuggestions(true);
    }
  };

  const handleFocusSearch = () => {
    activeQueryRef.current = formData.colaborador_nome;
    const matches = getCorporateCatalogMatches(formData.colaborador_nome);
    setSuggestedUsers(matches);
    setShowSuggestions(true);
  };

  const handleSelectUser = (u: Office365User) => {
    activeQueryRef.current = u.displayName;
    setFormData(prev => ({ 
      ...prev, 
      colaborador_nome: u.displayName, 
      colaborador_email: u.mail || u.userPrincipalName 
    }));
    setSelectedM365User(u);
    setShowSuggestions(false);
  };

  const handleClearSelectedUser = () => {
    activeQueryRef.current = '';
    setFormData(prev => ({ 
      ...prev, 
      colaborador_nome: '', 
      colaborador_email: '' 
    }));
    setSelectedM365User(null);
    const initialUsers = getCorporateCatalogMatches('');
    setSuggestedUsers(initialUsers);
    setShowSuggestions(true);
  };

  const handleModelChange = (model: string, target: 'entregue' | 'devolvido') => {
    const specs = MODEL_SPECS[model];
    const prefix = target === 'entregue' ? 'entregue_' : 'devolvido_';
    
    let detectedBrand = "";

    if (/^[EXT]/i.test(model)) {
        detectedBrand = "Lenovo";
    } else if (model === "SAMSUNG A12") {
        detectedBrand = "Samsung";
    } else if (model === "MOTO G54" || model === "MOTO GS5") {
        detectedBrand = "Motorola";
    } else if (/^IPHONE/i.test(model)) {
        detectedBrand = "Apple";
    }

    setFormData(prev => {
        const nextState = { ...prev };
        (nextState as any)[`${prefix}modelo`] = model;
        
        if (specs) {
            if (specs.processor) (nextState as any)[`${prefix}processador`] = specs.processor;
            if (specs.memory) (nextState as any)[`${prefix}memoria`] = specs.memory;
            if (specs.storage) (nextState as any)[`${prefix}armazenamento`] = specs.storage;
        }
        
        if (detectedBrand) {
            (nextState as any)[`${prefix}marca`] = detectedBrand;
        }

        return nextState;
    });
  };

  const handleAccessoryToggle = (acc: string, target: 'entregue' | 'devolvido') => {
    const prefix = target === 'entregue' ? 'entregue_acessorios' : 'devolvido_acessorios';
    const current = formData[prefix] as string[];
    const updated = current.includes(acc) ? current.filter(a => a !== acc) : [...current, acc];
    setFormData(prev => ({ ...prev, [prefix]: updated }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;
    setIsSubmitting(true);
    try {
      const payload = { ...formData, id: formData.id || Math.random().toString(36).substr(2, 9).toUpperCase() };
      await onSave(payload, false);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSaveClickCustom = async (e: React.MouseEvent<HTMLButtonElement>, isDocuSignDirect: boolean) => {
    e.preventDefault();
    const form = e.currentTarget.form;
    if (form && !form.checkValidity()) {
      form.reportValidity();
      return;
    }
    
    if (isSubmitting) return;
    setIsSubmitting(true);
    try {
      const payload = { ...formData, id: formData.id || Math.random().toString(36).substr(2, 9).toUpperCase() };
      await onSave(payload, isDocuSignDirect);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-5 md:p-10 space-y-10">
      
      {/* Top Controls: ReadOnly Warning & Operation Type Selector */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
        {isReadOnly ? (
          <div className="bg-amber-50 dark:bg-dracula-orange/10 border border-amber-200 p-4 rounded-2xl flex items-center gap-3">
            <Lock className="text-amber-600" size={20} />
            <span className="text-xs font-bold text-amber-800 uppercase tracking-widest">Documento Finalizado e Bloqueado</span>
          </div>
        ) : (
          <div className="bg-slate-100 dark:bg-dracula-bg/60 p-1.5 rounded-xl inline-flex flex-wrap gap-1">
            <button
              type="button"
              onClick={() => setFormData(prev => ({ ...prev, operationType: 'exchange' }))}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-lg text-xs font-bold transition-all ${
                formData.operationType === 'exchange' 
                  ? 'bg-white dark:bg-dracula-current text-dracula-purple shadow-sm' 
                  : 'text-slate-500 hover:text-slate-700 dark:text-slate-400'
              }`}
            >
              <ArrowRightLeft size={14} />
              Troca
            </button>
            <button
              type="button"
              onClick={() => setFormData(prev => ({ ...prev, operationType: 'delivery' }))}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-lg text-xs font-bold transition-all ${
                formData.operationType === 'delivery' 
                  ? 'bg-white dark:bg-dracula-current text-emerald-500 shadow-sm' 
                  : 'text-slate-500 hover:text-slate-700 dark:text-slate-400'
              }`}
            >
              <UserPlus size={14} />
              Somente Entrega
            </button>
            <button
              type="button"
              onClick={() => setFormData(prev => ({ ...prev, operationType: 'return' }))}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-lg text-xs font-bold transition-all ${
                formData.operationType === 'return' 
                  ? 'bg-white dark:bg-dracula-current text-rose-500 shadow-sm' 
                  : 'text-slate-500 hover:text-slate-700 dark:text-slate-400'
              }`}
            >
              <UserMinus size={14} />
              Somente Devolução
            </button>
          </div>
        )}
      </div>

      {/* Dados Colaborador */}
      <section>
        <SectionHeader icon={User} title="Informações do Colaborador" color="bg-dracula-purple" />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="relative z-50" ref={adRef}>
            <div className="flex items-center justify-between ml-1 mb-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase">Nome Completo</label>
              <button
                type="button"
                onClick={() => setShowConnectorModal(true)}
                className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-blue-50 dark:bg-blue-900/30 border border-blue-200/80 dark:border-blue-700/50 text-[10px] font-semibold text-blue-700 dark:text-blue-300 hover:bg-blue-100 dark:hover:bg-blue-800/40 transition-colors shadow-2xs cursor-pointer"
                title="Conector Office 365 / Microsoft Entra ID ativo para localização de colaboradores"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                <Building2 size={11} className="text-blue-600 dark:text-blue-400" />
                <span>Conector Office 365</span>
              </button>
            </div>

            <div className="relative mt-1">
              <input 
                disabled={isReadOnly} 
                required 
                className={`w-full p-4 rounded-xl border-2 border-blue-100 bg-blue-50 focus:border-dracula-purple dark:bg-blue-500/10 dark:border-blue-500/20 outline-none transition-all text-sm pr-12 font-bold text-blue-900 dark:text-blue-100 shadow-sm ${
                  selectedM365User ? 'pl-12' : 'pl-10'
                }`}
                value={formData.colaborador_nome} 
                onChange={e => handleNameInput(e.target.value)} 
                onFocus={handleFocusSearch}
                onKeyDown={e => {
                  if (e.key === 'Escape') {
                    setShowSuggestions(false);
                  } else if (e.key === 'Enter' && showSuggestions && suggestedUsers.length > 0) {
                    e.preventDefault();
                    handleSelectUser(suggestedUsers[0]);
                  }
                }}
                autoComplete="off"
                placeholder="Digite para buscar colaborador (A-Z)..."
              />
              <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none flex items-center">
                {selectedM365User ? (
                  <UserAvatar
                    name={selectedM365User.displayName}
                    email={selectedM365User.mail || selectedM365User.userPrincipalName}
                    photoUrl={selectedM365User.photoUrl}
                    size="sm"
                    showM365Badge={true}
                  />
                ) : (
                  <Search size={16} className="text-blue-500" />
                )}
              </div>

              <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1.5">
                {isSearchingM365 && (
                  <Loader2 className="animate-spin text-blue-500" size={16} />
                )}
                {selectedM365User && (
                  <span title="Colaborador verificado no Office 365" className="text-emerald-500">
                    <CheckCircle2 size={16} />
                  </span>
                )}
                {!isReadOnly && formData.colaborador_nome && (
                  <button
                    type="button"
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={handleClearSelectedUser}
                    className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors cursor-pointer"
                    title="Limpar pesquisa"
                  >
                    <X size={14} />
                  </button>
                )}
              </div>
            </div>

            {showSuggestions && (
              <div className="absolute top-full left-0 w-full z-[100] mt-1.5 bg-white dark:bg-dracula-current rounded-2xl shadow-2xl border border-blue-100 dark:border-slate-700 overflow-hidden divide-y divide-slate-100 dark:divide-slate-700/60 max-h-80 overflow-y-auto">
                <div className="px-3.5 py-2 bg-slate-50/90 dark:bg-dracula-bg/90 flex items-center justify-between text-[11px] font-semibold text-slate-500 dark:text-slate-400 border-b border-slate-100 dark:border-slate-700 sticky top-0 backdrop-blur-sm z-10">
                  <div className="flex items-center gap-1.5 text-blue-700 dark:text-blue-300">
                    <Building2 size={12} />
                    <span>Diretório Office 365 Cirion</span>
                  </div>
                  <span className="text-[10px] bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300 px-2 py-0.5 rounded font-mono font-medium">
                    {suggestedUsers.length} localizados (Ordem A-Z)
                  </span>
                </div>

                {suggestedUsers.length > 0 ? (
                  suggestedUsers.map((u, i) => {
                    const uniqueKey = `m365_sugg_${u.mail || u.userPrincipalName || u.id || i}_${i}`;
                    return (
                      <button 
                        key={uniqueKey} 
                        type="button" 
                        onMouseDown={(e) => e.preventDefault()}
                        onClick={() => handleSelectUser(u)} 
                        className="w-full p-3 text-left hover:bg-blue-50/70 dark:hover:bg-dracula-bg/90 transition-colors group flex items-start gap-3 cursor-pointer"
                      >
                        <UserAvatar
                          name={u.displayName}
                          email={u.mail || u.userPrincipalName}
                          photoUrl={u.photoUrl}
                          size="md"
                          showM365Badge={true}
                          className="mt-0.5"
                        />

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-xs text-slate-800 dark:text-dracula-fg group-hover:text-blue-600 dark:group-hover:text-blue-400 truncate">
                              {u.displayName}
                            </span>
                            <span className="inline-flex items-center gap-0.5 text-[9px] font-medium px-1.5 py-0.2 rounded bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 shrink-0 border border-emerald-200/50 dark:border-emerald-800/40">
                              <CheckCircle2 size={9} />
                              M365
                            </span>
                          </div>
                          
                          <div className="text-[11px] font-medium text-slate-500 dark:text-dracula-comment truncate mt-0.5">
                            {u.jobTitle || 'Colaborador'} • {u.department || 'Cirion Technologies'}
                          </div>

                          <div className="text-[11px] text-blue-600/90 dark:text-blue-400/90 font-mono truncate mt-0.5">
                            {u.mail || u.userPrincipalName}
                          </div>
                        </div>
                      </button>
                    );
                  })
                ) : (
                  <div className="p-4 text-center">
                    <p className="text-xs font-semibold text-slate-600 dark:text-slate-300">
                      Nenhum colaborador localizado com "{formData.colaborador_nome}"
                    </p>
                    <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-1">
                      Você pode prosseguir digitando o nome e o e-mail corporativo manualmente.
                    </p>
                  </div>
                )}

                <div className="p-2 bg-slate-50/60 dark:bg-dracula-bg/60 text-center text-[10px] text-slate-400">
                  Sincronizado via Conector Microsoft 365 (Graph API & Entra ID) • Ordem Alfabética
                </div>
              </div>
            )}
          </div>

          <div>
            <div className="flex items-center justify-between ml-1 mb-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase">E-mail Corporativo</label>
              {selectedM365User && (
                <span className="text-[10px] font-semibold text-emerald-600 dark:text-emerald-400 inline-flex items-center gap-1">
                  <ShieldCheck size={11} />
                  Office 365 Verificado
                </span>
              )}
            </div>
            <div className="relative mt-1">
              <input 
                disabled={isReadOnly} 
                type="email" 
                required 
                placeholder="exemplo@empresa.com"
                className="w-full p-4 rounded-xl border-2 border-blue-100 bg-blue-50 focus:border-dracula-purple dark:bg-blue-500/10 dark:border-blue-500/20 text-sm outline-none transition-all font-bold text-blue-900 dark:text-blue-100 shadow-sm pl-10" 
                value={formData.colaborador_email} 
                onChange={e => setFormData(prev => ({...prev, colaborador_email: e.target.value}))}
              />
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-blue-400 pointer-events-none" size={16} />
            </div>
          </div>

          <div>
            <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">Data da Operação</label>
            <input disabled={isReadOnly} type="date" required className="w-full p-4 rounded-xl border-2 border-slate-100 focus:border-dracula-purple mt-1 dark:bg-dracula-bg text-sm outline-none transition-all shadow-sm" value={formData.data_troca} onChange={e => setFormData(prev => ({...prev, data_troca: e.target.value}))}/>
          </div>
        </div>

        {/* Card de Colaborador Localizado via Conector Office 365 */}
        {selectedM365User && (
          <div className="mt-4 p-4 rounded-2xl bg-blue-50/60 dark:bg-blue-950/30 border border-blue-200/70 dark:border-blue-800/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-3.5">
              <UserAvatar
                name={selectedM365User.displayName}
                email={selectedM365User.mail || selectedM365User.userPrincipalName}
                size="xl"
                showM365Badge={true}
                className="shrink-0 shadow-sm"
              />
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-800 dark:text-slate-100 text-sm">{selectedM365User.displayName}</span>
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-100/70 dark:bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-200/50 dark:border-emerald-800/40">
                    <CheckCircle2 size={11} /> Conector Office 365
                  </span>
                </div>
                <div className="text-slate-500 dark:text-slate-300 text-[11px] mt-0.5 flex flex-wrap items-center gap-x-3 gap-y-0.5">
                  <span className="inline-flex items-center gap-1">
                    <Briefcase size={11} className="text-slate-400"/> {selectedM365User.jobTitle || 'Colaborador Corporativo'}
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <Building2 size={11} className="text-slate-400"/> {selectedM365User.department || 'Cirion Technologies'}
                  </span>
                  {selectedM365User.officeLocation && (
                    <span className="inline-flex items-center gap-1">
                      <MapPin size={11} className="text-slate-400"/> {selectedM365User.officeLocation}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {!isReadOnly && (
              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={handleClearSelectedUser}
                  className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 hover:underline px-2 py-1 text-left sm:text-right"
                >
                  Trocar Colaborador
                </button>
              </div>
            )}
          </div>
        )}
      </section>

      {/* Grid de Equipamentos */}
      <div className="relative">
        {isFreeVersion && !editingExchange && (
          <div className="absolute inset-0 z-[60] backdrop-blur-[2px] bg-white/40 dark:bg-dracula-bg/40 flex items-center justify-center p-6 rounded-[2.5rem]">
            <div className="bg-white dark:bg-dracula-bg p-8 rounded-3xl shadow-2xl border border-slate-200 dark:border-dracula-current max-w-md text-center space-y-6 animate-in zoom-in duration-300">
              <div className="w-16 h-16 bg-dracula-purple/10 text-dracula-purple rounded-2xl flex items-center justify-center mx-auto">
                <CreditCard size={32} />
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-bold">Versão Premium Necessária</h3>
                <p className="text-sm text-slate-500 dark:text-dracula-comment leading-relaxed">
                  A funcionalidade de <b>Troca</b> e <b>Devolução</b> está disponível apenas na versão completa. 
                  O uso gratuito é limitado a <b>Somente Entrega</b>.
                </p>
                <p className="text-[11px] text-slate-400 dark:text-dracula-comment/60 leading-tight italic">
                  Sua contribuição de apenas <b>R$ 10,00</b> nos incentiva a continuar desenvolvendo ferramentas úteis para automatizar processos corporativos.
                </p>
              </div>
              {MERCADO_PAGO_URL ? (
                <a 
                  href={MERCADO_PAGO_URL} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="block w-full py-4 bg-dracula-purple text-white rounded-2xl font-bold shadow-lg shadow-dracula-purple/20 hover:scale-105 transition-all text-sm"
                >
                  Adquirir Versão Completa
                </a>
              ) : (
                <div className="p-4 bg-slate-50 dark:bg-dracula-darker rounded-xl text-xs text-slate-400 font-medium italic border border-dashed border-slate-200 dark:border-dracula-current">
                  Contate o administrador para obter a chave de licença ou configurar o link de pagamento.
                </div>
              )}
              <button 
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, operationType: 'delivery' }))}
                className="text-xs font-bold text-dracula-purple hover:underline"
              >
                Continuar com Versão Gratuita (Entrega)
              </button>
            </div>
          </div>
        )}

        <div className={`grid grid-cols-1 ${formData.operationType === 'exchange' ? 'xl:grid-cols-2' : 'max-w-4xl mx-auto'} gap-10 ${isFreeVersion && !editingExchange ? 'opacity-20 pointer-events-none' : ''}`}>
        
        {/* Entregue Section - HIDE IF RETURN ONLY */}
        {formData.operationType !== 'return' && (
          <div className="p-6 bg-slate-50 dark:bg-dracula-bg/40 rounded-3xl border border-slate-100 dark:border-dracula-current space-y-6 flex flex-col h-full shadow-sm animate-in fade-in slide-in-from-left-4 duration-300">
            <SectionHeader icon={Package} title="Equipamento Entregue" color="bg-emerald-500" />
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 flex-1">
              <div className="relative sm:col-span-2">
                <label className="text-[10px] font-bold text-slate-400 uppercase flex items-center gap-1">
                  <Fingerprint size={12}/> Serial / IMEI
                </label>
                <div className="relative mt-1">
                  <input 
                    autoComplete="off"
                    disabled={isReadOnly} 
                    required 
                    className="w-full p-3 rounded-xl border-2 font-mono font-bold text-sm pr-12 dark:bg-dracula-bg transition-all outline-none border-emerald-100 focus:border-emerald-500 bg-blue-200"
                    value={formData.entregue_serial} 
                    onChange={e => setFormData(prev => ({...prev, entregue_serial: e.target.value}))}
                  />
                  {!isReadOnly && (
                    <button type="button" onClick={() => setScannerConfig({isOpen: true, target: 'entregue'})} className="absolute right-3 top-1/2 -translate-y-1/2 text-emerald-600">
                      <ScanLine size={20}/>
                    </button>
                  )}
                </div>
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase">Tipo</label>
                <select disabled={isReadOnly} className="w-full p-3 rounded-xl border mt-1 bg-white dark:bg-dracula-bg text-xs" value={formData.entregue_tipo} onChange={e => setFormData({...formData, entregue_tipo: e.target.value})}>
                  {EQUIPMENT_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase">Marca</label>
                <select disabled={isReadOnly} className="w-full p-3 rounded-xl border mt-1 bg-white dark:bg-dracula-bg text-xs" value={formData.entregue_marca} onChange={e => setFormData({...formData, entregue_marca: e.target.value})}>
                  {BRANDS.map(b => <option key={b} value={b}>{b}</option>)}
                </select>
              </div>

              <div className="sm:col-span-2">
                <label className="text-[10px] font-bold text-slate-400 uppercase">Modelo</label>
                <select 
                  disabled={isReadOnly} 
                  className="w-full p-3 rounded-xl border mt-1 bg-white dark:bg-dracula-bg text-xs" 
                  value={isCustomModel.entregue ? 'Outros' : formData.entregue_modelo} 
                  onChange={e => {
                    if (e.target.value === 'Outros') {
                      setIsCustomModel(prev => ({ ...prev, entregue: true }));
                      setFormData(prev => ({ ...prev, entregue_modelo: '' }));
                    } else {
                      setIsCustomModel(prev => ({ ...prev, entregue: false }));
                      handleModelChange(e.target.value, 'entregue');
                    }
                  }}
                >
                  {MODELS_LIST.map(m => <option key={m} value={m}>{m}</option>)}
                </select>
                {isCustomModel.entregue && (
                  <input
                    disabled={isReadOnly}
                    className="w-full p-3 rounded-xl border mt-2 bg-white dark:bg-dracula-bg text-xs outline-none focus:border-dracula-purple transition-all border-emerald-200"
                    placeholder="Especifique o modelo..."
                    value={formData.entregue_modelo}
                    onChange={e => setFormData(prev => ({ ...prev, entregue_modelo: e.target.value }))}
                  />
                )}
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase">Condição</label>
                <select disabled={isReadOnly} className="w-full p-3 rounded-xl border mt-1 bg-white dark:bg-dracula-bg text-xs" value={formData.entregue_condicao} onChange={e => setFormData({...formData, entregue_condicao: e.target.value as EquipmentCondition})}>
                  <option value={EquipmentCondition.NEW}>Novo</option>
                  <option value={EquipmentCondition.USED}>Usado</option>
                </select>
              </div>

              <div className="sm:col-span-2">
                <label className="text-[10px] font-bold text-slate-400 uppercase">Processador</label>
                <select 
                  disabled={isReadOnly || formData.entregue_tipo === 'Monitor'} 
                  className="w-full p-3 rounded-xl border mt-1 bg-white dark:bg-dracula-bg text-xs disabled:opacity-50 disabled:cursor-not-allowed" 
                  value={formData.entregue_processador} 
                  onChange={e => setFormData({...formData, entregue_processador: e.target.value})}
                >
                  {PROCESSORS_LIST.map(p => <option key={p} value={p}>{p}</option>)}
                </select>
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase">Memória RAM</label>
                <input 
                  list="ram-list"
                  disabled={isReadOnly || formData.entregue_tipo === 'Monitor'} 
                  className="w-full p-3 rounded-xl border mt-1 bg-white dark:bg-dracula-bg text-xs outline-none focus:border-dracula-purple transition-all disabled:opacity-50 disabled:cursor-not-allowed" 
                  value={formData.entregue_memoria} 
                  onChange={e => setFormData({...formData, entregue_memoria: e.target.value})}
                  placeholder="Ex: 24GB"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase">Armazenamento (HD/SSD)</label>
                <input 
                  list="storage-list"
                  disabled={isReadOnly || formData.entregue_tipo === 'Monitor'} 
                  className="w-full p-3 rounded-xl border mt-1 bg-white dark:bg-dracula-bg text-xs outline-none focus:border-dracula-purple transition-all disabled:opacity-50 disabled:cursor-not-allowed" 
                  value={formData.entregue_armazenamento} 
                  onChange={e => setFormData({...formData, entregue_armazenamento: e.target.value})}
                  placeholder="Ex: 512GB"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="text-[10px] font-bold text-slate-400 uppercase mb-2 block">Acessórios</label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {ACCESSORIES_OPTIONS.map(acc => (
                    <button
                      key={acc}
                      type="button"
                      disabled={isReadOnly}
                      onClick={() => handleAccessoryToggle(acc, 'entregue')}
                      className={`flex items-center gap-2 p-2 rounded-lg border text-[10px] font-bold transition-all ${
                        formData.entregue_acessorios.includes(acc)
                          ? 'bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border-emerald-500/50 shadow-sm'
                          : 'bg-white dark:bg-dracula-bg text-slate-500 border-slate-200 dark:border-dracula-current hover:border-dracula-purple'
                      }`}
                    >
                      <CheckSquare size={14} className={ formData.entregue_acessorios.includes(acc) ? 'opacity-100 text-emerald-600 dark:text-emerald-400' : 'opacity-20' } />
                      {acc}
                    </button>
                  ))}
                </div>

                {/* Campos de Serial para Acessórios Entregues Selecionados */}
                {formData.entregue_acessorios.some(acc => ACCESSORIES_WITH_SERIAL.includes(acc)) && (
                  <div className="mt-3 p-3.5 bg-emerald-500/10 dark:bg-emerald-950/20 border border-emerald-500/20 dark:border-emerald-500/30 rounded-xl space-y-3 animate-in fade-in duration-200">
                    <div className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400 flex items-center gap-1.5">
                      <Fingerprint size={13} />
                      Número de Serial dos Acessórios (Entrega)
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {formData.entregue_acessorios.filter(acc => ACCESSORIES_WITH_SERIAL.includes(acc)).map(acc => (
                        <div key={acc} className="space-y-1">
                          <label className="text-[9px] font-bold text-slate-500 dark:text-dracula-comment uppercase flex items-center justify-between">
                            <span>Serial / IMEI - {acc}</span>
                          </label>
                          <div className="relative">
                            <input
                              type="text"
                              disabled={isReadOnly}
                              className="w-full p-2.5 pr-9 rounded-lg border bg-white dark:bg-dracula-bg border-emerald-200 dark:border-emerald-900/50 text-xs font-mono font-bold outline-none focus:border-emerald-500 transition-all placeholder:font-sans placeholder:font-normal placeholder:text-slate-400"
                              placeholder={`Digite ou escaneie o serial...`}
                              value={formData.entregue_acessorios_seriais?.[acc] || ''}
                              onChange={e => {
                                const val = e.target.value;
                                setFormData(prev => ({
                                  ...prev,
                                  entregue_acessorios_seriais: {
                                    ...(prev.entregue_acessorios_seriais || {}),
                                    [acc]: val
                                  }
                                }));
                              }}
                            />
                            {!isReadOnly && (
                              <button
                                type="button"
                                onClick={() => setScannerConfig({
                                  isOpen: true,
                                  target: 'entregue',
                                  accessoryKey: acc
                                })}
                                className="absolute right-2 top-1/2 -translate-y-1/2 text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 p-1 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 rounded transition-colors"
                                title={`Escanear código de barras de ${acc}`}
                              >
                                <ScanLine size={16} />
                              </button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Additional Items for Delivery */}
              {(formData.operationType === 'delivery' || formData.operationType === 'exchange') && (
                <div className="sm:col-span-2 space-y-4 pt-4 border-t dark:border-dracula-current bg-emerald-500/10 p-4 rounded-2xl">
                  <div className="flex justify-between items-center">
                    <h4 className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">Itens Adicionais (Entrega)</h4>
                    {!isReadOnly && (
                      <button 
                        type="button" 
                        onClick={() => addAdditionalItem('entregue')}
                        className="flex items-center gap-2 px-3 py-1.5 bg-sky-400/10 hover:bg-sky-400/20 text-sky-600 dark:text-sky-400 border border-sky-200/50 dark:border-sky-400/20 rounded-xl text-[10px] font-bold transition-all backdrop-blur-sm"
                      >
                        <Plus size={14} /> Adicionar Item
                      </button>
                    )}
                  </div>
                  
                  <div className="space-y-3">
                    {formData.entregue_adicionais?.map((item) => (
                      <div key={item.id} className="p-4 bg-white dark:bg-dracula-darker rounded-2xl border border-slate-100 dark:border-dracula-current shadow-sm relative group">
                        {!isReadOnly && (
                          <button 
                            type="button" 
                            onClick={() => removeAdditionalItem('entregue', item.id)}
                            className="absolute -top-2 -right-2 p-1.5 bg-rose-500 text-white rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-all"
                          >
                            <Trash2 size={12} />
                          </button>
                        )}
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="text-[9px] font-bold text-slate-400 uppercase">Tipo</label>
                            <select 
                              disabled={isReadOnly}
                              className="w-full p-2 rounded-lg border mt-1 bg-slate-50 dark:bg-dracula-bg text-[10px]" 
                              value={item.tipo} 
                              onChange={e => updateAdditionalItem('entregue', item.id, { tipo: e.target.value })}
                            >
                              {EQUIPMENT_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                            </select>
                          </div>
                          <div>
                            <label className="text-[9px] font-bold text-slate-400 uppercase">Marca</label>
                            <select 
                              disabled={isReadOnly}
                              className="w-full p-2 rounded-lg border mt-1 bg-slate-50 dark:bg-dracula-bg text-[10px]" 
                              value={item.marca} 
                              onChange={e => updateAdditionalItem('entregue', item.id, { marca: e.target.value })}
                            >
                              {BRANDS.map(b => <option key={b} value={b}>{b}</option>)}
                            </select>
                          </div>
                          <div className="col-span-2">
                            <label className="text-[9px] font-bold text-slate-400 uppercase">Modelo</label>
                            <select 
                              disabled={isReadOnly}
                              className="w-full p-2 rounded-lg border mt-1 bg-slate-50 dark:bg-dracula-bg text-[10px]" 
                              value={isCustomModel.adicionais[item.id] ? 'Outros' : item.modelo} 
                              onChange={e => {
                                if (e.target.value === 'Outros') {
                                  setIsCustomModel(prev => ({ 
                                    ...prev, 
                                    adicionais: { ...prev.adicionais, [item.id]: true } 
                                  }));
                                  updateAdditionalItem('entregue', item.id, { modelo: '' });
                                } else {
                                  setIsCustomModel(prev => ({ 
                                    ...prev, 
                                    adicionais: { ...prev.adicionais, [item.id]: false } 
                                  }));
                                  updateAdditionalItem('entregue', item.id, { modelo: e.target.value });
                                }
                              }}
                            >
                              {MODELS_LIST.map(m => <option key={m} value={m}>{m}</option>)}
                            </select>
                            {isCustomModel.adicionais[item.id] && (
                              <input
                                disabled={isReadOnly}
                                className="w-full p-2 rounded-lg border mt-2 bg-white dark:bg-dracula-bg text-[10px] outline-none focus:border-dracula-purple transition-all"
                                placeholder="Especifique o modelo..."
                                value={item.modelo}
                                onChange={e => updateAdditionalItem('entregue', item.id, { modelo: e.target.value })}
                              />
                            )}
                          </div>
                          <div className="col-span-2">
                            <label className="text-[9px] font-bold text-slate-400 uppercase">Serial / IMEI</label>
                            <div className="relative mt-1">
                              <input 
                                disabled={isReadOnly}
                                className="w-full p-2 pr-10 rounded-lg border bg-slate-50 dark:bg-dracula-bg text-[10px] font-mono font-bold" 
                                value={item.serial} 
                                onChange={e => updateAdditionalItem('entregue', item.id, { serial: e.target.value })}
                                placeholder="Digite o serial..."
                              />
                              {!isReadOnly && (
                                <button type="button" onClick={() => setScannerConfig({isOpen: true, target: 'entregue', itemId: item.id})} className="absolute right-2 top-1/2 -translate-y-1/2 text-emerald-600">
                                  <ScanLine size={14}/>
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                    {(!formData.entregue_adicionais || formData.entregue_adicionais.length === 0) && (
                      <div className="text-center py-4 border-2 border-dashed border-slate-100 dark:border-dracula-current rounded-2xl">
                        <span className="text-[10px] text-slate-400">Nenhum item adicional</span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              <div className="sm:col-span-2 pt-2">
                <label className="text-[10px] font-bold text-slate-400 uppercase flex items-center gap-1 mb-1">
                   <FileText size={12}/> Observações (Entrega)
                </label>
                <textarea 
                  disabled={isReadOnly} 
                  className="w-full p-3 rounded-xl border border-slate-200 focus:border-dracula-purple dark:border-dracula-current dark:bg-dracula-bg text-xs outline-none transition-all h-20 resize-none" 
                  value={formData.entregue_observacoes} 
                  onChange={e => setFormData(prev => ({...prev, entregue_observacoes: e.target.value}))} 
                  placeholder="Notas sobre o equipamento entregue..."
                />
              </div>
            </div>
          </div>
        )}

        {/* Devolvido Section - HIDE IF DELIVERY ONLY */}
        {formData.operationType !== 'delivery' && (
          <div className="p-6 bg-slate-50 dark:bg-dracula-bg/40 rounded-3xl border border-slate-100 dark:border-dracula-current space-y-6 flex flex-col h-full shadow-sm animate-in fade-in slide-in-from-right-4 duration-300">
            <SectionHeader icon={History} title="Equipamento Devolvido" color="bg-rose-500" />
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 flex-1">
              <div className="relative sm:col-span-2">
                <label className="text-[10px] font-bold text-slate-400 uppercase flex items-center gap-1">
                  <Fingerprint size={12}/> Serial / IMEI
                </label>
                <div className="relative mt-1">
                  <input 
                    autoComplete="off"
                    disabled={isReadOnly} 
                    required 
                    className="w-full p-3 rounded-xl border-2 font-mono font-bold text-sm pr-12 dark:bg-dracula-bg transition-all outline-none border-rose-100 focus:border-rose-500 bg-blue-200"
                    value={formData.devolvido_serial} 
                    onChange={e => setFormData(prev => ({...prev, devolvido_serial: e.target.value}))}
                  />
                  {!isReadOnly && (
                    <button type="button" onClick={() => setScannerConfig({isOpen: true, target: 'devolvido'})} className="absolute right-3 top-1/2 -translate-y-1/2 text-rose-600">
                      <ScanLine size={20}/>
                    </button>
                  )}
                </div>
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase">Tipo</label>
                <select disabled={isReadOnly} className="w-full p-3 rounded-xl border mt-1 bg-white dark:bg-dracula-bg text-xs" value={formData.devolvido_tipo} onChange={e => setFormData({...formData, devolvido_tipo: e.target.value})}>
                  {EQUIPMENT_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase">Marca</label>
                <select disabled={isReadOnly} className="w-full p-3 rounded-xl border mt-1 bg-white dark:bg-dracula-bg text-xs" value={formData.devolvido_marca} onChange={e => setFormData({...formData, devolvido_marca: e.target.value})}>
                  {BRANDS.map(b => <option key={b} value={b}>{b}</option>)}
                </select>
              </div>

              <div className="sm:col-span-2">
                <label className="text-[10px] font-bold text-slate-400 uppercase">Modelo</label>
                <select 
                  disabled={isReadOnly} 
                  className="w-full p-3 rounded-xl border mt-1 bg-white dark:bg-dracula-bg text-xs" 
                  value={isCustomModel.devolvido ? 'Outros' : formData.devolvido_modelo} 
                  onChange={e => {
                    if (e.target.value === 'Outros') {
                      setIsCustomModel(prev => ({ ...prev, devolvido: true }));
                      setFormData(prev => ({ ...prev, devolvido_modelo: '' }));
                    } else {
                      setIsCustomModel(prev => ({ ...prev, devolvido: false }));
                      handleModelChange(e.target.value, 'devolvido');
                    }
                  }}
                >
                  {MODELS_LIST.map(m => <option key={m} value={m}>{m}</option>)}
                </select>
                {isCustomModel.devolvido && (
                  <input
                    disabled={isReadOnly}
                    className="w-full p-3 rounded-xl border mt-2 bg-white dark:bg-dracula-bg text-xs outline-none focus:border-dracula-purple transition-all border-rose-200"
                    placeholder="Especifique o modelo..."
                    value={formData.devolvido_modelo}
                    onChange={e => setFormData(prev => ({ ...prev, devolvido_modelo: e.target.value }))}
                  />
                )}
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase">Condição</label>
                <select disabled={isReadOnly} className="w-full p-3 rounded-xl border mt-1 bg-white dark:bg-dracula-bg text-xs" value={formData.devolvido_condicao} onChange={e => setFormData({...formData, devolvido_condicao: e.target.value as EquipmentCondition})}>
                  <option value={EquipmentCondition.NEW}>Novo</option>
                  <option value={EquipmentCondition.USED}>Usado</option>
                </select>
              </div>

              <div className="sm:col-span-2">
                <label className="text-[10px] font-bold text-slate-400 uppercase">Processador</label>
                <select 
                  disabled={isReadOnly || formData.devolvido_tipo === 'Monitor'} 
                  className="w-full p-3 rounded-xl border mt-1 bg-white dark:bg-dracula-bg text-xs disabled:opacity-50 disabled:cursor-not-allowed" 
                  value={formData.devolvido_processador} 
                  onChange={e => setFormData({...formData, devolvido_processador: e.target.value})}
                >
                  {PROCESSORS_LIST.map(p => <option key={p} value={p}>{p}</option>)}
                </select>
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase">Memória RAM</label>
                <input 
                  list="ram-list"
                  disabled={isReadOnly || formData.devolvido_tipo === 'Monitor'} 
                  className="w-full p-3 rounded-xl border mt-1 bg-white dark:bg-dracula-bg text-xs outline-none focus:border-dracula-purple transition-all disabled:opacity-50 disabled:cursor-not-allowed" 
                  value={formData.devolvido_memoria} 
                  onChange={e => setFormData({...formData, devolvido_memoria: e.target.value})}
                  placeholder="Ex: 24GB"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase">Armazenamento (HD/SSD)</label>
                <input 
                  list="storage-list"
                  disabled={isReadOnly || formData.devolvido_tipo === 'Monitor'} 
                  className="w-full p-3 rounded-xl border mt-1 bg-white dark:bg-dracula-bg text-xs outline-none focus:border-dracula-purple transition-all disabled:opacity-50 disabled:cursor-not-allowed" 
                  value={formData.devolvido_armazenamento} 
                  onChange={e => setFormData({...formData, devolvido_armazenamento: e.target.value})}
                  placeholder="Ex: 512GB"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="text-[10px] font-bold text-slate-400 uppercase mb-2 block">Acessórios</label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {ACCESSORIES_OPTIONS.map(acc => (
                    <button
                      key={acc}
                      type="button"
                      disabled={isReadOnly}
                      onClick={() => handleAccessoryToggle(acc, 'devolvido')}
                      className={`flex items-center gap-2 p-2 rounded-lg border text-[10px] font-bold transition-all ${
                        formData.devolvido_acessorios.includes(acc)
                          ? 'bg-rose-500/20 text-rose-700 dark:text-rose-300 border-rose-500/50 shadow-sm'
                          : 'bg-white dark:bg-dracula-bg text-slate-500 border-slate-200 dark:border-dracula-current hover:border-dracula-purple'
                      }`}
                    >
                      <CheckSquare size={14} className={ formData.devolvido_acessorios.includes(acc) ? 'opacity-100 text-rose-600 dark:text-rose-400' : 'opacity-20' } />
                      {acc}
                    </button>
                  ))}
                </div>

                {/* Campos de Serial para Acessórios Devolvidos Selecionados */}
                {formData.devolvido_acessorios.some(acc => ACCESSORIES_WITH_SERIAL.includes(acc)) && (
                  <div className="mt-3 p-3.5 bg-rose-500/10 dark:bg-rose-950/20 border border-rose-500/20 dark:border-rose-500/30 rounded-xl space-y-3 animate-in fade-in duration-200">
                    <div className="text-[10px] font-bold uppercase tracking-wider text-rose-700 dark:text-rose-400 flex items-center gap-1.5">
                      <Fingerprint size={13} />
                      Número de Serial dos Acessórios (Devolução)
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {formData.devolvido_acessorios.filter(acc => ACCESSORIES_WITH_SERIAL.includes(acc)).map(acc => (
                        <div key={acc} className="space-y-1">
                          <label className="text-[9px] font-bold text-slate-500 dark:text-dracula-comment uppercase flex items-center justify-between">
                            <span>Serial / IMEI - {acc}</span>
                          </label>
                          <div className="relative">
                            <input
                              type="text"
                              disabled={isReadOnly}
                              className="w-full p-2.5 pr-9 rounded-lg border bg-white dark:bg-dracula-bg border-rose-200 dark:border-rose-900/50 text-xs font-mono font-bold outline-none focus:border-rose-500 transition-all placeholder:font-sans placeholder:font-normal placeholder:text-slate-400"
                              placeholder={`Digite ou escaneie o serial...`}
                              value={formData.devolvido_acessorios_seriais?.[acc] || ''}
                              onChange={e => {
                                const val = e.target.value;
                                setFormData(prev => ({
                                  ...prev,
                                  devolvido_acessorios_seriais: {
                                    ...(prev.devolvido_acessorios_seriais || {}),
                                    [acc]: val
                                  }
                                }));
                              }}
                            />
                            {!isReadOnly && (
                              <button
                                type="button"
                                onClick={() => setScannerConfig({
                                  isOpen: true,
                                  target: 'devolvido',
                                  accessoryKey: acc
                                })}
                                className="absolute right-2 top-1/2 -translate-y-1/2 text-rose-600 hover:text-rose-700 dark:text-rose-400 p-1 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded transition-colors"
                                title={`Escanear código de barras de ${acc}`}
                              >
                                <ScanLine size={16} />
                              </button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Additional Items for Return */}
              {(formData.operationType === 'return' || formData.operationType === 'exchange') && (
                <div className="sm:col-span-2 space-y-4 pt-4 border-t dark:border-dracula-current bg-emerald-500/10 p-4 rounded-2xl">
                  <div className="flex justify-between items-center">
                    <h4 className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">Itens Adicionais (Devolução)</h4>
                    {!isReadOnly && (
                      <button 
                        type="button" 
                        onClick={() => addAdditionalItem('devolvido')}
                        className="flex items-center gap-2 px-3 py-1.5 bg-sky-400/10 hover:bg-sky-400/20 text-sky-600 dark:text-sky-400 border border-sky-200/50 dark:border-sky-400/20 rounded-xl text-[10px] font-bold transition-all backdrop-blur-sm"
                      >
                        <Plus size={14} /> Adicionar Item
                      </button>
                    )}
                  </div>
                  
                  <div className="space-y-3">
                    {formData.devolvido_adicionais?.map((item) => (
                      <div key={item.id} className="p-4 bg-white dark:bg-dracula-darker rounded-2xl border border-slate-100 dark:border-dracula-current shadow-sm relative group">
                        {!isReadOnly && (
                          <button 
                            type="button" 
                            onClick={() => removeAdditionalItem('devolvido', item.id)}
                            className="absolute -top-2 -right-2 p-1.5 bg-rose-500 text-white rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-all"
                          >
                            <Trash2 size={12} />
                          </button>
                        )}
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="text-[9px] font-bold text-slate-400 uppercase">Tipo</label>
                            <select 
                              disabled={isReadOnly}
                              className="w-full p-2 rounded-lg border mt-1 bg-slate-50 dark:bg-dracula-bg text-[10px]" 
                              value={item.tipo} 
                              onChange={e => updateAdditionalItem('devolvido', item.id, { tipo: e.target.value })}
                            >
                              {EQUIPMENT_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                            </select>
                          </div>
                          <div>
                            <label className="text-[9px] font-bold text-slate-400 uppercase">Marca</label>
                            <select 
                              disabled={isReadOnly}
                              className="w-full p-2 rounded-lg border mt-1 bg-slate-50 dark:bg-dracula-bg text-[10px]" 
                              value={item.marca} 
                              onChange={e => updateAdditionalItem('devolvido', item.id, { marca: e.target.value })}
                            >
                              {BRANDS.map(b => <option key={b} value={b}>{b}</option>)}
                            </select>
                          </div>
                          <div className="col-span-2">
                            <label className="text-[9px] font-bold text-slate-400 uppercase">Modelo</label>
                            <select 
                              disabled={isReadOnly}
                              className="w-full p-2 rounded-lg border mt-1 bg-slate-50 dark:bg-dracula-bg text-[10px]" 
                              value={isCustomModel.adicionais[item.id] ? 'Outros' : item.modelo} 
                              onChange={e => {
                                if (e.target.value === 'Outros') {
                                  setIsCustomModel(prev => ({ 
                                    ...prev, 
                                    adicionais: { ...prev.adicionais, [item.id]: true } 
                                  }));
                                  updateAdditionalItem('devolvido', item.id, { modelo: '' });
                                } else {
                                  setIsCustomModel(prev => ({ 
                                    ...prev, 
                                    adicionais: { ...prev.adicionais, [item.id]: false } 
                                  }));
                                  updateAdditionalItem('devolvido', item.id, { modelo: e.target.value });
                                }
                              }}
                            >
                              {MODELS_LIST.map(m => <option key={m} value={m}>{m}</option>)}
                            </select>
                            {isCustomModel.adicionais[item.id] && (
                              <input
                                disabled={isReadOnly}
                                className="w-full p-2 rounded-lg border mt-2 bg-white dark:bg-dracula-bg text-[10px] outline-none focus:border-dracula-purple transition-all"
                                placeholder="Especifique o modelo..."
                                value={item.modelo}
                                onChange={e => updateAdditionalItem('devolvido', item.id, { modelo: e.target.value })}
                              />
                            )}
                          </div>
                          <div className="col-span-2">
                            <label className="text-[9px] font-bold text-slate-400 uppercase">Serial / IMEI</label>
                            <div className="relative mt-1">
                              <input 
                                disabled={isReadOnly}
                                className="w-full p-2 pr-10 rounded-lg border bg-slate-50 dark:bg-dracula-bg text-[10px] font-mono font-bold" 
                                value={item.serial} 
                                onChange={e => updateAdditionalItem('devolvido', item.id, { serial: e.target.value })}
                                placeholder="Digite o serial..."
                              />
                              {!isReadOnly && (
                                <button type="button" onClick={() => setScannerConfig({isOpen: true, target: 'devolvido', itemId: item.id})} className="absolute right-2 top-1/2 -translate-y-1/2 text-rose-600">
                                  <ScanLine size={14}/>
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                    {(!formData.devolvido_adicionais || formData.devolvido_adicionais.length === 0) && (
                      <div className="text-center py-4 border-2 border-dashed border-slate-100 dark:border-dracula-current rounded-2xl">
                        <span className="text-[10px] text-slate-400">Nenhum item adicional</span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              <div className="sm:col-span-2 pt-2">
                <label className="text-[10px] font-bold text-slate-400 uppercase flex items-center gap-1 mb-1">
                  <FileText size={12}/> Observações (Devolução)
                </label>
                <textarea 
                  disabled={isReadOnly} 
                  className="w-full p-3 rounded-xl border border-slate-200 focus:border-dracula-purple dark:border-dracula-current dark:bg-dracula-bg text-xs outline-none transition-all h-20 resize-none" 
                  value={formData.devolvido_observacoes} 
                  onChange={e => setFormData(prev => ({...prev, devolvido_observacoes: e.target.value}))} 
                  placeholder="Notas sobre o equipamento devolvido..."
                />
              </div>

              {/* Opção de Devolução sem Termo Assinado (Coleta Residencial) */}
              <div className="sm:col-span-2 p-5 bg-amber-500/10 border-2 border-amber-500/30 rounded-2xl space-y-4 my-2">
                <div className="flex items-start gap-3">
                  <input
                    id="devolucao_sem_termo_checkbox"
                    type="checkbox"
                    disabled={isReadOnly}
                    checked={!!formData.devolucao_sem_termo}
                    onChange={(e) => {
                      const isChecked = e.target.checked;
                      setFormData(prev => ({
                        ...prev,
                        devolucao_sem_termo: isChecked,
                        tipo_coleta: isChecked ? (prev.tipo_coleta || 'motoboy') : undefined,
                        data_coleta_residencial: isChecked ? (prev.data_coleta_residencial || new Date().toISOString().split('T')[0]) : undefined
                      }));
                    }}
                    className="mt-1 w-5 h-5 rounded border-amber-400 text-amber-600 focus:ring-amber-500 cursor-pointer"
                  />
                  <div>
                    <label htmlFor="devolucao_sem_termo_checkbox" className="font-bold text-sm text-amber-900 dark:text-amber-200 cursor-pointer flex items-center gap-2">
                      <Truck size={18} className="text-amber-600" />
                      Devolução sem termo assinado (Retirado na residência por Motoboy / Transportadora)
                    </label>
                    <p className="text-xs text-amber-700/80 dark:text-amber-300/80 mt-0.5">
                      Marque esta opção se o equipamento foi retirado na residência do colaborador por entregador/logística sem colher a assinatura presencial do termo.
                    </p>
                  </div>
                </div>

                {formData.devolucao_sem_termo && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-3 border-t border-amber-500/20 animate-in fade-in duration-200">
                    <div>
                      <label className="text-[10px] font-bold text-amber-800 dark:text-amber-300 uppercase">
                        Tipo de Coleta / Logística
                      </label>
                      <select
                        disabled={isReadOnly}
                        className="w-full p-3 rounded-xl border border-amber-300 bg-white dark:bg-dracula-bg text-xs font-bold mt-1 outline-none focus:border-amber-500"
                        value={formData.tipo_coleta || 'motoboy'}
                        onChange={(e) => setFormData(prev => ({ ...prev, tipo_coleta: e.target.value as any }))}
                      >
                        <option value="motoboy">Motoboy</option>
                        <option value="transportadora">Transportadora</option>
                        <option value="correios">Correios / Sedex</option>
                        <option value="outro">Outro / Próprio</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-[10px] font-bold text-amber-800 dark:text-amber-300 uppercase">
                        Empresa / Entregador
                      </label>
                      <input
                        disabled={isReadOnly}
                        type="text"
                        placeholder="Ex: Loggi, Flash Courier, Motoboy..."
                        className="w-full p-3 rounded-xl border border-amber-300 bg-white dark:bg-dracula-bg text-xs mt-1 outline-none focus:border-amber-500"
                        value={formData.empresa_transporte || ''}
                        onChange={(e) => setFormData(prev => ({ ...prev, empresa_transporte: e.target.value }))}
                      />
                    </div>

                    <div>
                      <label className="text-[10px] font-bold text-amber-800 dark:text-amber-300 uppercase">
                        Nº da OS / Rastreio / Comprovante
                      </label>
                      <input
                        disabled={isReadOnly}
                        type="text"
                        placeholder="Ex: OS-98421 / TRK-5582"
                        className="w-full p-3 rounded-xl border border-amber-300 bg-white dark:bg-dracula-bg text-xs font-mono font-bold mt-1 outline-none focus:border-amber-500"
                        value={formData.codigo_coleta_os || ''}
                        onChange={(e) => setFormData(prev => ({ ...prev, codigo_coleta_os: e.target.value }))}
                      />
                    </div>

                    <div>
                      <label className="text-[10px] font-bold text-amber-800 dark:text-amber-300 uppercase">
                        Data da Retirada Residencial
                      </label>
                      <input
                        disabled={isReadOnly}
                        type="date"
                        className="w-full p-3 rounded-xl border border-amber-300 bg-white dark:bg-dracula-bg text-xs mt-1 outline-none focus:border-amber-500"
                        value={formData.data_coleta_residencial || new Date().toISOString().split('T')[0]}
                        onChange={(e) => setFormData(prev => ({ ...prev, data_coleta_residencial: e.target.value }))}
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="text-[10px] font-bold text-amber-800 dark:text-amber-300 uppercase">
                        Observações do Recebimento sem Termo
                      </label>
                      <input
                        disabled={isReadOnly}
                        type="text"
                        placeholder="Ex: Equipamento recebido no estoque de TI via motoboy sem avarias aparentes..."
                        className="w-full p-3 rounded-xl border border-amber-300 bg-white dark:bg-dracula-bg text-xs mt-1 outline-none focus:border-amber-500"
                        value={formData.observacoes_coleta || ''}
                        onChange={(e) => setFormData(prev => ({ ...prev, observacoes_coleta: e.target.value }))}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>

      <div className="flex flex-col sm:flex-row justify-end gap-4 pt-4">
        <button type="button" onClick={onCancel} className="px-8 py-4 font-bold text-slate-400 hover:text-slate-600 transition-colors">Voltar</button>
        {!isReadOnly && (
          <>
            {formData.devolucao_sem_termo && (
              <button 
                type="button" 
                onClick={async (e) => {
                  e.preventDefault();
                  const form = e.currentTarget.form;
                  if (form && !form.checkValidity()) {
                    form.reportValidity();
                    return;
                  }
                  if (isSubmitting) return;
                  setIsSubmitting(true);
                  try {
                    const payload: AssetExchange = { 
                      ...formData, 
                      id: formData.id || Math.random().toString(36).substr(2, 9).toUpperCase(),
                      status: 'completed',
                      devolucao_sem_termo: true
                    };
                    await onSave(payload, false);
                  } finally {
                    setIsSubmitting(false);
                  }
                }} 
                disabled={isSubmitting} 
                className="px-8 py-4 bg-amber-600 hover:bg-amber-700 text-white shadow-xl shadow-amber-600/20 rounded-2xl font-bold flex items-center justify-center gap-2 transition-transform active:scale-95 disabled:opacity-50"
              >
                {isSubmitting ? <Loader2 className="animate-spin" size={20}/> : <Truck size={20}/>}
                Concluir Devolução (Sem Termo)
              </button>
            )}
            <button 
              type="button" 
              onClick={(e) => handleSaveClickCustom(e, false)} 
              disabled={isSubmitting} 
              className="px-8 py-4 border-2 border-dracula-purple/20 dark:border-dracula-purple/40 text-dracula-purple hover:bg-dracula-purple/5 rounded-2xl font-bold flex items-center justify-center gap-2 transition-transform active:scale-95 disabled:opacity-50"
            >
              {isSubmitting ? <Loader2 className="animate-spin" size={20}/> : <Send size={20}/>}
              {editingExchange ? 'Apenas Salvar' : 'Apenas Gravar'}
            </button>
            <button 
              id="btn-save-docusign-agent"
              type="button" 
              onClick={(e) => handleSaveClickCustom(e, true)} 
              disabled={isSubmitting} 
              className="px-8 py-4 bg-gradient-to-r from-blue-600 via-indigo-600 to-dracula-purple hover:brightness-110 text-white shadow-xl shadow-indigo-600/30 rounded-2xl font-black text-sm flex items-center justify-center gap-2.5 transition-all active:scale-95 disabled:opacity-50 cursor-pointer"
              title="Gravar e enviar para DocuSign: processo de assinatura do remetente e destinatário via Outlook e arquivamento no SharePoint/OneDrive"
            >
              {isSubmitting ? <Loader2 className="animate-spin" size={20}/> : <Bot size={20} className="text-cyan-300 animate-pulse"/>}
              <span>
                {editingExchange ? 'Salvar e enviar para DocuSign' : 'Gravar e enviar para DocuSign'}
              </span>
            </button>
          </>
        )}
      </div>

      {scannerConfig.isOpen && (
        <BarcodeScannerModal 
          title={
            scannerConfig.accessoryKey 
              ? `Escanear Serial do ${scannerConfig.accessoryKey} (${scannerConfig.target === 'entregue' ? 'Entregue' : 'Devolvido'})`
              : scannerConfig.itemId 
              ? `Escanear Serial Item Adicional (${scannerConfig.target === 'entregue' ? 'Entregue' : 'Devolvido'})`
              : scannerConfig.target === 'entregue' ? 'Escanear Serial Entregue' : 'Escanear Serial Devolvido'
          }
          onScan={(text) => {
            const code = text.trim();
            
            if (scannerConfig.accessoryKey) {
              const serialsField = scannerConfig.target === 'entregue' ? 'entregue_acessorios_seriais' : 'devolvido_acessorios_seriais';
              setFormData(prev => ({
                ...prev,
                [serialsField]: {
                  ...(prev[serialsField] || {}),
                  [scannerConfig.accessoryKey!]: code
                }
              }));
            } else if (scannerConfig.itemId) {
              updateAdditionalItem(scannerConfig.target, scannerConfig.itemId, { serial: code });
            } else {
              const prefix = scannerConfig.target === 'entregue' ? 'entregue_' : 'devolvido_';
              setFormData(prev => ({...prev, [`${prefix}serial`]: code}));
            }
            setScannerConfig(prev => ({...prev, isOpen: false}));
          }}
          onClose={() => setScannerConfig(prev => ({...prev, isOpen: false}))}
        />
      )}

      {/* Datalists for RAM and Storage suggestions */}
      <datalist id="ram-list">
        {MEMORY_LIST.map(m => <option key={m} value={m} />)}
      </datalist>
      <datalist id="storage-list">
        {STORAGE_LIST.map(s => <option key={s} value={s} />)}
      </datalist>

      {/* Modal: Detalhes do Conector Office 365 / Microsoft Entra ID */}
      {showConnectorModal && (
        <div className="fixed inset-0 z-[120] bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-dracula-bg border border-slate-200 dark:border-dracula-current rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl space-y-6 animate-in zoom-in-95 duration-200">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center shadow-md">
                  <Building2 size={24} />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    Conector Office 365
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-dracula-comment">
                    Microsoft Entra ID & Microsoft Graph API
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowConnectorModal(false)}
                className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-xl hover:bg-slate-100 dark:hover:bg-dracula-current transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-blue-50 dark:bg-blue-950/40 border border-blue-100 dark:border-blue-900/40 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-600 dark:text-slate-300">Status do Conector</span>
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 font-bold text-[11px]">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                    Ativo & Operacional
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-600 dark:text-slate-300">Locatário (Tenant)</span>
                  <span className="font-mono text-[11px] text-slate-800 dark:text-slate-200">
                    {m365ConnectorInfo?.tenant || 'ciriontechnologies.onmicrosoft.com'}
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-600 dark:text-slate-300">Provedor</span>
                  <span className="text-[11px] text-slate-800 dark:text-slate-200">
                    {m365ConnectorInfo?.provider || 'Microsoft Graph API v1.0 & Catálogo Corporativo'}
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-600 dark:text-slate-300">Colaboradores Catálogados</span>
                  <span className="font-bold text-blue-600 dark:text-blue-400 text-xs">
                    {m365ConnectorInfo?.totalCatalogUsers || 65}+ contas corporativas
                  </span>
                </div>
              </div>

              <div className="space-y-2.5 text-xs text-slate-600 dark:text-slate-300">
                <h4 className="font-bold text-slate-800 dark:text-slate-100 text-xs uppercase tracking-wider">
                  Recursos do Conector
                </h4>
                <div className="flex items-start gap-2">
                  <CheckCircle2 size={16} className="text-emerald-500 shrink-0 mt-0.5" />
                  <span><strong>Autocompletar Inteligente:</strong> Ao digitar no campo Nome Completo, pesquisa instantaneamente no diretório do Office 365 e Entra ID.</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 size={16} className="text-emerald-500 shrink-0 mt-0.5" />
                  <span><strong>Sincronização de E-mail:</strong> Preenchimento automático do e-mail corporativo institucional (@ciriontechnologies.com).</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 size={16} className="text-emerald-500 shrink-0 mt-0.5" />
                  <span><strong>Mapeamento Organizacional:</strong> Identificação de Cargo, Departamento e Localidade do colaborador.</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 size={16} className="text-emerald-500 shrink-0 mt-0.5" />
                  <span><strong>Compatível com Zero Trust & MFA:</strong> Protegido por autenticação corporativa Microsoft e políticas Cirion.</span>
                </div>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="button"
                onClick={() => setShowConnectorModal(false)}
                className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md transition-colors"
              >
                Entendido
              </button>
            </div>
          </div>
        </div>
      )}
    </form>
  );
};

export default AssetForm;
