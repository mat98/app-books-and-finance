<template>
  <main v-if="lesson && conteudo && mod" class="hq-main">
    <RouterLink :to="`/${conteudo.id}`" class="hq-back">
      &larr; voltar para {{ conteudo.title }}
    </RouterLink>

    <header class="hq-header">
      <div class="hq-meta">
        <span :style="{ color: mod.color }">{{ mod.icon }} {{ mod.title }}</span>
        <span class="hq-dot"></span>
        <span v-if="lesson.source">{{ lesson.source }}</span>
        <span v-if="lesson.source" class="hq-dot"></span>
        <span class="hq-tag-lang">PT-BR</span>
      </div>

      <h1 class="hq-title">{{ lesson.title }}</h1>
      <p class="hq-subtitle">{{ conteudo.subtitle }}</p>

      <p v-if="!lesson.image" class="hq-intro" :style="{ borderColor: mod.color }">
        {{ lesson.summary }}
      </p>
    </header>

    <section v-if="lesson.image" class="hq-panels">
      <article class="comic-panel comic-panel--image">
        <span class="comic-badge">#01</span>
        <img
          :src="lesson.image"
          :alt="lesson.title"
          class="comic-image"
          loading="lazy"
          @click="openImage(lesson.image)"
        />
        <span class="comic-zoom-hint">toque para ampliar</span>
      </article>
    </section>

    <section v-else class="hq-panels">
      <article
        v-for="(panel, index) in panels"
        :key="index"
        class="comic-panel"
      >
        <div class="comic-cover" :style="{ '--mod-color': mod.color }">
          <span class="comic-badge">#{{ String(index + 1).padStart(2, '0') }}</span>
          <span class="comic-cover-icon">{{ panel.icon }}</span>
          <span class="comic-cover-label">{{ panel.label }}</span>
        </div>

        <div class="comic-content">
          <p v-if="panel.caption" class="comic-caption">{{ panel.caption }}</p>

          <div
            v-if="panel.speech"
            class="speech-bubble"
            :class="panel.speechFrom === 'right' ? 'speech-from-right' : 'speech-from-left'"
          >
            <span class="comic-speech">"{{ panel.speech }}"</span>
          </div>
        </div>
      </article>
    </section>

    <footer class="hq-footer">
      <div class="hq-nav">
        <RouterLink
          v-if="prevLesson"
          :to="`/${conteudo.id}/${prevLesson.id}`"
          class="hq-nav-btn"
        >
          <span class="hq-nav-label">&larr; Anterior</span>
          <span class="hq-nav-title">{{ prevLesson.title }}</span>
        </RouterLink>
        <span v-else></span>

        <RouterLink
          v-if="nextLesson"
          :to="`/${conteudo.id}/${nextLesson.id}`"
          class="hq-nav-btn hq-nav-btn--right"
        >
          <span class="hq-nav-label">Próxima &rarr;</span>
          <span class="hq-nav-title">{{ nextLesson.title }}</span>
        </RouterLink>
      </div>

      <RouterLink :to="`/${conteudo.id}`" class="hq-back-link">
        Ver outras HQs de {{ conteudo.title }}
      </RouterLink>
    </footer>
  </main>

  <main v-else class="hq-main">
    <p class="hq-404">404 — capítulo não encontrado.</p>
    <RouterLink to="/" class="hq-back">&larr; voltar ao início</RouterLink>
  </main>
</template>

<script setup>
import { computed, onBeforeUnmount } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import PhotoSwipeLightbox from 'photoswipe/lightbox'
import 'photoswipe/style.css'
import { conteudos } from '../data/conteudos.js'

const PANEL_ICONS = ['◇', '◈', '◆', '✦', '✧', '★', '☄', '◉', '◎', '○', '●', '▲', '▼', '■', '□']

const route = useRoute()

const conteudo = computed(() =>
  conteudos.find((c) => c.id === route.params.conteudo) || null
)

const allLessons = computed(() => {
  if (!conteudo.value) return []
  return conteudo.value.data.modules.flatMap((m) => m.lessons)
})

const lesson = computed(() => {
  if (!conteudo.value) return null
  const id = Number(route.params.lessonId)
  return allLessons.value.find((l) => l.id === id) || null
})

const mod = computed(() => {
  if (!conteudo.value || !lesson.value) return null
  return conteudo.value.data.modules.find((m) => m.id === lesson.value.moduleId) || null
})

const lessonIndex = computed(() => {
  if (!lesson.value) return -1
  return allLessons.value.findIndex((l) => l.id === lesson.value.id)
})

const prevLesson = computed(() => allLessons.value[lessonIndex.value - 1] || null)
const nextLesson = computed(() => allLessons.value[lessonIndex.value + 1] || null)

let activeLightbox = null

