import AuthLayout from "@/components/core/layouts/AuthLayout"

export default async function LayoutAuth({
    children,
}: {
    readonly children: React.ReactNode
}) {
    return <AuthLayout>{children}</AuthLayout>
}
