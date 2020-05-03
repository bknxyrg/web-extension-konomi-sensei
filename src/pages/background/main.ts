import Vue from 'vue'
import App from './App.vue'
import store from '@/plugins/store'

Vue.use(store)

new Vue({
  el: '#app',
  render: h => h(App)
})
