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
5. **Quality Gates & Conventional Commits:** Todo commit deve respeitar as convenções de commit semântico (`feat:`, `fix:`, `docs:`, `chore:`, etc.).

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
├── PRINCIPLES.md              # 19 Princípios de Engenharia
├── README.md                  # Documentação institucional do repositório
├── package.json               # Dependências estritas de SvelteKit e Vite
├── svelte.config.js           # Configuração de adapter-static
└── vite.config.js             # Configuração do Vite
```
