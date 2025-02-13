import { ICONS_PATH } from "../constants.mjs";
import { AnarchyBaseItem } from "./anarchy-base-item.mjs";

export class MetatypeItem extends AnarchyBaseItem {

  static get defaultIcon() {
    return `${ICONS_PATH}/vitruvian-man.svg`;
  }

  async onCreateItem(options, id) {
    this.parent?.removeOtherMetatype(this);
  }
}