# Site B2B — Católica SC

Sistema interno para apresentar os programas da Católica SC (Legado, Pós Co. MBA, In-Company, UC by CatólicaSC, Diagnóstico e Exclusive), com personalização automática por cliente (nome, cores, logo) e uma área administrativa para cadastrar clientes e editar o conteúdo público de cada página.

O site inteiro fica protegido por login — só quem tiver usuário e senha consegue acessar.

## Como o sistema funciona

- **Página inicial e páginas de programa**: mostram o conteúdo institucional, a não ser que um cliente esteja "ativado" no navegador de quem está usando — nesse caso, nome/cores/logo mudam para os daquele cliente. A página **Católica Exclusive** é sempre fixa (dourado/escuro), nunca muda com o cliente ativo.
- **⚙ no canto superior direito**: leva à área administrativa (`/admin`), com quatro abas:
  - **Clientes** — cadastrar/editar/excluir empresas, subir logo (as cores são extraídas automaticamente da imagem), ativar um cliente para pré-visualizar o site personalizado.
  - **Página inicial** — editar o título, texto de apoio e selo da home institucional (o texto genérico exibido quando nenhum cliente específico está ativo).
  - **Conteúdo dos programas** — editar nome, selo, textos e chamada final de cada um dos 6 programas.
  - **Configurações** — número de WhatsApp usado nos botões de contato.
- **Login**: usuário e senha únicos, configurados nas variáveis de ambiente do servidor (não precisa mexer em código para trocar a senha — só editar a variável no Render, explicado abaixo).

Tudo isso já vem funcionando e testado. O que falta é só colocar no ar — os passos abaixo mostram exatamente onde clicar.

---

## Passo a passo para publicar (Turso + Render)

Você vai precisar de duas contas gratuitas: **Turso** (banco de dados) e **Render** (hospedagem do site). O código já está no GitHub, em `lucasbj96/SiteB2B`.

### 1. Criar o banco de dados no Turso

1. Acesse **https://turso.tech** e crie uma conta (pode entrar com GitHub).
2. No painel, clique em **Create Database** (ou "New Database").
3. Dê um nome (ex.: `catolica-sitebd`) e escolha a região mais próxima (ex.: São Paulo/`gru`, se disponível).
4. Depois de criado, abra o banco e procure por duas informações — geralmente em um botão **"Connect"** ou na aba de detalhes do banco:
   - **Database URL** — começa com `libsql://...`
   - **Auth Token** — clique em algo como **"Create Token"** / **"Generate Token"** e copie o token gerado (é uma string longa).
5. Guarde essas duas informações — você vai colar no Render no passo 3.

### 2. Confirmar que o código está no GitHub

O código já foi enviado para **https://github.com/lucasbj96/SiteB2B**. Não precisa fazer nada aqui, a não ser confirmar que o repositório existe e está com os arquivos.

### 3. Criar o serviço no Render

1. Acesse **https://render.com** e crie uma conta (pode entrar com GitHub — isso já facilita a conexão do repositório).
2. No painel, clique em **New +** → **Web Service**.
3. Selecione o repositório **lucasbj96/SiteB2B** (autorize o Render a acessar o GitHub, se pedir).
4. Preencha as configurações do serviço:
   - **Name**: escolha um nome (ex.: `catolica-sitebd`) — isso vira parte do endereço do site.
   - **Root Directory**: `webapp` (⚠️ importante — o projeto está dentro dessa subpasta do repositório)
   - **Runtime**: `Node`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm run start`
   - **Instance Type**: o plano gratuito ("Free") funciona para começar.
5. Antes de clicar em criar, role até **Environment Variables** e adicione, uma por uma (botão **Add Environment Variable**):

   | Key | Value |
   |---|---|
   | `TURSO_DATABASE_URL` | a URL que você copiou do Turso (começa com `libsql://`) |
   | `TURSO_AUTH_TOKEN` | o token que você copiou do Turso |
   | `ADMIN_USERNAME` | o usuário que você quer usar para entrar no site |
   | `ADMIN_PASSWORD` | `Lcatolica2026%` (ou outra senha de sua escolha) |
   | `SESSION_SECRET` | qualquer texto longo e aleatório (ex.: gere um em https://www.uuidgenerator.net/ e cole aqui) |

6. Clique em **Create Web Service**. O Render vai instalar as dependências e publicar o site — leva alguns minutos na primeira vez.
7. Quando o status ficar **"Live"**, o Render mostra o endereço do site no topo da página (algo como `https://catolica-sitebd.onrender.com`). Esse é o link para acessar o sistema.

### 4. Primeiro acesso

1. Abra o link do Render.
2. Você cai direto na tela de login — entre com o **usuário** e **senha** que você definiu no passo 3.
3. Pronto: a home já aparece com o conteúdo institucional padrão, e um cliente "Católica SC (padrão)" já vem pré-cadastrado nas cores oficiais (bordô).

> Nota sobre o plano gratuito do Render: ele "dorme" depois de um tempo sem acesso e demora ~30 segundos para acordar no próximo acesso. Se isso incomodar no dia a dia comercial, dá para trocar para um plano pago (Starter) depois, sem precisar mexer em nada além do plano no painel do Render.

---

## Como alterar depois (sem programar)

- **Trocar a senha de acesso**: no Render, vá em **Environment** → edite `ADMIN_PASSWORD` → salve. O site reinicia sozinho com a nova senha.
- **Trocar o número de WhatsApp**: dentro do próprio site, em **⚙ → Configurações**.
- **Editar textos da home ou dos programas**: **⚙ → Página inicial** ou **⚙ → Conteúdo dos programas**.
- **Cadastrar um cliente novo**: **⚙ → Clientes → Novo cliente**, sobe o logo, confirma as cores, salva.

## Rodando localmente (opcional, para quem for mexer no código)

```bash
cd webapp
cp .env.example .env.local   # preencha os valores
npm install
npm run dev
```

Abra `http://localhost:3000`.
