"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState, type FormEvent } from "react";

import { useAuth } from "@/components/auth-provider";
import { Maydon, Tugma, XatoQutisi, Yuklanmoqda } from "@/components/form-ui";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function RoyxatdanOtishSahifa() {
  const { holat, royxatdanOtish } = useAuth();
  const router = useRouter();

  const [ism, setIsm] = useState("");
  const [email, setEmail] = useState("");
  const [parol, setParol] = useState("");
  const [xato, setXato] = useState<string | null>(null);
  const [yuborilmoqda, setYuborilmoqda] = useState(false);

  useEffect(() => {
    if (holat === "kirgan") router.replace("/");
  }, [holat, router]);

  if (holat === "yuklanmoqda" || holat === "kirgan") return <Yuklanmoqda />;

  async function yubor(e: FormEvent) {
    e.preventDefault();
    setXato(null);
    setYuborilmoqda(true);
    try {
      await royxatdanOtish(ism, email, parol);
      router.replace("/");
    } catch (err) {
      setXato(err instanceof Error ? err.message : "Ro'yxatdan o'tishda xatolik");
    } finally {
      setYuborilmoqda(false);
    }
  }

  return (
    <main className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center gap-4 p-4">
      <Card>
        <CardHeader>
          <CardTitle>Ro&apos;yxatdan o&apos;tish</CardTitle>
          <CardDescription>Yangi hisob yarating.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={yubor} className="grid gap-3" autoComplete="on">
            <Maydon
              id="ism"
              yorliq="Ism"
              required
              minLength={2}
              value={ism}
              onChange={(e) => setIsm(e.target.value)}
              placeholder="Ali Valiyev"
            />
            <Maydon
              id="email"
              yorliq="Email"
              type="email"
              autoComplete="username"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="email@example.com"
            />
            <Maydon
              id="parol"
              yorliq="Parol"
              type="password"
              autoComplete="new-password"
              required
              minLength={8}
              value={parol}
              onChange={(e) => setParol(e.target.value)}
              placeholder="••••••••"
            />
            <XatoQutisi>{xato}</XatoQutisi>
            <Tugma type="submit" disabled={yuborilmoqda}>
              {yuborilmoqda ? "Yuborilmoqda..." : "Ro'yxatdan o'tish"}
            </Tugma>
          </form>
          <p className="text-muted-foreground mt-4 text-center text-sm">
            Hisobingiz bormi?{" "}
            <Link href="/login" className="text-foreground font-medium underline underline-offset-4">
              Kiring
            </Link>
          </p>
        </CardContent>
      </Card>
    </main>
  );
}
