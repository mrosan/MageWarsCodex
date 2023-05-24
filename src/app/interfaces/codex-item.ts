export enum CodexItemCategory {
  OTHER,
  EXPLANATION, // extra info for complex spell mechanics
  RETCON, // rules that changed after release
  GAME_TERM,
  GAME_MARKER,
  CONDITION_MARKER,
  EFFECT,
  DAMAGE_TYPE,
  SPELL_TYPE,
  SPELL_TRAIT,
  SPELL_ATTRIBUTE,
  OBJECT_TRAIT,
  OBJECT_ATTRIBUTE,
  ATTACK_TRAIT,
  ATTACK_ATTRIBUTE,
  SPECIAL_TILE,
  SPECIAL_ABILITY, // unique mage ability
  DOMINATION, // Domination expansion Terms and Objects
}

export interface CodexItem {
  id: string;
  name: string;
  category: CodexItemCategory;
  image: string;
  description: string;
}

export interface CodexItemCategoryFilter {
  id: CodexItemCategory;
  displayName: string;
  selected: boolean;
}
