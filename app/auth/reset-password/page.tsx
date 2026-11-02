"use client";

import { FormEvent, Suspense, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { toast } from "react-toastify";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import AuthShell, { authButtonClass, authInputClass, authLabelClass } from "@/components/shared/AuthShell";
import { resetPassword } from "@/lib/api/auth/password-reset";

type Errors = { password?: string; confirmation?: string };

function ResetPasswordForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const token = searchParams.get("token") ?? "";
    const [password, setPassword] = useState("");
    const [confirmation, setConfirmation] = useState("");
    const [errors, setErrors] = useState<Errors>({});
    const [showPassword, setShowPassword] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        const nextErrors: Errors = {};
        if (!password) nextErrors.password = "Password is required.";
        else if (password.length < 8) nextErrors.password = "Password must be at least 8 characters.";
        if (!confirmation) nextErrors.confirmation = "Please confirm your password.";
        else if (password !== confirmation) nextErrors.confirmation = "Passwords do not match.";
        setErrors(nextErrors);
        if (Object.keys(nextErrors).length > 0) return;

        if (!token) {
            toast.error("This password reset link is invalid.");
            return;
        }

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

    const toggle = (
        <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 transition-colors hover:cursor-pointer hover:text-[#716f49]"
            aria-label={showPassword ? "Hide password" : "Show password"}
        >
            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
        </button>
    );

    return (
        <AuthShell>
            <h1 className="mt-4 text-3xl font-bold tracking-tight text-slate-900">
                Reset <span className="text-[#716f49]">password</span>
            </h1>
            <p className="mt-2 text-xs leading-relaxed text-neutral-400">
                Choose a new password for your account.
            </p>

            <form onSubmit={handleSubmit} noValidate className="mt-8 space-y-5">
                <div>
                    <Label htmlFor="new-password" className={authLabelClass}>
                        New password
                    </Label>
                    <div className="relative mt-1.5">
                        <Input
                            id="new-password"
                            type={showPassword ? "text" : "password"}
                            autoComplete="new-password"
                            placeholder="At least 8 characters"
                            value={password}
                            onChange={(event) => {
                                setPassword(event.target.value);
                                setErrors((prev) => ({ ...prev, password: undefined }));
                            }}
                            className={`${authInputClass} pr-10`}
                            aria-invalid={Boolean(errors.password)}
                        />
                        {toggle}
                    </div>
                    {errors.password && <p className="mt-1 text-xs text-red-500">{errors.password}</p>}
                </div>

                <div>
                    <Label htmlFor="confirm-password" className={authLabelClass}>
                        Confirm password
                    </Label>
                    <Input
                        id="confirm-password"
                        type={showPassword ? "text" : "password"}
                        autoComplete="new-password"
                        placeholder="Re-enter your password"
                        value={confirmation}
                        onChange={(event) => {
                            setConfirmation(event.target.value);
                            setErrors((prev) => ({ ...prev, confirmation: undefined }));
                        }}
                        className={`mt-1.5 ${authInputClass}`}
                        aria-invalid={Boolean(errors.confirmation)}
                    />
                    {errors.confirmation && <p className="mt-1 text-xs text-red-500">{errors.confirmation}</p>}
                </div>

                <Button type="submit" disabled={isSubmitting} className={authButtonClass}>
                    {isSubmitting ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Resetting...
                        </>
                    ) : (
                        "Reset password"
                    )}
                </Button>

                <p className="pt-2 text-center text-xs text-neutral-400">
                    <Link href="/auth/login" className="font-semibold text-[#716f49] hover:underline">
                        Return to sign in
                    </Link>
                </p>
            </form>
        </AuthShell>
    );
}

export default function ResetPasswordPage() {
    return (
        <Suspense fallback={<main className="min-h-screen bg-[#F8FAFC]" />}>
            <ResetPasswordForm />
        </Suspense>
    );
}
