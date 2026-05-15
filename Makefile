CARGO_NAME = gabrielfrigo
TARGET = resume

.PHONY: all build update clean clear erase

all: build

build:
	@echo "🦀 Compilando Rust (Release)..."
	cargo build --release
	cp target/release/$(CARGO_NAME) $(TARGET)
	@echo "✅ Binário criado: ./$(TARGET)"

update: build
	@echo "🚀 Enviando arquivos para o servidor Oracle..."
	./update-server.sh $(TARGET)
	./update-server.sh public
	@echo "✅ Deploy concluído!"

clean clear erase:
	@echo "🧹 Limpando o projeto..."
	rm -f $(TARGET)
	cargo clean
