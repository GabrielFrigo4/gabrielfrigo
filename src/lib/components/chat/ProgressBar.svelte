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
		background: rgba(11, 15, 25, 0.95);
		border-bottom: 1px solid rgba(55, 65, 81, 0.7);
		padding: 10px 24px;
		animation: slide-down 0.2s ease-out;
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
		font-size: 12px;
		margin-bottom: 7px;
		font-family: var(--font-mono, monospace);
	}

	.progress-info {
		display: flex;
		align-items: center;
		gap: 8px;
	}

	.pulse-indicator {
		width: 7px;
		height: 7px;
		border-radius: 50%;
		background-color: #38bdf8;
		box-shadow: 0 0 8px #38bdf8;
		animation: pulse 1s infinite alternate;
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
		color: #e2e8f0;
		font-weight: 600;
	}

	.progress-pct {
		color: #38bdf8;
		font-weight: 700;
	}

	.progress-bar-bg {
		width: 100%;
		height: 6px;
		background-color: #1e293b;
		border-radius: 3px;
		overflow: hidden;
	}

	.progress-bar-fill {
		height: 100%;
		background: linear-gradient(90deg, #38bdf8, #10b981);
		box-shadow: 0 0 10px rgba(56, 189, 248, 0.6);
		transition: width 0.15s ease-out;
	}
</style>
