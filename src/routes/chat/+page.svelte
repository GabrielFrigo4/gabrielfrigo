<script>
	import { onMount } from "svelte";
	import { MODEL_SPECS, SYSTEM_PROMPT_PRESETS } from "$lib/chat/models.js";
	import { getMarked } from "$lib/chat/markdown.js";
	import { checkWebGPU, getWebLLM } from "$lib/chat/webllm.js";

	import ChatNav from "$lib/components/chat/ChatNav.svelte";
	import ProgressBar from "$lib/components/chat/ProgressBar.svelte";
	import ChatMessages from "$lib/components/chat/ChatMessages.svelte";
	import ChatInput from "$lib/components/chat/ChatInput.svelte";

	// Estado reativo Svelte 5 com Runes
	let selectedModelKey = $state("qwen-3.5-0.8b");
	let selectedSpec = $derived(MODEL_SPECS[selectedModelKey] || MODEL_SPECS["qwen-3.5-0.8b"]);

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
	let messages = $state([]);

	onMount(async () => {
		const gpuResult = await checkWebGPU();
		gpuStatus = gpuResult.status;
		shortGpuStatus = gpuResult.shortStatus;
		isGpuError = gpuResult.isError;
		isMobileDevice = gpuResult.isMobile;

		// No mobile, seleciona Qwen 3.5 (0.8B) por padrão para máxima fluidez
		if (isMobileDevice) {
			selectedModelKey = "qwen-3.5-0.8b";
		} else {
			selectedModelKey = "deepseek-r1-1.5b";
		}

		markedInstance = await getMarked();
	});

	async function loadModel(overrideModelId = null) {
		if (isGpuError || isLoading || isGenerating) return;

		isLoading = true;
		showProgress = true;
		progressPct = 0;
		progressText = `Preparando ${selectedSpec.name} na GPU...`;

		// Liberação de VRAM do modelo anterior se houver
		if (engine) {
			try {
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
			}, 1200);
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
				messages = [
					...messages,
					{
						role: "assistant",
						sender: "Diagnóstico GPU",
						metaRight: "Aviso de VRAM",
						content:
							"⚠️ **Limite de Memória Gráfica (VRAM):**\n\n" +
							"A GPU não conseguiu alocar o modelo selecionado. Experimente o **SmolLM3 (360M)** ou **SmolLM3 (135M)**.",
					},
				];
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
		if (!text || isGenerating || isLoading || isGpuError) return;

		prompt = "";

		// Auto-carregamento transparente: se ainda não foi carregado, carrega agora
		if (!isLoaded || !engine) {
			await loadModel();
			if (!engine) {
				prompt = text;
				return;
			}
		}

		isGenerating = true;

		const userMsg = {
			role: "user",
			sender: "Você",
			timestamp: new Date().toLocaleTimeString([], {
				hour: "2-digit",
				minute: "2-digit",
			}),
			content: text,
		};

		messages = [...messages, userMsg];

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
						metaRight: `${tokPerSec} tok/s · ${tokenCount} tokens · WebGPU`,
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

	async function handleSelectPrompt(text) {
		prompt = text;
		await sendMessage();
	}

	async function handleModelChange() {
		if (isLoaded) {
			await loadModel();
		}
	}

	function clearChat() {
		messages = [];
		messageHistory = buildInitialHistory();
		tokens = 0;
		speed = "0.0";
	}
</script>

<svelte:head>
	<title>Sovereign WebGPU Chat | Gabriel Frigo</title>
	<meta
		name="description"
		content="WebGPU Chat Soberano: Inferência de IA 100% Client-Side na GPU local com Qwen 3.5, DeepSeek R1, Phi-4 e Ministral 3."
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
		{progressPct}
		{activePromptName}
		hasMessages={messages.length > 0}
		onModelChange={handleModelChange}
		onLoadModel={() => loadModel()}
		onClearChat={clearChat}
		onOpenPromptModal={() => (isPromptModalOpen = true)}
	/>

	<ProgressBar visible={showProgress} text={progressText} progress={progressPct} />

	<main class="chat-main-container">
		<ChatMessages
			{messages}
			{markedInstance}
			{isGenerating}
			onSelectPrompt={handleSelectPrompt}
		/>

		<ChatInput
			bind:prompt
			{isGenerating}
			{isLoading}
			{isGpuError}
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
					<span class="modal-icon">⚙</span>
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
				<p class="modal-desc">Defina as diretrizes para as respostas da IA local.</p>

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
						placeholder="Digite as instruções (ou deixe vazio para modo livre)..."
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
					Salvar e Reiniciar
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
			radial-gradient(circle at 50% 0%, rgba(88, 166, 255, 0.05) 0%, transparent 60%),
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
		max-width: 900px;
		width: 100%;
		margin: 0 auto;
		padding: 0.5rem 1.5rem 1rem 1.5rem;
		padding-bottom: max(1rem, env(safe-area-inset-bottom));
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
		border: 1px solid var(--border-subtle);
		border-radius: 8px;
		max-width: 560px;
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
			transform: scale(0.96);
		}
		to {
			opacity: 1;
			transform: scale(1);
		}
	}

	.modal-header {
		padding: 12px 18px;
		border-bottom: 1px solid var(--border-muted);
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
		font-size: 15px;
		color: var(--accent-blue);
	}

	.modal-title {
		font-family: var(--font-mono);
		font-size: 14px;
		font-weight: 600;
		color: var(--text-main);
		margin: 0;
	}

	.modal-close-btn {
		background: transparent;
		border: none;
		color: var(--text-dim);
		font-size: 14px;
		cursor: pointer;
		padding: 4px;
		border-radius: 4px;
		line-height: 1;
		transition: color 0.15s ease;
	}

	.modal-close-btn:hover {
		color: var(--text-main);
	}

	.modal-body {
		padding: 16px 18px;
		display: flex;
		flex-direction: column;
		gap: 14px;
		overflow-y: auto;
		max-height: 70vh;
	}

	.modal-desc {
		font-size: 13px;
		color: var(--text-muted);
		line-height: 1.5;
		margin: 0;
	}

	.presets-grid {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 8px;
	}

	.preset-card {
		background: var(--bg-card);
		border: 1px solid var(--border-muted);
		border-radius: 6px;
		padding: 10px 12px;
		cursor: pointer;
		text-align: left;
		transition: all 0.15s ease;
		display: flex;
		flex-direction: column;
		gap: 4px;
	}

	.preset-card:hover {
		border-color: var(--border-hover);
		background: rgba(22, 27, 34, 0.9);
	}

	.preset-card.selected {
		border-color: var(--accent-blue);
		background: rgba(88, 166, 255, 0.08);
	}

	.preset-card-top {
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.preset-name {
		font-family: var(--font-mono);
		font-size: 12px;
		font-weight: 600;
		color: var(--text-main);
	}

	.preset-tag {
		font-family: var(--font-mono);
		font-size: 10px;
		padding: 1px 5px;
		border-radius: 4px;
		background: var(--bg-surface);
		border: 1px solid var(--border-muted);
		color: var(--text-dim);
	}

	.preset-card.selected .preset-tag {
		border-color: rgba(88, 166, 255, 0.4);
		color: var(--accent-blue);
	}

	.preset-desc {
		font-size: 11px;
		color: var(--text-dim);
		line-height: 1.4;
		margin: 0;
	}

	.prompt-editor-group {
		display: flex;
		flex-direction: column;
		gap: 6px;
	}

	.editor-label {
		display: flex;
		justify-content: space-between;
		align-items: center;
		font-family: var(--font-mono);
		font-size: 11px;
		color: var(--text-muted);
		font-weight: 500;
	}

	.label-badge-empty {
		color: var(--accent-cyan);
		font-size: 10px;
	}

	.prompt-textarea {
		width: 100%;
		background: var(--bg-card);
		border: 1px solid var(--border-muted);
		border-radius: 6px;
		padding: 10px;
		color: var(--text-main);
		font-family: var(--font-mono);
		font-size: 12px;
		line-height: 1.5;
		resize: vertical;
		outline: none;
		transition: border-color 0.15s ease;
	}

	.prompt-textarea:focus {
		border-color: var(--accent-blue);
	}

	.modal-footer {
		padding: 12px 18px;
		border-top: 1px solid var(--border-muted);
		display: flex;
		justify-content: flex-end;
		gap: 8px;
		background: rgba(9, 13, 19, 0.6);
	}

	.modal-btn {
		font-family: var(--font-mono);
		font-size: 12px;
		font-weight: 600;
		padding: 6px 14px;
		border-radius: 6px;
		cursor: pointer;
		transition: all 0.15s ease;
	}

	.modal-btn-secondary {
		background: transparent;
		border: 1px solid var(--border-muted);
		color: var(--text-muted);
	}

	.modal-btn-secondary:hover {
		border-color: var(--border-hover);
		color: var(--text-main);
	}

	.modal-btn-primary {
		background: var(--accent-blue);
		border: 1px solid var(--accent-blue);
		color: #0d1117;
	}

	.modal-btn-primary:hover {
		background: #79b8ff;
	}

	@media (max-width: 640px) {
		.chat-main-container {
			padding: 0.5rem 1rem 0.75rem 1rem;
		}

		.presets-grid {
			grid-template-columns: 1fr;
		}
	}
</style>
