import { ICONS_PATH } from "../constants.js";
import { AnarchyBaseItem } from "./anarchy-base-item.js";

export class GearItem extends AnarchyBaseItem {

  get defaultIcon() {
    return `${ICONS_PATH}/gear/gear.svg`;
  }

}