let markedInstance = null;

/**
 * Carrega a biblioteca marked via ESM client-side.
 */
export async function getMarked() {
	if (markedInstance) return markedInstance;
	try {
		const mod = await import(/* @vite-ignore */ "https://esm.run/marked");
		mod.marked.setOptions({
			breaks: true,
			gfm: true,
		});
		markedInstance = mod.marked;
		return markedInstance;
	} catch (err) {
		console.warn("Não foi possível carregar marked:", err);
		return null;
	}
}

/**
 * Processa blocos <think>...</think> e converte markdown em HTML seguro.
 *
 * @param {string} rawText
 * @param {any} [marked]
 * @returns {string}
 */
export function renderMarkdownWithThink(rawText, marked = markedInstance) {
	if (!rawText) return "";
	let processed = rawText;

	if (processed.includes("<think>")) {
		if (processed.includes("</think>")) {
			processed = processed.replace(
				/<think>([\s\S]*?)<\/think>/g,
				'<details class="think-block"><summary class="think-summary"><span class="think-icon">🧠</span><span class="think-label">Raciocínio Interno (&lt;think&gt;)</span><span class="think-pill">concluído</span></summary><div class="think-content">$1</div></details>',
			);
		} else {
			processed = processed.replace(
				/<think>([\s\S]*)$/g,
				'<details class="think-block"><summary class="think-summary"><span class="think-icon">🧠</span><span class="think-label">Pensando (&lt;think&gt;)...</span><span class="think-pill thinking">em andamento</span></summary><div class="think-content">$1</div></details>',
			);
		}
	}

	if (marked && typeof marked.parse === "function") {
		return marked.parse(processed);
	}

	return processed.replace(/\n/g, "<br>");
}
