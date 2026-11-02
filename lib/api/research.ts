import type { ResearchData } from "@/lib/types/research";

const API_BASE_URL = process.env.NEXT_PUBLIC_SERVER_URL;

interface ResearchResponse extends ResearchData {
    success: boolean;
}

/** Shared in-flight request so papers + presentations sections reuse one fetch. */
let inFlight: { query: string; promise: Promise<ResearchData> } | null = null;

async function requestResearch(query: string): Promise<ResearchData> {
    if (!API_BASE_URL) {
        throw new Error("NEXT_PUBLIC_SERVER_URL is not configured.");
    }

    const endpoint = query
        ? `${API_BASE_URL}/api/research/search?q=${encodeURIComponent(query)}`
        : `${API_BASE_URL}/api/research`;
    const response = await fetch(endpoint, { cache: "no-store" });
    if (!response.ok) {
        throw new Error(`Unable to load research (HTTP ${response.status}).`);
    }

    const data = (await response.json()) as ResearchResponse;
    if (!data.success || !Array.isArray(data.papers) || !Array.isArray(data.presentations)) {
        throw new Error("The research response was invalid.");
    }

    return { papers: data.papers, presentations: data.presentations };
}

export function fetchResearch(query = ""): Promise<ResearchData> {
    if (!inFlight || inFlight.query !== query) {
        const promise = requestResearch(query).finally(() => {
            if (inFlight?.promise === promise) inFlight = null;
        });
        inFlight = { query, promise };
    }

    return inFlight.promise;
}
