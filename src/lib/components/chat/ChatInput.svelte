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

<div class="input-container">
	<div class="input-card" class:has-focus={!disabled}>
		<textarea
			bind:value={prompt}
			placeholder={disabled
				? "Carregue um modelo acima para habilitar o chat..."
				: "Envie uma consulta técnica ou comando..."}
			{disabled}
			onkeydown={handleKeyDown}
			rows="2"
		></textarea>

		<div class="input-bottom-bar">
			<div class="shortcuts-hint desktop-only">
				<span class="key-hint"><kbd>Enter</kbd> Enviar</span>
				<span class="key-sep">·</span>
				<span class="key-hint"><kbd>Shift</kbd>+<kbd>Enter</kbd> Nova linha</span>
			</div>

			<button
				class="btn-send"
				disabled={disabled || isGenerating || !prompt.trim()}
				onclick={onSend}
				aria-label="Enviar Mensagem"
			>
				{#if isGenerating}
					<span class="spinner"></span>
					<span class="desktop-only">Gerando...</span>
				{:else}
					<span class="desktop-only">Enviar</span>
					<svg
						class="send-icon"
						viewBox="0 0 20 20"
						fill="currentColor"
						width="15"
						height="15"
					>
						<path
							d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z"
						/>
					</svg>
				{/if}
			</button>
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
		background: rgba(15, 23, 42, 0.92);
		backdrop-filter: blur(12px);
		-webkit-backdrop-filter: blur(12px);
		border: 1px solid rgba(55, 65, 81, 0.7);
		border-radius: 12px;
		padding: 10px 14px 8px 14px;
		transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
		box-shadow: 0 4px 20px rgba(0, 0, 0, 0.35);
	}

	.input-card:focus-within {
		border-color: #3b82f6;
		box-shadow:
			0 0 0 2px rgba(59, 130, 246, 0.25),
			0 8px 30px rgba(0, 0, 0, 0.5);
		background: rgba(17, 24, 39, 0.98);
	}

	textarea {
		width: 100%;
		background: transparent;
		border: none;
		outline: none;
		color: #f8fafc;
		font-family: inherit;
		font-size: 14px;
		resize: none;
		height: 44px;
		line-height: 1.5;
	}

	textarea::placeholder {
		color: #64748b;
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
		border-top: 1px solid rgba(255, 255, 255, 0.05);
		gap: 10px;
	}

	.shortcuts-hint {
		font-family: var(--font-mono, monospace);
		font-size: 11px;
		color: #94a3b8;
		display: flex;
		align-items: center;
		gap: 6px;
	}

	.key-hint kbd {
		background: rgba(51, 65, 85, 0.6);
		color: #e2e8f0;
		border: 1px solid rgba(100, 116, 139, 0.5);
		border-radius: 3px;
		padding: 1px 5px;
		font-size: 10px;
		font-weight: 700;
	}

	.key-sep {
		color: #475569;
	}

	.btn-send {
		padding: 6px 16px;
		font-size: 13px;
		font-weight: 700;
		border-radius: 7px;
		cursor: pointer;
		border: none;
		background: linear-gradient(135deg, #2563eb, #1d4ed8);
		color: #ffffff;
		transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
		display: inline-flex;
		align-items: center;
		justify-content: center;
		gap: 6px;
		box-shadow: 0 2px 10px rgba(37, 99, 235, 0.35);
		margin-left: auto;
	}

	.btn-send:hover:not(:disabled) {
		background: linear-gradient(135deg, #3b82f6, #2563eb);
		transform: translateY(-1px);
		box-shadow: 0 4px 14px rgba(37, 99, 235, 0.5);
	}

	.btn-send:active:not(:disabled) {
		transform: translateY(0);
	}

	.btn-send:disabled {
		opacity: 0.45;
		cursor: not-allowed;
		box-shadow: none;
	}

	.send-icon {
		transition: transform 0.2s ease;
	}

	.btn-send:hover:not(:disabled) .send-icon {
		transform: translateX(1px);
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

	.desktop-only {
		display: inline-flex;
	}

	@media (max-width: 640px) {
		.desktop-only {
			display: none;
		}

		.input-card {
			padding: 8px 10px 6px 10px;
			border-radius: 10px;
		}

		textarea {
			/* Font-size 16px no mobile previne zoom indesejado no iOS Safari e Android */
			font-size: 16px;
			height: 38px;
			line-height: 1.4;
		}

		textarea::placeholder {
			font-size: 13px;
		}

		.input-bottom-bar {
			padding-top: 4px;
		}

		.btn-send {
			padding: 6px 12px;
			min-width: 44px;
			min-height: 34px;
		}
	}
</style>
