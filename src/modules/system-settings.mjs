import { ANARCHY_ID } from "./constants.mjs";


export class SystemSettings {

  static getSystemProperty(property, fallback) {
    let value = game.settings.get(ANARCHY_ID, property) ?? fallback;
    game.settings.set(ANARCHY_ID, property, value);
    return value;
  }

}