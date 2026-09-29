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
		onLoadModel,
		onClearChat,
	} = $props();
</script>

<header class="chat-header">
	<div class="header-top">
		<div class="brand">
			<a href="/" class="back-link" title="Retornar ao Portfólio Principal">
				<span class="symbol">←</span>
				<span class="back-text">Portfólio</span>
			</a>
			<span class="brand-divider">/</span>
			<div class="brand-info">
				<h1 class="brand-title">WebGPU Chat</h1>
				<span class="brand-badge">Soberano</span>
			</div>
		</div>

		<div class="header-actions">
			<div class="gpu-status {isGpuError ? 'status-err' : 'status-ok'}" title={gpuStatus}>
				<span class="status-dot"></span>
				<span class="status-label desktop-only">{gpuStatus}</span>
				<span class="status-label mobile-only">{shortGpuStatus}</span>
			</div>

			<button
				class="btn-ghost"
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
					width="14"
					height="14"
				>
					<path d="M3 6h18" />
					<path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
					<path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
				</svg>
				<span class="desktop-only">Limpar</span>
			</button>
		</div>
	</div>

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
				<span class="desktop-only">Carregando...</span>
				<span class="mobile-only">Carregando...</span>
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
		background: rgba(11, 15, 25, 0.94);
		backdrop-filter: blur(16px);
		-webkit-backdrop-filter: blur(16px);
		border-bottom: 1px solid rgba(55, 65, 81, 0.6);
		padding: 10px 20px;
		display: flex;
		flex-direction: column;
		gap: 10px;
		position: relative;
		z-index: 10;
		flex-shrink: 0;
	}

	.header-top {
		display: flex;
		justify-content: space-between;
		align-items: center;
		gap: 12px;
	}

	.brand {
		display: flex;
		align-items: center;
		gap: 10px;
	}

	.back-link {
		display: inline-flex;
		align-items: center;
		gap: 5px;
		color: #93c5fd;
		font-family: var(--font-mono, monospace);
		font-size: 12.5px;
		font-weight: 600;
		padding: 4px 9px;
		border-radius: 6px;
		background: rgba(30, 58, 138, 0.35);
		border: 1px solid rgba(96, 165, 250, 0.35);
		transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
		white-space: nowrap;
	}

	.back-link:hover {
		background: rgba(37, 99, 235, 0.45);
		border-color: #60a5fa;
		color: #ffffff;
		transform: translateX(-1px);
	}

	.symbol {
		color: #f87171;
		font-weight: 700;
		font-size: 14px;
	}

	.brand-divider {
		color: #4b5563;
		font-size: 14px;
		user-select: none;
	}

	.brand-info {
		display: flex;
		align-items: center;
		gap: 8px;
	}

	.brand-badge {
		background: linear-gradient(135deg, #2563eb, #7c3aed);
		color: #ffffff;
		font-weight: 700;
		font-size: 10px;
		padding: 2px 7px;
		border-radius: 4px;
		text-transform: uppercase;
		letter-spacing: 0.5px;
		white-space: nowrap;
	}

	.brand-title {
		font-size: 15px;
		font-weight: 700;
		letter-spacing: -0.2px;
		color: #f8fafc;
		white-space: nowrap;
	}

	.header-actions {
		display: flex;
		align-items: center;
		gap: 8px;
	}

	.gpu-status {
		font-family: var(--font-mono, monospace);
		font-size: 11px;
		font-weight: 600;
		padding: 4px 10px;
		border-radius: 16px;
		display: flex;
		align-items: center;
		gap: 6px;
		white-space: nowrap;
	}

	.status-ok {
		background-color: rgba(16, 185, 129, 0.15);
		color: #34d399;
		border: 1px solid rgba(52, 211, 153, 0.4);
	}

	.status-err {
		background-color: rgba(239, 68, 68, 0.15);
		color: #f87171;
		border: 1px solid rgba(248, 113, 113, 0.4);
	}

	.status-dot {
		width: 7px;
		height: 7px;
		border-radius: 50%;
		background-color: currentColor;
		flex-shrink: 0;
	}

	.status-ok .status-dot {
		animation: pulse-glow 2s infinite ease-in-out;
	}

	@keyframes pulse-glow {
		0%,
		100% {
			opacity: 1;
			transform: scale(1);
			box-shadow: 0 0 6px currentColor;
		}
		50% {
			opacity: 0.6;
			transform: scale(0.85);
			box-shadow: 0 0 2px currentColor;
		}
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
		background-color: #111827;
		color: #f1f5f9;
		border: 1px solid rgba(75, 85, 99, 0.7);
		padding: 8px 30px 8px 12px;
		border-radius: 7px;
		font-family: inherit;
		font-size: 13px;
		cursor: pointer;
		font-weight: 600;
		outline: none;
		transition: all 0.2s ease;
		text-overflow: ellipsis;
		white-space: nowrap;
		overflow: hidden;
	}

	select:hover:not(:disabled) {
		border-color: #60a5fa;
		background-color: #162032;
	}

	select:focus {
		border-color: #3b82f6;
		box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.3);
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
		color: #94a3b8;
	}

	optgroup {
		background-color: #0d131f;
		color: #60a5fa;
		font-weight: 700;
	}

	option {
		background-color: #111827;
		color: #f1f5f9;
	}

	button {
		font-family: inherit;
		font-size: 13px;
		border-radius: 7px;
		padding: 8px 14px;
		font-weight: 600;
		cursor: pointer;
		transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
		border: none;
		display: inline-flex;
		align-items: center;
		justify-content: center;
		gap: 6px;
		white-space: nowrap;
		flex-shrink: 0;
	}

	.btn-primary {
		background: linear-gradient(135deg, #2563eb, #1d4ed8);
		color: #ffffff;
		border: 1px solid rgba(96, 165, 250, 0.4);
		box-shadow: 0 2px 10px rgba(37, 99, 235, 0.35);
	}

	.btn-primary:hover:not(:disabled) {
		background: linear-gradient(135deg, #3b82f6, #2563eb);
		transform: translateY(-1px);
	}

	.btn-primary:disabled {
		opacity: 0.45;
		cursor: not-allowed;
		box-shadow: none;
	}

	.btn-ghost {
		background-color: rgba(30, 41, 59, 0.6);
		color: #cbd5e1;
		border: 1px solid rgba(75, 85, 99, 0.6);
		padding: 6px 10px;
	}

	.btn-ghost:hover:not(:disabled) {
		color: #ffffff;
		background-color: rgba(51, 65, 85, 0.8);
		border-color: #94a3b8;
	}

	.btn-ghost:disabled {
		opacity: 0.4;
		cursor: not-allowed;
	}

	.clear-icon {
		display: inline-block;
	}

	.btn-spinner {
		width: 12px;
		height: 12px;
		border: 2px solid rgba(255, 255, 255, 0.3);
		border-top-color: #ffffff;
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

	/* Layout de tela grande (Desktop): coloca tudo em 1 linha harmônica */
	@media (min-width: 860px) {
		.chat-header {
			flex-direction: row;
			justify-content: space-between;
			align-items: center;
			padding: 12px 24px;
		}

		.header-controls {
			width: auto;
			justify-content: flex-end;
		}

		.select-wrapper {
			flex: 0 0 280px;
		}
	}

	/* Ajustes específicos para smartphones (Mobile) */
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

		.brand-title {
			font-size: 14px;
		}

		.back-text {
			display: none;
		}

		.back-link {
			padding: 5px 8px;
		}

		select {
			font-size: 12px;
			padding: 7px 26px 7px 10px;
		}

		button {
			font-size: 12px;
			padding: 7px 12px;
		}
	}
</style>
