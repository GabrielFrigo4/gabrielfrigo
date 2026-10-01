<script>
	let {
		prompt = $bindable(""),
		isGenerating = false,
		isLoading = false,
		isGpuError = false,
		onSend = () => {},
		onStop = () => {},
	} = $props();

	function handleKeyDown(event) {
		if (event.key === "Escape" && isGenerating) {
			event.preventDefault();
			onStop();
			return;
		}

		if (event.key === "Enter" && !event.shiftKey) {
			event.preventDefault();
			if (!isGenerating && !isLoading && !isGpuError && prompt.trim()) {
				onSend();
			}
		}
	}
</script>

<div class="chat-input-container">
	<div class="input-card" class:has-focus={!isGenerating && !isLoading}>
		<textarea
			bind:value={prompt}
			placeholder={isGenerating
				? "Gerando resposta nos tensores WebGPU..."
				: isLoading
					? "Carregando modelo na GPU..."
					: isGpuError
						? "Navegador sem suporte a WebGPU."
						: "Envie uma pergunta ou código (Enter para enviar)..."}
			disabled={isGenerating || isLoading || isGpuError}
			onkeydown={handleKeyDown}
			rows="2"
			aria-label="Mensagem para a IA local"
		></textarea>

		<div class="input-actions-bar">
			<div class="shortcuts-hint desktop-only">
				<span class="hint-text"><kbd>Enter</kbd> enviar</span>
				<span class="hint-sep">·</span>
				<span class="hint-text"><kbd>Shift</kbd>+<kbd>Enter</kbd> quebra de linha</span>
				{#if isGenerating}
					<span class="hint-sep">·</span>
					<span class="hint-text"><kbd>Esc</kbd> parar</span>
				{/if}
			</div>

			<div class="button-group">
				{#if isGenerating}
					<button
						class="btn-action btn-stop"
						onclick={onStop}
						aria-label="Interromper geração"
						title="Parar geração imediatamente (Esc)"
					>
						<span>⏹ Parar</span>
					</button>
				{:else if isLoading}
					<button class="btn-action btn-loading" disabled>
						<span class="btn-spinner"></span>
						<span>Carregando...</span>
					</button>
				{:else}
					<button
						class="btn-action btn-send"
						disabled={!prompt.trim() || isGpuError}
						onclick={onSend}
						aria-label="Enviar mensagem"
					>
						<span>Enviar</span>
						<span class="arrow-symbol">↵</span>
					</button>
				{/if}
			</div>
		</div>
	</div>
</div>

<style>
	.chat-input-container {
		width: 100%;
		margin-top: 0.5rem;
		flex-shrink: 0;
	}

	.input-card {
		display: flex;
		flex-direction: column;
		background: var(--bg-surface);
		border: 1px solid var(--border-subtle);
		border-radius: 8px;
		padding: 0.85rem 1rem 0.65rem 1rem;
		transition: border-color 0.15s ease;
	}

	.input-card:focus-within {
		border-color: var(--accent-blue);
	}

	textarea {
		width: 100%;
		background: transparent;
		border: none;
		outline: none;
		color: var(--text-main);
		font-family: var(--font-sans);
		font-size: 0.92rem;
		resize: none;
		height: 48px;
		line-height: 1.5;
	}

	textarea::placeholder {
		color: var(--text-dim);
		font-size: 0.88rem;
	}

	textarea:disabled {
		opacity: 0.6;
		cursor: not-allowed;
	}

	.input-actions-bar {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding-top: 0.5rem;
		border-top: 1px solid var(--border-muted);
		gap: 0.75rem;
	}

	.shortcuts-hint {
		display: flex;
		align-items: center;
		gap: 0.4rem;
		font-family: var(--font-mono);
		font-size: 0.72rem;
		color: var(--text-dim);
	}

	.shortcuts-hint kbd {
		background: var(--bg-card);
		border: 1px solid var(--border-muted);
		border-radius: 3px;
		padding: 1px 4px;
		color: var(--text-muted);
	}

	.hint-sep {
		color: var(--border-hover);
	}

	.button-group {
		display: flex;
		align-items: center;
		margin-left: auto;
	}

	.btn-action {
		display: inline-flex;
		align-items: center;
		gap: 5px;
		padding: 0.35rem 0.85rem;
		border-radius: 6px;
		font-family: var(--font-mono);
		font-size: 0.82rem;
		cursor: pointer;
		transition: all 0.15s ease;
		border: 1px solid transparent;
		white-space: nowrap;
	}

	.btn-send {
		background: var(--accent-blue);
		color: #0d1117;
		font-weight: 600;
	}

	.btn-send:hover:not(:disabled) {
		background: #79b8ff;
	}

	.btn-send:disabled {
		opacity: 0.4;
		cursor: not-allowed;
		background: var(--bg-card);
		color: var(--text-dim);
		border-color: var(--border-muted);
	}

	.arrow-symbol {
		font-weight: 700;
	}

	.btn-stop {
		background: rgba(255, 123, 114, 0.15);
		border-color: rgba(255, 123, 114, 0.35);
		color: var(--accent-coral);
		font-weight: 600;
	}

	.btn-stop:hover {
		background: rgba(255, 123, 114, 0.25);
	}

	.btn-loading {
		background: var(--bg-card);
		border-color: var(--border-muted);
		color: var(--text-muted);
		cursor: wait;
	}

	.btn-spinner {
		width: 10px;
		height: 10px;
		border: 1.5px solid rgba(139, 148, 158, 0.3);
		border-top-color: var(--accent-blue);
		border-radius: 50%;
		animation: spin 0.8s linear infinite;
	}

	@keyframes spin {
		to {
			transform: rotate(360deg);
		}
	}

	@media (max-width: 768px) {
		.desktop-only {
			display: none !important;
		}

		.input-card {
			padding: 0.75rem 0.85rem 0.5rem 0.85rem;
		}

		textarea {
			font-size: 0.88rem;
			height: 42px;
		}

		.btn-action {
			padding: 0.3rem 0.75rem;
			font-size: 0.78rem;
		}
	}
</style>
