<script>
	let { visible = false, text = "Inicializando runtime WebGPU...", progress = 0 } = $props();
</script>

{#if visible}
	<div class="progress-container">
		<div class="progress-header">
			<span class="progress-text">{text}</span>
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
		background-color: var(--bg-surface, #0d1117);
		border-bottom: 1px solid var(--border-default, #30363d);
		padding: 10px 24px;
	}

	.progress-header {
		display: flex;
		justify-content: space-between;
		font-size: 12px;
		margin-bottom: 6px;
		color: var(--text-muted, #8b949e);
		font-family: var(--font-mono, monospace);
	}

	.progress-bar-bg {
		width: 100%;
		height: 6px;
		background-color: var(--bg-card, #161b22);
		border-radius: 3px;
		overflow: hidden;
	}

	.progress-bar-fill {
		height: 100%;
		background: linear-gradient(90deg, #3b82f6, #10b981);
		transition: width 0.15s ease-out;
	}
</style>
