/**
 * Backenddagi /products endpointlarining TypeScript ko'rinishi.
 */

import { apiSoraq } from "@/lib/api";
import type { Rol } from "@/lib/auth-api";

export interface KategoriyaQisqa {
  id: number;
  nom: string;
  slug: string;
}

export interface EgaQisqa {
  id: number;
  ism: string;
  role: Rol;
}

export interface Product {
  id: number;
  nom: string;
  slug: string;
  tavsif: string | null;
  narx: number;
  zaxira: number;
  rasm_url: string | null;
  faol: boolean;
  kategoriya: KategoriyaQisqa;
  egasi: EgaQisqa;
  yaratilgan_vaqt: string | null;
}

export interface ProductYaratish {
  nom: string;
  tavsif?: string | null;
  narx: number;
  zaxira?: number;
  rasm_url?: string | null;
  category_id: number;
}

export interface ProductYangilash {
  nom?: string;
  tavsif?: string | null;
  narx?: number;
  zaxira?: number;
  rasm_url?: string | null;
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