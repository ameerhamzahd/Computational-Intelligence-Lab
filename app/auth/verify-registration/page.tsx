"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Loader2 } from "lucide-react";
import AuthShell from "@/components/shared/AuthShell";
import { verifyRegistration, VerifyRegistrationApiError } from "@/lib/api/auth/verify-registration";

function VerifyRegistrationContent() {
    const searchParams = useSearchParams();
    const token = searchParams.get("token");
    const [message, setMessage] = useState("Verifying your email address...");
    const [isSuccess, setIsSuccess] = useState(false);
    const hasStartedVerification = useRef(false);

    useEffect(() => {
        if (hasStartedVerification.current) return;
        hasStartedVerification.current = true;

        if (!token) {
            setMessage("This verification link is missing its token.");
            return;
        }

        verifyRegistration(token)
            .then((response) => {
                setIsSuccess(true);
                setMessage(response.message);
            })
            .catch((error) => {
                setMessage(
                    error instanceof VerifyRegistrationApiError
                        ? error.message
                        : "Unable to verify your registration. Please try again."
                );
            });
    }, [token]);

    return (
        <AuthShell>
            <h1 className="mt-4 text-3xl font-bold tracking-tight text-slate-900">
                {isSuccess ? "Email " : "Verify your "}
                <span className="text-[#716f49]">{isSuccess ? "verified" : "account"}</span>
            </h1>
            <div className="mt-8 space-y-5">
                {!isSuccess && token && <Loader2 className="h-6 w-6 animate-spin text-[#716f49]" />}
                <p className="rounded-lg bg-[#EAF0EA] p-4 text-xs leading-relaxed text-[#356044]">
                    {message}
                </p>
                <p className="pt-2 text-center text-xs text-neutral-400">
                    <Link href="/auth/login" className="font-semibold text-[#716f49] hover:underline">
                        Go to sign in
                    </Link>
                </p>
            </div>
        </AuthShell>
    );
}

export default function VerifyRegistrationPage() {
    return (
        <Suspense fallback={null}>
            <VerifyRegistrationContent />
        </Suspense>
    );
}
