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
	<!-- Layout Desktop: Itens detalhados -->
	<div class="metric-item desktop-only">
		<span class="metric-icon">🤖</span>
		<span class="metric-label">MODELO:</span>
		<span class="metric-val val-model">{activeModelName}</span>
	</div>

	<div class="metric-item desktop-only">
		<span class="metric-icon">⚡</span>
		<span class="metric-label">VAZÃO:</span>
		<span class="metric-val {getSpeedColor(speed)}">{speed} tok/s</span>
	</div>

	<div class="metric-item desktop-only">
		<span class="metric-icon">🔢</span>
		<span class="metric-label">TOKENS:</span>
		<span class="metric-val val-tokens">{tokens}</span>
	</div>

	<!-- Layout Mobile: Ticker minimalista em 1 linha -->
	<div class="mobile-ticker mobile-only">
		<span class="ticker-segment {getSpeedColor(speed)}">⚡ {speed} tok/s</span>
		<span class="ticker-sep">·</span>
		<span class="ticker-segment val-tokens-txt">{tokens} tokens</span>
		<span class="ticker-sep">·</span>
		<span class="ticker-segment val-model-txt">{activeModelName}</span>
	</div>
</div>

<style>
	.metrics-bar {
		display: flex;
		justify-content: space-between;
		align-items: center;
		font-family: var(--font-mono);
		font-size: 11px;
		color: var(--text-muted);
		padding: 5px 12px;
		border: 1px solid var(--border-muted);
		margin-top: 6px;
		background: var(--bg-surface);
		border-radius: 6px;
		flex-shrink: 0;
	}

	.metric-item {
		display: inline-flex;
		align-items: center;
		gap: 6px;
	}

	.metric-icon {
		font-size: 10px;
	}

	.metric-label {
		color: var(--text-dim);
		font-weight: 600;
		letter-spacing: 0.5px;
	}

	.metric-val {
		font-weight: 600;
		padding: 1px 6px;
		border-radius: 4px;
	}

	.val-model {
		background: rgba(88, 166, 255, 0.1);
		color: var(--accent-blue);
		border: 1px solid rgba(88, 166, 255, 0.25);
	}

	.speed-idle {
		background: var(--bg-card);
		color: var(--text-dim);
	}

	.speed-active {
		background: rgba(255, 166, 87, 0.12);
		color: var(--accent-orange);
		border: 1px solid rgba(255, 166, 87, 0.3);
	}

	.speed-medium {
		background: rgba(57, 197, 187, 0.12);
		color: var(--accent-cyan);
		border: 1px solid rgba(57, 197, 187, 0.3);
	}

	.speed-fast {
		background: rgba(126, 231, 135, 0.15);
		color: var(--accent-green);
		border: 1px solid rgba(126, 231, 135, 0.35);
	}

	.val-tokens {
		background: rgba(210, 168, 255, 0.12);
		color: var(--accent-purple);
		border: 1px solid rgba(210, 168, 255, 0.3);
	}

	.mobile-only {
		display: none;
	}

	.desktop-only {
		display: inline-flex;
	}

	.mobile-ticker {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 100%;
		gap: 8px;
		font-size: 10.5px;
	}

	.ticker-segment {
		font-weight: 600;
	}

	.ticker-sep {
		color: var(--border-default);
	}

	.val-tokens-txt {
		color: var(--accent-purple);
	}

	.val-model-txt {
		color: var(--accent-blue);
		max-width: 140px;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	@media (max-width: 640px) {
		.metrics-bar {
			padding: 4px 8px;
			margin-top: 4px;
		}

		.mobile-only {
			display: flex;
		}

		.desktop-only {
			display: none;
		}
	}
</style>
