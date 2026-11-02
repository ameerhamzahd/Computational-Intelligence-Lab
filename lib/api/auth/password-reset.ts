const API_BASE_URL = process.env.NEXT_PUBLIC_SERVER_URL;

export async function requestPasswordReset(email: string): Promise<string> {
    const response = await fetch(`${API_BASE_URL}/api/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
    });
    const data = (await response.json()) as { success?: boolean; message?: string };
    if (!response.ok || !data.success) {
        throw new Error(data.message ?? "Unable to send the reset email.");
    }
    return data.message ?? "If an account exists for that email, a password reset link has been sent.";
}

export async function resetPassword(token: string, password: string): Promise<string> {
    const response = await fetch(`${API_BASE_URL}/api/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
    });
    const data = (await response.json()) as { success?: boolean; message?: string };
    if (!response.ok || !data.success) {
        throw new Error(data.message ?? "Unable to reset your password.");
    }
    return data.message ?? "Password reset successfully.";
}
