import { API_URL } from "@/lib/api";

/** Backenddan kelgan nisbiy yo'lni brauzer ocha oladigan manzilga aylantiradi. */
export function mediaUrl(yol: string): string {
  // Kelajakda S3/CDN ga o'tsak, backend to'liq havola qaytaradi —
  // o'sha holatda hech narsa qo'shmaymiz.
  if (/^https?:\/\//i.test(yol)) return yol;
  return `${API_URL}${yol}`;
}

/* ------------------------------------------------- yuklashdan oldin */
// Bu qiymatlar backenddagi `MAX_RASM_MB` va `RUXSAT_ETILGAN` ning
// nusxasi. Ikki joyda yozilgani yomon, lekin maqsad boshqa: foydalanuvchi
// 20 MB faylni 2 daqiqa yuklab, keyin 400 xatosini olmasligi kerak.
//
// MUHIM: bu tekshiruv — QULAYLIK, xavfsizlik emas. Brauzerdagi kodni
// istalgan odam chetlab o'tadi. Haqiqiy tekshiruv backendda, `core/rasm.py`
// ichida. Qoida: "frontend tekshiruvi — xushmuomalalik, backend tekshiruvi — qalqon".
export const MAX_RASM_MB = 10;
export const RUXSAT_ETILGAN_TURLAR = ["image/jpeg", "image/png", "image/webp"];

/** Yaroqsiz bo'lsa — xato matni, yaroqli bo'lsa — null. */
export function faylniTekshir(fayl: File): string | null {
  if (!RUXSAT_ETILGAN_TURLAR.includes(fayl.type)) {
    return "Faqat JPEG, PNG yoki WebP rasm yuklash mumkin";
  }
  if (fayl.size > MAX_RASM_MB * 1024 * 1024) {
    const mb = (fayl.size / 1024 / 1024).toFixed(1);
    return `Rasm ${MAX_RASM_MB} MB dan katta (${mb} MB)`;
  }
  return null;
}