<script>
	import { onMount } from "svelte";

	const phrases = [
		"Perto do Metal & Engenharia de Sistemas",
		"Fundamentos de UNIX: File Descriptors (FD) & IDs",
		"Alta Fidelidade em C23, C++23, Rust & Zig",
		"Otimização Combinatória & Network Flows",
		"Filosofia Anti-Inchaço: SvelteKit Estático + Go + SQLite WAL",
		"Garantias Matemáticas do Compilador Determinístico",
		"Método Socrático com IA: Questionamento Perpétuo (100% de Certeza)",
	];

	let typewriterText = $state("");
	let isBlinking = $state(true);

	onMount(() => {
		let phraseIdx = 0;
		let charIdx = 0;
		let isDeleting = false;
		let timer;

		const tick = () => {
			const current = phrases[phraseIdx];

			if (isDeleting) {
				charIdx--;
				typewriterText = current.substring(0, charIdx);
			} else {
				charIdx++;
				typewriterText = current.substring(0, charIdx);
			}

			let speed = isDeleting ? 25 : 55 + Math.random() * 30;

			if (!isDeleting && charIdx === current.length) {
				isBlinking = true;
				speed = 2400;
				isDeleting = true;
			} else if (isDeleting && charIdx === 0) {
				isBlinking = false;
				isDeleting = false;
				phraseIdx = (phraseIdx + 1) % phrases.length;
				speed = 400;
			} else {
				isBlinking = false;
			}

			timer = setTimeout(tick, speed);
		};

		timer = setTimeout(tick, 500);

		return () => clearTimeout(timer);
	});

	let selectedCategory = $state("all");

	const categories = [
		{ id: "all", label: "Todos os Projetos" },
		{ id: "systems", label: "Sistemas & Metal" },
		{ id: "graphics", label: "GPU & Áudio" },
		{ id: "research", label: "Ciência & Maratonas" },
		{ id: "web", label: "Web Anti-Bloat" },
	];

	const projects = [
		{
			id: "sock",
			cat: "systems",
			title: "Servidor HTTP Berkeley Sockets (C23)",
			desc: "Servidor web concorrente implementado do zero em C23 explorando primitivas puras de File Descriptors (kqueue/epoll), IPC e multi-processamento defensivo POSIX.1.",
			tags: ["C23", "POSIX.1", "Berkeley Sockets", "kqueue", "Multi-Process"],
			link: "https://game.gabrielfrigo.dev.br",
			repo: "https://github.com/GabrielFrigo4/unix-sock",
		},
		{
			id: "sbl",
			cat: "systems",
			title: "Standard BSD Library (SBL)",
			desc: "Implementação defensiva de bibliotecas de sistema BSD em C23 moderno com compilação hermética bmake, libc limpa e ausência total de comportamentos indefinidos.",
			tags: ["C23", "BSD 3-Clause", "bmake", "FreeBSD", "POSIX.1-2024"],
			repo: "https://github.com/GabrielFrigo4/SBL",
		},
		{
			id: "rng",
			cat: "graphics",
			title: "RNG Engine & Computação Gráfica",
			desc: "Motor gráfico autoral e laboratório de renderização moderna perto do metal com SDL3, pipelines SDL_GPU e computação visual via WebGPU e OpenGL.",
			tags: ["C/C++", "SDL3", "SDL_GPU", "WebGPU", "OpenGL", "Shaders"],
			repo: "https://github.com/GabrielFrigo4/rng-engine",
		},
		{
			id: "optilaser",
			cat: "web",
			title: "OptiLaser — Motor Logístico VRPTW",
			desc: "Plataforma comercial de roteirização ótima de veículos com janelas de tempo, controle de disparos a laser e painel de controle operacional em tempo real.",
			tags: ["Go", "Google OR-Tools", "PocketBase", "SvelteKit", "Podman"],
			badge: "🔒 Privado",
			repo: "https://github.com/GabrielFrigo4/venture",
		},
		{
			id: "flows",
			cat: "research",
			title: "Network Flows (UFABC / PIBIC)",
			desc: "Pesquisa acadêmica em Otimização Combinatória: algoritmos para Fluxo Máximo e Fluxo de Custo Mínimo, implementações de alta fidelidade em C++23 e benchmarks DIMACS.",
			tags: ["C++23", "Teoria dos Grafos", "DIMACS", "LaTeX", "PIBIC / UFABC"],
			repo: "https://github.com/GabrielFrigo4/networks-flow",
		},
		{
			id: "icpc",
			cat: "research",
			title: "Finalista Nacional ICPC 2026 & GRUB",
			desc: "Treinamento algorítmico intensivo para a Final Nacional da Maratona de Programação SBC / ICPC 2026 com a equipe GRUB da UFABC e CLI autoral de maratonas cpt.",
			tags: ["C++23", "ICPC 2026", "Codeforces", "Algoritmos", "UFABC GRUB"],
			repo: "https://github.com/GabrielFrigo4/training",
		},
	];

	const hubs = [
		{
			name: "environment",
			title: "Universal Environment",
			desc: "Orquestrador de estações de trabalho e dotfiles soberanos (Setup, Shell, Vault, Profile e a Suíte de Editores: Helix, Vim, Neovim, Emacs, Code).",
			badge: "Hub Orquestrador",
			url: "https://github.com/GabrielFrigo4/environment",
			color: "#58a6ff",
		},
		{
			name: "foundation",
			title: "Foundation Hub",
			desc: "Utilitários de sistema C99/POSIX.1, elevação de privilégios segura (rtdo/rtgo) e preservação digital técnica de obras fundacionais.",
			badge: "Pilar Fundacional",
			url: "https://github.com/GabrielFrigo4/foundation",
			color: "#ffa657",
		},
		{
			name: "research",
			title: "Research Hub",
			desc: "Pesquisa acadêmica PIBIC/UFABC em Otimização Combinatória, Grafos, Network Flows e monografia em LaTeX.",
			badge: "Ciência & Teoria",
			url: "https://github.com/GabrielFrigo4/research",
			color: "#7ee787",
		},
		{
			name: "training",
			title: "Training Hub",
			desc: "Quartel-general de maratonas de programação competitiva (ICPC 2026), templates C++23 e CLI cpt.",
			badge: "Alto Rendimento",
			url: "https://github.com/GabrielFrigo4/training",
			color: "#d2a8ff",
		},
		{
			name: "personal",
			title: "Personal Hub",
			desc: "Engines gráficas (SDL3/WebGPU), Standard BSD Library (C23), protocolos e servidores de sockets.",
			badge: "Laboratório Autoral",
			url: "https://github.com/GabrielFrigo4/personal",
			color: "#ff7b72",
		},
		{
			name: "venture",
			title: "Venture Hub",
			desc: "Produtos digitais aplicados ao mercado, otimização logística com Google OR-Tools, Go e PocketBase.",
			badge: "Soluções Comerciais",
			url: "https://github.com/GabrielFrigo4/venture",
			color: "#39c5bb",
		},
	];

	const stackCategories = [
		{
			title: "Sistemas Operacionais & Kernel",
			items: [
				{
					name: "FreeBSD",
					desc: "Jails, ZFS datasets nativos, pf firewall, áudio nativo OSS via /dev/dsp",
				},
				{
					name: "Linux",
					desc: "Motor universal de nuvem, observabilidade eBPF, KVM/QEMU e containers",
				},
				{
					name: "OpenBSD",
					desc: "Soberania de segurança, pf com modulação de estado, pledge & unveil",
				},
				{
					name: "illumos",
					desc: "Linhagem clássica Solaris/SunOS, Solaris Zones nativas, Crossbow e DTrace",
				},
				{
					name: "Windows / MSYS2",
					desc: "Ambiente defensivo de compatibilidade POSIX, winget e Clang",
				},
			],
		},
		{
			title: "Conteinerização & Sandboxing Soberano",
			items: [
				{
					name: "Podman (Nativo Linux & FreeBSD)",
					desc: "Daemonless e rootless no Linux, e execução nativa OCI no FreeBSD com runj (Docker Hub em Jails)",
				},
				{
					name: "FreeBSD Jails & Bastille",
					desc: "Isolamento clássico e leve de sistema operacional integrado ao ZFS e orquestração BastilleBSD",
				},
				{
					name: "Incus & LXC",
					desc: "Contêineres de sistema completos (System Containers) de alta densidade no Linux sem peso de VMs",
				},
				{
					name: "Solaris Zones (illumos)",
					desc: "Particionamento nativo de sistema e zonas lx-brand com contenção estrita de recursos",
				},
				{
					name: "Docker & OCI",
					desc: "Padrão aberto de empacotamento, distribuição e imagens reproduzíveis",
				},
				{
					name: "Sylve & bhyve",
					desc: "Orquestrador Sylve e hipervisor bhyve sobre datasets OpenZFS no FreeBSD",
				},
			],
		},
		{
			title: "Linguagens Perto do Metal & Compiladores",
			items: [
				{
					name: "C23 (ISO/IEC 9899:2024)",
					desc: "Padrão moderno, nullptr, [[nodiscard]], aritmética segura <stdckdint.h>",
				},
				{
					name: "C++23 / C++20",
					desc: "Concepts, ranges, tratamento monádico std::expected, std::print, RAII",
				},
				{
					name: "Rust",
					desc: "Borrow checker estrito, type-safety determinística, zero-cost abstractions",
				},
				{
					name: "Zig",
					desc: "Controle cirúrgico de alocadores manuais, comp-time e sem custos ocultos",
				},
				{
					name: "Go",
					desc: "Concorrência com goroutines/channels, compilação estática em binário único",
				},
				{
					name: "Assembly",
					desc: "Instruções x86_64 e AArch64, registradores, chamadas de sistema e ABI",
				},
			],
		},
		{
			title: "Bancos de Dados & Armazenamento",
			items: [
				{
					name: "SQLite (WAL Mode)",
					desc: "Monólito pragmático e sem preconceito: ultra-rápido, zero latência de rede",
				},
				{
					name: "PostgreSQL",
					desc: "Robustez relacional ACID estrita, índices complexos e concorrência MVCC",
				},
				{
					name: "MySQL & MariaDB",
					desc: "Padrão relacional canônico para alta vazão transacional",
				},
				{
					name: "PocketBase",
					desc: "Backend embarcado em Go com SQLite nativo e sincronização em tempo real",
				},
				{
					name: "OpenZFS",
					desc: "Snapshots atômicos, datasets criptografados e proteção contra corrupção silenciosa",
				},
			],
		},
		{
			title: "Computação Gráfica, GPU & Áudio",
			items: [
				{
					name: "SDL3 & SDL_GPU",
					desc: "Fundação canônica de baixo nível e API moderna de GPU com shaders multiplataforma nativos",
				},
				{
					name: "NVIDIA CUDA",
					desc: "Computação massiva paralela em GPU (GPGPU), warp execution e memória compartilhada de alta vazão",
				},
				{
					name: "WebGPU",
					desc: "Pipeline gráfico moderno e compute shaders de baixo overhead para web e aplicações nativas",
				},
				{
					name: "OpenGL (Legado Histórico)",
					desc: "Fundação clássica e formativa da computação gráfica 3D e shaders programáveis (GLSL)",
				},
				{
					name: "OSS vs ALSA",
					desc: "Filosofia UNIX pura em áudio (/dev/dsp sem camadas convolutas no OSS) vs ecossistema ALSA no Linux",
				},
			],
		},
		{
			title: "Frontend Compilado & Ecossistema Web",
			items: [
				{
					name: "Svelte 5",
					desc: "Reatividade baseada em runes ($state, $derived), sem overhead de virtual DOM",
				},
				{
					name: "SvelteKit Estático",
					desc: "Compilação Ahead-of-Time para HTML/CSS/JS puros e distribuição soberana",
				},
				{
					name: "Vite",
					desc: "Pipeline de build ultra-rápido e hermético para desenvolvimento e produção",
				},
				{
					name: "Caddy Web Server",
					desc: "Servidor web em Go de alta performance com HTTP/2, HTTP/3 (QUIC) e zstd nativos",
				},
			],
		},
		{
			title: "Editores Soberanos & Shells",
			items: [
				{
					name: "Suíte de Editores",
					desc: "Helix, Neovim, Vim, GNU Emacs 30+ (Elpaca/Tree-sitter) e VS Code",
				},
				{
					name: "Shells UNIX",
					desc: "zsh, bash, ksh e baseline rigoroso FreeBSD /bin/sh (POSIX.1)",
				},
				{
					name: "Shells Alternativos",
					desc: "PowerShell (pwsh), NuShell e cmd/clink no ambiente Windows",
				},
			],
		},
		{
			title: "IA Assistiva, Método Socrático & Governança",
			items: [
				{
					name: "Antigravity Suite",
					desc: "Antigravity CLI (agy), Antigravity IDE, Antigravity 2.0 e Python SDK",
				},
				{
					name: "Método Socrático com IA",
					desc: "Questionar tudo perpetuamente: nunca aceitar como verdade sem 100% de prova",
				},
				{
					name: "Portable AI Skills",
					desc: "Runbooks cognitivos portáteis em .agents/skills/ e Profile/skills/",
				},
				{
					name: "AGENTS.md & PRINCIPLES.md",
					desc: "Governança viva, regras de ouro e 22 princípios de engenharia canônicos",
				},
			],
		},
	];

	const filteredProjects = $derived(
		selectedCategory === "all"
			? projects
			: projects.filter((p) => p.cat === selectedCategory),
	);
