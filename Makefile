CARGO_NAME = gabrielfrigo
TARGET = resume

.PHONY: all
all: build

.PHONY: build
build:
	@echo "🦀 Compilando Rust (Release)..."
	@cargo build --release
	@cp target/release/$(CARGO_NAME) $(TARGET)
	@echo "✅ Binário criado: ./$(TARGET)"

.PHONY: run
run: build
	@echo "🟢 Iniciando Servidor..."
	@ADMIN_USER=admin ADMIN_PASS=admin ./$(TARGET)
	@echo "🛑 Servidor Encerrado."

.PHONY: update
update: build
	@echo "🚀 Enviando arquivos para o servidor Oracle..."
	@./update-server.sh $(TARGET)
	@./update-server.sh public
	@echo "✅ Deploy concluído!"

.PHONY: clean clear erase
clean clear erase:
	@echo "🧹 Limpando o projeto..."
	@rm -f $(TARGET)
	@cargo clean
