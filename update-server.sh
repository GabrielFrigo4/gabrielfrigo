#!/usr/bin/env sh
set -eu

DIR_TO_COPY="${1:-build}"

SERVER_IP="${PERSONAL_SERVER_IP:-}"
SERVER_USER="${PERSONAL_SERVER_USER:-}"
SERVER_KEY="${PERSONAL_SERVER_KEY:-}"

if [ -z "${SERVER_IP}" ] || [ -z "${SERVER_USER}" ]; then
	echo "❌ Erro: PERSONAL_SERVER_IP ou PERSONAL_SERVER_USER não configurados no ambiente." >&2
	exit 1
fi

if [ -z "${SERVER_KEY}" ] || [ ! -f "${SERVER_KEY}" ]; then
	for _cand in \
		"${VAULT_DIR:-}/keys/ssh-key-personal-server.key" \
		"${HOME}/.local/share/vault/keys/ssh-key-personal-server.key" \
		"${HOME}/.vault/keys/ssh-key-personal-server.key"; do
		if [ -f "${_cand}" ]; then
			SERVER_KEY="${_cand}"
			break
		fi
	done
fi

USER_HOST="${SERVER_USER}@${SERVER_IP}"
TARGET_PATH="/home/${SERVER_USER}/gabrielfrigo/${DIR_TO_COPY}"
PARENT_DIR="$(dirname "${TARGET_PATH}")"

echo "🚀 Enviando ${DIR_TO_COPY} para ${USER_HOST}:${TARGET_PATH}..."

if [ -n "${SERVER_KEY}" ] && [ -f "${SERVER_KEY}" ]; then
	chmod 0600 "${SERVER_KEY}" 2> "/dev/null" || true
	ssh -i "${SERVER_KEY}" "${USER_HOST}" "mkdir -p \"${PARENT_DIR}\" && rm -rf \"${TARGET_PATH}\""
	scp -r -i "${SERVER_KEY}" "${DIR_TO_COPY}" "${USER_HOST}:${TARGET_PATH}"
else
	ssh "${USER_HOST}" "mkdir -p \"${PARENT_DIR}\" && rm -rf \"${TARGET_PATH}\""
	scp -r "${DIR_TO_COPY}" "${USER_HOST}:${TARGET_PATH}"
fi

echo "✅ Deploy concluído com sucesso!"
