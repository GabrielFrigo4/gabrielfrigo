let webllmModule = null;

/**
 * Carrega a biblioteca @mlc-ai/web-llm dinamicamente no navegador via CDN esm.run.
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
 * Verifica se o navegador suporta WebGPU, se há adaptadores disponíveis
 * e detecta extensões (shader-f16) e contexto mobile.
 *
 * @returns {Promise<{ supported: boolean, status: string, shortStatus: string, isError: boolean, hasF16: boolean, isMobile: boolean }>}
 */
export async function checkWebGPU() {
	const isMobile =
		typeof window !== "undefined" &&
		(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
			navigator.userAgent,
		) ||
			window.innerWidth <= 768);

	if (typeof window === "undefined" || !("gpu" in navigator) || !navigator.gpu) {
		return {
			supported: false,
			status: "WebGPU Não Suportada",
			shortStatus: "Sem WebGPU",
			isError: true,
			hasF16: false,
			isMobile,
		};
	}

	try {
		const adapter = await navigator.gpu.requestAdapter();
		if (!adapter) {
			return {
				supported: false,
				status: "Sem Adaptador WebGPU",
				shortStatus: "Sem Adaptador",
				isError: true,
				hasF16: false,
				isMobile,
			};
		}

		const kind = adapter.isFallbackAdapter ? "Software" : "Hardware";
		const hasF16 = adapter.features ? adapter.features.has("shader-f16") : false;

		return {
			supported: true,
			status: `WebGPU Ativa (${kind}${hasF16 ? " · f16" : " · f32"})`,
			shortStatus: `${kind}${isMobile ? " 📱" : ""}`,
			isError: false,
			hasF16,
			isMobile,
		};
	} catch (err) {
		return {
			supported: false,
			status: "Erro WebGPU",
			shortStatus: "Erro GPU",
			isError: true,
			hasF16: false,
			isMobile,
		};
	}
}
