import { BrowserRouter, Link, Route, Routes } from "react-router-dom";
import { StyleInjector } from "../shared/ui/styles.css.ts";
import type { UnitBase } from "../entities/unit/model/types.ts";
import Home from "./dark-legion/Home.tsx";
import Summon from "./dark-legion/Summon.tsx";
import Party from "./dark-legion/Party.tsx";
import Battle from "./dark-legion/Battle.tsx";

export interface RouterProps {
  crystal: number;
  setCrystal: React.Dispatch<React.SetStateAction<number>>;
  collection: UnitBase[];
  setCollection: React.Dispatch<React.SetStateAction<UnitBase[]>>;
  party: string[];
  setParty: React.Dispatch<React.SetStateAction<string[]>>;
  log: string[];
  pushLog: (s: string) => void;
}

const AppRouter = (props: RouterProps) => {
  return (
    <BrowserRouter>
      <StyleInjector />
      <nav className="sticky top-0 z-10 border-b border-zinc-800/70 bg-black/60 backdrop-blur text-zinc-200">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <div className="flex items-center gap-2">
            <span className="text-xl">☠️</span>
            <span className="font-semibold tracking-wide">
              다크 리전 프로토타입
            </span>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <Link className="btn-sub" to="/">
              메뉴
            </Link>
            <Link className="btn-sub" to="/summon">
              소환
            </Link>
            <Link className="btn-sub" to="/party">
              파티
            </Link>
            <Link className="btn-sub" to="/battle">
              전투
            </Link>
          </div>
        </div>
      </nav>

      <Routes>
        <Route path="/" element={<Home {...props} />} />
        <Route path="/summon" element={<Summon {...props} />} />
        <Route path="/party" element={<Party {...props} />} />
        <Route path="/battle" element={<Battle {...props} />} />
      </Routes>

      <footer className="mt-16 border-t border-zinc-800/70 bg-black/40 py-6 text-center text-xs text-zinc-500">
        <div className="mx-auto max-w-6xl px-4">
          프로토타입 데모 — 다크 판타지 • 오펜스 • 마족 수집
        </div>
      </footer>
    </BrowserRouter>
  );
};

export default AppRouter;
