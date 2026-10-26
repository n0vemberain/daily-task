import React from 'react';
import { CalendarDays, Flame, CheckSquare, User, Plus, Timer } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export default function MobileBottomNav({
  activeTab,
  setActiveTab,
  onQuickAdd
}) {
  const { theme } = useTheme();

  const tabs = [
    { id: 'dashboard', label: 'Heatmap', icon: CalendarDays },
    { id: 'challenges', label: 'Goals', icon: Flame },
    { id: 'tasks', label: 'Tasks', icon: CheckSquare },
    { id: 'timer', label: 'Timer', icon: Timer },
    { id: 'profile', label: 'Profile', icon: User }
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#0d1117]/95 backdrop-blur-lg border-t border-github-border pb-[max(0.5rem,env(safe-area-inset-bottom))] px-2 pt-1.5 shadow-2xl">
      <div className="flex items-center justify-between">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 flex flex-col items-center justify-center min-h-[44px] rounded-lg transition-colors py-1 ${
                isActive ? 'font-bold' : 'text-github-muted hover:text-white'
              }`}
              style={{ color: isActive ? theme.accent : undefined }}
            >
              <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="text-[10px] mt-1 truncate">{tab.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
