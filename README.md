# 💈 Barber Booking Web

> **Interface web para sistema de agendamento de barbearia** — desenvolvida em React + Chakra UI, consome a Barber Booking API com autenticação JWT e fluxo completo de agendamentos, painel administrativo e recuperação de senha.

[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org)
[![Chakra UI](https://img.shields.io/badge/Chakra_UI-319795?style=for-the-badge&logo=chakraui&logoColor=white)](https://chakra-ui.com)
[![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)](https://developer.mozilla.org/docs/Web/JavaScript)
[![Railway](https://img.shields.io/badge/Deploy-Railway-0B0D0E?style=for-the-badge&logo=railway&logoColor=white)](https://railway.app)
[![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)](LICENSE)

---

## 🌐 Demo ao Vivo

| Recurso | URL |
|---|---|
| 🚀 Aplicação Web | https://web-production-e3626.up.railway.app |
| 📚 API (Swagger) | https://barber-booking-api.up.railway.app/docs |

---

## 🧠 Sobre o Projeto

Front-end completo para gerenciamento de agendamentos de barbearia. O cliente pode criar conta, fazer login, visualizar horários disponíveis, agendar atendimentos e consultar ou cancelar seus agendamentos. O administrador possui painel exclusivo para gerenciar agenda, clientes e configurações do sistema — tudo com uma interface dark moderna e responsiva.

Destaques técnicos:
- ⚛️ **React 18** — SPA com componentes reutilizáveis e estado centralizado
- 🎨 **Chakra UI** — design system com tema dark customizado e tokens de cor
- 🚦 **React Router v6** — navegação client-side com rotas protegidas por role
- 🔐 **JWT** — token armazenado e enviado automaticamente nas requisições autenticadas
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
| 🔐 **Login** | Autenticação com e-mail e senha, gera token JWT |
| 📝 **Cadastro** | Criação de conta de novo cliente |
| 🏠 **Início** | Dashboard do cliente com boas-vindas e ações rápidas |
| 📅 **Agendamento** | Seleção de data, serviço e horário disponível |
| 🗓️ **Meus Agendamentos** | Listagem e cancelamento dos agendamentos do usuário |
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
│   ├── components/      # Componentes reutilizáveis (Navbar, Cards, etc.)
│   ├── pages/           # Telas da aplicação
│   │   ├── Login.js
│   │   ├── Cadastro.js
│   │   ├── Inicio.js
│   │   ├── Agendamento.js
│   │   ├── MeusAgendamentos.js
│   │   ├── Perfil.js
│   │   ├── ForgotPassword.js
│   │   ├── ResetPassword.js
│   │   ├── RedefinirSenha.js
│   │   └── Barbeiro.js  # Painel Admin
│   ├── api.js           # Camada de integração com a API (Fetch)
│   ├── App.js           # Rotas e estrutura principal
│   └── index.js         # Entrypoint React
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
| **React Router v6** | Navegação e rotas protegidas por role (admin/cliente) |
| **Fetch API** | Requisições HTTP ao back-end |
| **Railway** | Plataforma de deploy em nuvem |

---

## 🔗 Projetos Relacionados

- 🔧 **Back-end API:** [barber-booking-api](https://github.com/IsraelSiq/barber-booking-api) — REST API em FastAPI que alimenta este front-end

---

## 👨‍💻 Autor

**Israel Siqueira**  
Desenvolvedor Python | FastAPI | React  
[![GitHub](https://img.shields.io/badge/GitHub-IsraelSiq-181717?style=flat&logo=github)](https://github.com/IsraelSiq)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-Israel_Siqueira-0077B5?style=flat&logo=linkedin)](https://linkedin.com/in/IsraelSiq)
