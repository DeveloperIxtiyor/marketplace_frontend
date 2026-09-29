import { apiSoraq } from "@/lib/api";

export interface Category {
  id: number;
  nom: string;
  slug: string;
  tavsif: string | null;
  rasm_url: string | null;
  tartib: number;
  faol: boolean;
  yaratilgan_vaqt: string | null;
}

export interface CategoryYaratish {
  nom: string;
  tavsif?: string | null;
  rasm_url?: string | null;
  tartib?: number;
}

export interface CategoryYangilash {
  nom?: string;
  tavsif?: string | null;
  rasm_url?: string | null;
  tartib?: number;
  faol?: boolean;
}

/**
 * Kategoriyalar ro'yxati.
 *
 * `faqatFaol=false` — arxivlanganlar ham keladi. Buni faqat admin paneli
 * so'raydi; oddiy katalog sahifasi standart qiymat bilan ishlaydi.
 * Bu endpoint ochiq, shuning uchun `auth: false`.
 */
export function categoryRoyxat(faqatFaol = true) {
  return apiSoraq<Category[]>(`/categories?faqat_faol=${faqatFaol}`, {
    auth: false,
  });
}

export function categorySlugOrqali(slug: string) {
  return apiSoraq<Category>(`/categories/slug/${encodeURIComponent(slug)}`, {
    auth: false,
  });
}

export function categoryYarat(malumot: CategoryYaratish) {
  return apiSoraq<Category>("/categories", { method: "POST", body: malumot });
}

export function categoryYangila(id: number, malumot: CategoryYangilash) {
  return apiSoraq<Category>(`/categories/${id}`, {
    method: "PATCH",
    body: malumot,
  });
}

/** Qatorni o'chirmaydi — backendda `faol=False` bo'ladi (arxivlash). */
export function categoryArxivla(id: number) {
  return apiSoraq<void>(`/categories/${id}`, { method: "DELETE" });
}

/** Arxivdan qaytarish — alohida endpoint emas, oddiy PATCH. */
export function categoryTikla(id: number) {
  return categoryYangila(id, { faol: true });
}