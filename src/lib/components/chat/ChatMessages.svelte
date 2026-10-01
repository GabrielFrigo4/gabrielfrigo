<script>
	import { tick, onMount } from "svelte";
	import { renderMarkdownWithThink } from "$lib/chat/markdown.js";

	let {
		messages = [],
		markedInstance = null,
		isGenerating = false,
		gpuStatus = "Verificando WebGPU...",
		isGpuSoftware = false,
		onSelectPrompt = () => {},
	} = $props();

	let chatContainer = $state(null);
	let copiedIdx = $state(null);
	let isPinned = $state(true);
	let showScrollBottomBtn = $state(false);
	let isSmoothScrolling = false;
	let lastMessageCount = 0;

	export function scrollToBottom(smooth = false) {
		if (!chatContainer) return;
		if (smooth) {
			isSmoothScrolling = true;
			chatContainer.scrollTo({
				top: chatContainer.scrollHeight,
				behavior: "smooth",
			});
			setTimeout(() => {
				isSmoothScrolling = false;
				if (chatContainer) {
					chatContainer.scrollTop = chatContainer.scrollHeight;
				}
			}, 350);
		} else {
			chatContainer.scrollTop = chatContainer.scrollHeight;
		}
	}

	function handleScroll() {
		if (!chatContainer || isSmoothScrolling) return;
		const distanceFromBottom =
			chatContainer.scrollHeight - chatContainer.scrollTop - chatContainer.clientHeight;

		if (distanceFromBottom <= 40) {
			isPinned = true;
			showScrollBottomBtn = false;
		} else {
			isPinned = false;
			showScrollBottomBtn = true;
		}
	}

	function handleScrollToBottomClick() {
		isPinned = true;
		showScrollBottomBtn = false;
		scrollToBottom(true);
	}

	$effect(() => {
		if (messages.length) {
			const _ = messages[messages.length - 1]?.content;
			const currentCount = messages.length;

			if (currentCount > lastMessageCount) {
				isPinned = true;
				showScrollBottomBtn = false;
				lastMessageCount = currentCount;
			}

			tick().then(() => {
				if (isPinned && chatContainer) {
					chatContainer.scrollTop = chatContainer.scrollHeight;
				}
			});
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

<div class="chat-messages-container">
	<div class="chat-window" bind:this={chatContainer} onscroll={handleScroll}>
		{#if messages.length === 0}
			<div class="welcome-hero">
				<div class="welcome-badge" class:welcome-badge-warn={isGpuSoftware}>
					<span class="badge-dot" class:badge-dot-warn={isGpuSoftware}></span>
					<span>{gpuStatus} · Shaders WebGPU</span>
				</div>

				<h1 class="welcome-title">
					Chat Local <span class="gradient-text">Soberano</span>
				</h1>

				<p class="welcome-desc">
					Execute modelos de linguagem de última geração diretamente na GPU do seu
					navegador. Privacidade matemática absoluta: nenhum prompt ou tensor trafega
					pela nuvem.
				</p>

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
							<svg
								class="refresh-icon"
								width="13"
								height="13"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								stroke-width="2.3"
								stroke-linecap="round"
								stroke-linejoin="round"
								aria-hidden="true"
							>
								<path
									d="M21.5 2v6h-6M2.5 22v-6h6M2 11.5a10 10 0 0 1 18.8-4.3M22 12.5a10 10 0 0 1-18.8 4.2"
								/>
							</svg>
						</button>
					</div>
				</div>
			</div>
		{/if}

		{#each messages as msg, i}
			<div class="msg msg-{msg.role}">
				<div class="msg-header">
					<div class="msg-author-group">
						{#if msg.role === "user"}
							<span class="author-name author-user">gabriel</span>
						{:else}
							<span class="author-symbol">λ</span>
							<span class="author-name author-ai"
								>{msg.sender
									? msg.sender.toLowerCase()
									: "assistente local"}</span
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

				{#if msg.role === "assistant" && msg.content}
					<div class="msg-footer">
						<div class="telemetry-whisper">
							{#if msg.metaRight}
								<span class="telemetry-text">
									<svg
										class="telemetry-bolt"
										width="11"
										height="11"
										viewBox="0 0 24 24"
										fill="currentColor"
										aria-hidden="true"
									>
										<polygon
											points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"
										/>
									</svg>
									<span>{msg.metaRight}</span>
								</span>
							{/if}
						</div>

						<button
							class="copy-btn"
							onclick={() => copyMessage(msg.content, i)}
							title="Copiar mensagem"
							aria-label="Copiar mensagem"
						>
							{#if copiedIdx === i}
								<span class="copied-wrap">
									<span>Copiado!</span>
									<svg
										width="12"
										height="12"
										viewBox="0 0 24 24"
										fill="none"
										stroke="currentColor"
										stroke-width="2.5"
										stroke-linecap="round"
										stroke-linejoin="round"
										aria-hidden="true"
									>
										<polyline points="20 6 9 17 4 12" />
									</svg>
								</span>
							{:else}
								<span>Copiar</span>
							{/if}
						</button>
					</div>
				{/if}
			</div>
		{/each}
	</div>

	{#if showScrollBottomBtn}
		<button
			type="button"
			class="scroll-bottom-btn"
			onclick={handleScrollToBottomClick}
			title={isGenerating ? "Voltar a acompanhar digitação" : "Rolar para o fim"}
			aria-label="Rolar para o fim das mensagens"
		>
			{#if isGenerating}
				<span class="stream-pulse"></span>
				<svg
					class="scroll-bottom-icon"
					width="13"
					height="13"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2.4"
					stroke-linecap="round"
					stroke-linejoin="round"
					aria-hidden="true"
				>
					<line x1="12" y1="5" x2="12" y2="19" />
					<polyline points="19 12 12 19 5 12" />
				</svg>
				<span class="scroll-bottom-text">Acompanhar digitação</span>
			{:else}
				<svg
					class="scroll-bottom-icon"
					width="13"
					height="13"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2.4"
					stroke-linecap="round"
					stroke-linejoin="round"
					aria-hidden="true"
				>
					<line x1="12" y1="5" x2="12" y2="19" />
					<polyline points="19 12 12 19 5 12" />
				</svg>
				<span class="scroll-bottom-text">Rolar para o fim</span>
			{/if}
		</button>
	{/if}
</div>

<style>
	.chat-messages-container {
		flex: 1;
		position: relative;
		display: flex;
		flex-direction: column;
		min-height: 0;
		min-width: 0;
		width: 100%;
		max-width: 100%;
		overflow: hidden;
	}

	.chat-window {
		flex: 1;
		overflow-y: auto;
		overflow-x: hidden;
		display: flex;
		flex-direction: column;
		gap: 1.25rem;
		padding: 1.5rem 0.5rem 1rem 0;
		min-width: 0;
		width: 100%;
	}

	.scroll-bottom-btn {
		position: absolute;
		bottom: 1.25rem;
		left: 50%;
		transform: translateX(-50%);
		background: rgba(13, 17, 23, 0.94);
		border: 1px solid var(--accent-blue);
		color: var(--accent-blue);
		box-shadow:
			0 4px 16px rgba(0, 0, 0, 0.4),
			0 0 12px rgba(88, 166, 255, 0.25);
		border-radius: 20px;
		padding: 0.45rem 1rem;
		font-family: var(--font-mono);
		font-size: 0.78rem;
		font-weight: 600;
		cursor: pointer;
		display: inline-flex;
		align-items: center;
		gap: 0.45rem;
		backdrop-filter: blur(8px);
		-webkit-backdrop-filter: blur(8px);
		z-index: 20;
		animation: pop-up 0.2s cubic-bezier(0.16, 1, 0.3, 1);
		transition: all 0.15s ease;
	}

	.scroll-bottom-btn:hover {
		background: var(--accent-blue);
		color: #090d13;
		box-shadow: 0 4px 20px rgba(88, 166, 255, 0.5);
		transform: translateX(-50%) translateY(-2px);
	}

	.scroll-bottom-icon {
		flex-shrink: 0;
	}

	.stream-pulse {
		width: 7px;
		height: 7px;
		border-radius: 50%;
		background: var(--accent-green);
		animation: pulse-ring 1.5s infinite;
	}

	@keyframes pulse-ring {
		0% {
			transform: scale(0.9);
			box-shadow: 0 0 0 0 rgba(126, 231, 135, 0.7);
		}
		70% {
			transform: scale(1.1);
			box-shadow: 0 0 0 6px rgba(126, 231, 135, 0);
		}
		100% {
			transform: scale(0.9);
			box-shadow: 0 0 0 0 rgba(126, 231, 135, 0);
		}
	}

	@keyframes pop-up {
		from {
			opacity: 0;
			transform: translateX(-50%) translateY(8px);
		}
		to {
			opacity: 1;
			transform: translateX(-50%) translateY(0);
		}
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
		max-width: 100%;
		box-sizing: border-box;
		word-break: break-word;
	}

	.welcome-badge-warn {
		border-color: rgba(255, 123, 114, 0.3);
		color: var(--accent-coral);
	}

	.badge-dot {
		width: 7px;
		height: 7px;
		border-radius: 50%;
		background: var(--accent-green);
		box-shadow: 0 0 6px var(--accent-green);
	}

	.badge-dot-warn {
		background: var(--accent-coral) !important;
		box-shadow: 0 0 6px var(--accent-coral) !important;
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

	.single-suggestion-container {
		display: flex;
		justify-content: center;
		width: 100%;
		max-width: 680px;
		min-width: 0;
		box-sizing: border-box;
	}

	.suggestion-pill {
		display: flex;
		align-items: center;
		background: var(--bg-surface);
		border: 1px solid var(--border-subtle);
		border-radius: 6px;
		transition: all 0.15s ease;
		width: 100%;
		max-width: 100%;
		min-width: 0;
		overflow: hidden;
		box-sizing: border-box;
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
		flex: 1 1 auto;
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

	.msg {
		display: flex;
		flex-direction: column;
		padding: 1.25rem 1.4rem;
		border-radius: 8px;
		line-height: 1.6;
		font-size: 0.92rem;
		word-break: break-word;
		overflow-wrap: anywhere;
		min-width: 0;
		max-width: 100%;
		box-sizing: border-box;
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
		gap: 1rem;
		flex-wrap: wrap;
	}

	.msg-author-group {
		display: flex;
		align-items: center;
		gap: 0.35rem;
		font-family: var(--font-mono);
		font-size: 0.78rem;
		min-width: 0;
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
		word-break: break-word;
		overflow-wrap: anywhere;
	}

	.msg-footer {
		display: flex;
		justify-content: space-between;
		align-items: center;
		flex-wrap: wrap;
		gap: 0.5rem;
		margin-top: 1rem;
		padding-top: 0.65rem;
		border-top: 1px solid var(--border-muted);
		font-family: var(--font-mono);
		font-size: 0.75rem;
		width: 100%;
		min-width: 0;
	}

	.telemetry-whisper {
		color: var(--text-dim);
		min-width: 0;
		flex: 1 1 auto;
		word-break: break-word;
		line-height: 1.4;
	}

	.telemetry-text {
		display: inline-flex;
		align-items: center;
		gap: 4px;
	}

	.telemetry-bolt {
		flex-shrink: 0;
		color: var(--accent-blue);
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

	.copied-wrap {
		display: inline-flex;
		align-items: center;
		gap: 4px;
		color: var(--accent-green);
	}

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
		max-width: 100%;
		box-sizing: border-box;
		-webkit-overflow-scrolling: touch;
		margin: 0.8rem 0;
	}

	:global(.msg-body pre code) {
		background: transparent;
		padding: 0;
		border: none;
		color: var(--text-main);
		white-space: pre;
		word-break: normal;
		overflow-wrap: normal;
	}

	:global(.think-block) {
		background: rgba(13, 17, 23, 0.6);
		border: 1px solid var(--border-muted);
		border-radius: 6px;
		margin: 0.75rem 0;
		overflow: hidden;
		max-width: 100%;
		box-sizing: border-box;
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
		.chat-window {
			padding: 1rem 0.25rem 0.75rem 0;
			gap: 1rem;
		}

		.welcome-hero {
			padding: 1.75rem 0.5rem 1.25rem;
		}

		.welcome-title {
			font-size: clamp(1.4rem, 6vw, 1.8rem);
		}

		.welcome-desc {
			font-size: 0.88rem;
			padding: 0 0.25rem;
		}

		.suggestion-content-btn {
			font-size: 0.75rem;
			padding: 0.5rem 0.65rem 0.5rem 0.75rem;
		}

		.suggestion-refresh-btn {
			padding: 0.5rem 0.65rem;
		}

		.msg {
			padding: 0.85rem 0.95rem;
			font-size: 0.88rem;
		}

		.msg-user {
			max-width: 92%;
		}

		.msg-header {
			gap: 0.75rem;
		}

		.telemetry-whisper {
			font-size: 0.7rem;
		}

		.copy-btn {
			padding: 2px 6px;
			font-size: 0.7rem;
		}
	}

	@media (max-width: 480px) {
		.msg-user {
			max-width: 96%;
		}

		.msg {
			padding: 0.75rem 0.85rem;
		}

		.scroll-bottom-btn {
			bottom: 0.75rem;
			padding: 0.35rem 0.75rem;
			font-size: 0.72rem;
		}
	}
</style>
