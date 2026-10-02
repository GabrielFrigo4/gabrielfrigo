# 🧼 Clean Code & Diretrizes de Desenvolvimento Web

Diretrizes canônicas para o repositório do portfólio web de Gabriel Frigo:

## 1. Regra do Escoteiro (Boy Scout Rule)

- Sempre deixe o código mais limpo, leve e organizado do que estava antes da modificação.

## 2. Nomes Significativos & Clareza Semântica

- Variáveis, props e classes CSS devem refletir o propósito exato (`typewriterText`, `selectedCategory`, `feature-card`).
- Evite abreviações crípticas ou genéricas (`data`, `temp`, `res`).

## 3. Filosofia Anti-Inchaço (Zero Runtime Bloat)

- Não importe dependências desnecessárias do npm.
- Animações, layouts e interações devem ser resolvidos primariamente via CSS moderno (`flexbox`, `grid`, `keyframes`, `backdrop-filter`).
- O runtime de cliente deve se limitar estritamente à reatividade mínima de Svelte 5.

## 4. Ícones Vetoriais SVG Nativos em Todo o Website (Zero Bloat & Zero Unicode Jitter)

- **Diretriz Global do Website:** O uso de SVGs inline nativos é a regra mandatória para todo o site (Home, Chat, navegação, botões de ação, badges e cards).
- **Proibição de Pacotes de Ícones:** Não instale dependências do npm (`lucide-svelte`, `font-awesome`, `@iconify`).
- **Proibição de Glifos Unicode e Emojis em Controles:** É expressamente proibido usar caracteres UTF-8 ou emojis (`⚙`, `↵`, `⏹`, `▾`, `⚡`, `🧠`, `🎲`, `↗`, `↓`) para botões, controles de interface ou sinalizadores visuais. A renderização, altura de linha, tamanho e alinhamento variam drasticamente entre sistemas operacionais (FreeBSD, Linux, Windows, macOS, Android, iOS). Emojis só são admitidos quando representam dados literais de texto.
- **A Solução Canônica:** Utilize SVGs inline nativos (`viewBox="0 0 24 24"`), com `stroke="currentColor"` ou `fill="currentColor"`, dimensões explícitas, `aria-hidden="true"` e estilização determinística via CSS.

## 5. Código Sem Comentários (Clean Code Declarativo)

- **Zero Comentários em Código Fonte:** Comentários em arquivos `.svelte`, `.js`, `.css` e HTML são expressamente proibidos (`//`, `/* */`, `<!-- -->`).
- **Autoexplicabilidade:** O código deve ser autoexplicativo por construção, empregando nomes reveladores de intenção, funções puras coesas e clareza estrutural. Comentários frequentemente mascaram código ruim ou ficam defasados; código limpo expressa a verdade matemática imediata.
- **Documentação em Arquivos Próprios:** Filosofia, arquitetura, infraestrutura e decisões de engenharia pertencem à documentação Markdown (`AGENTS.md`, `PRINCIPLES.md`, `README.md`, `INFRASTRUCTURE.md`), nunca ao código-fonte.
- **Exceção Hermética Única:** Apenas pragmas estritamente exigidos por ferramentas de compilação externa (`/* @vite-ignore */` em importações dinâmicas via CDN) são tolerados.

## 6. Hermetismo de Produção (`rm -rf .agents`)

- Nada em `.agents/` ou `.githooks/` pode ser acoplado ao build estático em produção.

## 7. Determinismo & Validação Contínua

- O código deve compilar sem warnings e passar com 100% de sucesso em `make lint` e `make build`.
