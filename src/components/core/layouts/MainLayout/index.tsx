'use client'
import { useSidebar } from "@/contexts/SidebarContext"
import SideBar from "./Sidebar"
import Topbar from "./TopBar"

interface MainLayoutProps {
  readonly children: React.ReactNode
}

function MainLayout({ children }: MainLayoutProps) {

  const { activeSideBarUnRoute } = useSidebar();
  const isNofiticatonOpen = activeSideBarUnRoute == "notifications";
  const isChatOpen = activeSideBarUnRoute == "messages";

  return (
    <div className="flex flex-row min-h-screen bg-white dark:bg-[#121212]">
      <SideBar />
      <div className="flex flex-col flex-1">
        <Topbar />
        <div className="relative w-full h-full">{children}
          {isNofiticatonOpen && <NofiticationPanel />}
          {isChatOpen && <ChatPanel />}
        </div>
      </div>
    </div>
  )
}

export default MainLayout


//Tách thành file riêng
export const ChatPanel = () => {
  return <div className="absolute top-0 left-0 z-10 bg-white/70 h-[calc(100%-12px)] w-[468px] p-3 rounded-lg [box-shadow:0_1px_4px_rgba(0,0,0,0.2)] backdrop-blur-sm">
    Chat
  </div>
}
//Tách thành file riêng
export const NofiticationPanel = () => {
  return <div className="absolute top-0 left-0 z-10 bg-white/70 h-[calc(100%-12px)] w-[468px] p-3 rounded-lg [box-shadow:0_1px_4px_rgba(0,0,0,0.2)] backdrop-blur-sm">
    Notification
  </div>
} 