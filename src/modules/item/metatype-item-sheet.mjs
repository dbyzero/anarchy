import { BaseItemSheet } from "./base-item-sheet.mjs";

export class MetatypeItemSheet extends BaseItemSheet {

  getData(options) {
    let hbsData = super.getData(options);
    return hbsData;
  }

  activateListeners(html) {
    super.activateListeners(html);
  }
}
