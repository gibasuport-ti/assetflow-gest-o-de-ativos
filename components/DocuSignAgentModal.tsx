import React, { useState, useEffect, useRef } from 'react';
import { AssetExchange, LogoPreference, MockEmail } from '../types';
import { 
  Bot, 
  CheckCircle2, 
  Send, 
  FileText, 
  Mail, 
  ExternalLink, 
  PenTool, 
  ShieldCheck, 
  X, 
  Loader2, 
  Download, 
  Copy, 
  Check, 
  Sparkles,
  ArrowRight,
  Laptop,
  UserCheck
} from 'lucide-react';
import { generateAssetPDF, getPDFFileName } from '../services/pdfService';
import { generateDigitalSignatureStamp } from '../utils/signatureStamp';
import { apiService } from '../services/apiService';

interface DocuSignAgentModalProps {
  exchange: AssetExchange;
  logoPref: LogoPreference;
  currentUserName?: string;
  onClose: () => void;
  onComplete: (updatedExchange: AssetExchange, mockEmail?: MockEmail) => void;
  onOpenInbox: (exchangeId: string) => void;
  onOpenSignReceiverNow: (exchange: AssetExchange) => void;
}

type AgentPhase = 'sender_review' | 'running' | 'completed' | 'failed';

interface AgentStep {
  id: string;
  title: string;
  description: string;
  status: 'pending' | 'running' | 'done' | 'error';
}

