import { useEffect, useRef } from "react";
import Portal from "./Portal";

type Props = {
  open: boolean;
  title: string;
  description?: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
};

export default function ConfirmModal({
  open,
  title,
  description,
  confirmText = "확인",
  cancelText = "취소",
  onConfirm,
  onCancel,
}: Props) {
  const confirmBtnRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onCancel();
      if (e.key === "Enter") onConfirm();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onCancel, onConfirm]);

  useEffect(() => {
    if (open) {
      const t = window.setTimeout(() => confirmBtnRef.current?.focus(), 0);
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
        aria-label={title}
        onClick={onCancel}
      >
        <div
          className="w-[90%] max-w-sm rounded-2xl border border-zinc-800/80 bg-gradient-to-b from-zinc-950 via-black to-zinc-950 p-6 text-zinc-100 shadow-2xl ring-1 ring-black/40"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="text-center">
            <div className="mb-2 text-2xl font-black tracking-wide">
              {title}
            </div>
            {description && (
              <div className="text-sm text-zinc-300 whitespace-pre-line">
                {description}
              </div>
            )}
          </div>

          <div className="my-4 h-px w-full bg-gradient-to-r from-transparent via-zinc-700/60 to-transparent" />

          <div className="flex justify-center gap-2">
            <button onClick={onCancel} className="btn-sub">
              {cancelText}
            </button>
            <button ref={confirmBtnRef} onClick={onConfirm} className="btn">
              {confirmText}
            </button>
          </div>
        </div>
      </div>
    </Portal>
  );
}
