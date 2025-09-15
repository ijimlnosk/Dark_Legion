import { Link } from "react-router-dom";
import { Chip } from "../../shared/ui/Chip";
import type { RouterProps } from "../router";
import { CollectionGrid } from "../../widgets/CollectionGrid/CollectionGrid";

const Party = ({
  party,
  setParty,
  collection,
}: Pick<RouterProps, "collection" | "party" | "setParty">) => {
  const toggleParty = (id: string) => {
    setParty((prev: string[]) => {
      if (prev.includes(id)) return prev.filter((x) => x !== id);
      if (prev.length >= 3) return prev;
      return [...prev, id];
    });
  };

  return (
    <div className="mx-auto max-w-4xl p-6 text-zinc-200">
      <header className="mb-6 flex items-center justify-between">
        <h2 className="text-2xl font-bold">⚔️ 파티 편성 (최대 3인)</h2>
        <div className="flex items-center gap-2">
          <Chip>선택: {party.length}/3</Chip>
          <Link className="btn-sub" to="/">
            뒤로
          </Link>
        </div>
      </header>
      <CollectionGrid units={collection} onClick={toggleParty} party={party} />
    </div>
  );
};
export default Party;
