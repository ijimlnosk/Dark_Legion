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
    // 이미 선택된 항목이면 해제
    if (me.party.includes(inventoryId)) {
      updateParty.mutate(me.party.filter((x) => x !== inventoryId));
      return;
    }

    // 최대 3명 제한
    if (me.party.length >= 3) {
      return;
    }

    // 동일 캐릭터(blueprint id) 중복 방지
    const target = me.collection.find((c) => c.inventoryId === inventoryId);
    if (!target) return;
    const partyBlueprintIds = me.party
      .map((pid) => me.collection.find((c) => c.inventoryId === pid))
      .filter((u): u is NonNullable<typeof u> => Boolean(u))
      .map((u) => u.id);

    if (partyBlueprintIds.includes(target.id)) {
      // 이미 같은 캐릭터가 파티에 있음 → 무시
      return;
    }

    const newParty = [...me.party, inventoryId];

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
