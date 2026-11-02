const API_BASE_URL = process.env.NEXT_PUBLIC_SERVER_URL;

export interface PublicStats {
    papers: number;
    presentations: number;
    researchers: number;
}

interface PublicStatsResponse {
    success: boolean;
    stats: PublicStats;
}

export async function fetchPublicStats(): Promise<PublicStats> {
    if (!API_BASE_URL) {
        throw new Error("NEXT_PUBLIC_SERVER_URL is not configured.");
    }

    const response = await fetch(`${API_BASE_URL}/api/stats`, { cache: "no-store" });
    if (!response.ok) {
        throw new Error(`Unable to load public statistics (HTTP ${response.status}).`);
    }

    const data = (await response.json()) as PublicStatsResponse;
    if (
        !data.success ||
        !data.stats ||
        !Number.isInteger(data.stats.papers) ||
        !Number.isInteger(data.stats.presentations) ||
        !Number.isInteger(data.stats.researchers)
    ) {
        throw new Error("The public statistics response was invalid.");
    }

    return data.stats;
}
