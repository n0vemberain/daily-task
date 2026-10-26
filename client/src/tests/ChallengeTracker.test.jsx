import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import ChallengeTracker from '../components/ChallengeTracker';

describe('ChallengeTracker Component', () => {
  const mockChallenges = [
    {
      id: 'ch-1',
      title: '30-Day LeetCode Challenge',
      category: 'Coding',
      durationDays: 30,
      startDate: '2026-10-01',
      endDate: '2026-10-30',
      status: 'active',
      checkIns: [
        { dayNumber: 1, date: '2026-10-01', status: 'completed', note: 'Done day 1' },
        { dayNumber: 2, date: '2026-10-02', status: 'skipped', note: '' },
        { dayNumber: 3, date: '2026-10-03', status: 'pending', note: '' }
      ]
    }
  ];

  it('renders challenge title, category, and day count', () => {
    render(
      <ChallengeTracker
        challenges={mockChallenges}
        onCreateChallenge={vi.fn()}
        onCheckIn={vi.fn()}
        onDeleteChallenge={vi.fn()}
      />
    );

    expect(screen.getByText('30-Day LeetCode Challenge')).toBeInTheDocument();
    expect(screen.getByText('Coding')).toBeInTheDocument();
    expect(screen.getByText('30 Days')).toBeInTheDocument();
  });

  it('renders Day-by-Day check-in buttons', () => {
    render(
      <ChallengeTracker
        challenges={mockChallenges}
        onCreateChallenge={vi.fn()}
        onCheckIn={vi.fn()}
        onDeleteChallenge={vi.fn()}
      />
    );

    expect(screen.getByText('Day-by-Day Check-in Grid')).toBeInTheDocument();
    expect(screen.getByText('1')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();
    expect(screen.getByText('3')).toBeInTheDocument();
  });
});
