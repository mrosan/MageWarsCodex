export interface Mage {
  id: string;
  name: string;
  affinities: Affinity[];
  cardFront: string;
  cardBack: string;
}

export interface Affinity {
  multiplier: number;
  school?: string;
  type?: string;
  subtype?: string;
  level?: number;
}
