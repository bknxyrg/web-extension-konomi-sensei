import VueConstractor from 'vue'

import { chromeApiService } from '@/services/chrome-api-service'

class State {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any
  public concentrateTime?: number = undefined
  public blockedDomains: string = JSON.stringify([])
  public blockedPages: string = JSON.stringify([])
  public image?: string = undefined
}

export class Store {
  private state = VueConstractor.observable(new State())

  public constructor() {
    this.init()
  }

  private async init(): Promise<void> {
    const keys = Object.keys(this.state)
    const items = await chromeApiService.getLocalStorageItems(keys)
    Object.keys(items).forEach(key => {
      this.state[key] = items[key]
    })

    chrome.storage.onChanged.addListener(changes => {
      Object.keys(changes)
        .filter(key => this.state.hasOwnProperty(key))
        .forEach(key => {
          this.state[key] = changes[key].newValue
        })
    })
  }

  public get concentrateTime(): number | undefined {
    return this.state.concentrateTime
  }
  public set concentrateTime(value: number | undefined) {
    this.state.concentrateTime = value
    chromeApiService.setLocalStorageItem('concentrateTime', value)
  }
  public get blockedDomains(): string[] {
    return JSON.parse(this.state.blockedDomains)
  }
  public set blockedDomains(value: string[]) {
    this.state.blockedDomains = JSON.stringify(value)
    chromeApiService.setLocalStorageItem(
      'blockedDomains',
      this.state.blockedDomains
    )
  }
  public get blockedPages(): string[] {
    return JSON.parse(this.state.blockedPages) as string[]
  }
  public set blockedPages(value: string[]) {
    this.state.blockedPages = JSON.stringify(value)
    chromeApiService.setLocalStorageItem(
      'blockedPages',
      this.state.blockedPages
    )
  }
  public get image(): string | undefined {
    return this.state.image
  }
  public set image(value: string | undefined) {
    this.state.image = value
    chromeApiService.setLocalStorageItem('image', value)
  }
}

export default function(Vue: typeof VueConstractor): void {
  Vue.prototype.$store = new Store()
}
