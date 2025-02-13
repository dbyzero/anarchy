import { ICONS_PATH } from "../constants.mjs";
import { AnarchyBaseItem } from "./anarchy-base-item.mjs";

export class GearItem extends AnarchyBaseItem {

  static get defaultIcon() {
    return `${ICONS_PATH}/gear/gear.svg`;
  }

}