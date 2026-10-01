# 📋 Backlog & Roadmap Técnico — Gabriel Frigo Portfolio

> Registro formal de arquitetura, melhorias planejadas e tarefas pendentes para o portfólio oficial ([gabrielfrigo.dev.br](https://gabrielfrigo.dev.br)), mantendo fidelidade estrita à **Filosofia Anti-Inchaço**, **Fundamentos de UNIX** e **Engenharia Soberana**.

---

## 🎯 Meta Prioritária: Ajuste Visual Mobile, Auditoria Matemática de Memória e Recategorização do Chat

> **Objetivo:** Corrigir os problemas de layout do chat ([gabrielfrigo.dev.br/chat](https://gabrielfrigo.dev.br/chat/)) em telas de celular, calcular matematicamente o consumo real de memória dos modelos atuais com base em suas características técnicas e reorganizar as categorias da lista para separar modelos pequenos (ex: Qwen 0.8B) de intermediários (ex: Qwen 2B).

```mermaid
flowchart LR
    subgraph UI ["1. Front-end Mobile"]
        CSS["Ajuste de CSS & Telas Pequenas"]
        FIX["Fim do Overflow & Input Firme"]
        CSS --> FIX
    end

    subgraph MATH ["2. Auditoria Matemática"]
        FORMULA["Fórmula: (Params x Bits) + KV Cache"]
        SIZES["Tamanho Real Calculado"]
        FORMULA --> SIZES
    end

    subgraph LIST ["3. Nova Estrutura"]
        TIERS["Separação Lógica (0.8B vs 2B)"]
        UI_UPDATE["Atualizar Seletor do Chat"]
        TIERS --> UI_UPDATE
    end

    FIX --> SIZES --> UI_UPDATE
```

---

### 🛡️ Diretrizes de Execução

1. **Front-end Mobile Limpo e Estável:**
    - Garantir que caixas de texto, mensagens e botões se adaptem à largura da tela sem gerar barra de rolagem horizontal ou quebras visuais.
    - Manter a área de digitação e histórico visíveis e utilizáveis em telas pequenas quando o teclado do celular abrir.
2. **Cálculo Matemático sem Achismos:**
    - Estimar o consumo de memória usando a fórmula direta de características do modelo:
      $$\text{Memória Total (GB)} \approx \frac{\text{Parâmetros} \times \text{Bits por Peso}}{8 \times 10^9} + \text{KV Cache da Janela}$$
    - Fazer as contas para a quantização em uso (ex: 4 bits / `q4f16`) somada ao espaço que o contexto aberto ocupa na memória.
3. **Categorias Coerentes no Menu:**
    - Acabar com o agrupamento genérico. Modelos sub-1B (como Qwen 0.8B) têm exigências muito menores que modelos de 2B e devem ter seções/categorias separadas.

---

### 📝 Runbook Passo a Passo

#### Passo 1: Correção do Layout no Mobile

- Revisar o CSS do container principal, histórico de mensagens e barra de input para não estourarem a largura em smartphones (360px a 400px).
- Travar quebras de palavras longas e blocos de código com `overflow-wrap: anywhere` e `overflow-x: auto` isolado.
- Garantir que a tela do chat ocupe a altura total visível no mobile sem que o rodapé seja empurrado para fora.

#### Passo 2: Cálculo Matemático dos Modelos Atuais

- Listar cada modelo atualmente presente no site.
- Aplicar a matemática direta:
    - **Pesos:** Número de parâmetros $\times$ tamanho da quantização (ex: $0.8 \times 10^9 \times 4\text{ bits} \div 8 \approx 400\text{ MB}$ de pesos).
    - **Contexto:** Estimativa do KV Cache para a janela padrão de tokens configurada no chat.
    - **Total:** Somar pesos + KV Cache para definir o tamanho real final de cada modelo.

#### Passo 3: Reestruturação das Categorias na Lista

- Dividir o seletor em grupos claros baseados no tamanho real calculado:
    - **Leves / Entrada (Sub-1B):** Para modelos ultra-leves e rápidos como Qwen 0.8B.
    - **Intermediários (~2B):** Para modelos mais densos como Qwen 2B, que exigem mais memória.
- Atualizar a lista de opções no componente do Svelte com a nova divisão e a exibição do tamanho real ao lado de cada nome.

#### Passo 4: Validação Prática

- Abrir o site no celular e validar se o layout se mantém alinhado e sem quebras visuais.
- Conferir se os modelos estão ordenados e categorizados de acordo com os valores calculados.

---

## 🎯 Meta Prioritária: Pipeline de CI/CD Seguro com Deploy Automático (Modelo A)

> **Objetivo:** Automatizar a publicação do portfólio para que todo `git push origin main` execute os quality gates e sincronize automaticamente os artefatos estáticos (`build/`) com o servidor de produção em nuvem soberana (`ubuntu@144.22.210.65`), com **zero intervenção manual** e **defesa em profundidade**.

```mermaid
flowchart LR
    subgraph LOCAL ["Estação Soberana (FreeBSD)"]
        DEV["Dev & Pair Programming"]
        GATE["pre-commit Hooks"]
        PUSH["git push origin main"]
        DEV --> GATE --> PUSH
    end

    subgraph GITHUB ["GitHub Actions (CI/CD Seguro)"]
        CI["1. Lint & Test (Prettier + SvelteKit Build)"]
        VERIFY["2. Verificação de Integridade dos Artefatos"]
        AGENT["3. Carregar Chave SSH Isolada (GitHub Secrets)"]
        DEPLOY["4. Sincronização Segura via rsync/scp"]
        PUSH --> CI --> VERIFY --> AGENT --> DEPLOY
    end

    subgraph SERVER ["Servidor de Produção (Ubuntu / Caddy)"]
        AUTH["~/.ssh/authorized_keys (Restrito)"]
        BUILD["/home/ubuntu/gabrielfrigo/build"]
        CADDY["Caddy Server (Cache-Control no-cache)"]
        DEPLOY --> AUTH --> BUILD --> CADDY
    end
```

---

### 🛡️ Princípios de Segurança & Defesa em Profundidade

1. **Princípio do Menor Privilégio (Privilege Separation):**
    - **NUNCA** utilizar a chave SSH principal de administração do servidor (`ssh-key-personal-server.key`).
    - Criar um par de chaves SSH `ed25519` dedicado exclusivamente para o GitHub Actions, sem permissões de `sudo` e sem acesso a outros serviços do servidor.
2. **Restrições Rígidas no `authorized_keys`:**
    - A chave no servidor deve possuir diretivas de restrição no arquivo `~/.ssh/authorized_keys`:
        ```text
        no-port-forwarding,no-X11-forwarding,no-agent-forwarding,no-pty ssh-ed25519 <PUBLIC_KEY_DEPLOY> github-actions-portfolio-deploy
        ```
3. **Isolamento de Diretório:**
    - A sincronização afeta exclusivamente o diretório `/home/ubuntu/gabrielfrigo/build/`. Nenhum arquivo de configuração de sistema (`/etc/caddy`, etc.) fica acessível pela chave de deploy.
4. **Proteção de Branch & Secrets no GitHub:**
    - Apenas execuções vindas da branch protegida `main` terão acesso aos Secrets (`PERSONAL_SERVER_KEY`).

---

### 📝 Runbook Passo a Passo para Execução Futura

#### Passo 1: Gerar o Par de Chaves Dedicado na Máquina Local

```bash
# Gerar chave ed25519 isolada sem passphrase para o bot de CI
ssh-keygen -t ed25519 -C "github-actions-portfolio-deploy" -f ~/.ssh/id_ed25519_portfolio_deploy
```

#### Passo 2: Instalar a Chave Pública no Servidor com Restrições

No servidor (`ubuntu@144.22.210.65`), anexar a chave pública com restrições em `~/.ssh/authorized_keys`:

```bash
# Linha a ser adicionada no ~/.ssh/authorized_keys do servidor:
no-port-forwarding,no-X11-forwarding,no-agent-forwarding,no-pty ssh-ed25519 AAAA... github-actions-portfolio-deploy
```

#### Passo 3: Cadastrar os Segredos no GitHub Repository

No repositório `GabrielFrigo4/gabrielfrigo` (Settings → Secrets and variables → Actions):

- `PERSONAL_SERVER_IP`: `144.22.210.65`
- `PERSONAL_SERVER_USER`: `ubuntu`
- `PERSONAL_SERVER_PORT`: `22`
- `PERSONAL_SERVER_KEY`: _(Conteúdo privado da chave `id_ed25519_portfolio_deploy`)_

#### Passo 4: Atualizar `.github/workflows/ci.yml` para Adicionar o Job de CD

Adicionar o job de deploy condicionado ao sucesso do build na branch `main`:

```yaml
deploy:
    name: 🚀 Production Deploy (Push SSH)
    needs: validate-and-build
    if: github.ref == 'refs/heads/main' && github.event_name == 'push'
    runs-on: ubuntu-latest

    steps:
        - name: Checkout Code
          uses: actions/checkout@v4

        - name: Set up Node.js
          uses: actions/setup-node@v4
          with:
              node-version: 22
              cache: "npm"

        - name: Install Dependencies
          run: npm ci

        - name: Build Static SvelteKit Site
          run: npm run build

        - name: Set up SSH Agent
          uses: webfactory/ssh-agent@v0.9.0
          with:
              ssh-private-key: ${{ secrets.PERSONAL_SERVER_KEY }}

        - name: Add Server to Known Hosts
          run: |
              mkdir -p ~/.ssh
              ssh-keyscan -p ${{ secrets.PERSONAL_SERVER_PORT || 22 }} -H ${{ secrets.PERSONAL_SERVER_IP }} >> ~/.ssh/known_hosts

        - name: Sync Static Build to Server (Atomic rsync)
          run: |
              rsync -avz --delete \
                -e "ssh -p ${{ secrets.PERSONAL_SERVER_PORT || 22 }}" \
                build/ \
                ${{ secrets.PERSONAL_SERVER_USER }}@${{ secrets.PERSONAL_SERVER_IP }}:/home/${{ secrets.PERSONAL_SERVER_USER }}/gabrielfrigo/build/

        - name: Health Check Deployment
          run: |
              sleep 2
              STATUS_CODE=$(curl -s -o /dev/null -w "%{http_code}" https://gabrielfrigo.dev.br/chat/)
              if [ "$STATUS_CODE" != "200" ]; then
                echo "❌ Health check failed with status $STATUS_CODE"
                exit 1
              fi
              echo "✅ Production deployment verified! Status $STATUS_CODE"
```

#### Passo 5: Validação & Teste de Fogo

- Fazer um commit de teste na `main`.
- Acompanhar a execução da GitHub Action.
- Verificar se o site `https://gabrielfrigo.dev.br/chat/` é atualizado em menos de 45 segundos.

---

## 📌 Outras Tarefas do Backlog

- [x] **Geometria Estável de Botões:** Eliminar jitter de largura/altura nas transições de estado no chat web.
- [x] **Ícones Vetoriais SVG Nativos:** Banir glifos Unicode (`↵`, `⏹`) e pacotes de ícones externos do npm em favor de SVGs inline nativos.
- [x] **Responsividade Mobile no Chat Web:** Correção de overflow horizontal na navbar, whisper telemetry e blocos `<pre>`.
- [x] **Blindagem de Cache HTTP:** Adição de `Cache-Control: no-cache` em HTMLs e `immutable` em assets versionados no Caddy.
- [ ] **Automação de CI/CD Completa:** Executar o pipeline do Modelo A detalhado acima.
- [ ] **Modelos de IA de Próxima Geração (Gemma 4 & SmolLM3):** Integrar ao catálogo WebGPU do chat os modelos de última geração Gemma 4 (Google DeepMind) e SmolLM3 (Hugging Face) assim que o runtime WebLLM (`@mlc-ai/web-llm`) disponibilizar quantizações canônicas e binários WASM suportados no ecossistema WebGPU.
- [ ] **Cache de Shaders WebGPU Offline:** Implementar persistência local de shaders compilados via IndexedDB/Cache API para acelerar cold start do WebLLM.
- [ ] **Modo Alto Contraste:** Adicionar suporte sutil a `prefers-contrast` no CSS canônico.
