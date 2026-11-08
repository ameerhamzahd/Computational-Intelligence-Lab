import NewsNotices from "@/components/news/NewsSection";
import { getPublishedAnnouncements } from "@/lib/api/announcements";

export default async function NewsPage({
    searchParams,
}: {
    searchParams: Promise<{ notice?: string | string[] | undefined }>;
}) {
    const { notice } = await searchParams;
    const activeNoticeId = typeof notice === "string" ? notice : undefined;
    const announcements = await getPublishedAnnouncements();

    return (
        <main>
            <NewsNotices notices={announcements} activeNoticeId={activeNoticeId} />
        </main>
    );
}
