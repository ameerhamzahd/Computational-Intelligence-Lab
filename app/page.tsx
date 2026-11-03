import Banner from "@/components/home/Banner";
import FaqSection from "@/components/home/FaqSection";
import FeaturedNews from "@/components/home/FeaturedNews";
import Introduction from "@/components/home/Introduction";
import Resources from "@/components/home/Resources";

export default function Home() {
  return (
    <div>
      <Banner />
      <Introduction />
      <Resources />
      <FeaturedNews />
      <FaqSection />
    </div>
  );
}
