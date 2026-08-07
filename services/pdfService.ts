
import { jsPDF } from 'jspdf';
import { AssetExchange, LogoPreference } from '../types';

export const getPDFFileName = (exchange: AssetExchange) => {
  const clean = (str: string) => str ? str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-zA-Z0-9\s-]/g, '').trim().toUpperCase() : '';
  
  const getEquipmentType = (type: string) => {
    const t = type.toLowerCase();
    if (t.includes('note') || t.includes('lap')) return 'NOTEBOOK';
    if (t.includes('smart') || t.includes('cel') || t.includes('phone')) return 'SMARTPHONE';
    return clean(type);
  };

  const name = clean(exchange.colaborador_nome).replace(/\s+/g, '_');
  
  const types = new Set<string>();
  if (exchange.operationType !== 'return' && exchange.entregue_tipo) {
    types.add(getEquipmentType(exchange.entregue_tipo));
  }
  if (exchange.operationType !== 'delivery' && exchange.devolvido_tipo) {
    types.add(getEquipmentType(exchange.devolvido_tipo));
  }
  
  // Check additional items
  if (exchange.entregue_adicionais) {
    exchange.entregue_adicionais.forEach(item => types.add(getEquipmentType(item.tipo)));
  }
  if (exchange.devolvido_adicionais) {
    exchange.devolvido_adicionais.forEach(item => types.add(getEquipmentType(item.tipo)));
  }

  const typeStr = Array.from(types).filter(Boolean).join('_') || 'EQUIPAMENTO';
  
  const serials = new Set<string>();
  if (exchange.operationType !== 'return' && exchange.entregue_serial) serials.add(clean(exchange.entregue_serial));
  if (exchange.operationType !== 'delivery' && exchange.devolvido_serial) serials.add(clean(exchange.devolvido_serial));
  
  if (exchange.entregue_adicionais) {
    exchange.entregue_adicionais.forEach(item => serials.add(clean(item.serial)));
  }
  if (exchange.devolvido_adicionais) {
    exchange.devolvido_adicionais.forEach(item => serials.add(clean(item.serial)));
  }

  const serialStr = Array.from(serials).filter(Boolean).join('_') || 'S-N';
  
  // Data atual no formato DD.MM.YY
  const now = new Date();
  const dataAtual = `${String(now.getDate()).padStart(2, '0')}.${String(now.getMonth() + 1).padStart(2, '0')}.${String(now.getFullYear()).slice(-2)}`;

  let opSuffix = "";
  if (exchange.operationType === 'delivery') opSuffix = ".Entrega";
  else if (exchange.operationType === 'return') opSuffix = ".Devolucao";
  else opSuffix = ".Entrega_Devolucao";

  return `${name}_${typeStr}=${serialStr}_${dataAtual}${opSuffix}.pdf`;
};

