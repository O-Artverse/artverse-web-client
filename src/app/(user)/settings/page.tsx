'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { EditProfile } from '@/components/modules/Settings/EditProfile';
import { AccountManagement } from '@/components/modules/Settings/AccountManagement';
import { PrivacyAndData } from '@/components/modules/Settings/PrivacyAndData';
import { Notifications } from '@/components/modules/Settings/Notifications';
import { Security } from '@/components/modules/Settings/Security';
import { DefaultSection } from '@/components/modules/Settings/DefaultSection';

export default function UserSettingPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [activeSection, setActiveSection] = useState('edit-profile');

  // Initialize active section from URL params
  useEffect(() => {
    const activeParam = searchParams.get('active');
    if (activeParam) {
      setActiveSection(activeParam);
    }
  }, [searchParams]);

  // Update URL when active section changes
  const handleSectionChange = (sectionId: string) => {
    setActiveSection(sectionId);
    const newSearchParams = new URLSearchParams(searchParams.toString());
    newSearchParams.set('active', sectionId);
    router.push(`/settings?${newSearchParams.toString()}`, { scroll: false });
  };

  const menuItems = [
    { id: 'edit-profile', label: 'Edit profile', icon: null },
    { id: 'account-management', label: 'Account management', icon: null },
    { id: 'display-mode', label: 'Profile visibility settings', icon: null },
    { id: 'personal-info', label: 'Tune your home feed', icon: null },
    { id: 'external-accounts', label: 'Claimed accounts', icon: null },
    { id: 'permissions', label: 'Social permissions', icon: null },
    { id: 'notifications', label: 'Notifications', icon: null },
    { id: 'privacy', label: 'Privacy and data', icon: null },
    { id: 'security', label: 'Security', icon: null },
    { id: 'content-behavior', label: 'Branded content', icon: null },
  ];

  const renderActiveSection = () => {
    switch (activeSection) {
      case 'edit-profile':
        return <EditProfile />;
      case 'account-management':
        return <AccountManagement />;
      case 'privacy':
        return <PrivacyAndData />;
      case 'notifications':
        return <Notifications />;
      case 'security':
        return <Security />;
      case 'display-mode':
        return <DefaultSection title="Profile visibility settings" description="Manage how your profile appears to others and who can find you." />;
      case 'personal-info':
        return <DefaultSection title="Tune your home feed" description="Customize what content appears on your home feed." />;
      case 'external-accounts':
        return <DefaultSection title="Claimed accounts" description="Connect and manage your external social media accounts." />;
      case 'permissions':
        return <DefaultSection title="Social permissions" description="Control who can interact with you and how." />;
      case 'content-behavior':
        return <DefaultSection title="Branded content" description="Manage settings related to branded content and partnerships." />;
      default:
        return <DefaultSection title="Settings" description="Select a section from the menu to get started." />;
    }
  };

  return (
    <div className="min-h-full">
      <div className="max-w-full mx-auto">
        <div className="flex gap-8">
          {/* Sidebar */}
          <div className="w-64 flex-shrink-0">
            <nav className="bg-content1 rounded-lg shadow-sm">
              <ul className="py-2">
                {menuItems.map((item) => (
                  <li key={item.id}>
                    <button
                      onClick={() => handleSectionChange(item.id)}
                      className={`w-full text-left px-6 py-3 text-sm hover:bg-default-100 transition-colors ${
                        activeSection === item.id
                          ? 'font-semibold text-foreground border-l-4 border-primary'
                          : 'text-default-600'
                      }`}
                    >
                      {item.label}
                    </button>
                  </li>
                ))}
              </ul>
            </nav>
          </div>

          {/* Main Content */}
          <div className="flex-1 h-[calc(100vh-112px)] overflow-auto">
            {renderActiveSection()}
          </div>
        </div>
      </div>
    </div>
  );
}