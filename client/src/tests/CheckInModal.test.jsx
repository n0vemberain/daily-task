import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import CheckInModal from '../components/CheckInModal';
import { formatDateStr } from '../data/initialData';

describe('CheckInModal Component', () => {
  const todayStr = formatDateStr(new Date());

  const mockChallenge = {
    id: 'ch-1',
    title: '30-Day LeetCode Grind',
    category: 'Coding',
    targetDays: 30
  };

  const mockDayItemToday = {
    dayNumber: 5,
    date: todayStr,
    status: 'pending',
    note: ''
  };

  const pastDate = '2025-01-01';
  const mockDayItemPast = {
    dayNumber: 1,
    date: pastDate,
    status: 'completed',
    note: 'Initial Day Note'
  };

  const mockTasks = [
    {
      id: 'task-101',
      title: 'Solve Two Sum',
      challengeId: 'ch-1',
      dayNumber: 5,
      date: todayStr,
      completed: false,
      priority: 'High',
      estimatedMinutes: 30
    },
    {
      id: 'task-102',
      title: 'Review Hashmaps',
      challengeId: 'ch-1',
      dayNumber: 5,
      date: todayStr,
      completed: true,
      priority: 'Medium',
      estimatedMinutes: 20
    }
  ];

  const mockProfile = {
    username: 'testuser',
    password: 'Password123!'
  };

  it('does not render when isOpen is false', () => {
    const { container } = render(
      <CheckInModal
        isOpen={false}
        challenge={mockChallenge}
        dayItem={mockDayItemToday}
        onClose={vi.fn()}
      />
    );
    expect(container).toBeEmptyDOMElement();
  });

  it('renders Day info, status buttons, and linked daily tasks for today', () => {
    render(
      <CheckInModal
        isOpen={true}
        challenge={mockChallenge}
        dayItem={mockDayItemToday}
        tasks={mockTasks}
        onClose={vi.fn()}
        onSaveCheckIn={vi.fn()}
      />
    );

    expect(screen.getByText(/Day 5 Check-in & Daily Tasks/i)).toBeInTheDocument();
    expect(screen.getByText('30-Day LeetCode Grind')).toBeInTheDocument();
    expect(screen.getByText('Solve Two Sum')).toBeInTheDocument();
    expect(screen.getByText('Review Hashmaps')).toBeInTheDocument();
    expect(screen.getByText('1/2 Done')).toBeInTheDocument();
  });

  it('allows adding a new daily task for today', () => {
    const handleAddTask = vi.fn();

    render(
      <CheckInModal
        isOpen={true}
        challenge={mockChallenge}
        dayItem={mockDayItemToday}
        tasks={mockTasks}
        onAddTask={handleAddTask}
        onClose={vi.fn()}
        onSaveCheckIn={vi.fn()}
      />
    );

    const taskInput = screen.getByPlaceholderText(/What will you study\/do on Day 5\?/i);
    fireEvent.change(taskInput, { target: { value: 'Solve Valid Parentheses' } });

    const addBtn = screen.getByRole('button', { name: /Add Task/i });
    fireEvent.click(addBtn);

    expect(handleAddTask).toHaveBeenCalledTimes(1);
    expect(handleAddTask).toHaveBeenCalledWith(
      expect.objectContaining({
        title: 'Solve Valid Parentheses',
        challengeId: 'ch-1',
        challengeTitle: '30-Day LeetCode Grind',
        dayNumber: 5,
        date: todayStr
      })
    );
  });

  it('triggers onToggleTask and onDeleteTask when interacting with day tasks', () => {
    const handleToggle = vi.fn();
    const handleDelete = vi.fn();

    render(
      <CheckInModal
        isOpen={true}
        challenge={mockChallenge}
        dayItem={mockDayItemToday}
        tasks={mockTasks}
        onToggleTask={handleToggle}
        onDeleteTask={handleDelete}
        onClose={vi.fn()}
        onSaveCheckIn={vi.fn()}
      />
    );

    // Toggle button on uncompleted task
    const markDoneBtn = screen.getByTitle('Mark completed');
    fireEvent.click(markDoneBtn);
    expect(handleToggle).toHaveBeenCalledWith('task-101');

    // Delete button
    const deleteBtns = screen.getAllByTitle('Delete task');
    fireEvent.click(deleteBtns[0]);
    expect(handleDelete).toHaveBeenCalledWith('task-101');
  });

  it('requires password authorization when modifying past history', () => {
    render(
      <CheckInModal
        isOpen={true}
        challenge={mockChallenge}
        dayItem={mockDayItemPast}
        tasks={[]}
        userProfile={mockProfile}
        onClose={vi.fn()}
        onSaveCheckIn={vi.fn()}
      />
    );

    expect(screen.getByText('History Protected')).toBeInTheDocument();
    expect(
      screen.getByText(/Past history is protected\. Password required to add, edit or delete tasks\./i)
    ).toBeInTheDocument();

    // Clicking status triggers password prompt modal
    const pendingBtn = screen.getByRole('button', { name: /Pending/i });
    fireEvent.click(pendingBtn);

    expect(screen.getByText('Authorize Past History Change')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Enter your account password...')).toBeInTheDocument();
  });

  it('unlocks past day modifications when correct password is provided', () => {
    const handleSave = vi.fn();

    render(
      <CheckInModal
        isOpen={true}
        challenge={mockChallenge}
        dayItem={mockDayItemPast}
        tasks={[]}
        userProfile={mockProfile}
        onClose={vi.fn()}
        onSaveCheckIn={handleSave}
      />
    );

    // Click Unlock with Password button
    const unlockBtn = screen.getAllByRole('button', { name: /Unlock with Password/i })[0];
    fireEvent.click(unlockBtn);

    // Enter correct password
    const passwordInput = screen.getByPlaceholderText('Enter your account password...');
    fireEvent.change(passwordInput, { target: { value: 'Password123!' } });

    const submitBtn = screen.getByRole('button', { name: /Authorize & Proceed/i });
    fireEvent.click(submitBtn);

    // Check that unlocked badge is now visible
    expect(screen.getByText('Unlocked with Password')).toBeInTheDocument();

    // Now quick add task form is accessible
    expect(screen.getByPlaceholderText(/What will you study\/do on Day 1\?/i)).toBeInTheDocument();
  });

  it('locks status selection on future days while allowing task planning', () => {
    const futureDate = '2099-12-31';
    const mockDayItemFuture = {
      dayNumber: 25,
      date: futureDate,
      status: 'pending',
      note: ''
    };

    const handleAddTask = vi.fn();

    render(
      <CheckInModal
        isOpen={true}
        challenge={mockChallenge}
        dayItem={mockDayItemFuture}
        tasks={[]}
        onAddTask={handleAddTask}
        onClose={vi.fn()}
        onSaveCheckIn={vi.fn()}
      />
    );

    expect(screen.getByText(/Planning Mode \(Future\)/i)).toBeInTheDocument();
    expect(screen.getByText(/Check-in Locked \(Future Day\)/i)).toBeInTheDocument();

    // Check status buttons are disabled
    const completedBtn = screen.getByRole('button', { name: /Completed/i });
    expect(completedBtn).toBeDisabled();

    // But planning tasks for this future day is fully enabled!
    const taskInput = screen.getByPlaceholderText(/What will you study\/do on Day 25\?/i);
    expect(taskInput).toBeInTheDocument();

    fireEvent.change(taskInput, { target: { value: 'Future System Design Reading' } });
    const addBtn = screen.getByRole('button', { name: /Add Task/i });
    fireEvent.click(addBtn);

    expect(handleAddTask).toHaveBeenCalledTimes(1);
    expect(handleAddTask).toHaveBeenCalledWith(
      expect.objectContaining({
        title: 'Future System Design Reading',
        dayNumber: 25,
        date: futureDate
      })
    );
  });

  it('renders rollover badge for tasks carried over from previous challenge days', () => {
    const rolledOverTasks = [
      {
        id: 'rollover-task-1',
        title: 'Unfinished Dynamic Programming',
        challengeId: 'ch-1',
        dayNumber: 5,
        date: todayStr,
        completed: false,
        priority: 'High',
        estimatedMinutes: 45,
        rolledOverFrom: {
          dayNumber: 4,
          date: '2026-11-01',
          originalTaskId: 'task-orig-4'
        }
      }
    ];

    render(
      <CheckInModal
        isOpen={true}
        challenge={mockChallenge}
        dayItem={mockDayItemToday}
        tasks={rolledOverTasks}
        onClose={vi.fn()}
        onSaveCheckIn={vi.fn()}
      />
    );

    expect(
      screen.getByText(/Pending from Day 4 \(2026-11-01\)/i)
    ).toBeInTheDocument();
  });
});
