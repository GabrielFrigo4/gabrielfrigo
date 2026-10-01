<script>
	let { spec } = $props();

	let showDetailsMobile = $state(false);
</script>

<div class="model-details-card">
	<div class="card-left">
		<span class="card-pill">{spec.lab}</span>
		<span class="card-title">{spec.name}</span>
		{#if spec.badge}
			<span class="card-tag tag-highlight">{spec.badge}</span>
		{/if}
		<span class="card-tag">
			<span class="tag-icon">⚡</span>
			{spec.params}
		</span>
		<span class="card-tag">
			<span class="tag-icon">💾</span>
			{spec.vram}
		</span>
		<button
			class="btn-toggle-info mobile-only"
			onclick={() => (showDetailsMobile = !showDetailsMobile)}
			aria-label="Alternar detalhes do modelo"
			title="Ver descrição do modelo"
		>
			{showDetailsMobile ? "▲ fechar" : "ℹ️ detalhes"}
		</button>
	</div>
	<div class="card-right" class:open-mobile={showDetailsMobile}>
		<span class="desc-text">{spec.desc}</span>
	</div>
</div>

<style>
	.model-details-card {
		background: var(--bg-surface);
		border-bottom: 1px solid var(--border-muted);
		padding: 6px 20px;
		display: flex;
		justify-content: space-between;
		align-items: center;
		font-size: 12px;
		gap: 12px;
		flex-shrink: 0;
	}

	.card-left {
		display: flex;
		align-items: center;
		gap: 8px;
		flex-wrap: wrap;
	}

	.card-pill {
		font-weight: 700;
		padding: 2px 7px;
		border-radius: 4px;
		font-size: 10px;
		font-family: var(--font-mono);
		text-transform: uppercase;
		letter-spacing: 0.5px;
		background: rgba(88, 166, 255, 0.1);
		color: var(--accent-blue);
		border: 1px solid rgba(88, 166, 255, 0.3);
	}

	.card-title {
		font-weight: 700;
		color: var(--text-main);
		font-size: 12.5px;
		font-family: var(--font-mono);
	}

	.card-tag {
		padding: 2px 6px;
		border-radius: 4px;
		font-family: var(--font-mono);
		font-size: 10.5px;
		background: var(--bg-card);
		border: 1px solid var(--border-muted);
		color: var(--text-muted);
		display: inline-flex;
		align-items: center;
		gap: 4px;
	}

	.tag-highlight {
		background: rgba(126, 231, 135, 0.1);
		color: var(--accent-green);
		border-color: rgba(126, 231, 135, 0.3);
	}

	.tag-icon {
		font-size: 9px;
	}

	.card-right {
		color: var(--text-dim);
		font-size: 11.5px;
		line-height: 1.4;
		max-width: 580px;
		text-align: right;
	}

	.desc-text {
		color: var(--text-muted);
	}

	.mobile-only {
		display: none;
	}

	.btn-toggle-info {
		background: var(--bg-card);
		border: 1px solid var(--border-default);
		color: var(--text-muted);
		font-size: 10px;
		font-family: var(--font-mono);
		border-radius: 4px;
		padding: 2px 6px;
		cursor: pointer;
	}

	@media (max-width: 768px) {
		.model-details-card {
			padding: 6px 12px;
			flex-direction: column;
			align-items: flex-start;
			gap: 5px;
		}

		.mobile-only {
			display: inline-block;
		}

		.card-left {
			width: 100%;
			gap: 6px;
		}

		.card-right {
			display: none;
			text-align: left;
			width: 100%;
			font-size: 11px;
			padding-top: 4px;
			border-top: 1px solid var(--border-muted);
		}

		.card-right.open-mobile {
			display: block;
		}
	}
</style>
