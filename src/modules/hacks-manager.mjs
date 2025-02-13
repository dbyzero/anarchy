import { ShadowrunAnarchy, BaseAnarchyHack, DEFAULT_SKILLSET_ANARCHY } from "./anarchy-hack.mjs";
import { Checkbars } from "./common/checkbars.mjs";
import { ANARCHY } from "./config.mjs";
import { LOG_HEAD, ANARCHY_ID } from "./constants.mjs";

export const ANARCHY_HACK = 'anarchy-hack'
export const SELECTED_SKILL_LIST = "selected-skill-list"

export class HacksManager {
  constructor() {
    this.shadowrunAnarchy = new ShadowrunAnarchy()
    this.hacks = {}
    this.selectedHack = this.shadowrunAnarchy
    this.allSkillSets = {}
    this.register(this.shadowrunAnarchy)
    Hooks.once('ready', () => this.onReady())
  }

  async onReady() {
    const choices = Object.fromEntries(Object.values(this.hacks).map(h => [h.id, h.name]))
    game.settings.register(ANARCHY_ID, ANARCHY_HACK, {
      scope: "world",
      name: game.i18n.localize(ANARCHY.settings.anarchyHack.name),
      hint: game.i18n.localize(ANARCHY.settings.anarchyHack.hint),
      config: true,
      default: this.selectedHack.id,
      choices: choices,
      type: String
    })

    const skillSetChoices = Object.fromEntries(Object.values(this.allSkillSets).map(s => [s.id, s.name]))
    game.settings.register(ANARCHY_ID, SELECTED_SKILL_LIST, {
      scope: "world",
      name: game.i18n.localize(ANARCHY.settings.skillSet.name),
      hint: game.i18n.localize(ANARCHY.settings.skillSet.hint),
      config: true,
      default: DEFAULT_SKILLSET_ANARCHY,
      choices: skillSetChoices,
      // TODO: on hack change, skillset selection choices are not updated...
      type: String
    })

    this.#applySelectedHack()
  }

  register(hack) {
    if (!(hack instanceof BaseAnarchyHack)
      || hack.id == undefined) {
      console.error(LOG_HEAD + 'HacksManager.register | invalid hack', hack)
      return
    }
    if (this.hacks[hack.id]) {
      console.error(LOG_HEAD + `HacksManager.register | hack ${hack.id}already registered`, hack)
      return
    }
    this.hacks[hack.id] = hack
    Object.assign(this.allSkillSets, Object.fromEntries(hack.getSkillSets().map(it => [it.id, it])))
    Hooks.on('updateSetting', async (setting, update, options, id) => this.onUpdateSetting(setting, update, options, id));
  }

  getHack() { return this.selectedHack }

  getSkillSet(id) {
    return this.allSkillSets[id] ?? Object.values(this.allSkillSets).find(it => true)
  }

  async onUpdateSetting(setting, update, options, id) {
    if (setting.namespace == ANARCHY_ID && setting.key == ANARCHY_HACK) {
      this.#applySelectedHack()
    }
  }

  #applySelectedHack() {
    const hackId = game.settings.get(ANARCHY_ID, ANARCHY_HACK);
    this.selectedHack = this.hacks[hackId];
    Checkbars.hackCheckbars(this.selectedHack.checkbars)
  }

  baseEssence(actor) { return this.getHack().baseEssence(actor) }
  malusEssence(actor, essence) { return this.getHack().malusEssence(actor, essence) }
}