import { ICONS_PATH } from "../constants.mjs";
import { AnarchyBaseItem } from "./anarchy-base-item.mjs";

export class QualityItem extends AnarchyBaseItem {

  static get defaultIcon() {
    return `${ICONS_PATH}/quality-positive.svg`;
  }


}