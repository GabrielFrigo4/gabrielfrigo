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

## 4. Hermetismo de Produção (`rm -rf .agents`)

- Nada em `.agents/` ou `.githooks/` pode ser acoplado ao build estático em produção.

## 5. Determinismo & Validação Contínua

- O código deve compilar sem warnings e passar com 100% de sucesso em `make lint` e `make build`.
