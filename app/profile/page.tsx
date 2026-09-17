"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { clearTokens, getMe, logout, type UserProfile } from "@/app/lib/api";

export default function ProfilePage() {
    const [user, setUser] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadUser() {
            try {
                const data = await getMe();
                setUser(data);
            } catch {
                setUser(null);
            } finally {
                setLoading(false);
            }
        }

        loadUser();
    }, []);

    async function handleLogout() {
        await logout();
        window.location.href = "/login";
    }

    if (loading) {
        return <main className="min-h-screen bg-slate-950 px-6 py-24 text-white">Yuklanmoqda...</main>;
    }

    if (!user) {
        return (
            <main className="flex min-h-screen items-center justify-center bg-slate-950 px-6 py-24 text-white">
                <div className="max-w-md rounded-3xl border border-white/10 bg-white/5 p-8 text-center">
                    <h1 className="text-2xl font-bold">Kirish kerak</h1>
                    <p className="mt-3 text-slate-300">Ushbu sahifaga kirish uchun avval hisobga kiring.</p>
                    <div className="mt-6 flex justify-center gap-3">
                        <Link href="/login" className="rounded-xl bg-cyan-500 px-4 py-2 font-medium text-slate-950">Kirish</Link>
                        <Link href="/register" className="rounded-xl border border-white/10 px-4 py-2 font-medium">Ro‘yxatdan o‘tish</Link>
                    </div>
                </div>
            </main>
        );
    }

    return (
        <main className="min-h-screen bg-slate-950 px-6 py-12 text-white">
            <div className="mx-auto max-w-5xl">
                <header className="mb-8 flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 p-5">
                    <div>
                        <p className="text-sm uppercase tracking-[0.24em] text-violet-400">Account</p>
                        <h1 className="mt-2 text-2xl font-bold">{user.ism}</h1>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="rounded-xl border border-white/10 bg-slate-800 px-4 py-2 font-medium hover:bg-slate-700"
                    >
                        Chiqish
                    </button>
                </header>

                <div className="grid gap-6 md:grid-cols-3">
                    <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
                        <p className="text-sm text-slate-300">Email</p>
                        <p className="mt-2 text-xl font-semibold">{user.email}</p>
                    </div>
                    <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
                        <p className="text-sm text-slate-300">Telefon</p>
                        <p className="mt-2 text-xl font-semibold">{user.telefon || "Ko‘rsatilmagan"}</p>
                    </div>
                    <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
                        <p className="text-sm text-slate-300">Rol</p>
                        <p className="mt-2 text-xl font-semibold capitalize">{user.role}</p>
                    </div>
                </div>

                <section className="mt-10 rounded-3xl border border-white/10 bg-white/5 p-6">
                    <h2 className="text-xl font-semibold">Telegram ma’lumotlari</h2>
                    <div className="mt-4 grid gap-4 md:grid-cols-2">
                        <div className="rounded-xl bg-slate-900/80 p-4">
                            <p className="text-sm text-slate-300">Telegram ID</p>
                            <p className="mt-2 text-lg font-medium">{user.telegram_id ?? "-"}</p>
                        </div>
                        <div className="rounded-xl bg-slate-900/80 p-4">
                            <p className="text-sm text-slate-300">Telegram username</p>
                            <p className="mt-2 text-lg font-medium">{user.telegram_username ?? "-"}</p>
                        </div>
                    </div>
                </section>
            </div>
        </main>
    );
}
