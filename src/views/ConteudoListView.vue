<template>
  <main v-if="conteudo" class="hq-main">
    <RouterLink to="/" class="hq-back">&larr; voltar aos conteúdos</RouterLink>

    <header class="hq-header">
      <p class="hq-eyebrow" :style="{ color: conteudo.color }">// {{ conteudo.subtitle.toUpperCase() }}</p>
      <h1 class="hq-title">{{ conteudo.title }}</h1>
      <blockquote class="hq-intro" :style="{ borderColor: conteudo.color }">
        {{ conteudo.data.quote }}
      </blockquote>
    </header>

    <section v-for="mod in conteudo.data.modules" :key="mod.id" class="hq-module">
      <h2 class="hq-mod-title" :style="{ color: mod.color }">
        <span class="hq-mod-icon">{{ mod.icon }}</span>
        {{ mod.title }}
      </h2>
      <p class="hq-mod-sub">{{ mod.subtitle }}</p>

      <div class="hq-grid">
        <RouterLink
          v-for="lesson in mod.lessons"
          :key="lesson.id"
          :to="`/${conteudo.id}/${lesson.id}`"
          class="hq-card"
          :style="{ '--card-color': mod.color }"
        >
          <div class="hq-cover">
            <div class="hq-cover-art">
              <span class="hq-cover-icon">{{ mod.icon }}</span>
            </div>
            <span class="hq-badge">HQ #{{ String(lesson.id + 1).padStart(2, '0') }}</span>
          </div>

          <div class="hq-body">
            <div class="hq-meta">
              <span v-if="lesson.source">{{ lesson.source }}</span>
              <span v-if="lesson.source" class="hq-dot"></span>
              <span>{{ lesson.keyIdeas.length }} painéis</span>
            </div>

            <h3 class="hq-card-title">{{ lesson.title }}</h3>
            <blockquote class="hq-card-quote">"{{ lesson.quote }}"</blockquote>
          </div>
        </RouterLink>
      </div>
    </section>
  </main>

  <main v-else class="hq-main">
    <p class="hq-404">Conteúdo não encontrado.</p>
    <RouterLink to="/" class="hq-back">&larr; voltar</RouterLink>
  </main>
</template>

<script setup>
import { computed } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import { conteudos } from '../data/conteudos.js'

const route = useRoute()
const conteudo = computed(() =>
  conteudos.find((c) => c.id === route.params.conteudo) || null
)
</script>

<style scoped>
.hq-main {
  max-width: 1100px;
  margin: 0 auto;
  padding: 48px 24px 80px;
}

.hq-back {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
  font-size: 14px;
  color: var(--accent);
  margin-bottom: 32px;
  transition: color 0.2s;
}

.hq-back:hover {
  color: #fff;
}

.hq-header {
  margin-bottom: 56px;
}

.hq-eyebrow {
  font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
  font-size: 13px;
  letter-spacing: 0.14em;
  margin-bottom: 12px;
}

.hq-title {
  font-family: var(--font-serif);
  font-size: clamp(36px, 5vw, 56px);
  font-weight: 700;
  color: #fff;
  letter-spacing: -0.02em;
  line-height: 1.1;
  margin-bottom: 18px;
}

.hq-intro {
  font-family: var(--font-serif);
  font-style: italic;
  font-size: 18px;
  color: var(--ink-soft);
  border-left: 4px solid var(--accent);
  padding-left: 16px;
  max-width: 640px;
  line-height: 1.55;
}

.hq-module {
  margin-bottom: 56px;
}

.hq-mod-title {
  display: flex;
  align-items: center;
  gap: 10px;
  font-family: 'Bangers', 'Impact', sans-serif;
  font-size: 28px;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  margin-bottom: 4px;
}

.hq-mod-icon {
  font-size: 24px;
}

.hq-mod-sub {
  font-size: 14px;
  color: var(--ink-light);
  margin-bottom: 24px;
  text-transform: uppercase;
  letter-spacing: 0.06em;
}

.hq-grid {
  display: grid;
  gap: 32px;
  grid-template-columns: 1fr;
}

@media (min-width: 768px) {
  .hq-grid {
    grid-template-columns: 1fr 1fr;
  }
}

.hq-card {
  --card-color: var(--accent);
  display: block;
  background: var(--cream-dark);
  border: 4px solid #fff;
  border-radius: 10px;
  overflow: hidden;
  text-decoration: none;
  color: inherit;
  box-shadow: 6px 6px 0 0 #8B3DFF;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.hq-card:hover {
  transform: translate(-4px, -4px);
  box-shadow: 10px 10px 0 0 var(--card-color);
}

.hq-cover {
  position: relative;
  aspect-ratio: 16 / 9;
  border-bottom: 4px solid #fff;
  overflow: hidden;
}

.hq-cover-art {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background:
    radial-gradient(circle at 30% 30%, color-mix(in srgb, var(--card-color) 40%, transparent) 0%, transparent 55%),
    radial-gradient(circle at 75% 70%, color-mix(in srgb, #8B3DFF 30%, transparent) 0%, transparent 55%),
    repeating-linear-gradient(
      45deg,
      var(--cream-darker) 0,
      var(--cream-darker) 10px,
      var(--cream-dark) 10px,
      var(--cream-dark) 20px
    );
  transition: transform 0.3s ease;
}

.hq-card:hover .hq-cover-art {
  transform: scale(1.05);
}

.hq-cover-icon {
  font-size: clamp(60px, 10vw, 100px);
  color: var(--card-color);
  text-shadow: 4px 4px 0 #000, -2px -2px 0 rgba(255, 255, 255, 0.1);
  line-height: 1;
}

.hq-badge {
  position: absolute;
  top: 14px;
  left: 14px;
  background: #fde047;
  color: #000;
  font-family: 'Bangers', 'Impact', sans-serif;
  font-size: 18px;
  letter-spacing: 0.04em;
  padding: 4px 14px;
  border: 2px solid #000;
  transform: rotate(-3deg);
}

.hq-body {
  padding: 22px;
}

.hq-meta {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 10px;
  font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
  font-size: 11px;
  color: var(--ink-light);
  margin-bottom: 12px;
  text-transform: uppercase;
  letter-spacing: 0.08em;
}

.hq-dot {
  width: 4px;
  height: 4px;
  border-radius: 50%;
  background: var(--ink-faint);
}

.hq-card-title {
  font-family: var(--font-serif);
  font-size: 22px;
  font-weight: 700;
  color: #fff;
  letter-spacing: -0.01em;
  line-height: 1.2;
  margin-bottom: 10px;
  transition: color 0.2s;
}

.hq-card:hover .hq-card-title {
  color: var(--card-color);
}

.hq-card-quote {
  font-family: var(--font-serif);
  font-style: italic;
  font-size: 14px;
  color: var(--ink-soft);
  line-height: 1.5;
  border-left: 2px solid var(--card-color);
  padding-left: 12px;
}

.hq-404 {
  font-size: 24px;
  color: var(--ink-light);
  margin-bottom: 16px;
}
</style>
