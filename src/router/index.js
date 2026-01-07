import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import HistoryView from '../views/HistoryView.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView // 访问根路径时加载 CRUD 页面
    },
    {
      path: '/history',
      name: 'history',
      component: HistoryView // 访问 /history 时加载历史页面
    }
  ]
})

export default router