import { NextResponse } from "next/server";
import { kategoriyalar } from "@/lib/kategoriyalar-store";

export async function GET() {
  return NextResponse.json(kategoriyalar);
}

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const nomi = String(body?.nomi ?? "").trim();

  if (!nomi) {
    return NextResponse.json({ xato: "Nomi majburiy" }, { status: 400 });
  }

  const yangi = {
    id: kategoriyalar.reduce((m, k) => Math.max(m, k.id), 0) + 1,
    nomi,
    tavsif: String(body?.tavsif ?? "").trim(),
    slug: nomi.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""),
    faol: true,
  };

  kategoriyalar.push(yangi);
  return NextResponse.json(yangi, { status: 201 });
}