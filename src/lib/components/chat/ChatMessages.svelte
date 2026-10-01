<script>
	import { tick, onMount } from "svelte";
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

	const PROMPT_SUGGESTIONS = [
		"Como implementar multiplexação de I/O assíncrona com kqueue no FreeBSD?",
		"Qual a diferença conceitual e técnica entre /dev/dsp (OSS puro) e a pilha ALSA?",
		"Como funcionam as primitivas de mitigação pledge(2) e unveil(2) no OpenBSD?",
		"Por que o compilador determinístico supera runtimes com garbage collection dinâmico?",
		"Escreva um servidor HTTP concorrente em C23 utilizando sockets POSIX e poll(2)",
		"Como provar matematicamente a correção de algoritmos para Min-Cost Network Flows?",
		"Qual a vantagem do SQLite com WAL mode e binário único em Go contra microsserviços?",
		"Como funciona a separação defensiva de privilégios com Capsicum no FreeBSD?",
		"Explique a arquitetura de Solaris Zones no illumos versus namespaces do Linux",
		"Quais são as garantias de segurança de tipos e aritmética segura do C23 (<stdckdint.h>)?",
	];

	let currentPromptIdx = $state(0);

	onMount(() => {
		currentPromptIdx = Math.floor(Math.random() * PROMPT_SUGGESTIONS.length);
	});

	function nextPrompt(e) {
		if (e) e.stopPropagation();
		currentPromptIdx = (currentPromptIdx + 1) % PROMPT_SUGGESTIONS.length;
	}

	let featuredPrompt = $derived(PROMPT_SUGGESTIONS[currentPromptIdx]);
</script>

<div class="chat-window" bind:this={chatContainer}>
	<!-- Hero Inicial Limpo com Sugestão Dinâmica/Aleatória -->
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

			<!-- Sugestão Única Centralizada & Rotativa (Aleatória + Botão Shuffle) -->
			<div class="single-suggestion-container">
				<div class="suggestion-pill">
					<button
						class="suggestion-content-btn"
						onclick={() => onSelectPrompt(featuredPrompt)}
						title="Enviar esta pergunta para a IA local"
					>
						<span class="chip-symbol">›</span>
						<span class="chip-text">{featuredPrompt}</span>
					</button>
					<button
						class="suggestion-refresh-btn"
						onclick={nextPrompt}
						title="Sortear outra sugestão (Aleatório)"
						aria-label="Sortear outra pergunta"
					>
						<span class="refresh-icon">↻</span>
					</button>
				</div>
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

	/* Sugestão Dinâmica & Rotativa */
	.single-suggestion-container {
		display: flex;
		justify-content: center;
		width: 100%;
		max-width: 680px;
	}

	.suggestion-pill {
		display: inline-flex;
		align-items: center;
		background: var(--bg-surface);
		border: 1px solid var(--border-subtle);
		border-radius: 6px;
		transition: all 0.15s ease;
		max-width: 100%;
		overflow: hidden;
	}

	.suggestion-pill:hover {
		border-color: var(--accent-blue);
		background: var(--bg-card);
		transform: translateY(-1px);
	}

	.suggestion-content-btn {
		background: transparent;
		border: none;
		padding: 0.65rem 0.85rem 0.65rem 1.1rem;
		color: var(--text-muted);
		font-family: var(--font-mono);
		font-size: 0.84rem;
		cursor: pointer;
		display: inline-flex;
		align-items: center;
		gap: 0.6rem;
		min-width: 0;
		text-align: left;
		transition: color 0.15s ease;
	}

	.suggestion-content-btn:hover {
		color: var(--text-main);
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

	.suggestion-refresh-btn {
		background: transparent;
		border: none;
		border-left: 1px solid var(--border-muted);
		padding: 0.65rem 0.85rem;
		color: var(--text-dim);
		cursor: pointer;
		display: inline-flex;
		align-items: center;
		justify-content: center;
		transition: all 0.15s ease;
		flex-shrink: 0;
	}

	.suggestion-refresh-btn:hover {
		color: var(--accent-blue);
		background: rgba(88, 166, 255, 0.08);
	}

	.refresh-icon {
		font-size: 0.95rem;
		line-height: 1;
		transition: transform 0.25s ease;
	}

	.suggestion-refresh-btn:hover .refresh-icon {
		transform: rotate(90deg);
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

		.suggestion-content-btn {
			font-size: 0.78rem;
			padding: 0.55rem 0.75rem 0.55rem 0.85rem;
		}

		.msg {
			padding: 1rem;
		}

		.msg-user {
			max-width: 90%;
		}
	}
</style>
