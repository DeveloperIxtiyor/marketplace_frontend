"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { loginWeb, storeTokens } from "@/app/lib/api";

export default function LoginPage() {
    const router = useRouter();
    const [form, setForm] = useState({ email: "", parol: "" });
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setLoading(true);
        setError("");

        try {
            const data = await loginWeb(form.email, form.parol);
            storeTokens(data);
            router.push("/profile");
        } catch (err) {
            setError(err instanceof Error ? err.message : "Kirishda xatolik yuzaga keldi");
        } finally {
            setLoading(false);
        }
    }

    return (
        <main className="min-h-screen bg-slate-950 px-4 py-12 text-white">
            <div className="mx-auto max-w-md rounded-3xl border border-white/10 bg-white/5 p-8 shadow-2xl backdrop-blur">
                <div className="mb-8">
                    <p className="text-sm uppercase tracking-[0.24em] text-cyan-400">Welcome back</p>
                    <h1 className="mt-3 text-3xl font-bold">Kabinetga kirish</h1>
                </div>

                <form className="space-y-5" onSubmit={handleSubmit}>
                    <label className="block text-sm text-slate-200">
                        Email
                        <input
                            type="email"
                            className="mt-2 w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3 outline-none transition focus:border-cyan-400"
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
                            className="mt-2 w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3 outline-none transition focus:border-cyan-400"
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
                        className="w-full rounded-xl bg-cyan-500 px-4 py-3 font-semibold text-slate-950 transition hover:bg-cyan-400 disabled:cursor-not-allowed disabled:opacity-70"
                    >
                        {loading ? "Kirish..." : "Kirish"}
                    </button>
                </form>

                <p className="mt-6 text-center text-sm text-slate-300">
                    Hisobingiz yo‘qmi? {" "}
                    <Link href="/register" className="font-semibold text-cyan-400 hover:text-cyan-300">
                        Ro‘yxatdan o‘ting
                    </Link>
                </p>
            </div>
        </main>
    );
}
