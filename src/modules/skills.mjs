import { ANARCHY } from "./config.mjs";
import { ANARCHY_SYSTEM, ICONS_SKILLS_PATH, ANARCHY_ID, SYSTEM_PATH, TEMPLATE } from "./constants.mjs";
import { ANARCHY_HACK } from "./hacks-manager.mjs";
import { Misc } from "./misc.mjs";

const SELECTED_SKILL_LIST = "selected-skill-list"

const ATTR = TEMPLATE.attributes;
const DEFENSE = ANARCHY_SYSTEM.defenses;

const KNOWLEDGE = { code: 'knowledge', attribute: ATTR.knowledge, icon: `${ICONS_SKILLS_PATH}/knowledge.svg` };

export const ANARCHY_SKILLS = [
  { code: 'athletics', attribute: ATTR.strength, icon: `${ICONS_SKILLS_PATH}/athletics.svg` },
  { code: 'acrobatics', attribute: ATTR.agility, icon: `${ICONS_SKILLS_PATH}/escape-artist.svg`, lang: 'fr' },
  { code: 'closeCombat', attribute: ATTR.agility, icon: `${ICONS_SKILLS_PATH}/close-combat.svg`, defense: DEFENSE.physicalDefense },
  { code: 'projectileWeapons', attribute: ATTR.agility, icon: `${ICONS_SKILLS_PATH}/projectile-weapons.svg`, defense: DEFENSE.physicalDefense },
  { code: 'firearms', attribute: ATTR.agility, icon: `${ICONS_SKILLS_PATH}/firearms.svg`, defense: DEFENSE.physicalDefense },
  { code: 'heavyWeapons', attribute: ATTR.agility, icon: `${ICONS_SKILLS_PATH}/heavy-weapons.svg`, defense: DEFENSE.physicalDefense },
  { code: 'vehicleWeapons', attribute: ATTR.agility, icon: `${ICONS_SKILLS_PATH}/vehicle-weapons.svg`, defense: DEFENSE.physicalDefense },
  { code: 'stealth', attribute: ATTR.agility, icon: `${ICONS_SKILLS_PATH}/stealth.svg` },
  { code: 'pilotingGround', attribute: ATTR.agility, icon: `${ICONS_SKILLS_PATH}/piloting-ground-steering-wheel.svg` },
  { code: 'pilotingOther', attribute: ATTR.agility, icon: `${ICONS_SKILLS_PATH}/piloting-other.svg` },
  { code: 'escapeArtist', attribute: ATTR.agility, icon: `${ICONS_SKILLS_PATH}/escape-artist.svg`, lang: 'en' },
  { code: 'conjuring', attribute: ATTR.willpower, hasDrain: true, icon: `${ICONS_SKILLS_PATH}/conjuring.svg` },
  { code: 'sorcery', attribute: ATTR.willpower, hasDrain: true, icon: `${ICONS_SKILLS_PATH}/sorcery.svg` },
  { code: 'astralCombat', attribute: ATTR.willpower, icon: `${ICONS_SKILLS_PATH}/astral-combat.svg`, defense: DEFENSE.astralDefense },
  { code: 'survival', attribute: ATTR.willpower, icon: `${ICONS_SKILLS_PATH}/survival.svg` },
  { code: 'biotech', attribute: ATTR.logic, icon: `${ICONS_SKILLS_PATH}/biotech.svg` },
  { code: 'hacking', attribute: ATTR.logic, hasConvergence: true, icon: `${ICONS_SKILLS_PATH}/hacking.svg`, defense: DEFENSE.matrixDefense },
  { code: 'electronics', attribute: ATTR.logic, icon: `${ICONS_SKILLS_PATH}/electronics.svg` },
  { code: 'engineering', attribute: ATTR.logic, icon: `${ICONS_SKILLS_PATH}/engineering.svg` },
  { code: 'tasking', attribute: ATTR.logic, hasDrain: true, icon: `${ICONS_SKILLS_PATH}/tasking.svg` },
  { code: 'tracking', attribute: ATTR.logic, icon: `${ICONS_SKILLS_PATH}/tracking.svg` },
  { code: 'animals', attribute: ATTR.charisma, icon: `${ICONS_SKILLS_PATH}/animals.svg`, lang: 'fr' },
  { code: 'con', attribute: ATTR.charisma, isSocial: true, icon: `${ICONS_SKILLS_PATH}/con-art.svg` },
  { code: 'etiquette', attribute: ATTR.charisma, isSocial: true, icon: `${ICONS_SKILLS_PATH}/etiquette.svg`, lang: 'fr' },
  { code: 'intimidation', attribute: ATTR.charisma, isSocial: true, icon: `${ICONS_SKILLS_PATH}/intimidation.svg` },
  { code: 'negotiation', attribute: ATTR.charisma, isSocial: true, icon: `${ICONS_SKILLS_PATH}/negotiation.svg` },
  { code: 'disguise', attribute: ATTR.charisma, icon: `${ICONS_SKILLS_PATH}/disguise.svg`, lang: 'en' },
]
export const MATRIX_SKILLS = ['tasking', 'hacking']

