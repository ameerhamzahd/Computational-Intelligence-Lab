"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { Mail, Loader2 } from "lucide-react";
import { toast } from "react-toastify";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { requestPasswordReset } from "@/lib/api/auth/password-reset";

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [sent, setSent] = useState(false);

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        if (!/^\S+@\S+\.\S+$/.test(email.trim())) {
            toast.error("Enter a valid email address.");
            return;
        }
        setIsSubmitting(true);
        try {
            await requestPasswordReset(email.trim());
            setSent(true);
        } catch (error) {
            toast.error(error instanceof Error ? error.message : "Unable to send the reset email.");
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <main className="min-h-screen bg-[#F8FAFC] px-4 py-32 font-montserrat">
            <div className="mx-auto max-w-md rounded-3xl bg-white p-8 shadow-xl sm:p-10">
                <h1 className="text-3xl font-bold text-slate-900">Forgot password?</h1>
                <p className="mt-3 text-sm leading-relaxed text-neutral-500">
                    Enter your account email and we&apos;ll send you a link to reset your password.
                </p>
                {sent ? (
                    <div className="mt-8 space-y-4">
                        <p className="rounded-lg bg-[#EAF0EA] p-4 text-sm text-[#356044]">
                            Check your email for the password reset link. If an account exists for that email, it will arrive shortly.
                        </p>
                        <Link href="/auth/login" className="block text-center text-sm font-semibold text-[#716f49] hover:underline">
                            Return to sign in
                        </Link>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="mt-8 space-y-5">
                        <div>
                            <Label htmlFor="reset-email">Email</Label>
                            <div className="relative mt-1.5">
                                <Mail className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-neutral-500" />
                                <Input id="reset-email" type="email" required value={email} onChange={(event) => setEmail(event.target.value)} className="h-10 pl-11" />
                            </div>
                        </div>
                        <Button type="submit" disabled={isSubmitting} className="h-10 w-full bg-[#716f49] text-white hover:bg-[#5f5d3d]">
                            {isSubmitting ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Sending...</> : "Send reset link"}
                        </Button>
                        <Link href="/auth/login" className="block text-center text-sm font-semibold text-[#716f49] hover:underline">
                            Return to sign in
                        </Link>
                    </form>
                )}
            </div>
        </main>
    );
}
