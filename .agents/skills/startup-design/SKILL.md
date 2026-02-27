---
name: Design para Startups & High Conversion Landing Pages
description: Diretrizes de design voltadas para startups, estética premium e economia comportamental, focado em alta conversão e clareza visual.
---

# 🎨 SKILL: UI, UX & Landing Pages de Alta Conversão

Este guia consolida princípios de design para startups, focando em alta conversão, estética premium e clareza visual.

## 1. Fundamentos de UI e Estética "Premium"

A percepção de valor de um software ou serviço começa na primeira impressão visual. O design não deve ser barulhento; deve ser intencional.

- **A Regra do Espaço em Branco (Respiro)**: O espaço vazio é uma ferramenta de foco. Aumente o padding (espaçamento interno) entre seções e cards para dar um ar de produto sofisticado.
- **A Regra do "Destaque Único"**: Escolha apenas um elemento para ser o protagonista da tela. Se o botão de CTA (Call to Action) é vibrante, o resto da página deve orbitar em tons neutros (cinzas, brancos, pretos).
- **Hierarquia de Tipografia**: A fonte é o design. Use no máximo duas famílias tipográficas.
  - **Headline (Títulos)**: Peso forte (Bold/Semibold), tamanho grande e kerning (espaçamento entre letras) levemente reduzido (ex: `-0.02em`) para um aspecto de revista. Altura da linha (line-height) entre `1.1` e `1.2`.
  - **Body (Textos)**: Fonte legível, peso regular, cor levemente suavizada (ex: `#4B5563` em vez de preto puro) com altura da linha entre `1.5` e `1.6` para leitura confortável.
- **Consistência de Bordas**: Mantenha o `border-radius` padronizado. A lógica de arredondamento dos botões deve conversar com a dos cards e modais.
- **Bordas Internas (Inner Borders)**: Em botões ou cards, use uma borda levemente mais clara que o fundo no topo para simular um efeito de relevo 3D sutil.
- **O uso do Vidro (Glassmorphism)**: Use o `backdrop-filter: blur()` com moderação apenas em elementos sobrepostos (como modais ou menus fixos) para manter a profundidade.

## 2. Estrutura de Landing Pages que Convertem

Uma Landing Page (LP) não é um site institucional; ela tem um único objetivo: fazer o usuário agir (comprar ou cadastrar).

- **The Hero Section (A Primeira Dobra)**: Deve responder a 3 perguntas em 3 segundos sem que o usuário precise rolar a página:
  1. O que é o produto?
  2. Para quem é?
  3. Qual o próximo passo? (CTA claro e focado no benefício, ex: "Começar teste grátis" em vez de "Enviar").
- **Prova Social Imediata**: Não esconda logos de clientes no rodapé. Posicione-os logo abaixo da Hero Section para gerar autoridade logo de cara.
- **Visualização Real do Produto**: Substitua fotos genéricas de banco de imagens por mockups reais da sua interface ou ilustrações que mostrem o produto resolvendo o problema.
- **Padrões de Leitura**:
  - Use o **Z-Pattern** (padrão em Z) para landing pages mais simples e diretas (ex: Hero section).
  - Use o **F-Pattern** (padrão em F) para dashboards ou páginas densas em texto.

## 3. Design Comportamental e Psicologia (O Diferencial)

Bons designers usam vieses cognitivos e economia comportamental para guiar escolhas e reduzir a fricção.

- **Nem todo Onboarding é igual**: O processo de entrada do usuário deve ser desenhado para acelerar a percepção de valor (o momento Aha!). Remova etapas desnecessárias de cadastro que aumentam a taxa de abandono e prejudicam o CAC (Custo de Aquisição).
- **Redução da Carga Cognitiva (Lei de Hick)**: Quanto mais opções você dá, mais tempo o usuário leva para decidir. Simplifique escolhas. Se você tem 3 planos de assinatura, destaque visualmente o plano mais vantajoso para ancorar a decisão.
- **Estados de Interface (Micro-interações)**:
  - **Hover States**: Botões devem reagir ao mouse (ex: subir `2px` ou ganhar uma sombra sutil) para simular o "clique" físico.
  - **Empty States**: Telas sem dados nunca devem ser "becos sem saída". Use o espaço vazio para educar o usuário e oferecer um CTA para a primeira ação (com ilustrações minimalistas).
- **Inputs Inteligentes**: Mantenha os labels (rótulos) dos campos de formulário sempre visíveis. Confiar apenas no placeholder é um erro, pois o texto some assim que o usuário começa a digitar.

## 4. Tabela de Refinamento de UI (Alternativas)

| ❌ O que evitar (Aspecto Amador) | ✅ O que usar (Aspecto Premium) | 💡 Por que funciona? |
| :--- | :--- | :--- |
| Bordas sólidas pretas (`#000`) de 1px em cards. | Sombras suaves (ex: cor de fundo escurecida) ou Inner Borders (bordas internas claras). | Cria profundidade e relevo 3D sutil sem poluir a visão. |
| Ícones super coloridos e complexos. | Ícones de linha fina (Linear Icons) e monocromáticos. | Mantém a interface limpa, focando a atenção no conteúdo. |
| Gradientes "arco-íris" ou muitos contrastantes. | Gradientes tom sobre tom (ex: azul claro para azul médio). | Evita o visual datado; transmite robustez e elegância. |
| Sombras genéricas em preto (`rgba(0,0,0, 0.5)`). | Sombras com a cor do próprio elemento, grande blur e baixa opacidade (ex: 90% escuridão da cor de fundo). | Fica muito mais orgânico e integrado ao layout. |
| Rodapés (Footers) cheios de links irrelevantes. | Rodapé minimalista com 3-4 colunas organizadas. | Diminui a ansiedade de escolha (paradoxo da escolha). |
| Layouts dispersos e espalhados. | Bento Grids (Grade em estilo marmita japonesa). | Agrupa funcionalidades diferentes em blocos fechados e escaneáveis. |

## 5. Checklist Final de Publicação ("The Startup Design Touch")

Antes de colocar o design no ar, faça estas perguntas (checklist):

- [ ] A página funciona perfeitamente no mobile sem exigir zoom do usuário?
- [ ] O texto está escaneável? (Uso de bullet points, negrito nas palavras-chave e parágrafos curtos).
- [ ] A paleta de cores respeita a regra 60-30-10? (60% cor de fundo/base, 30% cor secundária, 10% cor de destaque/CTA).
- [ ] Removi linhas e divisórias desnecessárias? (Prefira usar mudanças sutis na cor de fundo para separar seções).
- [ ] O fluxo do usuário até a conversão está com o mínimo de fricção possível?
