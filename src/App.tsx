import { useCallback, useState } from "react";
import AppRouter from "./app/router";
import { BLUEPRINTS } from "./entities/unit/model/blueprints";
import type { UnitBase } from "./entities/unit/model/types";

const App = () => {
  const [crystal, setCrystal] = useState(200);
  const [collection, setCollection] = useState<UnitBase[]>(() => [
    BLUEPRINTS.find((b) => b.id === "skel_soldier")!,
    BLUEPRINTS.find((b) => b.id === "gob_rogue")!,
    BLUEPRINTS.find((b) => b.id === "wisp_mage")!,
  ]);
  const [party, setParty] = useState<string[]>([
    "skel_soldier",
    "gob_rogue",
    "wisp_mage",
  ]);
  const [log, setLog] = useState<string[]>([]);
  const pushLog = useCallback(
    (s: string) => setLog((prev) => [s, ...prev].slice(0, 60)),
    []
  );

  return (
    <AppRouter
      crystal={crystal}
      setCrystal={setCrystal}
      collection={collection}
      setCollection={setCollection}
      party={party}
      setParty={setParty}
      log={log}
      pushLog={pushLog}
    />
  );
};

export default App;
