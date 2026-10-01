<script>
	import { tick } from "svelte";
	import { renderMarkdownWithThink } from "$lib/chat/markdown.js";

	let { messages = [], markedInstance = null, onSelectPrompt = () => {} } = $props();

	let chatContainer = $state(null);
	let copiedIdx = $state(null);

	export function scrollToBottom() {
		if (chatContainer) {
			chatContainer.scrollTop = chatContainer.scrollHeight;
		}
	}

	$effect(() => {
		if (messages.length) {
			const _ = messages[messages.length - 1]?.content;
			tick().then(scrollToBottom);
		}
	});

	async function copyMessage(content, idx) {
		if (!content) return;
		try {
			await navigator.clipboard.writeText(content);
			copiedIdx = idx;
			setTimeout(() => {
				copiedIdx = null;
			}, 2000);
		} catch (err) {
			console.warn("Falha ao copiar:", err);
		}
	}

	const featuredPrompt =
		"Como implementar multiplexação de I/O assíncrona com kqueue no FreeBSD?";
</script>

<div class="chat-window" bind:this={chatContainer}>
	<!-- Hero Inicial Limpo e Centralizado -->
	{#if messages.length === 0}
		<div class="welcome-hero">
			<div class="welcome-badge">
				<span class="badge-dot"></span>
				<span>Inferência 100% Local · Shaders WebGPU · Zero Nuvem</span>
			</div>

			<h1 class="welcome-title">
				Chat Local <span class="gradient-text">Soberano</span>
			</h1>

			<p class="welcome-desc">
				Execute modelos de linguagem de última geração diretamente na GPU do seu
				navegador. Privacidade matemática absoluta: nenhum prompt ou tensor trafega pela
				nuvem.
			</p>

			<!-- 1 Única Sugestão de Exploração Centralizada -->
			<div class="single-suggestion-container">
				<button
					class="single-suggestion-chip"
					onclick={() => onSelectPrompt(featuredPrompt)}
				>
					<span class="chip-symbol">›</span>
					<span class="chip-text">{featuredPrompt}</span>
				</button>
			</div>
		</div>
	{/if}

	<!-- Lista de Mensagens -->
	{#each messages as msg, i}
		<div class="msg msg-{msg.role}">
			<div class="msg-header">
				<div class="msg-author-group">
					{#if msg.role === "user"}
						<span class="author-name author-user">gabriel</span>
					{:else}
						<span class="author-symbol">λ</span>
						<span class="author-name author-ai"
							>{msg.sender ? msg.sender.toLowerCase() : "assistente local"}</span
						>
					{/if}
				</div>

				<div class="msg-header-right">
					{#if msg.timestamp}
						<span class="msg-time">{msg.timestamp}</span>
					{/if}
				</div>
			</div>

			<div class="msg-body">
				{#if msg.role === "assistant"}
					{#if !msg.content}
						<div class="stream-loading">
							<span class="stream-dot"></span>
							<span class="stream-dot"></span>
							<span class="stream-dot"></span>
						</div>
					{:else}
						{@html renderMarkdownWithThink(msg.content, markedInstance)}
					{/if}
				{:else}
					<p class="user-text">{msg.content}</p>
				{/if}
			</div>

			<!-- Rodapé de Telemetria Whisper -->
			{#if msg.role === "assistant" && msg.content}
				<div class="msg-footer">
					<div class="telemetry-whisper">
						{#if msg.metaRight}
							<span class="telemetry-text">⚡ {msg.metaRight}</span>
						{/if}
					</div>

					<button
						class="copy-btn"
						onclick={() => copyMessage(msg.content, i)}
						title="Copiar mensagem"
						aria-label="Copiar mensagem"
					>
						{#if copiedIdx === i}
							<span class="copied-text">Copiado! ✓</span>
						{:else}
							<span>Copiar</span>
						{/if}
					</button>
				</div>
			{/if}
		</div>
	{/each}
</div>

<style>
	.chat-window {
		flex: 1;
		overflow-y: auto;
		display: flex;
		flex-direction: column;
		gap: 1.25rem;
		padding: 1.5rem 0.5rem 1rem 0;
		scroll-behavior: smooth;
	}

	.chat-window::-webkit-scrollbar {
		width: 5px;
	}
	.chat-window::-webkit-scrollbar-track {
		background: transparent;
	}
	.chat-window::-webkit-scrollbar-thumb {
		background: var(--border-default);
		border-radius: 4px;
	}
	.chat-window::-webkit-scrollbar-thumb:hover {
		background: var(--border-hover);
	}

	/* Hero Inicial Minimalista */
	.welcome-hero {
		margin: auto 0;
		padding: 2.5rem 1rem;
		text-align: center;
		display: flex;
		flex-direction: column;
		align-items: center;
		animation: fade-in 0.3s ease-out;
	}

	@keyframes fade-in {
		from {
			opacity: 0;
			transform: translateY(6px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}

	.welcome-badge {
		display: inline-flex;
		align-items: center;
		gap: 0.5rem;
		padding: 0.35rem 0.85rem;
		background: var(--bg-surface);
		border: 1px solid var(--border-subtle);
		border-radius: 9999px;
		font-family: var(--font-mono);
		font-size: 0.78rem;
		color: var(--text-dim);
		margin-bottom: 1.25rem;
	}

	.badge-dot {
		width: 7px;
		height: 7px;
		border-radius: 50%;
		background: var(--accent-green);
		box-shadow: 0 0 6px var(--accent-green);
	}

	.welcome-title {
		font-family: var(--font-sans);
		font-size: 2.1rem;
		font-weight: 700;
		color: var(--text-main);
		margin-bottom: 0.75rem;
		letter-spacing: -0.02em;
	}

	.gradient-text {
		background: linear-gradient(135deg, var(--accent-blue), var(--accent-cyan));
		-webkit-background-clip: text;
		-webkit-text-fill-color: transparent;
		background-clip: text;
	}

	.welcome-desc {
		max-width: 600px;
		font-size: 0.95rem;
		color: var(--text-muted);
		line-height: 1.6;
		margin-bottom: 1.75rem;
	}

	/* Sugestão Única Centralizada */
	.single-suggestion-container {
		display: flex;
		justify-content: center;
		width: 100%;
		max-width: 640px;
	}

	.single-suggestion-chip {
		background: var(--bg-surface);
		border: 1px solid var(--border-subtle);
		border-radius: 6px;
		padding: 0.65rem 1.25rem;
		color: var(--text-muted);
		font-family: var(--font-mono);
		font-size: 0.84rem;
		cursor: pointer;
		display: inline-flex;
		align-items: center;
		justify-content: center;
		gap: 0.6rem;
		transition: all 0.15s ease;
		max-width: 100%;
		text-align: center;
	}

	.single-suggestion-chip:hover {
		border-color: var(--accent-blue);
		color: var(--text-main);
		background: var(--bg-card);
		transform: translateY(-1px);
	}

	.chip-symbol {
		color: var(--accent-coral);
		font-weight: 700;
		flex-shrink: 0;
	}

	.chip-text {
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	/* Mensagens */
	.msg {
		display: flex;
		flex-direction: column;
		padding: 1.25rem 1.4rem;
		border-radius: 8px;
		line-height: 1.6;
		font-size: 0.92rem;
		word-wrap: break-word;
		transition: border-color 0.15s ease;
	}

	.msg-user {
		align-self: flex-end;
		max-width: 80%;
		background: var(--bg-surface);
		border: 1px solid var(--border-subtle);
		color: var(--text-main);
	}

	.msg-assistant {
		width: 100%;
		background: var(--bg-card);
		border: 1px solid var(--border-muted);
		color: var(--text-main);
	}

	.msg-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 0.65rem;
	}

	.msg-author-group {
		display: flex;
		align-items: center;
		gap: 0.35rem;
		font-family: var(--font-mono);
		font-size: 0.78rem;
	}

	.author-symbol {
		color: var(--accent-green);
		font-weight: 700;
	}

	.author-user {
		color: var(--accent-blue);
		font-weight: 600;
	}

	.author-ai {
		color: var(--accent-green);
		font-weight: 600;
	}

	.msg-time {
		font-family: var(--font-mono);
		font-size: 0.72rem;
		color: var(--text-dim);
	}

	.user-text {
		margin: 0;
		white-space: pre-wrap;
	}

	/* Telemetria Whisper */
	.msg-footer {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-top: 1rem;
		padding-top: 0.65rem;
		border-top: 1px solid var(--border-muted);
		font-family: var(--font-mono);
		font-size: 0.75rem;
	}

	.telemetry-whisper {
		color: var(--text-dim);
	}

	.copy-btn {
		background: transparent;
		border: 1px solid var(--border-muted);
		border-radius: 4px;
		color: var(--text-dim);
		font-family: var(--font-mono);
		font-size: 0.72rem;
		padding: 2px 7px;
		cursor: pointer;
		transition: all 0.15s ease;
	}

	.copy-btn:hover {
		border-color: var(--border-hover);
		color: var(--text-main);
	}

	.copied-text {
		color: var(--accent-green);
	}

	/* Loading Dots do Stream */
	.stream-loading {
		display: flex;
		align-items: center;
		gap: 5px;
		padding: 0.4rem 0;
	}

	.stream-dot {
		width: 5px;
		height: 5px;
		background: var(--text-dim);
		border-radius: 50%;
		animation: stream-blink 1.2s infinite ease-in-out both;
	}

	.stream-dot:nth-child(1) {
		animation-delay: -0.32s;
	}
	.stream-dot:nth-child(2) {
		animation-delay: -0.16s;
	}

	@keyframes stream-blink {
		0%,
		80%,
		100% {
			opacity: 0.2;
			transform: scale(0.8);
		}
		40% {
			opacity: 1;
			transform: scale(1.1);
		}
	}

	/* Markdown e Bloco Think */
	:global(.msg-body) {
		line-height: 1.65;
	}

	:global(.msg-body p) {
		margin: 0.5rem 0;
	}
	:global(.msg-body p:first-child) {
		margin-top: 0;
	}
	:global(.msg-body p:last-child) {
		margin-bottom: 0;
	}

	:global(.msg-body h1, .msg-body h2, .msg-body h3, .msg-body h4) {
		font-family: var(--font-sans);
		color: var(--text-main);
		margin: 1.2rem 0 0.5rem 0;
	}

	:global(.msg-body code) {
		font-family: var(--font-mono);
		font-size: 0.85em;
		background: var(--bg-surface);
		padding: 0.15em 0.35em;
		border-radius: 4px;
		border: 1px solid var(--border-muted);
		color: var(--accent-orange);
	}

	:global(.msg-body pre) {
		background: #090d13;
		border: 1px solid var(--border-subtle);
		border-radius: 6px;
		padding: 0.85rem 1rem;
		overflow-x: auto;
		margin: 0.8rem 0;
	}

	:global(.msg-body pre code) {
		background: transparent;
		padding: 0;
		border: none;
		color: var(--text-main);
	}

	:global(.think-block) {
		background: rgba(13, 17, 23, 0.6);
		border: 1px solid var(--border-muted);
		border-radius: 6px;
		margin: 0.75rem 0;
		overflow: hidden;
	}

	:global(.think-summary) {
		display: flex;
		align-items: center;
		gap: 6px;
		padding: 6px 12px;
		cursor: pointer;
		font-family: var(--font-mono);
		font-size: 0.75rem;
		color: var(--text-dim);
		background: var(--bg-surface);
		user-select: none;
	}

	:global(.think-summary:hover) {
		color: var(--text-main);
	}

	:global(.think-content) {
		padding: 10px 14px;
		font-family: var(--font-mono);
		font-size: 0.82rem;
		line-height: 1.6;
		color: var(--text-muted);
		border-top: 1px solid var(--border-muted);
		background: rgba(9, 13, 19, 0.4);
		max-height: 300px;
		overflow-y: auto;
	}

	@media (max-width: 768px) {
		.welcome-title {
			font-size: 1.6rem;
		}

		.single-suggestion-chip {
			font-size: 0.78rem;
			padding: 0.55rem 0.85rem;
		}

		.msg {
			padding: 1rem;
		}

		.msg-user {
			max-width: 90%;
		}
	}
</style>
