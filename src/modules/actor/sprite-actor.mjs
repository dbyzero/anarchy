import { ICONS_PATH, TEMPLATE } from "../constants.mjs";
import { AnarchyBaseActor } from "./base-actor.mjs";

const SPRITE_ATTRIBUTES = [
  TEMPLATE.attributes.logic,
  TEMPLATE.attributes.edge,
]

export class SpriteActor extends AnarchyBaseActor {

  static get defaultIcon() {
    return `${ICONS_PATH}/misc/rss.svg`;
  }

  static get initiative() {
    return AnarchyBaseActor.initiative + " + @attributes.logic.value";
  }

  getMatrixDetails() {
    return {
      hasMatrix: true,
      logic: TEMPLATE.attributes.logic,
      firewall: TEMPLATE.attributes.logic,
      monitor: this.system.monitors.matrix,
      overflow: undefined,
    }
  }

  getAttributes() {
    return SPRITE_ATTRIBUTES
  }

  isEmerged() { return true }
}