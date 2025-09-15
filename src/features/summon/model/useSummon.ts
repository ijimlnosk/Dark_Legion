import { pickWeighted } from "../../../shared/lib/rng";
import { BLUEPRINTS } from "../../../entities/unit/model/blueprints";
import type { UnitBase } from "../../../entities/unit/model/types";

const RARITY_POOL: Array<{ r: 1 | 2 | 3 | 4 | 5; weight: number }> = [
  { r: 1, weight: 45 },
  { r: 2, weight: 30 },
  { r: 3, weight: 18 },
  { r: 4, weight: 6 },
  { r: 5, weight: 1 },
];

const rollRarity = (): 1 | 2 | 3 | 4 | 5 =>
  pickWeighted(RARITY_POOL.map(({ r, weight }) => ({ item: r, weight })));

export const blueprintByRarity = (rarity: number): UnitBase[] =>
  BLUEPRINTS.filter((b) => b.rarity <= rarity);

export function useSummon(
  crystal: number,
  setCrystal: React.Dispatch<React.SetStateAction<number>>,
  setCollection: React.Dispatch<React.SetStateAction<UnitBase[]>>,
  pushLog: (line: string) => void
) {
  /**
   * 소환 1회 실행하고, 결과 유닛을 반환합니다. (실패 시 null)
   */
  const summonOne = (): UnitBase | null => {
    if (crystal < 100) return null;

    const rarity = rollRarity();
    const candidates = blueprintByRarity(rarity);
    const pick = candidates[Math.floor(Math.random() * candidates.length)]!;

    setCollection((prev) => [...prev, { ...pick, id: pick.id }]);
    setCrystal((c) => c - 100);
    pushLog(
      `🎲 소환 결과: ${pick.emoji} ${pick.name} (${`★`.repeat(
        pick.rarity
      )}) 획득`
    );

    return pick;
  };

  return { summonOne };
}
