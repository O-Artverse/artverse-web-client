import ExplorePage from "@/components/modules/Home/Explore";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: 'Explore Art',
  description: 'Discover amazing artworks from talented artists worldwide. Browse through paintings, sculptures, digital art, photography, and more.',
  openGraph: {
    title: 'Explore Art | Artverse',
    description: 'Discover amazing artworks from talented artists worldwide. Browse through paintings, sculptures, digital art, photography, and more.',
  },
};

export default function Page() {
  return (
    <div className="h-full overflow-y-auto rounded-xl scrollbar-hide">
      <ExplorePage />
    </div>
  );
}
