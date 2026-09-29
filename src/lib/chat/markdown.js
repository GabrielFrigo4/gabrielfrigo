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
				'<div class="think-block"><span class="think-label">Raciocínio Interno (&lt;think&gt;)</span>$1</div>',
			);
		} else {
			processed = processed.replace(
				/<think>([\s\S]*)$/g,
				'<div class="think-block"><span class="think-label">Raciocínio Interno (&lt;think&gt;)</span>$1</div>',
			);
		}
	}

	if (marked && typeof marked.parse === "function") {
		return marked.parse(processed);
	}

	return processed.replace(/\n/g, "<br>");
}
