<script>
	let { spec } = $props();

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
		<span class="card-tag tag-params">
			<span class="tag-icon">⚡</span>
			{spec.params}
		</span>
		<span class="card-tag tag-vram">
			<span class="tag-icon">💾</span>
			{spec.vram}
		</span>
	</div>
	<div class="card-right">
		<span class="desc-text">{spec.desc}</span>
	</div>
</div>

<style>
	.model-details-card {
		background: #090f1d;
		border-bottom: 1px solid rgba(55, 65, 81, 0.65);
		padding: 9px 24px;
		display: flex;
		justify-content: space-between;
		align-items: center;
		font-size: 12.5px;
		gap: 16px;
		flex-wrap: wrap;
		box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.03);
	}

	.card-left {
		display: flex;
		align-items: center;
		gap: 9px;
		flex-wrap: wrap;
	}

	.card-pill {
		font-weight: 700;
		padding: 3px 8px;
		border-radius: 5px;
		font-size: 11px;
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
		font-size: 13.5px;
		letter-spacing: -0.2px;
	}

	.card-tag {
		padding: 2px 7px;
		border-radius: 5px;
		font-family: var(--font-mono, monospace);
		font-size: 11px;
		font-weight: 600;
		display: inline-flex;
		align-items: center;
		gap: 4px;
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
		font-size: 10px;
	}

	.card-right {
		color: #cbd5e1;
		font-size: 12.5px;
		line-height: 1.5;
		max-width: 580px;
		text-align: right;
	}

	.desc-text {
		color: #94a3b8;
	}

	@media (max-width: 768px) {
		.card-right {
			text-align: left;
		}
	}
</style>
