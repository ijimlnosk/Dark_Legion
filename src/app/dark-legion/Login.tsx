import { useState } from "react";
import type { FormEvent } from "react";
import { api } from "../../shared/api/client";

export default function Login() {
  const [name, setName] = useState(localStorage.getItem("dl_user") ?? "");

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const trimmed = name.trim();
    if (!trimmed) return;
    // 서버에 유저 생성/로그인 (인증 불필요)
    await api.post("/auth/login", { name: trimmed }, { auth: false });
    localStorage.setItem("dl_user", trimmed);
    window.location.href = "/"; // 홈으로
  };

  const useDev = async () => {
    await api.post("/auth/login", { name: "dev" }, { auth: false });
    localStorage.setItem("dl_user", "dev");
    window.location.href = "/";
  };

  return (
    <div className="mx-auto max-w-sm p-6 text-zinc-200">
      <h1 className="mb-4 text-2xl font-bold">로그인</h1>
      <form onSubmit={onSubmit} className="space-y-3">
        <label className="block">
          <span className="mb-1 block text-sm text-zinc-400">닉네임</span>
          <input
            className="w-full rounded-lg border border-zinc-700 bg-zinc-900 p-2 outline-none"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="예: dev"
          />
        </label>
        <button type="submit" className="btn w-full">
          시작하기
        </button>
      </form>

      <div className="mt-6">
        <button className="btn-sub w-full" onClick={useDev}>
          dev 계정으로 바로 시작
        </button>
      </div>
    </div>
  );
}
