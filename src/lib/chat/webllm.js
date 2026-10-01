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

		let webglRenderer = "";
		if (typeof document !== "undefined") {
			try {
				const canvas = document.createElement("canvas");
				const gl =
					canvas.getContext("webgl2") ||
					canvas.getContext("webgl") ||
					canvas.getContext("experimental-webgl");
				if (gl) {
					const debugInfo = gl.getExtension("WEBGL_debug_renderer_info");
					if (debugInfo) {
						webglRenderer = (
							gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL) || ""
						).trim();
					}
				}
			} catch (_) {
				// ignore
			}
		}

		const rawDevice = (
			info?.device ||
			info?.description ||
			info?.architecture ||
			info?.vendor ||
			""
		).trim();

		const detectedDevice = (rawDevice || webglRenderer).trim();
		const lowerDevice = detectedDevice.toLowerCase();

		const hasF16 = adapter.features ? adapter.features.has("shader-f16") : false;
		const isSoftware =
			adapter.isFallbackAdapter ||
			lowerDevice.includes("llvmpipe") ||
			lowerDevice.includes("swiftshader") ||
			lowerDevice.includes("software");

		let cleanName = "Hardware GPU";
		if (lowerDevice.includes("iris")) {
			cleanName = "Intel Iris Xe";
		} else if (
			lowerDevice.includes("geforce") ||
			lowerDevice.includes("rtx") ||
			lowerDevice.includes("gtx")
		) {
			cleanName = "NVIDIA GeForce";
		} else if (lowerDevice.includes("radeon")) {
			cleanName = "AMD Radeon";
		} else if (
			lowerDevice.includes("apple") ||
			lowerDevice.includes("m1") ||
			lowerDevice.includes("m2") ||
			lowerDevice.includes("m3") ||
			lowerDevice.includes("m4")
		) {
			cleanName = "Apple Silicon";
		} else if (lowerDevice.includes("intel")) {
			cleanName = "Intel Graphics";
		} else if (lowerDevice.includes("llvmpipe")) {
			cleanName = "llvmpipe (CPU)";
		} else if (lowerDevice.includes("swiftshader")) {
			cleanName = "SwiftShader (CPU)";
		} else if (isSoftware || adapter.isFallbackAdapter) {
			cleanName = "CPU (Fallback)";
		} else if (detectedDevice && !lowerDevice.includes("gpu")) {
			cleanName =
				detectedDevice.length > 20
					? detectedDevice.slice(0, 18) + "..."
					: detectedDevice;
		} else {
			cleanName = hasF16 ? "Hardware GPU" : "GPU (f32)";
		}

		console.log("[WebGPU Diagnostics]", {
			webgpuInfo: info,
			webglRenderer,
			detectedDevice,
			isSoftware,
			hasF16,
			isFallbackAdapter: adapter.isFallbackAdapter,
			cleanName,
		});

		return {
			supported: true,
			status: `WebGPU: ${cleanName} (${hasF16 ? "f16" : "f32"})`,
			shortStatus: isSoftware ? "CPU (Lento) ⚠️" : `${cleanName} ⚡`,
			cleanName,
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
