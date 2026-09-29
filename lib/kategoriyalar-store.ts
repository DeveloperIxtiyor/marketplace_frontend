export type Kategoriya = {
  id: number;
  nomi: string;
  tavsif: string;
  slug: string;
  faol: boolean;
};

const g = globalThis as unknown as { __kategoriyalar?: Kategoriya[] };

export const kategoriyalar: Kategoriya[] = (g.__kategoriyalar ??= [
  { id: 1, nomi: "Telefonlar", tavsif: "Smartfonlar va telefonlar", slug: "telefonlar", faol: true },
  { id: 2, nomi: "Noutbuklar", tavsif: "Noutbuklar va kompyuterlar", slug: "noutbuklar", faol: true },
  { id: 3, nomi: "Aksessuarlar", tavsif: "Qo'shimcha aksessuarlar", slug: "aksessuarlar", faol: true },
]);