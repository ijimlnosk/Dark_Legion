import { BLUEPRINTS } from "../../../entities/unit/model/blueprints";
import { ENEMIES } from "../../../entities/unit/model/enemies";
import type { UnitBase, UnitRuntime } from "../../../entities/unit/model/types";
import { clamp } from "../../../shared/lib/math";

export const cloneRuntime = (
  b: UnitBase,
  team: "아군" | "적"
): UnitRuntime => ({
  ...b,
  hp: b.hpMax,
  charge: 0,
  alive: true,
  shield: 0,
  team,
});

export const getBlueprint = (id: string) => {
  const all = [...BLUEPRINTS, ...ENEMIES];
  return all.find((b) => b.id === id)!;
};

export const getAlive = (arr: UnitRuntime[]) => arr.filter((u) => u.alive);

export const randomTarget = (arr: UnitRuntime[]) => {
  const alive = getAlive(arr);
  return alive[Math.floor(Math.random() * Math.max(1, alive.length))];
};

export const dealDamage = (target: UnitRuntime, raw: number) => {
  let dmg = Math.max(1, Math.round(raw));
  if (target.shield > 0) {
    const absorb = Math.min(target.shield, dmg);
    target.shield -= absorb;
    dmg -= absorb;
  }
  target.hp = clamp(target.hp - dmg, 0, target.hpMax);
  if (target.hp <= 0) target.alive = false;
  return { dmg } as const;
};
