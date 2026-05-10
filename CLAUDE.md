# Guia do projeto

## Imagens — SEMPRE otimizar antes de commitar

Toda imagem nova adicionada ao projeto **deve** passar pelo processo de otimização antes de ser commitada. Imagens grandes (>500 KB) incham o repositório git permanentemente e prejudicam o tempo de carregamento do site.

### Fluxo obrigatório ao adicionar imagens

1. Coloque a imagem original (PNG/JPG/JPEG) em `public/hq/` (ou subpasta apropriada dentro de `public/`).
2. Rode o comando de otimização:
   ```
   npm run optimize-images
   ```
3. Isso gera um arquivo `.webp` ao lado do original, com redução típica de 80–90% no tamanho.
4. **Atualize a referência no código** (em `src/data/*.js` ou onde a imagem for usada) para apontar para o `.webp`:
   ```js
   image: '/hq/nome-da-imagem.webp'
   ```
5. **Delete o PNG/JPG original** após confirmar que o `.webp` está sendo usado corretamente.
6. Verifique no navegador (`npm run dev`) que a imagem carrega antes de commitar.

### Configuração do otimizador

- Script: [scripts/optimize-images.js](scripts/optimize-images.js)
- Biblioteca: `sharp`
- Configuração padrão:
  - Qualidade WebP: 80
  - Largura máxima: 1600px (imagens maiores são redimensionadas)
  - Processa apenas: `.png`, `.jpg`, `.jpeg` em `public/`

### Quando NÃO converter

- SVGs (já são vetoriais e leves) — deixe como estão.
- Imagens já em `.webp` — o script ignora.
- Ícones pequenos (<10 KB) — conversão tem ganho marginal.

### Alvos de tamanho

- Imagens de capa/hero: <300 KB após otimização.
- Thumbnails: <100 KB.
- Se uma imagem ficar acima desses limites mesmo após `optimize-images`, considere reduzir a qualidade no script ou redimensionar antes.

## Stack

- Vue 3 + Vite
- Vue Router 4
- PhotoSwipe (lightbox de imagens)

## Estrutura

- `src/views/` — páginas (HomeView, ConteudoListView, ConteudoView)
- `src/data/` — conteúdo das HQs (essencialismo.js, financas.js, etc.)
- `public/hq/` — imagens estáticas das HQs
- `scripts/` — utilitários de build/manutenção
