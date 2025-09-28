import ArtDetail from "@/components/modules/Home/Explore/ArtDetail";

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
    const resolvedParams = await params;
    return <ArtDetail id={resolvedParams.id} />;
}
