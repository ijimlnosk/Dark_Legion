import { useEffect, useRef } from "react";
import Portal from "../../shared/ui/Portal";

type Props = {
  open: boolean;
  win: boolean;
  crystals: number;
  onClose: () => void; // 닫고 나서 Battle에서 navigate("/") 수행
};

export default function ResultModal({ open, win, crystals, onClose }: Props) {
  const closeBtnRef = useRef<HTMLButtonElement | null>(null);

  // ESC로 닫기
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  // 처음 열릴 때 닫기 버튼 포커스
  useEffect(() => {
    if (open) {
      const t = window.setTimeout(() => closeBtnRef.current?.focus(), 0);
      return () => window.clearTimeout(t);
    }
  }, [open]);

  if (!open) return null;

  return (
    <Portal>
      <div
        className="fixed inset-0 z-[1000] grid place-items-center bg-black/70 backdrop-blur-[2px]"
        aria-modal="true"
        role="dialog"
        aria-label={win ? "승리" : "패배"}
        onClick={onClose} // 백드롭 클릭 시 닫기
      >
        <div
          className="w-[90%] max-w-sm rounded-2xl border border-zinc-800/80 bg-gradient-to-b from-zinc-950 via-black to-zinc-950 p-6 text-zinc-100 shadow-2xl ring-1 ring-black/40"
          onClick={(e) => e.stopPropagation()} // 컨테이너 클릭 이벤트 버블 방지
        >
          {/* 상단 아이콘/타이틀 */}
          <div className="text-center">
            <div className="mb-3 text-3xl">{win ? "🏴" : "☠️"}</div>
            <div className="mb-2 text-2xl font-black tracking-wide">
              {win ? "승리" : "패배"}
            </div>
            <div className="text-sm text-zinc-300">
              {win ? (
                <>
                  전리품을 수거했습니다:{" "}
                  <span className="text-emerald-300 font-semibold">
                    +{crystals}
                  </span>{" "}
                  결정
                </>
              ) : (
                <>왕국은 아직 건재합니다. 군단을 재정비하세요.</>
              )}
            </div>
          </div>

          {/* 구분 장식 */}
          <div className="my-4 h-px w-full bg-gradient-to-r from-transparent via-zinc-700/60 to-transparent" />

          {/* 액션 */}
          <div className="flex justify-center">
            <button
              ref={closeBtnRef}
              onClick={onClose}
              className="rounded-xl border border-emerald-700/60 bg-emerald-900/40 px-4 py-2 text-sm text-emerald-100 hover:bg-emerald-900/60 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              홈으로
            </button>
          </div>
        </div>
      </div>
    </Portal>
  );
}
