<script>
	import { MODEL_GROUPS, MODEL_SPECS } from "$lib/chat/models.js";

	let {
		selectedModelKey = $bindable(),
		gpuStatus = "Verificando WebGPU...",
		shortGpuStatus = "WebGPU",
		isGpuError = false,
		isGpuSoftware = false,
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

	let mobileMenuOpen = $state(false);
	let currentSpec = $derived(MODEL_SPECS[selectedModelKey] || MODEL_SPECS["qwen-3.5-0.8b"]);
</script>

<nav class="chat-nav">
	<div class="nav-container">
		<div class="nav-brand-group">
			<a href="/" class="nav-brand" title="Gabriel Frigo — Página Inicial">
				<span class="brand-symbol">λ</span>
				<span class="brand-text"
					><span class="brand-name-full">gabriel</span><strong>frigo</strong></span
				>
			</a>
			<span class="nav-sep desktop-only">/</span>
			<span class="nav-section-title desktop-only">chat</span>

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
					<span
						class="pill"
						class:pill-ready={!isGpuSoftware}
						class:pill-warn={isGpuSoftware}
						title={`${gpuStatus} · Modelo pronto`}
					>
						<span class="dot-ready" class:dot-warn={isGpuSoftware}></span>
						<span class="pill-text">{shortGpuStatus}</span>
					</span>
				{:else}
					<span
						class="pill pill-idle"
						class:pill-warn={isGpuSoftware}
						title={gpuStatus}
					>
						<span class="dot-idle" class:dot-warn={isGpuSoftware}></span>
						<span class="pill-text">{shortGpuStatus}</span>
					</span>
				{/if}
			</div>
		</div>

		<div class="nav-controls">
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
				<svg
					class="select-arrow"
					width="12"
					height="12"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2.5"
					stroke-linecap="round"
					stroke-linejoin="round"
					aria-hidden="true"
				>
					<polyline points="6 9 12 15 18 9" />
				</svg>
			</div>

			{#if !isLoaded && !isLoading && !isGpuError}
				<button
					class="nav-btn btn-load desktop-only"
					onclick={onLoadModel}
					title="Carregar pesos na GPU agora"
				>
					<span>Carregar</span>
					<svg
						class="bolt-icon"
						width="13"
						height="13"
						viewBox="0 0 24 24"
						fill="currentColor"
						aria-hidden="true"
					>
						<polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
					</svg>
				</button>
			{/if}

			<button
				class="nav-btn desktop-only"
				onclick={onOpenPromptModal}
				title="Configurar Prompt de Sistema da IA"
				aria-label="Configurar Prompt de Sistema"
			>
				<svg
					class="btn-icon icon-prompt"
					width="15"
					height="15"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2"
					stroke-linecap="round"
					stroke-linejoin="round"
					aria-hidden="true"
				>
					<circle cx="12" cy="12" r="3" />
					<path
						d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"
					/>
				</svg>
				<span>Prompt:</span>
				<span class="prompt-name">{activePromptName}</span>
			</button>

			{#if hasMessages}
				<button
					class="nav-btn desktop-only"
					onclick={onClearChat}
					disabled={isLoading || isGenerating}
					title="Limpar histórico da conversa"
					aria-label="Limpar histórico da conversa"
				>
					<svg
						class="btn-icon"
						width="14"
						height="14"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="2"
						stroke-linecap="round"
						stroke-linejoin="round"
						aria-hidden="true"
					>
						<path
							d="M3 6h18m-2 0v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6m3 0V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"
						/>
					</svg>
					<span>Limpar</span>
				</button>
			{/if}

			<a
				href="/"
				class="nav-link-btn desktop-only"
				title="Retornar ao Portfólio Principal"
			>
				<svg
					class="btn-icon icon-back"
					width="15"
					height="15"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2.2"
					stroke-linecap="round"
					stroke-linejoin="round"
					aria-hidden="true"
				>
					<path d="M19 12H5M12 19l-7-7 7-7" />
				</svg>
				<span>Portfólio</span>
			</a>

			<button
				type="button"
				class="mobile-menu-btn mobile-only"
				onclick={() => (mobileMenuOpen = !mobileMenuOpen)}
				aria-label="Menu de Navegação"
				aria-expanded={mobileMenuOpen}
			>
				{#if mobileMenuOpen}
					<svg
						width="18"
						height="18"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="2.2"
						stroke-linecap="round"
						stroke-linejoin="round"
						aria-hidden="true"
					>
						<line x1="18" y1="6" x2="6" y2="18" />
						<line x1="6" y1="6" x2="18" y2="18" />
					</svg>
				{:else}
					<svg
						width="18"
						height="18"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="2.2"
						stroke-linecap="round"
						stroke-linejoin="round"
						aria-hidden="true"
					>
						<line x1="4" y1="6" x2="20" y2="6" />
						<line x1="4" y1="12" x2="20" y2="12" />
						<line x1="4" y1="18" x2="20" y2="18" />
					</svg>
				{/if}
			</button>
		</div>
	</div>

	{#if mobileMenuOpen}
		<div class="mobile-drawer">
			{#if !isLoaded && !isLoading && !isGpuError}
				<button
					type="button"
					class="mobile-drawer-btn mobile-btn-load"
					onclick={() => {
						mobileMenuOpen = false;
						onLoadModel();
					}}
				>
					<svg
						class="drawer-icon"
						width="16"
						height="16"
						viewBox="0 0 24 24"
						fill="currentColor"
						aria-hidden="true"
					>
						<polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
					</svg>
					<span>Carregar Modelo na GPU</span>
				</button>
			{/if}

			<button
				type="button"
				class="mobile-drawer-btn"
				onclick={() => {
					mobileMenuOpen = false;
					onOpenPromptModal();
				}}
			>
				<svg
					class="drawer-icon icon-prompt"
					width="16"
					height="16"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2"
					stroke-linecap="round"
					stroke-linejoin="round"
					aria-hidden="true"
				>
					<circle cx="12" cy="12" r="3" />
					<path
						d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"
					/>
				</svg>
				<span>Prompt de Sistema ({activePromptName})</span>
			</button>

			{#if hasMessages}
				<button
					type="button"
					class="mobile-drawer-btn"
					disabled={isLoading || isGenerating}
					onclick={() => {
						mobileMenuOpen = false;
						onClearChat();
					}}
				>
					<svg
						class="drawer-icon"
						width="16"
						height="16"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="2"
						stroke-linecap="round"
						stroke-linejoin="round"
						aria-hidden="true"
					>
						<path
							d="M3 6h18m-2 0v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6m3 0V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"
						/>
					</svg>
					<span>Limpar Histórico do Chat</span>
				</button>
			{/if}

			<a href="/" class="mobile-drawer-link" onclick={() => (mobileMenuOpen = false)}>
				<svg
					class="drawer-icon"
					width="16"
					height="16"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2.2"
					stroke-linecap="round"
					stroke-linejoin="round"
					aria-hidden="true"
				>
					<path d="M19 12H5M12 19l-7-7 7-7" />
				</svg>
				<span>Retornar ao Portfólio</span>
			</a>
		</div>
	{/if}
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
		flex-shrink: 0;
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
		flex-shrink: 0;
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
		flex-shrink: 0;
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

	.pill-warn {
		background: rgba(255, 123, 114, 0.12) !important;
		color: var(--accent-coral) !important;
		border-color: rgba(255, 123, 114, 0.3) !important;
	}

	.dot-warn {
		width: 6px;
		height: 6px;
		border-radius: 50%;
		background: var(--accent-coral) !important;
		box-shadow: 0 0 6px var(--accent-coral) !important;
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
		max-width: 240px;
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
		right: 0.65rem;
		top: 50%;
		transform: translateY(-50%);
		pointer-events: none;
		color: var(--text-dim);
	}

	.btn-icon {
		display: inline-block;
		flex-shrink: 0;
		vertical-align: middle;
	}

	.nav-btn {
		display: inline-flex;
		align-items: center;
		gap: 6px;
		padding: 0.38rem 0.75rem;
		background: var(--bg-surface);
		border: 1px solid var(--border-subtle);
		border-radius: 6px;
		font-size: 0.82rem;
		color: var(--text-muted);
		font-family: var(--font-mono);
		cursor: pointer;
		transition: all 0.15s ease;
		white-space: nowrap;
		line-height: 1;
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

	.bolt-icon {
		flex-shrink: 0;
	}

	.icon-prompt {
		color: var(--accent-blue);
		transition: transform 0.25s ease;
	}

	.nav-btn:hover:not(:disabled) .icon-prompt {
		transform: rotate(45deg);
	}

	.prompt-name {
		color: var(--text-main);
	}

	.nav-link-btn {
		display: inline-flex;
		align-items: center;
		gap: 6px;
		padding: 0.38rem 0.75rem;
		background: var(--bg-surface);
		border: 1px solid var(--border-subtle);
		border-radius: 6px;
		font-size: 0.82rem;
		color: var(--text-main);
		font-family: var(--font-mono);
		text-decoration: none;
		transition: all 0.15s ease;
		white-space: nowrap;
		line-height: 1;
	}

	.nav-link-btn:hover {
		border-color: var(--border-hover);
		color: var(--accent-blue);
	}

	.icon-back {
		color: var(--text-muted);
		transition:
			transform 0.15s ease,
			color 0.15s ease;
	}

	.nav-link-btn:hover .icon-back {
		color: var(--accent-blue);
		transform: translateX(-2.5px);
	}

	.mobile-menu-btn {
		display: none;
		background: var(--bg-surface);
		border: 1px solid var(--border-subtle);
		color: var(--text-main);
		padding: 0.35rem;
		border-radius: 6px;
		cursor: pointer;
		align-items: center;
		justify-content: center;
		min-width: 32px;
		min-height: 32px;
		transition:
			border-color 0.15s ease,
			color 0.15s ease;
	}

	.mobile-menu-btn:hover {
		border-color: var(--border-hover);
		color: var(--accent-blue);
	}

	.mobile-drawer {
		display: flex;
		flex-direction: column;
		background: rgba(9, 13, 19, 0.98);
		border-top: 1px solid var(--border-muted);
		padding: 0.75rem 1rem 1rem 1rem;
		gap: 0.35rem;
		animation: slide-down 0.2s cubic-bezier(0.16, 1, 0.3, 1);
	}

	@keyframes slide-down {
		from {
			opacity: 0;
			transform: translateY(-8px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}

	.mobile-drawer-btn,
	.mobile-drawer-link {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		padding: 0.75rem 0.6rem;
		background: transparent;
		border: none;
		border-bottom: 1px solid var(--border-muted);
		color: var(--text-muted);
		font-family: var(--font-sans);
		font-size: 0.9rem;
		cursor: pointer;
		text-decoration: none;
		text-align: left;
		width: 100%;
		transition:
			color 0.15s ease,
			background-color 0.15s ease;
	}

	.mobile-drawer-btn:hover:not(:disabled),
	.mobile-drawer-link:hover {
		color: var(--text-main);
		background: rgba(255, 255, 255, 0.03);
	}

	.mobile-btn-load {
		color: var(--accent-blue);
		font-weight: 600;
	}

	.mobile-drawer-btn:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}

	.drawer-icon {
		flex-shrink: 0;
	}

	.mobile-only {
		display: none !important;
	}

	@media (max-width: 900px) {
		.select-wrapper select {
			max-width: 180px;
		}
	}

	@media (max-width: 768px) {
		.nav-container {
			padding: 0.5rem 0.75rem;
			gap: 0.5rem;
		}

		.desktop-only {
			display: none !important;
		}

		.mobile-only {
			display: inline-flex !important;
		}

		.nav-brand-group {
			gap: 0.4rem;
		}

		.brand-name-full {
			display: none;
		}

		.brand-text {
			font-size: 1.05rem;
		}

		.status-indicator .pill {
			padding: 2px 6px;
			font-size: 0.7rem;
			max-width: 85px;
		}

		.status-indicator .pill-text {
			overflow: hidden;
			text-overflow: ellipsis;
			white-space: nowrap;
		}

		.nav-controls {
			gap: 0.35rem;
		}

		.select-wrapper select {
			max-width: 130px;
			font-size: 0.74rem;
			padding: 0.3rem 1.3rem 0.3rem 0.5rem;
		}
	}

	@media (max-width: 440px) {
		.nav-container {
			padding: 0.45rem 0.5rem;
			gap: 0.35rem;
		}

		.status-indicator .pill {
			padding: 3px;
			min-width: 14px;
			height: 14px;
			border-radius: 50%;
			justify-content: center;
		}

		.status-indicator .pill-text {
			display: none;
		}

		.select-wrapper select {
			max-width: 105px;
			font-size: 0.7rem;
			padding: 0.28rem 1.1rem 0.28rem 0.4rem;
		}

		.nav-controls {
			gap: 0.25rem;
		}
	}
</style>
