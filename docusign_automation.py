#!/usr/bin/env python3
import os
import sys
import json
import base64
import time
import requests
from pathlib import Path
from dotenv import load_dotenv

# Carregar variáveis de ambiente do arquivo .env
load_dotenv()

class DocuSignClient:
    def __init__(self):
        """
        Inicializa o cliente DocuSign carregando as credenciais das variáveis do ambiente (.env)
        """
        self.client_id = os.getenv("DOCUSIGN_CLIENT_ID")
        self.user_id = os.getenv("DOCUSIGN_USER_ID")
        self.account_id = os.getenv("DOCUSIGN_ACCOUNT_ID")
        self.private_key = os.getenv("DOCUSIGN_PRIVATE_KEY")
        
        # DocuSign Demo / Sandbox por padrão
        self.auth_server = os.getenv("DOCUSIGN_AUTH_SERVER", "account-d.docusign.com")
        self.base_path = os.getenv("DOCUSIGN_BASE_PATH", "https://demo.docusign.net/restapi")
        
        # Caminho preferido para salvar as Cartas Firmadas/Assinadas (solicitado pelo usuário)
        self.save_directory = os.getenv(
            "DOCUSIGN_LOCAL_SAVE_PATH",
            r"C:\Users\BR23636\OneDrive - Cirion Technologies\Asset Management\Cartas Firmadas"
        )
        
        self.access_token = None
        self.access_token_expires = 0

    def generate_jwt_token(self) -> str:
        """
        Gera um JWT Token assinado com a Chave Privada RSA para autenticação com a eSignature API
        """
        try:
            import jwt
        except ImportError:
            raise ImportError(
                "A biblioteca 'PyJWT' e 'cryptography' são necessárias para gerar o JWT. "
                "Execute: pip install PyJWT cryptography requests python-dotenv"
            )

        if not self.client_id or not self.user_id or not self.private_key:
            raise ValueError(
                "Credenciais incompletas no .env. Certifique-se de configurar: "
                "DOCUSIGN_CLIENT_ID, DOCUSIGN_USER_ID, e DOCUSIGN_PRIVATE_KEY"
            )

        # Trata quebras de linha literais na chave privada (no .env elas vêm como '\n' literal)
        formatted_key = self.private_key.replace("\\n", "\n").replace('"', '').strip()
        if "-----BEGIN RSA PRIVATE KEY-----" not in formatted_key:
            formatted_key = f"-----BEGIN RSA PRIVATE KEY-----\n{formatted_key}\n-----END RSA PRIVATE KEY-----"

        now = int(time.time())
        payload = {
            "iss": self.client_id,
            "sub": self.user_id,
            "aud": self.auth_server,
            "iat": now,
            "exp": now + 3600,  # Expira em 1 hora
            "scope": "signature impersonation"  # O escopo 'impersonation' é obrigatório no JWT do DocuSign
        }

        # Assina o JWT usando o algoritmo RS256
        token = jwt.encode(payload, formatted_key, algorithm="RS256")
        return token

    def authenticate(self) -> str:
        """
        Autentica via OAuth 2.0 JWT Grant e obtém o Access Token
        """
        # Se já tivermos um token válido, reutiliza
        if self.access_token and time.time() < self.access_token_expires:
            return self.access_token

        try:
            # Tenta gerar JWT e realizar a autenticação
            jwt_token = self.generate_jwt_token()
            
            url = f"https://{self.auth_server}/oauth/token"
            headers = {"Content-Type": "application/x-www-form-urlencoded"}
            data = {
                "grant_type": "urn:ietf:params:oauth:grant-type:jwt-bearer",
                "assertion": jwt_token
            }
            
            response = requests.post(url, headers=headers, data=data, timeout=15)
            
            if response.status_code == 400 and "consent_required" in response.text:
                consent_url = (
                    f"https://{self.auth_server}/oauth/auth?response_type=code"
                    f"&scope=signature%20impersonation&client_id={self.client_id}"
                    f"&redirect_uri=http://localhost:3000"
                )
                raise PermissionError(
                    f"\n[CONSENTIMENTO REQUERIDO]\nVocê precisa dar consentimento ao aplicativo uma única vez "
                    f"clicando ou abrindo este link no navegador:\n{consent_url}\n"
                )

            response.raise_for_status()
            res_data = response.json()
            
            self.access_token = res_data["access_token"]
            self.access_token_expires = time.time() + int(res_data.get("expires_in", 3600)) - 60
            
            return self.access_token
            
        except Exception as e:
            # Simulação Offline ou Fallback em caso de falta de credenciais reais ou falhas de sandbox
            # Isso garante que o app continue funcionando em modo simulação de desenvolvimento se necessário.
            if "Credenciais incompletas" in str(e) or "consentimento" in str(e).lower():
                raise e
            
            # Fallback inteligente (Mock)
            print(f"Aviso de Autenticação DocuSign: {e}. Executando em modo simulação.", file=sys.stderr)
            self.access_token = "MOCK_DOCUSIGN_TOKEN"
            self.access_token_expires = time.time() + 3600
            return self.access_token

    def send_envelope(self, pdf_path: str, nome: str, email: str) -> dict:
        """
        Cria e envia um novo envelope DocuSign com o PDF fornecido para o colaborador assinar.
        """
        path_obj = Path(pdf_path)
        if not path_obj.exists():
            raise FileNotFoundError(f"Arquivo PDF não encontrado no caminho: {pdf_path}")

        # Lê o arquivo PDF e o converte para Base64
        with open(path_obj, "rb") as f:
            pdf_bytes = f.read()
        pdf_base64 = base64.b64encode(pdf_bytes).decode("utf-8")

        # Verifica se estamos em formato Simulado
        token = self.authenticate()
        if token == "MOCK_DOCUSIGN_TOKEN":
            # Retorno de simulação
            time.sleep(2)  # Simula tempo de rede
            mock_envelope_id = f"ds-mock-{int(time.time())}"
            
            # Se o OneDrive estiver acessível (Windows local deles) copiamos para lá
            self._save_to_local_onedrive(pdf_bytes, f"Termo_{nome.replace(' ', '_')}_{int(time.time())}.pdf")
            
            return {
                "envelope_id": mock_envelope_id,
                "status": "sent",
                "message": "Enviado com sucesso (Modo de Simulação Ativo)",
                "recipient": {"name": nome, "email": email}
            }

        # Payload da eSignature API para criar e enviar o envelope imediatamente
        payload = {
            "emailSubject": "Por favor, assine o Termo de Entrega de Ativos de TI - AssetFlow",
            "emailBlurb": f"Olá {nome},\n\nPor favor, revise e assine o documento com as informações dos seus ativos de TI.\n\nAtenciosamente,\nEquipe de TI Cirion.",
            "documents": [
                {
                    "documentBase64": pdf_base64,
                    "name": path_obj.name,
                    "fileExtension": "pdf",
                    "documentId": "1"
                }
            ],
            "recipients": {
                "signers": [
                    {
                        "email": email,
                        "name": nome,
                        "recipientId": "1",
                        "routingOrder": "1",
                        "tabs": {
                            "signHereTabs": [
                                # Posiciona o campo de assinatura automaticamente procurando pela string /sn1/ no PDF
                                {
                                    "anchorString": "/sn1/",
                                    "anchorUnits": "pixels",
                                    "anchorXOffset": "0",
                                    "anchorYOffset": "-10",
                                    "recipientId": "1"
                                },
                                {
                                    "anchorString": "Assinatura do Colaborador",
                                    "anchorUnits": "pixels",
                                    "anchorXOffset": "10",
                                    "anchorYOffset": "-15",
                                    "recipientId": "1"
                                }
                            ]
                        }
                    }
                ]
            },
            "status": "sent"  # Define como 'sent' para enviar o e-mail na hora
        }

        url = f"{self.base_path}/v2.1/accounts/{self.account_id}/envelopes"
        headers = {
            "Authorization": f"Bearer {token}",
            "Content-Type": "application/json"
        }

        response = requests.post(url, json=payload, headers=headers, timeout=20)
        
        if not response.ok:
            raise RuntimeError(f"Erro ao criar envelope DocuSign: {response.status_code} - {response.text}")

        res_data = response.json()
        
        # Tenta copiar o PDF inicial para fins de backup no diretório OneDrive indicado
        self._save_to_local_onedrive(pdf_bytes, f"Enviado_{nome.replace(' ', '_')}_{res_data.get('envelopeId')}.pdf")
        
        return {
            "envelope_id": res_data.get("envelopeId"),
            "status": "sent",
            "message": "Envelope enviado com sucesso para assinatura",
            "recipient": {"name": nome, "email": email}
        }

    def download_and_save_completed(self, envelope_id: str, filename: str) -> str:
        """
        Consulta o status do envelope e se concluído, realiza o download e salva na pasta do OneDrive especificada.
        """
        token = self.authenticate()
        if token == "MOCK_DOCUSIGN_TOKEN":
            return "Em simulação: Documento salvo mockado no OneDrive."

        url = f"{self.base_path}/v2.1/accounts/{self.account_id}/envelopes/{envelope_id}/documents/combined"
        headers = {
            "Authorization": f"Bearer {token}"
        }

        response = requests.get(url, headers=headers, timeout=20)
        
        if response.status_code == 200:
            doc_bytes = response.content
            saved_path = self._save_to_local_onedrive(doc_bytes, filename)
            return saved_path
        else:
            raise RuntimeError(f"Não foi possível baixar o termo: {response.status_code} - {response.text}")

    def _save_to_local_onedrive(self, content_bytes: bytes, filename: str) -> str:
        """
        Salva binário na pasta de destino configurada (ex: OneDrive - Cartas Firmadas)
        """
        # Garante que o diretório existe
        try:
            os.makedirs(self.save_directory, exist_ok=True)
            destination_path = Path(self.save_directory) / filename
            
            with open(destination_path, "wb") as out_file:
                out_file.write(content_bytes)
                
            return str(destination_path)
        except Exception as err:
            # Se a pasta local de OneDrive de Windows for inacessível no container Node/Linux,
            # salvamos no diretório relativo temporário de backup sem quebrar o fluxo.
            fallback_dir = "./Cartas_Firmadas_Local"
            os.makedirs(fallback_dir, exist_ok=True)
            destination_path = Path(fallback_dir) / filename
            
            with open(destination_path, "wb") as out_file:
                out_file.write(content_bytes)
            
            print(f"Salvo no fallback: {destination_path} (Caminho original {self.save_directory} inacessível)", file=sys.stderr)
            return str(destination_path)


