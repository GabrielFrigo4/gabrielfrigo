.POSIX:
.SILENT:
MAKEFLAGS += --no-print-directory -s

NPM ?= npm
NODE ?= node
GIT ?= git
TARGET_DIR ?= build

.PHONY: all help dev build preview format lint check hooks test ci clean deploy

all: help

help:
	printf "⚡ Gabriel Frigo — Static Portfolio (SvelteKit)\n\n"
	printf "Alvos disponíveis:\n"
	printf "  make dev      - Inicia servidor de desenvolvimento local (Vite)\n"
	printf "  make build    - Compila o site estático via @sveltejs/adapter-static\n"
	printf "  make preview  - Pré-visualiza os arquivos estáticos de build/\n"
	printf "  make format   - Formata arquivos com Prettier\n"
	printf "  make lint     - Valida formatação com Prettier\n"
	printf "  make check    - Executa validações estáticas e linter\n"
	printf "  make hooks    - Configura e ativa os quality gates locais (.githooks)\n"
	printf "  make test     - Executa o ciclo completo de validação e compilação\n"
	printf "  make ci       - Target de integração contínua (Quality Gate)\n"
	printf "  make clean    - Remove diretórios de build e cache\n"
	printf "  make deploy   - Executa build e envia os artefatos para o servidor\n"

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

format:
	printf "🎨 Formatando arquivos com Prettier...\n"
	$(NPM) run format

lint check:
	printf "🔍 Verificando formatação com Prettier...\n"
	$(NPM) run lint

hooks:
	printf "⚓ Configurando Git Hooks em .githooks/...\n"
	chmod 0755 .githooks/* 2>/dev/null || true
	$(GIT) config core.hooksPath .githooks
	printf "✅ Quality gates locais ativados!\n"

test ci: lint build
	printf "✅ Pipeline de validação concluído com sucesso!\n"

clean:
	printf "🧹 Limpando artefatos de compilação...\n"
	rm -rf build .svelte-kit
	printf "✅ Workspace limpo!\n"

deploy: build
	if [ -f "./update-server.sh" ]; then \
		./update-server.sh $(TARGET_DIR); \
	fi
