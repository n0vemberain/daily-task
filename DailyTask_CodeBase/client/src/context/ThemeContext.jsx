import React, { createContext, useContext, useState, useEffect } from 'react';

export const THEMES = {
  olive: {
    id: 'olive',
    name: 'Olive Green',
    accent: '#7eb644',
    accentHover: '#6ea03f',
    accentLight: '#9fdb52',
    accentDark: '#1a2710',
    primaryBtn: 'bg-olive-700 hover:bg-olive-600 text-white border-olive-500/40',
    activeTab: 'bg-olive-800/80 text-white border-olive-600/40',
    badge: 'bg-olive-950 text-olive-300 border-olive-700/40',
    badgeText: 'text-olive-300',
    accentText: 'text-olive-400',
    borderHighlight: 'border-olive-500/50',
    ring: 'ring-olive-400',
    gradient: 'from-olive-600 to-olive-800',
    progressGradient: 'from-olive-700 via-olive-500 to-olive-400',
    dot: 'bg-olive-400',
    hexLevels: ['#161b22', '#263b19', '#3d5c24', '#5a8533', '#7eb644'],
    levels: {
      0: 'bg-[#161b22] border-[#21262d] hover:border-[#384620]',
      1: 'bg-[#263b19] border-[#384f27] hover:border-[#4d6b2c]',
      2: 'bg-[#3d5c24] border-[#4e7430] hover:border-[#63923c]',
      3: 'bg-[#5a8533] border-[#6ea03f] hover:border-[#83bd4b]',
      4: 'bg-[#7eb644] border-[#92ce52] hover:border-[#abeb64] shadow-sm shadow-olive-600/40'
    }
  },
  emerald: {
    id: 'emerald',
    name: 'Emerald Mint',
    accent: '#39d353',
    accentHover: '#2ea043',
    accentLight: '#56e36e',
    accentDark: '#082512',
    primaryBtn: 'bg-emerald-700 hover:bg-emerald-600 text-white border-emerald-500/40',
    activeTab: 'bg-emerald-800/80 text-white border-emerald-600/40',
    badge: 'bg-emerald-950 text-emerald-300 border-emerald-700/40',
    badgeText: 'text-emerald-300',
    accentText: 'text-emerald-400',
    borderHighlight: 'border-emerald-500/50',
    ring: 'ring-emerald-400',
    gradient: 'from-emerald-600 to-emerald-800',
    progressGradient: 'from-emerald-700 via-emerald-500 to-emerald-400',
    dot: 'bg-emerald-400',
    hexLevels: ['#161b22', '#0e4429', '#006d32', '#26a641', '#39d353'],
    levels: {
      0: 'bg-[#161b22] border-[#21262d] hover:border-[#15462c]',
      1: 'bg-[#0e4429] border-[#165b38] hover:border-[#1d784b]',
      2: 'bg-[#006d32] border-[#108c43] hover:border-[#1ca853]',
      3: 'bg-[#26a641] border-[#34c453] hover:border-[#42dd64]',
      4: 'bg-[#39d353] border-[#55ea6f] hover:border-[#76f08c] shadow-sm shadow-emerald-600/40'
    }
  },
  cyan: {
    id: 'cyan',
    name: 'Ocean Cyan',
    accent: '#38d8f5',
    accentHover: '#189cb5',
    accentLight: '#67e4fa',
    accentDark: '#07242e',
    primaryBtn: 'bg-cyan-700 hover:bg-cyan-600 text-white border-cyan-500/40',
    activeTab: 'bg-cyan-800/80 text-white border-cyan-600/40',
    badge: 'bg-cyan-950 text-cyan-300 border-cyan-700/40',
    badgeText: 'text-cyan-300',
    accentText: 'text-cyan-400',
    borderHighlight: 'border-cyan-500/50',
    ring: 'ring-cyan-400',
    gradient: 'from-cyan-600 to-cyan-800',
    progressGradient: 'from-cyan-700 via-cyan-500 to-cyan-400',
    dot: 'bg-cyan-400',
    hexLevels: ['#161b22', '#0b3c49', '#0e6075', '#189cb5', '#38d8f5'],
    levels: {
      0: 'bg-[#161b22] border-[#21262d] hover:border-[#134958]',
      1: 'bg-[#0b3c49] border-[#115769] hover:border-[#16728a]',
      2: 'bg-[#0e6075] border-[#15819e] hover:border-[#1da5c9]',
      3: 'bg-[#189cb5] border-[#25c4e3] hover:border-[#41d2f0]',
      4: 'bg-[#38d8f5] border-[#67e4fa] hover:border-[#96eefa] shadow-sm shadow-cyan-600/40'
    }
  },
  amber: {
    id: 'amber',
    name: 'Sunset Amber',
    accent: '#f59e0b',
    accentHover: '#d97706',
    accentLight: '#fcd34d',
    accentDark: '#2d1703',
    primaryBtn: 'bg-amber-700 hover:bg-amber-600 text-white border-amber-500/40',
    activeTab: 'bg-amber-800/80 text-white border-amber-600/40',
    badge: 'bg-amber-950 text-amber-300 border-amber-700/40',
    badgeText: 'text-amber-300',
    accentText: 'text-amber-400',
    borderHighlight: 'border-amber-500/50',
    ring: 'ring-amber-400',
    gradient: 'from-amber-600 to-amber-800',
    progressGradient: 'from-amber-700 via-amber-500 to-amber-400',
    dot: 'bg-amber-400',
    hexLevels: ['#161b22', '#452607', '#783c07', '#b86209', '#f59e0b'],
    levels: {
      0: 'bg-[#161b22] border-[#21262d] hover:border-[#523310]',
      1: 'bg-[#452607] border-[#61360a] hover:border-[#7e470e]',
      2: 'bg-[#783c07] border-[#9c4f09] hover:border-[#bf610c]',
      3: 'bg-[#b86209] border-[#e0770b] hover:border-[#f58d1b]',
      4: 'bg-[#f59e0b] border-[#fbbf24] hover:border-[#fcd34d] shadow-sm shadow-amber-600/40'
    }
  },
  purple: {
    id: 'purple',
    name: 'Amethyst Purple',
    accent: '#b366f5',
    accentHover: '#9333ea',
    accentLight: '#dcabfc',
    accentDark: '#230c38',
    primaryBtn: 'bg-purple-700 hover:bg-purple-600 text-white border-purple-500/40',
    activeTab: 'bg-purple-800/80 text-white border-purple-600/40',
    badge: 'bg-purple-950 text-purple-300 border-purple-700/40',
    badgeText: 'text-purple-300',
    accentText: 'text-purple-400',
    borderHighlight: 'border-purple-500/50',
    ring: 'ring-purple-400',
    gradient: 'from-purple-600 to-purple-800',
    progressGradient: 'from-purple-700 via-purple-500 to-purple-400',
    dot: 'bg-purple-400',
    hexLevels: ['#161b22', '#341948', '#58207c', '#8736bf', '#b366f5'],
    levels: {
      0: 'bg-[#161b22] border-[#21262d] hover:border-[#43235b]',
      1: 'bg-[#341948] border-[#4b2469] hover:border-[#632f8a]',
      2: 'bg-[#58207c] border-[#762ca6] hover:border-[#9637d4]',
      3: 'bg-[#8736bf] border-[#a948ee] hover:border-[#c26df5]',
      4: 'bg-[#b366f5] border-[#c884fa] hover:border-[#dcabfc] shadow-sm shadow-purple-600/40'
    }
  }
};

const ThemeContext = createContext({
  theme: THEMES.olive,
  themeId: 'olive',
  setThemeId: () => {}
});

export function ThemeProvider({ children }) {
  const [themeId, setThemeIdState] = useState(() => {
    return localStorage.getItem('daily_task_app_theme') || 'olive';
  });

  const setThemeId = (newId) => {
    if (THEMES[newId]) {
      setThemeIdState(newId);
      localStorage.setItem('daily_task_app_theme', newId);
    }
  };

  const theme = THEMES[themeId] || THEMES.olive;

  return (
    <ThemeContext.Provider value={{ theme, themeId, setThemeId, availableThemes: THEMES }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
