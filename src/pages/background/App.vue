<template>
  <div />
</template>

<script lang="ts">
import moment from 'moment'

import { Component, Vue, Watch } from 'vue-property-decorator'
import { chromeApiService } from '@/services/chrome-api-service'
import { urlService } from '@/services/url-service'

@Component
export default class BackgroundPage extends Vue {
  hideTabIds = new Array<number>()
  now = moment()
  timer?: number

  get running(): boolean {
    return this.now.isBefore(this.concentrateTime)
  }
  get concentrateTime(): moment.Moment {
    return moment.unix(this.$store.concentrateTime ?? 0)
  }
  get blockedDomains(): string[] {
    return this.$store.blockedDomains
  }
  get blockedPages(): string[] {
    return this.$store.blockedPages
  }

  @Watch('running')
  runningChanged(running: boolean) {
    if (running) {
      this.startTimer()
    } else {
      this.endTimer()
    }
  }

  created() {
    if (this.running) {
      this.startTimer()
    }

    chrome.tabs.onActivated.addListener(async activeInfo => {
      const tab = await chromeApiService.getTab(activeInfo.tabId)
      this.switchTabContent(tab)
    })

    chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
      this.switchTabContent(tab)
    })

    chrome.runtime.onMessage.addListener(
      async (request, sender, sendResponse) => {
        const tab = await chromeApiService.getActiveTab()
        this.switchTabContent(tab)
      }
    )
  }

  beforeDestroy() {
    this.endTimer()
  }

  switchTabContent(tab: chrome.tabs.Tab): void {
    if (!tab.id || !tab.url || tab.status !== 'complete') {
      return
    }

    const url = new URL(tab.url)

    if (!urlService.isHttpProtcol(url)) {
      return
    }

    const tabId = tab.id
    const state = this.running && this.isBlock(url) ? 'hide' : 'show'
    const file = `content_scripts/${state}-tab-content.js`
    chrome.tabs.executeScript(tabId, { file: file })
  }

  async startTimer() {
    if (this.timer) return
    this.timer = setInterval(() => {
      this.now = moment()
    }, 1000)

    chromeApiService.setIcon('icon_on_x48.png')

    const tab = await chromeApiService.getActiveTab()
    this.switchTabContent(tab)
  }

  async endTimer() {
    if (!this.timer) return
    this.$store.concentrateTime = 0
    clearInterval(this.timer)
    this.timer = undefined

    const tab = await chromeApiService.getActiveTab()
    this.switchTabContent(tab)

    chromeApiService.setIcon('icon_off_x48.png')
  }

  isBlock(url: URL) {
    const domain = urlService.getDomain(url)
    const page = urlService.getPage(url)

    return (
      this.blockedDomains.some(x => x === domain) ||
      this.blockedPages.some(x => x === page)
    )
  }
}
</script>
