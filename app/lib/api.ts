const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "https://simple-gown-justify.ngrok-free.dev";

export type TokenResponse = {
    access_token: string;
    refresh_token: string;
    token_type: string;
};

export type UserProfile = {
    id: number;
    ism: string;
    email: string;
    telefon?: string | null;
    telegram_id?: number | null;
    telegram_username?: string | null;
    avatar_url?: string | null;
    role: "buyer" | "seller" | "admin" | string;
};

export function getStoredTokens(): TokenResponse | null {
    if (typeof window === "undefined") return null;

    const raw = localStorage.getItem("marketplace_tokens");
    if (!raw) return null;

    try {
        return JSON.parse(raw) as TokenResponse;
    } catch {
        return null;
    }
}

export function storeTokens(tokens: TokenResponse) {
    if (typeof window === "undefined") return;
    localStorage.setItem("marketplace_tokens", JSON.stringify(tokens));
}

export function clearTokens() {
    if (typeof window === "undefined") return;
    localStorage.removeItem("marketplace_tokens");
}

export function buildAuthHeaders(token?: string) {
    const headers: Record<string, string> = {
        Accept: "application/json",
    };

    if (token) {
        headers.Authorization = `Bearer ${token}`;
    }

    return headers;
}

export async function apiFetch<T>(
    path: string,
    init: RequestInit = {},
    auth = false,
): Promise<T> {
    const token = auth ? getStoredTokens()?.access_token : undefined;
    const response = await fetch(`${API_BASE_URL}${path}`, {
        ...init,
        headers: {
            ...(init.headers || {}),
            ...buildAuthHeaders(token),
            ...(init.body instanceof FormData ? {} : { "Content-Type": "application/json" }),
        },
    });

    const text = await response.text();
    const data = text ? JSON.parse(text) : null;

    if (!response.ok) {
        const detail = Array.isArray(data?.detail) ? data.detail : data;
        throw new Error(typeof detail === "string" ? detail : JSON.stringify(detail ?? { message: "Request failed" }));
    }

    return data as T;
}

export async function registerWeb(ism: string, email: string, parol: string) {
    return apiFetch<TokenResponse>("/auth/register", {
        method: "POST",
        body: JSON.stringify({ ism, email, parol }),
    });
}

export async function loginWeb(email: string, parol: string) {
    return apiFetch<TokenResponse>("/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, parol }),
    });
}

export async function getMe() {
    return apiFetch<UserProfile>("/auth/me", {}, true);
}

export async function updateProfile(payload: { ism?: string; telefon?: string }) {
    return apiFetch<UserProfile>("/auth/me", {
        method: "PATCH",
        body: JSON.stringify(payload),
    }, true);
}

export async function refreshToken(refresh_token: string) {
    return apiFetch<TokenResponse>("/auth/refresh", {
        method: "POST",
        body: JSON.stringify({ refresh_token }),
    });
}

export async function logout() {
    try {
        await apiFetch("/auth/logout", { method: "POST" }, true);
    } finally {
        clearTokens();
    }
}
