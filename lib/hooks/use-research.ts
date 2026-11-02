"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { fetchResearch } from "@/lib/api/research";
import type { Paper, Presentation } from "@/lib/types/research";

/**
 * Loads research content once per section.
 * The API layer de-duplicates concurrent calls, so the overview page
 * (papers + presentations) only hits the network once.
 */
export function useResearch() {
    const searchParams = useSearchParams();
    const query = searchParams.get("search")?.trim() ?? "";
    const [papers, setPapers] = useState<Paper[]>([]);
    const [presentations, setPresentations] = useState<Presentation[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let active = true;

        fetchResearch(query)
            .then((data) => {
                if (!active) return;
                setPapers(data.papers);
                setPresentations(data.presentations);
            })
            .catch((cause: unknown) => {
                if (!active) return;
                setError(cause instanceof Error ? cause.message : "Unable to load research.");
            })
            .finally(() => {
                if (!active) return;
                setLoading(false);
            });

        return () => {
            active = false;
        };
    }, [query]);

    return { papers, presentations, loading, error };
}
