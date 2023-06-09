export interface SchoolWithLevel {
  school: School;
  level: number;
}

export interface CatalogItem {
  id: string;
  name: string;
  type: SpellType;
  subTypes: string[];
  schools: SchoolWithLevel[];
  image: string;
  novice?: boolean;
  epic?: boolean;
  only?: string;
  slot?: EquipmentSlot;
  traits: string[];
  set: string;
  sumLevel: number;
}

export interface CatalogFilterForm {
  types: SpellType[];
  subTypes: string[];
  schools: School[];
  levels: number[];
  onlies: string[];
  slots: EquipmentSlot[];
  sets: string[];
  traits: string[];
}

export enum SpellType {
  ATTACK = 'Attack spell',
  CREATURE = 'Creature',
  CONJURATION = 'Conjuration',
  ENCHANTMENT = 'Enchantment',
  EQUIPMENT = 'Equipment',
  INCANTATION = 'Incantation',
}

export enum School {
  NATURE = 'Nature',
  HOLY = 'Holy',
  DARK = 'Dark',
  ARCANE = 'Arcane',
  MIND = 'Mind',
  WAR = 'War',
  FIRE = 'Fire',
  WATER = 'Water',
  EARTH = 'Earth',
  AIR = 'Air',
}

export enum EquipmentSlot {
  HELMET = 'Helmet',
  AMULET = 'Amulet',
  RING = 'Ring',
  CHEST = 'Chest',
  CLOAK = 'Cloak',
  BELT = 'Belt',
  LEGS = 'Breeches',
  GLOVES = 'Gloves',
  BOOTS = 'Boots',
  MAINHAND = 'Main Hand',
  OFFHAND = 'Offhand',
  MAIN_OR_OFFHAND = 'Main/Offhand',
  MAIN_AND_OFFHAND = 'Main+Offhand',
  AUTONOMOUS = 'Autonomous',
}
