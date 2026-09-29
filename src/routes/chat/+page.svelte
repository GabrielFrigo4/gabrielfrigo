<script>
	import { onMount } from "svelte";
	import { MODEL_SPECS } from "$lib/chat/models.js";
	import { getMarked } from "$lib/chat/markdown.js";
	import { checkWebGPU, getWebLLM } from "$lib/chat/webllm.js";

	import ChatNav from "$lib/components/chat/ChatNav.svelte";
	import ModelCard from "$lib/components/chat/ModelCard.svelte";
	import ProgressBar from "$lib/components/chat/ProgressBar.svelte";
	import ChatMessages from "$lib/components/chat/ChatMessages.svelte";
	import ChatMetrics from "$lib/components/chat/ChatMetrics.svelte";
	import ChatInput from "$lib/components/chat/ChatInput.svelte";

	// Estado reativo Svelte 5 com Runes
	let selectedModelKey = $state("smol-lm-3-360m");
	let selectedSpec = $derived(MODEL_SPECS[selectedModelKey] || MODEL_SPECS["smol-lm-3-360m"]);

	let gpuStatus = $state("Verificando WebGPU...");
	let shortGpuStatus = $state("GPU...");
	let isGpuError = $state(false);
	let isMobileDevice = $state(false);

	let isLoading = $state(false);
	let isLoaded = $state(false);
	let isGenerating = $state(false);

	let progressText = $state("Inicializando runtime WebGPU...");
	let progressPct = $state(0);
	let showProgress = $state(false);

	let activeModelName = $state("Nenhum");
	let speed = $state("0.0");
	let tokens = $state(0);

	let prompt = $state("");
	let markedInstance = $state(null);

	let engine = null;

	const SYSTEM_PROMPT =
		"Você é um assistente de engenharia de software e sistemas soberanos de alta precisão. Responda em português com clareza, concisão e profundidade técnica.";

	let messageHistory = [
		{
			role: "system",
			content: SYSTEM_PROMPT,
		},
	];

	const INITIAL_MESSAGES = [
		{
			role: "assistant",
			sender: "Sistema Soberano",
			metaRight: "100% Client-Side",
			content:
				"### ⚡ Runtime WebGPU Local Ativo\n\n" +
				"Inferência de IA de ponta executada **diretamente nos shaders da sua GPU**, com privacidade absoluta e zero tráfego na nuvem.\n\n" +
				"• **Modelos de Ponta:** Família SmolLM3 & SmolVLM (Hugging Face), Qwen3.5 nativo (Alibaba) e Gemma 4 (Google).\n" +
				"• **📱 Otimizado para Smartphones:** Para celulares (como Galaxy M52 / Adreno), utilize os modelos **SmolLM3 (360M Mobile ou 135M Nano)** para garantir estabilidade e fluidez máxima.\n\n" +
				"> 💡 **Como Iniciar:** Escolha o modelo acima e toque em **Carregar Modelo ⚡**.",
		},
	];

	let messages = $state([...INITIAL_MESSAGES]);

	onMount(async () => {
		const gpuResult = await checkWebGPU();
		gpuStatus = gpuResult.status;
		shortGpuStatus = gpuResult.shortStatus;
		isGpuError = gpuResult.isError;
		isMobileDevice = gpuResult.isMobile;

		// No mobile, garante seleção de modelo ultra-leve SmolLM3 por padrão
		if (isMobileDevice) {
			selectedModelKey = "smol-lm-3-360m";
		} else {
			selectedModelKey = "gemma-4-e2b";
		}

		markedInstance = await getMarked();
	});

	async function loadModel(overrideModelId = null) {
		if (isGpuError || isLoading || isGenerating) return;

		isLoading = true;
		showProgress = true;
		progressPct = 0;
		progressText = `Preparando runtime de GPU para ${selectedSpec.name}...`;

		// 1. Liberação proativa de VRAM anterior para evitar OOM no dispositivo móvel
		if (engine) {
			try {
				progressText = "Liberando buffers de VRAM do modelo anterior...";
				await engine.unload();
			} catch (e) {
				console.warn("Aviso ao descarregar engine anterior:", e);
			}
			engine = null;
		}

		try {
			const webllm = await getWebLLM();
			engine = new webllm.MLCEngine();

			engine.setInitProgressCallback((report) => {
				const pct = Math.round(report.progress * 100);
				progressPct = pct;
				progressText = `[${selectedSpec.name}] ${report.text}`;
			});

			const targetModelId = overrideModelId || selectedSpec.primaryId;
			await engine.reload(targetModelId);

			progressPct = 100;
			progressText = `${selectedSpec.name} pronto na GPU!`;
			activeModelName = selectedSpec.name;
			isLoaded = true;

			setTimeout(() => {
				showProgress = false;
			}, 1800);
		} catch (err) {
			console.error("Falha ao inicializar WebLLM:", err);
			const errMsg = String(err?.message || err);

			// Detecta se ocorreu falha de GPU Device Loss / mapAsync / OOM (comum em Snapdragon/Adreno no Android)
			const isGpuCrash =
				errMsg.includes("mapAsync") ||
				errMsg.includes("Instance reference") ||
				errMsg.includes("Device is lost") ||
				errMsg.includes("out of memory") ||
				errMsg.includes("GPUBuffer");

			if (isGpuCrash && selectedSpec.fallbackId && !overrideModelId) {
				progressText = "Ativando variante F32 compatível com o driver da sua GPU...";
				try {
					await loadModel(selectedSpec.fallbackId);
					return;
				} catch (fallbackErr) {
					console.error("Falha no fallback F32:", fallbackErr);
				}
			}

			if (isGpuCrash) {
				progressText =
					"⚠️ Memória GPU esgotada ou driver Snapdragon/Adreno reiniciou. Escolha 'SmolLM3 (360M Mobile)' para estabilidade.";
				messages = [
					...messages,
					{
						role: "assistant",
						sender: "Diagnóstico GPU",
						metaRight: "Aviso de Hardware",
						content:
							"⚠️ **Aviso de Limite de VRAM / Driver GPU:**\n\n" +
							"Seu dispositivo móvel atingiu o limite de memória gráfica permitida pelo navegador ou reiniciou o contexto WebGPU (`device lost`).\n\n" +
							"👉 **Como resolver no celular (Galaxy M52 / Adreno):**\n" +
							"1. Selecione o modelo **SmolLM3 (360M Mobile)** ou **SmolLM3 (135M Nano)** no menu superior.\n" +
							"2. Eles consomem menos de 400MB de VRAM e utilizam ativação F32 segura para drivers móveis.",
					},
				];
			} else {
				progressText = `Erro no carregamento: ${errMsg}`;
			}

			isLoaded = false;
			if (engine) {
				try {
					await engine.unload();
				} catch (_) {}
				engine = null;
			}
		} finally {
			isLoading = false;
		}
	}

	async function sendMessage() {
		const text = prompt.trim();
		if (!text || isGenerating || !engine) return;

		prompt = "";
		isGenerating = true;

		const userMsg = {
			role: "user",
			sender: "Você",
			metaRight: new Date().toLocaleTimeString([], {
				hour: "2-digit",
				minute: "2-digit",
			}),
			content: text,
		};

		messages = [...messages, userMsg];
		messageHistory.push({ role: "user", content: text });

		const assistantIndex = messages.length;
		const assistantMsg = {
			role: "assistant",
			sender: activeModelName || "Assistente Local",
			metaRight: "Processando tensores...",
			content: "",
		};

		messages = [...messages, assistantMsg];

		let fullResponse = "";
		let tokenCount = 0;
		const startTime = performance.now();

		try {
			const completion = await engine.chat.completions.create({
				messages: messageHistory,
				temperature: 0.2,
				stream: true,
			});

			for await (const chunk of completion) {
				const delta = chunk.choices[0]?.delta?.content || "";
				if (delta) {
					fullResponse += delta;
					tokenCount++;

					const elapsedSec = (performance.now() - startTime) / 1000;
					const tokPerSec = (tokenCount / Math.max(elapsedSec, 0.001)).toFixed(1);

					speed = tokPerSec;
					tokens = tokenCount;

					messages[assistantIndex] = {
						role: "assistant",
						sender: activeModelName || "Assistente Local",
						metaRight: `${tokPerSec} tok/s · WebGPU`,
						content: fullResponse,
					};
				}
			}

			messageHistory.push({ role: "assistant", content: fullResponse });
		} catch (err) {
			messages[assistantIndex] = {
				role: "assistant",
				sender: "Erro Local",
				metaRight: "Falha",
				content: `⚠️ **Erro durante a inferência local:** ${err.message || err}`,
			};
		} finally {
			isGenerating = false;
		}
	}

	function clearChat() {
		messages = [...INITIAL_MESSAGES];
		messageHistory = [
			{
				role: "system",
				content: SYSTEM_PROMPT,
			},
		];
		tokens = 0;
		speed = "0.0";
	}
