#!/bin/sh
set -e

DIR_TO_COPY="${1:-build}"
SERVER_IP="${FRIGO_SERVER_IP:-144.22.210.65}"
SERVER_USER="${FRIGO_SERVER_USER:-ubuntu}"
SERVER_KEY="${FRIGO_SERVER_KEY:-}"

# Resolução antifrágil da chave SSH caso não exista no caminho informado
if [ -z "${SERVER_KEY}" ] || [ ! -f "${SERVER_KEY}" ]; then
	for _candidate in \
		"${HOME}/.vault/keys/ssh-key-frigo-server.key" \
		"${HOME}/.local/share/vault/keys/ssh-key-frigo-server.key" \
		"${HOME}/.config/vault/keys/ssh-key-frigo-server.key" \
		"${HOME}/.key/ssh-key-frigo-server.key" \
		"/usr/local/share/vault/keys/ssh-key-frigo-server.key"; do
		if [ -f "${_candidate}" ]; then
			SERVER_KEY="${_candidate}"
			break
		fi
	done
fi

USER_HOST="${SERVER_USER}@${SERVER_IP}"
TARGET_PATH="/home/${SERVER_USER}/gabrielfrigo/${DIR_TO_COPY}"
PARENT_DIR="$(dirname "${TARGET_PATH}")"

if [ -n "${SERVER_KEY}" ] && [ -f "${SERVER_KEY}" ]; then
	chmod 0600 "${SERVER_KEY}" 2> "/dev/null" || true
	echo "🚀 Enviando ${DIR_TO_COPY} para ${USER_HOST}:${TARGET_PATH}..."
	ssh -i "${SERVER_KEY}" "${USER_HOST}" "mkdir -p \"${PARENT_DIR}\" && rm -rf \"${TARGET_PATH}\""
	scp -r -i "${SERVER_KEY}" "${DIR_TO_COPY}" "${USER_HOST}:${TARGET_PATH}"
	echo "✅ Deploy concluído com sucesso!"
else
	echo "⚠️ Chave SSH explícita não encontrada. Tentando conexão padrão..."
	ssh "${USER_HOST}" "mkdir -p \"${PARENT_DIR}\" && rm -rf \"${TARGET_PATH}\""
	scp -r "${DIR_TO_COPY}" "${USER_HOST}:${TARGET_PATH}"
	echo "✅ Deploy concluído com sucesso!"
fi
