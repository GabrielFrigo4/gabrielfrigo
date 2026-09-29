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
		<a href="/" class="back-link" title="Voltar ao Portfólio">
			<span class="symbol">λ</span>
			<span class="back-text">Portfólio</span>
		</a>
		<span class="brand-divider">/</span>
		<span class="brand-badge">Client-Side</span>
		<h1 class="brand-title">Sovereign WebGPU Chat</h1>
	</div>

	<div class="controls">
		<div class="gpu-status {isGpuError ? 'status-err' : 'status-ok'}">
			<span class="status-dot"></span>
			<span>{gpuStatus}</span>
		</div>

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

		<button
			class="btn-primary"
			disabled={isLoading || isGpuError || isGenerating}
			onclick={onLoadModel}
		>
			{isLoading ? "Carregando..." : isLoaded ? "Trocar / Recarregar" : "Carregar Modelo"}
		</button>

		<button class="btn-ghost" onclick={onClearChat} disabled={isLoading || isGenerating}>
			Limpar
		</button>
	</div>
</header>

<style>
	.chat-header {
		background-color: var(--bg-surface, #0d1117);
		border-bottom: 1px solid var(--border-default, #30363d);
		padding: 12px 24px;
		display: flex;
		justify-content: space-between;
		align-items: center;
		flex-wrap: wrap;
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
		gap: 6px;
		color: var(--accent-blue, #58a6ff);
		font-family: var(--font-mono, monospace);
		font-size: 13px;
		font-weight: 600;
		padding: 4px 8px;
		border-radius: 6px;
		background: rgba(88, 166, 255, 0.08);
		border: 1px solid rgba(88, 166, 255, 0.2);
		transition: all 0.2s ease;
	}

	.back-link:hover {
		background: rgba(88, 166, 255, 0.18);
		border-color: var(--accent-blue, #58a6ff);
	}

	.symbol {
		color: var(--accent-coral, #ff7b72);
		font-weight: 700;
	}

	.brand-divider {
		color: var(--text-dim, #6e7681);
		font-size: 14px;
	}

	.brand-badge {
		background: linear-gradient(135deg, #2563eb, #7c3aed);
		color: #ffffff;
		font-weight: 700;
		font-size: 11px;
		padding: 4px 8px;
		border-radius: 6px;
		text-transform: uppercase;
		letter-spacing: 0.5px;
	}

	.brand-title {
		font-size: 16px;
		font-weight: 600;
		letter-spacing: -0.3px;
		color: var(--text-main, #f0f6fc);
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
		padding: 4px 10px;
		border-radius: 20px;
		display: flex;
		align-items: center;
		gap: 6px;
	}

	.status-ok {
		background-color: rgba(16, 185, 129, 0.15);
		color: #10b981;
		border: 1px solid rgba(16, 185, 129, 0.3);
	}

	.status-err {
		background-color: rgba(239, 68, 68, 0.15);
		color: #ef4444;
		border: 1px solid rgba(239, 68, 68, 0.3);
	}

	.status-dot {
		width: 7px;
		height: 7px;
		border-radius: 50%;
		background-color: currentColor;
	}

	select {
		background-color: var(--bg-card, #161b22);
		color: var(--text-main, #f0f6fc);
		border: 1px solid var(--border-default, #30363d);
		padding: 7px 12px;
		border-radius: 6px;
		font-family: inherit;
		font-size: 13px;
		cursor: pointer;
		font-weight: 500;
		outline: none;
	}

	select:disabled {
		opacity: 0.6;
		cursor: not-allowed;
	}

	optgroup {
		background-color: var(--bg-surface, #0d1117);
		color: var(--accent-blue, #58a6ff);
		font-weight: 700;
	}

	option {
		background-color: var(--bg-card, #161b22);
		color: var(--text-main, #f0f6fc);
	}

	button {
		font-family: inherit;
		font-size: 13px;
		border-radius: 6px;
		padding: 7px 16px;
		font-weight: 500;
		cursor: pointer;
		transition: all 0.15s ease;
		border: none;
	}

	.btn-primary {
		background-color: var(--accent-blue, #3b82f6);
		color: #ffffff;
	}

	.btn-primary:hover:not(:disabled) {
		background-color: #2563eb;
	}

	.btn-primary:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}

	.btn-ghost {
		background-color: transparent;
		color: var(--text-muted, #8b949e);
		border: 1px solid var(--border-default, #30363d);
	}

	.btn-ghost:hover:not(:disabled) {
		color: var(--text-main, #f0f6fc);
		background-color: var(--bg-card, #161b22);
	}

	.btn-ghost:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}
</style>
