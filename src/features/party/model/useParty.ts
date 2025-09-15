import { useCallback, useState } from "react";

export const useParty = (initial: string[] = []) => {
  const [party, setParty] = useState<string[]>(initial);

  const toggleParty = useCallback((id: string) => {
    setParty((prev) => {
      if (prev.includes(id)) return prev.filter((x) => x !== id);
      if (prev.length >= 3) return prev;
      return [...prev, id];
    });
  }, []);

  return { party, setParty, toggleParty };
};
