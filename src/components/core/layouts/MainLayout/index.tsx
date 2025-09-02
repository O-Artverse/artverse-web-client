'use client'
import { useState, useEffect } from 'react'
import { useSidebar } from "@/contexts/SidebarContext"
import SideBar from "./Sidebar"
import Topbar from "./TopBar"
import MobileNav from './MobileNav'
import { List, X } from '@phosphor-icons/react'

interface MainLayoutProps {
  readonly children: React.ReactNode
}

function MainLayout({ children }: MainLayoutProps) {
  const { activeSideBarUnRoute } = useSidebar();
  const isNofiticatonOpen = activeSideBarUnRoute == "notifications";
  const isChatOpen = activeSideBarUnRoute == "messages";

  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  // Handle window resize and check if it's mobile view
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
      // Auto-close sidebar on mobile
      if (window.innerWidth < 768) {
        setIsSidebarOpen(false);
      } else {
        setIsSidebarOpen(true);
      }
    };

    // Set on initial load
    checkIfMobile();

    // Add event listener
    window.addEventListener('resize', checkIfMobile);

    // Cleanup
    return () => {
      window.removeEventListener('resize', checkIfMobile);
    };
  }, []);

  // Toggle sidebar
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="flex flex-row min-h-screen bg-white dark:bg-[#121212] relative">
      {/* Mobile sidebar toggle button */}
      <button
        className="md:hidden absolute top-1/2 left-[42px] -translate-x-1/2 -translate-y-1/2 z-50 bg-white dark:bg-[#1E1B26] rounded-full p-2 shadow-md"
        onClick={toggleSidebar}
      >
        {isSidebarOpen ? <X size={24} className="dark:text-white" /> : <List size={24} className="dark:text-white" />}
      </button>

      {/* Sidebar - conditionally shown based on state */}
      <div className={`${isSidebarOpen ? 'translate-x-0' : '-translate-x-full translate-y-0'} 
                      md:translate-x-0 transition-transform duration-300 ease-in-out
                      absolute md:relative z-40 md:z-auto`}>
        <SideBar />
      </div>

      {/* Mobile overlay when sidebar is open */}
      {isMobile && isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Main content */}
      <div className="flex flex-col flex-1 gap-3">
        <Topbar toggleSidebar={toggleSidebar} isSidebarOpen={isSidebarOpen} />
        <div className="relative w-full h-full pl-3 md:pl-0 !pb-3 pr-3 md:pb-0">
          {children}
          {isNofiticatonOpen && <NofiticationPanel />}
          {isChatOpen && <ChatPanel />}
        </div>

        {/* Mobile bottom navigation */}
        <MobileNav />
      </div>
    </div>
  )
}

export default MainLayout


//Tách thành file riêng
export const ChatPanel = () => {
  return <div className="absolute top-0 left-0 z-10 bg-white/70 h-[calc(100%-12px)] w-full md:w-[468px] p-3 rounded-xl [box-shadow:0_1px_4px_rgba(0,0,0,0.2)] backdrop-blur-sm max-h-[calc(100vh-160px)] md:max-h-[calc(100vh-100px)] overflow-y-auto">
    Chat
  </div>
}
//Tách thành file riêng
export const NofiticationPanel = () => {
  return <div className="absolute top-0 left-0 z-10 bg-white/70 h-[calc(100%-12px)] w-full md:w-[468px] p-3 rounded-xl [box-shadow:0_1px_4px_rgba(0,0,0,0.2)] backdrop-blur-sm max-h-[calc(100vh-160px)] md:max-h-[calc(100vh-100px)] overflow-y-auto">
    Notification
  </div>
} 