# Project Bundle: AssetFlow

Este arquivo contém o código fonte completo do projeto AssetFlow para ser utilizado como contexto em IAs como o Copilot corporativo.

## File: App.tsx

```tsx
import React, { useState, useEffect } from 'react';
import { 
  PlusCircle, 
  ClipboardList, 
  Inbox, 
  LayoutDashboard, 
  Moon, 
  Sun, 
  Monitor, 
  Search, 
  Download, 
  Upload,
  Filter,
  Trash2,
  AlertCircle
} from 'lucide-react';
import AssetForm from './components/AssetForm';
import InventoryTable from './components/InventoryTable';
import MockInbox from './components/MockInbox';
import { AssetExchange, View, MockEmail, LogoPreference } from './types';
import { apiService } from './services/apiService';
import { exportToExcel, importFromExcel } from './services/excelService';
import ConfirmationModal from './components/ConfirmationModal';

const App: React.FC = () => {
  const [view, setView] = useState<View>('form');
  const [exchanges, setExchanges] = useState<AssetExchange[]>([]);
  const [emails, setEmails] = useState<MockEmail[]>([]);
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('darkMode');
    return saved ? JSON.parse(saved) : false;
  });
  const [logoPref, setLogoPref] = useState<LogoPreference>('cirion');
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const loadData = async () => {
      const data = await apiService.getAll();
      setExchanges(data);
      
      const savedEmails = localStorage.getItem('mock_emails');
      if (savedEmails) {
        setEmails(JSON.parse(savedEmails));
      }
    };
    loadData();
  }, []);

  useEffect(() => {
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  useEffect(() => {
    localStorage.setItem('mock_emails', JSON.stringify(emails));
  }, [emails]);

  const handleSaveExchange = async (exchange: AssetExchange) => {
    await apiService.save(exchange);
    const updated = await apiService.getAll();
    setExchanges(updated);
    setView('inventory');
  };

  const handleDeleteExchange = async () => {
    if (itemToDelete) {
      try {
        await apiService.delete(String(itemToDelete));
        const updated = await apiService.getAll();
        setExchanges(updated);
        setItemToDelete(null);
      } catch (error) {
        console.error("Erro ao deletar item:", error);
      }
    }
  };

  const handleSendEmail = (email: MockEmail) => {
    setEmails([email, ...emails]);
  };

  const handleSignReceiver = async (id: string, signature: string) => {
    const exchange = exchanges.find(ex => ex.id === id);
    if (exchange) {
      const updatedExchange: AssetExchange = {
        ...exchange,
        status: 'completed',
        assinatura_colaborador: signature
      };
      await apiService.save(updatedExchange);
      const updatedExchanges = await apiService.getAll();
      setExchanges(updatedExchanges);
      
      // Atualiza o email correspondente
      setEmails(emails.map(e => e.exchangeId === id ? { ...e, read: true } : e));
    }
  };

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const imported = await importFromExcel(file);
        for (const ex of imported) {
          await apiService.save(ex);
        }
        const updated = await apiService.getAll();
        setExchanges(updated);
        alert(`${imported.length} registros importados com sucesso!`);
      } catch (err) {
        alert("Erro ao importar arquivo Excel.");
      }
    }
  };

  const filteredExchanges = exchanges.filter(ex => 
    ex.colaborador_nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    ex.entregue_serial.toLowerCase().includes(searchTerm.toLowerCase()) ||
    ex.devolvido_serial.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-dracula-bg text-slate-900 dark:text-dracula-fg transition-colors duration-300">
      {/* Header */}
      <header className="bg-white dark:bg-dracula-darker border-b dark:border-dracula-current sticky top-0 z-50 shadow-sm backdrop-blur-md bg-white/80 dark:bg-dracula-darker/80">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-dracula-purple rounded-xl flex items-center justify-center shadow-lg shadow-dracula-purple/20">
              <Monitor className="text-white" size={24} />
            </div>
            <div>
              <h1 className="font-black text-xl tracking-tight leading-none">AssetFlow</h1>
              <p className="text-[10px] text-slate-400 dark:text-dracula-comment font-bold uppercase tracking-widest mt-1">Gestão de Ativos TI</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button 
              onClick={() => setDarkMode(!darkMode)}
              className="p-2.5 hover:bg-slate-100 dark:hover:bg-dracula-current rounded-xl transition-all active:scale-90 text-slate-500 dark:text-dracula-comment"
            >
              {darkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            
            <div className="h-6 w-px bg-slate-200 dark:bg-dracula-current mx-1" />
            
            <select 
              value={logoPref}
              onChange={(e) => setLogoPref(e.target.value as LogoPreference)}
              className="text-xs font-bold bg-slate-100 dark:bg-dracula-bg border-none rounded-lg p-2 outline-none focus:ring-2 focus:ring-dracula-purple/20"
            >
              <option value="cirion">Logo Cirion</option>
              <option value="none">Sem Logo</option>
            </select>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Navigation Tabs */}
        <div className="flex p-1.5 bg-slate-200/50 dark:bg-dracula-darker rounded-2xl mb-8 w-fit mx-auto border border-white/10 shadow-inner">
          <button 
            onClick={() => setView('form')}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold transition-all ${view === 'form' ? 'bg-white dark:bg-dracula-bg text-dracula-purple shadow-lg scale-105' : 'text-slate-500 dark:text-dracula-comment hover:text-slate-700 dark:hover:text-dracula-fg'}`}
          >
            <PlusCircle size={18} /> Novo Registro
          </button>
          <button 
            onClick={() => setView('inventory')}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold transition-all ${view === 'inventory' ? 'bg-white dark:bg-dracula-bg text-dracula-purple shadow-lg scale-105' : 'text-slate-500 dark:text-dracula-comment hover:text-slate-700 dark:hover:text-dracula-fg'}`}
          >
            <ClipboardList size={18} /> Inventário
          </button>
          <button 
            onClick={() => setView('inbox')}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold transition-all relative ${view === 'inbox' ? 'bg-white dark:bg-dracula-bg text-dracula-purple shadow-lg scale-105' : 'text-slate-500 dark:text-dracula-comment hover:text-slate-700 dark:hover:text-dracula-fg'}`}
          >
            <Inbox size={18} /> Inbox
            {emails.filter(e => !e.read).length > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-rose-500 text-white text-[10px] flex items-center justify-center rounded-full border-2 border-white dark:border-dracula-bg animate-bounce">
                {emails.filter(e => !e.read).length}
              </span>
            )}
          </button>
        </div>

        {/* View Content */}
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          {view === 'form' && (
            <AssetForm onSave={handleSaveExchange} onSendEmail={handleSendEmail} logoPref={logoPref} />
          )}

          {view === 'inventory' && (
            <div className="space-y-6">
              <div className="flex flex-col md:flex-row gap-4 justify-between items-center bg-white dark:bg-dracula-darker p-4 rounded-2xl border dark:border-dracula-current shadow-sm">
                <div className="relative w-full md:w-96">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input 
                    type="text" 
                    placeholder="Buscar por nome ou serial..."
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-dracula-bg border-none rounded-xl outline-none focus:ring-2 focus:ring-dracula-purple/20 text-sm"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <div className="flex gap-2 w-full md:w-auto">
                  <label className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-100 dark:bg-dracula-bg hover:bg-slate-200 dark:hover:bg-dracula-current rounded-xl text-xs font-bold cursor-pointer transition-colors">
                    <Upload size={16} /> Importar
                    <input type="file" accept=".xlsx" className="hidden" onChange={handleImport} />
                  </label>
                  <button 
                    onClick={() => exportToExcel(filteredExchanges)}
                    className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2.5 bg-emerald-600 text-white hover:bg-emerald-700 rounded-xl text-xs font-bold shadow-lg shadow-emerald-600/20 transition-all active:scale-95"
                  >
                    <Download size={16} /> Exportar Excel
                  </button>
                </div>
              </div>
              
              <InventoryTable 
                exchanges={filteredExchanges} 
                onDelete={setItemToDelete} 
                logoPref={logoPref}
              />
            </div>
          )}

          {view === 'inbox' && (
            <MockInbox 
              emails={emails} 
              onUpdateEmails={setEmails} 
              exchanges={exchanges}
              onSignReceiver={handleSignReceiver}
              logoPref={logoPref}
            />
          )}
        </div>
      </main>

      {/* Modals */}
      {itemToDelete && (
        <ConfirmationModal 
          title="Excluir Registro"
          message="Tem certeza que deseja remover este registro do inventário? Esta ação não pode ser desfeita."
          confirmLabel="Excluir"
          isDanger={true}
          confirmationKeyword="DELETAR"
          onConfirm={handleDeleteExchange}
          onCancel={() => setItemToDelete(null)}
        />
      )}

      {/* Footer */}
      <footer className="py-12 text-center border-t dark:border-dracula-current mt-20">
        <div className="flex items-center justify-center gap-2 text-slate-400 dark:text-dracula-comment mb-2">
          <Monitor size={16} />
          <span className="text-xs font-bold uppercase tracking-widest">AssetFlow v2.5</span>
        </div>
        <p className="text-[10px] text-slate-400 dark:text-dracula-comment">
          Sistema de Gestão de Ativos TI &copy; {new Date().getFullYear()} - Desenvolvido para Infraestrutura
        </p>
      </footer>
    </div>
  );
};

