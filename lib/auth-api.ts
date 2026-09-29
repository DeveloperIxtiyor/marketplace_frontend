import { apiSoraq, type TokenJuftligi } from "@/lib/api";

export type Rol = "buyer" | "seller" | "admin";

export interface Profil {
  id: number;
  ism: string;
  email: string | null;
  telefon: string | null;
  telegram_id: number | null;
  telegram_username: string | null;
  avatar_url: string | null;
  role: Rol;
  auth_provider: "telegram" | "web";
  faol: boolean;
  yaratilgan_vaqt: string | null;
}

export function login(malumot: { email: string; parol: string }) {
  return apiSoraq<TokenJuftligi>("/auth/login", {
    method: "POST",
    body: malumot,
    auth: false,
  });
}

export function royxatdanOtish(malumot: { ism: string; email: string; parol: string }) {
  return apiSoraq<void>("/auth/register", {
    method: "POST",
    body: malumot,
    auth: false,
  });
}

/** Telegram Mini App: imzolangan initData'ni backendga yuboradi. */
export function telegramLogin(initData: string) {
  return apiSoraq<TokenJuftligi>("/auth/telegram", {
    method: "POST",
    body: { init_data: initData },
    auth: false,
  });
}

export function profilniOl() {
  return apiSoraq<Profil>("/auth/me");
}

export function profilniYangila(malumot: { ism?: string; telefon?: string }) {
  return apiSoraq<Profil>("/auth/me", { method: "PATCH", body: malumot });
}

export function parolniOzgartir(malumot: { eski_parol: string; yangi_parol: string }) {
  return apiSoraq<void>("/auth/parol", { method: "POST", body: malumot });
}

export function chiqish() {
  return apiSoraq<void>("/auth/logout", { method: "POST" });
}
