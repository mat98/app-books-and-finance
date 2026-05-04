<template>
  <div class="app">
    <AppHeader
      v-if="activeConteudo"
      :show-search="showSearch"
      :search-query="searchQuery"
      :menu-open="menuOpen"
      @toggle-search="toggleSearch"
      @search="handleSearch"
      @toggle-menu="menuOpen = !menuOpen"
    />

    <!-- Hub inicial -->
    <Transition name="fade" mode="out-in">
      <section v-if="!activeConteudo" key="hub" class="hub">
        <div class="hub-cards">
          <button
            v-for="c in conteudos"
            :key="c.id"
            class="hub-card"
            :style="{ '--card-color': c.color }"
            @click="selecionarConteudo(c.id)"
          >
            <span class="hub-card__ornament">{{ c.icon }}</span>
            <h2 class="hub-card__title">{{ c.title }}</h2>
            <p class="hub-card__subtitle">{{ c.subtitle }}</p>
            <blockquote class="hub-card__quote">{{ c.quote }}</blockquote>
            <span class="hub-card__cta">
              Acessar conteúdo
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="5" y1="12" x2="19" y2="12"/>
                <polyline points="12,5 19,12 12,19"/>
              </svg>
            </span>
          </button>
        </div>
      </section>

      <main v-else key="content" class="layout">
        <!-- Overlay -->
        <Transition name="overlay">
          <div v-if="menuOpen" class="sidebar-overlay" @click="menuOpen = false" />
        </Transition>

        <!-- Sidebar -->
        <aside class="sidebar" :class="{ 'sidebar--open': menuOpen }">
          <section class="hero">
            <button class="hero-back" @click="voltarHub" title="Voltar aos conteúdos">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="15,18 9,12 15,6"/>
              </svg>
              <span>Conteúdos</span>
            </button>
            <div class="hero-ornament">{{ activeConteudo.icon }}</div>
            <h1 class="hero-title">{{ activeConteudo.title }}</h1>
            <p class="hero-subtitle">{{ activeConteudo.subtitle }}</p>
          </section>

          <Transition name="search-slide">
            <div v-if="showSearch" class="sidebar-search">
              <p v-if="searchResults.length" class="search-count">
                {{ searchResults.length }} resultado{{ searchResults.length !== 1 ? 's' : '' }}
              </p>
              <p v-else-if="searchQuery" class="search-count empty">Nenhum resultado</p>
            </div>
          </Transition>

          <nav class="toc">
            <template v-for="mod in activeConteudo.data.modules" :key="mod.id">
              <div
                v-if="!showSearch || moduleHasResults(mod)"
                class="toc-module"
                :style="{ '--mod-color': mod.color }"
              >
                <div class="toc-module-header">
                  <span class="toc-module-icon">{{ mod.icon }}</span>
                  <span class="toc-module-title">{{ mod.title }}</span>
                </div>

                <button
                  v-for="lesson in visibleLessons(mod)"
                  :key="lesson.id"
                  class="toc-lesson"
                  :class="{ active: activeLessonId === lesson.id }"
                  @click="setActive(lesson.id); menuOpen = false"
                >
                  <span class="toc-title" v-html="highlightText(lesson.title)"></span>
                  <span v-if="lesson.source" class="toc-source">{{ lesson.source }}</span>
                </button>
              </div>
            </template>
          </nav>
        </aside>

        <!-- Painel de conteúdo -->
        <section class="content-panel">
          <Transition name="fade" mode="out-in">
            <div v-if="activeLessonId === null" key="welcome" class="welcome-panel">
              <span class="welcome-ornament">{{ activeConteudo.icon }}</span>
              <h2 class="welcome-title">{{ activeConteudo.title }}</h2>
              <p class="welcome-author">{{ activeConteudo.subtitle }}</p>
              <blockquote class="welcome-quote">{{ activeConteudo.data.quote }}</blockquote>
              <p class="welcome-desc">{{ activeConteudo.data.description }}</p>
              <p class="welcome-hint">Abra o menu e selecione uma aula para começar.</p>
            </div>

            <LessonPanel
              v-else
              :key="activeLessonId"
              :lesson-id="activeLessonId"
              :lessons="activeLessons"
              :modules="activeConteudo.data.modules"
              @prev="goToPrev"
              @next="goToNext"
            />
          </Transition>
        </section>
      </main>
    </Transition>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import AppHeader from './components/AppHeader.vue'
import LessonPanel from './components/LessonPanel.vue'
import { conteudos } from './data/conteudos.js'

const activeConteudoId = ref(null)
const activeLessonId = ref(null)
const showSearch = ref(false)
const searchQuery = ref('')
const menuOpen = ref(false)

const activeConteudo = computed(() =>
  conteudos.find((c) => c.id === activeConteudoId.value) || null
)

