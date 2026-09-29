<script>
	let {
		prompt = $bindable(""),
		disabled = false,
		isGenerating = false,
		onSend = () => {},
	} = $props();

	function handleKeyDown(event) {
		if (event.key === "Enter" && !event.shiftKey) {
			event.preventDefault();
			if (!disabled && !isGenerating && prompt.trim()) {
				onSend();
			}
		}
	}
</script>

<div class="input-area">
	<textarea
		bind:value={prompt}
		placeholder={disabled
			? "Carregue um modelo acima para iniciar a inferência..."
			: "Digite uma instrução técnica... (Enter envia, Shift+Enter pula linha)"}
		{disabled}
		onkeydown={handleKeyDown}
		rows="2"
	></textarea>
	<div class="input-actions">
		<button
			class="btn-send"
			disabled={disabled || isGenerating || !prompt.trim()}
			onclick={onSend}
			aria-label="Enviar Mensagem"
		>
			{#if isGenerating}
				<span class="spinner"></span>
			{:else}
				Enviar ↵
			{/if}
		</button>
	</div>
</div>

<style>
	.input-area {
		display: flex;
		gap: 12px;
		background-color: var(--bg-surface, #0d1117);
		border: 1px solid var(--border-default, #30363d);
		border-radius: 8px;
		padding: 10px 14px;
		margin-top: 8px;
		transition: border-color 0.2s ease;
	}

	.input-area:focus-within {
		border-color: var(--accent-blue, #58a6ff);
	}

	textarea {
		flex: 1;
		background: transparent;
		border: none;
		outline: none;
		color: var(--text-main, #f0f6fc);
		font-family: inherit;
		font-size: 14px;
		resize: none;
		height: 48px;
		line-height: 1.5;
	}

	textarea:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}

	.input-actions {
		display: flex;
		align-items: flex-end;
	}

	.btn-send {
		padding: 8px 18px;
		font-size: 13px;
		font-weight: 600;
		border-radius: 6px;
		cursor: pointer;
		border: none;
		background-color: var(--accent-blue, #3b82f6);
		color: #ffffff;
		transition: all 0.15s ease;
		display: inline-flex;
		align-items: center;
		gap: 6px;
	}

	.btn-send:hover:not(:disabled) {
		background-color: #2563eb;
	}

	.btn-send:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}

	.spinner {
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
