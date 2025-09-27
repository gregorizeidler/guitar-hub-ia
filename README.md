# 🎸 Hub do Guitarrista

**A plataforma mais avançada para guitarristas do Brasil!** 🇧🇷

Hub inteligente e completo onde a Inteligência Artificial atua como seu consultor pessoal. Centralizamos descoberta de timbres, montagem de pedalboards, marketplace de equipamentos, análise de áudio e export para DAWs profissionais.

## 🚀 Funcionalidades Avançadas

### ✅ **Implementado - Versão Completa**
- **🤖 Consultor IA com OpenAI**: GPT-4 real com memória persistente e recomendações contextuais
- **🎛️ Pedalboard Builder**: Drag & drop com simulação de áudio em tempo real
- **🎵 Upload e Análise de Áudio**: Análise automática de BPM, gênero, mood e características espectrais
- **🔌 Export VST/AU**: Geração de projetos para Ableton, Logic, Cubase, REAPER e Pro Tools
- **🛒 Marketplace Inteligente**: Filtros avançados e sistema de avaliações
- **👥 Comunidade Ativa**: Compartilhamento de rigs com áudios e importação direta
- **🔊 Sistema de Áudio Avançado**: WebAudio API + Tone.js com efeitos em tempo real
- **🔐 Autenticação Completa**: Supabase Auth com Google OAuth
- **💾 Memória Persistente**: IA que aprende e lembra das suas preferências

### 🎯 **Diferenciais Únicos**
- **IA que Realmente Entende**: Análise de áudio + recomendações personalizadas
- **Export Profissional**: Projetos prontos para sua DAW favorita
- **Análise Espectral**: Detecção automática de características musicais
- **Integração Total**: Tudo conectado em uma única plataforma

## 🛠️ Stack Tecnológica

### **Frontend Moderno**
- **Next.js 14**: Framework React com App Router e SSR
- **TypeScript**: Tipagem robusta e desenvolvimento seguro
- **Tailwind CSS**: Design system responsivo e moderno
- **Framer Motion**: Animações fluidas e interativas

### **Backend Poderoso**
- **Supabase**: PostgreSQL + Auth + Storage + Real-time
- **Prisma**: ORM type-safe para banco de dados
- **OpenAI GPT-4**: IA conversacional avançada
- **WebAudio API + Tone.js**: Processamento de áudio em tempo real

### **Funcionalidades Avançadas**
- **@dnd-kit**: Drag & drop acessível e performático
- **React Hot Toast**: Notificações elegantes
- **Lucide Icons**: Ícones modernos e consistentes
- **Zustand**: Gerenciamento de estado simples e eficaz

## 📦 Instalação

1. Clone o repositório:
```bash
git clone <repository-url>
cd guitar-hub
```

2. Instale as dependências:
```bash
npm install
```

3. Configure as variáveis de ambiente:
```bash
cp .env.example .env.local
```

Edite `.env.local` com suas credenciais:
```env
# OpenAI (OBRIGATÓRIO para IA funcionar)
OPENAI_API_KEY="sk-your-openai-api-key-here"

# Supabase (OBRIGATÓRIO para auth e storage)
NEXT_PUBLIC_SUPABASE_URL="https://your-project.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your-supabase-anon-key"
SUPABASE_SERVICE_ROLE_KEY="your-supabase-service-role-key"

# Database (Opcional - usa Supabase por padrão)
DATABASE_URL="postgresql://postgres:password@db.your-project.supabase.co:5432/postgres"

# Next.js
NEXTAUTH_SECRET="your-random-secret-key"
NEXTAUTH_URL="http://localhost:3000"
```

### 🔑 **Como Obter as Chaves:**