const activeLessons = computed(() => {
  if (!activeConteudo.value) return []
  return activeConteudo.value.data.modules.flatMap((m) => m.lessons)
})

const searchResults = computed(() => {
  const q = searchQuery.value.toLowerCase().trim()
  if (!q) return []
  return activeLessons.value.filter(
    (l) =>
      l.title.toLowerCase().includes(q) ||
      l.summary.toLowerCase().includes(q) ||
      l.quote.toLowerCase().includes(q) ||
      l.keyIdeas.some((i) => i.toLowerCase().includes(q)) ||
      (l.insight && l.insight.toLowerCase().includes(q))
  )
})

function moduleHasResults(mod) {
  return mod.lessons.some((l) => searchResults.value.find((r) => r.id === l.id))
}

function visibleLessons(mod) {
  if (!showSearch.value || !searchQuery.value) return mod.lessons
  return mod.lessons.filter((l) => searchResults.value.find((r) => r.id === l.id))
}

function highlightText(text) {
  const q = searchQuery.value.trim()
  if (!q || !showSearch.value) return text
  const escaped = q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  return text.replace(new RegExp(`(${escaped})`, 'gi'), '<mark>$1</mark>')
}

function selecionarConteudo(id) {
  activeConteudoId.value = id
  activeLessonId.value = null
  menuOpen.value = true
}

function voltarHub() {
  activeConteudoId.value = null
  activeLessonId.value = null
  menuOpen.value = false
  showSearch.value = false
  searchQuery.value = ''
}

function setActive(id) {
  activeLessonId.value = id
}

function goToPrev() {
  const idx = activeLessons.value.findIndex((l) => l.id === activeLessonId.value)
  if (idx > 0) activeLessonId.value = activeLessons.value[idx - 1].id
}

function goToNext() {
  const idx = activeLessons.value.findIndex((l) => l.id === activeLessonId.value)
  if (idx < activeLessons.value.length - 1) activeLessonId.value = activeLessons.value[idx + 1].id
}

function toggleSearch() {
  showSearch.value = !showSearch.value
  if (!showSearch.value) searchQuery.value = ''
}

function handleSearch(q) {
  searchQuery.value = q
}
</script>

<style scoped>
.app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.layout {
  flex: 1;
  display: grid;
  grid-template-columns: 1fr;
  min-height: calc(100vh - 60px);
}

/* ── Sidebar ────────────────────────────── */
.sidebar {
  position: fixed;
  top: 0;
  left: 0;
  height: 100vh;
  width: 280px;
  z-index: 200;
  overflow-y: auto;
  background: var(--cream);
  border-right: 1px solid var(--border);
  box-shadow: 4px 0 24px rgba(0, 0, 0, 0.12);
  transform: translateX(-100%);
  transition: transform 260ms cubic-bezier(0.4, 0, 0.2, 1);
}

.sidebar--open {
  transform: translateX(0);
}

.hero {
  padding: 16px 20px 20px;
  border-bottom: 1px solid var(--border);
  text-align: center;
  position: relative;
}

.hero-back {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 10px;
  margin-bottom: 14px;
  border-radius: var(--radius-sm);
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: var(--ink-light);
  cursor: pointer;
  transition: background var(--transition), color var(--transition);
}

.hero-back:hover {
  background: var(--cream-dark);
  color: var(--ink);
}

.hero-ornament {
  font-size: 26px;
  color: var(--accent);
  display: block;
  margin-bottom: 8px;
}

.hero-title {
  font-family: var(--font-serif);
  font-size: 20px;
  font-weight: 700;
  color: var(--ink);
  letter-spacing: -0.01em;
}

.hero-subtitle {
  font-family: var(--font-serif);
  font-style: italic;
  font-size: 12px;
  color: var(--ink-light);
  margin-top: 4px;
}

/* ── Search feedback ────────────────────── */
.sidebar-search {
  padding: 8px 20px;
  border-bottom: 1px solid var(--border);
}

.search-count {
  font-size: 12px;
  color: var(--accent);
  font-weight: 500;
}

.search-count.empty {
  color: var(--ink-faint);
}

.search-slide-enter-active,
.search-slide-leave-active {
  transition: opacity 200ms, max-height 200ms;
  overflow: hidden;
  max-height: 40px;
}

.search-slide-enter-from,
.search-slide-leave-to {
  opacity: 0;
  max-height: 0;
}

/* ── TOC ────────────────────────────────── */
.toc {
  padding: 12px 0 40px;
}

.toc-module {
  margin-bottom: 4px;
}

.toc-module-header {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px 6px;
}

.toc-module-icon {
  font-size: 13px;
  color: var(--mod-color);
}

.toc-module-title {
  font-size: 10px;
  font-weight: 700;
  color: var(--mod-color);
  text-transform: uppercase;
  letter-spacing: 0.11em;
}

