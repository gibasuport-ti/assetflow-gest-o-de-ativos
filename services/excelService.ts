
import * as XLSX from 'xlsx';
import { AssetExchange, EquipmentCondition, OperationType } from '../types';

export const exportToExcel = (data: AssetExchange[]) => {
  if (!data || !Array.isArray(data)) {
    throw new Error("Dados de entrada inválidos para exportação.");
  }

  const flattenedData = data.map(item => {
    let opLabel = 'Troca';
    if (item.operationType === 'delivery') opLabel = 'Entrega (Novo)';
    if (item.operationType === 'return') opLabel = 'Devolução (Saída)';

    const rawRow = {
      "ID": item.id || "",
      "Tipo Operação": opLabel,
      "Status": item.status || "",
      "Colaborador": item.colaborador_nome || "",
      "Email": item.colaborador_email || "",
      "Data Troca": item.data_troca || "",
      "Entregue Tipo": item.entregue_tipo || "",
      "Entregue Marca": item.entregue_marca || "",
      "Entregue Modelo": item.entregue_modelo || "",
      "Entregue Serial": item.entregue_serial || "",
      "Entregue Condicao": item.entregue_condicao || "",
      "Entregue Processador": item.entregue_processador || "",
      "Entregue Memoria": item.entregue_memoria || "",
      "Entregue HD": item.entregue_armazenamento || "",
      "Entregue Acessorios": Array.isArray(item.entregue_acessorios) ? item.entregue_acessorios.join(', ') : "",
      "Obs Entrega": item.entregue_observacoes || "",
      "Itens Adicionais Entrega": Array.isArray(item.entregue_adicionais) ? item.entregue_adicionais.map(i => `${i.tipo || ''}: ${i.marca || ''} ${i.modelo || ''} (${i.serial || ''})`).join(' | ') : "",
      "Devolvido Tipo": item.devolvido_tipo || "",
      "Devolvido Marca": item.devolvido_marca || "",
      "Devolvido Modelo": item.devolvido_modelo || "",
      "Devolvido Serial": item.devolvido_serial || "",
      "Devolvido Condicao": item.devolvido_condicao || "",
      "Devolvido Processador": item.devolvido_processador || "",
      "Devolvido Memoria": item.devolvido_memoria || "",
      "Devolvido HD": item.devolvido_armazenamento || "",
      "Devolvido Acessorios": Array.isArray(item.devolvido_acessorios) ? item.devolvido_acessorios.join(', ') : "",
      "Obs Devolução": item.devolvido_observacoes || "",
      "Itens Adicionais Devolução": Array.isArray(item.devolvido_adicionais) ? item.devolvido_adicionais.map(i => `${i.tipo || ''}: ${i.marca || ''} ${i.modelo || ''} (${i.serial || ''})`).join(' | ') : "",
      "Devolução Sem Termo": item.devolucao_sem_termo ? "Sim (Motoboy/Transportadora)" : "Não",
      "Tipo Coleta": item.tipo_coleta || "",
      "Empresa Transporte": item.empresa_transporte || "",
      "OS/Rastreio Coleta": item.codigo_coleta_os || "",
      "Assinatura TI": item.assinatura_ti || "",
      "Assinatura Colaborador": item.assinatura_colaborador || ""
    };

    // Sanitize any field that exceeds Excel's hard limit of 32,767 characters
    const sanitizedRow: Record<string, string> = {};
    for (const [key, val] of Object.entries(rawRow)) {
      const strVal = String(val);
      if (strVal.length > 32700) {
        sanitizedRow[key] = strVal.slice(0, 32700) + "... [TRUNCADO]";
      } else {
        sanitizedRow[key] = strVal;
      }
    }
    return sanitizedRow;
  });

  const worksheet = XLSX.utils.json_to_sheet(flattenedData);
  
  // Adiciona Filtros Automáticos em todas as colunas
  if (worksheet['!ref']) {
    const range = XLSX.utils.decode_range(worksheet['!ref']);
    worksheet['!autofilter'] = { ref: XLSX.utils.encode_range(range) };
  }

  // Define larguras de coluna para melhor legibilidade
  worksheet['!cols'] = [
    { wch: 12 }, // ID
    { wch: 18 }, // Tipo Op
    { wch: 15 }, // Status
    { wch: 30 }, // Colaborador
    { wch: 35 }, // Email
    { wch: 12 }, // Data Troca
    { wch: 15 }, // Entregue Tipo
    { wch: 15 }, // Entregue Marca
    { wch: 20 }, // Entregue Modelo
    { wch: 20 }, // Entregue Serial
    { wch: 15 }, // Entregue Condicao
    { wch: 40 }, // Entregue Processador
    { wch: 15 }, // Entregue Memoria
    { wch: 15 }, // Entregue HD
    { wch: 40 }, // Entregue Acessorios
    { wch: 30 }, // Obs Entrega
    { wch: 40 }, // Itens Adicionais Entrega
    { wch: 15 }, // Devolvido Tipo
    { wch: 15 }, // Devolvido Marca
    { wch: 20 }, // Devolvido Modelo
    { wch: 20 }, // Devolvido Serial
    { wch: 15 }, // Devolvido Condicao
    { wch: 40 }, // Devolvido Processador
    { wch: 15 }, // Devolvido Memoria
    { wch: 15 }, // Devolvido HD
    { wch: 40 }, // Devolvido Acessorios
    { wch: 30 }, // Obs Devolução
    { wch: 40 }, // Itens Adicionais Devolução
    { wch: 25 }, // Assinatura TI
    { wch: 25 }, // Assinatura Colaborador
  ];

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Inventário de Ativos");
  
  const fileName = `AssetFlow_Export_${new Date().toISOString().split('T')[0]}.xlsx`;
  XLSX.writeFile(workbook, fileName);
};

