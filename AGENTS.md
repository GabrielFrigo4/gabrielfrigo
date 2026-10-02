# 🚀 Gabriel Frigo Portfolio — AI Agent Briefing

> Este é o repositório do **website oficial e portfólio pessoal de Gabriel Frigo** ([gabrielfrigo.dev.br](https://gabrielfrigo.dev.br)), compilado estaticamente em **SvelteKit** (`@sveltejs/adapter-static`).

---

## 🧭 1. Identidade e Propósito

O website reflete a identidade técnica, acadêmica e filosófica de Gabriel Frigo:

- **Estudante de Ciência da Computação (UFABC)** e Pesquisador de Otimização Combinatória (PIBIC / Network Flows).
- **Finalista Nacional da Maratona SBC / ICPC 2026** (Equipe GRUB da UFABC).
- **Engenharia de Sistemas Perto do Metal:** C23, C++23, Rust, Zig, Go, Assembly, FreeBSD, Linux, OpenBSD e illumos.
- **Fundamentos de UNIX:** Primitivas puras de File Descriptors (FD) e Identifiers (ID), OSS (`cat /dev/dsp > /dev/dsp`) vs ALSA, Privilege Separation (`pledge`/`unveil`, Capsicum).
- **O Sexteto de Engenharia Federado:** `Environment`, `Foundation`, `Research`, `Training`, `Personal` e `Venture`.
- **Filosofia Anti-Inchaço & Compilador Determinístico:** Garantias matemáticas estáticas superam qualquer suposição em tempo de execução.
- **Método Socrático com IA:** Tutoria ativa com IA (Antigravity CLI/IDE/2.0), questionando tudo perpetuamente (99% não basta; 100% de certeza).

---

## ⚠️ 2. Regras Críticas para Agentes de IA

1. **Static First & Zero Runtime Bloat:** O site é 100% pré-renderizado via `@sveltejs/adapter-static`. Não utilize Node SSR, servidores dinâmicos em produção ou bibliotecas inchadas de UI.
2. **Método Socrático:** Ao implementar novos componentes ou textos, questione criticamente sua necessidade. Teste rigorosamente cada mudança.
3. **Hermetismo de Produção (`rm -rf .agents`):** A pasta `.agents/` serve exclusivamente para inteligência contextual local e não pode ser acoplada ao build.
4. **Make como Interface Única:** Todas as ações devem ser validadas via `make lint`, `make build` e `make test`.
5. **Ícones Vetoriais SVG Nativos em Todo o Website (Zero Bloat & Zero Unicode Jitter):** É proibido instalar bibliotecas de ícones no npm (`lucide`, `font-awesome`) e expressamente proibido usar glifos Unicode frágeis ou emojis (`⚙`, `↵`, `⏹`, `▾`, `⚡`, `🧠`, `🎲`, `↗`, `↓`) para controles, badges e botões em qualquer lugar do site. Todo ícone deve ser SVG inline nativo com `viewBox`, estilizado via CSS com `currentColor`, garantindo determinismo visual idêntico em qualquer sistema operacional (FreeBSD, Linux, macOS, Windows, mobile).
6. **Código Sem Comentários (Clean Code Declarativo):** Nenhum arquivo de código (`.svelte`, `.js`, `.css`, HTML, `Makefile`, shell scripts) deve conter comentários (`//`, `/* */`, `<!-- -->`, `#`). O código deve ser 100% legível, declarativo e autoexplicativo por construção. Toda explicação conceitual, arquitetural ou de governança deve residir exclusivamente na documentação (`.md`). Única exceção tolerada no código: `/* @vite-ignore */` para bundles dinâmicos via CDN.
7. **Estado da Arte (2025/2026) e Rejeição de Modelos Legados:** Evite sugerir, configurar ou incluir modelos de inteligência artificial ou ferramentas legadas/antigas (ex: SmolLM de meados de 2024, Llama 3.2, etc.). O portfólio e seu subsistema de inferência WebGPU devem refletir estritamente o estado da arte real dos anos vigentes (**2025/2026**: Google Gemma 3, Alibaba Qwen 3.5, Mistral AI Ministral 3 (2512), Microsoft Phi-4, DeepSeek R1). Sem concessões para tecnologias obsoletas.
8. **Padronização WebGPU (`q4f16_1` & Contexto Adaptativo):** Todos os modelos suportados DEVEM utilizar a quantização canônica `q4f16_1` (pesos em 4 bits e ativações em FP16 nativo com `shader-f16`), com `q4f32_1` estritamente restrito a fallback de compatibilidade. A redução da janela de contexto (`context_window_size: 1024`, `sliding_window_size: 512`) deve ocorrer **exclusivamente em ambientes mobile** (`isMobileDevice`) para blindar contra OOM do sistema operacional; no desktop, o contexto opera em capacidade plena padrão (4.096+ tokens).

---

## 🌲 3. Estrutura do Repositório

```
Portfolio/
├── .agents/                   # Governança e runbooks de IA
│   ├── rules/                 # Diretrizes de Clean Code
│   └── skills/                # Runbooks de portfolio-crafting
├── .githooks/                 # Quality gates locais (pre-commit, commit-msg)
├── .github/workflows/         # Pipeline de CI/CD (GitHub Actions)
├── src/
│   ├── app.html               # Template HTML com meta tags e fontes
│   └── routes/
│       ├── +layout.js         # Prerender = true e trailingSlash
│       ├── +layout.svelte     # Tema visual escuro e variáveis CSS
│       └── +page.svelte       # Página principal e seções canônicas
├── static/                    # Favicon, assets e imagens públicas
├── AGENTS.md                  # Este briefing
├── Makefile                   # Orquestrador POSIX silencioso
├── PRINCIPLES.md              # 22 Princípios de Engenharia
├── README.md                  # Documentação institucional do repositório
├── TODO.md                    # Backlog & Roadmap técnico (CI/CD Modelo A)
├── INFRASTRUCTURE.md          # Arquitetura Caddy, Edge Gateway e Políticas de Cache
├── package.json               # Dependências estritas de SvelteKit e Vite
├── svelte.config.js           # Configuração de adapter-static
└── vite.config.js             # Configuração do Vite
```
