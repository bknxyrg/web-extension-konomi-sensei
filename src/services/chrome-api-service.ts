class ChromeApiService {
  public async getTab(tabId: number): Promise<chrome.tabs.Tab> {
    return new Promise(resolve => {
      chrome.tabs.get(tabId, tab => {
        resolve(tab)
      })
    })
  }

  public async getActiveTab(): Promise<chrome.tabs.Tab> {
    return new Promise(resolve => {
      const queryInfo = { active: true, lastFocusedWindow: true }
      chrome.tabs.query(queryInfo, tabs => {
        resolve(tabs[0])
      })
    })
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public async getLocalStorageItems(keys: string[]): Promise<any> {
    return new Promise(resolve => {
      chrome.storage.local.get(keys, items => {
        resolve(items)
      })
    })
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public async setLocalStorageItem(key: string, value: any): Promise<void> {
    if (value !== undefined) {
      chrome.storage.local.set({ [key]: value })
    } else {
      chrome.storage.local.remove(key)
    }
  }

  public openOptionsPage(): void {
    chrome.runtime.openOptionsPage()
  }

  public setIcon(fileName: string): void {
    chrome.browserAction.setIcon({ path: `icons/${fileName}` })
  }
}

export const chromeApiService = new ChromeApiService()
