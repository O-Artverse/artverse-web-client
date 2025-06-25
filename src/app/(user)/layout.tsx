import MainLayout from "@/components/core/layouts/MainLayout"

export default async function LayoutUser({
    children,
}: {
    readonly children: React.ReactNode
}) {
    return <MainLayout>{children}</MainLayout>
}
