'use client'
import { SideBarUnRouteKey, useSidebar } from '@/contexts/SidebarContext'
import { Popover, PopoverContent, PopoverTrigger } from '@heroui/react'
import { BellIcon, BooksIcon, ChatCircleIcon, GearIcon, HouseLineIcon, MoonStarsIcon, SunIcon } from '@phosphor-icons/react'
import Image from 'next/image'
import { usePathname, useRouter } from 'next/navigation'
import React, { useEffect } from 'react'
import { useTheme } from 'next-themes'

export default function SideBar() {
    return (
        <div className="w-[88px] min-h-screen h-full p-3">
            <div className='flex flex-col justify-between h-full w-full bg-white dark:bg-[#1E1B26] rounded-[14px] [box-shadow:0_1px_4px_rgba(0,0,0,0.2)] p-[8px]'>
                <div className='flex flex-col gap-3'>
                    <ArtverseLogo />
                    <SidebarItem icon={<HouseLineIcon size={24} weight='light' />} activeIcon={<HouseLineIcon size={24} weight='fill' />} href='/explore' />
                    <SidebarItem icon={<BooksIcon size={24} weight='light' />} activeIcon={<BooksIcon size={24} weight='fill' />} href='/albums' />
                    <SideBarItemUnRoute icon={<BellIcon size={24} weight='light' />} activeIcon={<BellIcon size={24} weight='fill' />} unRouteKey='notifications' />
                    <SideBarItemUnRoute icon={<ChatCircleIcon size={24} weight='light' />} activeIcon={<ChatCircleIcon size={24} weight='fill' />} unRouteKey='messages' />
                </div>
                <div className='flex flex-col gap-3'>
                    <SwitchThemeItem />
                    <SettingItem />
                </div>
            </div>
        </div>
    )
}

export const ArtverseLogo = () => {
    return (
        <div className='w-full h-fit flex items-center justify-center p-3'>
            <Image src={'/images/logoIcon.png'} alt='Artverse Logo' width={40} height={40} className="md:hidden" />
            <Image src={'/images/artverse-logo.png'} alt='Artverse Logo' width={200} height={200} className="hidden md:block" />
        </div>
    )
}

type SidebarItemProps = {
    icon: React.ReactNode
    activeIcon: React.ReactNode
    href?: string
    unRouteKey?: SideBarUnRouteKey
}

export const SidebarItem = ({ icon, activeIcon, href }: SidebarItemProps) => {
    const pathname = usePathname()
    const isActive = href ? pathname === href : false
    const router = useRouter()
    const { activeSideBarUnRoute } = useSidebar()

    const isActiveUnRoute = activeSideBarUnRoute === "notifications" || activeSideBarUnRoute == "messages";



    return (
        <button className={`w-full h-fit flex items-center justify-center p-3 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-all`} onClick={() => href && router.push(href)}>
            <span className="text-gray-800 dark:text-white">
                {isActive && !isActiveUnRoute ? activeIcon : icon}
            </span>
        </button>
    )
}

export const SideBarItemUnRoute = ({ icon, activeIcon, unRouteKey }: SidebarItemProps) => {
    const { activeSideBarUnRoute, setActiveSideBarUnRoute } = useSidebar()

    const handleSetActiveSideBarUnRoute = () => {
        if (unRouteKey) {
            setActiveSideBarUnRoute(unRouteKey)
        }
        if (activeSideBarUnRoute === unRouteKey) {
            setActiveSideBarUnRoute(null)
        }
    }

    return (
        <button
            className={`w-full h-fit flex items-center justify-center p-3 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-all`}
            onClick={handleSetActiveSideBarUnRoute}>
            <span className="text-gray-800 dark:text-white">
                {activeSideBarUnRoute === unRouteKey ? activeIcon : icon}
            </span>
        </button>
    )
}

export const SettingItem = () => {
    const [isOpen, setIsOpen] = React.useState(false);

    const router = useRouter();

    return <Popover placement="right" onOpenChange={(open) => setIsOpen(open)} className=''>
        <PopoverTrigger>
            <div className='w-full h-fit flex items-center justify-center  cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-700 rounded-xl transition-all'>
                <div className='p-3'>
                    <GearIcon size={24} weight={isOpen ? 'fill' : 'light'} className="text-gray-800 dark:text-white" />
                </div>
            </div>
        </PopoverTrigger>
        <PopoverContent className="bg-white dark:bg-gray-800">
            <div className="px-3 py-4">
                <div className="text-small font-bold mb-2 text-gray-800 dark:text-white">Settings</div>
                <div className="flex flex-col gap-2">
                    <button className="text-tiny text-left hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-800 dark:text-white p-2 rounded-lg flex items-center gap-2 w-full" onClick={() => router.push('/settings?active=edit-profile')}>
                        Account Settings
                    </button>
                    <button className="text-tiny text-left hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-800 dark:text-white p-2 rounded-lg flex items-center gap-2 w-full"
                        onClick={() => router.push('/settings/privacy-security')}
                    >
                        Privacy & Security
                    </button>
                    <button className="text-tiny text-left hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-800 dark:text-white p-2 rounded-lg flex items-center gap-2 w-full">
                        Help & Support
                    </button>
                    <button className="text-tiny text-left hover:bg-gray-200 dark:hover:bg-gray-700 p-2 rounded-lg flex items-center gap-2 w-full text-red-500 dark:text-red-400"
                        onClick={() => {}}
                    >
                        Log Out
                    </button>
                </div>
            </div>
        </PopoverContent>
    </Popover>
}

export const SwitchThemeItem = () => {
    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = React.useState(false);

    // useEffect only runs on the client, so now we can safely show the UI
    useEffect(() => {
        setMounted(true);
    }, []);

    const toggleTheme = () => {
        setTheme(theme === 'dark' ? 'light' : 'dark');
    }

    // Don't render anything until mounted to prevent hydration mismatch
    if (!mounted) {
        return (
            <button className='w-full h-fit flex items-center justify-center p-3 cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-700 rounded-xl transition-all'>
                <div>
                    <MoonStarsIcon size={24} weight='fill' className="text-black dark:text-white" />
                </div>
            </button>
        );
    }

    return (
        <button
            onClick={toggleTheme}
            className='w-full h-fit flex items-center justify-center p-3 cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-700 rounded-xl transition-all'
        >
            <div>
                {theme === 'dark' ?
                    <SunIcon size={24} weight='fill' className="text-white" /> : <MoonStarsIcon size={24} weight='fill' className="text-black" />
                }
            </div>
        </button>
    );
}