<script>
	import { MODEL_GROUPS } from "$lib/chat/models.js";

	let {
		selectedModelKey = $bindable(),
		gpuStatus = "Verificando WebGPU...",
		shortGpuStatus = "WebGPU",
		isGpuError = false,
		isLoading = false,
		isLoaded = false,
		isGenerating = false,
		activePromptName = "Amigável & Direto",
		onLoadModel,
		onClearChat,
		onOpenPromptModal,
	} = $props();
</script>

<header class="chat-header">
	<div class="header-top">
		<div class="brand-group">
			<a href="/" class="nav-brand" title="Gabriel Frigo — Página Inicial">
				<span class="brand-symbol">λ</span>
				<span class="brand-text">gabriel<strong>frigo</strong></span>
			</a>
			<span class="nav-sep">/</span>
			<span class="nav-section-title">chat</span>
			<span class="badge-webgpu">WebGPU ⚡</span>
		</div>

		<div class="header-actions">
			<!-- Botão de Configuração de Prompt de Sistema -->
			<button
				class="btn-nav-action prompt-action-btn"
				onclick={onOpenPromptModal}
				title="Configurar Prompt de Sistema da IA"
				aria-label="Configurar Prompt de Sistema"
			>
				<span class="action-icon">⚙️</span>
				<span class="desktop-only">Prompt:</span>
				<span class="prompt-chip">{activePromptName}</span>
			</button>

			<!-- Status da GPU -->
			<div class="gpu-status {isGpuError ? 'status-err' : 'status-ok'}" title={gpuStatus}>
				<span class="status-dot"></span>
				<span class="status-label desktop-only">{gpuStatus}</span>
				<span class="status-label mobile-only">{shortGpuStatus}</span>
			</div>

			<!-- Botão Limpar -->
			<button
				class="btn-nav-action"
				onclick={onClearChat}
				disabled={isLoading || isGenerating}
				title="Limpar histórico da conversa"
				aria-label="Limpar histórico da conversa"
			>
				<svg
					class="clear-icon"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2"
					stroke-linecap="round"
					stroke-linejoin="round"
					width="13"
					height="13"
				>
					<path d="M3 6h18" />
					<path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
					<path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
				</svg>
				<span class="desktop-only">Limpar</span>
			</button>

			<!-- Link para voltar ao Portfólio -->
			<a href="/" class="btn-nav-link" title="Retornar ao Portfólio Principal">
				<span class="desktop-only">← Portfólio</span>
				<span class="mobile-only">← Início</span>
			</a>
		</div>
	</div>

	<!-- Linha de Seleção e Carregamento de Modelo -->
	<div class="header-controls">
		<div class="select-wrapper">
			<select
				bind:value={selectedModelKey}
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
			<span class="select-arrow">▼</span>
		</div>

		<button
			class="btn-primary"
			disabled={isLoading || isGpuError || isGenerating}
			onclick={onLoadModel}
		>
			{#if isLoading}
				<span class="btn-spinner"></span>
				<span>Carregando...</span>
			{:else if isLoaded}
				<span class="desktop-only">Trocar / Recarregar</span>
				<span class="mobile-only">Recarregar</span>
			{:else}
				<span class="desktop-only">Carregar Modelo ⚡</span>
				<span class="mobile-only">Carregar ⚡</span>
			{/if}
		</button>
	</div>
</header>

<style>
	.chat-header {
		background: rgba(9, 13, 19, 0.92);
		backdrop-filter: blur(12px);
		-webkit-backdrop-filter: blur(12px);
		border-bottom: 1px solid var(--border-muted);
		padding: 10px 20px;
		display: flex;
		flex-direction: column;
		gap: 10px;
		position: relative;
		z-index: 20;
		flex-shrink: 0;
	}

	.header-top {
		display: flex;
		justify-content: space-between;
		align-items: center;
		gap: 12px;
	}

	.brand-group {
		display: flex;
		align-items: center;
		gap: 8px;
	}

	.nav-brand {
		display: flex;
		align-items: center;
		gap: 6px;
		font-family: var(--font-mono);
		font-size: 1.05rem;
		color: var(--text-main);
		text-decoration: none;
	}

	.brand-symbol {
		color: var(--accent-coral);
		font-weight: 700;
		font-size: 1.2rem;
	}

	.brand-text strong {
		color: var(--accent-blue);
	}

	.nav-sep {
		color: var(--border-default);
		font-size: 14px;
		user-select: none;
	}

	.nav-section-title {
		font-family: var(--font-mono);
		font-size: 0.9rem;
		color: var(--text-muted);
		font-weight: 500;
	}

	.badge-webgpu {
		background: rgba(126, 231, 135, 0.12);
		color: var(--accent-green);
		border: 1px solid rgba(126, 231, 135, 0.35);
		font-size: 10px;
		font-family: var(--font-mono);
		font-weight: 700;
		padding: 2px 7px;
		border-radius: 999px;
		letter-spacing: 0.3px;
		white-space: nowrap;
	}

	.header-actions {
		display: flex;
		align-items: center;
		gap: 8px;
	}

	.btn-nav-action {
		font-family: var(--font-mono);
		font-size: 0.8rem;
		padding: 5px 10px;
		border-radius: 6px;
		background: var(--bg-card);
		border: 1px solid var(--border-default);
		color: var(--text-muted);
		cursor: pointer;
		display: inline-flex;
		align-items: center;
		gap: 6px;
		transition: all 0.2s ease;
		white-space: nowrap;
	}

	.btn-nav-action:hover:not(:disabled) {
		border-color: var(--border-hover);
		color: var(--text-main);
	}

	.btn-nav-action:disabled {
		opacity: 0.45;
		cursor: not-allowed;
	}

	.prompt-action-btn {
		background: rgba(22, 27, 34, 0.8);
	}

	.action-icon {
		font-size: 11px;
	}

	.prompt-chip {
		color: var(--accent-blue);
		font-weight: 600;
		max-width: 140px;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.btn-nav-link {
		font-family: var(--font-mono);
		font-size: 0.82rem;
		padding: 5px 11px;
		border-radius: 6px;
		background: var(--bg-card);
		border: 1px solid var(--border-default);
		color: var(--text-main);
		transition: all 0.2s ease;
		text-decoration: none;
		display: inline-flex;
		align-items: center;
		white-space: nowrap;
	}

	.btn-nav-link:hover {
		border-color: var(--accent-blue);
		color: var(--accent-blue);
	}

	.gpu-status {
		font-family: var(--font-mono);
		font-size: 11px;
		font-weight: 600;
		padding: 4px 10px;
		border-radius: 999px;
		display: flex;
		align-items: center;
		gap: 6px;
		white-space: nowrap;
	}

	.status-ok {
		background: rgba(126, 231, 135, 0.1);
		color: var(--accent-green);
		border: 1px solid rgba(126, 231, 135, 0.35);
	}

	.status-err {
		background: rgba(255, 123, 114, 0.1);
		color: var(--accent-coral);
		border: 1px solid rgba(255, 123, 114, 0.35);
	}

	.status-dot {
		width: 6px;
		height: 6px;
		border-radius: 50%;
		background-color: currentColor;
		flex-shrink: 0;
	}

	.status-ok .status-dot {
		box-shadow: 0 0 6px var(--accent-green);
	}

	.header-controls {
		display: flex;
		align-items: center;
		gap: 8px;
		width: 100%;
	}

	.select-wrapper {
		position: relative;
		flex: 1;
		display: flex;
		align-items: center;
		min-width: 0;
	}

	select {
		width: 100%;
		appearance: none;
		-webkit-appearance: none;
		background-color: var(--bg-card);
		color: var(--text-main);
		border: 1px solid var(--border-default);
		padding: 7px 28px 7px 11px;
		border-radius: 6px;
		font-family: var(--font-mono);
		font-size: 12.5px;
		cursor: pointer;
		font-weight: 500;
		outline: none;
		transition: all 0.2s ease;
		text-overflow: ellipsis;
		white-space: nowrap;
		overflow: hidden;
	}

	select:hover:not(:disabled) {
		border-color: var(--border-hover);
		background-color: var(--bg-card-hover);
	}

	select:focus {
		border-color: var(--accent-blue);
		box-shadow: 0 0 0 2px rgba(88, 166, 255, 0.25);
	}

	select:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}

	.select-arrow {
		position: absolute;
		right: 10px;
		pointer-events: none;
		font-size: 8px;
		color: var(--text-dim);
	}

	optgroup {
		background-color: var(--bg-surface);
		color: var(--accent-blue);
		font-weight: 700;
	}

	option {
		background-color: var(--bg-card);
		color: var(--text-main);
	}

	.btn-primary {
		font-family: var(--font-mono);
		font-size: 12.5px;
		border-radius: 6px;
		padding: 7px 14px;
		font-weight: 600;
		cursor: pointer;
		transition: all 0.2s ease;
		border: 1px solid var(--accent-blue);
		background: var(--accent-blue);
		color: #090d13;
		display: inline-flex;
		align-items: center;
		justify-content: center;
		gap: 6px;
		white-space: nowrap;
		flex-shrink: 0;
	}

	.btn-primary:hover:not(:disabled) {
		background: #79b8ff;
		box-shadow: 0 0 16px rgba(88, 166, 255, 0.4);
		transform: translateY(-1px);
	}

	.btn-primary:disabled {
		opacity: 0.45;
		cursor: not-allowed;
		box-shadow: none;
		transform: none;
	}

	.btn-spinner {
		width: 12px;
		height: 12px;
		border: 2px solid rgba(9, 13, 19, 0.3);
		border-top-color: #090d13;
		border-radius: 50%;
		animation: spin 0.8s linear infinite;
	}

	@keyframes spin {
		to {
			transform: rotate(360deg);
		}
	}

	.mobile-only {
		display: none;
	}

	.desktop-only {
		display: inline;
	}

	@media (min-width: 860px) {
		.chat-header {
			flex-direction: row;
			justify-content: space-between;
			align-items: center;
			padding: 10px 24px;
		}

		.header-controls {
			width: auto;
			justify-content: flex-end;
		}

		.select-wrapper {
			flex: 0 0 290px;
		}
	}

	@media (max-width: 640px) {
		.chat-header {
			padding: 8px 12px;
			gap: 8px;
		}

		.mobile-only {
			display: inline;
		}

		.desktop-only {
			display: none;
		}

		.nav-brand {
			font-size: 0.95rem;
		}

		.badge-webgpu {
			font-size: 9px;
			padding: 1px 5px;
		}

		select {
			font-size: 11.5px;
			padding: 6px 24px 6px 9px;
		}

		.btn-primary {
			font-size: 11.5px;
			padding: 6px 12px;
		}

		.btn-nav-action,
		.btn-nav-link {
			padding: 4px 8px;
			font-size: 11px;
		}
	}
</style>