.toc-lesson {
  display: flex;
  align-items: baseline;
  gap: 10px;
  width: 100%;
  padding: 9px 20px;
  text-align: left;
  cursor: pointer;
  transition: background var(--transition);
  border-left: 2px solid transparent;
}

.toc-lesson:hover {
  background: var(--cream-dark);
}

.toc-lesson.active {
  background: color-mix(in srgb, var(--mod-color) 14%, var(--cream-dark));
  border-left-color: var(--mod-color);
}

.toc-title {
  font-size: 13px;
  font-weight: 500;
  color: var(--ink);
  line-height: 1.4;
}

.toc-lesson.active .toc-title {
  color: var(--mod-color);
  font-weight: 600;
}

.toc-source {
  font-size: 9px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--ink-faint);
  background: var(--cream-darker);
  border-radius: 10px;
  padding: 2px 7px;
  flex-shrink: 0;
  margin-left: auto;
}

:deep(mark) {
  background: var(--accent-muted);
  color: var(--ink);
  border-radius: 2px;
  padding: 0 1px;
}

/* ── Content panel ──────────────────────── */
.content-panel {
  overflow-y: auto;
  height: calc(100vh - 60px);
  position: sticky;
  top: 60px;
  background: var(--cream);
}

/* ── Welcome ────────────────────────────── */
.welcome-panel {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 70vh;
  padding: 60px 48px;
  text-align: center;
  max-width: 640px;
  margin: 0 auto;
}

.welcome-ornament {
  font-size: 52px;
  color: var(--accent);
  margin-bottom: 20px;
  display: block;
}

.welcome-title {
  font-family: var(--font-serif);
  font-size: 40px;
  font-weight: 700;
  color: var(--ink);
  letter-spacing: -0.02em;
  margin-bottom: 6px;
}

.welcome-author {
  font-size: 14px;
  color: var(--ink-faint);
  text-transform: uppercase;
  letter-spacing: 0.1em;
  margin-bottom: 28px;
}

.welcome-quote {
  font-family: var(--font-serif);
  font-size: 20px;
  font-style: italic;
  color: var(--accent);
  border-left: 3px solid var(--accent);
  padding: 10px 0 10px 22px;
  text-align: left;
  margin: 0 auto 28px;
  max-width: 440px;
}

.welcome-desc {
  font-size: 16px;
  color: var(--ink-light);
  line-height: 1.8;
  margin-bottom: 20px;
}

.welcome-hint {
  font-size: 13px;
  color: var(--ink-faint);
  font-style: italic;
}

/* ── Hub ────────────────────────────────── */
.hub {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px 24px;
  background: var(--cream);
}

.hub-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 20px;
  width: 100%;
  max-width: 960px;
}

.hub-card {
  --card-color: var(--accent);
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 10px;
  padding: 32px 28px 26px;
  background: var(--cream-dark);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  text-align: left;
  cursor: pointer;
  overflow: hidden;
  transition: transform 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease;
}

.hub-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: var(--card-color);
}

.hub-card:hover {
  transform: translateY(-3px);
  border-color: var(--card-color);
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.4);
}

.hub-card__ornament {
  font-size: 32px;
  color: var(--card-color);
  line-height: 1;
  margin-bottom: 4px;
}

.hub-card__title {
  font-family: var(--font-serif);
  font-size: 26px;
  font-weight: 700;
  color: var(--ink);
  letter-spacing: -0.01em;
  line-height: 1.15;
}

.hub-card__subtitle {
  font-size: 11px;
  font-weight: 700;
  color: var(--card-color);
  text-transform: uppercase;
  letter-spacing: 0.12em;
}

.hub-card__quote {
  font-family: var(--font-serif);
  font-style: italic;
  font-size: 15px;
  color: var(--ink-soft);
  line-height: 1.55;
  border-left: 2px solid var(--card-color);
  padding: 6px 0 6px 14px;
  margin: 8px 0 4px;
}

.hub-card__cta {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  margin-top: 8px;
  font-size: 12px;
  font-weight: 700;
  color: var(--card-color);
  letter-spacing: 0.04em;
  text-transform: uppercase;
}

/* ── Transitions ────────────────────────── */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 180ms ease, transform 180ms ease;
}

.fade-enter-from {
  opacity: 0;
  transform: translateY(8px);
}

.fade-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}

/* ── Overlay ────────────────────────────── */
.sidebar-overlay {
  position: fixed;
  inset: 0;
  z-index: 150;
  background: rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(2px);
}

.overlay-enter-active,
.overlay-leave-active {
  transition: opacity 220ms ease;
}
.overlay-enter-from,
.overlay-leave-to {
  opacity: 0;
}

/* ── Responsive ─────────────────────────── */
@media (max-width: 700px) {
  .content-panel {
    position: static;
    height: auto;
    min-height: calc(100vh - 60px);
  }

  .welcome-panel {
    padding: 40px 24px;
  }

  .welcome-title {
    font-size: 28px;
  }
}
</style>
