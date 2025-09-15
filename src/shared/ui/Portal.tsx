import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";

type Props = {
  children: React.ReactNode;
  containerId?: string;
};

export default function Portal({
  children,
  containerId = "portal-root",
}: Props) {
  const elRef = useRef<HTMLDivElement | null>(null);
  if (!elRef.current) elRef.current = document.createElement("div");

  useEffect(() => {
    let container = document.getElementById(containerId);
    if (!container) {
      container = document.createElement("div");
      container.setAttribute("id", containerId);
      document.body.appendChild(container);
    }
    const el = elRef.current!;
    container.appendChild(el);
    return () => {
      container?.removeChild(el);
      // container가 비면 정리 (선택)
      if (container && container.childNodes.length === 0) {
        container.parentElement?.removeChild(container);
      }
    };
  }, [containerId]);

  return createPortal(children, elRef.current);
}
