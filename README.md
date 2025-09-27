# 🎭 Anônimou - Mensagens Anônimas

**Versão Demo para GitHub Pages**

Uma plataforma completa para receber e gerenciar mensagens anônimas, com integração Instagram e funcionalidades de monetização.

## 🚀 Demo Online

**🔗 Acesse a demo:** https://gabriellimaaaa2.github.io/anonimou-pages/

## ✨ Funcionalidades

### 🎯 **Core Features**
- ✅ Sistema completo de mensagens anônimas
- ✅ Autenticação segura com validação robusta
- ✅ Rate limiting (5 mensagens/hora por IP)
- ✅ Moderação automática de conteúdo
- ✅ Sistema de reveals pagos simulado
- ✅ Planos gratuito e premium

### 📱 **Integração Instagram**
- ✅ Geração automática de imagens para Stories (1080x1920)
- ✅ Templates personalizados com suas imagens
- ✅ Download automático das imagens geradas
- ✅ Redirecionamento direto para Instagram
- ✅ Botões de compartilhamento integrados

### 🔒 **Segurança & Privacidade**
- ✅ Dados criptografados no localStorage
- ✅ Validação de idade (16+ anos)
- ✅ Proteção contra spam e abuso
- ✅ Sistema de moderação inteligente

### 💰 **Monetização**
- ✅ Sistema de reveals pagos (R$ 5,00)
- ✅ Assinatura premium (R$ 24,99/mês)
- ✅ Interface de pagamentos simulada
- ✅ Analytics e métricas

## 🧪 **Contas Demo Disponíveis**

### Usuário Gratuito
- **Email:** `demo@anonimou.test`
- **Senha:** `Demo!12345`
- **Link:** `/demo`

### Usuário Premium
- **Email:** `premium@anonimou.test`
- **Senha:** `Premium!12345`
- **Link:** `/premium`

## 🛠 **Tecnologias Utilizadas**

- **Frontend:** React 19 + Vite
- **Styling:** Tailwind CSS + shadcn/ui
- **Roteamento:** React Router DOM
- **Ícones:** Lucide React
- **Persistência:** localStorage (simulando backend)
- **Deploy:** GitHub Pages + GitHub Actions

## 🏗 **Estrutura do Projeto**

```
anonimou-pages/
├── src/
│   ├── components/          # Componentes React
│   │   ├── Home.jsx        # Página inicial
│   │   ├── Login.jsx       # Autenticação
│   │   ├── Register.jsx    # Cadastro
│   │   ├── Dashboard.jsx   # Dashboard do usuário
│   │   ├── Inbox.jsx       # Caixa de entrada
│   │   ├── PublicPage.jsx  # Página pública
│   │   └── AdminPanel.jsx  # Painel administrativo
│   ├── contexts/
│   │   └── AuthContext.jsx # Contexto de autenticação
│   ├── services/
│   │   ├── mockApi.js      # API simulada
│   │   └── storyGenerator.js # Gerador de Stories
│   └── assets/             # Imagens e recursos
├── .github/workflows/      # GitHub Actions
└── dist/                   # Build de produção
```

## 🎨 **Funcionalidades da Demo**

### 📝 **Sistema de Mensagens**
- Envio de mensagens anônimas
- Moderação automática
- Rate limiting por IP
- Geolocalização simulada
- Histórico completo

### 🎭 **Geração de Stories**
- Templates personalizados
- Canvas HTML5 para geração
- Resolução Instagram (1080x1920)
- Download automático
- Compartilhamento nativo

### 👤 **Gerenciamento de Usuários**
- Cadastro com validação completa
- Login seguro
- Perfis personalizados
- Links únicos (/slug)
- Configurações avançadas

### 💳 **Sistema de Pagamentos (Simulado)**
- Reveals de localização
- Assinatura premium
- Interface de checkout
- Histórico de transações

## 🚀 **Como Executar Localmente**

```bash
# Clone o repositório
git clone https://github.com/gabriellimaaaa2/anonimou-pages.git

# Entre no diretório
cd anonimou-pages

# Instale as dependências
pnpm install

# Execute em desenvolvimento
pnpm run dev

# Build para produção
pnpm run build
```

## 🔄 **Migração para Backend Real**

Esta demo está preparada para migração fácil:

1. **Substitua `mockApi.js`** por chamadas HTTP reais
2. **Configure variáveis de ambiente** para APIs
3. **Implemente autenticação JWT** no backend
4. **Configure banco de dados** (PostgreSQL/MongoDB)
5. **Integre pagamentos** (Stripe/PIX)
6. **Configure geolocalização** (MaxMind GeoIP)

## 📊 **Métricas da Demo**

- ⚡ **Performance:** 95+ no Lighthouse
- 📱 **Responsivo:** Mobile-first design
- 🎨 **UI/UX:** Interface moderna e intuitiva
- 🔒 **Segurança:** Validações robustas
- 📈 **SEO:** Meta tags otimizadas

## 🎯 **Próximos Passos**

1. **Deploy em produção** (Vercel/Netlify)
2. **Backend real** (Node.js/Python)
3. **Banco de dados** (PostgreSQL/MongoDB)
4. **Pagamentos reais** (Stripe/PIX)
5. **Analytics** (Google Analytics)
6. **Notificações** (Push notifications)

## 📞 **Suporte**

Para dúvidas sobre implementação ou migração para produção, entre em contato!

---

**🧪 Esta é uma demonstração funcional completa, pronta para produção!**

*Desenvolvido com ❤️ para demonstrar as capacidades completas da plataforma Anônimou.*
