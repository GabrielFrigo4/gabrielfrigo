<script>
	let { spec } = $props();
</script>

<div class="model-details-card">
	<div class="card-left">
		<span class="card-pill">{spec.lab}</span>
		<span class="card-title">{spec.name}</span>
		<span class="card-tag">{spec.params}</span>
		<span class="card-tag">{spec.vram}</span>
	</div>
	<div class="card-right">
		{spec.desc}
	</div>
</div>

<style>
	.model-details-card {
		background-color: #0e1526;
		border-bottom: 1px solid var(--border-default, #30363d);
		padding: 8px 24px;
		display: flex;
		justify-content: space-between;
		align-items: center;
		font-size: 12px;
		gap: 16px;
		flex-wrap: wrap;
	}

	.card-left {
		display: flex;
		align-items: center;
		gap: 8px;
		flex-wrap: wrap;
	}

	.card-pill {
		background-color: rgba(59, 130, 246, 0.15);
		color: var(--accent-blue, #58a6ff);
		font-weight: 600;
		padding: 2px 7px;
		border-radius: 4px;
		font-size: 11px;
		font-family: var(--font-mono, monospace);
	}

	.card-title {
		font-weight: 600;
		color: var(--text-main, #f0f6fc);
	}

	.card-tag {
		background-color: var(--bg-card, #161b22);
		color: var(--text-muted, #8b949e);
		padding: 2px 6px;
		border-radius: 4px;
		font-family: var(--font-mono, monospace);
		font-size: 11px;
		border: 1px solid var(--border-muted, #21262d);
	}

	.card-right {
		color: var(--text-muted, #8b949e);
		font-size: 12px;
		max-width: 550px;
		text-align: right;
	}

	@media (max-width: 768px) {
		.card-right {
			text-align: left;
		}
	}
</style>
