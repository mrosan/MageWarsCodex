import { School, SpellType } from './catalog-item';

export interface Mage {
  id: string;
  name: string;
  affinities: Affinity[];
  cardFront: string;
  cardBack: string;
  only: string[];
}

export interface Affinity {
  multiplier: number;
  school?: School;
  type?: SpellType;
  excludeSchool?: boolean;
  subtype?: string;
  level?: number;
}
