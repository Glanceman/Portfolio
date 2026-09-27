import { createRouter, createWebHashHistory, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) return savedPosition
    return { top: 0, behavior: 'smooth' }
  },
  routes: [
    {
      path: '/',
      name: 'Home',
      meta: { label: 'Home', num: '01', kicker: 'Enter' },
      component: HomeView
    },
    {
      path: '/about',
      name: 'About',
      meta: { label: 'About', num: '02', kicker: 'Profile' },
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('@/views/AboutView.vue')
    },
    {
      path: '/project',
      name: 'Project',
      meta: { label: 'Projects', num: '03', kicker: 'Heists' },
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('@/views/ProjectView.vue')
    },
    {
      path: '/blog',
      name: 'Blog',
      meta: { label: 'Blog', num: '04', kicker: 'Notes' },
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('@/views/BlogView.vue')
    }
  ]
})

export default router
