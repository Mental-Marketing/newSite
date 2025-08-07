# Mental Marketing - Site Corporativo

## 📋 Visão Geral

Site corporativo da Mental Marketing desenvolvido com Node.js, Express e EJS, integrado com Botpress Cloud Chat API e sistema de localização multilíngue. O projeto oferece uma experiência de usuário moderna com chat inteligente, animações interativas e suporte completo para compartilhamento em redes sociais.

## 🚀 Funcionalidades Principais

### 🌐 Sistema de Localização Multilíngue
- **Detecção automática de idioma** baseada no header `Accept-Language` do navegador
- **Suporte a múltiplos idiomas**: Português (pt-BR), Inglês (en), Espanhol (es), Chinês (zh-Hans)
- **Troca dinâmica de idioma** via interface do usuário
- **Meta tags localizadas** para SEO e compartilhamento social
- **Fallback inteligente** para português quando idioma não disponível

### 💬 Chat Inteligente Integrado
- **Integração com Botpress Cloud Chat API**
- **Interface flutuante** com animações suaves
- **Sistema de mensagens em tempo real**
- **Formulário de interação** com validação
- **Design responsivo** e acessível

### 📊 Dashboard de Métricas Animadas
- **Contadores animados** usando CountUp.js
- **Métricas em tempo real**: HTML, Emails, Landing Pages
- **Animações suaves** com easing personalizado
- **Reinicialização automática** após troca de idioma
- **Formatação numérica** localizada (separadores e decimais)

### 📱 Compartilhamento Social Otimizado
- **Meta tags Open Graph** para Facebook, WhatsApp, LinkedIn
- **Twitter Cards** para compartilhamento no Twitter
- **Thumbnails dinâmicos** baseados no idioma do usuário
- **SEO otimizado** com títulos e descrições localizadas
- **URLs canônicas** e estrutura de dados estruturada

### 🎨 Interface Moderna e Responsiva
- **Design minimalista** com tipografia moderna
- **Animações CSS** e transições suaves
- **Layout responsivo** para todos os dispositivos
- **Carrossel de imagens** com Slick Slider
- **Efeitos visuais** e blur dinâmicos

## 🏗️ Arquitetura Técnica

### Stack Tecnológico
- **Backend**: Node.js + Express.js
- **Template Engine**: EJS (Embedded JavaScript)
- **Frontend**: HTML5, CSS3, JavaScript ES6+
- **Chat**: Botpress Cloud Chat API
- **Animações**: CountUp.js, Slick Carousel
- **Estilização**: CSS Custom Properties, Flexbox, Grid

### Estrutura de Diretórios
```
newSite/
├── app.js                 # Servidor principal e configurações
├── package.json           # Dependências e scripts
├── routes/
│   └── sendData.js        # Rota para envio de dados do chat
├── views/
│   ├── pages/
│   │   └── index.ejs      # Página principal
│   └── parciais/
│       └── header.ejs     # Cabeçalho com meta tags
├── public/
│   ├── css/
│   │   ├── basic.css      # Estilos principais
│   │   ├── chat.css       # Estilos do chat
│   │   └── iframe.css     # Estilos do iframe
│   ├── js/
│   │   ├── chat.js        # Lógica do chat
│   │   ├── languageSwitcher.js  # Sistema de localização
│   │   ├── countup.js     # Animações de contadores
│   │   ├── slider.js      # Carrossel de imagens
│   │   └── toggleIframe.js # Controle do iframe
│   └── images/            # Assets visuais
└── README.md
```

## ⚙️ Configuração e Instalação

### Pré-requisitos
- Node.js (versão 14 ou superior)
- npm ou yarn
- Acesso à API do Botpress Cloud

### Variáveis de Ambiente
Crie um arquivo `.env` na raiz do projeto:

```env
BOTPRESS_CHAT_URL=https://seu-botpress-instance.cloud.botpress.com
```

### Instalação
```bash
# Clone o repositório
git clone [url-do-repositorio]
cd newSite

# Instale as dependências
npm install

# Configure as variáveis de ambiente
cp .env.example .env
# Edite o arquivo .env com suas credenciais

# Inicie o servidor
npm start
```

### Scripts Disponíveis
```bash
npm start          # Inicia o servidor em modo produção
npm run dev        # Inicia o servidor em modo desenvolvimento
npm test           # Executa os testes (se configurados)
```

## 🔧 Configurações Técnicas

### Detecção de Idioma
O sistema utiliza uma função inteligente para detectar o idioma preferido do usuário:

