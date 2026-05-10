<template>
  <main class="hq-main">
    <header class="hq-header">
      <p class="hq-eyebrow">// CONTEÚDOS</p>
      <h1 class="hq-title">Conteúdos em formato HQ</h1>
      <p class="hq-lede">
        Histórias sobre finanças e essencialismo — contadas em capítulos. Escolha um e mergulhe.
      </p>
    </header>

    <div class="hq-grid">
      <RouterLink
        v-for="(c, i) in conteudos"
        :key="c.id"
        :to="`/${c.id}`"
        class="hq-card"
        :style="{ '--card-color': c.color }"
      >
        <div class="hq-cover">
          <div class="hq-cover-art">
            <span class="hq-cover-icon">{{ c.icon }}</span>
          </div>
          <span class="hq-badge">HQ #{{ String(i + 1).padStart(2, '0') }}</span>
        </div>

        <div class="hq-body">
          <div class="hq-meta">
            <span>{{ c.subtitle }}</span>
            <span class="hq-dot"></span>
            <span>{{ totalAulas(c) }} aulas</span>
            <span class="hq-dot"></span>
            <span class="hq-tag-lang">PT-BR</span>
          </div>

          <h2 class="hq-card-title">{{ c.title }}</h2>
          <blockquote class="hq-card-quote">{{ c.quote }}</blockquote>

          <div class="hq-tags">
            <span
              v-for="mod in c.data.modules.slice(0, 4)"
              :key="mod.id"
              class="hq-tag"
            >
              #{{ slug(mod.title) }}
            </span>
          </div>
        </div>
      </RouterLink>
    </div>
  </main>
</template>

<script setup>
import { RouterLink } from 'vue-router'
import { conteudos } from '../data/conteudos.js'

function totalAulas(c) {
  return c.data.modules.reduce((acc, m) => acc + m.lessons.length, 0)
}

function slug(s) {
  return s
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}
</script>

<style scoped>
.hq-main {
  max-width: 1100px;
  margin: 0 auto;
  padding: 64px 24px;
}

.hq-header {
  margin-bottom: 48px;
}

.hq-eyebrow {
  font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
  font-size: 13px;
  letter-spacing: 0.14em;
  color: var(--accent);
  margin-bottom: 12px;
}

.hq-title {
  font-family: var(--font-serif);
  font-size: clamp(32px, 4.5vw, 52px);
  font-weight: 700;
  color: #fff;
  letter-spacing: -0.02em;
  line-height: 1.1;
  margin-bottom: 14px;
}

.hq-lede {
  color: var(--ink-light);
  font-size: 17px;
  max-width: 560px;
  line-height: 1.6;
}

/* ── Grid ─────────────────────────────── */
.hq-grid {
  display: grid;
  gap: 36px;
  grid-template-columns: 1fr;
}

@media (min-width: 768px) {
  .hq-grid {
    grid-template-columns: 1fr 1fr;
  }
}

/* ── Card HQ ──────────────────────────── */
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

/* ── Capa ─────────────────────────────── */
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
    radial-gradient(circle at 75% 70%, color-mix(in srgb, #8B3DFF 35%, transparent) 0%, transparent 55%),
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
  font-size: clamp(80px, 14vw, 140px);
  color: var(--card-color);
  text-shadow:
    4px 4px 0 #000,
    -2px -2px 0 rgba(255, 255, 255, 0.1);
  line-height: 1;
}

.hq-badge {
  position: absolute;
  top: 14px;
  left: 14px;
  background: #fde047;
  color: #000;
  font-weight: 800;
  font-size: 12px;
  letter-spacing: 0.04em;
  padding: 4px 12px;
  border: 2px solid #000;
  transform: rotate(-3deg);
  font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
}

/* ── Corpo ────────────────────────────── */
.hq-body {
  padding: 24px;
}

.hq-meta {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 10px;
  font-size: 12px;
  color: var(--ink-light);
  margin-bottom: 14px;
  text-transform: uppercase;
  letter-spacing: 0.06em;
}

.hq-dot {
  width: 4px;
  height: 4px;
  border-radius: 50%;
  background: var(--ink-faint);
}

.hq-tag-lang {
  font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
  background: var(--cream-darker);
  color: var(--card-color);
  padding: 2px 8px;
  border-radius: 4px;
  border: 1px solid var(--border);
  letter-spacing: 0.05em;
}

.hq-card-title {
  font-family: var(--font-serif);
  font-size: 28px;
  font-weight: 700;
  color: #fff;
  letter-spacing: -0.01em;
  line-height: 1.15;
  margin-bottom: 12px;
  transition: color 0.2s ease;
}

.hq-card:hover .hq-card-title {
  color: var(--card-color);
}

.hq-card-quote {
  font-family: var(--font-serif);
  font-style: italic;
  font-size: 15px;
  color: var(--ink-soft);
  line-height: 1.55;
  border-left: 2px solid var(--card-color);
  padding-left: 14px;
  margin-bottom: 20px;
}

.hq-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.hq-tag {
  font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
  font-size: 12px;
  background: var(--cream-darker);
  color: var(--card-color);
  padding: 4px 10px;
  border-radius: 4px;
  border: 1px solid var(--border);
}

@media (max-width: 480px) {
  .hq-main {
    padding: 40px 18px;
  }

  .hq-body {
    padding: 18px;
  }
}
</style>
