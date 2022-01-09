import { ANARCHY } from "./config.js";
import { HOOK_GET_HANDLEPAR_HELPERS } from "./handlebars-manager.js";
import { Misc } from "./misc.js";

const defaultSkillsAttribute = {
  athletics: 'strength',

  closeCombat: 'agility',
  projectileWeapons: 'agility',
  firearms: 'agility',
  heavyWeapons: 'agility',
  vehicleWeapons: 'agility',
  stealth: 'agility',
  pilotingGround: 'agility',
  pilotingOther: 'agility',
  escapeArtist: 'agility',

  conjuring: 'willpower',
  sorcery: 'willpower',
  astralCombat: 'willpower',
  survival: 'willpower',

  biotech: 'logic',
  hacking: 'logic',
  electronics: 'logic',
  engineering: 'logic',
  tracking: 'logic',
  tasking: 'logic',

  con: 'charisma',
  intimidation: 'charisma',
  negotiation: 'charisma',
  disguise: 'charisma',

  animals: 'charisma',
  etiquette: 'charisma',
};

const actorWordTypes = {
  keyword: "keywords",
  disposition: "dispositions",
  cue: "cues"
}

export class Enums {
  static ENUMS;
  static hbsSkills;
  static skillsAttribute;
  static hbsAttributes;
  static hbsItemTypes;
  static hbsCapacities;
  static hbsMonitors;
  static hbsMonitorLetters;
  static hbsShadowampCategories;
  static hbsAreas;
  static hbsRanges;

  static sortedAttributeKeys;

  // this method is the place to add settings-based entries in the enums
  static init() {
    // Customisation of skills will have to be done based on system settings
    Enums.skillsAttribute = defaultSkillsAttribute;
    Enums.hbsSkills = Enums.mapObjetToValueLabel(ANARCHY.skill);
    Enums.hbsAttributes = Enums.mapObjetToValueLabel(ANARCHY.attributes)
      .filter(a => a.value != 'knowledge' && a.value != 'noAttribute');
    Enums.hbsItemTypes = Enums.mapObjetToValueLabel(ANARCHY.itemType);
    Enums.hbsCapacities = Enums.mapObjetToValueLabel(ANARCHY.capacity);
    Enums.hbsMonitors = Enums.mapObjetToValueLabel(ANARCHY.monitor);
    Enums.hbsMonitorLetters = Enums.mapObjetToValueLabel(ANARCHY.monitorLetter);
    Enums.hbsShadowampCategories = Enums.mapObjetToValueLabel(ANARCHY.shadowampCategory);
    Enums.hbsAreas = Enums.mapObjetToValueLabel(ANARCHY.area);
    Enums.hbsRanges = Enums.mapObjetToValueLabel(ANARCHY.range);
    Enums.hbsVehicleCategories = Enums.mapObjetToValueLabel(ANARCHY.vehicleCategory);
    Enums.sortedAttributeKeys = Object.keys(ANARCHY.attributes);

    Hooks.once(HOOK_GET_HANDLEPAR_HELPERS, () => Enums.registerHandleBarHelpers());
  }

  static registerHandleBarHelpers() {
    Handlebars.registerHelper('sortedAttributes', map => Misc.sortedMap(map, Misc.ascendingBySortedArray(Enums.sortedAttributeKeys)));
  }

  static getEnums() {
    return {
      attributes: Enums.hbsAttributes,
      itemTypes: Enums.hbsItemTypes,
      capacities: Enums.hbsCapacities,
      monitors: Enums.hbsMonitors,
      shadowampCategories: Enums.hbsShadowampCategories,
      skills: Enums.hbsSkills,
      areas: Enums.hbsAreas,
      ranges: Enums.hbsRanges,
      vehicleCategories: Enums.hbsVehicleCategories
    };
  }

  static getActorWordTypes() {
    return actorWordTypes;
  }

  static getMonitors() {
    return Enums.hbsMonitors;
  }

  static getMonitorLetters() {
    return Enums.hbsMonitorLetters;
  }

  static getActorWordTypePlural(wordType) {
    return actorWordTypes[wordType];
  }

  static localizeAttribute(attribute) {
    if (!ANARCHY.attributes[attribute]) {
      return game.i18n.localize(ANARCHY.attributes['noAttribute']);
    }
    return game.i18n.localize(ANARCHY.attributes[attribute]);
  }

  static getSkillAttribute(code) {
    if (Enums.isDefaultSkill(code)) {
      return defaultSkillsAttribute[code];
    }
    return '';
  }

  static isDefaultSkill(code) {
    return code && defaultSkillsAttribute[code];
  }

  static getFromList(list, value, key = 'value', label = 'label') {
    const found = list.find(m => m[key] == value);
    return found ? found[label] : undefined
  }

  static mapObjetToValueLabel(object, value = 'value', label = 'label') {
    return Object.entries(object).map(
      entry => {
        const ret = {};
        ret[value] = entry[0];
        ret[label] = entry[1];
        return ret;
      });
  }

}

