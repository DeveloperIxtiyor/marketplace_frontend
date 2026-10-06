export const API_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://127.0.0.1:8000";

const ACCESS_KALIT = "mp_access";
const REFRESH_KALIT = "mp_refresh";

export interface TokenJuftligi {
  access_token: string;
  refresh_token: string;
  token_type: string;
}

export class ApiXato extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.name = "ApiXato";
    this.status = status;
  }
}

/* ------------------------------------------------------------ tokenlar */
// localStorage faqat brauzerda bor — serverda `window` yo'q, shuning uchun
// har bir funksiya tekshiradi. Shaxsiy oynada u xato ham berishi mumkin,
// shuning uchun try/catch.

export function tokenlarniOl(): { access: string | null; refresh: string | null } {
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

export function tokenlarniSaqla(juftlik: TokenJuftligi): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(ACCESS_KALIT, juftlik.access_token);
    localStorage.setItem(REFRESH_KALIT, juftlik.refresh_token);
  } catch {
    /* shaxsiy oyna — saqlamasak ham ilova ishlayveradi */
  }
}

export function tokenlarniOchir(): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(ACCESS_KALIT);
    localStorage.removeItem(REFRESH_KALIT);
  } catch {
    /* ignore */
  }
}

/* ------------------------------------------------------------ so'rov */
interface SoraqOpsiya {
  method?: "GET" | "POST" | "PATCH" | "PUT" | "DELETE";
  /** Obyekt bo'lsa JSON ga aylantiriladi; `FormData` bo'lsa — o'zi ketadi. */
  body?: unknown;
  /** true (default) — Authorization sarlavhasi qo'shiladi */
  auth?: boolean;
}

async function xomSoraq(yol: string, opt: SoraqOpsiya): Promise<Response> {
  const sarlavhalar: Record<string, string> = {};

  // 05-dars: fayl yuborish uchun FormData kerak. Eng muhim qoida —
  // FormData bilan `Content-Type` ni O'ZIMIZ QO'YMAYMIZ.
  // Brauzer uni o'zi yozadi va ichiga tasodifiy "boundary" qo'shadi:
  //     multipart/form-data; boundary=----WebKitFormBoundaryXy7
  // Biz qo'lda "multipart/form-data" deb yozsak, boundary bo'lmaydi va
  // backend so'rovni o'qiy olmaydi (422 "Field required" chiqadi).
  const formaMi = typeof FormData !== "undefined" && opt.body instanceof FormData;

  if (opt.body !== undefined && !formaMi) {
    sarlavhalar["Content-Type"] = "application/json";
  }
  if (opt.auth !== false) {
    const { access } = tokenlarniOl();
    if (access) sarlavhalar["Authorization"] = `Bearer ${access}`;
  }

  return fetch(`${API_URL}${yol}`, {
    method: opt.method ?? "GET",
    headers: sarlavhalar,
    body:
      opt.body === undefined
        ? undefined
        : formaMi
          ? (opt.body as FormData)
          : JSON.stringify(opt.body),
  });
}

/**
 * Bir vaqtning o'zida bir nechta so'rov 401 olishi mumkin. Agar har biri
 * alohida refresh qilsa, birinchisi token_version'ni... (backendda oshirmaydi,
 * lekin baribir) — va eng muhimi, keraksiz 5 ta so'rov ketadi.
 * Shuning uchun yangilash jarayoni bitta va'daga (Promise) bog'lanadi:
 * qolganlari o'shani kutadi.
 */
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
  tokenlarniSaqla((await javob.json()) as TokenJuftligi);
  return true;
}

function yangilashniBoshla(): Promise<boolean> {
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

export async function apiSoraq<T>(
  yol: string,
  opt: SoraqOpsiya = {},
): Promise<T> {
  let javob = await xomSoraq(yol, opt);

  // Access eskirgan bo'lsa — bir marta yangilab, qayta urinamiz.
  // FormData bilan ham ishlaydi: `fetch` uni har chaqiriqda qaytadan
  // o'qiydi, shuning uchun bitta FormData ikki marta yuborilishi mumkin.
  if (javob.status === 401 && opt.auth !== false) {
    const yangilandi = await yangilashniBoshla();
    if (yangilandi) javob = await xomSoraq(yol, opt);
  }

  if (!javob.ok) throw new ApiXato(javob.status, await xatoMatni(javob));
  if (javob.status === 204) return undefined as T;
  return (await javob.json()) as T;
}