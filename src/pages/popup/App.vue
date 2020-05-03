<template>
  <v-app>
    <router-view />
  </v-app>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'

@Component
export default class PopupPage extends Vue {
  private created() {
    this.$router.push('/popup')
  }
}
</script>

<style lang="scss">
.v-application--wrap {
  min-height: inherit !important;
}
</style>
