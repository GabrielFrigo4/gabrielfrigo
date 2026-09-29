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
	let selectedModelKey = $state("gemma-4-e2b");
	let selectedSpec = $derived(MODEL_SPECS[selectedModelKey] || MODEL_SPECS["gemma-4-e2b"]);

	let gpuStatus = $state("Verificando WebGPU...");
	let isGpuError = $state(false);

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
				"### ⚡ Runtime WebGPU Local Pronto\n\n" +
				"Ambiente de inferência executado **diretamente nos shaders da sua GPU**, sem requisições de texto a servidores na nuvem.\n\n" +
				"• **Zero Telemetria Externa:** Pesos são cacheados no Cache API do seu navegador e computados localmente.\n" +
				"• **Modelos de Ponta:** Gemma 4 (Google), Qwen3.5 com raciocínio analítico (`<think>`) e SmolLM.\n" +
				"• **Telemetria em Tempo Real:** Medição precisa de vazão de tensores (`tok/s`) e contagem de tokens.\n\n" +
				"> 💡 **Como Iniciar:** Selecione o modelo desejado no menu superior e clique em **Carregar Modelo ⚡**.",
		},
	];

	let messages = $state([...INITIAL_MESSAGES]);

	onMount(async () => {
		const gpuResult = await checkWebGPU();
		gpuStatus = gpuResult.status;
		isGpuError = gpuResult.isError;

		markedInstance = await getMarked();
	});

	async function loadModel() {
		if (isGpuError || isLoading || isGenerating) return;

		isLoading = true;
		showProgress = true;
		progressPct = 0;
		progressText = `Carregando tensores de ${selectedSpec.name}...`;

		try {
			const webllm = await getWebLLM();
			engine = new webllm.MLCEngine();

			engine.setInitProgressCallback((report) => {
				const pct = Math.round(report.progress * 100);
				progressPct = pct;
				progressText = `[${selectedSpec.name}] ${report.text}`;
			});

			await engine.reload(selectedSpec.primaryId);

			progressPct = 100;
			progressText = `${selectedSpec.name} pronto na VRAM!`;
			activeModelName = selectedSpec.name;
			isLoaded = true;

			setTimeout(() => {
				showProgress = false;
			}, 1500);
		} catch (err) {
			console.error("Falha ao inicializar WebLLM:", err);
			progressText = `Erro no carregamento: ${err.message || err}`;
			isLoaded = false;
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
			metaRight: new Date().toLocaleTimeString(),
			content: text,
		};

		messages = [...messages, userMsg];
		messageHistory.push({ role: "user", content: text });

		const assistantIndex = messages.length;
		const assistantMsg = {
			role: "assistant",
			sender: "Assistente Local",
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
						sender: "Assistente Local",
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
		{isGpuError}
		{isLoading}
		{isLoaded}
		{isGenerating}
		onLoadModel={loadModel}
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
		max-height: 100vh;
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
		padding: 16px 24px 20px 24px;
	}

	@media (max-width: 640px) {
		.chat-main-container {
			padding: 12px 14px 16px 14px;
		}
	}
</style>
