// shared/lib/toAbs.ts
export const toAbs = (path?: string) => {
  if (!path) return "";
  if (/^https?:\/\//i.test(path)) return path;

  const base = (import.meta.env.VITE_API_BASE ?? "").replace(/\/+$/, "");
  let p = path.startsWith("/") ? path : `/${path}`;

  // 확장자 없는 /units/* 이면 .png를 붙여 정적 파일로 고정
  if (p.startsWith("/units/") && !/\.[a-z0-9]+$/i.test(p)) {
    p = `${p}.png`;
  }
  return `${base}${p}`;
};
