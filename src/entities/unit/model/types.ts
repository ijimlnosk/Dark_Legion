export type UnitBase = {
  id: string; // unitId
  name: string;
  emoji: string;
  tribe: "언데드" | "악마" | "야수" | "인간";
  role: "탱커" | "딜러" | "마법사";
  rarity: number;
  hpMax: number;
  atk: number;
  speed: number;
  level: number;
  ultName?: string | null;
  ultDesc?: string | null;
  img: string;
};

// 서버가 주는 컬렉션 아이템(인벤토리 id 포함)
export type OwnedUnit = UnitBase & {
  id: string;
  name: string;
  emoji: string;
  tribe: string;
  role: string;
  rarity: number;
  img: string;
  hpMax: number;
  atk: number;
  speed: number;
  ultName: string | null;
  ultDesc: string | null;
  inventoryId: string;
  level: number;
};

// me/state 응답
export type MeState = {
  crystal: number;
  party: string[]; // Inventory.id[]
  collection: OwnedUnit[];
};

export type UnitRuntime = {
  id: string;
  blueprintId: string;
  name: string;
  emoji: string;
  hp: number;
  hpMax: number;
  atk: number;
  speed: number;
  charge: number;
  alive: boolean;
  img: string;
  side: "아군" | "적";
};
