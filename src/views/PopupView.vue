<template>
  <v-card class="popup-view" width="300" :loading="running">
    <v-card-text>
      <section v-if="running">
        <v-row justify="center">
          <v-col class="headline" cols="auto">
            {{ remainingTime }}
          </v-col>
        </v-row>
      </section>
      <section v-if="!running">
        <v-row align="center" no-gutters>
          <v-col>
            <v-select
              v-model="hour"
              :items="hourItems"
              dense
              hide-details
              suffix="h"
              menu-props="auto"
            />
          </v-col>
          <v-col class="mx-2">
            <v-select
              v-model="minute"
              :items="minuteItems"
              dense
              hide-details
              suffix="m"
              menu-props="auto"
            />
          </v-col>
          <v-col>
            <v-select
              v-model="seconds"
              :items="secondsItems"
              dense
              hide-details
              suffix="s"
              menu-props="auto"
            />
          </v-col>
        </v-row>
        <v-row class="mt-2">
          <v-spacer />
          <v-btn text :disabled="disableStartButton" @click="timerStart">
            作業開始
          </v-btn>
        </v-row>
      </section>
      <!-- site info -->
      <section v-show="visibleSiteInfo" class="mt-2">
        <!-- domain -->
        <v-row no-gutters>
          <v-col>
            <v-text-field
              :value="domain"
              dense
              hide-details
              outlined
              readonly
            />
          </v-col>
        </v-row>
        <v-row justify="end" no-gutters>
          <v-btn
            text
            :class="{ 'red--text': isBlockedDomain }"
            @click="blockDomain"
          >
            サイトをブロック
            <v-icon>{{ iconBlockDomain }}</v-icon>
          </v-btn>
        </v-row>
        <!-- href -->
        <v-row class="pt-2" no-gutters>
          <v-col>
            <v-textarea
              :value="page"
              dense
              hide-details
              no-resize
              outlined
              readonly
              rows="4"
            />
          </v-col>
        </v-row>
        <v-row justify="end" no-gutters>
          <v-btn
            text
            :class="{ 'red--text': isBlockedPage }"
            @click="blockPage"
          >
            ページをブロック
            <v-icon>{{ iconBlockPage }}</v-icon>
          </v-btn>
        </v-row>
      </section>
    </v-card-text>

    <v-card-actions>
      <v-spacer />
      <v-btn icon @click="showOptionsPage">
        <v-icon>mdi-tune</v-icon>
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script lang="ts">
import moment from 'moment'

import { Component, Vue, Watch } from 'vue-property-decorator'

import { popupService } from '@/services/popup-service'
import { urlService } from '@/services/url-service'
import { chromeApiService } from '@/services/chrome-api-service'

@Component({})
export default class PopupView extends Vue {
  hour: number = 0
  minute: number = 0
  seconds: number = 0
  hourItems: number[] = []
  minuteItems: number[] = []
  secondsItems: number[] = []
  domain: string = ''
  page: string = ''
  isHttpProtcol: boolean = false
  remainingTime: string = ''
  timer?: number

  @Watch('running')
  runningChanged(running: boolean) {
    if (running) {
      this.startTimer()
    } else {
      this.endTimer()
    }
  }

  get running(): boolean {
    return moment().isBefore(this.concentrateTime)
  }
  get isBlockedDomain(): boolean {
    return this.blockedDomains.some(x => x === this.domain)
  }
  get isBlockedPage(): boolean {
    return this.blockedPages.some(x => x === this.page)
  }
  get concentrateTime(): moment.Moment {
    return moment.unix(this.$store.concentrateTime ?? 0)
  }
  set concentrateTime(value: moment.Moment) {
    this.$store.concentrateTime = value.unix()
  }
  set blockedDomains(value: string[]) {
    this.$store.blockedDomains = value
  }
  get blockedDomains(): string[] {
    return this.$store.blockedDomains
  }
  set blockedPages(value: string[]) {
    this.$store.blockedPages = value
  }
  get blockedPages(): string[] {
    return this.$store.blockedPages
  }
  get visibleSiteInfo(): boolean {
    return (
      this.isHttpProtcol &&
      (!this.running || (!this.isBlockedDomain && !this.isBlockedPage))
    )
  }
  get disableStartButton(): boolean {
    return this.hour === 0 && this.minute === 0 && this.seconds === 0
  }
  get iconBlockDomain(): string {
    return popupService.getLockIcon(this.isBlockedDomain)
  }
  get iconBlockPage(): string {
    return popupService.getLockIcon(this.isBlockedPage)
  }

  async created() {
    const tab = await chromeApiService.getActiveTab()
    if (!tab?.url) return

    const url = new URL(tab.url)
    const hourItems = popupService.range(24)
    const minuteItems = popupService.range(60)
    const secondsItems = popupService.range(60)

    this.domain = urlService.getDomain(url)
    this.page = urlService.getPage(url)
    this.isHttpProtcol = urlService.isHttpProtcol(url)
    this.hourItems = hourItems
    this.minuteItems = minuteItems
    this.secondsItems = secondsItems

    if (this.running) {
      this.startTimer()
    }
  }

  beforeDestroy() {
    this.endTimer()
  }

  timerStart(): void {
    this.concentrateTime = popupService.getConcentrateTime(
      this.hour,
      this.minute,
      this.seconds
    )
    this.hour = 0
    this.minute = 0
    this.seconds = 0
  }

  blockDomain(): void {
    const list = this.blockedDomains

    if (this.isBlockedDomain) {
      this.blockedDomains = list.filter(x => x !== this.domain)
    } else {
      this.blockedDomains = popupService.addListItem(list, this.domain)
      chrome.runtime.sendMessage('block')
    }
  }

  blockPage(): void {
    const list = this.blockedPages

    if (this.isBlockedPage) {
      this.blockedPages = list.filter(x => x !== this.page)
    } else {
      this.blockedPages = popupService.addListItem(list, this.page)
      chrome.runtime.sendMessage('block')
    }
  }

  showOptionsPage(): void {
    chromeApiService.openOptionsPage()
  }

  async startTimer() {
    if (this.timer) return
    this.refreshRemainingTime()
    this.timer = setInterval(this.refreshRemainingTime, 1000)
  }

  refreshRemainingTime(): void {
    const remainingTime = popupService.getRemainingTime(this.concentrateTime)
    this.remainingTime = remainingTime.format('稼働中: HH:mm:ss')
  }

  async endTimer() {
    if (!this.timer) return
    clearInterval(this.timer)
    this.timer = undefined
    this.remainingTime = ''
  }
}
</script>

<style lang="scss">
.popup-view {
  & .v-select__selections {
    display: flex;
    justify-content: center;

    & > input {
      display: none;
    }
  }
}
</style>
