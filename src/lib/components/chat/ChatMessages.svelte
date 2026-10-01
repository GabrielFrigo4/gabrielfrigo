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

	function isTelemetry(meta) {
		return meta && (meta.includes("tok/s") || meta.includes("WebGPU"));
	}

	function isClientSide(meta) {
		return meta && meta.includes("Client-Side");
	}

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

	const suggestions = [
		"Como funciona o kqueue no FreeBSD?",
		"Qual a diferença entre /dev/dsp (OSS) e ALSA?",
		"Por que o compilador determinístico supera runtime dinâmico?",
		"Escreva um exemplo de servidor de sockets em C23",
	];
</script>

<div class="chat-window" bind:this={chatContainer}>
	<!-- Terminal Card de Boas-Vindas da Home Page -->
	{#if messages.length <= 1}
		<div class="welcome-box">
			<div class="terminal-card">
				<div class="terminal-header">
					<div class="terminal-dots">
						<span class="dot red"></span>
						<span class="dot yellow"></span>
						<span class="dot green"></span>
					</div>
					<span class="terminal-title">webgpu@client-gpu:~ (sovereign-ai)</span>
				</div>
				<div class="terminal-body">
					<div class="terminal-cmd">
						<span class="terminal-prompt">$</span>
						<span class="terminal-command"
							>webgpu-chat --privacy=100% --engine=webllm</span
						>
					</div>
					<p class="terminal-desc">
						Inferência de inteligência artificial executada <strong
							>diretamente nos shaders da sua GPU</strong
						> via WebGPU & WebAssembly. Seus prompts nunca saem do seu navegador.
					</p>
					<div class="terminal-suggestions">
						<span class="suggestions-label">Perguntas Rápidas:</span>
						<div class="chips-container">
							{#each suggestions as sug}
								<button class="chip-btn" onclick={() => onSelectPrompt(sug)}>
									<span class="chip-arrow">›</span>
									{sug}
								</button>
							{/each}
						</div>
					</div>
				</div>
			</div>
		</div>
	{/if}

	{#each messages as msg, i}
		<div class="msg msg-{msg.role}">
			<div class="msg-meta">
				<div class="meta-left">
					<span class="role-badge role-{msg.role}">
						{#if msg.role === "user"}
							<span class="role-icon">👤</span> VOCÊ
						{:else}
							<span class="role-icon">⚡</span>
							{msg.sender ? msg.sender.toUpperCase() : "ASSISTENTE LOCAL"}
						{/if}
					</span>
				</div>

				<div class="meta-right">
					{#if msg.metaRight || msg.timestamp}
						{@const meta = msg.metaRight || msg.timestamp}
						{#if isTelemetry(meta)}
							<span class="meta-badge badge-telemetry">
								<span class="telemetry-dot"></span>
								{meta}
							</span>
						{:else if isClientSide(meta)}
							<span class="meta-badge badge-sovereign">
								🔒 {meta}
							</span>
						{:else}
							<span class="meta-badge badge-time">
								{meta}
							</span>
						{/if}
					{/if}

					{#if msg.content}
						<button
							class="copy-btn"
							onclick={() => copyMessage(msg.content, i)}
							title="Copiar mensagem"
							aria-label="Copiar mensagem"
						>
							{#if copiedIdx === i}
								<span class="copied-text">Copiado! ✓</span>
							{:else}
								<svg
									viewBox="0 0 24 24"
									width="12"
									height="12"
									fill="none"
									stroke="currentColor"
									stroke-width="2"
								>
									<rect x="9" y="9" width="13" height="13" rx="2" ry="2"
									></rect>
									<path
										d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"
									></path>
								</svg>
							{/if}
						</button>
					{/if}
				</div>
			</div>

			<div class="msg-content">
				{#if msg.role === "assistant"}
					{@html renderMarkdownWithThink(msg.content, markedInstance)}
				{:else}
					<p>{msg.content}</p>
				{/if}
			</div>
		</div>
	{/each}
</div>

<style>
	.chat-window {
		flex: 1;
		overflow-y: auto;
		display: flex;
		flex-direction: column;
		gap: 16px;
		padding: 10px 8px 10px 2px;
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

	/* Terminal Card de Boas-Vindas */
	.welcome-box {
		margin-bottom: 8px;
	}

	.terminal-card {
		width: 100%;
		background: var(--bg-surface);
		border: 1px solid var(--border-default);
		border-radius: 8px;
		overflow: hidden;
		box-shadow: 0 10px 28px rgba(0, 0, 0, 0.4);
		text-align: left;
	}

	.terminal-header {
		background: #06090e;
		padding: 0.55rem 0.85rem;
		border-bottom: 1px solid var(--border-muted);
		display: flex;
		align-items: center;
		gap: 0.75rem;
	}

	.terminal-dots {
		display: flex;
		gap: 6px;
	}

	.dot {
		width: 10px;
		height: 10px;
		border-radius: 50%;
	}

	.dot.red {
		background: #ff5f56;
	}
	.dot.yellow {
		background: #ffbd2e;
	}
	.dot.green {
		background: #27c93f;
	}

	.terminal-title {
		font-family: var(--font-mono);
		font-size: 0.75rem;
		color: var(--text-dim);
	}

	.terminal-body {
		padding: 1rem 1.25rem;
		font-family: var(--font-mono);
		font-size: 0.88rem;
		background: var(--bg-base);
	}

	.terminal-cmd {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		margin-bottom: 0.75rem;
	}

	.terminal-prompt {
		color: var(--accent-coral);
		font-weight: 700;
	}

	.terminal-command {
		color: var(--accent-green);
	}

	.terminal-desc {
		font-family: var(--font-sans);
		font-size: 0.92rem;
		color: var(--text-muted);
		line-height: 1.6;
		margin-bottom: 1.2rem;
	}

	.terminal-desc strong {
		color: var(--text-main);
	}

	.terminal-suggestions {
		border-top: 1px solid var(--border-muted);
		padding-top: 0.85rem;
	}

	.quick-title {
		font-size: 0.75rem;
		color: var(--accent-blue);
		text-transform: uppercase;
		letter-spacing: 0.05em;
		font-weight: 600;
		display: block;
		margin-bottom: 0.6rem;
	}

	.chips-container {
		display: flex;
		flex-wrap: wrap;
		gap: 0.5rem;
	}

	.chip-btn {
		background: var(--bg-card);
		border: 1px solid var(--border-muted);
		color: var(--text-muted);
		font-family: var(--font-mono);
		font-size: 0.78rem;
		padding: 5px 10px;
		border-radius: 6px;
		cursor: pointer;
		text-align: left;
		transition: all 0.2s ease;
		display: inline-flex;
		align-items: center;
		gap: 6px;
	}

	.chip-btn:hover {
		border-color: var(--accent-blue);
		color: var(--text-main);
		transform: translateY(-1px);
	}

	.chip-arrow {
		color: var(--accent-coral);
		font-weight: 700;
	}

	/* Mensagens */
	.msg {
		display: flex;
		flex-direction: column;
		max-width: 88%;
		padding: 12px 16px;
		border-radius: 8px;
		line-height: 1.6;
		font-size: 14px;
		word-wrap: break-word;
		position: relative;
	}

	.msg-user {
		align-self: flex-end;
		background: var(--bg-card);
		border: 1px solid var(--border-default);
		border-top: 2px solid var(--accent-blue);
		color: var(--text-main);
		box-shadow: 0 4px 16px rgba(0, 0, 0, 0.3);
	}

	.msg-assistant {
		align-self: flex-start;
		background: var(--bg-surface);
		border: 1px solid var(--border-muted);
		border-top: 2px solid var(--accent-green);
		color: var(--text-main);
		box-shadow: 0 4px 16px rgba(0, 0, 0, 0.3);
	}

	.msg-meta {
		display: flex;
		justify-content: space-between;
		align-items: center;
		gap: 8px;
		margin-bottom: 8px;
		padding-bottom: 6px;
		border-bottom: 1px solid var(--border-muted);
		font-family: var(--font-mono);
		flex-wrap: wrap;
	}

	.meta-left,
	.meta-right {
		display: flex;
		align-items: center;
		gap: 6px;
	}

	.role-badge {
		font-size: 10px;
		font-weight: 700;
		padding: 2px 7px;
		border-radius: 4px;
		letter-spacing: 0.5px;
		display: inline-flex;
		align-items: center;
		gap: 4px;
	}

	.role-user {
		background: rgba(88, 166, 255, 0.15);
		color: var(--accent-blue);
		border: 1px solid rgba(88, 166, 255, 0.3);
	}

	.role-assistant {
		background: rgba(126, 231, 135, 0.12);
		color: var(--accent-green);
		border: 1px solid rgba(126, 231, 135, 0.3);
	}

	.role-icon {
		font-size: 9px;
	}

	.meta-badge {
		font-size: 10px;
		font-weight: 600;
		padding: 2px 6px;
		border-radius: 4px;
		display: inline-flex;
		align-items: center;
		gap: 4px;
	}

	.badge-telemetry {
		background: rgba(57, 197, 187, 0.12);
		color: var(--accent-cyan);
		border: 1px solid rgba(57, 197, 187, 0.3);
	}

	.telemetry-dot {
		width: 5px;
		height: 5px;
		border-radius: 50%;
		background-color: var(--accent-cyan);
	}

	.badge-sovereign {
		background: rgba(126, 231, 135, 0.12);
		color: var(--accent-green);
		border: 1px solid rgba(126, 231, 135, 0.3);
	}

	.badge-time {
		background: var(--bg-card);
		color: var(--text-dim);
		border: 1px solid var(--border-muted);
	}

	.copy-btn {
		background: transparent;
		border: 1px solid transparent;
		color: var(--text-dim);
		cursor: pointer;
		padding: 2px 5px;
		border-radius: 4px;
		display: inline-flex;
		align-items: center;
		transition: all 0.15s ease;
	}

	.copy-btn:hover {
		color: var(--text-main);
		border-color: var(--border-default);
		background: var(--bg-card);
	}

	.copied-text {
		color: var(--accent-green);
		font-size: 10px;
		font-weight: 700;
	}

	/* Conteúdo textual da mensagem */
	.msg-content {
		font-size: 14px;
		line-height: 1.6;
		overflow-wrap: break-word;
		word-break: break-word;
	}

	:global(.msg-content p) {
		margin-bottom: 8px;
	}

	:global(.msg-content p:last-child) {
		margin-bottom: 0;
	}

	:global(.msg-content ul, .msg-content ol) {
		margin: 8px 0 8px 18px;
	}

	:global(.msg-content li) {
		margin-bottom: 4px;
	}

	:global(.msg-content h1, .msg-content h2, .msg-content h3, .msg-content h4) {
		margin: 12px 0 6px 0;
		color: var(--text-main);
		font-weight: 700;
	}

	:global(.msg-content h1) {
		font-size: 16px;
		color: var(--accent-blue);
	}
	:global(.msg-content h2) {
		font-size: 15px;
		color: var(--accent-green);
	}
	:global(.msg-content h3) {
		font-size: 14px;
		color: var(--accent-purple);
	}

	:global(.msg-content blockquote) {
		border-left: 3px solid var(--accent-blue);
		padding: 6px 12px;
		margin: 8px 0;
		background: rgba(88, 166, 255, 0.06);
		border-radius: 0 6px 6px 0;
		color: var(--text-muted);
		font-style: italic;
	}

	:global(.msg-content table) {
		border-collapse: collapse;
		width: 100%;
		margin: 10px 0;
		font-size: 12.5px;
		border-radius: 6px;
		overflow-x: auto;
		display: block;
	}

	:global(.msg-content th, .msg-content td) {
		border: 1px solid var(--border-default);
		padding: 6px 10px;
		text-align: left;
	}

	:global(.msg-content th) {
		background-color: var(--bg-card);
		color: var(--accent-blue);
		font-weight: 700;
	}

	:global(.msg-content tr:nth-child(even)) {
		background-color: rgba(255, 255, 255, 0.02);
	}

	:global(.msg-content hr) {
		border: 0;
		border-top: 1px solid var(--border-muted);
		margin: 12px 0;
	}

	:global(.msg-content a) {
		color: var(--accent-blue);
		text-decoration: underline;
	}

	:global(.msg-content strong) {
		color: #ffffff;
		font-weight: 700;
	}

	/* Bloco de Raciocínio Interno <think> com details expansível */
	:global(.think-block) {
		background: rgba(255, 166, 87, 0.05);
		border: 1px solid rgba(255, 166, 87, 0.25);
		border-left: 3px solid var(--accent-orange);
		border-radius: 6px;
		margin: 10px 0;
		overflow: hidden;
		font-family: var(--font-mono);
		font-size: 12px;
	}

	:global(.think-summary) {
		padding: 6px 10px;
		cursor: pointer;
		display: flex;
		align-items: center;
		gap: 6px;
		user-select: none;
		background: rgba(255, 166, 87, 0.08);
		color: var(--accent-orange);
		font-weight: 700;
		font-size: 11px;
	}

	:global(.think-summary:hover) {
		background: rgba(255, 166, 87, 0.12);
	}

	:global(.think-pill) {
		font-size: 9px;
		padding: 1px 5px;
		border-radius: 3px;
		background: rgba(255, 255, 255, 0.08);
		color: var(--text-dim);
		margin-left: auto;
		text-transform: uppercase;
		letter-spacing: 0.5px;
	}

	:global(.think-pill.thinking) {
		color: var(--accent-coral);
		background: rgba(255, 123, 114, 0.15);
	}

	:global(.think-content) {
		padding: 8px 12px;
		color: var(--text-muted);
		white-space: pre-wrap;
		line-height: 1.5;
		border-top: 1px solid rgba(255, 166, 87, 0.15);
	}

	/* Código */
	:global(.msg-content pre) {
		background-color: #06090e;
		border: 1px solid var(--border-muted);
		padding: 10px 14px;
		border-radius: 6px;
		font-family: var(--font-mono);
		font-size: 12.5px;
		line-height: 1.5;
		margin: 10px 0;
		overflow-x: auto;
		white-space: pre-wrap;
		word-break: break-all;
	}

	:global(.msg-content code) {
		background-color: rgba(88, 166, 255, 0.1);
		color: var(--accent-blue);
		padding: 0.15rem 0.35rem;
		border-radius: 4px;
		font-family: var(--font-mono);
		font-size: 0.85em;
	}

	:global(.msg-content pre code) {
		background-color: transparent;
		color: var(--text-main);
		padding: 0;
		border: none;
	}

	@media (max-width: 640px) {
		.chat-window {
			gap: 12px;
			padding: 6px 2px;
		}

		.msg {
			max-width: 96%;
			padding: 10px 12px;
			font-size: 13.5px;
		}

		.chips-container {
			flex-direction: column;
		}

		.chip-btn {
			width: 100%;
			font-size: 12px;
		}
	}
</style>
