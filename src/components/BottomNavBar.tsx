import React from 'react';
import { Home, Compass, FolderKanban, User } from 'lucide-react';

export type NavTab = 'home' | 'history' | 'explore' | 'profile';

interface BottomNavBarProps {
  activeTab: NavTab;
  onTabChange: (tab: NavTab) => void;
}

export const BottomNavBar: React.FC<BottomNavBarProps> = ({ activeTab, onTabChange }) => {
  const tabs = [
    { id: 'home' as NavTab, label: 'Home', icon: Home },
    { id: 'history' as NavTab, label: 'My Decisions', icon: FolderKanban },
    { id: 'explore' as NavTab, label: 'Explore', icon: Compass },
    { id: 'profile' as NavTab, label: 'Profile', icon: User },
  ];

  return (
    <nav className="w-full h-16 bg-slate-950/90 dark:bg-slate-950/95 backdrop-blur-md border-t border-slate-800/80 px-4 flex items-center justify-around shrink-0 z-40 select-none">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`flex flex-col items-center justify-center py-1 px-3 min-w-[56px] min-h-[44px] rounded-xl transition-all ${
              isActive
                ? 'text-indigo-400 font-medium'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <div className="relative">
              <Icon className={`w-5 h-5 transition-transform ${isActive ? 'scale-110 stroke-[2.2]' : 'stroke-[1.8]'}`} />
              {isActive && (
                <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-indigo-500 shadow-sm shadow-indigo-500" />
              )}
            </div>
            <span className="text-[10px] tracking-tight mt-1 whitespace-nowrap">
              {tab.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
};
