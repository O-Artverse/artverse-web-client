import ArtDetail from "@/components/modules/Home/Explore/ArtDetail";

export default function Page({ params }: { params: { id: string } }) {
    return <ArtDetail id={params.id} />;
}