**OpenAI API Key:**
1. Acesse [platform.openai.com](https://platform.openai.com)
2. Crie uma conta e vá em "API Keys"
3. Gere uma nova chave secreta
4. ⚠️ **Importante**: Adicione créditos na sua conta OpenAI

**Supabase:**
1. Acesse [supabase.com](https://supabase.com)
2. Crie um novo projeto
3. Vá em Settings > API
4. Copie a URL e as chaves anon/service_role
5. Configure o Storage bucket "audio-clips" (público)

4. Configure o banco de dados:
```bash
npx prisma migrate dev
npx prisma generate
```

5. Execute o projeto:
```bash
npm run dev
```

## 🗄️ Estrutura do Banco de Dados

### Principais Tabelas
- **users**: Perfis de usuários com preferências musicais
- **gear**: Catálogo de equipamentos (guitarras, amps, pedais)
- **rigs**: Configurações de equipamentos dos usuários
- **signal_chains**: Ordem e configurações dos pedais
- **listings**: Anúncios do marketplace
- **reviews**: Avaliações de equipamentos
- **chat_sessions**: Histórico de conversas com IA

## 🎯 Público-Alvo

- **Iniciantes**: Que querem montar o primeiro setup
- **Intermediários**: Que querem otimizar timbre para ensaio ou igreja
- **Avançados/Profissionais**: Que buscam gear novo e simuladores
- **Luthiers e Lojas**: Que querem alcançar mais clientes

## 💰 Modelo de Monetização

- **Freemium**: Acesso básico ao consultor e pedalboard
- **Premium** (R$19–39/mês): IA ilimitada, marketplace protegido, export VST
- **Taxa de marketplace**: 5–8% por transação
- **Afiliados**: Links de lojas parceiras
- **Patrocínios**: Marcas em rigs e coleções

## 🛣️ Roadmap

### ✅ **Fase 1 - MVP Completo** 
- ✅ Consultor IA com OpenAI GPT-4
- ✅ Pedalboard builder com simulação
- ✅ Upload e análise de áudio
- ✅ Export VST para 5 DAWs
- ✅ Marketplace inteligente
- ✅ Sistema de autenticação
- ✅ Comunidade ativa

### 🚧 **Fase 2 - Expansão** (Próximos 6 meses)

#### 🎵 **Integração Musical** (Prioridade Alta)
- 🔄 **Spotify Integration**: Análise automática de faixas do Spotify
- 🔄 **YouTube Integration**: "Quero o som desse vídeo" → recomendações
- 🔄 **Voice Commands**: Controle por voz da pedalboard

#### 💰 **Monetização**
- 🔄 **Sistema de Pagamentos**: Stripe + PIX para marketplace
- 🔄 **Planos Premium**: IA ilimitada, export VST, análises avançadas
- 🔄 **Afiliados**: Comissões por vendas direcionadas

#### 🎮 **Engajamento**
- 🔄 **Guitar Hero Mode**: Desafios e ranking de precisão
- 🔄 **Learning from Community**: IA aprende com setups populares
- 🔄 **Mobile App**: React Native para iOS/Android

#### 🛒 **Marketplace Avançado**
- 🔄 **Verificação de Sellers**: Sistema de confiança
- 🔄 **Biblioteca de IRs**: Impulse responses da comunidade
- 🔄 **White Label**: Versões para lojas parceiras

### 🔮 **Fase 3 - Inovação Avançada** (Futuro)

#### 🎵 **IA & Análise Musical**
- 🎯 **Guitar Tone Matcher**: Upload uma música, IA identifica timbre e sugere setup completo
- 🎯 **Spotify/YouTube Integration**: "Quero o som dessa música" → análise automática de faixas
- 🎯 **Voice Commands**: Controle por voz - "Adiciona um delay de 300ms"
- 🎯 **Learning from Community**: IA aprende com setups mais curtidos (1000+ guitarristas)
- 🎯 **Predictive Analytics**: "Usuários com seu perfil também compraram..."
- 🎯 **Context-Aware**: Recomendações baseadas em hora, clima, localização

#### 🎮 **Gamificação & Social**
- 🎯 **Guitar Hero Mode**: Desafios semanais "Recrie o som do Slash"
- 🎯 **Collaborative Rigs**: Múltiplos usuários editam o mesmo rig em tempo real
- 🎯 **Virtual Jam Sessions**: Salas de ensaio virtuais com sync de pedalboards
- 🎯 **Ranking System**: Badges por conquistas e precisão de timbres

#### 💰 **Monetização B2B**
- 🎯 **White Label para Lojas**: Versões customizadas para Casa do Músico, etc.
- 🎯 **Guitar Academy**: Cursos integrados - "Aprenda blues com setup do BB King"
- 🎯 **Artist Partnerships**: Setups oficiais de CPM 22, Charlie Brown Jr, etc.
- 🎯 **Hardware Integration**: Controle direto de pedaleiras Boss, Line 6, etc.

#### 🌍 **Expansão Internacional**
- 🎯 **Multi-Currency**: Preços automáticos por região (Argentina, México)
- 🎯 **Regional Partnerships**: Parcerias com lojas internacionais
- 🎯 **Localized Content**: Artistas e estilos por país

#### 🔮 **Tecnologias Futuras**
- 🎯 **AR/VR Experience**: Visualize pedalboard em realidade aumentada
- 🎯 **AI Music Generation**: Gera música baseada no seu rig
- 🎯 **Genetic Algorithm**: Evolução de setups baseada em feedback
- 🎯 **Neural Audio Processing**: IA própria para análise de timbre
- 🎯 **Blockchain Marketplace**: NFTs de setups únicos de artistas

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 🎸 Como Usar

### 🤖 **Consultor IA Inteligente**
```
IA: "Olá! Sou seu consultor pessoal. Quanto você tem para investir?"
Você: "Tenho R$ 2.500 para tocar na igreja"
IA: "Perfeito! Para igreja, recomendo som limpo e cristalino. Que estilos você toca?"
Você: "Worship e pop rock"
IA: "Baseado no seu perfil, criei 3 opções de setup..."
```
**Resultado**: Recomendações personalizadas com preços reais e justificativas técnicas!

### 🎵 **Upload e Análise de Áudio**
1. **Arraste** seu arquivo de áudio (MP3, WAV, etc.)
2. **Análise Automática**: BPM, gênero, mood detectados
3. **Recomendações IA**: Equipamentos para recriar o som
4. **Integração**: Importa sugestões direto no pedalboard

### 🎛️ **Pedalboard Builder Avançado**
1. **Drag & Drop**: Arraste pedais para a cadeia
2. **Simulação Real**: Ouça os efeitos em tempo real
3. **Configuração**: Ajuste parâmetros com precisão
4. **Export VST**: Gere projeto para sua DAW favorita

### 🔌 **Export Profissional para DAWs**
1. **Monte** sua pedalboard ideal
2. **Clique** em "Export VST"
3. **Escolha** sua DAW (Ableton, Logic, Cubase, etc.)
4. **Download**: Projeto pronto com plugins mapeados!

## 📊 **Fluxogramas do Sistema**

### 🎸 **Como Funciona HOJE** (Versão Atual)

```mermaid
graph TD
    A[👤 Usuário Entra] --> B{🔐 Login?}
    B -->|Sim| C[🏠 Dashboard]
    B -->|Não| D[🎸 Landing Page]
    D --> E[📝 Cadastro/Login]
    E --> C
    
    C --> F[🤖 Consultor IA]
    C --> G[🎛️ Pedalboard Builder]
    C --> H[🛒 Marketplace]
    C --> I[👥 Comunidade]
    
    F --> J[💬 Chat GPT-4]
    J --> K[🧠 Análise Perfil]
    K --> L[🎯 Recomendações]
    L --> M[💰 Rig Completo]
    
    G --> N[🎵 Drag & Drop Pedais]
    N --> O[🔊 Simulação Tone.js]
    O --> P[⚙️ Ajuste Parâmetros]
    P --> Q[📤 Upload Áudio]
    Q --> R[🔍 Análise Espectral]
    R --> S[🔌 Export VST]
    S --> T[📁 Download DAW]
    
    H --> U[🔍 Filtros Avançados]
    U --> V[💳 Compra/Venda]
    
    I --> W[📱 Compartilhar Rigs]
    W --> X[🎵 Áudios Preview]
    X --> Y[⬇️ Importar Setup]
    
    %% Cores vibrantes e contrastantes
    style A fill:#FF6B6B,stroke:#000,stroke-width:3px,color:#fff
    style B fill:#4ECDC4,stroke:#000,stroke-width:3px,color:#000
    style C fill:#45B7D1,stroke:#000,stroke-width:3px,color:#fff
    style F fill:#96CEB4,stroke:#000,stroke-width:3px,color:#000
    style G fill:#FFEAA7,stroke:#000,stroke-width:3px,color:#000
    style H fill:#DDA0DD,stroke:#000,stroke-width:3px,color:#000
    style I fill:#98D8C8,stroke:#000,stroke-width:3px,color:#000
    style J fill:#FF7675,stroke:#000,stroke-width:3px,color:#fff
    style O fill:#00B894,stroke:#000,stroke-width:3px,color:#fff
    style S fill:#FDCB6E,stroke:#000,stroke-width:3px,color:#000
    style V fill:#E17055,stroke:#000,stroke-width:3px,color:#fff
    style M fill:#A29BFE,stroke:#000,stroke-width:3px,color:#fff
    style T fill:#FD79A8,stroke:#000,stroke-width:3px,color:#fff
```

### 🚀 **Projeto IDEAL** (Visão Futura)

```mermaid
graph TD
    A[👤 Usuário] --> B{🎤 Comando Voz?}
    B -->|"Quero som do Slash"| C[🎵 Spotify API]
    B -->|Não| D[🏠 Dashboard IA]
    
    C --> E[🧠 AI Tone Analysis]
    E --> F[🎯 Setup Automático]
    F --> G[🎛️ Pedalboard Gerada]
    
    D --> H[🤖 IA Contextual]
    H --> I{📍 Contexto}
    I -->|🌧️ Chuva + 🏠 Casa| J[🎵 Setup Intimista]
    I -->|☀️ Sol + ⛪ Igreja| K[🎵 Setup Worship]
    I -->|🌙 Noite + 🎸 Show| L[🎵 Setup Rock]
    
    G --> M[🎮 Guitar Hero Mode]
    M --> N[🏆 Desafio Semanal]
    N --> O[📊 Ranking Global]
    
    G --> P[👥 Sessão Colaborativa]
    P --> Q[🔄 Sync Tempo Real]
    Q --> R[🎵 Jam Virtual]
    
    G --> S[🥽 Preview AR/VR]
    S --> T[👀 Visualização 3D]
    T --> U[🛒 Compra 1-Click]
    
    U --> V[🏪 White Label Store]
    V --> W[📦 Entrega Integrada]
    
    G --> X[🧬 Genetic Algorithm]
    X --> Y[🔄 Evolução Setup]
    Y --> Z[📈 Otimização IA]
    
    Z --> AA[🎓 Guitar Academy]
    AA --> BB[📚 Curso Personalizado]
    BB --> CC[🏅 Certificação]
    
    %% Cores vibrantes e contrastantes para visão futura
    style A fill:#FF4757,stroke:#000,stroke-width:3px,color:#fff
    style B fill:#3742FA,stroke:#000,stroke-width:3px,color:#fff
    style C fill:#2ED573,stroke:#000,stroke-width:3px,color:#fff
    style D fill:#FFA502,stroke:#000,stroke-width:3px,color:#000
    style E fill:#FF6348,stroke:#000,stroke-width:3px,color:#fff
    style G fill:#7BED9F,stroke:#000,stroke-width:3px,color:#000
    style H fill:#70A1FF,stroke:#000,stroke-width:3px,color:#fff
    style I fill:#FF9FF3,stroke:#000,stroke-width:3px,color:#000
    style M fill:#7BED9F,stroke:#000,stroke-width:3px,color:#000
    style S fill:#FFB8B8,stroke:#000,stroke-width:3px,color:#000
    style V fill:#FF6B9D,stroke:#000,stroke-width:3px,color:#fff
    style X fill:#C44569,stroke:#000,stroke-width:3px,color:#fff
    style AA fill:#F8B500,stroke:#000,stroke-width:3px,color:#000
    style U fill:#6C5CE7,stroke:#000,stroke-width:3px,color:#fff
    style Z fill:#00CEC9,stroke:#000,stroke-width:3px,color:#fff
    style CC fill:#FDCB6E,stroke:#000,stroke-width:3px,color:#000
```

### 🔄 **Jornada do Usuário IDEAL**

```mermaid
journey
    title Jornada do Guitarrista no Hub IDEAL
    section Descoberta
      Ouve música no Spotify: 5: Usuário
      "Quero esse som": 4: Usuário
      IA analisa automaticamente: 5: Sistema
      
    section Recomendação
      IA sugere 3 setups: 5: Sistema
      Preview em AR: 4: Usuário
      Testa no Guitar Hero: 5: Usuário
      
    section Criação
      Monta pedalboard colaborativa: 5: Usuário, Amigos
      IA otimiza em tempo real: 5: Sistema
      Grava jam session virtual: 4: Usuário
      
    section Compra
      Compra 1-click integrada: 5: Usuário
      Entrega via parceiro: 4: Loja
      Setup físico = digital: 5: Usuário
      
    section Evolução
      IA aprende preferências: 5: Sistema
      Sugere próximo upgrade: 4: Sistema
      Vira instrutor da comunidade: 5: Usuário
```

### 🎯 **Arquitetura Técnica IDEAL**

```mermaid
graph TB
    subgraph "🎤 Input Layer"
        A[Voice Commands]
        B[Spotify API]
        C[YouTube API]
        D[Hardware MIDI]
    end
    
    subgraph "🧠 AI Core"
        E[GPT-4 Turbo]
        F[Custom ML Models]
        G[Genetic Algorithm]
        H[Context Engine]
    end
    
    subgraph "🎵 Audio Engine"
        I[WebAudio API]
        J[Tone.js Enhanced]
        K[Neural DSP]
        L[Real-time Sync]
    end
    
    subgraph "🥽 Experience Layer"
        M[AR/VR Engine]
        N[3D Visualizer]
        O[Collaborative Rooms]
        P[Gamification]
    end
    
    subgraph "💾 Data Layer"
        Q[(User Profiles)]
        R[(Community Data)]
        S[(Audio Samples)]
        T[(ML Training)]
    end
    
    A --> E
    B --> F
    C --> F
    D --> I
    
    E --> H
    F --> G
    G --> H
    H --> I
    
    I --> M
    J --> N
    K --> O
    L --> P
    
    M --> Q
    N --> R
    O --> S
    P --> T
    
    %% Cores vibrantes para arquitetura técnica
    style A fill:#FF5722,stroke:#000,stroke-width:2px,color:#fff
    style B fill:#4CAF50,stroke:#000,stroke-width:2px,color:#fff
    style C fill:#F44336,stroke:#000,stroke-width:2px,color:#fff
    style D fill:#9C27B0,stroke:#000,stroke-width:2px,color:#fff
    style E fill:#2196F3,stroke:#000,stroke-width:2px,color:#fff
    style F fill:#FF9800,stroke:#000,stroke-width:2px,color:#000
    style G fill:#795548,stroke:#000,stroke-width:2px,color:#fff
    style H fill:#607D8B,stroke:#000,stroke-width:2px,color:#fff
    style I fill:#00BCD4,stroke:#000,stroke-width:2px,color:#fff
    style J fill:#8BC34A,stroke:#000,stroke-width:2px,color:#000
    style K fill:#E91E63,stroke:#000,stroke-width:2px,color:#fff
    style L fill:#FFC107,stroke:#000,stroke-width:2px,color:#000
    style M fill:#673AB7,stroke:#000,stroke-width:2px,color:#fff
    style N fill:#009688,stroke:#000,stroke-width:2px,color:#fff
    style O fill:#FF5722,stroke:#000,stroke-width:2px,color:#fff
    style P fill:#3F51B5,stroke:#000,stroke-width:2px,color:#fff
    style Q fill:#E91E63,stroke:#000,stroke-width:2px,color:#fff
    style R fill:#4CAF50,stroke:#000,stroke-width:2px,color:#fff
    style S fill:#FF9800,stroke:#000,stroke-width:2px,color:#000
    style T fill:#9C27B0,stroke:#000,stroke-width:2px,color:#fff
```

## 📊 **Status do Projeto**

![Status](https://img.shields.io/badge/Status-Produção-brightgreen)
![Version](https://img.shields.io/badge/Version-2.0.0-blue)
![License](https://img.shields.io/badge/License-MIT-yellow)
![TypeScript](https://img.shields.io/badge/TypeScript-100%25-blue)

### 🎯 **Funcionalidades Principais**
- ✅ **IA Conversacional**: OpenAI GPT-4 integrado
- ✅ **Análise de Áudio**: Detecção automática de características
- ✅ **Export VST**: Projetos para 5 DAWs profissionais
- ✅ **Simulação Real**: WebAudio API + Tone.js
- ✅ **Upload Seguro**: Supabase Storage integrado
- ✅ **Autenticação**: Google OAuth + email/senha

### 🚀 **Performance**
- ⚡ **Carregamento**: < 2s (otimizado)
- 🎵 **Áudio**: Latência < 50ms
- 🤖 **IA**: Resposta < 3s
- 📱 **Mobile**: 100% responsivo

### 🔒 **Segurança**
- 🛡️ Validação rigorosa de uploads
- 🔐 Autenticação robusta
- 🚫 Rate limiting em APIs
- ✅ Sanitização de dados

---

## 🎯 **Próximas Prioridades (3 meses)**

### 🥇 **Alta Prioridade**
1. **🎵 Spotify Integration** - Diferencial competitivo único no Brasil
2. **🎤 Voice Commands** - UX inovadora para controle da pedalboard  
3. **🧠 Learning from Community** - IA mais inteligente baseada em dados reais

### 🥈 **Média Prioridade**
4. **🎮 Guitar Hero Mode** - Gamificação para aumentar engajamento
5. **🏪 White Label** - Revenue B2B com lojas parceiras
6. **🎸 Artist Partnerships** - Marketing com artistas nacionais

### 🥉 **Baixa Prioridade**
7. **🥽 AR/VR** - Tecnologia ainda muito futurista
8. **🔗 Hardware Integration** - Complexidade técnica alta
9. **🎵 AI Music Generation** - Nice to have, não essencial

---

**🎸 Desenvolvido com ❤️ para a comunidade de guitarristas brasileiros!**

*"Transformando a forma como guitarristas descobrem, testam e adquirem equipamentos no Brasil."*

### 💡 **Visão 2025**
*"Ser a plataforma #1 do Brasil para guitarristas, onde IA, comunidade e tecnologia se encontram para criar a experiência musical definitiva."*