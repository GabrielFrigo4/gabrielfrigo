#!/bin/sh
set -e

DIR_TO_COPY="${1:-build}"

if [ -z "${FRIGO_SERVER_IP}" ] || [ -z "${FRIGO_SERVER_USER}" ]; then
	echo "❌ Erro: FRIGO_SERVER_IP ou FRIGO_SERVER_USER não configurados no ambiente." >&2
	exit 1
fi

USER_HOST="${FRIGO_SERVER_USER}@${FRIGO_SERVER_IP}"
TARGET_PATH="/home/${FRIGO_SERVER_USER}/gabrielfrigo/${DIR_TO_COPY}"
PARENT_DIR="$(dirname "${TARGET_PATH}")"

echo "🚀 Enviando ${DIR_TO_COPY} para ${USER_HOST}:${TARGET_PATH}..."

if [ -n "${FRIGO_SERVER_KEY}" ] && [ -f "${FRIGO_SERVER_KEY}" ]; then
	ssh -i "${FRIGO_SERVER_KEY}" "${USER_HOST}" "mkdir -p \"${PARENT_DIR}\" && rm -rf \"${TARGET_PATH}\""
	scp -r -i "${FRIGO_SERVER_KEY}" "${DIR_TO_COPY}" "${USER_HOST}:${TARGET_PATH}"
else
	ssh "${USER_HOST}" "mkdir -p \"${PARENT_DIR}\" && rm -rf \"${TARGET_PATH}\""
	scp -r "${DIR_TO_COPY}" "${USER_HOST}:${TARGET_PATH}"
fi

echo "✅ Deploy concluído com sucesso!"
