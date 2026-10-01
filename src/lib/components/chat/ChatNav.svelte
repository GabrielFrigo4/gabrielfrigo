<script>
	import { MODEL_GROUPS, MODEL_SPECS } from "$lib/chat/models.js";

	let {
		selectedModelKey = $bindable(),
		gpuStatus = "Verificando WebGPU...",
		shortGpuStatus = "WebGPU",
		isGpuError = false,
		isLoading = false,
		isLoaded = false,
		isGenerating = false,
		progressPct = 0,
		activePromptName = "Amigável & Direto",
		hasMessages = false,
		onModelChange = () => {},
		onLoadModel = () => {},
		onClearChat = () => {},
		onOpenPromptModal = () => {},
	} = $props();

	let currentSpec = $derived(MODEL_SPECS[selectedModelKey] || MODEL_SPECS["llama-3.2-1b"]);
</script>

<nav class="chat-nav">
	<div class="nav-container">
		<!-- Marca e Seção -->
		<div class="nav-brand-group">
			<a href="/" class="nav-brand" title="Gabriel Frigo — Página Inicial">
				<span class="brand-symbol">λ</span>
				<span class="brand-text">gabriel<strong>frigo</strong></span>
			</a>
			<span class="nav-sep">/</span>
			<span class="nav-section-title">chat</span>

			<!-- Status da GPU / Modelo em tempo real -->
			<div class="status-indicator">
				{#if isGpuError}
					<span class="pill pill-error" title={gpuStatus}>
						<span class="dot-err"></span>
						<span class="pill-text">Sem WebGPU</span>
					</span>
				{:else if isLoading}
					<span class="pill pill-loading" title="Carregando pesos na GPU local...">
						<span class="pill-spinner"></span>
						<span class="pill-text">{progressPct}%</span>
					</span>
				{:else if isLoaded}
					<span class="pill pill-ready" title="Modelo carregado na GPU">
						<span class="dot-ready"></span>
						<span class="pill-text desktop-only">{currentSpec.name}</span>
						<span class="pill-text mobile-only">Pronto</span>
					</span>
				{:else}
					<span class="pill pill-idle" title={gpuStatus}>
						<span class="dot-idle"></span>
						<span class="pill-text">WebGPU</span>
					</span>
				{/if}
			</div>
		</div>

		<!-- Controles da Barra Superior -->
		<div class="nav-controls">
			<!-- Seletor de Modelo -->
			<div class="select-wrapper">
				<select
					bind:value={selectedModelKey}
					onchange={onModelChange}
					disabled={isLoading || isGenerating}
					aria-label="Selecionar Modelo de IA"
				>
					{#each MODEL_GROUPS as group}
						<optgroup label={group.label}>
							{#each group.options as opt}
								<option value={opt.key}>{opt.label}</option>
							{/each}
						</optgroup>
					{/each}
				</select>
				<span class="select-arrow">▾</span>
			</div>

			<!-- Botão de Carregar Manual (opcional, só quando ainda não carregou) -->
			{#if !isLoaded && !isLoading && !isGpuError}
				<button
					class="nav-btn btn-load desktop-only"
					onclick={onLoadModel}
					title="Carregar pesos na GPU agora"
				>
					Carregar ⚡
				</button>
			{/if}

			<!-- Botão Prompt de Sistema -->
			<button
				class="nav-btn"
				onclick={onOpenPromptModal}
				title="Configurar Prompt de Sistema da IA"
				aria-label="Configurar Prompt de Sistema"
			>
				<span>⚙</span>
				<span class="desktop-only">Prompt:</span>
				<span class="prompt-name desktop-only">{activePromptName}</span>
			</button>

			<!-- Botão Limpar Chat -->
			{#if hasMessages}
				<button
					class="nav-btn"
					onclick={onClearChat}
					disabled={isLoading || isGenerating}
					title="Limpar histórico da conversa"
					aria-label="Limpar histórico da conversa"
				>
					Limpar
				</button>
			{/if}

			<!-- Link para voltar ao Portfólio -->
			<a href="/" class="nav-link-btn" title="Retornar ao Portfólio Principal">
				<span class="desktop-only">← Portfólio</span>
				<span class="mobile-only">←</span>
			</a>
		</div>
	</div>
</nav>

<style>
	.chat-nav {
		background: rgba(13, 17, 23, 0.85);
		backdrop-filter: blur(12px);
		-webkit-backdrop-filter: blur(12px);
		border-bottom: 1px solid var(--border-muted);
		position: sticky;
		top: 0;
		z-index: 100;
		flex-shrink: 0;
	}

	.nav-container {
		max-width: 1200px;
		margin: 0 auto;
		padding: 0.8rem 1.5rem;
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 1rem;
	}

	.nav-brand-group {
		display: flex;
		align-items: center;
		gap: 0.6rem;
		min-width: 0;
	}

	.nav-brand {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		font-family: var(--font-mono);
		font-size: 1.15rem;
		color: var(--text-main);
		text-decoration: none;
		white-space: nowrap;
	}

	.brand-symbol {
		color: var(--accent-blue);
		font-weight: 700;
	}

	.nav-sep {
		color: var(--text-dim);
		font-family: var(--font-mono);
		opacity: 0.6;
	}

	.nav-section-title {
		font-family: var(--font-mono);
		font-size: 0.95rem;
		color: var(--accent-green);
		font-weight: 500;
	}

	.status-indicator {
		display: flex;
		align-items: center;
		margin-left: 0.25rem;
	}

	.pill {
		display: inline-flex;
		align-items: center;
		gap: 6px;
		padding: 2px 8px;
		border-radius: 999px;
		font-family: var(--font-mono);
		font-size: 0.75rem;
		border: 1px solid transparent;
		white-space: nowrap;
	}

	.pill-idle {
		background: rgba(139, 148, 158, 0.1);
		color: var(--text-muted);
		border-color: var(--border-muted);
	}

	.dot-idle {
		width: 6px;
		height: 6px;
		border-radius: 50%;
		background: var(--text-muted);
	}

	.pill-ready {
		background: rgba(126, 231, 135, 0.1);
		color: var(--accent-green);
		border-color: rgba(126, 231, 135, 0.25);
	}

	.dot-ready {
		width: 6px;
		height: 6px;
		border-radius: 50%;
		background: var(--accent-green);
		box-shadow: 0 0 6px var(--accent-green);
	}

	.pill-loading {
		background: rgba(88, 166, 255, 0.1);
		color: var(--accent-blue);
		border-color: rgba(88, 166, 255, 0.25);
	}

	.pill-spinner {
		width: 8px;
		height: 8px;
		border: 1.5px solid rgba(88, 166, 255, 0.3);
		border-top-color: var(--accent-blue);
		border-radius: 50%;
		animation: spin 0.8s linear infinite;
	}

	@keyframes spin {
		to {
			transform: rotate(360deg);
		}
	}

	.pill-error {
		background: rgba(255, 123, 114, 0.1);
		color: var(--accent-coral);
		border-color: rgba(255, 123, 114, 0.25);
	}

	.dot-err {
		width: 6px;
		height: 6px;
		border-radius: 50%;
		background: var(--accent-coral);
	}

	.nav-controls {
		display: flex;
		align-items: center;
		gap: 0.6rem;
		flex-shrink: 0;
	}

	.select-wrapper {
		position: relative;
		display: inline-flex;
		align-items: center;
	}

	.select-wrapper select {
		appearance: none;
		-webkit-appearance: none;
		background: var(--bg-surface);
		border: 1px solid var(--border-subtle);
		border-radius: 6px;
		padding: 0.35rem 1.8rem 0.35rem 0.75rem;
		font-family: var(--font-mono);
		font-size: 0.82rem;
		color: var(--text-main);
		cursor: pointer;
		outline: none;
		transition: all 0.15s ease;
		max-width: 280px;
		text-overflow: ellipsis;
	}

	.select-wrapper select:hover:not(:disabled) {
		border-color: var(--border-hover);
	}

	.select-wrapper select:focus {
		border-color: var(--accent-blue);
	}

	.select-arrow {
		position: absolute;
		right: 0.6rem;
		pointer-events: none;
		color: var(--text-dim);
		font-size: 0.75rem;
	}

	.nav-btn {
		display: inline-flex;
		align-items: center;
		gap: 5px;
		padding: 0.35rem 0.75rem;
		background: var(--bg-surface);
		border: 1px solid var(--border-subtle);
		border-radius: 6px;
		font-size: 0.82rem;
		color: var(--text-muted);
		font-family: var(--font-mono);
		cursor: pointer;
		transition: all 0.15s ease;
		white-space: nowrap;
	}

	.nav-btn:hover:not(:disabled) {
		border-color: var(--border-hover);
		color: var(--text-main);
	}

	.nav-btn:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}

	.btn-load {
		color: var(--accent-blue);
		border-color: rgba(88, 166, 255, 0.3);
	}

	.btn-load:hover:not(:disabled) {
		border-color: var(--accent-blue);
		background: rgba(88, 166, 255, 0.08);
	}

	.prompt-name {
		color: var(--text-main);
	}

	.nav-link-btn {
		padding: 0.35rem 0.75rem;
		background: var(--bg-surface);
		border: 1px solid var(--border-subtle);
		border-radius: 6px;
		font-size: 0.82rem;
		color: var(--text-main);
		font-family: var(--font-mono);
		text-decoration: none;
		transition: all 0.15s ease;
		white-space: nowrap;
	}

	.nav-link-btn:hover {
		border-color: var(--border-hover);
	}

	@media (max-width: 900px) {
		.select-wrapper select {
			max-width: 200px;
		}
	}

	@media (max-width: 768px) {
		.nav-container {
			padding: 0.6rem 1rem;
		}

		.desktop-only {
			display: none !important;
		}

		.select-wrapper select {
			max-width: 140px;
			font-size: 0.75rem;
			padding: 0.3rem 1.4rem 0.3rem 0.5rem;
		}
	}

	@media (min-width: 769px) {
		.mobile-only {
			display: none !important;
		}
	}
</style>
