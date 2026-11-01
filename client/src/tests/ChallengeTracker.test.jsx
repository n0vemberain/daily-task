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

  it('displays task count indicator on days with linked tasks and opens CheckInModal on day click', () => {
    const mockTasks = [
      {
        id: 'task-c1',
        title: 'Binary Tree Traversal',
        challengeId: 'ch-1',
        dayNumber: 3,
        date: '2026-10-03',
        completed: true
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

    // Indicator 1/1 on day 3 button
    expect(screen.getByText('1/1')).toBeInTheDocument();

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
});
