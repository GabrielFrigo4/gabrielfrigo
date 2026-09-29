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
		// Observa mensagens para rolagem automática contínua
		if (messages.length) {
			const _ = messages[messages.length - 1]?.content;
			tick().then(scrollToBottom);
		}
	});
</script>

<div class="chat-window" bind:this={chatContainer}>
	{#each messages as msg}
		<div class="msg msg-{msg.role}">
			<div class="msg-meta">
				<span>{msg.role === "user" ? "Você" : msg.sender || "Assistente Local"}</span>
				<span>{msg.metaRight || msg.timestamp || ""}</span>
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
		padding-right: 8px;
		scroll-behavior: smooth;
	}

	.msg {
		display: flex;
		flex-direction: column;
		max-width: 85%;
		padding: 12px 16px;
		border-radius: 10px;
		line-height: 1.55;
		font-size: 14px;
		word-wrap: break-word;
	}

	.msg-user {
		align-self: flex-end;
		background-color: var(--accent-blue, #3b82f6);
		color: #ffffff;
		border-bottom-right-radius: 2px;
	}

	.msg-assistant {
		align-self: flex-start;
		background-color: var(--bg-surface, #0d1117);
		border: 1px solid var(--border-default, #30363d);
		color: var(--text-main, #f0f6fc);
		border-bottom-left-radius: 2px;
	}

	.msg-meta {
		font-size: 10.5px;
		color: var(--text-muted, #8b949e);
		margin-bottom: 4px;
		font-family: var(--font-mono, monospace);
		display: flex;
		justify-content: space-between;
		gap: 8px;
	}

	.msg-user .msg-meta {
		color: rgba(255, 255, 255, 0.75);
	}

	.msg-content {
		font-size: 14px;
	}

	:global(.msg-content p) {
		margin-bottom: 8px;
	}

	:global(.msg-content p:last-child) {
		margin-bottom: 0;
	}

	:global(.msg-content ul, .msg-content ol) {
		margin: 8px 0 8px 20px;
	}

	:global(.msg-content li) {
		margin-bottom: 4px;
	}

	:global(.msg-content h1, .msg-content h2, .msg-content h3, .msg-content h4) {
		margin: 12px 0 6px 0;
		color: var(--text-main, #f0f6fc);
		font-weight: 600;
	}

	:global(.msg-content h1) {
		font-size: 16px;
	}
	:global(.msg-content h2) {
		font-size: 15px;
	}
	:global(.msg-content h3) {
		font-size: 14px;
	}

	:global(.msg-content blockquote) {
		border-left: 3px solid var(--accent-blue, #58a6ff);
		padding-left: 10px;
		margin: 8px 0;
		color: var(--text-muted, #8b949e);
		font-style: italic;
	}

	:global(.msg-content table) {
		border-collapse: collapse;
		width: 100%;
		margin: 10px 0;
		font-size: 12.5px;
	}

	:global(.msg-content th, .msg-content td) {
		border: 1px solid var(--border-default, #30363d);
		padding: 6px 10px;
		text-align: left;
	}

	:global(.msg-content th) {
		background-color: var(--bg-card, #161b22);
		color: var(--accent-blue, #58a6ff);
		font-weight: 600;
	}

	:global(.msg-content hr) {
		border: 0;
		border-top: 1px solid var(--border-default, #30363d);
		margin: 12px 0;
	}

	:global(.msg-content a) {
		color: var(--accent-blue, #58a6ff);
		text-decoration: underline;
	}

	:global(.msg-content strong) {
		color: #ffffff;
	}

	:global(.think-block) {
		background-color: rgba(255, 255, 255, 0.04);
		border-left: 3px solid var(--accent-orange, #ffa657);
		padding: 8px 12px;
		margin: 8px 0;
		border-radius: 4px;
		font-size: 12.5px;
		color: var(--text-muted, #8b949e);
		font-family: var(--font-mono, monospace);
		white-space: pre-wrap;
	}

	:global(.think-label) {
		display: block;
		font-size: 11px;
		font-weight: 700;
		color: var(--accent-orange, #ffa657);
		text-transform: uppercase;
		letter-spacing: 0.5px;
		margin-bottom: 4px;
	}

	:global(.msg-content pre) {
		background-color: var(--bg-card, #161b22);
		border: 1px solid var(--border-default, #30363d);
		padding: 10px;
		border-radius: 6px;
		font-family: var(--font-mono, monospace);
		font-size: 12.5px;
		margin: 8px 0;
		overflow-x: auto;
		white-space: pre-wrap;
	}

	:global(.msg-content code) {
		background-color: rgba(255, 255, 255, 0.1);
		padding: 2px 5px;
		border-radius: 4px;
		font-family: var(--font-mono, monospace);
		font-size: 12.5px;
	}

	:global(.msg-content pre code) {
		background-color: transparent;
		padding: 0;
		border-radius: 0;
	}
</style>
