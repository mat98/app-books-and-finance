<template>
  <header class="app-header">
    <div class="header-inner">
      <div class="logo">
        <button class="hamburger" @click="emit('toggle-menu')" :class="{ open: menuOpen }" aria-label="Menu">
          <span /><span /><span />
        </button>
        <span class="logo-mark">◎</span>
        <div class="logo-text">
          <span class="logo-title">Finanças</span>
          <span class="logo-sub">Educação Financeira</span>
        </div>
      </div>

      <nav class="nav-actions">
        <button
          class="nav-btn"
          :class="{ active: showSearch }"
          @click="emit('toggle-search')"
          title="Buscar"
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="11" cy="11" r="8"/>
            <path d="m21 21-4.35-4.35"/>
          </svg>
          <span class="nav-btn-label">Buscar</span>
        </button>
      </nav>
    </div>

    <Transition name="search-bar">
      <div v-if="showSearch" class="search-bar">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="11" cy="11" r="8"/>
          <path d="m21 21-4.35-4.35"/>
        </svg>
        <input
          ref="searchInput"
          v-model="localQuery"
          type="text"
          placeholder="Buscar aulas, ideias, conceitos..."
          @input="emit('search', localQuery)"
          @keyup.escape="emit('toggle-search')"
        />
        <button v-if="localQuery" class="clear-btn" @click="clearSearch">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="18" y1="6" x2="6" y2="18"/>
            <line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        </button>
      </div>
    </Transition>
  </header>
</template>

<script setup>
import { ref, watch, nextTick } from 'vue'

const props = defineProps({
  showSearch: Boolean,
  searchQuery: String,
  menuOpen: Boolean,
})

const emit = defineEmits(['toggle-search', 'search', 'toggle-menu'])

const searchInput = ref(null)
const localQuery = ref(props.searchQuery || '')

watch(
  () => props.showSearch,
  async (val) => {
    if (val) {
      await nextTick()
      searchInput.value?.focus()
    } else {
      localQuery.value = ''
    }
  }
)

function clearSearch() {
  localQuery.value = ''
  emit('search', '')
  searchInput.value?.focus()
}
</script>

<style scoped>
.app-header {
  position: sticky;
  top: 0;
  z-index: 100;
  background: var(--cream);
  border-bottom: 1px solid var(--border);
}

.header-inner {
  max-width: 100%;
  padding: 0 24px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.logo {
  display: flex;
  align-items: center;
  gap: 10px;
}

/* ── Hamburguer ── */
.hamburger {
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 5px;
  width: 36px;
  height: 36px;
  padding: 6px;
  border-radius: var(--radius-sm);
  cursor: pointer;
  flex-shrink: 0;
  transition: background var(--transition);
}

.hamburger:hover {
  background: var(--cream-dark);
}

.hamburger span {
  display: block;
  height: 2px;
  background: var(--ink);
  border-radius: 2px;
  transition: transform 0.22s ease, opacity 0.22s ease, width 0.22s ease;
  transform-origin: center;
}

.hamburger.open span:nth-child(1) {
  transform: translateY(7px) rotate(45deg);
}
.hamburger.open span:nth-child(2) {
  opacity: 0;
  transform: scaleX(0);
}
.hamburger.open span:nth-child(3) {
  transform: translateY(-7px) rotate(-45deg);
}

.logo-mark {
  font-size: 22px;
  color: var(--accent);
  line-height: 1;
}

.logo-text {
  display: flex;
  flex-direction: column;
  gap: 1px;
}

.logo-title {
  font-family: var(--font-serif);
  font-size: 15px;
  font-weight: 700;
  color: var(--ink);
  line-height: 1.1;
  letter-spacing: 0.01em;
}

.logo-sub {
  font-size: 10px;
  color: var(--ink-faint);
  letter-spacing: 0.06em;
  text-transform: uppercase;
}

.nav-actions {
  display: flex;
  align-items: center;
  gap: 4px;
}

.nav-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  border-radius: var(--radius);
  font-size: 13px;
  font-weight: 500;
  color: var(--ink-soft);
  transition: background var(--transition), color var(--transition);
  cursor: pointer;
}

.nav-btn:hover {
  background: var(--cream-dark);
  color: var(--ink);
}

.nav-btn.active {
  background: var(--accent-bg);
  color: var(--accent);
}

.search-bar {
  padding: 0 24px 10px;
  display: flex;
  align-items: center;
  gap: 10px;
  color: var(--ink-faint);
}

.search-bar input {
  flex: 1;
  background: var(--cream-dark);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: 8px 12px;
  font-size: 14px;
  color: var(--ink);
  outline: none;
  transition: border-color var(--transition);
  max-width: 480px;
}

.search-bar input:focus {
  border-color: var(--accent);
  background: var(--cream);
}

.search-bar input::placeholder {
  color: var(--ink-faint);
}

.clear-btn {
  color: var(--ink-faint);
  padding: 4px;
  border-radius: var(--radius-sm);
  transition: color var(--transition);
  cursor: pointer;
}

.clear-btn:hover {
  color: var(--ink);
}

.search-bar-enter-active,
.search-bar-leave-active {
  transition: opacity 180ms ease, max-height 180ms ease;
  overflow: hidden;
  max-height: 50px;
}

.search-bar-enter-from,
.search-bar-leave-to {
  opacity: 0;
  max-height: 0;
}

/* ── Mobile ── */
@media (max-width: 700px) {
  .nav-btn-label {
    display: none;
  }

  .nav-btn {
    padding: 6px 8px;
  }
}
</style>