</script>

<svelte:head>
	<title>Gabriel Frigo | Engenharia de Sistemas & Low-Level</title>
</svelte:head>

<!-- Navigation -->
<nav class="nav">
	<div class="nav-container">
		<a href="/" class="nav-brand">
			<span class="brand-symbol">λ</span>
			<span class="brand-text">gabriel<strong>frigo</strong></span>
		</a>

		<div class="nav-links">
			<a href="#filosofia" class="nav-link">Filosofia</a>
			<a href="#hubs" class="nav-link">Sexteto Federado</a>
			<a href="#stack" class="nav-link">Stack</a>
			<a href="#projetos" class="nav-link">Projetos</a>
			<a
				href="https://github.com/GabrielFrigo4"
				target="_blank"
				rel="noopener noreferrer"
				class="nav-link-btn"
			>
				GitHub ↗
			</a>
		</div>
	</div>
</nav>

<!-- Hero Section -->
<header class="hero">
	<div class="hero-container">
		<div class="hero-badge">
			<span class="badge-dot"></span>
			<span>UFABC · Ciência da Computação · Finalista Nacional ICPC 2026</span>
		</div>

		<h1 class="hero-title">
			Engenharia de Sistemas,<br />
			<span class="gradient-text">Perto do Metal</span> & Teoria
		</h1>

		<p class="hero-lead">
			Pesquisador de Otimização Combinatória, maratonista de programação algorítmica e
			desenvolvedor de software de sistemas. Foco intransigente em fundamentos de UNIX,
			compiladores determinísticos, soberania de infraestrutura e arquitetura
			anti-inchaço.
		</p>

		<!-- Terminal Card with Typewriter -->
		<div class="terminal-card">
			<div class="terminal-header">
				<div class="terminal-dots">
					<span class="dot red"></span>
					<span class="dot yellow"></span>
					<span class="dot green"></span>
				</div>
				<span class="terminal-title">gabrielf@sanctuary:~ (posix-sh)</span>
				<div class="terminal-spacer"></div>
			</div>
			<div class="terminal-body">
				<span class="terminal-prompt">$</span>
				<span class="terminal-command">cat /dev/dsp &gt; /dev/dsp # echo ethos</span>
				<div class="terminal-output">
					<span class="typewriter-text">{typewriterText}</span>
					<span class="cursor" class:blinking={isBlinking}>_</span>
				</div>
			</div>
		</div>

		<!-- Action CTA Buttons -->
		<div class="hero-actions">
			<a href="#projetos" class="btn btn-primary">Explorar Projetos</a>
			<a href="#hubs" class="btn btn-secondary">O Sexteto Federado</a>
			<a
				href="https://github.com/GabrielFrigo4/resumes"
				target="_blank"
				rel="noopener noreferrer"
				class="btn btn-outline"
			>
				Currículo (LaTeX) ↗
			</a>
		</div>
	</div>
