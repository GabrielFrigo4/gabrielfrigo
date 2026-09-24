<script>
	let { children } = $props();
</script>

<div class="app-root">
	{@render children()}
</div>

<style>
	:global(:root) {
		--bg-base: #090d13;
		--bg-surface: #0d1117;
		--bg-card: #161b22;
		--bg-card-hover: #1c2128;
		--border-default: #30363d;
		--border-muted: #21262d;
		--border-hover: #58a6ff;

		--text-main: #f0f6fc;
		--text-muted: #8b949e;
		--text-dim: #6e7681;

		--accent-coral: #ff7b72;
		--accent-green: #7ee787;
		--accent-blue: #58a6ff;
		--accent-purple: #d2a8ff;
		--accent-orange: #ffa657;
		--accent-cyan: #39c5bb;

		--font-sans: "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
		--font-mono:
			"Fira Code", ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
	}

	:global(*) {
		box-sizing: border-box;
		margin: 0;
		padding: 0;
	}

	:global(body) {
		background-color: var(--bg-base);
		color: var(--text-main);
		font-family: var(--font-sans);
		line-height: 1.6;
		-webkit-font-smoothing: antialiased;
		-moz-osx-font-smoothing: grayscale;
		text-rendering: optimizeLegibility;
		overflow-x: hidden;
	}

	:global(::selection) {
		background: rgba(88, 166, 255, 0.25);
		color: #ffffff;
	}

	:global(a) {
		color: inherit;
		text-decoration: none;
	}

	.app-root {
		min-height: 100vh;
		display: flex;
		flex-direction: column;
	}
</style>
