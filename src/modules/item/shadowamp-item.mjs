import { ICONS_PATH } from "../constants.mjs";
import { AnarchyBaseItem } from "./anarchy-base-item.mjs";

export class ShadowampItem extends AnarchyBaseItem {

  static get defaultIcon() {
    return `${ICONS_PATH}/shadowamps/other.svg`;
  }

}