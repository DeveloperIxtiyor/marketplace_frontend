export const API_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://127.0.0.1:8000";

const ACCESS_KALIT = "mp_access";
const REFRESH_KALIT = "mp_refresh";

export interface TokenJuftligi {
  access_token: string;
  refresh_token: string;
}

export interface SoraqOpsiya {
  method?: string;
  body?: unknown;
  auth?: boolean;
}

export class ApiXato extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.name = "ApiXato";
    this.status = status;
  }
}

export function tokenlarniOl() {
  if (typeof window === "undefined") return { access: null, refresh: null };
  try {
    return {
      access: localStorage.getItem(ACCESS_KALIT),
      refresh: localStorage.getItem(REFRESH_KALIT),
    };
  } catch {
    return { access: null, refresh: null };
  }
}

export function tokenlarniSaqla(tokenlar: TokenJuftligi): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(ACCESS_KALIT, tokenlar.access_token);
    localStorage.setItem(REFRESH_KALIT, tokenlar.refresh_token);
  } catch {
    // localStorage mavjud emas (masalan, xususiy rejim) — jim o'tkazamiz
  }
}

export function tokenlarniOchir(): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(ACCESS_KALIT);
    localStorage.removeItem(REFRESH_KALIT);
  } catch {
    // jim o'tkazamiz
  }
}

async function xomSoraq(yol: string, opt: SoraqOpsiya): Promise<Response> {
  const sarlavhalar: Record<string, string> = {};
  if (opt.body !== undefined) sarlavhalar["Content-Type"] = "application/json";
  if (opt.auth !== false) {
    const { access } = tokenlarniOl();
    if (access) sarlavhalar["Authorization"] = `Bearer ${access}`;
  }
  return fetch(`${API_URL}${yol}`, {
    method: opt.method ?? "GET",
    headers: sarlavhalar,
    body: opt.body === undefined ? undefined : JSON.stringify(opt.body),
  });
}

export async function apiSoraq<T>(yol: string, opt: SoraqOpsiya = {}): Promise<T> {
  let javob = await xomSoraq(yol, opt);

  // Access eskirgan bo'lsa — BIR MARTA yangilab, qayta urinamiz.
  if (javob.status === 401 && opt.auth !== false) {
    const yangilandi = await yangilashniBoshla();
    if (yangilandi) javob = await xomSoraq(yol, opt);
  }

  if (!javob.ok) throw new ApiXato(javob.status, await xatoMatni(javob));
  if (javob.status === 204) return undefined as T;
  return (await javob.json()) as T;
}

let yangilashJarayoni: Promise<boolean> | null = null;

async function tokenniYangila(): Promise<boolean> {
  const { refresh } = tokenlarniOl();
  if (!refresh) return false;

  const javob = await fetch(`${API_URL}/auth/refresh`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refresh_token: refresh }),
  });

  if (!javob.ok) {
    tokenlarniOchir();
    return false;
  }
  tokenlarniSaqla(await javob.json());
  return true;
}

function yangilashniBoshla(): Promise<boolean> {
  // ??= : agar jarayon allaqachon ketayotgan bo'lsa, YANGISINI boshlamaymiz
  yangilashJarayoni ??= tokenniYangila().finally(() => {
    yangilashJarayoni = null;
  });
  return yangilashJarayoni;
}

async function xatoMatni(javob: Response): Promise<string> {
  try {
    const m = await javob.json();
    if (typeof m?.detail === "string") return m.detail;
    // FastAPI validatsiya xatosi: detail — massiv
    if (Array.isArray(m?.detail) && m.detail.length) {
      return m.detail.map((d: { msg?: string }) => d.msg ?? "").join("; ");
    }
  } catch {
    /* javob JSON emas */
  }
  return `Xatolik (${javob.status})`;
}
