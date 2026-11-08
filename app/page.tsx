import Banner from "@/components/home/Banner";
import FaqSection from "@/components/home/FaqSection";
import FeaturedNews from "@/components/home/FeaturedNews";
import Introduction from "@/components/home/Introduction";
import Resources from "@/components/home/Resources";
import { getPublishedAnnouncements } from "@/lib/api/announcements";

export default async function Home() {
  const announcements = await getPublishedAnnouncements();

  return (
    <div>
      <Banner />
      <Introduction />
      <Resources />
      <FeaturedNews notices={announcements} />
      <FaqSection />
    </div>
  );
}
