<script>
	let { visible = false, text = "Inicializando runtime WebGPU...", progress = 0 } = $props();
</script>

{#if visible}
	<div class="progress-container">
		<div class="progress-header">
			<div class="progress-info">
				<span class="pulse-indicator"></span>
				<span class="progress-text">{text}</span>
			</div>
			<span class="progress-pct">{Math.round(progress)}%</span>
		</div>
		<div class="progress-bar-bg">
			<div
				class="progress-bar-fill"
				style="width: {Math.max(0, Math.min(100, progress))}%;"
			></div>
		</div>
	</div>
{/if}

<style>
	.progress-container {
		background: var(--bg-surface);
		border-bottom: 1px solid var(--border-muted);
		padding: 7px 20px;
		animation: slide-down 0.2s ease-out;
		flex-shrink: 0;
	}

	@keyframes slide-down {
		from {
			opacity: 0;
			transform: translateY(-4px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}

	.progress-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		font-size: 11px;
		margin-bottom: 4px;
		font-family: var(--font-mono);
		gap: 8px;
	}

	.progress-info {
		display: flex;
		align-items: center;
		gap: 7px;
		min-width: 0;
		overflow: hidden;
	}

	.pulse-indicator {
		width: 6px;
		height: 6px;
		border-radius: 50%;
		background-color: var(--accent-blue);
		box-shadow: 0 0 6px var(--accent-blue);
		animation: pulse 1s infinite alternate;
		flex-shrink: 0;
	}

	@keyframes pulse {
		from {
			opacity: 0.5;
			transform: scale(0.9);
		}
		to {
			opacity: 1;
			transform: scale(1.1);
		}
	}

	.progress-text {
		color: var(--text-main);
		font-weight: 500;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.progress-pct {
		color: var(--accent-blue);
		font-weight: 700;
		flex-shrink: 0;
	}

	.progress-bar-bg {
		width: 100%;
		height: 4px;
		background-color: var(--bg-card);
		border-radius: 2px;
		overflow: hidden;
	}

	.progress-bar-fill {
		height: 100%;
		background: linear-gradient(90deg, var(--accent-blue), var(--accent-green));
		box-shadow: 0 0 8px rgba(88, 166, 255, 0.4);
		transition: width 0.15s ease-out;
	}

	@media (max-width: 640px) {
		.progress-container {
			padding: 6px 12px;
		}

		.progress-header {
			font-size: 10px;
		}

		.progress-bar-bg {
			height: 3px;
		}
	}
</style>
