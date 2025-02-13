import { TEMPLATES_PATH } from "../constants.mjs";
import { CharacterBaseSheet } from "./character-base-sheet.mjs";

export class CharacterActorSheet extends CharacterBaseSheet {

  get template() {
    return `${TEMPLATES_PATH}/actor/character.hbs`;
  }

  /** @override */
  static get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      width: 720,
      height: 700,
    });
  }

}