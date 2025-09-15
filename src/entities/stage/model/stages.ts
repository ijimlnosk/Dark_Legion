export const STAGES = [
  {
    id: "village",
    name: "스테이지 1 — 순례자의 촌락",
    waves: [
      ["royal_soldier", "royal_archer"],
      ["royal_soldier", "temple_wizard"],
      ["royal_soldier", "royal_archer", "temple_wizard"],
    ],
    rewardCrystals: 120,
  },
  {
    id: "rampart",
    name: "스테이지 2 — 오래된 성벽",
    waves: [
      ["royal_soldier", "royal_soldier", "royal_archer"],
      ["temple_wizard", "royal_archer", "royal_archer"],
      ["royal_soldier", "royal_soldier", "temple_wizard"],
    ],
    rewardCrystals: 180,
  },
] as const;
