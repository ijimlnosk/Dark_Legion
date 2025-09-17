import { Link } from "react-router-dom";
import { Chip } from "../../shared/ui/Chip";
import { CollectionGrid } from "../../widgets/CollectionGrid/CollectionGrid";
import { useMeState, useUpdateParty } from "../../features/me/model/useMeState";

export default function Party() {
  const { data: me, isLoading } = useMeState();
  const updateParty = useUpdateParty();

  if (isLoading) return <div>불러오는 중…</div>;
  if (!me) return <div>데이터 없음</div>;

  const toggleParty = (inventoryId: string) => {
    const newParty = me.party.includes(inventoryId)
      ? me.party.filter((x) => x !== inventoryId)
      : me.party.length >= 3
      ? me.party
      : [...me.party, inventoryId];

    // ✅ mutation 실행
    updateParty.mutate(newParty);
  };

  return (
    <div>
      <header>
        <h2>⚔️ 파티 편성</h2>
        <Chip>{me.party.length}/3</Chip>
        <Link to="/">뒤로</Link>
      </header>
      <CollectionGrid
        units={me.collection}
        onClick={toggleParty}
        party={me.party}
      />
    </div>
  );
}
