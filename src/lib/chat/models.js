/**
 * Especificações técnicas canônicas e identificadores MLC dos modelos suportados no WebGPU Chat.
 * Focado exclusivamente em modelos modernos padrão ouro (2025/2026), desde o Qwen 3.5 (0.8B)
 * até o teto máximo de GPUs integradas (iGPU em desktops com 16GB+ de RAM).
 */
export const MODEL_SPECS = {
	// --- ALIBABA QWEN 3.5 (2025/2026) ---
	"qwen-3.5-0.8b": {
		lab: "Alibaba",
		name: "Qwen 3.5 (0.8B)",
		params: "800M Parâmetros",
		vram: "~1.0 GB VRAM",
		desc: "Arquitetura Gated Delta de alta vazão para dispositivos móveis e desktops leves.",
		primaryId: "Qwen3.5-0.8B-q4f32_1-MLC",
		fallbackId: "Qwen3.5-0.8B-q4f16_1-MLC",
		group: "⚡ Ultra-Leve & Rápido",
		badge: "⚡ Gated Delta",
	},
	"qwen-3.5-2b": {
		lab: "Alibaba",
		name: "Qwen 3.5 (2B)",
		params: "2.0B Parâmetros",
		vram: "~1.8 GB VRAM",
		desc: "Equilíbrio moderno perfeito de densidade, vazão de tokens e fidelidade técnica.",
		primaryId: "Qwen3.5-2B-q4f32_1-MLC",
		fallbackId: "Qwen3.5-2B-q4f16_1-MLC",
		group: "⚡ Desktop iGPU / Equilíbrio",
		badge: "⚡ Delta-MoE",
	},
	"qwen-3.5-4b": {
		lab: "Alibaba",
		name: "Qwen 3.5 (4B)",
		params: "4.0B Parâmetros",
		vram: "~2.8 GB VRAM",
		desc: "Densidade analítica e matemática de ponta que roda suave em qualquer desktop sem placa dedicada.",
		primaryId: "Qwen3.5-4B-q4f32_1-MLC",
		fallbackId: "Qwen3.5-4B-q4f16_1-MLC",
		group: "⚡ Desktop iGPU / Equilíbrio",
		badge: "💎 Top iGPU",
	},
	"qwen-3.5-9b": {
		lab: "Alibaba",
		name: "Qwen 3.5 (9B)",
		params: "9.0B Parâmetros",
		vram: "~5.2 GB VRAM",
		desc: "Modelo denso de 9 bilhões de parâmetros da geração Qwen 3.5 para máquinas com 16GB+ de RAM.",
		primaryId: "Qwen3.5-9B-q4f32_1-MLC",
		fallbackId: "Qwen3.5-9B-q4f16_1-MLC",
		group: "🚀 Alta Densidade / Teto de iGPU",
		badge: "🚀 9B Heavy",
	},

	// --- DEEPSEEK R1 (REASONING · 2025/2026) ---
	"deepseek-r1-1.5b": {
		lab: "DeepSeek",
		name: "DeepSeek R1 (1.5B)",
		params: "1.5B Parâmetros",
		vram: "~1.4 GB VRAM",
		desc: "Destilado de raciocínio lógico avançado com cadeia de pensamento visível no bloco <think>.",
		primaryId: "DeepSeek-R1-Distill-Qwen-1.5B-q4f32_1-MLC",
		fallbackId: "DeepSeek-R1-Distill-Qwen-1.5B-q4f16_1-MLC",
		group: "⚡ Ultra-Leve & Rápido",
		badge: "🧠 Reasoning",
	},
	"deepseek-r1-7b": {
		lab: "DeepSeek",
		name: "DeepSeek R1 (7B)",
		params: "7.0B Parâmetros",
		vram: "~4.6 GB VRAM",
		desc: "O padrão ouro de raciocínio analítico profundo open-source. Teto máximo em iGPU (requer 16GB RAM).",
		primaryId: "DeepSeek-R1-Distill-Qwen-7B-q4f32_1-MLC",
		fallbackId: "DeepSeek-R1-Distill-Qwen-7B-q4f16_1-MLC",
		group: "🚀 Alta Densidade / Teto de iGPU",
		badge: "🏆 Flagship 7B",
	},
	"deepseek-r1-8b-llama": {
		lab: "DeepSeek / Meta",
		name: "DeepSeek R1 (8B)",
		params: "8.0B Parâmetros",
		vram: "~4.8 GB VRAM",
		desc: "Destilado DeepSeek R1 treinado sobre a base Llama 8B. Raciocínio analítico denso.",
		primaryId: "DeepSeek-R1-Distill-Llama-8B-q4f32_1-MLC",
		fallbackId: "DeepSeek-R1-Distill-Llama-8B-q4f16_1-MLC",
		group: "🚀 Alta Densidade / Teto de iGPU",
		badge: "🧠 R1 8B",
	},

	// --- MISTRAL AI (MINISTRAL 3 · RELEASE 2512) ---
	"ministral-3-3b": {
		lab: "Mistral AI",
		name: "Ministral 3 (3B)",
		params: "3.0B Parâmetros",
		vram: "~2.4 GB VRAM",
		desc: "Lançamento da Mistral AI (2512 BF16) de altíssima eficiência para inferência no edge.",
		primaryId: "Ministral-3-3B-Instruct-2512-BF16-q4f32_1-MLC",
		fallbackId: "Ministral-3-3B-Instruct-2512-BF16-q4f16_1-MLC",
		group: "⚡ Desktop iGPU / Equilíbrio",
		badge: "🇫🇷 Mistral",
	},
	"ministral-3-reasoning": {
		lab: "Mistral AI",
		name: "Ministral 3 Reasoning (3B)",
		params: "3.0B Parâmetros",
		vram: "~2.4 GB VRAM",
		desc: "Variante especializada em raciocínio analítico e resolução passo a passo da Mistral AI.",
		primaryId: "Ministral-3-3B-Reasoning-2512-q4f32_1-MLC",
		fallbackId: "Ministral-3-3B-Reasoning-2512-q4f16_1-MLC",
		group: "⚡ Desktop iGPU / Equilíbrio",
		badge: "🧠 Reasoning",
	},

	// --- MICROSOFT PHI-4 (2025/2026) ---
	"phi-4-mini": {
		lab: "Microsoft",
		name: "Phi-4-mini (3.8B)",
		params: "3.8B Parâmetros",
		vram: "~2.4 GB VRAM",
		desc: "Mais recente da Microsoft focado em raciocínio analítico denso, matemática e síntese lógica.",
		primaryId: "Phi-4-mini-instruct-q4f32_1-MLC",
		fallbackId: "Phi-4-mini-instruct-q4f16_1-MLC",
		group: "⚡ Desktop iGPU / Equilíbrio",
		badge: "🔬 Raciocínio",
	},
};