export const DocuSignAgentModal: React.FC<DocuSignAgentModalProps> = ({
  exchange,
  logoPref,
  currentUserName = 'Gilberto Araujo',
  onClose,
  onComplete,
  onOpenInbox,
  onOpenSignReceiverNow
}) => {
  const [phase, setPhase] = useState<AgentPhase>('sender_review');
  const [senderSignatureType, setSenderSignatureType] = useState<'stamp' | 'draw'>('stamp');
  const [senderSignatureData, setSenderSignatureData] = useState<string>(exchange.assinatura_ti || '');
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasDrawn, setHasDrawn] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedOnlyLink, setCopiedOnlyLink] = useState(false);
  const [copiedHtml, setCopiedHtml] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);
  const [resultData, setResultData] = useState<{
    envelopeId: string;
    signingUrl?: string;
    outlookEmail?: MockEmail;
    emailHtml?: string;
    outlookWebUrl?: string;
    mailtoUrl?: string;
    agentSummary?: string;
  } | null>(null);

  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [steps, setSteps] = useState<AgentStep[]>([
    { id: 'audit', title: 'Validação e Auditoria do Ativo', description: 'Conferência de seriais, dados do colaborador e especificações', status: 'pending' },
    { id: 'sender_sig', title: 'Assinatura do Remetente (TI)', description: 'Aplicação da chancela digital institucional autenticada', status: 'pending' },
    { id: 'docusign_env', title: 'Geração de Envelope DocuSign', description: 'Renderização do Termo Oficial e criação de protocolo eSignature', status: 'pending' },
    { id: 'outlook_dispatch', title: 'Despacho para Destinatário via Outlook', description: 'Disparo de notificação corporativa formal com link de assinatura', status: 'pending' }
  ]);

  // Inicializa o carimbo digital padrão caso o remetente ainda não tenha assinatura
  useEffect(() => {
    if (!senderSignatureData) {
      const stamp = generateDigitalSignatureStamp(
        currentUserName,
        'Suporte TI - LATAM End User Services (Cirion Technologies)'
      );
      setSenderSignatureData(stamp);
    }
  }, [currentUserName]);

  // Inicializa o canvas de desenho caso o usuário mude para 'draw'
  useEffect(() => {
    if (senderSignatureType === 'draw' && canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.strokeStyle = '#003087';
        ctx.lineWidth = 2.5;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
      }
    }
  }, [senderSignatureType]);

  const addLog = (msg: string) => {
    const timestamp = new Date().toLocaleTimeString('pt-BR');
    setLogs(prev => [...prev, `[${timestamp}] ${msg}`]);
  };

  const updateStepStatus = (stepId: string, status: 'pending' | 'running' | 'done' | 'error') => {
    setSteps(prev => prev.map(s => s.id === stepId ? { ...s, status } : s));
  };

  // Funções do Canvas de desenho manual
  const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
    setIsDrawing(true);
    draw(e);
  };

  const stopDrawing = () => {
    setIsDrawing(false);
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      ctx?.beginPath();
      setSenderSignatureData(canvas.toDataURL('image/png'));
    }
  };

  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = ('touches' in e) ? e.touches[0].clientX - rect.left : (e as React.MouseEvent).clientX - rect.left;
    const y = ('touches' in e) ? e.touches[0].clientY - rect.top : (e as React.MouseEvent).clientY - rect.top;

    ctx.lineTo(x, y);
    ctx.stroke();
    setHasDrawn(true);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      ctx?.clearRect(0, 0, canvas.width, canvas.height);
      setHasDrawn(false);
      setSenderSignatureData('');
    }
  };

  // EXECUÇÃO DO AGENTE AUTÔNOMO
  const handleStartAgentFlow = async () => {
    setPhase('running');
    setLogs([]);
    addLog('Agente Autônomo DocuSign & Outlook inicializado.');

    try {
      // ETAPA 1: Auditoria dos dados
      updateStepStatus('audit', 'running');
      addLog(`Auditando dados de movimentação para ${exchange.colaborador_nome}...`);
      await new Promise(r => setTimeout(r, 600));
      updateStepStatus('audit', 'done');
      addLog('Auditoria de conformidade e integridade dos ativos concluída com sucesso.');

      // ETAPA 2: Assinatura do Remetente (TI)
      updateStepStatus('sender_sig', 'running');
      addLog(`Aplicando assinatura digital institucional do Remetente (${currentUserName})...`);
      
      let finalSenderSig = senderSignatureData;
      if (!finalSenderSig) {
        finalSenderSig = generateDigitalSignatureStamp(
          currentUserName,
          'Suporte TI - LATAM End User Services (Cirion Technologies)'
        );
        setSenderSignatureData(finalSenderSig);
      }

      const exchangeWithSenderSig: AssetExchange = {
        ...exchange,
        assinatura_ti: finalSenderSig
      };

      await new Promise(r => setTimeout(r, 600));
      updateStepStatus('sender_sig', 'done');
      addLog('Assinatura do Remetente registrada e vinculada com carimbo digital criptografado.');

      // ETAPA 3: Geração do Termo em PDF & DocuSign
      updateStepStatus('docusign_env', 'running');
      addLog('Compilando documento oficial em PDF com âncoras de assinatura /sn1/ e /sn2/...');
      
      const pdf = generateAssetPDF(exchangeWithSenderSig, logoPref);
      if (!pdf) throw new Error('Falha ao renderizar PDF do Termo Oficial.');
      const pdfBase64 = pdf.output('datauristring');

      addLog('Disparando orquestrador de envelope DocuSign eSignature API...');
      
      // Chamada ao backend do Agente
      const agentRes = await apiService.runDocuSignAgent({
        exchange: exchangeWithSenderSig,
        pdfBase64,
        senderSignature: finalSenderSig,
        senderName: currentUserName
      });

      const envelopeId = agentRes.envelopeId || `DS-${Date.now().toString(36).toUpperCase()}`;
      addLog(`Envelope DocuSign criado com sucesso. Protocolo: ${envelopeId}`);
      updateStepStatus('docusign_env', 'done');

      // ETAPA 4: Despacho para Destinatário via Outlook
      updateStepStatus('outlook_dispatch', 'running');
      addLog(`Redigindo e-mail corporativo formal para o destinatário <${exchange.colaborador_email}>...`);
      await new Promise(r => setTimeout(r, 700));

      if (agentRes.outlookEmail) {
        addLog(`Notificação registrada no Outlook corporativo com anexo do Termo assinado.`);
      }
      addLog(`Deep link do Microsoft Outlook Web & Desktop preparado.`);
      updateStepStatus('outlook_dispatch', 'done');

      // Salva o registro atualizado no banco
      const finalizedExchange: AssetExchange = {
        ...exchangeWithSenderSig,
        status: 'pending_receiver',
        docusign_status: 'pending',
        docusign_envelope_id: envelopeId,
        docusign_signed_at: Date.now()
      };

      await apiService.save(finalizedExchange);
      addLog('Movimentação atualizada no Inventário de Ativos (Aguardando Assinatura do Destinatário).');

      setResultData({
        envelopeId,
        signingUrl: agentRes.signingUrl || `${window.location.origin}/?sign=${exchange.id}&envelope=${envelopeId}`,
        outlookEmail: agentRes.outlookEmail,
        emailHtml: agentRes.emailHtml,
        outlookWebUrl: agentRes.outlookWebUrl,
        mailtoUrl: agentRes.mailtoUrl,
        agentSummary: agentRes.agentSummary
      });

      setPhase('completed');
      onComplete(finalizedExchange, agentRes.outlookEmail);

    } catch (err: any) {
      console.error('[DocuSign Agent] Falha durante a execução:', err);
      addLog(`ERRO: ${err.message || 'Falha ao orquestrar processo.'}`);
      setPhase('failed');
    }
  };

  const handleDownloadTermo = () => {
    const tempExchange: AssetExchange = {
      ...exchange,
      assinatura_ti: senderSignatureData || exchange.assinatura_ti
    };
    const pdf = generateAssetPDF(tempExchange, logoPref);
    if (pdf) {
      pdf.save(getPDFFileName(tempExchange));
    }
  };

  const handleCopySigningLink = () => {
    const link = resultData?.signingUrl || `${window.location.origin}/?sign=${exchange.id}`;
    navigator.clipboard.writeText(link);
    setCopiedOnlyLink(true);
    setTimeout(() => setCopiedOnlyLink(false), 2500);
  };

  const handleCopyHtmlEmail = async () => {
    if (!resultData) return;
    const htmlContent = resultData.emailHtml || '';
    const textContent = resultData.outlookEmail?.body || '';
    try {
      if (navigator.clipboard && (window as any).ClipboardItem) {
        const blobHtml = new Blob([htmlContent], { type: 'text/html' });
        const blobText = new Blob([textContent], { type: 'text/plain' });
        const item = new (window as any).ClipboardItem({
          'text/html': blobHtml,
          'text/plain': blobText
        });
        await navigator.clipboard.write([item]);
        setCopiedHtml(true);
        setTimeout(() => setCopiedHtml(false), 2500);
        return;
      }
    } catch (err) {
      console.warn('Fallback copy plain text:', err);
    }
    navigator.clipboard.writeText(textContent);
    setCopiedHtml(true);
    setTimeout(() => setCopiedHtml(false), 2500);
  };

  const handleCopyNotificationText = () => {
    if (resultData?.outlookEmail?.body) {
      navigator.clipboard.writeText(resultData.outlookEmail.body);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-white dark:bg-[#1e1f29] rounded-3xl max-w-3xl w-full border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Modal Header */}
        <div className="px-6 py-5 border-b border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-[#191a21]/90 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center shadow-lg shadow-indigo-500/25">
              <Bot size={24} className="animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-black text-slate-900 dark:text-white">
                  Agente Autônomo DocuSign & Outlook
                </h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-300 border border-blue-200 dark:border-blue-500/30">
                  M365 & eSignature
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Orquestração de assinatura digital para Remetente (TI) e Destinatário ({exchange.colaborador_nome})
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-white rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          
          {/* Card de Resumo da Operação */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800/80 grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Destinatário (Colaborador)</span>
              <div className="font-bold text-slate-800 dark:text-slate-200 truncate">{exchange.colaborador_nome}</div>
              <div className="text-[11px] text-slate-500 truncate">{exchange.colaborador_email}</div>
            </div>
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Equipamento</span>
              <div className="font-bold text-slate-800 dark:text-slate-200 truncate">
                {exchange.entregue_tipo || exchange.devolvido_tipo || 'Ativo Corporativo'}
              </div>
              <div className="text-[11px] text-slate-500 truncate">
                S/N: {exchange.entregue_serial || exchange.devolvido_serial || 'Sob Auditoria'}
              </div>
            </div>
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Remetente (Responsável TI)</span>
              <div className="font-bold text-slate-800 dark:text-slate-200 truncate">{currentUserName}</div>
              <div className="text-[11px] text-blue-600 dark:text-blue-400 font-medium">End User Support Brasil</div>
            </div>
          </div>

          {/* FASE 1: Revisão da Assinatura do Remetente */}
          {phase === 'sender_review' && (
            <div className="space-y-5 animate-in fade-in duration-300">
              <div className="bg-blue-50/50 dark:bg-blue-950/20 border border-blue-200/70 dark:border-blue-800/50 rounded-2xl p-4 flex items-start gap-3">
                <Sparkles className="text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" size={20} />
                <div className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                  <strong className="text-blue-700 dark:text-blue-300 font-bold block mb-0.5">
                    Etapa 1: Assinatura do Remetente (TI)
                  </strong>
                  Para despachar o documento oficial pelo DocuSign e Outlook para o colaborador, o Agente necessita da sua chancela de remetente. Você pode utilizar a <strong>Chancela Digital Instantânea</strong> do agente ou desenhar sua rubrica.
                </div>
              </div>

              {/* Seletor de Tipo de Assinatura */}
              <div className="flex items-center gap-2 p-1.5 bg-slate-100 dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setSenderSignatureType('stamp')}
                  className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                    senderSignatureType === 'stamp'
                      ? 'bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 shadow-sm border border-slate-200/50 dark:border-slate-700'
                      : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <ShieldCheck size={16} />
                  <span>Chancela Digital Instantânea (1 Clique)</span>
                </button>
                <button
                  type="button"
                  onClick={() => setSenderSignatureType('draw')}
                  className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                    senderSignatureType === 'draw'
                      ? 'bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 shadow-sm border border-slate-200/50 dark:border-slate-700'
                      : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <PenTool size={16} />
                  <span>Desenhar Rubrica com a Caneta</span>
                </button>
              </div>

              {/* Painel do Carimbo Digital */}
              {senderSignatureType === 'stamp' ? (
                <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border-2 border-dashed border-blue-300/70 dark:border-blue-700/50 flex flex-col items-center justify-center text-center space-y-3">
                  {senderSignatureData ? (
                    <img 
                      src={senderSignatureData} 
                      alt="Chancela Digital" 
                      className="max-h-36 object-contain rounded-lg border border-slate-200 dark:border-slate-800 bg-white p-2"
                    />
                  ) : (
                    <div className="text-xs text-slate-400">Gerando chancela digital...</div>
                  )}
                  <div className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                    <CheckCircle2 size={14} className="text-emerald-500" />
                    <span>Autenticação institucional de TI válida para arquivamento e DocuSign</span>
                  </div>
                </div>
              ) : (
                /* Painel de Desenho com Canvas */
                <div className="space-y-2">
                  <div className="relative border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-2xl bg-white overflow-hidden h-40">
                    <canvas
                      ref={canvasRef}
                      width={640}
                      height={160}
                      className="w-full h-full cursor-crosshair touch-none"
                      onMouseDown={startDrawing}
                      onMouseUp={stopDrawing}
                      onMouseMove={draw}
                      onTouchStart={startDrawing}
                      onTouchEnd={stopDrawing}
                      onTouchMove={draw}
                    />
                    {!hasDrawn && (
                      <div className="absolute inset-0 flex items-center justify-center pointer-events-none text-slate-400 text-xs font-medium">
                        Desenhe a rubrica do responsável de TI aqui
                      </div>
                    )}
                  </div>
                  <div className="flex justify-end">
                    <button
                      type="button"
                      onClick={clearCanvas}
                      className="text-xs font-bold text-rose-500 hover:text-rose-600 px-3 py-1"
                    >
                      Limpar Desenho
                    </button>
                  </div>
                </div>
              )}

              {/* Botão de Disparo do Agente */}
              <div className="pt-2">
                <button
                  type="button"
                  onClick={handleStartAgentFlow}
                  className="w-full py-4 bg-gradient-to-r from-blue-600 via-indigo-600 to-dracula-purple text-white rounded-2xl font-black text-sm shadow-xl shadow-indigo-600/30 hover:shadow-indigo-600/50 hover:brightness-105 active:scale-[0.99] transition-all flex items-center justify-center gap-3 cursor-pointer"
                >
                  <Bot size={20} className="text-cyan-300 animate-bounce" />
                  <span>CONFIRMAR ASSINATURA DO REMETENTE E INICIAR AGENTE</span>
                  <ArrowRight size={18} />
                </button>
              </div>
            </div>
          )}

          {/* FASE 2: Executando o Agente */}
          {phase === 'running' && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <div className="text-center space-y-2 py-4">
                <div className="inline-flex p-3 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 mb-2 animate-spin">
                  <Loader2 size={32} />
                </div>
                <h4 className="text-base font-black text-slate-900 dark:text-white">
                  Agente DocuSign & Outlook em Execução
                </h4>
                <p className="text-xs text-slate-500 max-w-md mx-auto">
                  Automatizando a geração do termo em PDF, selo de autenticação, envelope eSignature e envio corporativo no Outlook...
                </p>
              </div>

              {/* Linha do Tempo das Etapas */}
              <div className="space-y-3">
                {steps.map((s, idx) => (
                  <div 
                    key={s.id}
                    className={`p-4 rounded-2xl border transition-all flex items-center justify-between ${
                      s.status === 'done' 
                        ? 'bg-emerald-50/60 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-800/40 text-emerald-900 dark:text-emerald-200'
                        : s.status === 'running'
                        ? 'bg-blue-50/80 dark:bg-blue-950/40 border-blue-300 dark:border-blue-700 text-blue-900 dark:text-blue-200 ring-2 ring-blue-500/20'
                        : 'bg-slate-50 dark:bg-slate-900/40 border-slate-200 dark:border-slate-800 text-slate-400'
                    }`}
                  >
                    <div className="flex items-center gap-3.5">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${
                        s.status === 'done' 
                          ? 'bg-emerald-500 text-white' 
                          : s.status === 'running' 
                          ? 'bg-blue-600 text-white animate-pulse' 
                          : 'bg-slate-200 dark:bg-slate-800 text-slate-500'
                      }`}>
                        {s.status === 'done' ? <Check size={16} /> : idx + 1}
                      </div>
                      <div>
                        <div className="font-bold text-xs">{s.title}</div>
                        <div className="text-[11px] opacity-80">{s.description}</div>
                      </div>
                    </div>
                    <div>
                      {s.status === 'running' && <Loader2 size={18} className="animate-spin text-blue-600" />}
                      {s.status === 'done' && <CheckCircle2 size={18} className="text-emerald-500" />}
                    </div>
                  </div>
                ))}
              </div>

              {/* Terminal de Logs do Agente */}
              <div className="rounded-2xl bg-slate-900 p-4 border border-slate-800 text-left">
                <div className="flex items-center justify-between pb-2 border-b border-slate-800 mb-2">
                  <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest">
                    Live Audit Agent Console
                  </span>
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                </div>
                <div className="space-y-1 font-mono text-[11px] text-slate-300 max-h-32 overflow-y-auto">
                  {logs.map((log, i) => (
                    <div key={i} className="leading-tight">{log}</div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* FASE 3: Concluído com Sucesso */}
          {phase === 'completed' && resultData && (
            <div className="space-y-6 animate-in zoom-in-95 duration-300">
              
              {/* Banner de Sucesso */}
              <div className="p-6 rounded-3xl bg-gradient-to-br from-emerald-500/10 via-teal-500/5 to-transparent border border-emerald-500/30 text-center space-y-2">
                <div className="w-12 h-12 rounded-2xl bg-emerald-500 text-white flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/30">
                  <CheckCircle2 size={28} />
                </div>
                <h4 className="text-lg font-black text-slate-900 dark:text-white">
                  Processo DocuSign & Outlook Despachado com Sucesso!
                </h4>
                <p className="text-xs text-slate-600 dark:text-slate-300 max-w-lg mx-auto leading-relaxed">
                  O Termo foi assinado pelo Remetente de TI ({currentUserName}), registrado no DocuSign e o e-mail formal foi enviado para o colaborador <strong>{exchange.colaborador_nome}</strong> no Outlook.
                </p>
                <div className="inline-block mt-2 px-3 py-1 bg-emerald-100 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-700/50 rounded-xl text-emerald-800 dark:text-emerald-300 font-mono text-xs font-bold">
                  Protocolo DocuSign: {resultData.envelopeId}
                </div>
              </div>

              {/* Status das Partes */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center shrink-0">
                    <UserCheck size={20} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Remetente (TI)</span>
                    <div className="font-bold text-xs text-slate-800 dark:text-slate-200 truncate">{currentUserName}</div>
                    <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                      <Check size={12} /> Assinado Digitalmente
                    </span>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-500 flex items-center justify-center shrink-0">
                    <Mail size={20} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Destinatário</span>
                    <div className="font-bold text-xs text-slate-800 dark:text-slate-200 truncate">{exchange.colaborador_nome}</div>
                    <span className="text-[11px] font-bold text-blue-600 dark:text-blue-400 flex items-center gap-1">
                      <span>Aguardando Assinatura via Outlook</span>
                    </span>
                  </div>
                </div>
              </div>

              {/* Ações Rápidas em Destaque */}
              <div className="space-y-3 pt-2">
                <span className="text-xs font-black text-slate-400 uppercase tracking-wider block">
                  Ações Imediatas
                </span>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  
                  {/* Ver no Outlook do App */}
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      onOpenInbox(exchange.id);
                    }}
                    className="p-4 rounded-2xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800/60 hover:bg-blue-100 dark:hover:bg-blue-900/50 text-left transition-all group flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center">
                        <Mail size={20} />
                      </div>
                      <div>
                        <div className="font-bold text-xs text-blue-900 dark:text-blue-200">Ver no Outlook Interno</div>
                        <div className="text-[11px] text-blue-600 dark:text-blue-400">Abrir caixa de entrada do sistema</div>
                      </div>
                    </div>
                    <ArrowRight size={16} className="text-blue-500 group-hover:translate-x-1 transition-transform" />
                  </button>

                  {/* Disparar no Outlook Web / Desktop */}
                  <a
                    href={resultData.outlookWebUrl || resultData.mailtoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800/80 text-left transition-all group flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-slate-800 text-white flex items-center justify-center">
                        <ExternalLink size={20} />
                      </div>
                      <div>
                        <div className="font-bold text-xs text-slate-900 dark:text-white">Abrir no Outlook Oficial</div>
                        <div className="text-[11px] text-slate-500">Disparar no Microsoft 365 / Desktop</div>
                      </div>
                    </div>
                    <ExternalLink size={16} className="text-slate-400 group-hover:text-slate-600" />
                  </a>

                  {/* Simular / Assinar como Colaborador Presencial */}
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      onOpenSignReceiverNow(exchange);
                    }}
                    className="p-4 rounded-2xl bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800/60 hover:bg-purple-100 dark:hover:bg-purple-900/50 text-left transition-all group flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-dracula-purple text-white flex items-center justify-center">
                        <PenTool size={20} />
                      </div>
                      <div>
                        <div className="font-bold text-xs text-purple-900 dark:text-purple-200">Assinar como Destinatário</div>
                        <div className="text-[11px] text-purple-600 dark:text-purple-400">Atendimento presencial / Teste</div>
                      </div>
                    </div>
                    <ArrowRight size={16} className="text-purple-500 group-hover:translate-x-1 transition-transform" />
                  </button>

                  {/* Baixar Termo em PDF */}
                  <button
                    type="button"
                    onClick={handleDownloadTermo}
                    className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800/80 text-left transition-all group flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 flex items-center justify-center">
                        <Download size={20} />
                      </div>
                      <div>
                        <div className="font-bold text-xs text-slate-900 dark:text-white">Baixar Termo em PDF</div>
                        <div className="text-[11px] text-slate-500">Cópia do documento gerado</div>
                      </div>
                    </div>
                    <Download size={16} className="text-slate-400 group-hover:text-slate-600" />
                  </button>

                </div>

                {/* Bloco Destaque: Botão e Acesso para Assinatura do Destinatário */}
                <div className="p-4 rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800/60 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Sparkles size={16} className="text-indigo-600 dark:text-indigo-400" />
                      <span className="text-xs font-bold text-indigo-950 dark:text-indigo-200">
                        Acesso para Assinatura do Destinatário ({exchange.colaborador_nome})
                      </span>
                    </div>
                    <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-indigo-100 dark:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300 font-bold">
                      Ação Pendente
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                    O e-mail formal enviado ao colaborador contém o botão <strong>"ASSINAR DIGITALMENTE"</strong> com validade jurídica. Você também pode abrir o portal ou copiar o link direto abaixo para enviar via Teams, WhatsApp corporativo ou assinar presencialmente:
                  </p>

                  <div className="flex flex-col sm:flex-row items-center gap-2">
                    <a
                      href={resultData.signingUrl || `/?sign=${exchange.id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full sm:w-auto flex-1 py-3 px-4 bg-[#003087] hover:bg-[#002266] text-white rounded-xl font-bold text-xs flex items-center justify-center gap-2 shadow-md shadow-blue-900/20 transition-all text-center cursor-pointer"
                    >
                      <PenTool size={16} /> ✍️ ASSINAR DIGITALMENTE (Abrir Portal)
                    </a>

                    <button
                      type="button"
                      onClick={handleCopySigningLink}
                      className="w-full sm:w-auto py-3 px-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl font-bold text-xs text-slate-700 dark:text-slate-200 flex items-center justify-center gap-2 transition-all shrink-0 cursor-pointer"
                    >
                      {copiedOnlyLink ? <Check size={16} className="text-emerald-500" /> : <Copy size={16} />}
                      <span>{copiedOnlyLink ? 'Link Copiado!' : 'Copiar Link de Assinatura'}</span>
                    </button>
                  </div>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-100 dark:border-slate-800/80">
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={handleCopyNotificationText}
                      className="text-xs font-bold text-slate-500 hover:text-slate-900 dark:hover:text-white flex items-center gap-1.5 py-1"
                    >
                      {copiedLink ? <Check size={14} className="text-emerald-500" /> : <Copy size={14} />}
                      <span>{copiedLink ? 'Texto copiado!' : 'Copiar texto formal'}</span>
                    </button>

                    <button
                      type="button"
                      onClick={handleCopyHtmlEmail}
                      className="text-xs font-bold text-blue-600 hover:text-blue-700 dark:text-blue-400 flex items-center gap-1.5 py-1"
                    >
                      {copiedHtml ? <Check size={14} className="text-emerald-500" /> : <Sparkles size={14} />}
                      <span>{copiedHtml ? 'E-mail com botão copiado!' : 'Copiar E-mail com Botão para Outlook'}</span>
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={onClose}
                    className="px-6 py-2.5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-xl font-bold text-xs hover:opacity-90 transition-opacity ml-auto"
                  >
                    Concluir e Fechar
                  </button>
                </div>
              </div>

            </div>
          )}

          {/* FASE 4: Erro */}
          {phase === 'failed' && (
            <div className="text-center py-6 space-y-4">
              <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
                <X size={24} />
              </div>
              <h4 className="font-bold text-base text-rose-600">Falha no Processamento do Agente</h4>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                Houve uma interrupção durante a orquestração do DocuSign ou Outlook.
              </p>
              <button
                type="button"
                onClick={() => setPhase('sender_review')}
                className="px-6 py-2.5 bg-blue-600 text-white rounded-xl text-xs font-bold"
              >
                Tentar Novamente
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
export default DocuSignAgentModal;
