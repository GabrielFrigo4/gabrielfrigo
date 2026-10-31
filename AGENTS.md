# 🚀 Gabriel Frigo Portfolio — AI Agent Briefing

> Este é o repositório do **website oficial e portfólio pessoal de Gabriel Frigo** ([gabrielfrigo.dev.br](https://gabrielfrigo.dev.br)), compilado estaticamente em **SvelteKit** (`@sveltejs/adapter-static`).

---

## 🧭 Identidade e Papel

O website reflete a identidade técnica, acadêmica e filosófica de Gabriel Frigo:

- **Estudante de Ciência da Computação (UFABC)** e Pesquisador de Otimização Combinatória (PIBIC / Network Flows)
- **Finalista Nacional da Maratona SBC / ICPC 2026** (Equipe GRUB da UFABC)
- **Engenharia de Sistemas Perto do Metal:** C23, C++23, Rust, Zig, Go, Assembly, FreeBSD, Linux, OpenBSD e illumos
- **Fundamentos de UNIX:** Primitivas puras de File Descriptors (FD) e Identifiers (ID), OSS (`cat /dev/dsp > /dev/dsp`) vs ALSA, Privilege Separation (`pledge`/`unveil`, Capsicum)
- **O Sexteto de Engenharia Federado:** `Environment`, `Foundation`, `Research`, `Training`, `Personal` e `Venture`
- **Filosofia Anti-Inchaço & Compilador Determinístico:** Garantias matemáticas estáticas superam qualquer suposição em tempo de execução
- **Método Socrático com IA:** Tutoria ativa com IA (Antigravity CLI/IDE/2.0), questionando tudo perpetuamente (99% não basta; 100% de certeza)

---

## 📁 Estrutura Canônica de Arquivos

```text
Portfolio/
├── .agents/                   # Governança e runbooks de IA
│   ├── rules/                 # Diretrizes de Clean Code
│   └── skills/                # Runbooks de developer-identity-crafting
├── .githooks/                 # Quality gates locais (pre-commit, commit-msg)
├── .github/workflows/         # Pipeline de CI/CD (GitHub Actions)
├── src/
│   ├── app.html               # Template HTML com meta tags e fontes
│   └── routes/
│       ├── +layout.js         # Prerender = true e trailingSlash
│       ├── +layout.svelte     # Tema visual escuro e variáveis CSS
│       └── +page.svelte       # Página principal e seções canônicas
├── static/                    # Favicon, assets e imagens públicas
├── AGENTS.md                  # Este briefing de engenharia
├── INFRASTRUCTURE.md          # Arquitetura Caddy, Edge Gateway e Políticas de Cache
├── LICENSE                    # Licença do projeto
├── Makefile                   # Orquestrador POSIX silencioso
├── PRINCIPLES.md              # 22 Princípios de Engenharia aplicados
├── README.md                  # Documentação institucional do repositório
├── TODO.md                    # Backlog & Roadmap técnico (CI/CD Modelo A)
├── package.json               # Dependências estritas de SvelteKit e Vite
├── svelte.config.js           # Configuração de adapter-static
└── vite.config.js             # Configuração do Vite
```

---

## ⚠️ Regras Críticas para Agentes de IA

1. **Static First & Zero Runtime Bloat:** O site é 100% pré-renderizado via `@sveltejs/adapter-static`. Não utilize Node SSR, servidores dinâmicos em produção ou bibliotecas inchadas de UI.
2. **Método Socrático:** Ao implementar novos componentes ou textos, questione criticamente sua necessidade. Teste rigorosamente cada mudança.
3. **Hermetismo de Produção (`rm -rf .agents`):** A pasta `.agents/` serve exclusivamente para inteligência contextual local e não pode ser acoplada ao build.
4. **Make como Interface Única:** Todas as ações devem ser validadas via `make lint`, `make build` e `make test`.
5. **Ícones Vetoriais SVG Nativos em Todo o Website (Zero Bloat & Zero Unicode Jitter):** É proibido instalar bibliotecas de ícones no npm (`lucide`, `font-awesome`) e expressamente proibido usar glifos Unicode frágeis ou emojis (`⚙`, `↵`, `⏹`, `▾`, `⚡`, `🧠`, `🎲`, `↗`, `↓`) para controles, badges e botões em qualquer lugar do site. Todo ícone deve ser SVG inline nativo com `viewBox`, estilizado via CSS com `currentColor`, garantindo determinismo visual idêntico em qualquer sistema operacional (FreeBSD, Linux, macOS, Windows, mobile).
6. **Código Sem Comentários (Clean Code Declarativo):** Nenhum arquivo de código (`.svelte`, `.js`, `.css`, HTML, `Makefile`, shell scripts) deve conter comentários (`//`, `/* */`, `<!-- -->`, `#`). O código deve ser 100% legível, declarativo e autoexplicativo por construção. Toda explicação conceitual, arquitetural ou de governança deve residir exclusivamente na documentação (`.md`). Única exceção tolerada no código: `/* @vite-ignore */` para bundles dinâmicos via CDN.
7. **Estado da Arte (2025/2026) e Rejeição de Modelos Legados:** Evite sugerir, configurar ou incluir modelos de inteligência artificial ou ferramentas legadas/antigas. O portfólio e seu subsistema de inferência WebGPU devem refletir estritamente o estado da arte real dos anos vigentes (**2025/2026**: Google Gemma 3, Alibaba Qwen 3.5, Mistral AI Ministral 3 (2512), Microsoft Phi-4, DeepSeek R1). Sem concessões para tecnologias obsoletas.
8. **Padronização WebGPU (`q4f16_1` & Contexto Adaptativo):** Todos os modelos suportados DEVEM utilizar a quantização canônica `q4f16_1` (pesos em 4 bits e ativações em FP16 nativo com `shader-f16`), com `q4f32_1` estritamente restrito a fallback de compatibilidade. A redução da janela de contexto (`context_window_size: 1024`, `sliding_window_size: 512`) deve ocorrer **exclusivamente em ambientes mobile** (`isMobileDevice`) para blindar contra OOM do sistema operacional; no desktop, o contexto opera em capacidade plena padrão (4.096+ tokens).

---

## 🛡️ Regra da Proatividade e Correção Contínua (Boy Scout Rule)

O agente de IA atua de forma proativa na manutenção e aplicação dos padrões canônicos deste repositório.

Ao identificar linhas ou artefatos fora dos padrões estabelecidos:

1. **Notificar concisamente** o usuário sobre o ajuste realizado.
2. **Corrigir a inconformidade**, aplicando o padrão correspondente:
    - **Comentários Narrativos:** Eliminar comentários óbvios que apenas narram código executável.
    - **Banners Estruturais:** Ajustar réguas para exatamente 64 hífens no topo ou 32 caracteres com `### ` no corpo (ou 64 `=` em `.gitignore`), com títulos sempre em MAIÚSCULO.
    - **Portabilidade POSIX:** Substituir bashismos (`[[ ]]`, `&>`, arrays, `source`) por sintaxe estrita POSIX `/bin/sh`.
    - **Shebang Universal:** Garantir sempre `#!/usr/bin/env sh` ou `#!/usr/bin/env python3`.
    - **Sequências ANSI & Escapes:** Não use octais (`\033`, `\001`) para caracteres ou escapes. Use `[ -t 1 ] && echo -n $'\e...'` ou notação hexadecimal (`\x01`, `\x1b`). Octal é exclusivo para permissões POSIX (`chmod 0755`, `chmod 0644`, `umask`).
    - **Redirecionamento Seguro:** Envolver destinos em aspas duplas (ex: `> "/dev/null" 2>&1`).
    - **Makefiles:** Assegurar cabeçalho `.POSIX: .SILENT:`, `MAKEFLAGS += --no-print-directory -s`, alinhamento estético de variáveis e zero `@` redundante.
    - **Permissões Canônicas:** Aplicar 4 dígitos octais (`chmod 0755`, `chmod 0644`, `chmod 0700`, `chmod 0600`).
    - **Invariante Out-of-the-Box:** Garantir modos octais corretos no Git Index e auto-cura em tempo de execução sem requerer intervenção manual pós-clone.
    - **Emissão Semântica de UI:** Substituir `echo` avulsos com emojis pelas rotinas canônicas `_ui_*`.
    - **Antifragilidade & Resiliência:** Resolução ativa de caminhos em cascata, auto-cura de permissões (0600 em chaves/segredos) e validação defensiva de pré-requisitos.
    - **Curadoria Cognitiva:** Capturar decisões estruturais e regras tácitas em skills locais compactas (`.agents/skills/`), mantendo-as atualizadas e expurgando ruído obsoleto.
    - **Refatoração Sem Legado:** Expurgar aliases obsoletos, variáveis mortas e shims de compatibilidade em renomeações.
    - **Elevação Antifrágil & Shift Seguro:** Usar o bloco explícito `if [ "$(id -u)" -ne 0 ]` para resolução de `ELEVATE` (evitando término fatal sob `set -e` como root) e proteger todo comando `shift` com validação prévia de parâmetros (`[ "$#" -ge N ] && shift N`).
    - **Simetria de Documentação:** Mover regras ou invariantes universais documentadas erroneamente em sub-membros específicos para o documento de arquitetura do grupo correspondente, eliminando falsas assimetrias.

---

## 🚀 Comandos de Verificação Rápida (Quality Gates)

| Comando         | Finalidade Operacional                                             |
| :-------------- | :----------------------------------------------------------------- |
| `make help`     | Exibe o catálogo interativo de comandos disponíveis                |
| `make dev`      | Inicia o servidor local de desenvolvimento Vite                    |
| `make build`    | Compila o site estático via adapter-static em `build/`             |
| `make preview`  | Visualiza localmente o bundle estático gerado                      |
| `make format`   | Formata código-fonte e documentações (Prettier)                    |
| `make prettier` | Formata arquivos Markdown com Prettier                             |
| `make lint`     | Valida formatação e conformidade sem alterar arquivos              |
| `make check`    | Executa checagem de tipos e integridade do Svelte (`svelte-check`) |
| `make hooks`    | Configura e aplica permissão `0755` nos ganchos de `.githooks/`    |
| `make test`     | Executa suíte automatizada de testes do portfólio                  |
| `make ci`       | Executa pipeline local de validação (`check lint test build`)      |
| `make clean`    | Remove artefatos de compilação intermediários e `.svelte-kit`      |

---

## 📖 Referências Obrigatórias

Antes de qualquer modificação neste ecossistema, consulte:

- [README.md](README.md) — Documentação institucional do repositório
- [PRINCIPLES.md](PRINCIPLES.md) — Os 22 Princípios de Engenharia Soberanos
- [TODO.md](TODO.md) — Backlog & Roadmap técnico
- [INFRASTRUCTURE.md](INFRASTRUCTURE.md) — Arquitetura Caddy, Edge Gateway e Políticas de Cache
- [LICENSE](LICENSE) — Licença do projeto
- [.agents/rules/clean-code.md](.agents/rules/clean-code.md) — Regra de Clean Code
- [.agents/skills/developer-identity-crafting/SKILL.md](.agents/skills/developer-identity-crafting/SKILL.md) — Runbook de identidade pública e design
