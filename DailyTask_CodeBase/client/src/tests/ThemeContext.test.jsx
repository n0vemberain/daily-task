import { describe, it, expect } from 'vitest';
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { ThemeProvider, useTheme, THEMES } from '../context/ThemeContext';

function TestConsumer() {
  const { theme, themeId, setThemeId } = useTheme();
  return (
    <div>
      <span data-testid="theme-name">{theme.name}</span>
      <span data-testid="theme-id">{themeId}</span>
      <button onClick={() => setThemeId('cyan')}>Set Cyan</button>
      <button onClick={() => setThemeId('purple')}>Set Purple</button>
    </div>
  );
}

describe('ThemeContext Provider', () => {
  it('provides default olive theme', () => {
    localStorage.clear();
    render(
      <ThemeProvider>
        <TestConsumer />
      </ThemeProvider>
    );

    expect(screen.getByTestId('theme-name').textContent).toBe('Olive Green');
    expect(screen.getByTestId('theme-id').textContent).toBe('olive');
  });

  it('updates theme and persists to localStorage', () => {
    localStorage.clear();
    render(
      <ThemeProvider>
        <TestConsumer />
      </ThemeProvider>
    );

    const cyanBtn = screen.getByText('Set Cyan');
    fireEvent.click(cyanBtn);

    expect(screen.getByTestId('theme-name').textContent).toBe('Ocean Cyan');
    expect(screen.getByTestId('theme-id').textContent).toBe('cyan');
    expect(localStorage.getItem('daily_task_app_theme')).toBe('cyan');
  });

  it('supports all 5 defined theme palettes', () => {
    expect(THEMES.olive).toBeDefined();
    expect(THEMES.emerald).toBeDefined();
    expect(THEMES.cyan).toBeDefined();
    expect(THEMES.amber).toBeDefined();
    expect(THEMES.purple).toBeDefined();
  });
});