export const MODEL_GROUPS = [
	{
		label: "⚡ Ultra-Leves & Rápido (< 1.5 GB VRAM)",
		options: [
			{ key: "qwen-3.5-0.8b", label: "Qwen 3.5 (0.8B) · ~1.0 GB VRAM ⚡" },
			{ key: "deepseek-r1-1.5b", label: "DeepSeek R1 (1.5B) · ~1.4 GB VRAM 🧠" },
		],
	},
	{
		label: "⚡ Desktop iGPU / Equilíbrio (1.8 GB a 2.8 GB VRAM)",
		options: [
			{ key: "qwen-3.5-2b", label: "Qwen 3.5 (2B) · ~1.8 GB VRAM ⚡" },
			{ key: "ministral-3-3b", label: "Ministral 3 (3B) · ~2.4 GB VRAM 🇫🇷" },
			{
				key: "ministral-3-reasoning",
				label: "Ministral 3 Reasoning (3B) · ~2.4 GB VRAM 🧠",
			},
			{ key: "phi-4-mini", label: "Phi-4-mini (3.8B) · ~2.4 GB VRAM 🔬" },
			{ key: "qwen-3.5-4b", label: "Qwen 3.5 (4B) · ~2.8 GB VRAM 💎" },
		],
	},
	{
		label: "🚀 Alta Densidade / Teto de iGPU (4.6 GB a 5.2 GB · Requer 16GB RAM)",
		options: [
			{ key: "deepseek-r1-7b", label: "DeepSeek R1 (7B) · ~4.6 GB VRAM 🧠" },
			{ key: "deepseek-r1-8b-llama", label: "DeepSeek R1 (8B) · ~4.8 GB VRAM 🧠" },
			{ key: "qwen-3.5-9b", label: "Qwen 3.5 (9B) · ~5.2 GB VRAM 🚀" },
		],
	},
];

/**
 * Presets de System Prompt simplificados e robustos.
 */
export const SYSTEM_PROMPT_PRESETS = [
	{
		id: "friendly",
		name: "Amigável & Direto",
		tag: "Padrão",
		desc: "Respostas educadas, claras e objetivas em português.",
		prompt: "Você é um assistente útil e amigável. Responda em português de forma clara, direta e objetiva.",
	},
	{
		id: "tech",
		name: "Engenharia & UNIX",
		tag: "Código",
		desc: "Foco em engenharia de sistemas, C/C++, Rust, POSIX e computação perto do metal.",
		prompt: "Você é um assistente técnico especialista em engenharia de software e programação. Responda em português com precisão técnica e código limpo.",
	},
	{
		id: "free",
		name: "Sem Prompt (Livre)",
		tag: "Zero Bloat",
		desc: "Sem instruções prévias. Ideal para modelos responderem direto.",
		prompt: "",
	},
	{
		id: "custom",
		name: "Personalizado",
		tag: "Custom",
		desc: "Defina suas próprias instruções de comportamento.",
		prompt: "",
	},
];
