"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { registerWeb, storeTokens } from "@/app/lib/api";

export default function RegisterPage() {
    const router = useRouter();
    const [form, setForm] = useState({ ism: "", email: "", parol: "" });
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setLoading(true);
        setError("");

        try {
            const data = await registerWeb(form.ism, form.email, form.parol);
            storeTokens(data);
            router.push("/profile");
        } catch (err) {
            setError(err instanceof Error ? err.message : "Ro‘yxatdan o‘tishda xatolik yuzaga keldi");
        } finally {
            setLoading(false);
        }
    }

    return (
        <main className="min-h-screen bg-slate-950 px-4 py-12 text-white">
            <div className="mx-auto max-w-md rounded-3xl border border-white/10 bg-white/5 p-8 shadow-2xl backdrop-blur">
                <div className="mb-8">
                    <p className="text-sm uppercase tracking-[0.24em] text-emerald-400">Marketplace</p>
                    <h1 className="mt-3 text-3xl font-bold">Ro‘yxatdan o‘ting</h1>
                </div>

                <form className="space-y-5" onSubmit={handleSubmit}>
                    <label className="block text-sm text-slate-200">
                        Ism
                        <input
                            className="mt-2 w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3 outline-none ring-0 transition focus:border-emerald-400"
                            value={form.ism}
                            onChange={(e) => setForm((prev) => ({ ...prev, ism: e.target.value }))}
                            placeholder="Ali Valiyev"
                            required
                        />
                    </label>

                    <label className="block text-sm text-slate-200">
                        Email
                        <input
                            type="email"
                            className="mt-2 w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3 outline-none transition focus:border-emerald-400"
                            value={form.email}
                            onChange={(e) => setForm((prev) => ({ ...prev, email: e.target.value }))}
                            placeholder="email@example.com"
                            required
                        />
                    </label>

                    <label className="block text-sm text-slate-200">
                        Parol
                        <input
                            type="password"
                            className="mt-2 w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3 outline-none transition focus:border-emerald-400"
                            value={form.parol}
                            onChange={(e) => setForm((prev) => ({ ...prev, parol: e.target.value }))}
                            placeholder="••••••••"
                            required
                        />
                    </label>

                    {error ? (
                        <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-200">
                            {error}
                        </div>
                    ) : null}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full rounded-xl bg-emerald-500 px-4 py-3 font-semibold text-slate-950 transition hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-70"
                    >
                        {loading ? "Yuborilmoqda..." : "Ro‘yxatdan o‘tish"}
                    </button>
                </form>

                <p className="mt-6 text-center text-sm text-slate-300">
                    Allaqachon hisobingiz bormi? {" "}
                    <Link href="/login" className="font-semibold text-emerald-400 hover:text-emerald-300">
                        Kiring
                    </Link>
                </p>
            </div>
        </main>
    );
}
