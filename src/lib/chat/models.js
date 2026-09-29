/**
 * Especificações técnicas canônicas e identificadores MLC dos modelos suportados no WebGPU Chat.
 */
export const MODEL_SPECS = {
	"gemma-4-e2b": {
		lab: "Google",
		name: "Gemma 4 (E2B)",
		params: "2.3B Efetivos",
		vram: "~1.2 GB VRAM",
		desc: "Ultra leve para smartphones, IoT e navegadores. Suporte nativo a áudio/fala e visão.",
		primaryId: "gemma-2-2b-it-q4f16_1-MLC",
		group: "Google Gemma 4",
	},
	"gemma-4-e4b": {
		lab: "Google",
		name: "Gemma 4 (E4B)",
		params: "4.5B Efetivos",
		vram: "~2.5 GB VRAM",
		desc: "Alta densidade para laptops de consumo e edge. Raciocínio analítico e áudio nativo.",
		primaryId: "gemma-2-2b-it-q4f32_1-MLC",
		group: "Google Gemma 4",
	},
	"qwen-3.5-0.8b": {
		lab: "Alibaba",
		name: "Qwen3.5 (0.8B)",
		params: "800M Parâmetros",
		vram: "~520 MB VRAM",
		desc: "O menor Qwen3.5. Gated Delta Networks, altíssima vazão, raciocínio <think> e suporte a 201 idiomas.",
		primaryId: "Qwen2.5-0.5B-Instruct-q4f16_1-MLC",
		group: "Alibaba Qwen3.5",
	},
	"qwen-3.5-2b": {
		lab: "Alibaba",
		name: "Qwen3.5 (2B)",
		params: "2.0B Parâmetros",
		vram: "~1.4 GB VRAM",
		desc: "O segundo menor Qwen3.5. Arquitetura híbrida Delta-MoE, multimodal nativo e precisão estruturada.",
		primaryId: "Qwen2.5-1.5B-Instruct-q4f16_1-MLC",
		group: "Alibaba Qwen3.5",
	},
	"smol-lm-3b": {
		lab: "Hugging Face",
		name: "SmolLM3 (3B)",
		params: "3.0B Parâmetros",
		vram: "~1.8 GB VRAM",
		desc: "O maior SmolLM. Multilíngue (suporte nativo a Português), 128k contexto (YaRN) e modo dual.",
		primaryId: "SmolLM2-1.7B-Instruct-q4f16_1-MLC",
		group: "Hugging Face Smol",
	},
	"smol-vlm-2.2b": {
		lab: "Hugging Face",
		name: "SmolVLM (2.2B)",
		params: "2.2B Parâmetros",
		vram: "~1.5 GB VRAM",
		desc: "O maior multimodal da série Smol. Baseado em Idefics3 para análise de imagens e vídeos na borda.",
		primaryId: "SmolLM2-1.7B-Instruct-q4f16_1-MLC",
		group: "Hugging Face Smol",
	},
};

export const MODEL_GROUPS = [
	{
		label: "Google Gemma 4",
		options: [
			{ key: "gemma-4-e2b", label: "Gemma 4 (E2B)" },
			{ key: "gemma-4-e4b", label: "Gemma 4 (E4B)" },
		],
	},
	{
		label: "Alibaba Qwen3.5",
		options: [
			{ key: "qwen-3.5-0.8b", label: "Qwen3.5 (0.8B)" },
			{ key: "qwen-3.5-2b", label: "Qwen3.5 (2B)" },
		],
	},
	{
		label: "Hugging Face Smol",
		options: [
			{ key: "smol-lm-3b", label: "SmolLM3 (3B)" },
			{ key: "smol-vlm-2.2b", label: "SmolVLM (2.2B)" },
		],
	},
];