function loadImageSize(src) {
  return new Promise((resolve) => {
    const img = new Image()
    img.onload = () => resolve({ w: img.naturalWidth, h: img.naturalHeight })
    img.onerror = () => resolve({ w: 1200, h: 1600 })
    img.src = src
  })
}

async function openImage(src) {
  const size = await loadImageSize(src)
  const lightbox = new PhotoSwipeLightbox({
    dataSource: [{ src, width: size.w, height: size.h, alt: lesson.value?.title || '' }],
    pswpModule: () => import('photoswipe'),
    initialZoomLevel: 'fit',
    secondaryZoomLevel: 2,
    maxZoomLevel: 5,
    bgOpacity: 0.95,
    showHideAnimationType: 'fade',
    closeOnVerticalDrag: true,
    clickToCloseNonZoomable: true,
    wheelToZoom: true,
    padding: { top: 16, bottom: 16, left: 8, right: 8 },
  })
  lightbox.on('destroy', () => {
    activeLightbox = null
  })
  lightbox.init()
  lightbox.loadAndOpen(0)
  activeLightbox = lightbox
}

onBeforeUnmount(() => {
  if (activeLightbox) {
    activeLightbox.destroy()
    activeLightbox = null
  }
})

const panels = computed(() => {
  if (!lesson.value) return []
  const ideas = lesson.value.keyIdeas
  const list = []

  list.push({
    icon: '✦',
    label: 'ABERTURA',
    caption: 'CAPÍTULO 1 — A QUESTÃO CENTRAL',
    speech: lesson.value.quote,
    speechFrom: 'left',
  })

  ideas.forEach((idea, i) => {
    list.push({
      icon: PANEL_ICONS[i % PANEL_ICONS.length],
      label: `IDEIA ${String(i + 1).padStart(2, '0')}`,
      caption: `PAINEL ${String(i + 2).padStart(2, '0')}`,
      speech: idea,
      speechFrom: i % 2 === 0 ? 'right' : 'left',
    })
  })

  if (lesson.value.insight) {
    list.push({
      icon: '★',
      label: 'INSIGHT FINAL',
      caption: 'DESFECHO — INSIGHT DA AULA',
      speech: lesson.value.insight,
      speechFrom: 'left',
    })
  }

  return list
})
</script>

<style scoped>
.hq-main {
  max-width: 880px;
  margin: 0 auto;
  padding: 48px 20px 80px;
}

.hq-back,
.hq-back-link {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
  font-size: 14px;
  color: var(--accent);
  margin-bottom: 32px;
  transition: color 0.2s;
}

.hq-back:hover,
.hq-back-link:hover {
  color: #fff;
}

.hq-header {
  margin-bottom: 56px;
}

.hq-meta {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 10px;
  font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
  font-size: 12px;
  color: var(--ink-light);
  margin-bottom: 18px;
  text-transform: uppercase;
  letter-spacing: 0.08em;
}

.hq-dot {
  width: 4px;
  height: 4px;
  border-radius: 50%;
  background: var(--ink-faint);
}

.hq-tag-lang {
  background: var(--cream-darker);
  color: var(--accent);
  padding: 2px 8px;
  border-radius: 4px;
  border: 1px solid var(--border);
}

.hq-title {
  font-family: var(--font-serif);
  font-size: clamp(36px, 5.5vw, 60px);
  font-weight: 700;
  color: #fff;
  letter-spacing: -0.02em;
  line-height: 1.05;
  margin-bottom: 12px;
}

.hq-subtitle {
  font-size: 18px;
  color: var(--ink-light);
  margin-bottom: 28px;
}

.hq-intro {
  font-family: var(--font-serif);
  font-style: italic;
  font-size: 17px;
  color: var(--ink-soft);
  border-left: 4px solid var(--accent);
  padding-left: 16px;
  line-height: 1.6;
}

/* ── Tira vertical de paineis HQ ─────────── */
.hq-panels {
  display: flex;
  flex-direction: column;
  gap: 48px;
  margin-bottom: 56px;
}

.comic-panel {
  background: #fff;
  border: 6px solid #000;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 12px 12px 0 0 #000;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.comic-panel:hover {
  transform: translate(-3px, -3px);
  box-shadow: 16px 16px 0 0 #000;
}

.comic-panel--image {
  position: relative;
  background: #000;
}

.comic-image {
  display: block;
  width: 100%;
  height: auto;
  cursor: zoom-in;
}

.comic-zoom-hint {
  position: absolute;
  bottom: 12px;
  right: 12px;
  background: rgba(0, 0, 0, 0.7);
  color: #fff;
  font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
  font-size: 12px;
  padding: 4px 10px;
  border-radius: 4px;
  pointer-events: none;
  user-select: none;
}

