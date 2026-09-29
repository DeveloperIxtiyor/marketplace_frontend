import { NextResponse } from "next/server";
import { kategoriyalar } from "@/lib/kategoriyalar-store";

export async function DELETE(
  _req: Request,
  ctx: { params: Promise<{ id: string }> }
) {
  const { id } = await ctx.params;
  const index = kategoriyalar.findIndex((k) => k.id === Number(id));

  if (index === -1) {
    return NextResponse.json({ xato: "Topilmadi" }, { status: 404 });
  }

  kategoriyalar.splice(index, 1);
  return NextResponse.json({ ok: true });
}