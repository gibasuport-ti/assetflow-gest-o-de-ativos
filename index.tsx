
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

console.log("Iniciando AssetFlow...");

const rootElement = document.getElementById('root');
if (!rootElement) {
  console.error("Erro fatal: Elemento 'root' não encontrado no HTML.");
  document.body.innerHTML = "<div style='color:red;padding:20px;font-family:sans-serif;'><h1>Erro de Carregamento</h1><p>Não foi possível encontrar o elemento root. Verifique o console do navegador.</p></div>";
  throw new Error("Could not find root element to mount to");
}

try {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
  console.log("Renderização inicial concluída.");
} catch (error) {
  console.error("Erro durante a renderização do React:", error);
  rootElement.innerHTML = `<div style='color:red;padding:20px;font-family:sans-serif;'><h1>Erro de Inicialização</h1><pre>${error instanceof Error ? error.message : String(error)}</pre></div>`;
}
