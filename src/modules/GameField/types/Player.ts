import { Spell } from "./Spell";

export interface Player {
  id: number;
  x: number;
  y: number;
  radius: number;
  color: string;
  speed: number;
  direction: number;
  spellColor: string;
  spells: Spell[];
  score: number;
  name: string;
  isHit: boolean;
  shootInterval?: NodeJS.Timeout; // Новый тип для хранения интервала
}
