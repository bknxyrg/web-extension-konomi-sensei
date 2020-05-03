import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  // options root
  {
    path: '/options',
    component: () => import('@/views/OptionsView.vue')
  },
  // popup root
  {
    path: '/popup',
    component: () => import('@/views/PopupView.vue')
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
