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
		let adapter = null;
		try {
			adapter = await navigator.gpu.requestAdapter({
				powerPreference: "high-performance",
			});
		} catch (e) {
			// fallback
		}
		if (!adapter) {
			adapter = await navigator.gpu.requestAdapter();
		}

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

		let info = null;
		try {
			info =
				adapter.info ||
				(typeof adapter.requestAdapterInfo === "function"
					? await adapter.requestAdapterInfo()
					: null);
		} catch (e) {
			// ignore
		}

		const deviceName =
			info?.device ||
			info?.description ||
			(adapter.isFallbackAdapter ? "Software" : "GPU");
		const isSoftware =
			adapter.isFallbackAdapter ||
			deviceName.toLowerCase().includes("llvmpipe") ||
			deviceName.toLowerCase().includes("swiftshader") ||
			deviceName.toLowerCase().includes("software");

		const hasF16 = adapter.features ? adapter.features.has("shader-f16") : false;

		let cleanName = deviceName;
		if (cleanName.includes("Iris")) cleanName = "Intel Iris Xe";
		else if (cleanName.includes("llvmpipe")) cleanName = "llvmpipe (CPU)";
		else if (cleanName.length > 25) cleanName = cleanName.slice(0, 22) + "...";

		return {
			supported: true,
			status: `WebGPU: ${cleanName} (${hasF16 ? "f16" : "f32"})`,
			shortStatus: isSoftware ? "CPU (Lento) ⚠️" : `${cleanName} ⚡`,
			isError: false,
			isSoftware,
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
