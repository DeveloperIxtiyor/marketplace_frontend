"use client";

import Link from "next/link";

import { useAuth } from "@/components/auth-provider";
import { Tugma, Yuklanmoqda } from "@/components/form-ui";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function Home() {
  const { holat, profil, platforma, xato } = useAuth();

  if (holat === "yuklanmoqda") return <Yuklanmoqda />;

  return (
    <main className="mx-auto flex w-full max-w-md flex-1 flex-col gap-4 p-4">
      <div>
        <h1 className="font-heading text-2xl font-semibold">Marketplace</h1>
        <p className="text-muted-foreground text-sm">
          Platforma:{" "}
          <span className="font-mono">
            {platforma === "telegram" ? "Telegram Mini App" : "brauzer"}
          </span>
        </p>
      </div>

      {holat === "kirgan" && profil ? (
        <Card>
          <CardHeader>
            <CardTitle>Salom, {profil.ism}!</CardTitle>
            <CardDescription>
              Rolingiz: <span className="font-mono">{profil.role}</span>
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-2">
            <Link href="/mahsulotlar">
              <Tugma>Mahsulotlar</Tugma>
            </Link>
            <Link href="/kategoriyalar">
              <Tugma>Kategoriyalar</Tugma>
            </Link>
            <Link href="/profile">
              <Tugma variant="ikkilamchi">Profilim</Tugma>
            </Link>
            {profil.role === "admin" ? (
              <Link href="/admin/kategoriyalar">
                <Tugma variant="ikkilamchi">Admin paneli</Tugma>
              </Link>
            ) : null}
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Xush kelibsiz</CardTitle>
            <CardDescription>
              Xarid qilish uchun hisobingizga kiring.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-2">
            {xato ? (
              <p className="text-destructive text-sm">{xato}</p>
            ) : null}
            <Link href="/login">
              <Tugma>Kirish</Tugma>
            </Link>
            <Link href="/register">
              <Tugma variant="ikkilamchi">Ro&apos;yxatdan o&apos;tish</Tugma>
            </Link>
            <Link href="/mahsulotlar">
              <Tugma>Mahsulotlar</Tugma>
            </Link>
            <Link href="/kategoriyalar">
              <Tugma variant="ikkilamchi">
                Kategoriyalarni ko&apos;rish
              </Tugma>
            </Link>
          </CardContent>
        </Card>
      )}
    </main>
  );
}