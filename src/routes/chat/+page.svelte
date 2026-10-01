<script>
	import { onMount } from "svelte";
	import { MODEL_SPECS, SYSTEM_PROMPT_PRESETS } from "$lib/chat/models.js";
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

	// Gerenciamento simples e robusto de Prompt de Sistema
	let selectedPromptPresetId = $state("friendly");
	let customSystemPrompt = $state(SYSTEM_PROMPT_PRESETS[0].prompt);
	let isPromptModalOpen = $state(false);

	let activePromptPreset = $derived(
		SYSTEM_PROMPT_PRESETS.find((p) => p.id === selectedPromptPresetId) ||
			SYSTEM_PROMPT_PRESETS[0],
	);

	let activePromptName = $derived(
		selectedPromptPresetId === "custom" ? "Personalizado" : activePromptPreset.name,
	);

	function buildInitialHistory() {
		const trimmed = customSystemPrompt.trim();
		if (!trimmed) return [];
		return [{ role: "system", content: trimmed }];
	}

	let messageHistory = buildInitialHistory();

	const INITIAL_MESSAGES = [
		{
			role: "assistant",
			sender: "Sistema Soberano",
			metaRight: "100% Client-Side",
			content:
				"### ⚡ Runtime WebGPU Local Ativo\n\n" +
				"Inferência de IA de ponta executada **diretamente nos shaders da sua GPU**, com privacidade absoluta e zero tráfego na nuvem.\n\n" +
				"• **Modelos Disponíveis:** Llama 3.2 (Meta), DeepSeek R1 Reasoning (DeepSeek), Qwen3.5 (Alibaba), Gemma 4 (Google) e SmolLM3 (Hugging Face).\n" +
				"• **📱 Dica para Celulares:** Em smartphones ou notebooks leves, utilize **SmolLM3 (360M Mobile)** ou **Llama 3.2 (1B)** para máxima estabilidade e baixo consumo de VRAM.\n\n" +
				"> 💡 **Como Iniciar:** Escolha o modelo acima e clique em **Carregar Modelo ⚡**.",
		},
	];

	let messages = $state([...INITIAL_MESSAGES]);

	onMount(async () => {
		const gpuResult = await checkWebGPU();
		gpuStatus = gpuResult.status;
		shortGpuStatus = gpuResult.shortStatus;
		isGpuError = gpuResult.isError;
		isMobileDevice = gpuResult.isMobile;

		// No mobile, garante seleção de modelo ultra-leve por padrão
		if (isMobileDevice) {
			selectedModelKey = "smol-lm-3-360m";
		} else {
			selectedModelKey = "llama-3.2-1b";
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
					"⚠️ Memória GPU esgotada ou driver móvel reiniciou. Escolha 'SmolLM3 (360M Mobile)' para estabilidade.";
				messages = [
					...messages,
					{
						role: "assistant",
						sender: "Diagnóstico GPU",
						metaRight: "Aviso de Hardware",
						content:
							"⚠️ **Aviso de Limite de VRAM / Driver GPU:**\n\n" +
							"Seu dispositivo móvel atingiu o limite de memória gráfica ou reiniciou o contexto WebGPU (`device lost`).\n\n" +
							"👉 **Como resolver:**\n" +
							"1. Selecione o modelo **SmolLM3 (360M Mobile)** ou **SmolLM3 (135M Nano)** no menu superior.\n" +
							"2. Eles consomem menos de 400MB de VRAM e são ultra-estáveis em qualquer GPU.",
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

	async function stopGeneration() {
		if (!isGenerating || !engine) return;
		try {
			await engine.interruptGenerate();
		} catch (err) {
			console.warn("Aviso ao interromper geração:", err);
		} finally {
			isGenerating = false;
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

		// Se o histórico estiver vazio e houver prompt de sistema, inicializa-o
		if (messageHistory.length === 0 && customSystemPrompt.trim()) {
			messageHistory = buildInitialHistory();
		}

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
				temperature: 0.6,
				max_tokens: 1024,
				top_p: 0.9,
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
		messageHistory = buildInitialHistory();
		tokens = 0;
		speed = "0.0";
	}
</script>

<svelte:head>
	<title>Sovereign WebGPU Chat | Gabriel Frigo</title>
	<meta
		name="description"
		content="WebGPU Chat Soberano: Inferência de IA 100% Client-Side na GPU local com Llama 3.2, DeepSeek R1, Gemma 4, Qwen3.5 e SmolLM3."
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
		{activePromptName}
		onLoadModel={() => loadModel()}
		onClearChat={clearChat}
		onOpenPromptModal={() => (isPromptModalOpen = true)}
	/>

	<ModelCard spec={selectedSpec} />

	<ProgressBar visible={showProgress} text={progressText} progress={progressPct} />

	<main class="chat-main-container">
		<ChatMessages
			{messages}
			{markedInstance}
			onSelectPrompt={(text) => {
				prompt = text;
			}}
		/>

		<ChatMetrics {activeModelName} {speed} {tokens} />

		<ChatInput
			bind:prompt
			disabled={!isLoaded || isGpuError}
			{isGenerating}
			onSend={sendMessage}
			onStop={stopGeneration}
		/>
	</main>
</div>

<!-- Modal de Configuração do Prompt de Sistema -->
{#if isPromptModalOpen}
	<div
		class="modal-backdrop"
		onclick={() => (isPromptModalOpen = false)}
		onkeydown={(e) => e.key === "Escape" && (isPromptModalOpen = false)}
		role="presentation"
	>
		<!-- svelte-ignore a11y_click_events_have_key_events -->
		<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
		<div
			class="modal-card"
			onclick={(e) => e.stopPropagation()}
			role="dialog"
			aria-modal="true"
			aria-labelledby="modal-title"
			tabindex="-1"
		>
			<div class="modal-header">
				<div class="modal-title-group">
					<span class="modal-icon">⚙️</span>
					<h2 id="modal-title" class="modal-title">Prompt de Sistema da IA</h2>
				</div>
				<button
					class="modal-close-btn"
					onclick={() => (isPromptModalOpen = false)}
					aria-label="Fechar"
				>
					✕
				</button>
			</div>

			<div class="modal-body">
				<p class="modal-desc">
					Defina o comportamento da IA. Modelos menores (135M/360M) respondem com
					muito mais naturalidade com prompts amigáveis e diretos, ou no modo <strong
						>Livre</strong
					>.
				</p>

				<div class="presets-grid">
					{#each SYSTEM_PROMPT_PRESETS as preset}
						<button
							class="preset-card"
							class:selected={selectedPromptPresetId === preset.id}
							onclick={() => {
								selectedPromptPresetId = preset.id;
								if (preset.id !== "custom") {
									customSystemPrompt = preset.prompt;
								}
							}}
						>
							<div class="preset-card-top">
								<span class="preset-name">{preset.name}</span>
								<span class="preset-tag">{preset.tag}</span>
							</div>
							<p class="preset-desc">{preset.desc}</p>
						</button>
					{/each}
				</div>

				<div class="prompt-editor-group">
					<label for="system-prompt-textarea" class="editor-label">
						<span>Instrução ativa:</span>
						{#if !customSystemPrompt.trim()}
							<span class="label-badge-empty">Vazio (Modo Livre)</span>
						{/if}
					</label>
					<textarea
						id="system-prompt-textarea"
						class="prompt-textarea"
						bind:value={customSystemPrompt}
						oninput={() => (selectedPromptPresetId = "custom")}
						placeholder="Digite as diretrizes de comportamento para a IA (ou deixe vazio para modo livre)..."
						rows="3"
					></textarea>
				</div>
			</div>

			<div class="modal-footer">
				<button
					class="modal-btn modal-btn-secondary"
					onclick={() => {
						selectedPromptPresetId = "friendly";
						customSystemPrompt = SYSTEM_PROMPT_PRESETS[0].prompt;
					}}
				>
					Restaurar Padrão
				</button>
				<button
					class="modal-btn modal-btn-primary"
					onclick={() => {
						clearChat();
						isPromptModalOpen = false;
					}}
				>
					Salvar e Reiniciar Chat ⚡
				</button>
			</div>
		</div>
	</div>
{/if}

<style>
	.chat-page-root {
		display: flex;
		flex-direction: column;
		height: 100vh;
		height: 100dvh;
		max-height: 100vh;
		max-height: 100dvh;
		background:
			radial-gradient(circle at 50% 0%, rgba(88, 166, 255, 0.08) 0%, transparent 65%),
			var(--bg-base);
		color: var(--text-main);
		overflow: hidden;
		position: relative;
	}

	.chat-main-container {
		flex: 1;
		display: flex;
		flex-direction: column;
		overflow: hidden;
		max-width: 1080px;
		width: 100%;
		margin: 0 auto;
		padding: 10px 20px 12px 20px;
		padding-bottom: max(12px, env(safe-area-inset-bottom));
	}

	/* Modal de Configuração do Prompt */
	.modal-backdrop {
		position: fixed;
		inset: 0;
		background: rgba(0, 0, 0, 0.75);
		backdrop-filter: blur(8px);
		-webkit-backdrop-filter: blur(8px);
		display: flex;
		align-items: center;
		justify-content: center;
		z-index: 1000;
		padding: 16px;
		animation: fade-in 0.15s ease-out;
	}

	@keyframes fade-in {
		from {
			opacity: 0;
		}
		to {
			opacity: 1;
		}
	}

	.modal-card {
		background: var(--bg-surface);
		border: 1px solid var(--border-default);
		border-radius: 8px;
		max-width: 600px;
		width: 100%;
		box-shadow: 0 20px 50px rgba(0, 0, 0, 0.6);
		display: flex;
		flex-direction: column;
		overflow: hidden;
		animation: scale-up 0.2s cubic-bezier(0.16, 1, 0.3, 1);
	}

	@keyframes scale-up {
		from {
			opacity: 0;
			transform: scale(0.95);
		}
		to {
			opacity: 1;
			transform: scale(1);
		}
	}

	.modal-header {
		padding: 12px 18px;
		border-bottom: 1px solid var(--border-muted);
		background: #06090e;
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.modal-title-group {
		display: flex;
		align-items: center;
		gap: 8px;
	}

	.modal-icon {
		font-size: 14px;
	}

	.modal-title {
		font-family: var(--font-mono);
		font-size: 0.95rem;
		font-weight: 700;
		color: var(--text-main);
	}

	.modal-close-btn {
		background: transparent;
		border: none;
		color: var(--text-dim);
		font-size: 14px;
		cursor: pointer;
		padding: 4px 8px;
		border-radius: 4px;
		transition: all 0.15s ease;
	}

	.modal-close-btn:hover {
		color: var(--text-main);
		background: var(--bg-card);
	}

	.modal-body {
		padding: 18px;
		display: flex;
		flex-direction: column;
		gap: 14px;
	}

	.modal-desc {
		font-size: 0.88rem;
		color: var(--text-muted);
		line-height: 1.5;
	}

	.modal-desc strong {
		color: var(--accent-green);
	}

	.presets-grid {
		display: grid;
		grid-template-columns: repeat(2, 1fr);
		gap: 10px;
	}

	.preset-card {
		background: var(--bg-card);
		border: 1px solid var(--border-muted);
		border-radius: 6px;
		padding: 10px 12px;
		cursor: pointer;
		text-align: left;
		transition: all 0.2s ease;
		display: flex;
		flex-direction: column;
		gap: 4px;
	}

	.preset-card:hover {
		border-color: var(--border-default);
		transform: translateY(-1px);
	}

	.preset-card.selected {
		border-color: var(--accent-blue);
		background: rgba(88, 166, 255, 0.08);
	}

	.preset-card-top {
		display: flex;
		justify-content: space-between;
		align-items: center;
		gap: 6px;
	}

	.preset-name {
		font-family: var(--font-mono);
		font-size: 0.82rem;
		font-weight: 700;
		color: var(--text-main);
	}

	.preset-card.selected .preset-name {
		color: var(--accent-blue);
	}

	.preset-tag {
		font-family: var(--font-mono);
		font-size: 9px;
		padding: 1px 5px;
		border-radius: 3px;
		background: var(--bg-surface);
		border: 1px solid var(--border-muted);
		color: var(--text-dim);
	}

	.preset-desc {
		font-size: 0.78rem;
		color: var(--text-dim);
		line-height: 1.35;
	}

	.prompt-editor-group {
		display: flex;
		flex-direction: column;
		gap: 6px;
		margin-top: 4px;
	}

	.editor-label {
		font-family: var(--font-mono);
		font-size: 0.8rem;
		color: var(--text-muted);
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.label-badge-empty {
		font-size: 9.5px;
		color: var(--accent-orange);
		background: rgba(255, 166, 87, 0.1);
		padding: 1px 6px;
		border-radius: 3px;
		border: 1px solid rgba(255, 166, 87, 0.3);
	}

	.prompt-textarea {
		width: 100%;
		background: var(--bg-card);
		border: 1px solid var(--border-default);
		border-radius: 6px;
		padding: 10px 12px;
		color: var(--text-main);
		font-family: var(--font-sans);
		font-size: 13px;
		line-height: 1.5;
		resize: vertical;
		outline: none;
		min-height: 75px;
	}

	.prompt-textarea:focus {
		border-color: var(--accent-blue);
		box-shadow: 0 0 0 2px rgba(88, 166, 255, 0.2);
	}

	.modal-footer {
		padding: 12px 18px;
		border-top: 1px solid var(--border-muted);
		background: #06090e;
		display: flex;
		justify-content: space-between;
		align-items: center;
		gap: 10px;
	}

	.modal-btn {
		font-family: var(--font-mono);
		font-size: 0.82rem;
		font-weight: 600;
		padding: 6px 14px;
		border-radius: 6px;
		cursor: pointer;
		transition: all 0.2s ease;
	}

	.modal-btn-secondary {
		background: var(--bg-card);
		border: 1px solid var(--border-default);
		color: var(--text-muted);
	}

	.modal-btn-secondary:hover {
		border-color: var(--border-hover);
		color: var(--text-main);
	}

	.modal-btn-primary {
		background: var(--accent-blue);
		border: 1px solid var(--accent-blue);
		color: #090d13;
	}

	.modal-btn-primary:hover {
		background: #79b8ff;
		box-shadow: 0 0 12px rgba(88, 166, 255, 0.4);
	}

	@media (max-width: 640px) {
		.chat-main-container {
			padding: 6px 10px 10px 10px;
			padding-bottom: max(10px, env(safe-area-inset-bottom));
		}

		.presets-grid {
			grid-template-columns: 1fr;
		}

		.modal-footer {
			flex-direction: column-reverse;
		}

		.modal-btn {
			width: 100%;
			text-align: center;
		}
	}
</style>
