CARGO_NAME = gabrielfrigo
BIN_NAME = webserver

.PHONY: all build update clean clear erase

all: build

build:
	@echo "🦀 Compilando Rust (Release)..."
	cargo build --release
	cp target/release/$(CARGO_NAME) $(BIN_NAME)
	@echo "✅ Binário criado: ./$(BIN_NAME)"

update: build
	@echo "🚀 Enviando arquivos para o servidor Oracle..."
	./update-server.sh $(BIN_NAME)
	./update-server.sh public
	@echo "✅ Deploy concluído!"

clean clear erase:
	@echo "🧹 Limpando o projeto..."
	rm -f $(BIN_NAME)
	cargo clean