export const generateAssetPDF = (exchange: AssetExchange, logoPref: LogoPreference = 'cirion') => {
  try {
    const doc = new jsPDF({
      orientation: 'p',
      unit: 'mm',
      format: 'a4'
    });

    // Cores extraídas para o efeito 3D e visual
    const cirionBlue = "#1a5edb"; 
    const cirionShadow = "#0a3a8a"; 
    const boxBlue = "#00158a"; 
    const inkBlue = "#003087";

    const renderPage = (isEntregue: boolean) => {
      const prefix = isEntregue ? 'entregue_' : 'devolvido_';
      
      // 1. Renderização condicional do logotipo
      if (logoPref === 'cirion') {
        const startX = 25;
        const startY = 25;
        const mainText = "CIRION";
        const subText = "TECHNOLOGIES";
        
        // Parte Principal
        doc.setFont("helvetica", "bold");
        doc.setFontSize(28);
        doc.setTextColor(cirionShadow);
        doc.text(mainText, startX + 0.4, startY + 0.4);
        doc.setTextColor(cirionBlue);
        doc.text(mainText, startX, startY);
        
        // Subtexto
        doc.setFontSize(9);
        doc.setCharSpace(1.5);
        doc.setTextColor(cirionShadow);
        doc.text(subText, startX + 0.8, startY + 7.3);
        doc.setTextColor(cirionBlue);
        doc.text(subText, startX + 0.5, startY + 7);
        doc.setCharSpace(0);
      }

      // Título e Checkboxes
      doc.setFontSize(11);
      doc.setTextColor(boxBlue);
      const titleText = logoPref === 'cirion' ? "Declaração de Equipamento Cirion" : "Declaração de Entrega de Equipamento";
      doc.text(titleText, 85, 20);
      
      doc.setDrawColor(boxBlue);
      doc.setLineWidth(0.3);
      
      // Checkbox Entrega
      doc.rect(85, 23, 3, 3);
      if (isEntregue) doc.text("x", 86, 25.5);
      doc.setFontSize(9);
      doc.text("Entrega", 90, 25.5);
      
      // Checkbox Devolução
      doc.rect(110, 23, 3, 3);
      if (!isEntregue) doc.text("x", 111, 25.5);
      doc.text("Devolução", 115, 25.5);

      // 2. Texto de Introdução
      doc.setFontSize(9);
      doc.setTextColor(0, 0, 0);
      doc.setFont("helvetica", "normal");
      doc.text("Eu, ", 20, 40);
      doc.line(26, 40.5, 95, 40.5);
      doc.setFont("helvetica", "bold");
      doc.text(exchange.colaborador_nome, 28, 40);
      doc.setFont("helvetica", "normal");
      doc.text("declaro ter recebido/devolvido o", 97, 40);
      doc.text("equipamento e acessórios abaixo descritos, em perfeitas condições de funcionamento.", 20, 45);

      // 3. Campos de Dados
      let y = 55;
      const LABEL_X = 20;
      const FIELD_X = 40;
      const BOX_WIDTH = 100;
      
      const drawField = (label: string, value: string, width: number = BOX_WIDTH, customX: number = FIELD_X) => {
        doc.setFont("helvetica", "bold");
        doc.setFontSize(11);
        doc.setTextColor(0, 0, 0);
        doc.text(label, LABEL_X, y + 4.5);
        
        doc.setDrawColor(boxBlue);
        doc.rect(customX, y, width, 6);
        doc.setFont("helvetica", "normal");
        doc.text(value || "", customX + 2, y + 4.5);
        y += 8;
      };

      const currentType = String(exchange[`${prefix}tipo` as keyof AssetExchange]);
      const isMonitor = currentType === 'Monitor';

      drawField("Tipo:", currentType);
      drawField("Marca:", String(exchange[`${prefix}marca` as keyof AssetExchange]));
      drawField("Modelo:", String(exchange[`${prefix}modelo` as keyof AssetExchange]));
      drawField("Número de Serie / Imei:", String(exchange[`${prefix}serial` as keyof AssetExchange]), 82, 68);
      drawField("Estado:", String(exchange[`${prefix}condicao` as keyof AssetExchange]), 25);
      
      if (!isMonitor) {
        y += 2;
        doc.setFont("helvetica", "bold");
        doc.text("Tamanho do HD:", 20, y + 4.5);
        doc.rect(58, y, 30, 6);
        doc.setFont("helvetica", "normal");
        doc.text(String(exchange[`${prefix}armazenamento` as keyof AssetExchange]), 60, y + 4.5);
        y += 8;

        drawField("Processador:", String(exchange[`${prefix}processador` as keyof AssetExchange]), 150, 50);
        
        doc.setFont("helvetica", "bold");
        doc.text("Memória:", 20, y + 4.5);
        doc.rect(42, y, 25, 6);
        doc.setFont("helvetica", "normal");
        doc.text(String(exchange[`${prefix}memoria` as keyof AssetExchange]), 44, y + 4.5);
        y += 15;
      } else {
        y += 10; // Espaçamento extra se for monitor para não ficar muito colado
      }

      // 4. Caixa de Acessórios
      doc.setFontSize(12);
      doc.setFont("helvetica", "bold");
      doc.text("Acessórios:", 105, y, { align: "center" });
      y += 4;
      
      doc.setDrawColor(boxBlue);
      doc.rect(45, y, 120, 20);
      
      const accessories = ["Mouse", "Teclado", "Headset", "Mochila", "DockStation", "Monitor"];
      const selectedAccs = (exchange[`${prefix}acessorios` as keyof AssetExchange] as string[]) || [];
      
      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      let accX = 65;
      let accY = y + 5;
      
      accessories.forEach((acc, index) => {
        doc.rect(accX, accY - 2.5, 3, 3);
        if (selectedAccs.includes(acc)) doc.text("x", accX + 0.8, accY);
        doc.text(acc, accX + 5, accY);
        
        if (index === 2) {
          accX = 110;
          accY = y + 5;
        } else {
          accY += 6;
        }
      });

      y += 25;

      // 5. Equipamentos Adicionais
      const additionalItems = (exchange[`${prefix}adicionais` as keyof AssetExchange] as any[]) || [];
      if (additionalItems.length > 0) {
        doc.setFontSize(10);
        doc.setFont("helvetica", "bold");
        const additionalTitle = isEntregue ? "Equipamentos Adicionais (Entregue):" : "Equipamentos Adicionais (Devolvidos):";
        doc.text(additionalTitle, 20, y);
        y += 5;
        
        additionalItems.forEach((item, idx) => {
          doc.setFont("helvetica", "normal");
          doc.setFontSize(8);
          const itemText = `${idx + 1}. ${item.tipo} - ${item.marca} ${item.modelo} (Serial: ${item.serial})`;
          doc.text(itemText, 25, y);
          y += 4;
        });
        y += 5;
      } else {
        y += 10;
      }

      // 6. Observações
      doc.setFontSize(11);
      doc.setFont("helvetica", "bold");
      doc.text("Obs:", 20, y + 4.5);
      doc.rect(32, y, 150, 6);
      
      // Obtém o texto específico para a página atual (Entrega ou Devolução)
      let obsText = "";
      if (isEntregue) {
        obsText = exchange.entregue_observacoes || "";
      } else {
        obsText = exchange.devolvido_observacoes || "";
      }
      
      // Fallback para campo antigo se os novos estiverem vazios (retrocompatibilidade)
      if (!obsText && (exchange as any).observacoes) {
        obsText = (exchange as any).observacoes;
      }

      doc.setFont("helvetica", "normal");
      doc.setFontSize(9);
      doc.text(obsText || "", 34, y + 4.5, { maxWidth: 145 });

      y += 25;

      // 6. Rodapé Legal
      doc.setFontSize(8);
      doc.setDrawColor(0, 0, 0);
      doc.line(20, y, 85, y);
      
      doc.setFont("helvetica", "bold");
      doc.text(exchange.colaborador_nome, 52.5, y - 1, { align: 'center' });
      
      doc.setFont("helvetica", "normal");
      const footerCompany = logoPref === 'cirion' ? "Cirion Technologies" : "nossa organização";
      doc.text(`compromete-se a usar e devolver os equipamentos e acessórios`, 87, y);
      y += 4;
      const footerText = `fornecidos pela empresa em perfeitas condições e com todas as informações, arquivos, contatos, arquivos de dados pessoais, e-mails, documentos de propriedades da ${footerCompany} e / ou qualquer uma das suas filiais, no término do seu contrato de trabalho ou no final do período de autorização, sem as alterar, modificar, copiar, transferir, no estado em que foram entregues e sempre observando o princípio da confidencialidade. Se compromete em notificar o responsável de TI em caso de perda ou destruição do laptop, para que as medidas de segurança necessárias para a proteção de dados sejam aplicadas.`;
      const splitText = doc.splitTextToSize(footerText, 175);
      doc.text(splitText, 20, y);

      y += 30;
      
      // 7. Data e Assinaturas
      const date = new Date(exchange.data_troca + 'T12:00:00');
      const months = ["janeiro", "fevereiro", "março", "abril", "maio", "junho", "julho", "agosto", "setembro", "outubro", "novembro", "dezembro"];
      const dateStr = `Data: ${date.getDate()} de ${months[date.getMonth()]} de ${date.getFullYear()}`;
      doc.setFontSize(10);
      doc.setFont("helvetica", "bold");
      doc.text(dateStr, 20, y);

      y += 35;
      doc.setDrawColor(0, 0, 0);
      doc.line(20, y, 75, y);
      
      doc.setFontSize(8);
      doc.setFont("helvetica", "normal");
      
      const tiLabel = logoPref === 'cirion' ? "TI - Cirion: Gilberto Araujo" : "Responsável TI: Gilberto Araujo";
      const colabLabel = logoPref === 'cirion' ? `Colaborador Cirion: ${exchange.colaborador_nome}` : `Colaborador: ${exchange.colaborador_nome}`;
      
      doc.text(tiLabel, 47.5, y + 4, { align: 'center' });
      
      // Assinatura TI
      if (exchange.assinatura_ti) {
        try {
          doc.addImage(exchange.assinatura_ti, 'PNG', 17.5, y - 22, 60, 25);
        } catch (e) {
          console.error("Erro ao adicionar assinatura TI:", e);
        }
      }

      // Se for a página de devolução e tiver a opção devolucao_sem_termo ativada
      if (!isEntregue && exchange.devolucao_sem_termo) {
        doc.setFillColor(254, 243, 199); // Amarelo suave
        doc.setDrawColor(217, 119, 6); // Borda Âmbar
        doc.roundedRect(105, y - 18, 90, 26, 2, 2, 'FD');

        doc.setFontSize(7.5);
        doc.setFont("helvetica", "bold");
        doc.setTextColor(180, 83, 9);
        doc.text("DEVOLUÇÃO VIA COLETA RESIDENCIAL", 150, y - 13, { align: 'center' });

        doc.setFontSize(7);
        doc.setFont("helvetica", "normal");
        doc.setTextColor(68, 64, 60);
        doc.text("Isento de assinatura presencial do colaborador.", 150, y - 8, { align: 'center' });

        const tipoStr = (exchange.tipo_coleta || 'motoboy').toUpperCase();
        const empresaStr = exchange.empresa_transporte ? ` (${exchange.empresa_transporte})` : '';
        doc.text(`Retirada: ${tipoStr}${empresaStr}`, 150, y - 4, { align: 'center' });

        if (exchange.codigo_coleta_os) {
          doc.text(`OS/Rastreio: ${exchange.codigo_coleta_os}`, 150, y, { align: 'center' });
        }
        doc.setTextColor(0, 0, 0); // Restaura a cor
      } else {
        doc.line(120, y, 185, y);
        doc.text(colabLabel, 152.5, y + 4, { align: 'center' });
        
        // DocuSign Anchor Strings (Invisible)
        doc.setFontSize(1);
        doc.setTextColor(255, 255, 255); // White color
        doc.text("/sn2/", 47.5, y - 5, { align: 'center' }); // TI Anchor
        doc.text("/sn1/", 152.5, y - 5, { align: 'center' }); // Colaborador Anchor
        doc.setTextColor(0, 0, 0); // Reset color
        doc.setFontSize(8);
        
        if (exchange.assinatura_colaborador) {
          try {
            doc.addImage(exchange.assinatura_colaborador, 'PNG', 122.5, y - 22, 60, 25);
          } catch (e) {
            console.error("Erro ao adicionar assinatura Colaborador:", e);
          }
        }
      }
    };

    // Lógica principal de geração de páginas
    if (exchange.operationType === 'delivery') {
      // Somente Entrega: Gera apenas a página de entrega (com checkbox marcado)
      renderPage(true);
    } else if (exchange.operationType === 'return') {
      // Somente Devolução: Gera apenas a página de devolução (com checkbox marcado)
      renderPage(false);
    } else {
      // Troca Completa: Gera ambas as páginas
      renderPage(true);
      doc.addPage();
      renderPage(false);
    }

    // Constrói nome do arquivo conforme solicitado: NOME DO DESTINATÁRIO_TIPO DE EQUIPTO_SERIAL-ENTREGUE OU DEVOLVIDO_DATA ATUAL.pdf
    const clean = (str: string) => str ? str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-zA-Z0-9\s-]/g, '').trim().toUpperCase() : 'NA';
    
    const nome = clean(exchange.colaborador_nome);
    let tipo = "EQUIPAMENTO";
    
    if (exchange.entregue_tipo && exchange.operationType !== 'return') {
        tipo = clean(exchange.entregue_tipo);
    } else if (exchange.devolvido_tipo && exchange.operationType !== 'delivery') {
        tipo = clean(exchange.devolvido_tipo);
    }
    
    const serialEnt = clean(exchange.entregue_serial);
    const serialDev = clean(exchange.devolvido_serial);
    
    // Define a parte do serial baseada na operação
    let serialPart = "";
    if (exchange.operationType === 'delivery') {
      serialPart = serialEnt;
    } else if (exchange.operationType === 'return') {
      serialPart = serialDev;
    } else {
      serialPart = `${serialEnt}-${serialDev}`;
    }

    // Data atual no formato DD.MM.YY
    const now = new Date();
    const dataAtual = `${String(now.getDate()).padStart(2, '0')}.${String(now.getMonth() + 1).padStart(2, '0')}.${String(now.getFullYear()).slice(-2)}`;

    // Removido doc.save() interno para evitar download duplo
    return doc;
  } catch (error) {
    console.error("Erro ao gerar PDF:", error);
    return null;
  }
};
