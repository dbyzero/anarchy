import { ANARCHY } from './config.mjs';
import { Enums } from './enums.mjs';
import { LOG_HEAD, ANARCHY_ID } from './constants.mjs';
import { ChatManager } from './chat/chat-manager.mjs';
import { GMAnarchy } from './app/gm-anarchy.mjs';
import { GMManager } from './app/gm-manager.mjs';
import { HandlebarsManager } from './handlebars-manager.mjs';
import { RemoteCall } from './remotecall.mjs';
import { Styles } from './styles.mjs';
import { AnarchyUsers } from './users.mjs';
import { AnarchyDice } from './roll/dice.mjs';
import { AnarchyRoll } from './roll/anarchy-roll.mjs';
import { Migrations } from './migrations.mjs';
import { Skills } from './skills.mjs';
import { AnarchyBaseItem } from './item/anarchy-base-item.mjs';
import { AnarchyBaseActor } from './actor/base-actor.mjs';
import { CharacterActor } from './actor/character-actor.mjs';
import { DeviceActor } from './actor/device-actor.mjs';
import { VehicleActor } from './actor/vehicle-actor.mjs';
import { CharacterActorSheet } from './actor/character-sheet.mjs';
import { DeviceSheet } from './actor/device-sheet.mjs';
import { VehicleSheet } from './actor/vehicle-sheet.mjs';
import { CharacterNPCSheet } from './actor/character-npc-sheet.mjs';
import { SkillItem } from './item/skill-item.mjs';
import { MetatypeItem } from './item/metatype-item.mjs';
import { CyberdeckItem } from './item/cyberdeck-item.mjs';
import { WeaponItem } from './item/weapon-item.mjs';
import { ContactItemSheet } from './item/contact-item-sheet.mjs';
import { CyberdeckItemSheet } from './item/cyberdeck-item-sheet.mjs';
import { GearItemSheet } from './item/gear-item-sheet.mjs';
import { MetatypeItemSheet } from './item/metatype-item-sheet.mjs';
import { QualityItemSheet } from './item/quality-item-sheet.mjs';
import { ShadowampItemSheet } from './item/shadowamp-item-sheet.mjs';
import { SkillItemSheet } from './item/skill-item-sheet.mjs';
import { WeaponItemSheet } from './item/weapon-item-sheet.mjs';
import { ContactItem } from './item/contact-item.mjs';
import { GearItem } from './item/gear-item.mjs';
import { QualityItem } from './item/quality-item.mjs';
import { ShadowampItem } from './item/shadowamp-item.mjs';
import { Checkbars } from './common/checkbars.mjs';
import { RollParameters } from './roll/roll-parameters.mjs';
import { RollDialog } from './roll/roll-dialog.mjs';
import { GMConvergence } from './app/gm-convergence.mjs';
import { AnarchyCombat } from './anarchy-combat.mjs';
import { ICSheet } from './actor/ic-sheet.mjs';
import { SpriteActorSheet } from './actor/sprite-sheet.mjs';
import { SpriteActor } from './actor/sprite-actor.mjs';
import { ICActor } from './actor/ic-actor.mjs';
import { HUDShortcuts } from './token/hud-shortcuts.mjs';
import { CombatManager } from './combat/combat-manager.mjs';
import { RollManager } from './roll/roll-manager.mjs';
import { CharacterTabbedSheet } from './actor/character-tabbed-sheet.mjs';
import { CharacterEnhancedSheet } from './actor/character-enhanced-sheet.mjs';
import { Modifiers } from './modifiers/modifiers.mjs';
import { ActorDamageManager } from './actor/actor-damage.mjs';
import { AttributeActions } from './attribute-actions.mjs';
import { DiceCursor } from './roll/dice-cursor.mjs';
import { BaseAnarchyHack } from './anarchy-hack.mjs';
import { HacksManager } from './hacks-manager.mjs';

/* -------------------------------------------- */
/*  Foundry VTT AnarchySystem Initialization    */
/* -------------------------------------------- */

export class AnarchySystem {

  static start() {
    globalThis.ANARCHY_CLASSES = { AnarchyBaseItem, AnarchyBaseActor, BaseAnarchyHack }
    globalThis.ANARCHY_CONSTANTS = { ANARCHY }

    const anarchySystem = new AnarchySystem()
    Hooks.once('init', () => anarchySystem.onInit());
  }

