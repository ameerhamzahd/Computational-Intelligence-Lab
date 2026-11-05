"use client";

import type { ReactNode } from "react";
import { motion } from "motion/react";

/** Shared input styling for all auth pages (matches the login form). */
export const authInputClass =
    "h-11 w-full rounded-lg border border-[#dddbd8] bg-[#F8FAFC] px-3.5 text-sm font-medium text-slate-900 shadow-none placeholder:text-neutral-400 focus-visible:border-[#716f49] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#716f49]/20";

export const authLabelClass = "text-xs font-semibold text-slate-900";

export const authButtonClass =
    "h-11 w-full cursor-pointer rounded-lg bg-[#716f49] text-sm font-medium text-white shadow-[0_14px_24px_-8px_#716f49] transition-colors duration-200 hover:bg-[#1F321C] disabled:opacity-70";

export default function AuthShell({ children }: { children: ReactNode }) {
    return (
        <section className="flex min-h-screen items-center justify-center bg-[#F8FAFC] px-4 py-16 font-montserrat sm:px-6">
            <div className="w-full max-w-5xl rounded-lg bg-white p-2 shadow-xl shadow-black/5">
                <div className="grid md:grid-cols-2">
                    {/* Left: soft gradient panel */}
                    <div className="relative hidden min-h-140 overflow-hidden rounded-lg bg-[#716f49]/10 md:block">
                        <motion.div
                            className="absolute -top-16 left-1/4 h-72 w-72 rounded-lg bg-[#716f49]/30 blur-3xl"
                            animate={{ x: [0, 20, 0], y: [0, 15, 0] }}
                            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                        />
                        <motion.div
                            className="absolute bottom-10 -left-10 h-80 w-80 rounded-lg bg-[#716f49] opacity-80 blur-3xl"
                            animate={{ x: [0, 25, 0], y: [0, -20, 0] }}
                            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
                        />
                        <motion.div
                            className="absolute bottom-0 right-0 h-64 w-64 rounded-lg bg-[#1F321C] opacity-70 blur-3xl"
                            animate={{ x: [0, -20, 0], y: [0, 10, 0] }}
                            transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
                        />
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.35),transparent_60%)]" />

                        <div className="relative flex h-full min-h-140 flex-col justify-between p-8">
                            <p className="text-base font-semibold tracking-tight text-slate-900">
                                Computational Intelligence Lab
                            </p>
                            <div>
                                <p className="text-sm text-white">You can easily</p>
                                <h2 className="mt-2 text-3xl font-semibold leading-tight tracking-tight">
                                    Publish, discover, and collaborate on research.
                                </h2>
                            </div>
                        </div>
                    </div>

                    {/* Right: form */}
                    <div className="flex flex-col justify-center px-6 py-10 sm:px-12">
                        <div className="mx-auto w-full max-w-sm">{children}</div>
                    </div>
                </div>
            </div>
        </section>
    );
}
