/**
 * Ko'rsatish uchun formatlash funksiyalari.
 */

/** 15000000 -> "15 000 000 so'm" */
export function narxFormat(narx: number): string {
  return `${new Intl.NumberFormat("uz-UZ").format(narx)} so'm`;
}

/** Zaxira holatini odam o'qiydigan matnga aylantiradi. */
export function zaxiraMatni(zaxira: number): string {
  if (zaxira <= 0) return "Tugagan";
  if (zaxira <= 3) return `Oxirgi ${zaxira} dona`;
  return "Mavjud";
}

/** "2026-09-26T11:16:00Z" -> "26.09.2026" */
export function sanaFormat(sana: string | null): string {
  if (!sana) return "—";
  const d = new Date(sana);
  if (Number.isNaN(d.getTime())) return "—";
  return new Intl.DateTimeFormat("uz-UZ", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(d);
}