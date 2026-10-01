/**
 * Especificações técnicas canônicas e identificadores MLC dos modelos suportados no WebGPU Chat.
 * Focado exclusivamente em modelos modernos padrão ouro (2025/2026), desde a família completa
 * SmolLM (135M a 1.7B) até o teto máximo de GPUs integradas (iGPU em desktops com 16GB+ de RAM).
 */
export const MODEL_SPECS = {
	// --- FAMÍLIA SMOLLM (HUGGING FACE) ---
	"smol-lm-135m": {
		lab: "Hugging Face",
		name: "SmolLM2 (135M Nano)",
		params: "135M Parâmetros",
		vram: "~360 MB VRAM",
		desc: "Nano modelo para inferência instantânea com zero estresse térmico ou de memória.",
		primaryId: "SmolLM2-135M-Instruct-q0f32-MLC",
		fallbackId: "SmolLM2-135M-Instruct-q0f16-MLC",
		group: "📱 Mobile & Ultra-Leve",
		badge: "⚡ Nano",
	},
	"smol-lm-360m": {
		lab: "Hugging Face",
		name: "SmolLM2 (360M Mobile)",
		params: "360M Parâmetros",
		vram: "~380 MB VRAM",
		desc: "O padrão ouro sub-500M para smartphones, tablets e notebooks leves.",
		primaryId: "SmolLM2-360M-Instruct-q4f32_1-MLC",
		fallbackId: "SmolLM2-360M-Instruct-q4f16_1-MLC",
		group: "📱 Mobile & Ultra-Leve",
		badge: "📱 Mobile",
	},
	"smol-lm-1.7b": {
		lab: "Hugging Face",
		name: "SmolLM2 (1.7B)",
		params: "1.7B Parâmetros",
		vram: "~1.2 GB VRAM",
		desc: "O irmão maior da família SmolLM2, unindo altíssima densidade semântica a baixo consumo.",
		primaryId: "SmolLM2-1.7B-Instruct-q4f32_1-MLC",
		fallbackId: "SmolLM2-1.7B-Instruct-q4f16_1-MLC",
		group: "⚡ Desktop iGPU / Equilíbrio",
		badge: "🧪 Smol-Top",
	},

	// --- GOOGLE GEMMA 3 ---
	"gemma-3-1b": {
		lab: "Google",
		name: "Gemma 3 (1B)",
		params: "1.0B Parâmetros",
		vram: "~900 MB VRAM",
		desc: "Nova geração Gemma 3 do Google com arquitetura refinada para dispositivos de borda.",
		primaryId: "gemma3-1b-it-q4f16_1-MLC",
		fallbackId: "gemma3-1b-it-q4f16_1-MLC",
		group: "📱 Mobile & Ultra-Leve",
		badge: "💎 Google",
	},

	// --- META LLAMA 3.2 ---
	"llama-3.2-1b": {
		lab: "Meta",
		name: "Llama 3.2 (1B)",
		params: "1.2B Parâmetros",
		vram: "~880 MB VRAM",
		desc: "Padrão ouro compacto da Meta. Compreensão impecável de português e latência ultra-baixa.",
		primaryId: "Llama-3.2-1B-Instruct-q4f32_1-MLC",
		fallbackId: "Llama-3.2-1B-Instruct-q4f16_1-MLC",
		group: "📱 Mobile & Ultra-Leve",
		badge: "⭐ Recomendado",
	},
	"llama-3.2-3b": {
		lab: "Meta",
		name: "Llama 3.2 (3B)",
		params: "3.2B Parâmetros",
		vram: "~2.2 GB VRAM",
		desc: "Carro-chefe da série Llama 3.2 para desktops com GPU integrada. Raciocínio equilibrado e robusto.",
		primaryId: "Llama-3.2-3B-Instruct-q4f32_1-MLC",
		fallbackId: "Llama-3.2-3B-Instruct-q4f16_1-MLC",
		group: "⚡ Desktop iGPU / Equilíbrio",
		badge: "🚀 Desktop Pro",
	},

	// --- ALIBABA QWEN 3.5 ---
	"qwen-3.5-0.8b": {
		lab: "Alibaba",
		name: "Qwen 3.5 (0.8B)",
		params: "800M Parâmetros",
		vram: "~1.0 GB VRAM",
		desc: "Arquitetura Gated Delta de alta vazão para dispositivos móveis e desktops leves.",
		primaryId: "Qwen3.5-0.8B-q4f32_1-MLC",
		fallbackId: "Qwen3.5-0.8B-q4f16_1-MLC",
		group: "📱 Mobile & Ultra-Leve",
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

	// --- DEEPSEEK R1 (REASONING) ---
	"deepseek-r1-1.5b": {
		lab: "DeepSeek",
		name: "DeepSeek R1 (1.5B)",
		params: "1.5B Parâmetros",
		vram: "~1.4 GB VRAM",
		desc: "Destilado de raciocínio lógico avançado com cadeia de pensamento visível no bloco <think>.",
		primaryId: "DeepSeek-R1-Distill-Qwen-1.5B-q4f32_1-MLC",
		fallbackId: "DeepSeek-R1-Distill-Qwen-1.5B-q4f16_1-MLC",
		group: "⚡ Desktop iGPU / Equilíbrio",
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
		name: "DeepSeek R1 (8B Llama)",
		params: "8.0B Parâmetros",
		vram: "~4.8 GB VRAM",
		desc: "Destilado DeepSeek R1 treinado sobre a base Llama 8B. Raciocínio matemático impecável.",
		primaryId: "DeepSeek-R1-Distill-Llama-8B-q4f32_1-MLC",
		fallbackId: "DeepSeek-R1-Distill-Llama-8B-q4f16_1-MLC",
		group: "🚀 Alta Densidade / Teto de iGPU",
		badge: "🧠 R1 Llama",
	},

	// --- MICROSOFT PHI-4 ---
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

	// --- MISTRAL AI (MINISTRAL 3) ---
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

	// --- NOUS RESEARCH HERMES 3 ---
	"hermes-3-3b": {
		lab: "Nous Research",
		name: "Hermes 3 (3B)",
		params: "3.2B Parâmetros",
		vram: "~2.2 GB VRAM",
		desc: "Ajustado pela Nous Research sobre o Llama 3.2 para raciocínio agentic e compreensão de instruções.",
		primaryId: "Hermes-3-Llama-3.2-3B-q4f32_1-MLC",
		fallbackId: "Hermes-3-Llama-3.2-3B-q4f16_1-MLC",
		group: "⚡ Desktop iGPU / Equilíbrio",
		badge: "🤖 Agentic",
	},
};

export const MODEL_GROUPS = [
	{
		label: "📱 Smartphones & Ultra-Leves (< 1 GB VRAM)",
		options: [
			{ key: "smol-lm-135m", label: "SmolLM2 (135M Nano) · ~360 MB VRAM ⚡" },
			{ key: "smol-lm-360m", label: "SmolLM2 (360M Mobile) · ~380 MB VRAM 📱" },
			{ key: "llama-3.2-1b", label: "Llama 3.2 (1B) · ~880 MB VRAM ⭐" },
			{ key: "gemma-3-1b", label: "Gemma 3 (1B) · ~900 MB VRAM 💎" },
			{ key: "qwen-3.5-0.8b", label: "Qwen 3.5 (0.8B) · ~1.0 GB VRAM ⚡" },
		],
	},
	{
		label: "⚡ Desktop iGPU / Equilíbrio (1.2 GB a 2.8 GB VRAM)",
		options: [
			{ key: "smol-lm-1.7b", label: "SmolLM2 (1.7B) · ~1.2 GB VRAM 🧪" },
			{ key: "deepseek-r1-1.5b", label: "DeepSeek R1 (1.5B) · ~1.4 GB VRAM 🧠" },
			{ key: "qwen-3.5-2b", label: "Qwen 3.5 (2B) · ~1.8 GB VRAM ⚡" },
			{ key: "llama-3.2-3b", label: "Llama 3.2 (3B) · ~2.2 GB VRAM 🚀" },
			{ key: "hermes-3-3b", label: "Hermes 3 (3B) · ~2.2 GB VRAM 🤖" },
			{ key: "phi-4-mini", label: "Phi-4-mini (3.8B) · ~2.4 GB VRAM 🔬" },
			{ key: "ministral-3-3b", label: "Ministral 3 (3B) · ~2.4 GB VRAM 🇫🇷" },
			{
				key: "ministral-3-reasoning",
				label: "Ministral 3 Reasoning (3B) · ~2.4 GB VRAM 🧠",
			},
			{ key: "qwen-3.5-4b", label: "Qwen 3.5 (4B) · ~2.8 GB VRAM 💎" },
		],
	},
	{
		label: "🚀 Alta Densidade / Teto de iGPU (4.6 GB a 5.2 GB · Requer 16GB RAM)",
		options: [
			{ key: "deepseek-r1-7b", label: "DeepSeek R1 (7B) · ~4.6 GB VRAM 🧠" },
			{ key: "deepseek-r1-8b-llama", label: "DeepSeek R1 (8B Llama) · ~4.8 GB VRAM 🧠" },
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
		desc: "Sem instruções prévias. Ideal para modelos pequenos responderem direto.",
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