</header>

<!-- Section 1: A Tríade Canônica & Método Socrático -->
<section id="filosofia" class="section">
	<div class="section-container">
		<div class="section-header">
			<span class="section-label">Fundamentos Inegociáveis</span>
			<h2 class="section-title">A Tríade Canônica & Filosofia de Engenharia</h2>
			<p class="section-desc">
				Práticas moldadas por décadas de evolução da computação: desde a elegância
				minimalista do UNIX até as garantias matemáticas formais dos compiladores
				modernos.
			</p>
		</div>

		<div class="cards-grid triad-grid">
			<!-- Card 1 -->
			<div class="feature-card">
				<div class="card-icon" style="color: var(--accent-blue);">📂</div>
				<h3 class="card-title">1. Fundamentos de UNIX: File Descriptors & IDs</h3>
				<p class="card-text">
					No cerne dos sistemas UNIX verdadeiros, toda abstração de I/O colapsa em
					duas entidades elementares: <strong>File Descriptors (FD)</strong> e
					<strong>Identifiers (ID)</strong>.
				</p>
				<ul class="card-list">
					<li>
						<strong>OSS vs ALSA:</strong> No Open Sound System, áudio é manipulado
						via <code>/dev/dsp</code>
						com simplicidade límpida (<code>cat /dev/dsp &gt; /dev/dsp</code>), sem
						as camadas bizantinas e convolutas do ALSA.
					</li>
					<li>
						<strong>Separação de Privilégios:</strong> Defesa em profundidade usando
						<code>pledge</code>
						e
						<code>unveil</code> (OpenBSD) e Capsicum (FreeBSD) para restringir processos
						estritamente aos FDs necessários.
					</li>
					<li>
						<strong>Drivers & CUSE:</strong> Dispositivos em Userspace e sandboxing hermético
						para isolamento de falhas.
					</li>
				</ul>
			</div>

			<!-- Card 2 -->
			<div class="feature-card">
				<div class="card-icon" style="color: var(--accent-coral);">⚙️</div>
				<h3 class="card-title">2. Perto do Metal: O Mínimo Denominador Comum</h3>
				<p class="card-text">
					Eliminação de camadas desnecessárias de abstração. O código deve compreender
					o hardware subjacente: registradores, hierarquia de cache e escalonador do
					kernel.
				</p>
				<ul class="card-list">
					<li>
						<strong>Fundação Canônica & GPU:</strong> <code>POSIX.1</code> para
						primitivas de sistema operacional, <code>SDL3</code> (SDL_GPU,
						SDL_Audio, WebGPU, QRhi) e <code>NVIDIA CUDA</code> para computação paralela
						massiva perto do metal.
					</li>
					<li>
						<strong>Standard BSD Library (SBL):</strong> Implementação autoral de bibliotecas
						de sistema BSD em C23 moderno, com compilação hermética via bmake e zero dependências
						ocultas.
					</li>
					<li>
						<strong>Herança Gráfica:</strong> Preservação do <code>OpenGL</code> clássico
						como marco formativo da computação gráfica 3D, distinguindo-o das APIs modernas
						baseadas em pipelines explícitos de GPU.
					</li>
					<li>
						<strong>Alta Fidelidade:</strong> Código escrito para explorar o paralelismo
						e a vazão máxima do processador sem intermediários opacos.
					</li>
				</ul>
			</div>

			<!-- Card 3 -->
			<div class="feature-card">
				<div class="card-icon" style="color: var(--accent-green);">⚡</div>
				<h3 class="card-title">3. Compilador Determinístico & Anti-Inchaço</h3>
				<p class="card-text">
					A preferência inabalável por garantias matemáticas estáticas comprovadas em
					tempo de compilação (Ahead-of-Time) sobre sobrecargas dinâmicas em tempo de
					execução.
				</p>
				<ul class="card-list">
					<li>
						<strong>Garantias Formais:</strong> Rust, Zig, C23, C++23 e Go entregam provas
						de integridade, segurança de tipos e otimizações vetoriais superiores a qualquer
						suposição dinâmica.
					</li>
					<li>
						<strong>SvelteKit Estático:</strong> Zero virtual DOM, zero inchaço de runtime.
						O compilador transforma componentes em HTML, CSS e JavaScript estáticos puros,
						ultra-leves e instantâneos.
					</li>
					<li>
						<strong>SQLite WAL & Monólitos:</strong> Sem preconceito contra o SQLite.
						Ele entrega milhões de operações por segundo em WAL mode em um monólito coeso,
						eliminando latências desperdiçadas de rede.
					</li>
				</ul>
			</div>

			<!-- Card 4 -->
			<div class="feature-card full-width-card">
				<div class="card-icon" style="color: var(--accent-purple);">🧠</div>
				<h3 class="card-title">O Método Socrático com Inteligência Artificial</h3>
				<p class="card-text">
					Inteligências Artificiais generativas são instrumentos de alavancagem
					cognitiva, tutoras e parceiras de pair-programming — <strong
						>jamais árbitros da verdade</strong
					>. A única postura intelectualmente honesta do engenheiro diante de uma IA é
					o
					<strong>questionamento socrático perpétuo</strong>: perguntar o porquê de
					cada linha gerada, desafiar premissas, exigir provas formais e nunca aceitar
					qualquer resposta sem 100% de verificação empírica e compilação rigorosa (<em
						>99% de certeza não basta</em
					>). Utilizo a suíte <strong>Antigravity</strong> (CLI <code>agy</code>, IDE,
					Antigravity 2.0 e Python SDK) governada por
					<strong>Portable AI Skills</strong>
					e arquivos <code>AGENTS.md</code> canônicos para manter a máquina estritamente
					a serviço da precisão.
				</p>
			</div>
		</div>
	</div>
