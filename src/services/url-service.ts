const HttpProtocols = ['http:', 'https:']

class UrlService {
  public getDomain(url: URL): string {
    return url.hostname
  }

  public getPage(url: URL): string {
    return url.href.replace(/#.*$/g, '')
  }

  public isHttpProtcol(url: URL): boolean {
    return HttpProtocols.some(x => x === url.protocol)
  }
}

export const urlService = new UrlService()
