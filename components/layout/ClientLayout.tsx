"use client";

import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";
import { usePathname } from "next/navigation";
import { ToastContainer, Bounce } from "react-toastify";

const HIDE_CHROME_PREFIXES = ["/dashboard", "/auth"];

export default function ClientLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();

    const hideChrome = HIDE_CHROME_PREFIXES.some((prefix) =>
        pathname.startsWith(prefix)
    );

    return (
        <>
            <ToastContainer
                position="top-right"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick={false}
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="light"
                transition={Bounce}
            />

            {!hideChrome && (
                <header>
                    <Navbar />
                </header>
            )}

            <main>
                {children}
            </main>

            {!hideChrome && <Footer />}
        </>
    );
}