  onInit() {
    console.log(LOG_HEAD + 'AnarchySystem.onInit | loading system')
    game.system.anarchy = this;
    this.remoteCall = new RemoteCall() // initialize remote calls registry first: used by other singleton managers
    
    this.actorClasses = {
      character: CharacterActor,
      vehicle: VehicleActor,
      device: DeviceActor,
      sprite: SpriteActor,
      ic: ICActor
    }
    this.itemClasses = {
      contact: ContactItem,
      cyberdeck: CyberdeckItem,
      gear: GearItem,
      metatype: MetatypeItem,
      quality: QualityItem,
      shadowamp: ShadowampItem,
      skill: SkillItem,
      weapon: WeaponItem
    }
    
    this.hacks = new HacksManager()
    
    this.styles = new Styles()
    this.handlebarsManager = new HandlebarsManager()
    this.gmAnarchy = new GMAnarchy()
    this.gmConvergence = new GMConvergence()
    Enums.init()
    
    this.skills = new Skills()
    this.modifiers = new Modifiers()
    this.rollParameters = new RollParameters()
    this.rollManager = new RollManager()
    this.hudShortcuts = new HUDShortcuts()
    this.combatManager = new CombatManager()

    CONFIG.ANARCHY = ANARCHY;
    CONFIG.Combat.documentClass = AnarchyCombat;
    CONFIG.Combat.initiative = { formula: "2d6" }
    CONFIG.Actor.documentClass = AnarchyBaseActor;
    CONFIG.Item.documentClass = AnarchyBaseItem;

    Checkbars.init()
    this.loadActorSheets()
    this.loadItemSheets()
    WeaponItem.init()
    DiceCursor.init()
    RollDialog.init()
    AttributeActions.init()
    AnarchyCombat.init()
    AnarchyUsers.init()
    AnarchyDice.init()
    AnarchyRoll.init()
    AnarchyBaseItem.init()
    AnarchyBaseActor.init()
    ActorDamageManager.init()
    ChatManager.init()
    Migrations.init()

    this.gmManager = new GMManager(this.gmAnarchy, this.gmConvergence);
    Hooks.once('ready', () => this.onReady());
    console.log(LOG_HEAD + 'AnarchySystem.onInit | done')
  }

  async onReady() {
    console.log(LOG_HEAD + 'AnarchySystem.onReady')
    if (game.user.isGM) {
      new Migrations().migrate()
    }
  }

  loadActorSheets() {
    Actors.unregisterSheet('core', ActorSheet);
    Actors.registerSheet(ANARCHY_ID, CharacterActorSheet, {
      label: game.i18n.localize(ANARCHY.actor.characterSheet),
      makeDefault: false,
      types: ['character']
    });
    Actors.registerSheet(ANARCHY_ID, CharacterNPCSheet, {
      label: game.i18n.localize(ANARCHY.actor.characterNPCSheet),
      makeDefault: false,
      types: ['character']
    });
    Actors.registerSheet(ANARCHY_ID, CharacterTabbedSheet, {
      label: game.i18n.localize(ANARCHY.actor.characterTabbedSheet),
      makeDefault: false,
      types: ['character']
    });
    Actors.registerSheet(ANARCHY_ID, CharacterEnhancedSheet, {
      label: game.i18n.localize(ANARCHY.actor.characterEnhancedSheet),
      makeDefault: true,
      types: ['character']
    });
    Actors.registerSheet(ANARCHY_ID, VehicleSheet, {
      label: game.i18n.localize(ANARCHY.actor.vehicleSheet),
      makeDefault: true,
      types: ['vehicle']
    });
    Actors.registerSheet(ANARCHY_ID, DeviceSheet, {
      label: game.i18n.localize(ANARCHY.actor.deviceSheet),
      makeDefault: true,
      types: ['device']
    });
    Actors.registerSheet(ANARCHY_ID, SpriteActorSheet, {
      label: game.i18n.localize(ANARCHY.actor.spriteSheet),
      makeDefault: true,
      types: ['sprite']
    });
    Actors.registerSheet(ANARCHY_ID, ICSheet, {
      label: game.i18n.localize(ANARCHY.actor.icSheet),
      makeDefault: true,
      types: ['ic']
    });
  }

  loadItemSheets() {
    Items.unregisterSheet('core', ItemSheet);
    Items.registerSheet(ANARCHY_ID, ContactItemSheet, { types: ["contact"], makeDefault: true });
    Items.registerSheet(ANARCHY_ID, CyberdeckItemSheet, { types: ["cyberdeck"], makeDefault: true });
    Items.registerSheet(ANARCHY_ID, GearItemSheet, { types: ["gear"], makeDefault: true });
    Items.registerSheet(ANARCHY_ID, MetatypeItemSheet, { types: ["metatype"], makeDefault: true });
    Items.registerSheet(ANARCHY_ID, QualityItemSheet, { types: ["quality"], makeDefault: true });
    Items.registerSheet(ANARCHY_ID, ShadowampItemSheet, { types: ["shadowamp"], makeDefault: true });
    Items.registerSheet(ANARCHY_ID, SkillItemSheet, { types: ["skill"], makeDefault: true });
    Items.registerSheet(ANARCHY_ID, WeaponItemSheet, { types: ["weapon"], makeDefault: true });
  }

  getHack() {
    return this.hacks.getHack()
  }
}