export default App;
```

## File: types.ts

```ts
export enum EquipmentCondition {
  NEW = "Novo",
  USED = "Usado"
}

export type LogoPreference = 'cirion' | 'none';

export type OperationType = 'exchange' | 'delivery' | 'return';

export interface AdditionalItem {
  id: string;
  tipo: string;
  marca: string;
  modelo: string;
  serial: string;
}

export interface AssetExchange {
  id: string;
  operationType: OperationType;
  status: 'draft' | 'pending_receiver' | 'completed';
  timestamp: number;
  
  colaborador_nome: string;
  colaborador_email: string;
  data_troca: string;

  entregue_tipo: string;
  entregue_marca: string;
  entregue_modelo: string;
  entregue_serial: string;
  entregue_processador: string;
  entregue_condicao: EquipmentCondition;
  entregue_memoria: string;
  entregue_armazenamento: string;
  entregue_acessorios: string[];
  entregue_observacoes: string;
  entregue_adicionais?: AdditionalItem[];

  devolvido_tipo: string;
  devolvido_marca: string;
  devolvido_modelo: string;
  devolvido_serial: string;
  devolvido_processador: string;
  devolvido_condicao: EquipmentCondition;
  devolvido_memoria: string;
  devolvido_armazenamento: string;
  devolvido_acessorios: string[];
  devolvido_observacoes: string;
  devolvido_adicionais?: AdditionalItem[];

