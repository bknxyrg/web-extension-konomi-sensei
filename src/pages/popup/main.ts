import Vue from 'vue'
import App from './App.vue'
import router from '@/plugins/router'
import store from '@/plugins/store'
import vuetify from '@/plugins/vuetify'

Vue.use(store)

new Vue({
  el: '#app',
  router,
  vuetify,
  render: h => h(App)
})
