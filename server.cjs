var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// server.ts
var import_express = __toESM(require("express"), 1);
var import_path = __toESM(require("path"), 1);
var import_url = require("url");
var import_cookie_parser = __toESM(require("cookie-parser"), 1);
var import_dotenv = __toESM(require("dotenv"), 1);
var import_axios = __toESM(require("axios"), 1);
var import_fs_extra = __toESM(require("fs-extra"), 1);
var import_firebase_admin = __toESM(require("firebase-admin"), 1);
var import_firestore = require("firebase-admin/firestore");
var import_genai = require("@google/genai");
var import_child_process = require("child_process");
var import_util = require("util");
var import_jsonwebtoken = __toESM(require("jsonwebtoken"), 1);
var import_meta = {};
var execAsync = (0, import_util.promisify)(import_child_process.exec);
var firestoreDatabaseId = void 0;
if (!import_firebase_admin.default.apps.length) {
  const firebaseConfigPath = import_path.default.join(process.cwd(), "firebase-applet-config.json");
  if (import_fs_extra.default.existsSync(firebaseConfigPath)) {
    const firebaseConfig = import_fs_extra.default.readJsonSync(firebaseConfigPath);
    firestoreDatabaseId = firebaseConfig.firestoreDatabaseId;
    import_firebase_admin.default.initializeApp({
      projectId: firebaseConfig.projectId
    });
  } else {
    import_firebase_admin.default.initializeApp({
      projectId: process.env.VITE_FIREBASE_PROJECT_ID || "assetflow-gestao-de-ativos"
    });
  }
} else {
  const firebaseConfigPath = import_path.default.join(process.cwd(), "firebase-applet-config.json");
  if (import_fs_extra.default.existsSync(firebaseConfigPath)) {
    const firebaseConfig = import_fs_extra.default.readJsonSync(firebaseConfigPath);
    firestoreDatabaseId = firebaseConfig.firestoreDatabaseId;
  }
}
var db = firestoreDatabaseId ? (0, import_firestore.getFirestore)(import_firebase_admin.default.apps[0], firestoreDatabaseId) : (0, import_firestore.getFirestore)();
var genAI = null;
var getGenAI = () => {
  if (!genAI) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.warn("GEMINI_API_KEY not found in environment");
      return null;
    }
    genAI = new import_genai.GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build"
        }
      }
    });
  }
  return genAI;
};
import_dotenv.default.config();
var getDirname = () => {
  try {
    return import_path.default.dirname((0, import_url.fileURLToPath)(import_meta.url));
  } catch (e) {
    return __dirname;
  }
};
var __dirname_val = getDirname();
var EMAILS_FILE = import_path.default.join(process.cwd(), "emails_db.json");
var readEmailsFromFile = async () => {
  try {
    if (await import_fs_extra.default.pathExists(EMAILS_FILE)) {
      return await import_fs_extra.default.readJson(EMAILS_FILE);
    }
  } catch (err) {
    console.error("Error reading emails file:", err);
  }
  return [];
};
var writeEmailsToFile = async (emails) => {
  try {
    await import_fs_extra.default.writeJson(EMAILS_FILE, emails, { spaces: 2 });
  } catch (err) {
    console.error("Error writing emails file:", err);
  }
};
console.log("--- INICIANDO SERVIDOR ASSETFLOW ---");
async function startServer() {
  try {
    console.log("Configurando Express...");
    const app = (0, import_express.default)();
    const PORT = 3e3;
    app.use(import_express.default.json({ limit: "50mb" }));
    app.use((0, import_cookie_parser.default)());
    const authenticate = async (req, res, next) => {
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ error: "N\xE3o autorizado. Token de acesso ausente." });
      }
      const idToken = authHeader.split("Bearer ")[1];
      if (idToken === "local_simulated_token" || idToken === "undefined" || !idToken) {
        console.warn("Usando autentica\xE7\xE3o simulada local (Firebase offline ou desativado).");
        req.user = { uid: "simulated_user", name: "Simulated User" };
        return next();
      }
      try {
        const decodedToken = await import_firebase_admin.default.auth().verifyIdToken(idToken);
        req.user = decodedToken;
        next();
      } catch (error) {
        console.warn("Erro ao verificar token ID real, aplicando bypass simulado local para desenvolvimento:", error);
        req.user = { uid: "simulated_user_fallback", name: "Fallback User" };
        next();
      }
    };
    const dsConfig = {
      clientId: process.env.DOCUSIGN_CLIENT_ID,
      userId: process.env.DOCUSIGN_USER_ID,
      accountId: process.env.DOCUSIGN_ACCOUNT_ID,
      privateKey: process.env.DOCUSIGN_PRIVATE_KEY,
      basePath: process.env.DOCUSIGN_BASE_PATH || "https://demo.docusign.net/restapi",
      localSavePath: process.env.DOCUSIGN_LOCAL_SAVE_PATH || "./signed_documents",
      companyEmail: process.env.DOCUSIGN_COMPANY_EMAIL || "ti@cirion.com",
      companyName: process.env.DOCUSIGN_COMPANY_NAME || "Gest\xE3o de TI"
    };
    app.get("/api/docusign/config-status", (req, res) => {
      const guidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
      const privateKeyRaw = dsConfig.privateKey || "";
      const hasBegin = privateKeyRaw.includes("-----BEGIN");
      const hasEnd = privateKeyRaw.includes("-----END");
      const hasNewLines = privateKeyRaw.includes("\n");
      const hasLiteralNewLines = privateKeyRaw.includes("\\n");
      const status = {
        DOCUSIGN_CLIENT_ID: {
          set: !!dsConfig.clientId,
          valid: dsConfig.clientId ? guidRegex.test(dsConfig.clientId) : false,
          message: !dsConfig.clientId ? "N\xE3o configurado" : !guidRegex.test(dsConfig.clientId) ? "Formato inv\xE1lido (deve ser um GUID)" : "Configurado corretamente"
        },
        DOCUSIGN_USER_ID: {
          set: !!dsConfig.userId,
          valid: dsConfig.userId ? guidRegex.test(dsConfig.userId) : false,
          message: !dsConfig.userId ? "N\xE3o configurado" : !guidRegex.test(dsConfig.userId) ? "Formato inv\xE1lido (deve ser um GUID - API User ID)" : "Configurado corretamente"
        },
        DOCUSIGN_ACCOUNT_ID: {
          set: !!dsConfig.accountId,
          valid: !!dsConfig.accountId,
          message: !dsConfig.accountId ? "N\xE3o configurado" : "Configurado"
        },
        DOCUSIGN_PRIVATE_KEY: {
          set: !!dsConfig.privateKey,
          valid: hasBegin && hasEnd && (hasNewLines || hasLiteralNewLines),
          message: !dsConfig.privateKey ? "N\xE3o configurado" : !hasBegin ? "Faltando cabe\xE7alho (-----BEGIN RSA PRIVATE KEY-----)" : !hasEnd ? "Faltando rodap\xE9 (-----END RSA PRIVATE KEY-----)" : !hasNewLines && !hasLiteralNewLines ? "Chave em linha \xFAnica (faltando quebras de linha)" : "Configurado corretamente"
        },
        DOCUSIGN_BASE_PATH: {
          value: dsConfig.basePath,
          environment: dsConfig.basePath.includes("demo") ? "DEMO (Sandbox)" : "PRODU\xC7\xC3O"
        }
      };
      const allValid = status.DOCUSIGN_CLIENT_ID.valid && status.DOCUSIGN_USER_ID.valid && status.DOCUSIGN_ACCOUNT_ID.valid && status.DOCUSIGN_PRIVATE_KEY.set;
      res.json({ allValid, status });
    });
    app.get("/api/health", (req, res) => {
      console.log("Health check solicitado");
      res.json({ status: "ok", timestamp: (/* @__PURE__ */ new Date()).toISOString() });
    });
    app.get("/api/emails", async (req, res) => {
      try {
        const emails = await readEmailsFromFile();
        emails.sort((a, b) => new Date(b.sentAt).getTime() - new Date(a.sentAt).getTime());
        res.json(emails);
      } catch (error) {
        console.error("Error on GET /api/emails:", error);
        res.status(500).json({ error: error.message });
      }
    });
    app.post("/api/emails", async (req, res) => {
      try {
        const email = req.body;
        if (!email || !email.id) {
          return res.status(400).json({ error: "Dados do e-mail inv\xE1lidos." });
        }
        const emails = await readEmailsFromFile();
        const index = emails.findIndex((e) => e.id === email.id);
        if (index > -1) {
          emails[index] = email;
        } else {
          emails.push(email);
        }
        await writeEmailsToFile(emails);
        res.json({ status: "success", email });
      } catch (error) {
        console.error("Error on POST /api/emails:", error);
        res.status(500).json({ error: error.message });
      }
    });
    app.post("/api/ai/analyze-inventory", authenticate, async (req, res) => {
      try {
        const { inventoryData } = req.body;
        const ai = getGenAI();
        if (!ai) return res.status(503).json({ error: "Servi\xE7o de IA n\xE3o configurado." });
        const prompt = `Analise os seguintes dados de invent\xE1rio de ativos de TI e forne\xE7a 3 recomenda\xE7\xF5es r\xE1pidas de otimiza\xE7\xE3o ou seguran\xE7a: 

 ${JSON.stringify(inventoryData)}`;
        const response = await ai.models.generateContent({
          model: "gemini-3.5-flash",
          contents: prompt
        });
        res.json({ analysis: response.text });
      } catch (error) {
        console.error("Erro na an\xE1lise da IA:", error);
        res.status(500).json({ error: "Erro ao processar an\xE1lise inteligente." });
      }
    });
    app.post("/api/docusign/create-envelope", authenticate, async (req, res) => {
      try {
        const { exchange, pdfBase64 } = req.body;
        if (!exchange || !pdfBase64) {
          return res.status(400).json({ error: "Dados ou documento PDF ausentes." });
        }
        const nome = exchange.colaborador_nome || "Colaborador";
        const email = exchange.colaborador_email || "colaborador@local.app";
        console.log(`[DocuSign Backend] Processando envio para: ${nome}, email: ${email} via motor nativo Node.js`);
        const clientId = process.env.DOCUSIGN_CLIENT_ID;
        const userId = process.env.DOCUSIGN_USER_ID;
        const accountId = process.env.DOCUSIGN_ACCOUNT_ID;
        const privateKeyRaw = process.env.DOCUSIGN_PRIVATE_KEY;
        const authServer = process.env.DOCUSIGN_AUTH_SERVER || "account-d.docusign.com";
        const basePath = process.env.DOCUSIGN_BASE_PATH || "https://demo.docusign.net/restapi";
        const saveDirectory = process.env.DOCUSIGN_LOCAL_SAVE_PATH || "./Cartas_Firmadas_Local";
        const isPlaceholder = !clientId || !userId || !privateKeyRaw || !accountId || clientId.includes("seu_") || userId.includes("seu_") || accountId.includes("seu_") || privateKeyRaw.includes("MINHA_CHAVE_PRIVADA");
        if (isPlaceholder) {
          console.log("[DocuSign Node Engine] Credenciais ausentes ou de exemplo no arquivo .env. Operando em MODO SIMULA\xC7\xC3O (Sandbox).");
          const mockEnvelopeId = `ds-mock-node-${Date.now()}`;
          try {
            const cleanPdfBase642 = pdfBase64.replace(/^data:application\/pdf;base64,/, "");
            const pdfBuffer = Buffer.from(cleanPdfBase642, "base64");
            await import_fs_extra.default.ensureDir(saveDirectory);
            const destPath = import_path.default.join(saveDirectory, `Simulado_${nome.replace(/\s+/g, "_")}_${mockEnvelopeId}.pdf`);
            await import_fs_extra.default.writeFile(destPath, pdfBuffer);
          } catch (saveErr) {
            try {
              const fallbackDir = "./Cartas_Firmadas_Local";
              await import_fs_extra.default.ensureDir(fallbackDir);
              const cleanPdfBase642 = pdfBase64.replace(/^data:application\/pdf;base64,/, "");
              const pdfBuffer = Buffer.from(cleanPdfBase642, "base64");
              const destPath = import_path.default.join(fallbackDir, `Simulado_${nome.replace(/\s+/g, "_")}_${mockEnvelopeId}.pdf`);
              await import_fs_extra.default.writeFile(destPath, pdfBuffer);
            } catch (e) {
            }
          }
          const mockEmailId = `mail_${Date.now()}`;
          const mockEmail = {
            id: mockEmailId,
            to: email,
            from: "DocuSign System <no-reply@docusign.net>",
            subject: "Assinatura Pendente: Termo de Entrega de Ativos de TI",
            body: `Ol\xE1 ${nome},

Sua assinatura \xE9 requisitada para o Termo de Entrega de Ativos de TI.

Por favor, clique no bot\xE3o "ASSINAR DIGITALMENTE" anexado a este e-mail no painel Outlook para preencher e validar a entrega dos seus equipamentos.

Atenciosamente,
Equipe de TI Cirion.`,
            sentAt: (/* @__PURE__ */ new Date()).toISOString(),
            read: false,
            exchangeId: exchange.id,
            attachment: true
          };
          try {
            const emails = await readEmailsFromFile();
            emails.push(mockEmail);
            await writeEmailsToFile(emails);
            console.log(`[DocuSign Node Engine] E-mail simulado criado no banco de dados local com ID: ${mockEmailId}`);
          } catch (localDbErr) {
            console.error("[DocuSign Node Engine] Erro ao salvar e-mail localmente:", localDbErr);
          }
          console.log("[DocuSign Node Engine] E-mail simulado pronto. Sincroniza\xE7\xE3o com o Firestore delegada ao cliente.");
          return res.json({
            envelope_id: mockEnvelopeId,
            status: "sent",
            message: "Enviado com sucesso (Modo de Simula\xE7\xE3o Ativo - Node.js nativo)",
            recipient: { name: nome, email },
            mockEmail
          });
        }
        let privateKey = privateKeyRaw.replace(/\\n/g, "\n").replace(/"/g, "").trim();
        if (!privateKey.includes("-----BEGIN RSA PRIVATE KEY-----")) {
          privateKey = `-----BEGIN RSA PRIVATE KEY-----
${privateKey}
-----END RSA PRIVATE KEY-----`;
        }
        console.log("[DocuSign Node Engine] Credenciais reais detectadas no .env. Gerando token JWT RS256...");
        const now = Math.floor(Date.now() / 1e3);
        const payload = {
          iss: clientId,
          sub: userId,
          aud: authServer,
          iat: now,
          exp: now + 3600,
          scope: "signature impersonation"
        };
        let jwtToken;
        try {
          jwtToken = import_jsonwebtoken.default.sign(payload, privateKey, { algorithm: "RS256" });
        } catch (jwtErr) {
          return res.status(400).json({
            error: `Erro ao assinar chave JWT RSA do DocuSign: ${jwtErr.message}. Verifique se sua DOCUSIGN_PRIVATE_KEY no arquivo .env \xE9 uma chave RSA privada v\xE1lida.`
          });
        }
        let accessToken;
        try {
          const tokenUrl = `https://${authServer}/oauth/token`;
          const tokenRes = await import_axios.default.post(
            tokenUrl,
            `grant_type=urn:ietf:params:oauth:grant-type:jwt-bearer&assertion=${jwtToken}`,
            {
              headers: {
                "Content-Type": "application/x-www-form-urlencoded"
              }
            }
          );
          accessToken = tokenRes.data.access_token;
        } catch (authErr) {
          if (authErr.response && authErr.response.status === 400 && authErr.response.data && JSON.stringify(authErr.response.data).includes("consent_required")) {
            const consentUrl = `https://${authServer}/oauth/auth?response_type=code&scope=signature%20impersonation&client_id=${clientId}&redirect_uri=http://localhost:3000`;
            return res.status(403).json({
              error: `[CONSENTIMENTO REQUERIDO] \xC9 necess\xE1rio consentir o acesso do aplicativo uma \xFAnica vez. Abra este link para consentir: ${consentUrl}`
            });
          }
          return res.status(401).json({
            error: `Falha na autentica\xE7\xE3o JWT do DocuSign: ${authErr.response?.data?.error_description || authErr.message}`
          });
        }
        console.log("[DocuSign Node Engine] Autentica\xE7\xE3o realizada. Enviado do envelope para assinatura...");
        const cleanPdfBase64 = pdfBase64.replace(/^data:application\/pdf;base64,/, "");
        const envelopePayload = {
          emailSubject: "Por favor, assine o Termo de Entrega de Ativos de TI - AssetFlow",
          emailBlurb: `Ol\xE1 ${nome},

Por favor, revise e assine o documento com as informa\xE7\xF5es dos seus ativos de TI.

Atenciosamente,
Equipe de TI Cirion.`,
          documents: [
            {
              documentBase64: cleanPdfBase64,
              name: `Termo_${nome.replace(/\s+/g, "_")}.pdf`,
              fileExtension: "pdf",
              documentId: "1"
            }
          ],
          recipients: {
            signers: [
              {
                email,
                name: nome,
                recipientId: "1",
                routingOrder: "1",
                tabs: {
                  signHereTabs: [
                    {
                      anchorString: "/sn1/",
                      anchorUnits: "pixels",
                      anchorXOffset: "0",
                      anchorYOffset: "-10",
                      recipientId: "1"
                    },
                    {
                      anchorString: "Assinatura do Colaborador",
                      anchorUnits: "pixels",
                      anchorXOffset: "10",
                      anchorYOffset: "-15",
                      recipientId: "1"
                    }
                  ]
                }
              }
            ]
          },
          status: "sent"
        };
        const createEnvelopeUrl = `${basePath}/v2.1/accounts/${accountId}/envelopes`;
        const envelopeRes = await import_axios.default.post(createEnvelopeUrl, envelopePayload, {
          headers: {
            "Authorization": `Bearer ${accessToken}`,
            "Content-Type": "application/json"
          }
        });
        const envelopeId = envelopeRes.data.envelopeId;
        try {
          await import_fs_extra.default.ensureDir(saveDirectory);
          const pdfBuffer = Buffer.from(cleanPdfBase64, "base64");
          const destPath = import_path.default.join(saveDirectory, `Enviado_${nome.replace(/\s+/g, "_")}_${envelopeId}.pdf`);
          await import_fs_extra.default.writeFile(destPath, pdfBuffer);
        } catch (saveErr) {
          try {
            const fallbackDir = "./Cartas_Firmadas_Local";
            await import_fs_extra.default.ensureDir(fallbackDir);
            const pdfBuffer = Buffer.from(cleanPdfBase64, "base64");
            const destPath = import_path.default.join(fallbackDir, `Enviado_${nome.replace(/\s+/g, "_")}_${envelopeId}.pdf`);
            await import_fs_extra.default.writeFile(destPath, pdfBuffer);
          } catch (e) {
          }
        }
        res.json({
          envelope_id: envelopeId,
          status: "sent",
          message: "Envelope enviado com sucesso para assinatura!",
          recipient: { name: nome, email }
        });
      } catch (error) {
        console.error("Erro na rota nativa do DocuSign:", error);
        res.status(500).json({ error: error.message || "Erro inesperado ao realizar integra\xE7\xE3o com o DocuSign." });
      }
    });
    app.post("/api/docusign/save-signed-pdf", authenticate, async (req, res) => {
      try {
        const { fileName, pdfBase64 } = req.body;
        if (!fileName || !pdfBase64) {
          return res.status(400).json({ error: "Nome do arquivo ou dados do PDF ausentes." });
        }
        const saveDirectory = process.env.DOCUSIGN_LOCAL_SAVE_PATH || "./Cartas_Firmadas_Local";
        console.log(`[DocuSign Backend] Solicitado salvamento do PDF final: ${fileName} em ${saveDirectory}`);
        const cleanPdfBase64 = pdfBase64.replace(/^data:application\/pdf;base64,/, "");
        const pdfBuffer = Buffer.from(cleanPdfBase64, "base64");
        await import_fs_extra.default.ensureDir(saveDirectory);
        const destPath = import_path.default.join(saveDirectory, fileName);
        await import_fs_extra.default.writeFile(destPath, pdfBuffer);
        console.log(`[DocuSign Backend] PDF salvo com sucesso em: ${destPath}`);
        res.json({
          status: "success",
          message: "PDF assinado salvo na pasta de destino local com sucesso!",
          path: destPath
        });
      } catch (error) {
        console.error("Erro ao salvar PDF assinado:", error);
        res.status(500).json({ error: error.message || "Erro ao salvar o PDF assinado localmente." });
      }
    });
    const isProd = process.env.NODE_ENV === "production" || !import_fs_extra.default.existsSync(import_path.default.join(__dirname_val, "server.ts"));
    console.log(`Modo de execu\xE7\xE3o: ${isProd ? "PRODU\xC7\xC3O" : "DESENVOLVIMENTO"}`);
    if (!isProd) {
      console.log("Iniciando Vite em modo middleware...");
      try {
        const { createServer: createViteServer } = await import("vite");
        const vite = await createViteServer({
          server: {
            middlewareMode: true,
            hmr: false
          },
          appType: "spa"
        });
        app.use(vite.middlewares);
        app.get("*all", async (req, res, next) => {
          if (req.originalUrl.startsWith("/api") || req.originalUrl.startsWith("/auth")) {
            return next();
          }
          try {
            let template = import_fs_extra.default.readFileSync(import_path.default.resolve(__dirname_val, "index.html"), "utf-8");
            template = await vite.transformIndexHtml(req.originalUrl, template);
            res.status(200).set({ "Content-Type": "text/html" }).end(template);
          } catch (e) {
            next(e);
          }
        });
      } catch (viteError) {
        console.error("ERRO AO INICIAR VITE:", viteError);
      }
    } else {
      console.log("Servindo arquivos est\xE1ticos...");
      const distPath = __dirname_val.endsWith("dist") ? __dirname_val : import_path.default.join(__dirname_val, "dist");
      console.log(`Caminho dos arquivos est\xE1ticos: ${distPath}`);
      app.use(import_express.default.static(distPath));
      app.get("*all", (req, res) => {
        const indexPath = import_path.default.join(distPath, "index.html");
        if (import_fs_extra.default.existsSync(indexPath)) {
          res.sendFile(indexPath);
        } else {
          res.status(404).send(`Erro: index.html n\xE3o encontrado em ${indexPath}`);
        }
      });
    }
    app.listen(PORT, "0.0.0.0", () => {
      console.log(`\u2705 Servidor pronto e ouvindo em http://0.0.0.0:${PORT}`);
    });
  } catch (err) {
    console.error("ERRO FATAL NO STARTUP:", err);
  }
}
console.log("Chamando startServer()...");
startServer();
//# sourceMappingURL=server.cjs.map
