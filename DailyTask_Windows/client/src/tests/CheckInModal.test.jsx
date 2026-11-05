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
    const handleToggleTask = vi.fn();
    const handleDelete = vi.fn();

    render(
      <CheckInModal
        isOpen={true}
        challenge={mockChallenge}
        dayItem={mockDayItemToday}
        tasks={mockTasks}
        userProfile={mockProfile}
        onToggleTask={handleToggleTask}
        onDeleteTask={handleDelete}
        onClose={vi.fn()}
        onSaveCheckIn={vi.fn()}
      />
    );

    // Toggle button on uncompleted task
    const markDoneBtn = screen.getByTitle('Mark completed');
    fireEvent.click(markDoneBtn);
    expect(handleToggleTask).toHaveBeenCalledWith('task-101');

    // Delete button requires universal password verification
    const deleteBtns = screen.getAllByTitle('Delete task');
    fireEvent.click(deleteBtns[0]);
    expect(screen.getByText('Authorize Deletion')).toBeInTheDocument();
    const pwdInput = screen.getByPlaceholderText('Enter your account password...');
    fireEvent.change(pwdInput, { target: { value: 'Password123!' } });
    fireEvent.click(screen.getByRole('button', { name: /Authorize & Proceed/i }));
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

    expect(screen.getByText(/History Protected/i)).toBeInTheDocument();
    expect(
      screen.getByText(/Adding to past day prompts password/i)
    ).toBeInTheDocument();

    // Clicking status triggers password prompt modal
    const pendingBtn = screen.getByRole('button', { name: /Pending/i });
    fireEvent.click(pendingBtn);

    expect(screen.getByText('Authorize Past History Change')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Enter your account password...')).toBeInTheDocument();
  });

  it('authorizes a single action on past day when correct password is provided without persistent unlock', () => {
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

    // Click Pending status on past day
    const pendingBtn = screen.getByRole('button', { name: /Pending/i });
    fireEvent.click(pendingBtn);

    // Enter correct password
    const passwordInput = screen.getByPlaceholderText('Enter your account password...');
    fireEvent.change(passwordInput, { target: { value: 'Password123!' } });

    const submitBtn = screen.getByRole('button', { name: /Authorize & Proceed/i });
    fireEvent.click(submitBtn);

    // Password modal is closed and action executed
    expect(screen.queryByPlaceholderText('Enter your account password...')).not.toBeInTheDocument();
    // Modal still displays history protection for subsequent actions (no persistent unlock)
    expect(screen.getByText(/History Protected \(Single-Action Password\)/i)).toBeInTheDocument();
  });

  it('closes modal when clicking on backdrop overlay', () => {
    const handleClose = vi.fn();

    const { container } = render(
      <CheckInModal
        isOpen={true}
        challenge={mockChallenge}
        dayItem={mockDayItemToday}
        tasks={mockTasks}
        onClose={handleClose}
      />
    );

    // The outermost container is the backdrop
    const backdrop = container.firstChild;
    fireEvent.click(backdrop);

    expect(handleClose).toHaveBeenCalledTimes(1);
  });

  it('enforces task completion rules for completed check-in status', () => {
    // Case 1: 0 tasks planned - Completed button is disabled
    const { rerender } = render(
      <CheckInModal
        isOpen={true}
        challenge={mockChallenge}
        dayItem={mockDayItemToday}
        tasks={[]}
        onClose={vi.fn()}
      />
    );

    const completedBtnEmpty = screen.getAllByRole('button', { name: /Completed/i })[0];
    expect(completedBtnEmpty).toBeDisabled();
    expect(screen.getByText(/Add at least 1 task below and complete it/i)).toBeInTheDocument();

    // Case 2: 1 incomplete task - Completed button is disabled
    rerender(
      <CheckInModal
        isOpen={true}
        challenge={mockChallenge}
        dayItem={mockDayItemToday}
        tasks={[
          {
            id: 'task-1',
            title: 'Incomplete Task',
            challengeId: 'ch-1',
            dayNumber: 5,
            date: todayStr,
            completed: false
          }
        ]}
        onClose={vi.fn()}
      />
    );

    const completedBtnIncomplete = screen.getAllByRole('button', { name: /Completed/i })[0];
    expect(completedBtnIncomplete).toBeDisabled();
    expect(screen.getByText(/Complete all tasks \(0\/1 done\) to mark this day as completed/i)).toBeInTheDocument();

    // Case 3: All tasks completed - Completed status is automatically enabled and selected
    rerender(
      <CheckInModal
        isOpen={true}
        challenge={mockChallenge}
        dayItem={mockDayItemToday}
        tasks={[
          {
            id: 'task-1',
            title: 'Complete Task',
            challengeId: 'ch-1',
            dayNumber: 5,
            date: todayStr,
            completed: true
          }
        ]}
        onClose={vi.fn()}
      />
    );

    const completedBtnAllDone = screen.getAllByRole('button', { name: /Completed/i })[0];
    expect(completedBtnAllDone).not.toBeDisabled();
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
