
import jsPDF from 'jspdf';

export const generatePromptPDF = () => {
  const doc = new jsPDF();
  const margin = 20;
  let y = 20;

  const addText = (text: string, size = 10, isBold = false) => {
    doc.setFontSize(size);
    doc.setFont('helvetica', isBold ? 'bold' : 'normal');
    const lines = doc.splitTextToSize(text, 170);
    
    if (y + (lines.length * 5) > 280) {
      doc.addPage();
      y = 20;
    }
    
    doc.text(lines, margin, y);
    y += (lines.length * 5) + 2;
  };

  const addTitle = (text: string) => {
    y += 5;
    addText(text.toUpperCase(), 14, true);
    y += 2;
  };

  // Header
  doc.setFillColor(98, 114, 164); // Dracula Purple
  doc.rect(0, 0, 210, 40, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(22);
  doc.text('PROMPT DE DESENVOLVIMENTO', margin, 25);
  doc.setFontSize(12);
  doc.text('AssetFlow - Gestão de Ativos de TI', margin, 33);
  doc.setTextColor(0, 0, 0);
  y = 50;

  addTitle('1. Visão Geral do Projeto');
  addText('Desenvolver um sistema de Gestão de Ativos de TI (AssetFlow) focado no controle de entrega e devolução de equipamentos, com fluxo de assinatura digital integrado e conformidade com auditorias.');

  addTitle('2. Stack Tecnológica');
  addText('- Frontend: React 18, TypeScript, Tailwind CSS.');
  addText('- Backend: Firebase (Firestore para banco de dados, Firebase Auth para login).');
  addText('- Bibliotecas: Lucide React (ícones), jsPDF (geração de documentos), XLSX (Excel), Framer Motion (animações).');

  addTitle('3. Modelagem de Dados (Firestore)');
  addText('Entidade "AssetExchange":');
  addText('- colaborador_nome, colaborador_email, colaborador_cpf, colaborador_setor.');
  addText('- entregue_tipo, entregue_marca, entregue_modelo, entregue_serial, entregue_config (CPU, RAM, SSD).');
  addText('- status: "draft" | "pending_receiver" | "completed".');
  addText('- assinatura_ti (base64), assinatura_colaborador (base64).');
  addText('- data_criacao, data_finalizacao (timestamps).');

  addTitle('4. Funcionalidades Principais');
  addText('A. Inventário: Tabela dinâmica com busca global, filtros por status e tipo de ativo.');
  addText('B. Formulário Inteligente: Cadastro de trocas com sugestão de usuários e especificações técnicas pré-definidas.');
  addText('C. Fluxo de Assinatura Manual: O TI assina -> Baixa PDF -> Envia via Outlook (mailto) -> Colaborador assina no Portal -> Sistema gera PDF Final.');
  addText('D. Importação/Exportação: Suporte total a planilhas Excel para carga de dados legados.');

  addTitle('5. Identidade Visual');
  addText('Estilo "Dracula Theme" moderno:');
  addText('- Background: #282a36 (Dark) / #f8f9fc (Light).');
  addText('- Accent: #bd93f9 (Purple).');
  addText('- Cards com bordas arredondadas (rounded-3xl) e sombras suaves.');

  addTitle('6. Regras de Segurança');
  addText('Implementar Firebase Security Rules que garantam que apenas o proprietário do documento ou administradores de TI possam editar os registros, e que assinaturas não possam ser alteradas após a finalização.');

  doc.save('AssetFlow_Prompt_Completo.pdf');
};