/* ── Capa do painel (substitui imagem) ───── */
.comic-cover {
  --mod-color: #4ade80;
  position: relative;
  aspect-ratio: 16 / 9;
  border-bottom: 6px solid #000;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  gap: 12px;
  background:
    radial-gradient(circle at 30% 30%, color-mix(in srgb, var(--mod-color) 50%, transparent) 0%, transparent 60%),
    radial-gradient(circle at 75% 70%, color-mix(in srgb, #8B3DFF 35%, transparent) 0%, transparent 55%),
    repeating-linear-gradient(
      45deg,
      #1a1a1a 0,
      #1a1a1a 12px,
      #000 12px,
      #000 24px
    );
}

.comic-badge {
  position: absolute;
  top: 0;
  left: 0;
  z-index: 2;
  background: #fde047;
  color: #000;
  font-family: 'Bangers', 'Impact', sans-serif;
  font-size: 24px;
  letter-spacing: 0.05em;
  padding: 8px 16px;
  border-right: 5px solid #000;
  border-bottom: 5px solid #000;
}

.comic-cover-icon {
  font-size: clamp(60px, 12vw, 110px);
  color: var(--mod-color);
  text-shadow: 4px 4px 0 #000, -2px -2px 0 rgba(255, 255, 255, 0.1);
  line-height: 1;
}

.comic-cover-label {
  font-family: 'Bangers', 'Impact', sans-serif;
  font-size: clamp(20px, 3vw, 28px);
  letter-spacing: 0.08em;
  color: #fff;
  text-shadow: 3px 3px 0 #000;
}

/* ── Conteúdo do painel ──────────────────── */
.comic-content {
  background: #fef9c3;
  padding: 32px 28px;
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.comic-caption {
  font-family: 'Bangers', 'Impact', sans-serif;
  font-size: clamp(22px, 3vw, 32px);
  letter-spacing: 0.04em;
  color: #000;
  text-transform: uppercase;
  line-height: 1.15;
  border-bottom: 4px solid #000;
  padding-bottom: 16px;
}

.speech-bubble {
  position: relative;
  background: #fff;
  color: #000;
  padding: 18px 22px;
  border: 3px solid #000;
  border-radius: 24px;
  max-width: 90%;
}

.speech-from-left {
  align-self: flex-start;
}

.speech-from-right {
  align-self: flex-end;
}

.speech-bubble::after {
  content: '';
  position: absolute;
  width: 0;
  height: 0;
  border-style: solid;
  bottom: -18px;
}

.speech-from-left::after {
  left: 28px;
  border-width: 18px 18px 0 0;
  border-color: #fff transparent transparent transparent;
  filter: drop-shadow(2px 2px 0 #000);
}

.speech-from-right::after {
  right: 28px;
  border-width: 18px 0 0 18px;
  border-color: #fff transparent transparent transparent;
  filter: drop-shadow(-2px 2px 0 #000);
}

.comic-speech {
  font-family: 'Comic Neue', 'Comic Sans MS', cursive;
  font-weight: 700;
  font-size: clamp(16px, 2.2vw, 22px);
  line-height: 1.45;
}

/* ── Footer / nav ────────────────────────── */
.hq-footer {
  border-top: 1px solid var(--border);
  padding-top: 32px;
}

.hq-nav {
  display: flex;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 24px;
}

.hq-nav-btn {
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 14px 18px;
  border: 2px solid var(--border);
  border-radius: 8px;
  background: var(--cream-dark);
  color: var(--ink-soft);
  text-decoration: none;
  max-width: 48%;
  transition: border-color 0.2s, color 0.2s, transform 0.2s;
}

.hq-nav-btn:hover {
  border-color: var(--accent);
  color: #fff;
  transform: translateY(-2px);
}

.hq-nav-btn--right {
  text-align: right;
  margin-left: auto;
}

.hq-nav-label {
  font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--accent);
}

.hq-nav-title {
  font-size: 14px;
  font-weight: 600;
}

.hq-back-link {
  display: inline-flex;
  margin-top: 16px;
  border: 2px solid var(--accent);
  color: var(--accent);
  padding: 10px 20px;
  border-radius: 999px;
  font-weight: 600;
  font-size: 14px;
  margin-bottom: 0;
}

.hq-back-link:hover {
  background: var(--accent);
  color: var(--cream);
}

.hq-404 {
  font-size: 24px;
  color: var(--ink-light);
  margin-bottom: 16px;
}

@media (max-width: 600px) {
  .comic-content {
    padding: 24px 18px;
  }
  .speech-bubble {
    max-width: 100%;
  }
}
</style>

<style>
.pswp {
  --pswp-bg: #000;
  --pswp-icon-color: #fff;
  --pswp-icon-color-secondary: #000;
}
</style>