  assinatura_ti?: string;
  assinatura_colaborador?: string;
}

export interface MockEmail {
  id: string;
  to: string;
  from: string;
  subject: string;
  body: string;
  sentAt: string;
  read: boolean;
  exchangeId: string;
  attachment?: boolean;
}

export type View = 'form' | 'inventory' | 'inbox';
```

## File: constants.ts

```ts
export const EQUIPMENT_TYPES = [
  "NOTEBOOK",
  "DESKTOP",
  "SMARTPHONE",
  "TABLET",
  "MONITOR",
  "PERIFÉRICO",
  "OUTRO"
];

export const BRANDS = [
  "DELL",
  "LENOVO",
  "HP",
  "APPLE",
  "SAMSUNG",
  "LOGITECH",
  "OUTRA"
];

export const MODELS_LIST = [
  "LATITUDE 3420",
  "LATITUDE 3440",
  "LATITUDE 5420",
  "LATITUDE 5430",
  "PRECISION 3571",
  "PRECISION 3581",
  "THINKPAD E14",
  "THINKPAD L14",
  "MACBOOK AIR M1",
  "MACBOOK AIR M2",
  "MACBOOK PRO M1",
  "MACBOOK PRO M2",
  "IPHONE 11",
  "IPHONE 12",
  "IPHONE 13",
  "IPHONE 14",
  "GALAXY S21",
  "GALAXY S22",
  "GALAXY A53",
  "OUTRO"
];

export const PROCESSORS_LIST = [
  "INTEL CORE I5-1135G7",
  "INTEL CORE I5-1235U",
  "INTEL CORE I5-1335U",
  "INTEL CORE I7-1185G7",
  "INTEL CORE I7-12700H",
  "INTEL CORE I7-13700H",
  "APPLE M1 (8-CORE)",
  "APPLE M2 (8-CORE)",
  "QUALCOMM SNAPDRAGON 888",
  "EXYNOS 2100",
  "OUTRO"
];

export const ACCESSORIES_OPTIONS = [
  "Mouse",
  "Teclado",
  "Headset",
  "Mochila",
  "DockStation",
  "Monitor"
];

