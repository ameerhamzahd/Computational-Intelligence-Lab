"use client";

import { FormEvent, Suspense, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { LockKeyhole, Loader2 } from "lucide-react";
import { toast } from "react-toastify";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { resetPassword } from "@/lib/api/auth/password-reset";

function ResetPasswordForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const token = searchParams.get("token") ?? "";
    const [password, setPassword] = useState("");
    const [confirmation, setConfirmation] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        if (password.length < 8) return toast.error("Password must be at least 8 characters.");
        if (password !== confirmation) return toast.error("Passwords do not match.");
        if (!token) return toast.error("This password reset link is invalid.");
        setIsSubmitting(true);
        try {
            await resetPassword(token, password);
            toast.success("Password reset successfully.");
            router.replace("/auth/login");
        } catch (error) {
            toast.error(error instanceof Error ? error.message : "Unable to reset your password.");
        } finally {
            setIsSubmitting(false);
        }

    }

    return (
        <main className="min-h-screen bg-[#F8FAFC] px-4 py-32 font-montserrat">
            <div className="mx-auto max-w-md rounded-3xl bg-white p-8 shadow-xl sm:p-10">
                <h1 className="text-3xl font-bold text-slate-900">Reset password</h1>
                <form onSubmit={handleSubmit} className="mt-8 space-y-5">
                    <div>
                        <Label htmlFor="new-password">New password</Label>
                        <div className="relative mt-1.5">
                            <LockKeyhole className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-neutral-500" />
                            <Input id="new-password" type="password" minLength={8} required value={password} onChange={(event) => setPassword(event.target.value)} className="h-10 pl-11" />
                        </div>
                    </div>
                    <div>
                        <Label htmlFor="confirm-password">Confirm password</Label>
                        <Input id="confirm-password" type="password" minLength={8} required value={confirmation} onChange={(event) => setConfirmation(event.target.value)} className="mt-1.5 h-10" />
                    </div>
                    <Button type="submit" disabled={isSubmitting} className="h-10 w-full bg-[#716f49] text-white hover:bg-[#5f5d3d]">
                        {isSubmitting ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Resetting...</> : "Reset password"}
                    </Button>
                    <Link href="/auth/login" className="block text-center text-sm font-semibold text-[#716f49] hover:underline">Return to sign in</Link>
                </form>
            </div>
        </main>
    );
}

export default function ResetPasswordPage() {
    return (
        <Suspense fallback={<main className="min-h-screen bg-[#F8FAFC]" />}>
            <ResetPasswordForm />
        </Suspense>
    );
}
