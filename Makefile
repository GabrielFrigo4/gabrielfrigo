.POSIX:
.SILENT:

MAKEFLAGS += --no-print-directory -s

# ----------------------------------------------------------------
# Makefile: Static Portfolio (SvelteKit)
# ----------------------------------------------------------------

NPM        ?= npm
NODE       ?= node
GIT        ?= git
TARGET_DIR ?= build

.PHONY: all help dev build preview format prettier lint check hooks test ci clean deploy

all: help

### ================================
### HELP & DOCUMENTATION
### ================================
help:
	_e=$$'\e'; \
	cmd() { printf "    $${_e}[36mmake %-22s$${_e}[0m %s\n" "$$1" "$$2"; }; \
	sec() { printf "\n  $${_e}[1;33m%s$${_e}[0m\n" "$$1"; }; \
	printf "\n  $${_e}[1;37mGabriel Frigo — Static Portfolio (SvelteKit)$${_e}[0m\n"; \
	printf "  ============================================================\n"; \
	sec "Desenvolvimento & Build:"; \
	cmd "dev"            "Inicia servidor de desenvolvimento local (Vite)"; \
	cmd "build"          "Compila o site estático via @sveltejs/adapter-static"; \
	cmd "preview"        "Pré-visualiza os arquivos estáticos de build/"; \
	cmd "deploy"         "Executa build e envia os artefatos para o servidor"; \
	sec "Qualidade & Governança:"; \
	cmd "format"         "Formata arquivos com Prettier"; \
	cmd "prettier"       "Formata arquivos com Prettier"; \
	cmd "lint"           "Valida formatação com Prettier"; \
	cmd "check"          "Executa validações estáticas e linter"; \
	cmd "hooks"          "Configura e ativa os quality gates locais (.githooks)"; \
	cmd "test"           "Executa o ciclo completo de validação e compilação"; \
	cmd "ci"             "Target de integração contínua (Quality Gate)"; \
	sec "Manutenção:"; \
	cmd "clean"          "Remove diretórios de build e cache (.svelte-kit)"; \
	echo ""

### ================================
### DEVELOPMENT & BUILD
### ================================
dev:
	printf "🚀 Iniciando servidor de desenvolvimento SvelteKit...\n"
	$(NPM) run dev

build:
	printf "⚡ Compilando site estático com SvelteKit...\n"
	$(NPM) run build
	printf "✅ Build estático gerado com sucesso em build/\n"

preview: build
	printf "👀 Iniciando pré-visualização de build/...\n"
	$(NPM) run preview

deploy: build
	if [ -f "./update-server.sh" ]; then \
		./update-server.sh $(TARGET_DIR); \
	fi

### ================================
### CODE QUALITY & FORMATTING
### ================================
format:
	printf "🎨 Formatando arquivos com Prettier...\n"
	$(NPM) run format

prettier: format

lint check:
	printf "🔍 Verificando formatação com Prettier...\n"
	$(NPM) run lint

### ================================
### GIT HOOKS & PERMISSIONS
### ================================
hooks:
	printf "⚓ Configurando Git Hooks em .githooks/...\n"
	chmod 0755 .githooks/* 2>/dev/null || true
	$(GIT) config core.hooksPath .githooks
	printf "✅ Quality gates locais ativados!\n"

test ci: lint build
	printf "✅ Pipeline de validação concluído com sucesso!\n"

### ================================
### CLEANUP
### ================================
clean:
	printf "🧹 Limpando artefatos de compilação...\n"
	rm -rf build .svelte-kit
	printf "✅ Workspace limpo!\n"
