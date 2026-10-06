/**
 * Backenddagi /products endpointlarining TypeScript ko'rinishi.
 */

import { apiSoraq } from "@/lib/api";
import type { Rol } from "@/lib/auth-api";

/** Mahsulot javobi ichidagi qisqa kategoriya. */
export interface KategoriyaQisqa {
  id: number;
  nom: string;
  slug: string;
}

/** Mahsulot javobi ichidagi qisqa sotuvchi — backenddagi `UserJavob`. */
export interface EgaQisqa {
  id: number;
  ism: string;
  role: Rol;
}

/** Mahsulot rasmi — backenddagi `RasmJavob`. */
export interface Rasm {
  id: number;
  asosiy: boolean;
  tartib: number;
  /** Ishlov berilgandan keyingi o'lchamlar — `<img>` ga qo'yish uchun. */
  kenglik: number;
  balandlik: number;
  hajm: number;
  yaratilgan_vaqt: string | null;
  fayl_nomi: string;
  thumb_nomi: string;
  /** Nisbiy yo'l: "/media/products/abc.webp". `mediaUrl()` bilan ishlatiladi. */
  url: string;
  thumb_url: string;
}

export interface Product {
  id: number;
  nom: string;
  slug: string;
  tavsif: string | null;
  narx: number;
  zaxira: number;
  faol: boolean;
  kategoriya: KategoriyaQisqa;
  egasi: EgaQisqa;
  yaratilgan_vaqt: string | null;
  /** Backend tartiblab beradi: asosiy rasm har doim birinchi. */
  rasmlar: Rasm[];
}

export interface ProductYaratish {
  nom: string;
  tavsif?: string | null;
  narx: number;
  zaxira?: number;
  category_id: number;
}

export interface ProductYangilash {
  nom?: string;
  tavsif?: string | null;
  narx?: number;
  zaxira?: number;
  category_id?: number;
  faol?: boolean;
}

/** Ochiq katalog. `categoryId` berilsa — faqat shu bo'lim. */
export function productRoyxat(categoryId?: number) {
  const q = categoryId ? `?category_id=${categoryId}` : "";
  return apiSoraq<Product[]>(`/products${q}`, { auth: false });
}

export function productSlugOrqali(slug: string) {
  return apiSoraq<Product>(`/products/slug/${encodeURIComponent(slug)}`, {
    auth: false,
  });
}

/** Seller paneli uchun: o'z mahsulotlarim, arxivlanganlari bilan. */
export function meningMahsulotlarim() {
  return apiSoraq<Product[]>("/products/mening");
}

export function productYarat(malumot: ProductYaratish) {
  return apiSoraq<Product>("/products", { method: "POST", body: malumot });
}

export function productYangila(id: number, malumot: ProductYangilash) {
  return apiSoraq<Product>(`/products/${id}`, {
    method: "PATCH",
    body: malumot,
  });
}

export function productArxivla(id: number) {
  return apiSoraq<void>(`/products/${id}`, { method: "DELETE" });
}

export function productTikla(id: number) {
  return productYangila(id, { faol: true });
}

/* ------------------------------------------------------------ rasmlar */

/**
 * Rasm yuklash — yagona joy, u JSON emas, `FormData` yuboradi.
 *
 * Maydon nomi "fayl" — backenddagi `fayl: UploadFile = File(...)` bilan
 * AYNAN bir xil bo'lishi kerak, aks holda 422 keladi.
 */
export function rasmYukla(productId: number, fayl: File) {
  const forma = new FormData();
  forma.append("fayl", fayl);
  return apiSoraq<Rasm>(`/products/${productId}/rasmlar`, {
    method: "POST",
    body: forma,
  });
}

export function rasmAsosiyQil(productId: number, rasmId: number) {
  return apiSoraq<Rasm>(`/products/${productId}/rasmlar/${rasmId}`, {
    method: "PATCH",
    body: { asosiy: true },
  });
}

export function rasmOchir(productId: number, rasmId: number) {
  return apiSoraq<void>(`/products/${productId}/rasmlar/${rasmId}`, {
    method: "DELETE",
  });
}

/**
 * Katalogda ko'rsatiladigan rasm.
 *
 * Backend `asosiy` ni birinchi qilib tartiblaydi, shuning uchun `[0]`
 * yetarli. Lekin shunday deb YOZIB qo'yish kerak: kelajakda kimdir
 * tartibni o'zgartirsa, bu funksiya buzilishi kerak, 10 ta sahifa emas.
 */
export function asosiyRasm(mahsulot: Product): Rasm | null {
  return mahsulot.rasmlar[0] ?? null;
}