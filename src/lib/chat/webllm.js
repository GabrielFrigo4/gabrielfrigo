let webllmModule = null;

/**
 * Carrega a biblioteca @mlc-ai/web-llm dinamicamente no navegador.
 */
export async function getWebLLM() {
	if (webllmModule) return webllmModule;
	try {
		webllmModule = await import(/* @vite-ignore */ "https://esm.run/@mlc-ai/web-llm");
		return webllmModule;
	} catch (err) {
		console.error("Falha ao carregar WebLLM:", err);
		throw err;
	}
}

/**
 * Verifica se o navegador suporta WebGPU e se há adaptadores disponíveis.
 *
 * @returns {Promise<{ supported: boolean, status: string, isError: boolean }>}
 */
export async function checkWebGPU() {
	if (typeof window === "undefined" || !("gpu" in navigator) || !navigator.gpu) {
		return {
			supported: false,
			status: "WebGPU Não Suportada",
			isError: true,
		};
	}

	try {
		const adapter = await navigator.gpu.requestAdapter();
		if (!adapter) {
			return {
				supported: false,
				status: "Sem Adaptador WebGPU",
				isError: true,
			};
		}
		const kind = adapter.isFallbackAdapter ? "Software" : "Hardware";
		return {
			supported: true,
			status: `WebGPU Ativa (${kind})`,
			isError: false,
		};
	} catch (err) {
		return {
			supported: false,
			status: "Erro WebGPU",
			isError: true,
		};
	}
}
