# 💈 Barber Booking Web

> **Interface web para sistema de agendamento de barbearia** — desenvolvida em React + Chakra UI, com autenticação JWT, login com Google, painel administrativo e fluxo completo de agendamentos.

[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org)
[![Chakra UI](https://img.shields.io/badge/Chakra_UI-319795?style=for-the-badge&logo=chakraui&logoColor=white)](https://chakra-ui.com)
[![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)](https://developer.mozilla.org/docs/Web/JavaScript)
[![Vercel](https://img.shields.io/badge/Deploy-Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://vercel.com)
[![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)](LICENSE)

---

## 🌐 Demo ao Vivo

| Recurso | URL |
|---|---|
| 🚀 Aplicação Web | https://barber-booking-web.vercel.app |
| 📚 API (Swagger) | https://barber-booking-api.up.railway.app/docs |

---

## 🧠 Sobre o Projeto

Front-end completo para gerenciamento de agendamentos de barbearia. O cliente pode criar conta, fazer login (email/senha ou Google), visualizar horários disponíveis, agendar atendimentos e consultar ou cancelar seus agendamentos. O administrador possui painel exclusivo para gerenciar agenda, clientes e configurações — tudo com interface dark moderna e responsiva.

Destaques técnicos:
- ⚛️ **React 18** — SPA com componentes reutilizáveis
- 🎨 **Chakra UI** — design system com tema dark customizado e tokens de cor
- 🚦 **React Router v6** — navegação client-side com rotas protegidas por role
- 🔐 **JWT** — token armazenado e enviado automaticamente nas requisições
- 🐈 **Login com Google** — OAuth2 via `@react-oauth/google`
- 📧 **Recuperação de senha** — fluxo completo via email (Resend)
- 👑 **Painel Admin** — gerenciamento de agenda, clientes e agendamentos
- 📱 **Design responsivo** — adaptado para mobile e desktop

---

## 🚀 Rodando Localmente

```bash
# 1. Clone o repositório
git clone https://github.com/IsraelSiq/barber-booking-web.git
cd barber-booking-web

# 2. Instale as dependências
npm install

# 3. Inicie o servidor de desenvolvimento
npm start
```

✅ Aplicação disponível em: **http://localhost:3000**

> ⚠️ Certifique-se de que a [Barber Booking API](https://github.com/IsraelSiq/barber-booking-api) esteja rodando antes de iniciar o front-end localmente.

---

## 🖼️ Telas da Aplicação

| Tela | Descrição |
|---|---|
| 🔐 **Login** | Email/senha + botão "Entrar com Google" |
| 📝 **Cadastro** | Formulário + botão "Cadastrar com Google" |
| 🏠 **Início** | Dashboard do cliente com boas-vindas e ações rápidas |
| 📅 **Agendamento** | Seleção de data, serviço e horário disponível |
| 🗓️ **Meus Agendamentos** | Listagem e cancelamento dos agendamentos |
| 👤 **Perfil** | Visualização e edição dos dados pessoais |
| 🔑 **Esqueci minha senha** | Solicitação de redefinição via email |
| 🔒 **Redefinir Senha** | Criação de nova senha via link seguro |
| 👑 **Painel Admin** | Gestão completa de agenda, clientes e agendamentos |

---

## 📁 Estrutura do Projeto

```
barber-booking-web/
├── public/
│   └── index.html
├── src/
│   ├── assets/          # Imagens e logos
│   ├── components/      # Componentes reutilizáveis (Navbar, Cards, etc.)
│   ├── pages/
│   │   ├── Login.js
│   │   ├── Cadastro.js
│   │   ├── Inicio.js
│   │   ├── Agendamento.js
│   │   ├── MeusAgendamentos.js
│   │   ├── Perfil.js
│   │   ├── ForgotPassword.js
│   │   ├── ResetPassword.js
│   │   ├── RedefinirSenha.js
│   │   └── Barbeiro.js      # Painel Admin
│   ├── api.js           # Camada de integração com a API
│   ├── App.js           # Rotas e estrutura principal
│   └── index.js         # Entrypoint React + GoogleOAuthProvider
├── package.json
└── README.md
```

---

## 🛠️ Stack Tecnológica

| Tecnologia | Função |
|---|---|
| **React 18** | Biblioteca de interface (SPA) |
| **JavaScript (ES6+)** | Linguagem principal |
| **Chakra UI** | Design system — componentes e tema dark customizado |
| **React Router v6** | Navegação e rotas protegidas por role |
| **@react-oauth/google** | Login com Google (OAuth2) |
| **Fetch API** | Requisições HTTP ao back-end |
| **Vercel** | Plataforma de deploy do front-end |

---

## 🔧 Variáveis de Ambiente

Nenhuma variável de ambiente é necessária no front-end. O Google Client ID está configurado diretamente no `index.js`.

> 💡 Para trocar o ambiente da API, edite a `BASE_URL` em `src/api.js`.

---

## 🔗 Projetos Relacionados

- 🔧 **Back-end API:** [barber-booking-api](https://github.com/IsraelSiq/barber-booking-api) — REST API em FastAPI que alimenta este front-end

---

## 👨‍💻 Autor

**Israel Siqueira**  
Desenvolvedor Python | FastAPI | React  
[![GitHub](https://img.shields.io/badge/GitHub-IsraelSiq-181717?style=flat&logo=github)](https://github.com/IsraelSiq)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-Israel_Siqueira-0077B5?style=flat&logo=linkedin)](https://linkedin.com/in/IsraelSiq)
