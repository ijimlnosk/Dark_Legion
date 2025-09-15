import { Link } from "react-router-dom";
import { Card } from "../../shared/ui/Card";
import { Chip } from "../../shared/ui/Chip";
import { STAGES } from "../../entities/stage/model/stages";
import { CollectionGrid } from "../../widgets/CollectionGrid/CollectionGrid";
import type { RouterProps } from "../router";

const Home = ({
  crystal,
  party,
  collection,
}: Pick<RouterProps, "crystal" | "party" | "collection">) => {
  return (
    <div className="mx-auto max-w-5xl p-6 text-zinc-200">
      <header className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-black tracking-tight">
          ☠️ 다크 리전 — 프로토타입
        </h1>
        <div className="flex items-center gap-3">
          <Chip>결정: {crystal}</Chip>
          <Chip>파티: {party.length}/3</Chip>
        </div>
      </header>

      <div className="grid gap-4 md:grid-cols-2">
        <Card title="던전 침공" desc="스테이지를 클리어하고 보상을 획득하세요.">
          <Link className="btn" to="/battle">
            스테이지 시작 1
          </Link>
        </Card>
        <Card title="마족 소환" desc="어둠의 결정 100개로 마족을 소환합니다.">
          <Link className="btn" to="/summon">
            소환
          </Link>
        </Card>
        <Card title="파티 편성" desc="최대 3인으로 편성하세요 (클릭하여 토글).">
          <Link className="btn" to="/party">
            파티
          </Link>
        </Card>
        <Card title="스테이지" desc="다음 지역으로 이동합니다.">
          <div className="flex items-center gap-2">
            <button className="btn-sub">◀ 이전</button>
            <Chip>{STAGES[0].name}</Chip>
            <button className="btn-sub">다음 ▶</button>
          </div>
        </Card>
      </div>

      <section className="mt-8">
        <h2 className="mb-2 text-lg font-semibold">보유 마족</h2>
        <CollectionGrid units={collection} onClick={() => {}} party={party} />
      </section>
    </div>
  );
};

export default Home;
