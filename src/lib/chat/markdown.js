let markedInstance = null;

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

export function renderMarkdownWithThink(rawText, marked = markedInstance) {
	if (!rawText) return "";
	let processed = rawText;

	const thinkIconSvg =
		'<svg class="think-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="4" y="4" width="16" height="16" rx="2"/><rect x="9" y="9" width="6" height="6"/><line x1="9" y1="1" x2="9" y2="4"/><line x1="15" y1="1" x2="15" y2="4"/><line x1="9" y1="20" x2="9" y2="23"/><line x1="15" y1="20" x2="15" y2="23"/><line x1="20" y1="9" x2="23" y2="9"/><line x1="20" y1="14" x2="23" y2="14"/><line x1="1" y1="9" x2="4" y2="9"/><line x1="1" y1="14" x2="4" y2="14"/></svg>';

	if (processed.includes("<think>")) {
		if (processed.includes("</think>")) {
			processed = processed.replace(
				/<think>([\s\S]*?)<\/think>/g,
				`<details class="think-block"><summary class="think-summary">${thinkIconSvg}<span class="think-label">Raciocínio Interno (&lt;think&gt;)</span><span class="think-pill">concluído</span></summary><div class="think-content">$1</div></details>`,
			);
		} else {
			processed = processed.replace(
				/<think>([\s\S]*)$/g,
				`<details class="think-block"><summary class="think-summary">${thinkIconSvg}<span class="think-label">Pensando (&lt;think&gt;)...</span><span class="think-pill thinking">em andamento</span></summary><div class="think-content">$1</div></details>`,
			);
		}
	}

	if (marked && typeof marked.parse === "function") {
		return marked.parse(processed);
	}

	return processed.replace(/\n/g, "<br>");
}
