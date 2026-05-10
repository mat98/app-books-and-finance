import { createRouter, createWebHistory } from 'vue-router'
import HomeView from './views/HomeView.vue'
import ConteudoListView from './views/ConteudoListView.vue'
import ConteudoView from './views/ConteudoView.vue'

const routes = [
    { path: '/', name: 'home', component: HomeView },
    { path: '/:conteudo', name: 'conteudo-list', component: ConteudoListView },
    { path: '/:conteudo/:lessonId', name: 'conteudo-aula', component: ConteudoView },
]

const router = createRouter({
    history: createWebHistory(),
    routes,
    scrollBehavior() {
        return { top: 0 }
    },
})

export default router
