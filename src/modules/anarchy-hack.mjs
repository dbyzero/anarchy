import { CharacterActorEssence } from "./actor/character-actor-essence.mjs"
import { DEFAULT_CHECKBARS } from "./common/checkbars.mjs"
import { ANARCHY_ID } from "./constants.mjs"
import { Migrations } from "./migrations.mjs"
import { ANARCHY_SKILLS} from "./skills.mjs"

export const DEFAULT_SKILLSET_ANARCHY = 'shadowrun-anarchy-en';
export const DEFAULT_SKILLSET_ANARCHY_FR = 'shadowrun-anarchy-fr';

export const CSS_DEFAULT = 'style-anarchy-shadowrun'
export const CSS_DARK = 'style-dark'
export const CSS_DARKGLASS ='style-darkglass'

export class BaseAnarchyHack {
  get id() { return undefined }
  get name() { return 'Undefined' }
  get checkbars() { return DEFAULT_CHECKBARS }
  get baseEssence() { return actor => 6 }
  get malusEssence() { return (actor, essence) => 0 }
  getMigrations() { return [] }
  getSkillSets() { return [] }
  getStyles() { return [CSS_DEFAULT]}
}

export class ShadowrunAnarchy extends BaseAnarchyHack {
  get id() { return ANARCHY_ID }
  get name() { return 'Shadowrun Anarchy' }
  get checkbars() { return DEFAULT_CHECKBARS }
  get baseEssence() { return actor => 6 }
  get malusEssence() { return (actor, essence) => CharacterActorEssence.getMalus(actor, essence) }
  getMigrations() {
    return Migrations.listSystemMigrations()
  }
  getSkillSets() {
    return [
      {
        id: DEFAULT_SKILLSET_ANARCHY,
        name: 'Shadowrun Anarchy EN',
        skills: ANARCHY_SKILLS.filter(it => !it.lang || it.lang == 'en'),
        options: { lang: 'en' }
      },
      {
        id: DEFAULT_SKILLSET_ANARCHY_FR,
        name: 'Shadowrun Anarchy FR',
        skills: ANARCHY_SKILLS.filter(it => !it.lang || it.lang == 'fr'),
        options: { lang: 'fr' }
      }
    ]
  }
  getStyles() { return [CSS_DEFAULT, CSS_DARK, CSS_DARKGLASS]}
}