</script>

<svelte:head>
	<title>Sovereign WebGPU Chat | Gabriel Frigo</title>
	<meta
		name="description"
		content="WebGPU Chat Soberano: Inferência de IA 100% Client-Side na GPU local com Gemma 4, Qwen3.5 e SmolLM."
	/>
</svelte:head>

<div class="chat-page-root">
	<ChatNav
		bind:selectedModelKey
		{gpuStatus}
		{shortGpuStatus}
		{isGpuError}
		{isLoading}
		{isLoaded}
		{isGenerating}
		onLoadModel={() => loadModel()}
		onClearChat={clearChat}
	/>

	<ModelCard spec={selectedSpec} />

	<ProgressBar visible={showProgress} text={progressText} progress={progressPct} />

	<main class="chat-main-container">
		<ChatMessages {messages} {markedInstance} />

		<ChatMetrics {activeModelName} {speed} {tokens} />

		<ChatInput
			bind:prompt
			disabled={!isLoaded || isGpuError}
			{isGenerating}
			onSend={sendMessage}
		/>
	</main>
</div>

<style>
	.chat-page-root {
		display: flex;
		flex-direction: column;
		height: 100vh;
		height: 100dvh;
		max-height: 100vh;
		max-height: 100dvh;
		background: radial-gradient(circle at 50% 0%, #0d1527 0%, #080c14 65%, #05080e 100%);
		color: #f1f5f9;
		overflow: hidden;
		position: relative;
	}

	.chat-main-container {
		flex: 1;
		display: flex;
		flex-direction: column;
		overflow: hidden;
		max-width: 1040px;
		width: 100%;
		margin: 0 auto;
		padding: 12px 20px 14px 20px;
		padding-bottom: max(14px, env(safe-area-inset-bottom));
	}

	@media (max-width: 640px) {
		.chat-main-container {
			padding: 8px 10px 10px 10px;
			padding-bottom: max(10px, env(safe-area-inset-bottom));
		}
	}
</style>
