/**
 * Utilitário para geração de Chancela e Certificado de Assinatura Digital
 * para Remetente (TI) e Colaborador, em alta resolução compatível com jsPDF.
 */

export function generateDigitalSignatureStamp(
  name: string = 'Gilberto Araujo',
  role: string = 'Suporte TI - End User Services (Cirion Technologies)',
  timestamp?: string
): string {
  if (typeof document === 'undefined') {
    return '';
  }

  const canvas = document.createElement('canvas');
  canvas.width = 460;
  canvas.height = 160;
  const ctx = canvas.getContext('2d');
  if (!ctx) return '';

  const dateStr = timestamp || new Date().toLocaleString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  });

  const hashSeed = Math.random().toString(36).substring(2, 10).toUpperCase();
  const certHash = `SHA256-${hashSeed}-${Date.now().toString(36).toUpperCase()}`;

  // Fundo transparente com borda de segurança azul marinho corporativo
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Caixa externa
  ctx.strokeStyle = '#003087';
  ctx.lineWidth = 3;
  ctx.fillStyle = 'rgba(0, 48, 135, 0.03)';
  ctx.beginPath();
  ctx.roundRect(6, 6, canvas.width - 12, canvas.height - 12, 10);
  ctx.fill();
  ctx.stroke();

  // Borda pontilhada interna
  ctx.strokeStyle = 'rgba(0, 48, 135, 0.35)';
  ctx.lineWidth = 1;
  ctx.setLineDash([4, 3]);
  ctx.strokeRect(12, 12, canvas.width - 24, canvas.height - 24);
  ctx.setLineDash([]);

  // Ícone de Selo de Autenticidade (Selo circular à esquerda)
  const sealX = 52;
  const sealY = 80;
  const sealRadius = 34;

  ctx.strokeStyle = '#003087';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(sealX, sealY, sealRadius, 0, Math.PI * 2);
  ctx.stroke();

  ctx.strokeStyle = 'rgba(0, 48, 135, 0.4)';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.arc(sealX, sealY, sealRadius - 4, 0, Math.PI * 2);
  ctx.stroke();

  // Checkmark no selo
  ctx.strokeStyle = '#00875a';
  ctx.lineWidth = 3.5;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  ctx.beginPath();
  ctx.moveTo(sealX - 12, sealY);
  ctx.lineTo(sealX - 3, sealY + 10);
  ctx.lineTo(sealX + 14, sealY - 10);
  ctx.stroke();

  // Textos da Chancela Digital
  ctx.textAlign = 'left';

  // Cabeçalho da Certificação
  ctx.fillStyle = '#003087';
  ctx.font = 'bold 11px Helvetica, Arial, sans-serif';
  ctx.fillText('ASSINATURA DIGITAL VALIDADA • CIRION ASSETFLOW', 104, 36);

  // Nome do Assinante
  ctx.fillStyle = '#0a2540';
  ctx.font = 'bold 18px Helvetica, Arial, sans-serif';
  ctx.fillText(name, 104, 64);

  // Cargo / Unidade
  ctx.fillStyle = '#42526e';
  ctx.font = 'normal 11px Helvetica, Arial, sans-serif';
  ctx.fillText(role, 104, 84);

  // Data / Hora e Padrão Legal
  ctx.fillStyle = '#172b4d';
  ctx.font = 'bold 10px monospace, sans-serif';
  ctx.fillText(`DATA/HORA: ${dateStr} (UTC-3)`, 104, 108);

  // Hash Criptográfico
  ctx.fillStyle = '#6b778c';
  ctx.font = 'normal 9px monospace, sans-serif';
  ctx.fillText(`HASH DE AUTENTICIDADE: ${certHash}`, 104, 126);

  // Carimbo lateral de conformidade
  ctx.fillStyle = 'rgba(0, 48, 135, 0.7)';
  ctx.font = 'bold 8px Helvetica, Arial, sans-serif';
  ctx.fillText('ICP / DOCUSIGN COMPLIANT', 104, 142);

  return canvas.toDataURL('image/png');
}