export class Skills {

  constructor() {
    Hooks.on('updateSetting', async (setting, update, options, id) => this.onUpdateSetting(setting, update, options, id));
    Hooks.once('ready', () => this.onReady());
  }

  async onReady() {
    this.#prepareSkill(KNOWLEDGE)
    this.#prepareSkillSets();
    this.#applySelectedSkillSet()
  }

  #prepareSkillSets() {
  }

  #applySelectedSkillSet() {
    this.selectedSkills = game.settings.get(ANARCHY_ID, SELECTED_SKILL_LIST)
    this.skillSet = game.system.anarchy.hacks.getSkillSet(this.selectedSkills)
    this.$prepareSkillSet(this.skillSet.id, this.skillSet.name, this.skillSet.skills, this.skillSet.options)
  }

  async onUpdateSetting(setting, update, options, id) {
    if (setting.namespace == ANARCHY_SYSTEM && setting.key == SELECTED_SKILL_LIST) {
      this.#applySelectedSkillSet()
    }
    if (setting.namespace == ANARCHY_SYSTEM && setting.key == ANARCHY_HACK) {
      this.#prepareSkillSets()
      this.#applySelectedSkillSet()
    }
  }

  get(code) {
    return this.getSkills({ withKnowledge: true }).find(it => it.code == code);
  }

  getSkills(options = { withKnowledge: false }) {
    const skills = this.$getConfiguredSkills().sort(Misc.ascending(it => it.label))
    if (options.withKnowledge) {
      return [KNOWLEDGE, ...skills]
    }
    return skills
  }

  $getConfiguredSkills() {
    return this.skillSet.skills;
  }

  $prepareSkillSet(id, name, skills, details) {
    const skillSet = foundry.utils.mergeObject({ id: id, name: name, skills: skills }, details);
    if (!this.$validateSkillSet(skillSet)) {
      return undefined;
    }
    skillSet.skills.forEach(skill => {
      this.#prepareSkill(skill);
    });
    return skillSet;
  }

  #prepareSkill(skill) {
    skill.labelkey = skill.labelkey ?? ANARCHY.skill[skill.code];
    skill.icon = skill.icon ?? `${SYSTEM_PATH}/icons/skills/skills.svg`;
  }

  $validateSkillSet(skillSet) {
    function check(check, error = '') { if (!check) { throw error; } }

    try {
      check(skillSet.id && skillSet.name, `Skills list does not have an id or name`);
      check(Array.isArray(skillSet.skills), `Missing skills array`);
      skillSet.skills.forEach(skill => {
        check(skill.code, `Missing skill code for ${skill} in ${skillSet.id}`);
        check(skill.labelkey || ANARCHY.skill[skill.code], `Missing skill localization key for ${skill.code}`);
        check(skill.attribute, `Missing skill attribute for ${skill.code}`);
      });
      const skillCodes = skillSet.skills.map(it => it.code);
      check(skillSet.skills.length == Misc.distinct(skillCodes).length, `Duplicate skill codes in ${skillCodes}`)
      return true;
    }
    catch (error) {
      console.warn(error + (skillSet.id ? ` in list ${skillSet.id}` : ' in unidentified list'), skillSet);
      return false;
    }
  }

}