import {
    VerifyRegistrationApiResponse,
} from "@/lib/types/auth/register";

const API_BASE_URL = process.env.NEXT_PUBLIC_SERVER_URL;

export class VerifyRegistrationApiError extends Error {
    status: number;

    constructor(message: string, status: number) {
        super(message);
        this.name = "VerifyRegistrationApiError";
        this.status = status;
    }
}

export async function verifyRegistration(
    token: string
): Promise<VerifyRegistrationApiResponse> {
    let response: Response;

    try {
        response = await fetch(`${API_BASE_URL}/api/verify-registration`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ token }),
        });
    } catch {
        throw new VerifyRegistrationApiError("Network error. Check your connection and try again.", 0);
    }

    let data: VerifyRegistrationApiResponse;
    try {
        data = (await response.json()) as VerifyRegistrationApiResponse;
    } catch {
        throw new VerifyRegistrationApiError("Unexpected server response.", response.status);
    }

    if (!response.ok || !data.success) {
        throw new VerifyRegistrationApiError(
            data.message ?? "Unable to verify your registration.",
            response.status
        );
    }

    return data;
}
