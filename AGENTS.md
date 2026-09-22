# Instruções do Agente - AssetFlow & DocuSign & SharePoint

## Fluxo Obrigatório de Assinatura e Arquivamento

Ao clicar no botão **"Gravar e enviar para DocuSign"**:

1. **Envio para DocuSign**:
   - O sistema gera o Termo de Responsabilidade em PDF correspondente à operação (Troca, Entrega ou Devolução).
   - O documento em PDF é enviado para assinatura digital no DocuSign com a chancela do remetente e envelope oficial eSignature.

2. **Processo de Assinatura via Outlook (Remetente e Destinatário)**:
   - O responsável técnico (Remetente da TI) aplica a assinatura/chancela digital no sistema.
   - O sistema despacha automaticamente a notificação formal para o e-mail corporativo do Destinatário via Microsoft Outlook, contendo os dados do equipamento, protocolo do envelope DocuSign e o link/botão para assinatura eletrônica do Destinatário.
   - O destinatário abre a notificação no Outlook e realiza a assinatura digital do termo.

3. **Retorno e Gravação no SharePoint / OneDrive**:
   - Quando ambos assinarem (Remetente da TI e Destinatário) e o documento assinado for retornado para o Outlook:
   - Gravar o documento assinado na pasta do SharePoint exatamente no seguinte caminho:
     `https://xyzlatam.sharepoint.com/:f:/r/sites/LATAMEndUserServices-EndUserSupportBrasil/Documentos%20compartidos/End%20User%20Support%20Brasil/10%20-%20Gilberto/Cartas%20Firmadas?d=wb491a040d8ea487ebe845ef068cb5498&csf=1&web=1&e=GkwfNQ`
   - Registrar no Outlook a notificação de conclusão para ambas as partes, disponibilizando o botão de acesso direto à referida pasta do SharePoint e o anexo do PDF assinado.