</section>

<!-- Section 2: O Sexteto Federado -->
<section id="hubs" class="section bg-alt">
	<div class="section-container">
		<div class="section-header">
			<span class="section-label">Arquitetura de Repositórios</span>
			<h2 class="section-title">O Sexteto de Engenharia Federado</h2>
			<p class="section-desc">
				O ecossistema de código é particionado em 6 grandes repositórios canônicos
				independentes, cada um cobrindo um domínio de responsabilidade estrita com
				governança e CI/CD soberanos.
			</p>
		</div>

		<div class="cards-grid hubs-grid">
			{#each hubs as hub}
				<a
					href={hub.url}
					target="_blank"
					rel="noopener noreferrer"
					class="hub-card"
					style="--hub-color: {hub.color};"
				>
					<div class="hub-header">
						<span class="hub-name">{hub.name}/</span>
						<span class="hub-badge">{hub.badge}</span>
					</div>
					<h3 class="hub-title">{hub.title}</h3>
					<p class="hub-desc">{hub.desc}</p>
					<div class="hub-footer">
						<span class="hub-link-text">Ver no GitHub ↗</span>
					</div>
				</a>
			{/each}
		</div>
	</div>
</section>

<!-- Section 3: Stack Tecnológico & Domínios -->
<section id="stack" class="section">
	<div class="section-container">
		<div class="section-header">
			<span class="section-label">Arsenal Técnico</span>
			<h2 class="section-title">Stack Tecnológico & Domínios</h2>
			<p class="section-desc">
				Tecnologias adotadas por mérito técnico, interoperabilidade POSIX, ausência de
				inchaço e compromisso com padrões abertos.
			</p>
		</div>

		<div class="stack-grid">
			{#each stackCategories as cat}
				<div class="stack-card">
					<h3 class="stack-cat-title">{cat.title}</h3>
					<div class="stack-items">
						{#each cat.items as item}
							<div class="stack-item">
								<span class="stack-item-name">{item.name}</span>
								<span class="stack-item-desc">{item.desc}</span>
							</div>
						{/each}
					</div>
				</div>
			{/each}
		</div>
	</div>
</section>

<!-- Section 4: Projetos em Destaque -->
<section id="projetos" class="section bg-alt">
	<div class="section-container">
		<div class="section-header">
			<span class="section-label">Laboratório & Entregas</span>
			<h2 class="section-title">Projetos em Destaque</h2>
			<p class="section-desc">
				Projetos autorais, pesquisa acadêmica e utilitários de alta performance.
			</p>
		</div>

		<!-- Category Filter -->
		<div class="filter-bar">
			{#each categories as c}
				<button
					class="filter-btn"
					class:active={selectedCategory === c.id}
					onclick={() => (selectedCategory = c.id)}
				>
					{c.label}
				</button>
			{/each}
		</div>

		<!-- Projects Grid -->
		<div class="cards-grid projects-grid">
			{#each filteredProjects as p (p.id)}
				<div class="project-card">
					<div class="project-header">
						<h3 class="project-title">{p.title}</h3>
						{#if p.badge}
							<span class="project-status-badge">{p.badge}</span>
						{/if}
					</div>

					<p class="project-desc">{p.desc}</p>

					<div class="project-tags">
						{#each p.tags as tag}
							<span class="tag">{tag}</span>
						{/each}
					</div>

					<div class="project-links">
						{#if p.link}
							<a
								href={p.link}
								target="_blank"
								rel="noopener noreferrer"
								class="btn-sm btn-primary-sm"
							>
								Demo / Live ↗
							</a>
						{/if}
						<a
							href={p.repo}
							target="_blank"
							rel="noopener noreferrer"
							class="btn-sm btn-secondary-sm"
						>
							Repositório ↗
						</a>
					</div>
				</div>
			{/each}
		</div>
	</div>
</section>

<!-- Footer -->
<footer class="footer">
	<div class="footer-container">
		<div class="footer-manifesto">
			<p class="manifesto-title">⚡ Manifesto de Leveza & Soberania Digital</p>
			<p class="manifesto-text">
				Construído estaticamente com <strong>SvelteKit</strong> (<code
					>@sveltejs/adapter-static</code
				>) e <strong>Vite</strong>. Zero virtual DOM em runtime, zero rastreadores
				corporativos, 100% renderizado para HTML/CSS/JS puro e distribuído de forma
				soberana.
			</p>
		</div>

		<div class="footer-bottom">
			<span class="footer-copy">© 2026 Gabriel Frigo. Código sob licença MIT.</span>
			<div class="footer-socials">
				<a
					href="https://github.com/GabrielFrigo4"
					target="_blank"
					rel="noopener noreferrer">GitHub</a
				>
				<span class="sep">·</span>
				<a
					href="https://linkedin.com/in/gabrielfrigo4"
					target="_blank"
					rel="noopener noreferrer">LinkedIn</a
				>
				<span class="sep">·</span>
				<a href="mailto:contato@gabrielfrigo.dev.br">Email</a>
			</div>
		</div>
	</div>
</footer>

<style>
	/* Navigation */
	.nav {
		position: sticky;
		top: 0;
		z-index: 100;
		background: rgba(9, 13, 19, 0.85);
		backdrop-filter: blur(12px);
		-webkit-backdrop-filter: blur(12px);
		border-bottom: 1px solid var(--border-muted);
	}

	.nav-container {
		max-width: 1200px;
		margin: 0 auto;
		padding: 1rem 1.5rem;
		display: flex;
		align-items: center;
		justify-content: space-between;
	}

	.nav-brand {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		font-family: var(--font-mono);
		font-size: 1.15rem;
		color: var(--text-main);
	}

	.brand-symbol {
		color: var(--accent-coral);
		font-weight: 700;
		font-size: 1.3rem;
	}

	.brand-text strong {
		color: var(--accent-blue);
	}

	.nav-links {
		display: flex;
		align-items: center;
		gap: 1.5rem;
	}

	.nav-link {
		font-size: 0.9rem;
		color: var(--text-muted);
		transition: color 0.2s ease;
	}

	.nav-link:hover {
		color: var(--text-main);
	}

	.nav-link-btn {
		font-family: var(--font-mono);
		font-size: 0.85rem;
		padding: 0.4rem 0.85rem;
		border-radius: 6px;
		background: var(--bg-card);
		border: 1px solid var(--border-default);
		color: var(--text-main);
		transition: all 0.2s ease;
	}

	.nav-link-btn:hover {
		border-color: var(--accent-blue);
		color: var(--accent-blue);
	}

	/* Hero */
	.hero {
		padding: 5rem 1.5rem 4rem;
		background: radial-gradient(
			circle at 50% 0%,
			rgba(88, 166, 255, 0.08) 0%,
			transparent 65%
		);
	}

	.hero-container {
		max-width: 960px;
		margin: 0 auto;
		display: flex;
		flex-direction: column;
		align-items: center;
		text-align: center;
	}

	.hero-badge {
		display: inline-flex;
		align-items: center;
		gap: 0.5rem;
		padding: 0.35rem 0.85rem;
		background: rgba(126, 231, 135, 0.1);
		border: 1px solid rgba(126, 231, 135, 0.3);
		border-radius: 999px;
		font-family: var(--font-mono);
		font-size: 0.8rem;
		color: var(--accent-green);
		margin-bottom: 1.5rem;
	}

	.badge-dot {
		width: 8px;
		height: 8px;
		border-radius: 50%;
		background: var(--accent-green);
		box-shadow: 0 0 8px var(--accent-green);
	}

	.hero-title {
		font-size: 3rem;
		font-weight: 800;
		line-height: 1.15;
		margin-bottom: 1.25rem;
		letter-spacing: -0.03em;
	}

	.gradient-text {
		background: linear-gradient(135deg, #58a6ff 0%, #39c5bb 50%, #7ee787 100%);
		-webkit-background-clip: text;
		-webkit-text-fill-color: transparent;
	}

	.hero-lead {
		max-width: 760px;
		font-size: 1.15rem;
		color: var(--text-muted);
		line-height: 1.7;
		margin-bottom: 2.25rem;
	}

	/* Terminal Card */
	.terminal-card {
		width: 100%;
		max-width: 780px;
		background: var(--bg-surface);
		border: 1px solid var(--border-default);
		border-radius: 8px;
		overflow: hidden;
		box-shadow: 0 16px 36px rgba(0, 0, 0, 0.4);
		margin-bottom: 2.5rem;
		text-align: left;
	}

	.terminal-header {
		background: #06090e;
		padding: 0.65rem 1rem;
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
		width: 11px;
		height: 11px;
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
		padding: 1.25rem 1.5rem;
		font-family: var(--font-mono);
		font-size: 0.95rem;
		background: #090d13;
	}

	.terminal-prompt {
		color: var(--accent-coral);
		font-weight: 700;
		margin-right: 0.5rem;
	}

	.terminal-command {
		color: var(--accent-green);
	}

	.terminal-output {
		margin-top: 0.75rem;
		color: var(--accent-blue);
		min-height: 1.6rem;
		display: flex;
		align-items: center;
	}

	.cursor {
		display: inline-block;
		margin-left: 2px;
		font-weight: 700;
		color: var(--accent-coral);
	}

	.cursor.blinking {
		animation: blink 1s step-start infinite;
	}

	@keyframes blink {
		50% {
			opacity: 0;
		}
	}

	/* Hero Actions */
	.hero-actions {
		display: flex;
		flex-wrap: wrap;
		gap: 1rem;
		justify-content: center;
	}

	.btn {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		font-family: var(--font-mono);
		font-size: 0.9rem;
		font-weight: 600;
		padding: 0.75rem 1.5rem;
		border-radius: 6px;
		transition: all 0.2s ease;
		cursor: pointer;
	}

	.btn-primary {
		background: var(--accent-blue);
		color: #090d13;
		border: 1px solid var(--accent-blue);
	}

	.btn-primary:hover {
		background: #79b8ff;
		box-shadow: 0 0 16px rgba(88, 166, 255, 0.4);
	}

	.btn-secondary {
		background: var(--bg-card);
		color: var(--text-main);
		border: 1px solid var(--border-default);
	}

	.btn-secondary:hover {
		border-color: var(--accent-blue);
		color: var(--accent-blue);
	}

	.btn-outline {
		background: transparent;
		color: var(--text-muted);
		border: 1px solid var(--border-muted);
	}

	.btn-outline:hover {
		border-color: var(--text-main);
		color: var(--text-main);
	}

	/* Sections */
	.section {
		padding: 5rem 1.5rem;
	}

	.bg-alt {
		background: var(--bg-surface);
		border-top: 1px solid var(--border-muted);
		border-bottom: 1px solid var(--border-muted);
	}

	.section-container {
		max-width: 1200px;
		margin: 0 auto;
	}

	.section-header {
		text-align: center;
		max-width: 760px;
		margin: 0 auto 3.5rem;
	}

	.section-label {
		font-family: var(--font-mono);
		font-size: 0.8rem;
		text-transform: uppercase;
		letter-spacing: 0.1em;
		color: var(--accent-coral);
		margin-bottom: 0.5rem;
		display: block;
	}

	.section-title {
		font-size: 2.2rem;
		font-weight: 700;
		margin-bottom: 0.75rem;
		letter-spacing: -0.02em;
	}

	.section-desc {
		font-size: 1.05rem;
		color: var(--text-muted);
		line-height: 1.6;
	}

	/* Grid & Cards */
	.cards-grid {
		display: grid;
		gap: 1.5rem;
	}

	.triad-grid {
		grid-template-columns: repeat(3, 1fr);
	}

	.feature-card {
		background: var(--bg-card);
		border: 1px solid var(--border-muted);
		border-radius: 8px;
		padding: 2rem;
		transition: all 0.25s ease;
		display: flex;
		flex-direction: column;
	}

	.feature-card:hover {
		border-color: var(--border-hover);
		transform: translateY(-2px);
		box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3);
	}

	.full-width-card {
		grid-column: 1 / -1;
		background: linear-gradient(
			180deg,
			rgba(22, 27, 34, 0.8) 0%,
			rgba(13, 17, 23, 0.95) 100%
		);
		border: 1px solid rgba(210, 168, 255, 0.3);
	}

	.card-icon {
		font-size: 2rem;
		margin-bottom: 1rem;
	}

	.card-title {
		font-size: 1.25rem;
		font-weight: 700;
		margin-bottom: 0.85rem;
		color: var(--text-main);
	}

	.card-text {
		font-size: 0.95rem;
		color: var(--text-muted);
		line-height: 1.6;
		margin-bottom: 1rem;
	}

	.card-list {
		list-style: none;
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
		font-size: 0.9rem;
		color: var(--text-muted);
	}

	.card-list li code {
		font-family: var(--font-mono);
		background: rgba(88, 166, 255, 0.1);
		color: var(--accent-blue);
		padding: 0.15rem 0.35rem;
		border-radius: 4px;
		font-size: 0.82rem;
	}

	/* Hubs Grid */
	.hubs-grid {
		grid-template-columns: repeat(3, 1fr);
	}

	.hub-card {
		background: var(--bg-card);
		border: 1px solid var(--border-muted);
		border-radius: 8px;
		padding: 1.75rem;
		transition: all 0.25s ease;
		display: flex;
		flex-direction: column;
		position: relative;
		overflow: hidden;
	}

	.hub-card::before {
		content: "";
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		height: 3px;
		background: var(--hub-color);
		opacity: 0.8;
	}

	.hub-card:hover {
		border-color: var(--hub-color);
		transform: translateY(-3px);
		box-shadow: 0 10px 28px rgba(0, 0, 0, 0.4);
	}

	.hub-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 0.75rem;
	}

	.hub-name {
		font-family: var(--font-mono);
		font-size: 0.85rem;
		color: var(--hub-color);
		font-weight: 600;
	}

	.hub-badge {
		font-size: 0.7rem;
		padding: 0.2rem 0.5rem;
		background: rgba(255, 255, 255, 0.05);
		border-radius: 4px;
		color: var(--text-dim);
	}

	.hub-title {
		font-size: 1.2rem;
		font-weight: 700;
		margin-bottom: 0.5rem;
		color: var(--text-main);
	}

	.hub-desc {
		font-size: 0.9rem;
		color: var(--text-muted);
		line-height: 1.5;
		flex-grow: 1;
		margin-bottom: 1.25rem;
	}

	.hub-footer {
		display: flex;
		justify-content: flex-end;
	}

	.hub-link-text {
		font-family: var(--font-mono);
		font-size: 0.82rem;
		color: var(--hub-color);
		font-weight: 500;
	}

	/* Stack Grid */
	.stack-grid {
		display: grid;
		grid-template-columns: repeat(2, 1fr);
		gap: 1.5rem;
	}

	.stack-card {
		background: var(--bg-card);
		border: 1px solid var(--border-muted);
		border-radius: 8px;
		padding: 1.75rem;
	}

	.stack-cat-title {
		font-size: 1.15rem;
		font-weight: 700;
		color: var(--accent-blue);
		margin-bottom: 1.25rem;
		border-bottom: 1px solid var(--border-muted);
		padding-bottom: 0.5rem;
	}

	.stack-items {
		display: flex;
		flex-direction: column;
		gap: 0.85rem;
	}

	.stack-item {
		display: flex;
		flex-direction: column;
		gap: 0.2rem;
	}

	.stack-item-name {
		font-family: var(--font-mono);
		font-size: 0.9rem;
		font-weight: 600;
		color: var(--text-main);
	}

	.stack-item-desc {
		font-size: 0.85rem;
		color: var(--text-muted);
		line-height: 1.4;
	}

	/* Projects Filter & Cards */
	.filter-bar {
		display: flex;
		justify-content: center;
		flex-wrap: wrap;
		gap: 0.5rem;
		margin-bottom: 2.5rem;
	}

	.filter-btn {
		font-family: var(--font-mono);
		font-size: 0.85rem;
		padding: 0.5rem 1rem;
		border-radius: 6px;
		background: var(--bg-card);
		border: 1px solid var(--border-muted);
		color: var(--text-muted);
		cursor: pointer;
		transition: all 0.2s ease;
	}

	.filter-btn:hover {
		border-color: var(--border-default);
		color: var(--text-main);
	}

	.filter-btn.active {
		background: var(--accent-blue);
		color: #090d13;
		border-color: var(--accent-blue);
		font-weight: 600;
	}

	.projects-grid {
		grid-template-columns: repeat(3, 1fr);
	}

	.project-card {
		background: var(--bg-card);
		border: 1px solid var(--border-muted);
		border-radius: 8px;
		padding: 1.75rem;
		display: flex;
		flex-direction: column;
		transition: all 0.25s ease;
	}

	.project-card:hover {
		border-color: var(--border-hover);
		transform: translateY(-2px);
		box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3);
	}

	.project-header {
		display: flex;
		justify-content: space-between;
		align-items: flex-start;
		margin-bottom: 0.75rem;
		gap: 0.5rem;
	}

	.project-title {
		font-size: 1.15rem;
		font-weight: 700;
		color: var(--text-main);
	}

	.project-status-badge {
		font-size: 0.7rem;
		font-family: var(--font-mono);
		padding: 0.2rem 0.4rem;
		border-radius: 4px;
		background: rgba(255, 123, 114, 0.15);
		color: var(--accent-coral);
		border: 1px solid rgba(255, 123, 114, 0.3);
		white-space: nowrap;
	}

	.project-desc {
		font-size: 0.88rem;
		color: var(--text-muted);
		line-height: 1.5;
		margin-bottom: 1.25rem;
		flex-grow: 1;
	}

	.project-tags {
		display: flex;
		flex-wrap: wrap;
		gap: 0.35rem;
		margin-bottom: 1.25rem;
	}

	.tag {
		font-family: var(--font-mono);
		font-size: 0.72rem;
		padding: 0.15rem 0.45rem;
		border-radius: 4px;
		background: var(--bg-surface);
		border: 1px solid var(--border-muted);
		color: var(--text-dim);
	}

	.project-links {
		display: flex;
		gap: 0.75rem;
		margin-top: auto;
	}

	.btn-sm {
		font-family: var(--font-mono);
		font-size: 0.8rem;
		font-weight: 500;
		padding: 0.4rem 0.8rem;
		border-radius: 5px;
		transition: all 0.2s ease;
		display: inline-flex;
		align-items: center;
	}

	.btn-primary-sm {
		background: var(--accent-blue);
		color: #090d13;
		border: 1px solid var(--accent-blue);
	}

	.btn-primary-sm:hover {
		background: #79b8ff;
	}

	.btn-secondary-sm {
		background: var(--bg-surface);
		color: var(--text-main);
		border: 1px solid var(--border-default);
	}

	.btn-secondary-sm:hover {
		border-color: var(--accent-blue);
		color: var(--accent-blue);
	}

	/* Footer */
	.footer {
		background: #06090e;
		border-top: 1px solid var(--border-muted);
		padding: 4rem 1.5rem 2.5rem;
	}

	.footer-container {
		max-width: 1200px;
		margin: 0 auto;
		display: flex;
		flex-direction: column;
		gap: 2.5rem;
	}

	.footer-manifesto {
		max-width: 800px;
		margin: 0 auto;
		text-align: center;
		padding: 1.5rem;
		background: rgba(22, 27, 34, 0.5);
		border: 1px solid var(--border-muted);
		border-radius: 8px;
	}

	.manifesto-title {
		font-family: var(--font-mono);
		font-size: 0.9rem;
		font-weight: 600;
		color: var(--accent-green);
		margin-bottom: 0.5rem;
	}

	.manifesto-text {
		font-size: 0.88rem;
		color: var(--text-muted);
		line-height: 1.6;
	}

	.manifesto-text strong {
		color: var(--text-main);
	}

	.manifesto-text code {
		font-family: var(--font-mono);
		color: var(--accent-blue);
		background: rgba(88, 166, 255, 0.1);
		padding: 0.1rem 0.3rem;
		border-radius: 3px;
	}

	.footer-bottom {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding-top: 1.5rem;
		border-top: 1px solid var(--border-muted);
		font-size: 0.85rem;
		color: var(--text-dim);
	}

	.footer-socials {
		display: flex;
		align-items: center;
		gap: 0.75rem;
	}

	.footer-socials a {
		color: var(--text-muted);
		transition: color 0.2s ease;
	}

	.footer-socials a:hover {
		color: var(--accent-blue);
	}

	.sep {
		color: var(--border-default);
	}

	/* Responsive Media Queries */
	@media (max-width: 1024px) {
		.triad-grid,
		.hubs-grid,
		.projects-grid {
			grid-template-columns: repeat(2, 1fr);
		}
	}

	@media (max-width: 768px) {
		.hero-title {
			font-size: 2.2rem;
		}

		.nav-links {
			display: none;
		}

		.triad-grid,
		.hubs-grid,
		.stack-grid,
		.projects-grid {
			grid-template-columns: 1fr;
		}

		.footer-bottom {
			flex-direction: column;
			gap: 1rem;
			text-align: center;
		}
	}
</style>