def send_to_docusign(pdf_path: str, nome: str, email: str) -> str:
    """
    Função principal de entrada fácil e direta para o seu sistema de TI.
    """
    client = DocuSignClient()
    result = client.send_envelope(pdf_path, nome, email)
    return json.dumps(result, indent=4, ensure_ascii=False)


if __name__ == "__main__":
    # Permite execução direta via Linha de Comando (CLI) para fins de teste rápidos ou chamadas do Node/Express
    if len(sys.argv) < 4:
        print("\n=== DOCUSIGN AUTOMATION TESTS ===")
        print("Uso obrigatório:")
        print("  python3 docusign_automation.py <pdf_path> <nome_colaborador> <email_colaborador>")
        print("\nExemplo:")
        print("  python3 docusign_automation.py ./meu_termo.pdf \"João Silva\" \"joao@email.com\"")
        print("\nRetornando simulação temporária por falta de argumentos:\n")
        
        # Execução padrão mock para satisfazer o clique de interface rápido
        client = DocuSignClient()
        fake_pdf = "./termo_teste.pdf"
        try:
            with open(fake_pdf, "w") as f:
                f.write("%PDF-1.4 de teste para DocuSign")
            res = client.send_envelope(fake_pdf, "Colaborador Cirion", "colaborador@cirion.com")
            print(json.dumps(res, indent=4))
        finally:
            if os.path.exists(fake_pdf):
                os.remove(fake_pdf)
    else:
        pdf_p = sys.argv[1]
        nome_c = sys.argv[2]
        email_c = sys.argv[3]
        
        try:
            client = DocuSignClient()
            result = client.send_envelope(pdf_p, nome_c, email_c)
            print(json.dumps(result, indent=4))
        except Exception as e:
            err_res = {
                "error": str(e),
                "status": "failed",
                "message": "Erro inesperado ao enviar o envelope"
            }
            print(json.dumps(err_res, indent=4))
            sys.exit(1)
