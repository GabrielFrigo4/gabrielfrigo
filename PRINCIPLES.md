# 📜 Princípios de Engenharia & Filosofia do Portfólio

> _"Rule of Simplicity: Design for simplicity; add complexity only where you must."_<br>
> — Eric S. Raymond, _The Art of UNIX Programming_ (2003)

O website e portfólio oficial de Gabriel Frigo ([gabrielfrigo.dev.br](https://gabrielfrigo.dev.br)) é governado por **19 Princípios de Engenharia** (17 Princípios UNIX clássicos + Regra da Soberania do Usuário + Regra da Autonomia Reentrante), adaptados para desenvolvimento web estático de alta fidelidade e mínima fricção.

---

## 🏛️ Os 19 Princípios Aplicados ao Portfólio

### 1. Regra da Modularidade (_Rule of Modularity_)

- Componentes e seções em Svelte são desacoplados e autocontidos.

### 2. Regra da Clareza (_Rule of Clarity_)

- Código HTML, CSS e JavaScript semântico, claro e legível, sem acrobacias crípticas de frameworks obscuros.

### 3. Regra da Composição (_Rule of Composition_)

- A saída do build é estática e pode ser composta com qualquer webserver POSIX (Nginx, Caddy, httpd, kqueue server).

### 4. Regra da Separação (_Rule of Separation_)

- Separação estrita entre conteúdo declarativo, estilização visual e lógica reativa mínima de interface.

### 5. Regra da Simplicidade (_Rule of Simplicity_)

- **Zero Runtime Bloat:** Rejeição veemente a virtual DOM em tempo de execução, rastreadores ou telemetria invasiva.

### 6. Regra da Parcimônia (_Rule of Parsimony_)

- Não adicione bibliotecas externas do npm para funcionalidades que o CSS moderno ou o Svelte 5 resolvem nativamente.

### 7. Regra da Transparência (_Rule of Transparency_)

- Estrutura de arquivos autoexplicativa (`src/routes/+page.svelte`, `static/assets/`, `build/`).

### 8. Regra da Robustez (_Rule of Robustness_)

- Fallbacks estáticos (`404.html`) e pre-rendering garantem que o site nunca caia por falhas de servidor dinâmico.

### 9. Regra da Representação (_Rule of Representation_)

- Os dados do portfólio (projetos, hubs, tecnologias) são estruturados em arrays declarativos limpos.

### 10. Regra do Menor Espanto (_Rule of Least Surprise_)

- Navegação fluida, comportamento previsível de links e carregamento instantâneo.

### 11. Regra do Silêncio (_Rule of Silence_)

- O `Makefile` opera sob silêncio POSIX (`.SILENT:`), emitindo apenas saídas diagnósticas relevantes.

### 12. Regra do Reparo (_Rule of Repair_)

- Falhas de compilação ou formatação são detectadas imediatamente em tempo de compilação ou no `pre-commit`.

### 13. Regra da Economia (_Rule of Economy_)

- O tempo do programador e os ciclos de CPU da máquina visitante são respeitados: o site carrega em milissegundos.

### 14. Regra da Geração (_Rule of Generation_)

- O compilador do SvelteKit gera os artefatos estáticos otimizados em vez de exigir boilerplate manual.

### 15. Regra da Otimização (_Rule of Optimization_)

- Otimização antecipada pelo compilador (AOT) supera qualquer reatividade pesada em runtime.

### 16. Regra da Diversidade (_Rule of Diversity_)

- O design é 100% responsivo, funcionando perfeitamente em telas móveis, desktops ultra-wide e navegadores baseados em texto.

### 17. Regra da Extensibilidade (_Rule of Extensibility_)

- Adicionar novos projetos, hubs ou ensaios teóricos requer apenas estender os arrays declarativos no componente.

### 18. Regra da Soberania do Usuário (_Rule of User Sovereignty_)

- O visitante possui controle total sobre sua experiência: sem pop-ups, sem modais intrusivos, sem rastreamento.

### 19. Regra da Autonomia Reentrante (_Rule of Reentrant Autonomy_)

- O repositório pode ser clonado em qualquer ambiente e compilado imediatamente com `npm install && make build`.
