# --- Configurações ---
C_SRC_DIR = src-c
RUST_SRC_DIR = src-rust
RUST_CARGO_NAME = webserver_rust 

.PHONY: all build build-c build-rs update clear

all: build-c build-rs

build: all

# --- Compilação C ---
build-c:
	@echo "🔨 Compilando C..."
	gcc $(C_SRC_DIR)/*.c -I$(C_SRC_DIR) -o webserver-c -O2
	@echo "✅ Binário C criado: ./webserver-c"

# --- Compilação Rust ---
build-rs:
	@echo "🦀 Compilando Rust (Release)..."
	cd $(RUST_SRC_DIR) && cargo build --release
	@echo "📦 Movendo binário Rust para a raiz..."
	cp $(RUST_SRC_DIR)/target/release/$(RUST_CARGO_NAME) webserver-rs
	@echo "✅ Binário Rust criado: ./webserver-rs"

# --- Updates (Scripts de Deploy) ---
update-c: build-c
	./update-server.sh "webserver-c"
	./update-server.sh "static"

update-rs: build-rs
	./update-server.sh "webserver-rs"
	./update-server.sh "static"

# --- Limpeza ---
clear:
	rm -f webserver webserver-c webserver-rs
	cd $(RUST_SRC_DIR) && cargo clean
