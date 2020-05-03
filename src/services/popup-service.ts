import moment from 'moment'

class PopupService {
  public range(length: number): number[] {
    return [...Array(length).keys()]
  }

  public addListItem(list: string[], item: string): string[] {
    list.push(item)
    list.sort()

    return list
  }

  public getConcentrateTime(h: number, m: number, s: number): moment.Moment {
    return moment().add({ h, m, s })
  }

  public getRemainingTime(concentrateTime: moment.Moment): moment.Moment {
    const now = moment()
    const duration = moment.duration(concentrateTime.diff(now))

    now.set({
      h: duration.hours(),
      m: duration.minutes(),
      s: duration.seconds()
    })

    return now
  }

  public getLockIcon(lock: boolean): string {
    return `mdi-${lock ? 'lock' : 'lock-open'}`
  }
}

export const popupService = new PopupService()
