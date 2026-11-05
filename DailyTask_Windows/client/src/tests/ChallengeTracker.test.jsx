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

    // Challenges start minimized; click header/expand to open
    const expandBtn = screen.getByTitle('Maximize Challenge Grid');
    fireEvent.click(expandBtn);

    expect(screen.getByText('Day-by-Day Check-in Grid')).toBeInTheDocument();
    expect(screen.getByText('1')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();
    expect(screen.getByText('3')).toBeInTheDocument();
  });

  it('displays task count indicator on days with linked tasks and opens CheckInModal on day click', () => {
    const mockTasks = [
      {
        id: 'task-c1',
        title: 'Binary Tree Traversal',
        challengeId: 'ch-1',
        dayNumber: 3,
        date: '2026-10-03',
        completed: false
      }
    ];

    render(
      <ChallengeTracker
        challenges={mockChallenges}
        tasks={mockTasks}
        onAddTask={vi.fn()}
        onToggleTask={vi.fn()}
        onDeleteTask={vi.fn()}
        onCreateChallenge={vi.fn()}
        onCheckIn={vi.fn()}
        onDeleteChallenge={vi.fn()}
      />
    );

    // Expand the challenge first
    const expandBtn = screen.getByTitle('Maximize Challenge Grid');
    fireEvent.click(expandBtn);

    // Indicator 0/1 on day 3 button
    expect(screen.getByText('0/1')).toBeInTheDocument();

    // Click Day 3 square
    const day3Btn = screen.getByText('3').closest('button');
    fireEvent.click(day3Btn);

    // Modal opens showing Day 3 Check-in & Daily Tasks
    expect(screen.getByText(/Day 3 Check-in & Daily Tasks/i)).toBeInTheDocument();
    expect(screen.getByText('Binary Tree Traversal')).toBeInTheDocument();
  });

  it('requires password authorization when deleting a challenge', () => {
    const handleDeleteChallenge = vi.fn();
    const mockProfile = {
      username: 'testuser',
      password: 'ChallengeSecret123!'
    };

    render(
      <ChallengeTracker
        challenges={mockChallenges}
        onDeleteChallenge={handleDeleteChallenge}
        userProfile={mockProfile}
      />
    );

    // Click delete challenge button
    const deleteBtn = screen.getByTitle('Delete Challenge (Requires password)');
    fireEvent.click(deleteBtn);

    // Password prompt opens
    expect(screen.getByText('Authorize Challenge Deletion')).toBeInTheDocument();
    expect(
      screen.getByText(/Deleting goal challenge "30-Day LeetCode Challenge" and its progress requires your account password\./i)
    ).toBeInTheDocument();

    const passwordInput = screen.getByPlaceholderText('Enter your account password...');

    // Enter wrong password
    fireEvent.change(passwordInput, { target: { value: 'WrongPass' } });
    fireEvent.click(screen.getByRole('button', { name: /Authorize & Proceed/i }));

    expect(screen.getByText(/Incorrect password\. Authorization failed\./i)).toBeInTheDocument();
    expect(handleDeleteChallenge).not.toHaveBeenCalled();

    // Enter correct password
    fireEvent.change(passwordInput, { target: { value: 'ChallengeSecret123!' } });
    fireEvent.click(screen.getByRole('button', { name: /Authorize & Proceed/i }));

    expect(handleDeleteChallenge).toHaveBeenCalledWith('ch-1');
  });

  it('toggles collapse and expand to minimize/maximize challenge card', () => {
    render(
      <ChallengeTracker
        challenges={mockChallenges}
        onCreateChallenge={vi.fn()}
        onCheckIn={vi.fn()}
        onDeleteChallenge={vi.fn()}
      />
    );

    // Initial state: starts minimized, Grid is hidden
    expect(screen.queryByText('Day-by-Day Check-in Grid')).not.toBeInTheDocument();

    // Click Expand button
    const expandBtn = screen.getByTitle('Maximize Challenge Grid');
    fireEvent.click(expandBtn);

    // Grid is now visible
    expect(screen.getByText('Day-by-Day Check-in Grid')).toBeInTheDocument();

    // Click Minimize button
    const minimizeBtn = screen.getByTitle('Minimize Challenge Grid');
    fireEvent.click(minimizeBtn);

    // Grid is hidden again
    expect(screen.queryByText('Day-by-Day Check-in Grid')).not.toBeInTheDocument();
  });

  it('computes dynamic day status and summary counts for on-time, late, incomplete, and skipped days', () => {
    const dynamicChallenge = [
      {
        id: 'ch-dynamic',
        title: 'Status Color Verification Challenge',
        category: 'Productivity',
        durationDays: 4,
        startDate: '2026-10-01',
        endDate: '2026-10-04',
        status: 'active',
        checkIns: [
          { dayNumber: 1, date: '2026-10-01', status: 'completed', note: 'Done' },
          { dayNumber: 2, date: '2026-10-02', status: 'skipped', note: '' },
          { dayNumber: 3, date: '2026-10-03', status: 'pending', note: '' },
          { dayNumber: 4, date: '2026-10-04', status: 'pending', note: '' }
        ]
      }
    ];

    const dynamicTasks = [
      // Day 4 has a task that completed late (completedAt > date)
      {
        id: 'task-late',
        title: 'Late Rollover Task',
        challengeId: 'ch-dynamic',
        dayNumber: 4,
        date: '2026-10-04',
        completed: true,
        completedAt: '2026-10-05T12:00:00.000Z'
      }
    ];

    render(
      <ChallengeTracker
        challenges={dynamicChallenge}
        tasks={dynamicTasks}
        onCreateChallenge={vi.fn()}
        onCheckIn={vi.fn()}
        onDeleteChallenge={vi.fn()}
      />
    );

    // Expand the challenge first to view the grid and breakdown
    const expandBtn = screen.getByTitle('Maximize Challenge Grid');
    fireEvent.click(expandBtn);

    // Summary bar verifies breakdown
    expect(screen.getByText(/1 On Time/i)).toBeInTheDocument();
    expect(screen.getByText(/1 Late \/ Rollover Done/i)).toBeInTheDocument();
    expect(screen.getByText(/1 Skipped/i)).toBeInTheDocument();
    expect(screen.getByText(/1 Incomplete/i)).toBeInTheDocument();

    // Verify Legend text is displayed
    expect(
      screen.getByText(
        /Green = On Time • Yellow = Late Done • Red = Incomplete • Orange = Skipped • Ring = Today/i
      )
    ).toBeInTheDocument();
  });

  it('moves completed challenges to Completed tab and excludes them from Active tab', () => {
    const mixedChallenges = [
      {
        id: 'ch-active',
        title: 'Active Workout Routine',
        category: 'Fitness',
        durationDays: 2,
        startDate: '2026-10-01',
        endDate: '2026-10-02',
        status: 'active',
        checkIns: [
          { dayNumber: 1, date: '2026-10-01', status: 'completed', note: '' },
          { dayNumber: 2, date: '2026-10-02', status: 'pending', note: '' }
        ]
      },
      {
        id: 'ch-completed',
        title: 'Completed Reading Sprint',
        category: 'Study',
        durationDays: 2,
        startDate: '2026-10-01',
        endDate: '2026-10-02',
        status: 'completed',
        checkIns: [
          { dayNumber: 1, date: '2026-10-01', status: 'completed', note: '' },
          { dayNumber: 2, date: '2026-10-02', status: 'completed', note: '' }
        ]
      }
    ];

    render(
      <ChallengeTracker
        challenges={mixedChallenges}
        onCreateChallenge={vi.fn()}
        onCheckIn={vi.fn()}
        onDeleteChallenge={vi.fn()}
      />
    );

    // Default filter is 'active': Active Workout Routine is visible, Completed Reading Sprint is NOT visible
    expect(screen.getByText('Active Workout Routine')).toBeInTheDocument();
    expect(screen.queryByText('Completed Reading Sprint')).not.toBeInTheDocument();

    // Switch to 'completed' tab
    fireEvent.click(screen.getByRole('button', { name: /^Completed$/i }));
    expect(screen.queryByText('Active Workout Routine')).not.toBeInTheDocument();
    expect(screen.getByText('Completed Reading Sprint')).toBeInTheDocument();

    // Switch to 'all' tab: both challenges are visible
    fireEvent.click(screen.getByRole('button', { name: /^All$/i }));
    expect(screen.getByText('Active Workout Routine')).toBeInTheDocument();
    expect(screen.getByText('Completed Reading Sprint')).toBeInTheDocument();
  });

  it('allows manual reordering of challenges via Move Up and Move Down buttons', () => {
    const handleReorderChallenges = vi.fn();
    const orderedChallenges = [
      {
        id: 'ch-1',
        title: 'Challenge Number One',
        category: 'Coding',
        durationDays: 5,
        status: 'active',
        checkIns: [{ dayNumber: 1, date: '2026-10-01', status: 'pending' }]
      },
      {
        id: 'ch-2',
        title: 'Challenge Number Two',
        category: 'Coding',
        durationDays: 5,
        status: 'active',
        checkIns: [{ dayNumber: 1, date: '2026-10-01', status: 'pending' }]
      },
      {
        id: 'ch-3',
        title: 'Challenge Number Three',
        category: 'Coding',
        durationDays: 5,
        status: 'active',
        checkIns: [{ dayNumber: 1, date: '2026-10-01', status: 'pending' }]
      }
    ];

    render(
      <ChallengeTracker
        challenges={orderedChallenges}
        onReorderChallenges={handleReorderChallenges}
      />
    );

    // Verify position badges #1, #2, #3
    expect(screen.getByText('#1')).toBeInTheDocument();
    expect(screen.getByText('#2')).toBeInTheDocument();
    expect(screen.getByText('#3')).toBeInTheDocument();

    // Click Move Up on Challenge Number Three
    const moveUpButtons = screen.getAllByTitle('Move Up');
    fireEvent.click(moveUpButtons[2]);

    expect(handleReorderChallenges).toHaveBeenCalledTimes(1);
    const reorderedIds = handleReorderChallenges.mock.calls[0][0].map((c) => c.id);
    expect(reorderedIds).toEqual(['ch-1', 'ch-3', 'ch-2']);
  });
});
