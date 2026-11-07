"use client";

// components/research/ResearchPapers.tsx
// deps: npm i motion lucide-react

import { useEffect, useRef, useState } from "react";
import type { MouseEvent } from "react";
import { fetchResearch } from "@/lib/api/research";
import { loadPdfThumb } from "@/lib/pdf-thumb";
import type { Presentation } from "@/lib/types/research";
import { AnimatePresence, motion } from "motion/react";
import {
    BookOpen,
    Check,
    FileText,
    Link,
    Lock,
    Share2,
    Unlock,
    X,
} from "lucide-react";

export type PaperType = "Conference" | "Journal" | "Magazine" | "Early Access";

export interface Paper {
    id: string;
    title: string;
    authors: string[];
    venue: string;
    year: number;
    type: PaperType;
    publisher: string;
    citedBy: number;
    topic: string;
    access: "open" | "locked";
    abstract?: string;
    htmlUrl?: string;
    pdfUrl?: string;
}

export const papers: Paper[] = [
    {
        id: "p1",
        title:
            "E-STGCN: Enhanced Spatial-Temporal Graph Convolutional Network for Road Traffic Forecasting",
        authors: ["Oleg Golovnin", "Nikita Perevozchikov"],
        venue: "2021 International Conference on Information Technology and Nanotechnology (ITNT)",
        year: 2021,
        type: "Conference",
        publisher: "IEEE",
        citedBy: 2,
        topic: "Graph Neural Networks",
        access: "locked",
        abstract: "Abstract text goes here.",
        htmlUrl: "#",
        pdfUrl: "#",
    },
    {
        id: "p2",
        title: "Integrating YOLO and DG-STGCN Systems for Enhanced Human Action Recognition",
        authors: [
            "Tzu-Shan Hsiao",
            "Hsun-Yuan Hou",
            "Po Ting Lin",
            "Ching-Yuan Chang",
            "Yung-Yao Chen",
            "Chao-Lung Yang",
        ],
        venue: "2024 International Conference on Advanced Robotics and Intelligent Systems (ARIS)",
        year: 2024,
        type: "Conference",
        publisher: "IEEE",
        citedBy: 3,
        topic: "Computer Vision",
        access: "locked",
        abstract: "Abstract text goes here.",
        htmlUrl: "#",
        pdfUrl: "#",
    },
    {
        id: "p3",
        title: "STGCN-Based Spatio-Temporal Evolution Modeling of Distribution System Disaster Chains",
        authors: ["Zongchao Yu", "Ming Wen", "Xintao Xie", "Bo Wen", "Jiaxi Li", "Haipeng Xie", "Jingqi Fan"],
        venue: "2025 IEEE 9th Conference on Energy Internet and Energy System Integration (EI2)",
        year: 2025,
        type: "Conference",
        publisher: "IEEE",
        citedBy: 0,
        topic: "Smart Grid",
        access: "locked",
        abstract: "Abstract text goes here.",
        htmlUrl: "#",
        pdfUrl: "#",
    },
    {
        id: "p4",
        title: "Sample Paper: Transformer Architectures for Low-Resource Language Understanding",
        authors: ["Author One", "Author Two"],
        venue: "IEEE Transactions on Neural Networks and Learning Systems",
        year: 2023,
        type: "Journal",
        publisher: "IEEE",
        citedBy: 14,
        topic: "Natural Language Processing",
        access: "open",
        abstract: "Abstract text goes here.",
        htmlUrl: "#",
        pdfUrl: "#",
    },
    {
        id: "p5",
        title: "Sample Paper: Federated Learning for Privacy-Preserving Intrusion Detection",
        authors: ["Author Three", "Author Four", "Author Five"],
        venue: "IEEE Access",
        year: 2024,
        type: "Journal",
        publisher: "IEEE",
        citedBy: 9,
        topic: "Cybersecurity",
        access: "open",
        abstract: "Abstract text goes here.",
        htmlUrl: "#",
        pdfUrl: "#",
    },
    {
        id: "p6",
        title: "Sample Paper: Consensus Mechanisms for Scalable Blockchain Networks",
        authors: ["Author Six", "Author Seven"],
        venue: "2022 IEEE International Conference on Blockchain (Blockchain)",
        year: 2022,
        type: "Conference",
        publisher: "IEEE",
        citedBy: 6,
        topic: "Blockchain",
        access: "locked",
        abstract: "Abstract text goes here.",
        htmlUrl: "#",
        pdfUrl: "#",
    },
    {
        id: "p7",
        title: "Sample Paper: Self-Supervised Representation Learning for Medical Imaging",
        authors: ["Author Eight", "Author Nine"],
        venue: "IEEE Journal of Biomedical and Health Informatics",
        year: 2025,
        type: "Early Access",
        publisher: "IEEE",
        citedBy: 1,
        topic: "Computer Vision",
        access: "locked",
        abstract: "Abstract text goes here.",
        htmlUrl: "#",
        pdfUrl: "#",
    },
    {
        id: "p8",
        title: "Sample Paper: A Survey of Explainable AI in Safety-Critical Systems",
        authors: ["Author Ten", "Author Eleven", "Author Twelve"],
        venue: "IEEE Computational Intelligence Magazine",
        year: 2023,
        type: "Magazine",
        publisher: "IEEE",
        citedBy: 21,
        topic: "Machine Learning",
        access: "open",
        abstract: "Abstract text goes here.",
        htmlUrl: "#",
        pdfUrl: "#",
    },
    {
        id: "p9",
        title: "Sample Paper: Evolutionary Neural Architecture Search with Multi-Objective Optimization",
        authors: ["Author Thirteen", "Author Fourteen"],
        venue: "2024 IEEE Congress on Evolutionary Computation (CEC)",
        year: 2024,
        type: "Conference",
        publisher: "IEEE",
        citedBy: 5,
        topic: "Neural Networks",
        access: "locked",
        abstract: "Abstract text goes here.",
        htmlUrl: "#",
        pdfUrl: "#",
    },
    {
        id: "p10",
        title: "Sample Paper: Reinforcement Learning for Adaptive Network Resource Allocation",
        authors: ["Author Fifteen", "Author Sixteen"],
        venue: "IEEE Transactions on Network and Service Management",
        year: 2022,
        type: "Journal",
        publisher: "IEEE",
        citedBy: 11,
        topic: "Machine Learning",
        access: "locked",
        abstract: "Abstract text goes here.",
        htmlUrl: "#",
        pdfUrl: "#",
    },
];

