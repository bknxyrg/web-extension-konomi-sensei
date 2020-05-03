import Vue from 'vue'
import { Store } from '@/plugins/store'

declare module 'vue/types/vue' {
  interface Vue {
    $store: Store
  }
}
