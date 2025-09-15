export type Tribe = "언데드" | "악마" | "야수" | "인간";
export type Role = "탱커" | "딜러" | "마법사";

export interface UnitBase {
  id: string;
  name: string;
  emoji: string;
  tribe: Tribe;
  role: Role;
  rarity: 1 | 2 | 3 | 4 | 5;
  hpMax: number;
  atk: number;
  speed: number;
  ultName: string;
  ultDesc: string;
  img: string;
}

export interface UnitRuntime extends UnitBase {
  hp: number;
  charge: number; // 0..100
  alive: boolean;
  shield: number; // 피해 흡수
  team: "아군" | "적";
}
export interface UnitInstance {
  instanceId: string; // uuid/nanoid
  base: UnitBase; // 원본 블루프린트
}
