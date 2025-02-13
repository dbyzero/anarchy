import { CSS_DARK, CSS_DARKGLASS, CSS_DEFAULT } from "./anarchy-hack.mjs";
import { ANARCHY } from "./config.mjs";
import { LOG_HEAD, ANARCHY_ID } from "./constants.mjs";
import { ANARCHY_HOOKS } from "./hooks-manager.mjs";

const DEFAULT_CSS_CLASS = 'default-css-class';

const DEFAULT_STYLES = [
  { name: 'Shadowrun Anarchy', cssClass: CSS_DEFAULT },
  { name: 'Dark', cssClass: CSS_DARK },
  { name: 'Dark glass', cssClass: CSS_DARKGLASS },
]

/**
 * The Styles class manages the addition of different styles
 */
export class Styles {
  constructor() {
    this.availableStyles = {};
    Hooks.once(ANARCHY_HOOKS.REGISTER_STYLES, register => DEFAULT_STYLES.forEach(it => register(it.cssClass, it.name)));
    Hooks.once('ready', () => this.onReady());
  }

  async onReady() {
    Hooks.callAll(ANARCHY_HOOKS.REGISTER_STYLES, (style, name) => this.availableStyles[style] = name);
    console.log(LOG_HEAD + 'Loaded styles', this.availableStyles);

    game.settings.register(ANARCHY_ID, DEFAULT_CSS_CLASS, {
      scope: "world",
      name: game.i18n.localize(ANARCHY.settings.defaultCssClass.name),
      hint: game.i18n.localize(ANARCHY.settings.defaultCssClass.hint),
      config: true,
      default: CSS_DEFAULT,
      choices: this.availableStyles,
      type: String
    });
  }

  selectCssClass() {
    const style = game.settings.get(ANARCHY_ID, DEFAULT_CSS_CLASS);
    return this.availableStyles[style] ? style : CSS_DEFAULT;
  }

}