<script>
	let { spec } = $props();

	let showDetailsMobile = $state(false);

	// Mapeia estilo visual específico para cada laboratório
	function getLabClass(lab) {
		if (lab.includes("Google")) return "lab-google";
		if (lab.includes("Alibaba")) return "lab-alibaba";
		return "lab-hf";
	}
</script>

<div class="model-details-card">
	<div class="card-left">
		<span class="card-pill {getLabClass(spec.lab)}">{spec.lab}</span>
		<span class="card-title">{spec.name}</span>
		{#if spec.badge}
			<span class="card-tag tag-badge">{spec.badge}</span>
		{/if}
		<span class="card-tag tag-params">
			<span class="tag-icon">⚡</span>
			{spec.params}
		</span>
		<span class="card-tag tag-vram">
			<span class="tag-icon">💾</span>
			{spec.vram}
		</span>
		<button
			class="btn-toggle-info mobile-only"
			onclick={() => (showDetailsMobile = !showDetailsMobile)}
			aria-label="Alternar detalhes do modelo"
			title="Ver descrição do modelo"
		>
			{showDetailsMobile ? "▲ fechar" : "ℹ️ info"}
		</button>
	</div>
	<div class="card-right" class:open-mobile={showDetailsMobile}>
		<span class="desc-text">{spec.desc}</span>
	</div>
</div>

<style>
	.model-details-card {
		background: #090f1d;
		border-bottom: 1px solid rgba(55, 65, 81, 0.65);
		padding: 7px 20px;
		display: flex;
		justify-content: space-between;
		align-items: center;
		font-size: 12px;
		gap: 12px;
		box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.03);
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
		padding: 2.5px 7px;
		border-radius: 4px;
		font-size: 10.5px;
		font-family: var(--font-mono, monospace);
		text-transform: uppercase;
		letter-spacing: 0.5px;
	}

	.lab-google {
		background-color: rgba(66, 133, 244, 0.18);
		color: #93c5fd;
		border: 1px solid rgba(96, 165, 250, 0.45);
	}

	.lab-alibaba {
		background-color: rgba(251, 146, 60, 0.18);
		color: #fdba74;
		border: 1px solid rgba(251, 146, 60, 0.45);
	}

	.lab-hf {
		background-color: rgba(234, 179, 8, 0.18);
		color: #fde047;
		border: 1px solid rgba(234, 179, 8, 0.45);
	}

	.card-title {
		font-weight: 700;
		color: #f8fafc;
		font-size: 13px;
		letter-spacing: -0.2px;
	}

	.card-tag {
		padding: 2px 6px;
		border-radius: 4px;
		font-family: var(--font-mono, monospace);
		font-size: 10.5px;
		font-weight: 600;
		display: inline-flex;
		align-items: center;
		gap: 3px;
	}

	.tag-badge {
		background-color: rgba(59, 130, 246, 0.2);
		color: #60a5fa;
		border: 1px solid rgba(96, 165, 250, 0.4);
	}

	.tag-params {
		background-color: rgba(16, 185, 129, 0.15);
		color: #6ee7b7;
		border: 1px solid rgba(110, 231, 183, 0.35);
	}

	.tag-vram {
		background-color: rgba(139, 92, 246, 0.15);
		color: #d8b4fe;
		border: 1px solid rgba(216, 180, 254, 0.35);
	}

	.tag-icon {
		font-size: 9px;
	}

	.card-right {
		color: #cbd5e1;
		font-size: 12px;
		line-height: 1.45;
		max-width: 580px;
		text-align: right;
	}

	.desc-text {
		color: #94a3b8;
	}

	.mobile-only {
		display: none;
	}

	.btn-toggle-info {
		background: none;
		border: 1px solid rgba(75, 85, 99, 0.6);
		color: #94a3b8;
		font-size: 10px;
		font-family: var(--font-mono, monospace);
		border-radius: 4px;
		padding: 1px 6px;
		cursor: pointer;
	}

	@media (max-width: 768px) {
		.model-details-card {
			padding: 6px 12px;
			flex-direction: column;
			align-items: flex-start;
			gap: 6px;
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
			border-top: 1px dashed rgba(75, 85, 99, 0.4);
		}

		.card-right.open-mobile {
			display: block;
		}
	}
</style>
