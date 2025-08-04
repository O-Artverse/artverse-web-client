import AuthLayout from "@/components/core/layouts/AuthLayout"
import constants from "@/settings/constants";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function LayoutAuth({
    children,
}: {
    readonly children: React.ReactNode
}) {
    const token = (await cookies()).get(constants.ACCESS_TOKEN)?.value;
    if (token) {
        redirect('/explore');
    }
    return <AuthLayout>{children}</AuthLayout>
}
