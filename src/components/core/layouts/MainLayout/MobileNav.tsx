'use client';

import { SideBarUnRouteKey, useSidebar } from '@/contexts/SidebarContext';
import { BellIcon, BooksIcon, ChatCircleIcon, HouseLineIcon } from '@phosphor-icons/react';
import { usePathname, useRouter } from 'next/navigation';
import React from 'react';

export default function MobileNav() {
  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white dark:bg-[#1E1B26] h-[60px] [box-shadow:0_-1px_4px_rgba(0,0,0,0.2)] safe-area-inset-bottom">
      <div className="flex items-center justify-around h-full px-2">
        <MobileNavItem
          icon={<HouseLineIcon size={22} weight="light" />}
          activeIcon={<HouseLineIcon size={22} weight="fill" />}
          href="/explore"
          label="Home"
        />
        <MobileNavItem
          icon={<BooksIcon size={22} weight="light" />}
          activeIcon={<BooksIcon size={22} weight="fill" />}
          href="/albums"
          label="Albums"
        />
        <MobileNavUnRouteItem
          icon={<BellIcon size={22} weight="light" />}
          activeIcon={<BellIcon size={22} weight="fill" />}
          unRouteKey="notifications"
          label="Notifications"
        />
        <MobileNavUnRouteItem
          icon={<ChatCircleIcon size={22} weight="light" />}
          activeIcon={<ChatCircleIcon size={22} weight="fill" />}
          unRouteKey="messages"
          label="Messages"
        />
      </div>
    </div>
  );
}

interface MobileNavItemProps {
  icon: React.ReactNode;
  activeIcon: React.ReactNode;
  href?: string;
  label: string;
  unRouteKey?: SideBarUnRouteKey;
}

const MobileNavItem = ({ icon, activeIcon, href, label }: MobileNavItemProps) => {
  const pathname = usePathname();
  const isActive = href ? pathname === href : false;
  const router = useRouter();
  const { activeSideBarUnRoute } = useSidebar();
  const isActiveUnRoute = activeSideBarUnRoute === "notifications" || activeSideBarUnRoute === "messages";

  return (
    <button
      className="flex flex-col items-center justify-center py-1 w-1/4 h-full"
      onClick={() => href && router.push(href)}
    >
      <span className="dark:text-white mb-1">
        {isActive && !isActiveUnRoute ? activeIcon : icon}
      </span>
      <span className="text-[10px] dark:text-white truncate max-w-full">{label}</span>
    </button>
  );
};

const MobileNavUnRouteItem = ({ icon, activeIcon, unRouteKey, label }: MobileNavItemProps) => {
  const { activeSideBarUnRoute, setActiveSideBarUnRoute } = useSidebar();

  const handleSetActiveSideBarUnRoute = () => {
    if (unRouteKey) {
      if (activeSideBarUnRoute === unRouteKey) {
        setActiveSideBarUnRoute(null);
      } else {
        setActiveSideBarUnRoute(unRouteKey);
      }
    }
  };

  return (
    <button
      className="flex flex-col items-center justify-center py-1 w-1/4 h-full"
      onClick={handleSetActiveSideBarUnRoute}
    >
      <span className="dark:text-white mb-1">
        {activeSideBarUnRoute === unRouteKey ? activeIcon : icon}
      </span>
      <span className="text-[10px] dark:text-white truncate max-w-full">{label}</span>
    </button>
  );
}; 