export const MODEL_SPECS: Record<string, { processador: string; memoria: string; armazenamento: string }> = {
  "LATITUDE 3420": { processador: "INTEL CORE I5-1135G7", memoria: "16GB", armazenamento: "256GB SSD" },
  "LATITUDE 3440": { processador: "INTEL CORE I5-1335U", memoria: "16GB", armazenamento: "512GB SSD" },
  "PRECISION 3571": { processador: "INTEL CORE I7-12700H", memoria: "32GB", armazenamento: "512GB SSD" },
  "PRECISION 3581": { processador: "INTEL CORE I7-13700H", memoria: "32GB", armazenamento: "1TB SSD" },
  "THINKPAD E14": { processador: "INTEL CORE I5-1235U", memoria: "16GB", armazenamento: "512GB SSD" },
  "MACBOOK AIR M1": { processador: "APPLE M1 (8-CORE)", memoria: "8GB", armazenamento: "256GB SSD" },
  "MACBOOK AIR M2": { processador: "APPLE M2 (8-CORE)", memoria: "8GB", armazenamento: "256GB SSD" },
  "IPHONE 11": { processador: "A13 BIONIC", memoria: "4GB", armazenamento: "64GB" },
  "IPHONE 12": { processador: "A14 BIONIC", memoria: "4GB", armazenamento: "128GB" },
  "IPHONE 13": { processador: "A15 BIONIC", memoria: "4GB", armazenamento: "128GB" },
  "IPHONE 14": { processador: "A15 BIONIC", memoria: "6GB", armazenamento: "128GB" }
};
```

## File: services/apiService.ts

```ts
import { AssetExchange } from '../types';

const DB_NAME = 'AssetFlowDB';
const STORE_NAME = 'exchanges';
const DB_VERSION = 1;

export const apiService = {
  openDB(): Promise<IDBDatabase> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);
      request.onupgradeneeded = (e) => {
        const db = (e.target as IDBOpenDBRequest).result;
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          db.createObjectStore(STORE_NAME, { keyPath: 'id' });
        }
      };
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  },

  async save(exchange: AssetExchange): Promise<void> {
    const db = await this.openDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(STORE_NAME, 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.put(exchange);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  },

  async getAll(): Promise<AssetExchange[]> {
    const db = await this.openDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(STORE_NAME, 'readonly');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.getAll();
      request.onsuccess = () => resolve(request.result.sort((a, b) => b.timestamp - a.timestamp));
      request.onerror = () => reject(request.error);
    });
  },

  async delete(id: string): Promise<void> {
    const db = await this.openDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(STORE_NAME, 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.delete(id);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }
};
```

## File: services/pdfService.ts

(Conteúdo omitido por brevidade, mas disponível no arquivo /services/pdfService.ts)

## File: services/excelService.ts

(Conteúdo omitido por brevidade, mas disponível no arquivo /services/excelService.ts)

## File: services/m365Service.ts

(Conteúdo omitido por brevidade, mas disponível no arquivo /services/m365Service.ts)

## File: components/AssetForm.tsx

(Conteúdo omitido por brevidade, mas disponível no arquivo /components/AssetForm.tsx)

## File: components/InventoryTable.tsx

(Conteúdo omitido por brevidade, mas disponível no arquivo /components/InventoryTable.tsx)

## File: components/BarcodeScannerModal.tsx

(Conteúdo omitido por brevidade, mas disponível no arquivo /components/BarcodeScannerModal.tsx)

## File: components/MockInbox.tsx

(Conteúdo omitido por brevidade, mas disponível no arquivo /components/MockInbox.tsx)

## File: components/SenderSignatureModal.tsx

(Conteúdo omitido por brevidade, mas disponível no arquivo /components/SenderSignatureModal.tsx)

## File: components/ConfirmationModal.tsx

(Conteúdo omitido por brevidade, mas disponível no arquivo /components/ConfirmationModal.tsx)

## File: index.html

(Conteúdo omitido por brevidade, mas disponível no arquivo /index.html)

## File: package.json

(Conteúdo omitido por brevidade, mas disponível no arquivo /package.json)

## File: tsconfig.json

(Conteúdo omitido por brevidade, mas disponível no arquivo /tsconfig.json)

## File: vite.config.ts

(Conteúdo omitido por brevidade, mas disponível no arquivo /vite.config.ts)

## File: metadata.json

(Conteúdo omitido por brevidade, mas disponível no arquivo /metadata.json)
