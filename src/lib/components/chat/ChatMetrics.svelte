<script>
	let { activeModelName = "Nenhum", speed = "0.0", tokens = 0 } = $props();
</script>

<div class="metrics-bar">
	<span class="metric-item">
		<span class="metric-label">Modelo:</span>
		{activeModelName}
	</span>
	<span class="metric-item">
		<span class="metric-label">Vazão:</span>
		{speed} tok/s
	</span>
	<span class="metric-item">
		<span class="metric-label">Tokens Gerados:</span>
		{tokens}
	</span>
</div>

<style>
	.metrics-bar {
		display: flex;
		justify-content: space-between;
		font-family: var(--font-mono, monospace);
		font-size: 11px;
		color: var(--text-muted, #8b949e);
		padding: 8px 4px;
		border-top: 1px solid var(--border-default, #30363d);
		margin-top: 8px;
		flex-wrap: wrap;
		gap: 8px;
	}

	.metric-item {
		display: inline-flex;
		align-items: center;
		gap: 4px;
	}

	.metric-label {
		color: var(--text-dim, #6e7681);
	}
</style>
