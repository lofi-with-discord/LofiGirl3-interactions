import path from 'path'
import { I18n } from 'i18n'
import { readdirSync } from 'fs'

const PATH = path.resolve()

export default class I18nParser extends I18n {
  constructor () {
    super()

    const directory = PATH + '/i18n'
    this.configure({
      directory,
      locales:
        readdirSync(directory)
          .filter((v) => v.endsWith('.json'))
          .map((v) => v.replace('.json', ''))
    })
  }
}
