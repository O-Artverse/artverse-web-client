interface AuthLayoutProps {
    readonly children: React.ReactNode
}

function AuthLayout({ children }: AuthLayoutProps) {
    return <main className="!bg-transparent">{children}</main>
}

export default AuthLayout
