import React from 'react';
import { CalendarDays, Flame, CheckSquare, User, Plus } from 'lucide-react';
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
    { id: 'profile', label: 'Profile', icon: User }
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#0d1117]/95 backdrop-blur-lg border-t border-github-border pb-[max(0.5rem,env(safe-area-inset-bottom))] px-3 pt-2 shadow-2xl">
      <div className="flex items-center justify-around relative">
        {tabs.slice(0, 2).map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex flex-col items-center justify-center min-w-[54px] min-h-[44px] rounded-lg transition-colors ${
                isActive ? 'font-bold' : 'text-github-muted hover:text-white'
              }`}
              style={{ color: isActive ? theme.accent : undefined }}
            >
              <Icon className="w-5 h-5" />
              <span className="text-[10px] mt-1">{tab.label}</span>
            </button>
          );
        })}

        {/* Center Quick Add Action Button */}
        <button
          onClick={onQuickAdd}
          className="w-12 h-12 -mt-5 rounded-full text-white flex items-center justify-center shadow-lg border-2 border-[#0d1117] active:scale-95 transition-transform"
          style={{
            backgroundColor: theme.accent,
            boxShadow: `0 8px 16px ${theme.accent}40`
          }}
          title="Quick Add Task"
        >
          <Plus className="w-6 h-6" />
        </button>

        {tabs.slice(2, 4).map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex flex-col items-center justify-center min-w-[54px] min-h-[44px] rounded-lg transition-colors ${
                isActive ? 'font-bold' : 'text-github-muted hover:text-white'
              }`}
              style={{ color: isActive ? theme.accent : undefined }}
            >
              <Icon className="w-5 h-5" />
              <span className="text-[10px] mt-1">{tab.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
