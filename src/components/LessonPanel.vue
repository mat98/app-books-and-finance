<template>
  <article class="lesson-panel" :style="{ '--ls-color': mod.color }">
    <header class="ls-header">
      <div class="ls-breadcrumb">
        <span class="ls-mod-icon">{{ mod.icon }}</span>
        <span class="ls-mod-name">{{ mod.title }}</span>
      </div>

      <div class="ls-header-right">
        <span v-if="lesson.source" class="ls-source">{{ lesson.source }}</span>
        <div class="ls-nav">
          <button class="ls-nav-btn" :disabled="!prevLesson" @click="emit('prev')">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="15,18 9,12 15,6"/>
            </svg>
          </button>
          <span class="ls-position">{{ lessonIndex + 1 }} / {{ total }}</span>
          <button class="ls-nav-btn" :disabled="!nextLesson" @click="emit('next')">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="9,6 15,12 9,18"/>
            </svg>
          </button>
        </div>
      </div>
    </header>

    <div class="ls-body">
      <h1 class="ls-title">{{ lesson.title }}</h1>

      <blockquote class="ls-quote">
        <p>{{ lesson.quote }}</p>
      </blockquote>

      <section class="ls-section">
        <h2 class="section-label">Resumo</h2>
        <div class="ls-summary">
          <p v-for="(para, i) in lesson.summary.split('\n\n')" :key="i">{{ para }}</p>
        </div>
      </section>

      <section class="ls-section">
        <h2 class="section-label">Ideias-chave</h2>
        <ul class="ideas-list">
          <li v-for="idea in lesson.keyIdeas" :key="idea" class="idea-item">
            <span class="idea-dot">—</span>
            <span>{{ idea }}</span>
          </li>
        </ul>
      </section>

      <section v-if="lesson.insight" class="ls-section">
        <h2 class="section-label">Insight da aula</h2>
        <div class="ls-insight">
          <span class="insight-icon">◈</span>
          <p>{{ lesson.insight }}</p>
        </div>
      </section>

      <!-- Navegação inferior -->
      <div class="ls-footer-nav">
        <button v-if="prevLesson" class="footer-nav-btn" @click="emit('prev')">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="15,18 9,12 15,6"/>
          </svg>
          <div class="footer-nav-info">
            <span class="footer-nav-label">Anterior</span>
            <span class="footer-nav-title">{{ prevLesson.title }}</span>
          </div>
        </button>
        <div v-else></div>
        <button v-if="nextLesson" class="footer-nav-btn footer-nav-btn--right" @click="emit('next')">
          <div class="footer-nav-info footer-nav-info--right">
            <span class="footer-nav-label">Próxima</span>
            <span class="footer-nav-title">{{ nextLesson.title }}</span>
          </div>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="9,6 15,12 9,18"/>
          </svg>
        </button>
      </div>
    </div>
  </article>
</template>

<script setup>
import { computed } from 'vue'
import { allLessons, financasData } from '../data/financas.js'

const props = defineProps({ lessonId: Number })
const emit = defineEmits(['prev', 'next'])

const lesson = computed(() => allLessons.find((l) => l.id === props.lessonId))
const mod = computed(() =>
  financasData.modules.find((m) => m.id === lesson.value?.moduleId)
)

const lessonIndex = computed(() => allLessons.findIndex((l) => l.id === props.lessonId))
const total = allLessons.length
const prevLesson = computed(() => allLessons[lessonIndex.value - 1] || null)
const nextLesson = computed(() => allLessons[lessonIndex.value + 1] || null)
</script>

<style scoped>
.lesson-panel {
  --ls-color: var(--accent);
  padding: 40px 48px 80px;
  max-width: 720px;
  margin: 0 auto;
}

.ls-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 36px;
  padding-bottom: 16px;
  border-bottom: 1px solid var(--border);
}

.ls-header-right {
  display: flex;
  align-items: center;
  gap: 12px;
}

.ls-source {
  font-size: 10px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: var(--ink-faint);
  background: var(--cream-dark);
  border: 1px solid var(--border);
  border-radius: 20px;
  padding: 3px 10px;
}

.ls-breadcrumb {
  display: flex;
  align-items: center;
  gap: 8px;
}

.ls-mod-icon {
  font-size: 16px;
  color: var(--ls-color);
}

.ls-mod-name {
  font-size: 12px;
  font-weight: 600;
  color: var(--ls-color);
  text-transform: uppercase;
  letter-spacing: 0.1em;
}

.ls-nav {
  display: flex;
  align-items: center;
  gap: 6px;
}

