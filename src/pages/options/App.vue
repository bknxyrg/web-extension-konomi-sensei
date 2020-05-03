<template>
  <v-app>
    <router-view />
  </v-app>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'

@Component
export default class OptionsPage extends Vue {
  private created() {
    this.$router.push('/options')
  }
}
</script>