export const importFromExcel = (file: File): Promise<AssetExchange[]> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet) as any[];

        const importedExchanges: AssetExchange[] = jsonData.map(row => {
          // Determina o tipo de operação baseado no valor ou padrão
          let opType: OperationType = 'exchange';
          const rowOp = row["Tipo Operação"];
          if (rowOp === 'Entrega (Novo)' || rowOp === 'delivery') opType = 'delivery';
          if (rowOp === 'Devolução (Saída)' || rowOp === 'return') opType = 'return';

          return {
            id: String(row["ID"] || Math.random().toString(36).substr(2, 9).toUpperCase()),
            operationType: opType,
            status: row["Status"] || 'draft',
            timestamp: Date.now(),
            colaborador_nome: String(row["Colaborador"] || ""),
            colaborador_email: String(row["Email"] || ""),
            data_troca: String(row["Data Troca"] || new Date().toISOString().split('T')[0]),
            // Mapeia colunas novas ou cai no fallback da coluna antiga 'Obs'
            entregue_observacoes: String(row["Obs Entrega"] || row["Obs"] || ""), 
            entregue_adicionais: parseAdditionalItems(row["Itens Adicionais Entrega"]),
            devolvido_observacoes: String(row["Obs Devolução"] || ""),
            devolvido_adicionais: parseAdditionalItems(row["Itens Adicionais Devolução"]),
            entregue_tipo: String(row["Entregue Tipo"] || ""),
            entregue_marca: String(row["Entregue Marca"] || ""),
            entregue_modelo: String(row["Entregue Modelo"] || ""),
            entregue_serial: String(row["Entregue Serial"] || ""),
            entregue_processador: String(row["Entregue Processador"] || ""),
            entregue_condicao: row["Entregue Condicao"] as EquipmentCondition,
            entregue_memoria: String(row["Entregue Memoria"] || ""),
            entregue_armazenamento: String(row["Entregue HD"] || ""),
            entregue_acessorios: row["Entregue Acessorios"] ? String(row["Entregue Acessorios"]).split(', ') : [],
            devolvido_tipo: String(row["Devolvido Tipo"] || ""),
            devolvido_marca: String(row["Devolvido Marca"] || ""),
            devolvido_modelo: String(row["Devolvido Modelo"] || ""),
            devolvido_serial: String(row["Devolvido Serial"] || ""),
            devolvido_processador: String(row["Devolvido Processador"] || ""),
            devolvido_condicao: row["Devolvido Condicao"] as EquipmentCondition,
            devolvido_memoria: String(row["Devolvido Memoria"] || ""),
            devolvido_armazenamento: String(row["Devolvido HD"] || ""),
            devolvido_acessorios: row["Devolvido Acessorios"] ? String(row["Devolvido Acessorios"]).split(', ') : [],
            devolucao_sem_termo: String(row["Devolução Sem Termo"] || "").toLowerCase().includes("sim"),
            tipo_coleta: row["Tipo Coleta"] as any,
            empresa_transporte: String(row["Empresa Transporte"] || ""),
            codigo_coleta_os: String(row["OS/Rastreio Coleta"] || ""),
            assinatura_ti: row["Assinatura TI"],
            assinatura_colaborador: row["Assinatura Colaborador"]
          };
        });

        resolve(importedExchanges);
      } catch (err) {
        reject(err);
      }
    };
    reader.onerror = reject;
    reader.readAsArrayBuffer(file);
  });
};

const parseAdditionalItems = (value: any): any[] => {
  if (!value || typeof value !== 'string') return [];
  // Formato esperado: "Tipo: Marca Modelo (Serial) | Tipo: Marca Modelo (Serial)"
  return value.split(' | ').map(itemStr => {
    try {
      const [typePart, rest] = itemStr.split(': ');
      const [brandModel, serialPart] = rest.split(' (');
      const serial = serialPart.replace(')', '');
      const brandModelParts = brandModel.split(' ');
      const marca = brandModelParts[0];
      const modelo = brandModelParts.slice(1).join(' ');
      
      return {
        id: Math.random().toString(36).substr(2, 9).toUpperCase(),
        tipo: typePart,
        marca: marca,
        modelo: modelo,
        serial: serial
      };
    } catch (e) {
      return null;
    }
  }).filter(i => i !== null);
};
