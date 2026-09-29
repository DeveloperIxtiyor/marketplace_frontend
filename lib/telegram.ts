export interface TelegramUser {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
  language_code?: string;
  photo_url?: string;
}

export interface TelegramWebApp {
  /** Imzolangan xom satr — backendga aynan shu yuboriladi. */
  initData: string;
  /** O'sha satrning ochilgan ko'rinishi. ISHONIB BO'LMAYDI — faqat UI uchun. */
  initDataUnsafe: { user?: TelegramUser; auth_date?: number; hash?: string };
  colorScheme: "light" | "dark";
  themeParams: Record<string, string>;
  isExpanded: boolean;
  ready: () => void;
  expand: () => void;
  close: () => void;
  MainButton: { [key: string]: unknown };
  BackButton: { [key: string]: unknown };
}

declare global {
  interface Window {
    Telegram?: { WebApp?: TelegramWebApp };
  }
}

export function webApp(): TelegramWebApp | null {
  if (typeof window === "undefined") return null;
  return window.Telegram?.WebApp ?? null;
}

/** Ilova Telegram ichida ochilganmi? */
export function telegramIchidami(): boolean {
  const wa = webApp();
  // initData bo'sh bo'lsa — bu Telegram emas.
  return Boolean(wa && wa.initData);
}

export function initDataOl(): string | null {
  return webApp()?.initData || null;
}

export function miniAppniTayyorla(): void {
  const wa = webApp();
  if (!wa) return;
  wa.ready(); // "yuklandim" signali
  if (!wa.isExpanded) wa.expand(); // to'liq balandlikka yoyish
}

export function temaniQolla(): void {
  const wa = webApp();
  if (!wa || typeof document === "undefined") return;

  for (const [kalit, qiymat] of Object.entries(wa.themeParams ?? {})) {
    // bg_color -> --tg-bg-color
    document.documentElement.style.setProperty(
      `--tg-${kalit.replace(/_/g, "-")}`,
      qiymat,
    );
  }
  // shadcn `.dark` sinfi orqali qora mavzuni yoqadi
  document.documentElement.classList.toggle("dark", wa.colorScheme === "dark");
}
