<script>
	import { MODEL_GROUPS } from "$lib/chat/models.js";

	let {
		selectedModelKey = $bindable(),
		gpuStatus = "Verificando WebGPU...",
		isGpuError = false,
		isLoading = false,
		isLoaded = false,
		isGenerating = false,
		onLoadModel,
		onClearChat,
	} = $props();
</script>

<header class="chat-header">
	<div class="brand">
		<a href="/" class="back-link" title="Retornar ao Portfólio Principal">
			<span class="symbol">λ</span>
			<span class="back-text">Portfólio</span>
		</a>
		<span class="brand-divider">/</span>
		<div class="brand-info">
			<span class="brand-badge">Client-Side AI</span>
			<h1 class="brand-title">Sovereign WebGPU Chat</h1>
		</div>
	</div>

	<div class="controls">
		<div class="gpu-status {isGpuError ? 'status-err' : 'status-ok'}">
			<span class="status-dot"></span>
			<span class="status-label">{gpuStatus}</span>
		</div>

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
				<span>Trocar / Recarregar</span>
			{:else}
				<span>Carregar Modelo ⚡</span>
			{/if}
		</button>

		<button
			class="btn-ghost"
			onclick={onClearChat}
			disabled={isLoading || isGenerating}
			title="Limpar histórico da conversa"
		>
			Limpar
		</button>
	</div>
</header>

<style>
	.chat-header {
		background: rgba(11, 15, 25, 0.92);
		backdrop-filter: blur(16px);
		-webkit-backdrop-filter: blur(16px);
		border-bottom: 1px solid rgba(55, 65, 81, 0.6);
		padding: 12px 24px;
		display: flex;
		justify-content: space-between;
		align-items: center;
		flex-wrap: wrap;
		gap: 14px;
		position: relative;
		z-index: 10;
	}

	.brand {
		display: flex;
		align-items: center;
		gap: 12px;
	}

	.back-link {
		display: inline-flex;
		align-items: center;
		gap: 6px;
		color: #93c5fd;
		font-family: var(--font-mono, monospace);
		font-size: 13px;
		font-weight: 600;
		padding: 5px 10px;
		border-radius: 6px;
		background: rgba(30, 58, 138, 0.35);
		border: 1px solid rgba(96, 165, 250, 0.35);
		transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
	}

	.back-link:hover {
		background: rgba(37, 99, 235, 0.45);
		border-color: #60a5fa;
		color: #ffffff;
		transform: translateX(-1px);
		box-shadow: 0 0 12px rgba(59, 130, 246, 0.3);
	}

	.symbol {
		color: #f87171;
		font-weight: 700;
		font-size: 15px;
	}

	.brand-divider {
		color: #4b5563;
		font-size: 15px;
		user-select: none;
	}

	.brand-info {
		display: flex;
		align-items: center;
		gap: 10px;
	}

	.brand-badge {
		background: linear-gradient(135deg, #2563eb, #7c3aed);
		color: #ffffff;
		font-weight: 700;
		font-size: 10.5px;
		padding: 3px 8px;
		border-radius: 5px;
		text-transform: uppercase;
		letter-spacing: 0.6px;
		box-shadow: 0 2px 8px rgba(124, 58, 237, 0.35);
	}

	.brand-title {
		font-size: 16px;
		font-weight: 700;
		letter-spacing: -0.3px;
		color: #f8fafc;
	}

	.controls {
		display: flex;
		align-items: center;
		gap: 10px;
		flex-wrap: wrap;
	}

	.gpu-status {
		font-family: var(--font-mono, monospace);
		font-size: 11px;
		font-weight: 600;
		padding: 5px 12px;
		border-radius: 20px;
		display: flex;
		align-items: center;
		gap: 7px;
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
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

	.select-wrapper {
		position: relative;
		display: inline-flex;
		align-items: center;
	}

	select {
		appearance: none;
		-webkit-appearance: none;
		background-color: #111827;
		color: #f1f5f9;
		border: 1px solid rgba(75, 85, 99, 0.7);
		padding: 7px 32px 7px 12px;
		border-radius: 7px;
		font-family: inherit;
		font-size: 13px;
		cursor: pointer;
		font-weight: 600;
		outline: none;
		transition: all 0.2s ease;
		box-shadow: 0 2px 6px rgba(0, 0, 0, 0.25);
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
		font-size: 9px;
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
		padding: 7px 16px;
		font-weight: 600;
		cursor: pointer;
		transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
		border: none;
		display: inline-flex;
		align-items: center;
		gap: 6px;
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
		box-shadow: 0 4px 14px rgba(37, 99, 235, 0.45);
	}

	.btn-primary:active:not(:disabled) {
		transform: translateY(0);
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
</style>
