<script>
	import { tick } from "svelte";
	import { renderMarkdownWithThink } from "$lib/chat/markdown.js";

	let { messages = [], markedInstance = null } = $props();

	let chatContainer = $state(null);

	export function scrollToBottom() {
		if (chatContainer) {
			chatContainer.scrollTop = chatContainer.scrollHeight;
		}
	}

	$effect(() => {
		// Observa mensagens para rolagem automática reativa
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
</script>

<div class="chat-window" bind:this={chatContainer}>
	{#each messages as msg}
		<div class="msg msg-{msg.role}">
			<!-- Barra de metadados refinada com alto contraste -->
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
		gap: 20px;
		padding: 12px 10px 12px 2px;
		scroll-behavior: smooth;
	}

	/* Custom Scrollbar */
	.chat-window::-webkit-scrollbar {
		width: 6px;
	}
	.chat-window::-webkit-scrollbar-track {
		background: transparent;
	}
	.chat-window::-webkit-scrollbar-thumb {
		background: rgba(75, 85, 99, 0.4);
		border-radius: 4px;
	}
	.chat-window::-webkit-scrollbar-thumb:hover {
		background: rgba(147, 197, 253, 0.5);
	}

	.msg {
		display: flex;
		flex-direction: column;
		max-width: 88%;
		padding: 14px 18px;
		border-radius: 12px;
		line-height: 1.65;
		font-size: 14.5px;
		word-wrap: break-word;
		position: relative;
		transition: transform 0.15s ease;
	}

	/* Balão do Usuário: Dark Cobalt Moderno com Glow sutil */
	.msg-user {
		align-self: flex-end;
		background: linear-gradient(
			135deg,
			rgba(30, 58, 138, 0.45) 0%,
			rgba(15, 23, 42, 0.85) 100%
		);
		border: 1px solid rgba(96, 165, 250, 0.45);
		color: #f8fafc;
		border-bottom-right-radius: 3px;
		box-shadow:
			0 4px 20px rgba(0, 0, 0, 0.45),
			0 0 15px rgba(59, 130, 246, 0.12);
	}

	/* Balão do Assistente: Matte Obsidian com Borda Acinzentada */
	.msg-assistant {
		align-self: flex-start;
		background: rgba(15, 23, 42, 0.85);
		backdrop-filter: blur(10px);
		border: 1px solid rgba(55, 65, 81, 0.7);
		color: #f1f5f9;
		border-bottom-left-radius: 3px;
		box-shadow:
			0 4px 22px rgba(0, 0, 0, 0.4),
			inset 0 1px 0 rgba(255, 255, 255, 0.04);
	}

	/* ========================================================
	   METADADOS DAS LETRAS MIÚDAS (ALTO CONTRASTE E NITIDEZ)
	   ======================================================== */
	.msg-meta {
		display: flex;
		justify-content: space-between;
		align-items: center;
		gap: 12px;
		margin-bottom: 8px;
		padding-bottom: 6px;
		border-bottom: 1px solid rgba(255, 255, 255, 0.07);
		font-family: var(--font-mono, monospace);
	}

	.msg-user .msg-meta {
		border-bottom-color: rgba(96, 165, 250, 0.2);
	}

	.meta-left,
	.meta-right {
		display: flex;
		align-items: center;
		gap: 8px;
	}

	.role-badge {
		font-size: 11px;
		font-weight: 700;
		padding: 2.5px 8px;
		border-radius: 5px;
		letter-spacing: 0.5px;
		display: inline-flex;
		align-items: center;
		gap: 5px;
	}

	.role-user {
		background-color: rgba(59, 130, 246, 0.22);
		color: #93c5fd;
		border: 1px solid rgba(147, 197, 253, 0.35);
	}

	.role-assistant {
		background-color: rgba(16, 185, 129, 0.18);
		color: #6ee7b7;
		border: 1px solid rgba(110, 231, 183, 0.4);
	}

	.role-icon {
		font-size: 10px;
	}

	.meta-badge {
		font-size: 11px;
		font-weight: 600;
		padding: 2.5px 8px;
		border-radius: 5px;
		display: inline-flex;
		align-items: center;
		gap: 5px;
		letter-spacing: 0.3px;
	}

	.badge-telemetry {
		background-color: rgba(6, 182, 212, 0.18);
		color: #67e8f9;
		border: 1px solid rgba(103, 232, 249, 0.45);
	}

	.telemetry-dot {
		width: 6px;
		height: 6px;
		border-radius: 50%;
		background-color: #22d3ee;
		box-shadow: 0 0 6px #22d3ee;
	}

	.badge-sovereign {
		background-color: rgba(16, 185, 129, 0.18);
		color: #34d399;
		border: 1px solid rgba(52, 211, 153, 0.45);
	}

	.badge-time {
		background-color: rgba(51, 65, 85, 0.5);
		color: #e2e8f0;
		border: 1px solid rgba(100, 116, 139, 0.45);
	}

	/* Conteúdo textual da mensagem */
	.msg-content {
		font-size: 14.5px;
		line-height: 1.65;
	}

	:global(.msg-content p) {
		margin-bottom: 10px;
	}

	:global(.msg-content p:last-child) {
		margin-bottom: 0;
	}

	:global(.msg-content ul, .msg-content ol) {
		margin: 10px 0 10px 22px;
	}

	:global(.msg-content li) {
		margin-bottom: 5px;
	}

	:global(.msg-content h1, .msg-content h2, .msg-content h3, .msg-content h4) {
		margin: 14px 0 8px 0;
		color: #f8fafc;
		font-weight: 700;
		letter-spacing: -0.2px;
	}

	:global(.msg-content h1) {
		font-size: 17px;
		color: #93c5fd;
	}
	:global(.msg-content h2) {
		font-size: 15.5px;
		color: #6ee7b7;
	}
	:global(.msg-content h3) {
		font-size: 14.5px;
		color: #d8b4fe;
	}

	:global(.msg-content blockquote) {
		border-left: 3px solid #38bdf8;
		padding: 6px 14px;
		margin: 10px 0;
		background: rgba(56, 189, 248, 0.08);
		border-radius: 0 6px 6px 0;
		color: #cbd5e1;
		font-style: italic;
	}

	:global(.msg-content table) {
		border-collapse: collapse;
		width: 100%;
		margin: 12px 0;
		font-size: 13px;
		border-radius: 6px;
		overflow: hidden;
	}

	:global(.msg-content th, .msg-content td) {
		border: 1px solid rgba(75, 85, 99, 0.6);
		padding: 8px 12px;
		text-align: left;
	}

	:global(.msg-content th) {
		background-color: #1e293b;
		color: #38bdf8;
		font-weight: 700;
	}

	:global(.msg-content tr:nth-child(even)) {
		background-color: rgba(255, 255, 255, 0.02);
	}

	:global(.msg-content hr) {
		border: 0;
		border-top: 1px solid rgba(75, 85, 99, 0.6);
		margin: 14px 0;
	}

	:global(.msg-content a) {
		color: #38bdf8;
		text-decoration: underline;
		font-weight: 500;
	}

	:global(.msg-content a:hover) {
		color: #93c5fd;
		text-shadow: 0 0 8px rgba(56, 189, 248, 0.4);
	}

	:global(.msg-content strong) {
		color: #ffffff;
		font-weight: 700;
	}

	/* Bloco de Raciocínio Interno <think> de Alto Contraste */
	:global(.think-block) {
		background-color: rgba(245, 158, 11, 0.08);
		border: 1px solid rgba(245, 158, 11, 0.35);
		border-left: 4px solid #f59e0b;
		padding: 10px 14px;
		margin: 12px 0;
		border-radius: 6px;
		font-size: 13px;
		color: #e2e8f0;
		font-family: var(--font-mono, monospace);
		white-space: pre-wrap;
		box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
	}

	:global(.think-label) {
		display: block;
		font-size: 11px;
		font-weight: 800;
		color: #fbbf24;
		text-transform: uppercase;
		letter-spacing: 0.6px;
		margin-bottom: 6px;
	}

	/* Blocos de Código e Sintaxe */
	:global(.msg-content pre) {
		background-color: #060911;
		border: 1px solid rgba(55, 65, 81, 0.8);
		padding: 12px 16px;
		border-radius: 8px;
		font-family: var(--font-mono, monospace);
		font-size: 13px;
		line-height: 1.5;
		margin: 12px 0;
		overflow-x: auto;
		white-space: pre-wrap;
		box-shadow: inset 0 2px 6px rgba(0, 0, 0, 0.5);
	}

	:global(.msg-content code) {
		background-color: rgba(59, 130, 246, 0.15);
		color: #93c5fd;
		border: 1px solid rgba(147, 197, 253, 0.25);
		padding: 2px 6px;
		border-radius: 4px;
		font-family: var(--font-mono, monospace);
		font-size: 12.5px;
	}

	:global(.msg-content pre code) {
		background-color: transparent;
		color: #f1f5f9;
		padding: 0;
		border: none;
	}
</style>
