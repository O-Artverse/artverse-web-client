interface MainLayoutProps {
    readonly children: React.ReactNode
}

function MainLayout({ children }: MainLayoutProps) {
    return (
        <div className="flex flex-col min-h-screen bg-background text-foreground">
            {/* <Header /> */}

            <main className="flex-1 w-full max-w-[1440px] mx-auto mt-0 md:mt-5 px-4">
                {children}
            </main>

            {/* <Footer /> */}
        </div>
    )
}

export default MainLayout
