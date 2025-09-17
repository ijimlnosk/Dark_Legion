// shared/api/client.ts
export const BASE = import.meta.env.VITE_API_BASE ?? "http://localhost:4000";

function getUserName(): string | null {
  return localStorage.getItem("dl_user");
}

async function handle<T>(r: Response): Promise<T> {
  if (r.status === 401) {
    // 인증 실패 → 로그인 페이지로
    window.location.href = "/login";
    throw new Error("Unauthorized");
  }
  if (!r.ok) {
    const text = await r.text().catch(() => "");
    throw new Error(text || `HTTP ${r.status}`);
  }
  return r.json() as Promise<T>;
}

function buildHeaders(
  init: HeadersInit | undefined,
  auth: boolean,
  withJson = false
): Headers {
  const headers = new Headers(init); // 유니온을 Headers로 통일
  if (withJson && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }
  if (auth) {
    const name = getUserName();
    if (name) headers.set("x-user-name", name);
  }
  return headers;
}

export const api = {
  async get<T>(
    path: string,
    opts?: { auth?: boolean } & RequestInit
  ): Promise<T> {
    const auth = opts?.auth ?? true;
    const headers = buildHeaders(opts?.headers, auth, false);
    const r = await fetch(`${BASE}${path}`, {
      ...opts,
      headers,
      method: opts?.method ?? "GET",
    });
    return handle<T>(r);
  },

  async post<T>(
    path: string,
    body?: unknown,
    opts?: { auth?: boolean } & RequestInit
  ): Promise<T> {
    const auth = opts?.auth ?? true;
    const headers = buildHeaders(opts?.headers, auth, true);
    const r = await fetch(`${BASE}${path}`, {
      ...opts,
      method: "POST",
      headers,
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
    return handle<T>(r);
  },

  async put<T>(
    path: string,
    body?: unknown,
    opts?: { auth?: boolean } & RequestInit
  ): Promise<T> {
    const auth = opts?.auth ?? true;
    const headers = buildHeaders(opts?.headers, auth, true);
    const r = await fetch(`${BASE}${path}`, {
      ...opts,
      method: "PUT",
      headers,
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
    return handle<T>(r);
  },

  // 필요하면 patch/delete도 동일 패턴으로 추가 가능
};