.ls-nav-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 30px;
  height: 30px;
  border-radius: var(--radius-sm);
  color: var(--ink-light);
  transition: background var(--transition), color var(--transition);
  cursor: pointer;
}

.ls-nav-btn:hover:not(:disabled) {
  background: var(--cream-dark);
  color: var(--ink);
}

.ls-nav-btn:disabled {
  color: var(--cream-darker);
  cursor: default;
}

.ls-position {
  font-size: 12px;
  color: var(--ink-faint);
  min-width: 36px;
  text-align: center;
}

/* ── Título ─────────────────────────────── */
.ls-num-label {
  font-size: 12px;
  color: var(--ls-color);
  text-transform: uppercase;
  letter-spacing: 0.12em;
  font-weight: 600;
  margin-bottom: 10px;
}

.ls-title {
  font-family: var(--font-serif);
  font-size: clamp(24px, 3.5vw, 38px);
  font-weight: 700;
  color: var(--ink);
  letter-spacing: -0.02em;
  line-height: 1.15;
  margin-bottom: 28px;
}

/* ── Citação ────────────────────────────── */
.ls-quote {
  margin: 0 0 40px;
  padding: 20px 24px;
  border-left: 4px solid var(--ls-color);
  background: color-mix(in srgb, var(--ls-color) 6%, var(--cream));
  border-radius: 0 var(--radius-lg) var(--radius-lg) 0;
}

.ls-quote p {
  font-family: var(--font-serif);
  font-size: 20px;
  font-style: italic;
  color: var(--ink);
  line-height: 1.5;
}

/* ── Seções ─────────────────────────────── */
.ls-section {
  margin-bottom: 40px;
}

.section-label {
  font-size: 11px;
  font-weight: 700;
  color: var(--ls-color);
  text-transform: uppercase;
  letter-spacing: 0.14em;
  margin-bottom: 14px;
  padding-bottom: 8px;
  border-bottom: 1px solid color-mix(in srgb, var(--ls-color) 20%, var(--border));
}

.ls-summary {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.ls-summary p {
  font-size: 17px;
  line-height: 1.85;
  color: var(--ink-soft);
}

/* ── Ideias-chave ───────────────────────── */
.ideas-list {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.idea-item {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  font-size: 17px;
  color: var(--ink-soft);
  line-height: 1.85;
}

.idea-dot {
  color: var(--ink-faint);
  flex-shrink: 0;
  margin-top: 2px;
}

/* ── Insight ────────────────────────────── */
.ls-insight {
  display: flex;
  gap: 16px;
  background: color-mix(in srgb, var(--ls-color) 5%, var(--cream-dark));
  border: 1px solid color-mix(in srgb, var(--ls-color) 22%, var(--border));
  border-radius: var(--radius-lg);
  padding: 20px 22px;
}

.insight-icon {
  font-size: 20px;
  color: var(--ls-color);
  flex-shrink: 0;
  margin-top: 2px;
}

.ls-insight p {
  font-size: 16px;
  line-height: 1.8;
  color: var(--ink-soft);
  font-style: italic;
}

/* ── Navegação inferior ─────────────────── */
.ls-footer-nav {
  display: flex;
  justify-content: space-between;
  gap: 16px;
  margin-top: 48px;
  padding-top: 32px;
  border-top: 1px solid var(--border);
}

.footer-nav-btn {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px 18px;
  border-radius: var(--radius);
  border: 1px solid var(--border);
  background: white;
  cursor: pointer;
  transition: background var(--transition), border-color var(--transition), box-shadow var(--transition);
  max-width: 48%;
  text-align: left;
  color: var(--ink-light);
}

.footer-nav-btn:hover {
  background: var(--cream-dark);
  border-color: var(--ls-color);
  box-shadow: 0 2px 12px var(--shadow);
  color: var(--ink);
}

.footer-nav-btn--right {
  margin-left: auto;
}

.footer-nav-info {
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
}

.footer-nav-info--right {
  text-align: right;
}

.footer-nav-label {
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--ink-faint);
}

.footer-nav-title {
  font-size: 14px;
  font-weight: 500;
  color: var(--ink);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* ── Responsive ─────────────────────────── */
@media (max-width: 700px) {
  .lesson-panel {
    padding: 24px 20px 60px;
  }

  .ls-title {
    font-size: 24px;
  }

  .ls-quote p {
    font-size: 17px;
  }

  .ls-summary {
    font-size: 15px;
  }

  .idea-item {
    font-size: 15px;
  }

  .footer-nav-btn {
    padding: 10px 12px;
  }
}
</style>
