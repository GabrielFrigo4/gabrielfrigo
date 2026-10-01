<script>
	let {
		prompt = $bindable(""),
		disabled = false,
		isGenerating = false,
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
			if (!disabled && !isGenerating && prompt.trim()) {
				onSend();
			}
		}
	}
</script>

<div class="input-container">
	<div class="input-card" class:has-focus={!disabled}>
		<textarea
			bind:value={prompt}
			placeholder={disabled
				? "Carregue um modelo no menu acima para habilitar o chat..."
				: "Envie uma pergunta ou comando para a IA local..."}
			{disabled}
			onkeydown={handleKeyDown}
			rows="2"
		></textarea>

		<div class="input-bottom-bar">
			<div class="shortcuts-hint desktop-only">
				<span class="key-hint"><kbd>Enter</kbd> enviar</span>
				<span class="key-sep">·</span>
				<span class="key-hint"><kbd>Shift</kbd>+<kbd>Enter</kbd> quebra de linha</span>
				{#if isGenerating}
					<span class="key-sep">·</span>
					<span class="key-hint"><kbd>Esc</kbd> parar</span>
				{/if}
			</div>

			<div class="actions-right">
				{#if isGenerating}
					<button
						class="btn-stop"
						onclick={onStop}
						aria-label="Interromper geração"
						title="Parar geração imediatamente"
					>
						<span class="stop-icon">⏹</span>
						<span>Parar</span>
					</button>
				{:else}
					<button
						class="btn-send"
						disabled={disabled || !prompt.trim()}
						onclick={onSend}
						aria-label="Enviar Mensagem"
					>
						<span class="desktop-only">Enviar</span>
						<span class="mobile-only">⚡</span>
						<svg
							class="send-icon desktop-only"
							viewBox="0 0 20 20"
							fill="currentColor"
							width="14"
							height="14"
						>
							<path
								d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z"
							/>
						</svg>
					</button>
				{/if}
			</div>
		</div>
	</div>
</div>

<style>
	.input-container {
		margin-top: 8px;
		flex-shrink: 0;
	}

	.input-card {
		display: flex;
		flex-direction: column;
		background: var(--bg-surface);
		border: 1px solid var(--border-default);
		border-radius: 8px;
		padding: 10px 14px 8px 14px;
		transition: all 0.2s ease;
		box-shadow: 0 4px 16px rgba(0, 0, 0, 0.3);
	}

	.input-card:focus-within {
		border-color: var(--accent-blue);
		box-shadow: 0 0 0 2px rgba(88, 166, 255, 0.2);
	}

	textarea {
		width: 100%;
		background: transparent;
		border: none;
		outline: none;
		color: var(--text-main);
		font-family: var(--font-sans);
		font-size: 14px;
		resize: none;
		height: 44px;
		line-height: 1.5;
	}

	textarea::placeholder {
		color: var(--text-dim);
		font-size: 13px;
	}

	textarea:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}

	.input-bottom-bar {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding-top: 6px;
		border-top: 1px solid var(--border-muted);
		gap: 10px;
	}

	.shortcuts-hint {
		font-family: var(--font-mono);
		font-size: 11px;
		color: var(--text-dim);
		display: flex;
		align-items: center;
		gap: 6px;
	}

	.key-hint kbd {
		background: var(--bg-card);
		color: var(--text-muted);
		border: 1px solid var(--border-default);
		border-radius: 3px;
		padding: 1px 5px;
		font-size: 10px;
		font-family: var(--font-mono);
		font-weight: 600;
	}

	.key-sep {
		color: var(--border-muted);
	}

	.actions-right {
		margin-left: auto;
		display: flex;
		align-items: center;
		gap: 6px;
	}

	.btn-send {
		padding: 6px 14px;
		font-size: 12.5px;
		font-weight: 600;
		font-family: var(--font-mono);
		border-radius: 6px;
		cursor: pointer;
		border: 1px solid var(--accent-blue);
		background: var(--accent-blue);
		color: #090d13;
		transition: all 0.2s ease;
		display: inline-flex;
		align-items: center;
		justify-content: center;
		gap: 6px;
	}

	.btn-send:hover:not(:disabled) {
		background: #79b8ff;
		box-shadow: 0 0 12px rgba(88, 166, 255, 0.4);
		transform: translateY(-1px);
	}

	.btn-send:disabled {
		opacity: 0.45;
		cursor: not-allowed;
		box-shadow: none;
		transform: none;
	}

	.btn-stop {
		padding: 6px 14px;
		font-size: 12.5px;
		font-weight: 600;
		font-family: var(--font-mono);
		border-radius: 6px;
		cursor: pointer;
		border: 1px solid var(--accent-coral);
		background: rgba(255, 123, 114, 0.15);
		color: var(--accent-coral);
		transition: all 0.2s ease;
		display: inline-flex;
		align-items: center;
		gap: 6px;
	}

	.btn-stop:hover {
		background: rgba(255, 123, 114, 0.25);
		transform: translateY(-1px);
	}

	.stop-icon {
		font-size: 10px;
	}

	.desktop-only {
		display: inline-flex;
	}

	.mobile-only {
		display: none;
	}

	@media (max-width: 640px) {
		.desktop-only {
			display: none;
		}

		.mobile-only {
			display: inline-flex;
		}

		.input-card {
			padding: 8px 10px 6px 10px;
		}

		textarea {
			font-size: 16px;
			height: 38px;
			line-height: 1.4;
		}

		.btn-send,
		.btn-stop {
			padding: 5px 12px;
			font-size: 12px;
		}
	}
</style>
