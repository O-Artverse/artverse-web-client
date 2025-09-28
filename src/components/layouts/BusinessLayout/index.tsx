'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAppSelector } from '@/store/hooks';
import {
  House,
  Palette,
  Users,
  Calendar,
  ChartBar,
  Gear,
  Buildings,
  Plus,
  List,
  CaretDown,
  Moon,
  Sun,
  SignOut,
  UserCircle,
  Desktop
} from '@phosphor-icons/react';
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Avatar,
  Switch
} from '@heroui/react';
import { useRouter } from 'next/navigation';
import { getUserAvatarUrl } from '@/utils/imageUtils';
import { useTheme } from 'next-themes';
import { useEffect } from 'react';

interface BusinessLayoutProps {
  children: React.ReactNode;
}

const BusinessLayout: React.FC<BusinessLayoutProps> = ({ children }) => {
  const pathname = usePathname();
  const router = useRouter();
  const { user } = useAppSelector((state) => state.auth);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // useEffect only runs on the client, so now we can safely show the UI
  useEffect(() => {
    setMounted(true);
  }, []);

  const isArtist = user?.businessType === 'ARTIST';
  const isOrganization = user?.businessType === 'ORGANIZATION';

  const artistNavItems = [
    {
      icon: House,
      label: 'Dashboard',
      href: '/business',
      active: pathname === '/business'
    },
    {
      icon: Palette,
      label: 'My Artworks',
      href: '/business/artworks',
      active: pathname.startsWith('/business/artworks')
    },
    {
      icon: Plus,
      label: 'Create Artwork',
      href: '/business/artworks/create',
      active: pathname === '/business/artworks/create'
    },
    {
      icon: Buildings,
      label: 'Organizations',
      href: '/business/organizations',
      active: pathname.startsWith('/business/organizations')
    },
    {
      icon: ChartBar,
      label: 'Analytics',
      href: '/business/analytics',
      active: pathname === '/business/analytics'
    },
    {
      icon: Gear,
      label: 'Settings',
      href: '/business/settings',
      active: pathname === '/business/settings'
    }
  ];

  const organizationNavItems = [
    {
      icon: House,
      label: 'Dashboard',
      href: '/business',
      active: pathname === '/business'
    },
    {
      icon: Users,
      label: 'Artists',
      href: '/business/artists',
      active: pathname.startsWith('/business/artists')
    },
    {
      icon: Palette,
      label: 'Artworks',
      href: '/business/artworks',
      active: pathname.startsWith('/business/artworks')
    },
    {
      icon: Calendar,
      label: 'Events',
      href: '/business/events',
      active: pathname.startsWith('/business/events')
    },
    {
      icon: Plus,
      label: 'Create Event',
      href: '/business/events/create',
      active: pathname === '/business/events/create'
    },
    {
      icon: ChartBar,
      label: 'Analytics',
      href: '/business/analytics',
      active: pathname === '/business/analytics'
    },
    {
      icon: Gear,
      label: 'Settings',
      href: '/business/settings',
      active: pathname === '/business/settings'
    }
  ];

  const navItems = isArtist ? artistNavItems : organizationNavItems;

  const handleLogout = () => {
    // Handle logout logic here
    console.log('Logout');
    router.push('/');
  };

  const handleSwitchToUser = () => {
    router.push('/');
  };

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  return (
    <div className="h-screen bg-white dark:bg-[#121212] flex overflow-hidden">
      {/* Sidebar - Fixed */}
      <div className={`${sidebarCollapsed ? 'w-16' : 'w-64'} bg-white dark:bg-[#1E1B26] border-r border-gray-200 dark:border-gray-700/30 transition-all duration-300 flex-shrink-0 flex flex-col [box-shadow:0_1px_4px_rgba(0,0,0,0.2)]`}>
        <div className={`${sidebarCollapsed ? 'p-2' : 'p-4'} flex flex-col h-full`}>
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className={`${sidebarCollapsed ? 'hidden' : 'block'}`}>
              <h1 className="text-lg font-semibold text-gray-900 dark:text-white">
                {isArtist ? 'Artist Studio' : 'Organization'}
              </h1>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {user?.firstName} {user?.lastName}
              </p>
            </div>
            <button
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-all"
            >
              <List size={20} className="text-gray-600 dark:text-white" />
            </button>
          </div>

          {/* Navigation - Scrollable if needed */}
          <nav className="space-y-2 flex-1 overflow-y-auto">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center rounded-md text-sm font-medium transition-colors ${
                    sidebarCollapsed
                      ? 'justify-center w-10 h-10 mx-auto'
                      : 'gap-3 px-3 py-2'
                  } ${
                    item.active
                      ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400'
                      : 'text-gray-700 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                >
                  <Icon size={sidebarCollapsed ? 20 : 20} />
                  <span className={`${sidebarCollapsed ? 'hidden' : 'block'}`}>
                    {item.label}
                  </span>
                </Link>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Bar - Fixed */}
        <header className="bg-white dark:bg-[#1E1B26] border-b border-gray-200 dark:border-gray-700/30 px-6 py-4 flex-shrink-0 [box-shadow:0_1px_4px_rgba(0,0,0,0.2)]">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Business Dashboard
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {isArtist ? 'Manage your artwork portfolio and career' : 'Manage your organization and events'}
              </p>
            </div>

            <div className="flex items-center gap-4">
              <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                isArtist
                  ? 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200'
                  : 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
              }`}>
                {isArtist ? 'Artist' : 'Organization'}
              </span>

              {/* User Avatar Dropdown */}
              <Dropdown placement="bottom-end">
                <DropdownTrigger>
                  <div className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg px-3 py-2 transition-colors">
                    <Avatar
                      src={getUserAvatarUrl(user?.avatarPath) || undefined}
                      name={`${user?.firstName} ${user?.lastName}`}
                      size="sm"
                      className="flex-shrink-0"
                    />
                    <div className="hidden md:block text-left">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {user?.firstName} {user?.lastName}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {user?.email}
                      </p>
                    </div>
                    <CaretDown size={16} className="text-gray-400" />
                  </div>
                </DropdownTrigger>
                <DropdownMenu aria-label="User menu actions">
                  <DropdownItem
                    key="profile"
                    startContent={<UserCircle size={16} />}
                    onPress={() => router.push('/profile')}
                  >
                    My Profile
                  </DropdownItem>
                  <DropdownItem
                    key="switch-user"
                    startContent={<Desktop size={16} />}
                    onPress={handleSwitchToUser}
                  >
                    Switch to User View
                  </DropdownItem>
                  <DropdownItem
                    key="theme"
                    startContent={!mounted ? <Moon size={16} /> : (theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />)}
                    onPress={toggleTheme}
                  >
                    {!mounted ? 'Dark Mode' : (theme === 'dark' ? 'Light Mode' : 'Dark Mode')}
                  </DropdownItem>
                  <DropdownItem
                    key="logout"
                    color="danger"
                    startContent={<SignOut size={16} />}
                    onPress={handleLogout}
                  >
                    Sign Out
                  </DropdownItem>
                </DropdownMenu>
              </Dropdown>
            </div>
          </div>
        </header>

        {/* Content - Scrollable */}
        <main className="flex-1 overflow-y-auto bg-white dark:bg-[#121212]">
          <div className="p-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default BusinessLayout;