```javascript
function detectUserLanguage(acceptLanguageHeader, availableLocales) {
    // Parse do header Accept-Language
    // Mapeamento de códigos de idioma
    // Fallback para português
}
```

### Sistema de Localização
- **Dados estruturados**: JSON com localizações organizadas por locale
- **Fallback automático**: Sempre retorna português se localização não encontrada
- **Meta tags dinâmicas**: Atualização em tempo real via JavaScript

### Rate Limiting
```javascript
const limiter = rateLimit({
    windowMs: 10 * 60 * 1000, // 10 minutos
    max: 100 // máximo 100 requisições por IP
});
```

### Segurança
- **Trust Proxy**: Configurado para funcionar atrás de proxy reverso
- **Rate Limiting**: Proteção contra ataques de força bruta
- **Validação de entrada**: Sanitização de dados do usuário
- **Headers de segurança**: Configurações recomendadas do Express

## 📊 API e Integrações

### Botpress Cloud Chat API
- **Endpoint**: Configurável via variável de ambiente
- **Autenticação**: Token-based
- **Webhooks**: Suporte para eventos em tempo real
- **Rate Limiting**: Proteção contra sobrecarga

### Strapi CMS
- **Base URL**: https://mentalmarketing.com.br/strapi
- **Populate**: Carregamento completo de relacionamentos
- **Localizations**: Suporte nativo a múltiplos idiomas
- **Media**: Gerenciamento de imagens e assets

## 🎯 SEO e Performance

### Meta Tags Otimizadas
```html
<!-- Open Graph -->
<meta property="og:title" content="Título Localizado">
<meta property="og:description" content="Descrição Localizada">
<meta property="og:image" content="URL da Imagem">
<meta property="og:url" content="https://mentalmarketing.com.br">

<!-- Twitter Card -->
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="Título para Twitter">
<meta name="twitter:description" content="Descrição para Twitter">
```

### Performance
- **Lazy Loading**: Carregamento sob demanda de recursos
- **Minificação**: CSS e JS otimizados
- **CDN**: Uso de CDNs para bibliotecas externas
- **Caching**: Headers de cache configurados

## 🔄 Fluxo de Dados

### Carregamento Inicial
1. **Detecção de idioma** via Accept-Language header
2. **Busca de dados** no Strapi CMS
3. **Aplicação de localização** nos dados
4. **Renderização** da página com meta tags corretas

### Troca de Idioma
1. **Seleção** do idioma pelo usuário
2. **Atualização** do conteúdo via JavaScript
3. **Atualização** das meta tags dinamicamente
4. **Reinicialização** das animações

### Chat
1. **Abertura** do iframe do chat
2. **Inicialização** da conexão com Botpress
3. **Envio** de mensagens via API
4. **Recebimento** de respostas em tempo real

## 🧪 Testes e Qualidade

### Estrutura de Testes
```bash
# Testes unitários (recomendado)
npm test

# Testes de integração
npm run test:integration

# Testes de performance
npm run test:performance
```

### Validação de Código
- **ESLint**: Configuração para JavaScript
- **Prettier**: Formatação automática de código
- **Husky**: Git hooks para validação

## 🚀 Deploy e Produção

### Configuração de Produção
```bash
# Build para produção
npm run build

# Iniciar em modo produção
NODE_ENV=production npm start
```

### Variáveis de Ambiente de Produção
```env
NODE_ENV=production
BOTPRESS_CHAT_URL=https://seu-botpress-instance.cloud.botpress.com
PORT=4682
```

### Monitoramento
- **Logs estruturados**: Para facilitar debugging
- **Métricas de performance**: Tempo de resposta e uso de recursos
- **Alertas**: Notificações para erros críticos

## 🤝 Contribuição

### Padrões de Código
- **ESLint**: Configuração padronizada
- **Prettier**: Formatação automática
- **Conventional Commits**: Padrão de commits

### Processo de Contribuição
1. Fork do repositório
2. Criação de branch para feature
3. Desenvolvimento com testes
4. Pull Request com descrição detalhada
5. Code Review e aprovação

## 📝 Changelog

### v1.0.0 (Atual)
- ✅ Sistema de localização multilíngue
- ✅ Integração com Botpress Cloud Chat
- ✅ Meta tags otimizadas para redes sociais
- ✅ Animações e contadores interativos
- ✅ Design responsivo e moderno
- ✅ SEO otimizado
- ✅ Rate limiting e segurança

## 📞 Suporte

Para suporte técnico ou dúvidas sobre o projeto:
- devdevdev@mentalmarketing.com.br

---

**Desenvolvido com ❤️ pela equipe Mental Marketing**
