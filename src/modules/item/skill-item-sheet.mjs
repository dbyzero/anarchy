import { BaseItemSheet } from "./base-item-sheet.mjs";
import { SkillItem } from "./skill-item.mjs";

export class SkillItemSheet extends BaseItemSheet {

  activateListeners(html) {
    super.activateListeners(html);

    html.find('.select-skill-code').change(async event => {
      const skillCode = event.currentTarget.value
      const updates = SkillItem.prepareSkill(skillCode)
      if (updates) {
        await this.object.update(updates)
      }
    })
  }
}
