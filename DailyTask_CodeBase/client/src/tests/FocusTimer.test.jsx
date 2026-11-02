import { describe, it, expect, vi } from 'vitest';
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import FocusTimer from '../components/FocusTimer';
import { ThemeProvider } from '../context/ThemeContext';
import { formatDateStr } from '../data/initialData';

describe('FocusTimer Component', () => {
  const todayStr = formatDateStr(new Date());

  const sampleSessions = [
    {
      id: 's-1',
      durationMinutes: 25,
      date: todayStr,
      timestamp: new Date().toISOString(),
      category: 'Study',
      label: 'Data Structures'
    },
    {
      id: 's-2',
      durationMinutes: 35,
      date: todayStr,
      timestamp: new Date().toISOString(),
      category: 'Coding',
      label: 'React Optimization'
    }
  ];

  it('renders study timer header and aggregated metrics for Day, Week, Month, and Year', () => {
    render(
      <ThemeProvider>
        <FocusTimer sessions={sampleSessions} onAddSession={vi.fn()} onDeleteSession={vi.fn()} />
      </ThemeProvider>
    );

    expect(screen.getByText('Study & Focus Timer')).toBeInTheDocument();
    expect(screen.getByText('Today (Day)')).toBeInTheDocument();
    expect(screen.getByText('This Week')).toBeInTheDocument();
    expect(screen.getByText('This Month')).toBeInTheDocument();
    expect(screen.getByText(/This Year/i)).toBeInTheDocument();

    // 25m + 35m = 60m = 1h across cards
    const oneHourElements = screen.getAllByText('1h');
    expect(oneHourElements.length).toBeGreaterThanOrEqual(1);
  });

  it('renders duration presets and switches active preset', () => {
    render(
      <ThemeProvider>
        <FocusTimer sessions={sampleSessions} onAddSession={vi.fn()} onDeleteSession={vi.fn()} />
      </ThemeProvider>
    );

    expect(screen.getByRole('button', { name: '10m' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '15m' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '20m' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '25m' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '30m' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '45m' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '60m' })).toBeInTheDocument();

    // Default 25:00
    expect(screen.getByText('25:00')).toBeInTheDocument();

    // Click 15m preset
    fireEvent.click(screen.getByRole('button', { name: '15m' }));
    expect(screen.getByText('15:00')).toBeInTheDocument();
  });

  it('starts countdown and displays pause control', () => {
    render(
      <ThemeProvider>
        <FocusTimer sessions={sampleSessions} onAddSession={vi.fn()} onDeleteSession={vi.fn()} />
      </ThemeProvider>
    );

    const startBtn = screen.getByText('Start Focus Session');
    fireEvent.click(startBtn);

    expect(screen.getByText('Pause')).toBeInTheDocument();
    expect(screen.getByText('Finish & Save')).toBeInTheDocument();
    expect(screen.getByText('Reset')).toBeInTheDocument();
  });

  it('allows logging an offline study session', () => {
    const handleAdd = vi.fn();
    render(
      <ThemeProvider>
        <FocusTimer sessions={sampleSessions} onAddSession={handleAdd} onDeleteSession={vi.fn()} />
      </ThemeProvider>
    );

    // Click Log Offline Study
    fireEvent.click(screen.getByText('Log Offline Study'));

    expect(screen.getByText('Log Offline Study Session')).toBeInTheDocument();

    const noteInput = screen.getByPlaceholderText('e.g. Read textbook chapter 5');
    fireEvent.change(noteInput, { target: { value: 'Operating Systems Quiz' } });

    const saveBtn = screen.getByText('Save Session');
    fireEvent.click(saveBtn);

    expect(handleAdd).toHaveBeenCalledTimes(1);
    expect(handleAdd).toHaveBeenCalledWith(
      expect.objectContaining({
        durationMinutes: 30,
        label: 'Operating Systems Quiz',
        category: 'Study'
      })
    );
  });
});
