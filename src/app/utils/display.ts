import { CodexItemCategory } from 'src/app/interfaces/codex-item';

export function displayCategory(category: CodexItemCategory) {
  switch (category) {
    case CodexItemCategory.OTHER:
      return '';
    case CodexItemCategory.EXPLANATION:
      return 'explanation';
    case CodexItemCategory.RETCON:
      return 'correction';
    case CodexItemCategory.GAME_TERM:
      return 'game term';
    case CodexItemCategory.GAME_MARKER:
      return 'game marker';
    case CodexItemCategory.CONDITION_MARKER:
      return 'condition marker';
    case CodexItemCategory.EFFECT:
      return 'effect';
    case CodexItemCategory.DAMAGE_TYPE:
      return 'damage type';
    case CodexItemCategory.SPELL_TYPE:
      return 'spell type';
    case CodexItemCategory.SPELL_TRAIT:
      return 'spell trait';
    case CodexItemCategory.SPELL_ATTRIBUTE:
      return 'spell attribute';
    case CodexItemCategory.OBJECT_TRAIT:
      return 'object trait';
    case CodexItemCategory.OBJECT_ATTRIBUTE:
      return 'object attribute';
    case CodexItemCategory.ATTACK_TRAIT:
      return 'attack trait';
    case CodexItemCategory.ATTACK_ATTRIBUTE:
      return 'attack attribute';
    case CodexItemCategory.SPECIAL_TILE:
      return 'special tile';
    case CodexItemCategory.SPECIAL_ABILITY:
      return 'special ability';
    case CodexItemCategory.DOMINATION:
      return 'dominion';
  }
}
