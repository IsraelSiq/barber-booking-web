# 💈 Barber Booking Web

> **Interface web para sistema de agendamento de barbearia** — desenvolvida em React, consome a Barber Booking API com autenticação JWT e fluxo completo de agendamentos.

[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org)
[![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)](https://developer.mozilla.org/docs/Web/JavaScript)
[![Railway](https://img.shields.io/badge/Deploy-Railway-0B0D0E?style=for-the-badge&logo=railway&logoColor=white)](https://railway.app)
[![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)](LICENSE)

---

## 🌐 Demo ao Vivo

| Recurso | URL |
|---|---|
| 🚀 Aplicação Web | https://web-production-e3626.up.railway.app |
| 📚 API (Swagger) | https://web-production-e3626.up.railway.app/docs |

---

## 🧠 Sobre o Projeto

Front-end completo para gerenciamento de agendamentos de barbearia. O usuário pode criar conta, fazer login, visualizar horários disponíveis, agendar atendimentos e consultar ou cancelar seus agendamentos — tudo com uma interface limpa e responsiva.

Destaques técnicos:
- ⚛️ **React** — SPA com componentes reutilizáveis e estado centralizado
- 🚦 **React Router** — navegação client-side com rotas protegidas
- 🔐 **JWT** — token armazenado e enviado automaticamente nas requisições autenticadas
- 📡 **Fetch API** — integração com a [Barber Booking API](https://github.com/IsraelSiq/barber-booking-api)
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
| 📅 **Agendamento** | Seleção de data e horário disponível |
| 🗓️ **Meus Agendamentos** | Listagem e cancelamento dos agendamentos do usuário |

---

## 📁 Estrutura do Projeto

```
barber-booking-web/
├── public/
│   └── index.html
├── src/
│   ├── components/      # Componentes reutilizáveis
│   ├── pages/           # Telas da aplicação (Login, Cadastro, Agendamento...)
│   ├── services/        # Integração com a API (Fetch)
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
| **React Router v6** | Navegação e rotas protegidas |
| **Fetch API** | Requisições HTTP ao back-end |
| **CSS3** | Estilização e responsividade |
| **Railway** | Plataforma de deploy em nuvem |

---

## 🔗 Projetos Relacionados

- 🔧 **Back-end API:** [barber-booking-api](https://github.com/IsraelSiq/barber-booking-api) — REST API em FastAPI que alimenta este front-end

---

## 👨‍💻 Autor

**Israel Siqueira**  
Desenvolvedor Python | FastAPI | React  
[![GitHub](https://img.shields.io/badge/GitHub-IsraelSiq-181717?style=flat&logo=github)](https://github.com/IsraelSiq)