/* ----------------------------- helpers ----------------------------- */

const TINTS = [
    { from: "#F3F2E8", to: "#A3A171" }, // olive
    { from: "#EAF0E5", to: "#8FA382" }, // dark green
    { from: "#F1EFE1", to: "#88864F" }, // deep olive
];

// Widths (%) used to draw the faux body text of the paper sheet.
const LINE_WIDTHS = [100, 94, 98, 88, 100, 92, 96, 84, 100, 90, 97, 62];

function TextLines({ seed, count }: { seed: number; count: number }) {
    return (
        <div className="space-y-1.5">
            {Array.from({ length: count }).map((_, i) => (
                <div
                    key={i}
                    className="h-0.75 rounded-lg bg-neutral-300/80"
                    style={{ width: `${LINE_WIDTHS[(i + seed) % LINE_WIDTHS.length]}%` }}
                />
            ))}
        </div>
    );
}

/* ------------------------ stacked paper card ------------------------ */

function PaperCard({
    paper,
    index,
    onOpen,
    onHoverChange,
}: {
    paper: Paper;
    index: number;
    onOpen: (p: Paper) => void;
    onHoverChange: (paused: boolean) => void;
}) {
    const tint = TINTS[index % TINTS.length];
    const [copied, setCopied] = useState(false);
    const cardRef = useRef<HTMLElement>(null);
    const [thumb, setThumb] = useState<string | null>(null);

    // Only render the PDF once the card is (almost) on screen.
    useEffect(() => {
        const node = cardRef.current;
        if (!node) return;
        let cancelled = false;

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (!entry.isIntersecting) return;
                observer.disconnect();
                loadPdfThumb(paper.id).then((url) => {
                    if (!cancelled) setThumb(url);
                });
            },
            { rootMargin: "200px" }
        );
        observer.observe(node);

        return () => {
            cancelled = true;
            observer.disconnect();
        };
    }, [paper.id]);

    const share = (event: MouseEvent) => {
        event.stopPropagation();
        navigator.clipboard?.writeText(paper.htmlUrl ?? "");
        setCopied(true);
        window.setTimeout(() => setCopied(false), 1800);
    };

    const authors = paper.authors.slice(0, 4).join(" · ") + (paper.authors.length > 4 ? " · et al." : "");

    return (
        <motion.article
            ref={cardRef}
            whileHover={{ y: -8 }}
            transition={{ type: "spring", stiffness: 300, damping: 22 }}
            onPointerEnter={() => onHoverChange(true)}
            onPointerLeave={() => onHoverChange(false)}
            className="group relative h-85 w-64 shrink-0 cursor-pointer"
            onClick={() => onOpen(paper)}
        >
            {/* sheets stacked behind the first page */}
            <div className="absolute inset-0 origin-bottom-left -rotate-3 rounded-lg bg-[#ECEBDD] shadow-md ring-1 ring-black/5 transition-transform duration-300 group-hover:-rotate-6" />
            <div className="absolute inset-0 origin-bottom-right rotate-2 rounded-lg bg-[#F3F2E8] shadow-md ring-1 ring-black/5 transition-transform duration-300 group-hover:rotate-4" />

            {/* first page */}
            <div className="relative flex h-full flex-col overflow-hidden rounded-lg bg-white shadow-[0_14px_30px_-10px_rgba(31,50,28,0.45)] ring-1 ring-black/10">
                <div
                    className="h-1.5 w-full"
                    style={{ background: `linear-gradient(90deg, ${tint.from}, ${tint.to})` }}
                />

                {thumb ? (
                    <div className="relative flex-1 bg-white">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                            src={thumb}
                            alt={`First page of ${paper.title}`}
                            className="absolute inset-0 size-full object-cover object-top"
                            draggable={false}
                        />
                    </div>
                ) : (
                    <div className="flex flex-1 flex-col px-4 pt-3">
                        {/* running header */}
                        <div className="flex items-center justify-between gap-2 border-b border-neutral-200 pb-1.5 text-[8px] font-medium uppercase tracking-wider text-neutral-400">
                            <span className="truncate">
                                {paper.type} · {paper.year} · {paper.publisher}
                            </span>
                            <span className="max-w-24 shrink-0 truncate text-[#716f49]">{paper.topic}</span>
                        </div>

                        {/* title */}
                        <h3 className="mt-3 line-clamp-4 text-center font-serif text-[15px] font-bold leading-snug text-neutral-900">
                            {paper.title}
                        </h3>

                        {/* authors + venue */}
                        <p className="mt-2 line-clamp-2 text-center text-[9px] font-medium leading-snug text-neutral-700">
                            {authors}
                        </p>
                        <p className="mt-0.5 line-clamp-2 text-center text-[8px] italic leading-snug text-neutral-400">
                            {paper.venue}
                        </p>

                        {/* abstract */}
                        <p className="mt-3 line-clamp-3 text-justify font-serif text-[9px] leading-snug text-neutral-600">
                            <span className="font-bold italic text-neutral-800">Abstract—</span>
                            {paper.abstract ?? "No abstract available."}
                        </p>

                        {/* faux two-column body text */}
                        <div className="mt-3 grid grid-cols-2 gap-3">
                            <TextLines seed={index} count={8} />
                            <TextLines seed={index + 5} count={8} />
                        </div>
                    </div>
                )}

                {/* footer fades over the text, like a page curling away */}
                <div className="absolute inset-x-0 bottom-0 flex items-center justify-between gap-2 bg-linear-to-t from-white via-white/95 to-transparent px-4 pb-3 pt-10">
                    <div className="min-w-0">
                        <p className="flex items-center gap-1 text-[10px] font-semibold text-neutral-700">
                            {paper.access === "open" ? (
                                <Unlock className="size-3 text-[#716f49]" aria-hidden />
                            ) : (
                                <Lock className="size-3 text-[#716f49]" aria-hidden />
                            )}
                            {paper.access === "open" ? "Open access" : "Restricted"}
                        </p>
                        <p className="mt-0.5 text-[9px] text-neutral-400">Cited by {paper.citedBy}</p>
                    </div>

                    <div className="flex shrink-0 items-center gap-1.5">
                        <button
                            aria-label="Share paper"
                            onClick={share}
                            className="grid size-8 place-items-center rounded-lg border border-[#dddbd8] bg-[#F8FAFC] text-neutral-800 transition hover:bg-[#F3F2E8]"
                        >
                            {copied ? <Check className="size-3.5 text-emerald-700" /> : <Share2 className="size-3.5" />}
                        </button>
                        <button
                            aria-label="Open paper details"
                            onClick={(event) => {
                                event.stopPropagation();
                                onOpen(paper);
                            }}
                            className="grid size-8 place-items-center rounded-lg bg-neutral-900 text-white transition hover:bg-neutral-700"
                        >
                            <BookOpen className="size-3.5" />
                        </button>
                    </div>
                </div>
            </div>
        </motion.article>
    );
}

