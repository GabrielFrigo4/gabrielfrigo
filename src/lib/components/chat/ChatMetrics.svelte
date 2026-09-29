<script>
	let { activeModelName = "Nenhum", speed = "0.0", tokens = 0 } = $props();

	function getSpeedColor(speedStr) {
		const s = parseFloat(speedStr) || 0;
		if (s > 15) return "speed-fast";
		if (s > 5) return "speed-medium";
		if (s > 0) return "speed-active";
		return "speed-idle";
	}
</script>

<div class="metrics-bar">
	<div class="metric-item">
		<span class="metric-icon">🤖</span>
		<span class="metric-label">MODELO ATIVO:</span>
		<span class="metric-val val-model">{activeModelName}</span>
	</div>

	<div class="metric-item">
		<span class="metric-icon">⚡</span>
		<span class="metric-label">VAZÃO:</span>
		<span class="metric-val {getSpeedColor(speed)}">{speed} tok/s</span>
	</div>

	<div class="metric-item">
		<span class="metric-icon">🔢</span>
		<span class="metric-label">TOKENS GERADOS:</span>
		<span class="metric-val val-tokens">{tokens}</span>
	</div>
</div>

<style>
	.metrics-bar {
		display: flex;
		justify-content: space-between;
		align-items: center;
		font-family: var(--font-mono, monospace);
		font-size: 11.5px;
		color: #cbd5e1;
		padding: 8px 12px;
		border-top: 1px solid rgba(55, 65, 81, 0.65);
		margin-top: 8px;
		flex-wrap: wrap;
		gap: 12px;
		background: rgba(11, 15, 25, 0.7);
		border-radius: 8px;
	}

	.metric-item {
		display: inline-flex;
		align-items: center;
		gap: 6px;
	}

	.metric-icon {
		font-size: 11px;
	}

	.metric-label {
		color: #94a3b8;
		font-weight: 700;
		letter-spacing: 0.5px;
	}

	.metric-val {
		font-weight: 700;
		padding: 2px 7px;
		border-radius: 4px;
	}

	.val-model {
		background: rgba(59, 130, 246, 0.15);
		color: #93c5fd;
		border: 1px solid rgba(147, 197, 253, 0.3);
	}

	.speed-idle {
		background: rgba(75, 85, 99, 0.25);
		color: #94a3b8;
	}

	.speed-active {
		background: rgba(234, 179, 8, 0.18);
		color: #fde047;
		border: 1px solid rgba(253, 224, 71, 0.35);
	}

	.speed-medium {
		background: rgba(6, 182, 212, 0.18);
		color: #67e8f9;
		border: 1px solid rgba(103, 232, 249, 0.35);
	}

	.speed-fast {
		background: rgba(16, 185, 129, 0.2);
		color: #6ee7b7;
		border: 1px solid rgba(110, 231, 183, 0.4);
		box-shadow: 0 0 8px rgba(16, 185, 129, 0.25);
	}

	.val-tokens {
		background: rgba(139, 92, 246, 0.18);
		color: #d8b4fe;
		border: 1px solid rgba(216, 180, 254, 0.35);
	}
</style>
