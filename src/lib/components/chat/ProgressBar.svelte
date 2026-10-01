<script>
	let { visible = false, text = "", progress = 0 } = $props();
</script>

{#if visible}
	<div class="progress-track" title={text} aria-label="Progresso de carregamento">
		<div
			class="progress-bar-fill"
			style="width: {Math.max(0, Math.min(100, progress))}%;"
		></div>
	</div>
{/if}

<style>
	.progress-track {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		height: 2px;
		background: transparent;
		z-index: 1000;
		pointer-events: none;
	}

	.progress-bar-fill {
		height: 100%;
		background: linear-gradient(90deg, var(--accent-blue), var(--accent-green));
		box-shadow: 0 0 8px rgba(88, 166, 255, 0.6);
		transition: width 0.15s ease-out;
	}
</style>