function MarqueeRow({
    items,
    duration,
    offset = 0,
    reverse = false,
    onOpen,
}: {
    items: Paper[];
    duration: number;
    offset?: number;
    reverse?: boolean;
    onOpen: (p: Paper) => void;
}) {
    const [paused, setPaused] = useState(false);
    // Repeat enough times to fill wide screens, then duplicate once for a seamless -50% -> 0 loop.
    const base = [...items, ...items, ...items];
    return (
        <div
            className="relative overflow-hidden py-8"
            style={{
                maskImage: "linear-gradient(90deg, transparent, #000 8%, #000 92%, transparent)",
                WebkitMaskImage: "linear-gradient(90deg, transparent, #000 8%, #000 92%, transparent)",
            }}
        >
            <div
                className={`rp-marquee flex w-max gap-16 px-4${reverse ? " rp-marquee-rtl" : ""}`}
                style={{
                    animationDuration: `${duration}s`,
                    animationDelay: `${offset}s`,
                    animationPlayState: paused ? "paused" : "running",
                }}
            >
                {[...base, ...base].map((p, i) => (
                    <PaperCard
                        key={`${p.id}-${i}`}
                        paper={p}
                        index={i}
                        onOpen={onOpen}
                        onHoverChange={setPaused}
                    />
                ))}
            </div>
        </div>
    );
}

