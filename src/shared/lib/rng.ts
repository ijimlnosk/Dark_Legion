export type Weighted<T> = { item: T; weight: number };

export const pickWeighted = <T>(arr: Array<Weighted<T>>): T => {
  const sum = arr.reduce((s, x) => s + x.weight, 0);
  let roll = Math.random() * sum;
  for (const { item, weight } of arr) {
    roll -= weight;
    if (roll <= 0) return item;
  }
  return arr[arr.length - 1]!.item;
};