/* ----------------------------- detail modal ---------------------------- */

function PaperModal({
    paper,
    presentation,
    onClose,
}: {
    paper: Paper | null;
    presentation?: Presentation;
    onClose: () => void;
}) {
    const apiBaseUrl = process.env.NEXT_PUBLIC_SERVER_URL;

    return (
        <AnimatePresence>
            {paper && (
                <motion.div
                    className="fixed inset-0 z-50 grid place-items-center bg-black/40 p-4 backdrop-blur-sm"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                >
                    <motion.div
                        onClick={(e) => e.stopPropagation()}
                        initial={{ opacity: 0, y: 24, scale: 0.96 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 12, scale: 0.97 }}
                        transition={{ type: "spring", stiffness: 260, damping: 24 }}
                        className="relative max-h-[calc(100dvh-2rem)] w-full max-w-xl overflow-y-auto overscroll-contain rounded-lg bg-white p-7 shadow-2xl"
                    >
                        <button
                            onClick={onClose}
                            aria-label="Close"
                            className="absolute right-4 top-4 grid size-9 place-items-center rounded-lg bg-neutral-100 hover:bg-neutral-200"
                        >
                            <X className="size-4" />
                        </button>
                        <p className="text-xs font-medium uppercase tracking-wider text-neutral-500">
                            {paper.type} · {paper.year} · {paper.publisher}
                        </p>
                        <h3 className="mt-2 pr-8 text-xl font-semibold leading-snug text-neutral-900">
                            {paper.title}
                        </h3>
                        <p className="mt-3 text-sm text-sky-800">{paper.authors.join("; ")}</p>
                        <p className="mt-1 text-sm text-neutral-600">{paper.venue}</p>
                        <p className="mt-5 text-sm leading-relaxed text-neutral-700">
                            {paper.abstract ?? "No abstract available."}
                        </p>
                        <div className="mt-6 flex flex-wrap gap-3">
                            <a
                                href={paper ? `${apiBaseUrl}/api/research/${paper.id}/pdf` : "#"}
                                download
                                className="flex items-center gap-2 rounded-lg bg-neutral-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-neutral-700"
                            >
                                <FileText className="size-4" /> PDF
                            </a>
                            <a
                                href={paper ? `${apiBaseUrl}/api/research/${paper.id}/preview` : "#"}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-2 rounded-lg border border-neutral-300 px-4 py-2.5 text-sm font-medium text-neutral-800 hover:bg-neutral-50"
                            >
                                <BookOpen className="size-4" /> Preview
                            </a>
                            {paper && presentation && (
                                <a
                                    href={`${apiBaseUrl}/api/research/${presentation.id}/presentation`}
                                    download
                                    className="flex items-center gap-2 rounded-lg bg-neutral-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-neutral-700"
                                >
                                    <FileText className="size-4" /> Presentation Slide
                                </a>
                            )}
                            <a
                                href={paper.htmlUrl ?? "#"}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-2 rounded-lg border border-neutral-300 px-4 py-2.5 text-sm font-medium text-neutral-800 hover:bg-neutral-50"
                            >
                                <Link className="size-4" /> LINK
                            </a>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}

/* -------------------------------- section ------------------------------- */

export default function Resources() {
    const [active, setActive] = useState<Paper | null>(null);
    const [researchPapers, setResearchPapers] = useState<Paper[]>([]);
    const [researchPresentations, setResearchPresentations] = useState<Presentation[]>([]);
    const [loadError, setLoadError] = useState<string | null>(null);

    useEffect(() => {
        let activeRequest = true;

        fetchResearch()
            .then(({ papers: fetchedPapers, presentations: fetchedPresentations }) => {
                if (!activeRequest) return;
                setResearchPapers(fetchedPapers.filter((paper) => paper.featured));
                setResearchPresentations(fetchedPresentations);
            })
            .catch((error: unknown) => {
                if (!activeRequest) return;
                setLoadError(error instanceof Error ? error.message : "Unable to load research.");
            });

        return () => {
            activeRequest = false;
        };
    }, []);

    const half = Math.ceil(researchPapers.length / 2);
    const top = researchPapers.slice(0, half);
    const bottom = researchPapers.slice(half).concat(researchPapers.slice(0, 2));

    return (
        <section id="research-papers" className="relative overflow-hidden bg-[#F8FAFC] pt-20">
            {/* marquee keyframes: top row left → right, bottom row right → left, seamless, respects reduced motion */}
            <style>{`
        @keyframes rp-ltr { from { transform: translateX(-50%); } to { transform: translateX(0); } }
        @keyframes rp-rtl { from { transform: translateX(0); } to { transform: translateX(-50%); } }
        .rp-marquee { animation-name: rp-ltr; animation-timing-function: linear; animation-iteration-count: infinite; will-change: transform; }
        .rp-marquee-rtl { animation-name: rp-rtl; }
        @media (prefers-reduced-motion: reduce) { .rp-marquee { animation: none; } }
      `}</style>

            {/* heading */}
            <motion.div
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                className="mx-auto max-w-3xl px-4 text-center"
            >
                <h2 className="mt-5 text-4xl font-bold tracking-tight text-neutral-900 sm:text-5xl">
                    Explore Research That Shapes{" "}
                    <span className="text-[#716f49]">
                        Intelligent Systems
                    </span>
                </h2>
                <p className="mx-auto mt-4 max-w-2xl text-base text-neutral-600 sm:text-lg">
                    Browse peer-reviewed papers from our lab across machine learning, computer vision,
                    cybersecurity and blockchain. Search, filter and dive straight into the full text.
                </p>
            </motion.div>

            {loadError && (
                <p className="mx-auto mt-8 max-w-2xl px-4 text-center text-sm text-red-700" role="alert">
                    {loadError}
                </p>
            )}

            {/* marquees (top moves left → right, bottom moves right → left) */}
            <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1, delay: 0.2 }}
                className="mt-10"
            >
                <MarqueeRow items={top} duration={70} onOpen={setActive} />
                <MarqueeRow items={bottom} duration={90} offset={-12} reverse onOpen={setActive} />
            </motion.div>

            <PaperModal
                paper={active}
                presentation={researchPresentations.find((presentation) =>
                    Boolean(active?.htmlUrl && active.htmlUrl === presentation.videoUrl)
                )}
                onClose={() => setActive(null)}
            />
        </section>
    );
}