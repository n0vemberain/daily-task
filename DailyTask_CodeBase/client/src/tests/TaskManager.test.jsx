import { describe, it, expect, vi } from 'vitest';
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import TaskManager from '../components/TaskManager';
import { ThemeProvider } from '../context/ThemeContext';
import { formatDateStr } from '../data/initialData';

describe('TaskManager Component', () => {
  const todayStr = formatDateStr(new Date());
  const sampleTasks = [
    {
      id: 'task-1',
      title: 'Review pull request',
      category: 'Coding',
      priority: 'High',
      estimatedMinutes: 30,
      date: todayStr,
      completed: false
    },
    {
      id: 'task-2',
      title: 'Gym workout',
      category: 'Fitness',
      priority: 'Low',
      estimatedMinutes: 45,
      date: todayStr,
      completed: false
    },
    {
      id: 'task-3',
      title: 'Study React',
      category: 'Study',
      priority: 'Medium',
      estimatedMinutes: 20,
      date: todayStr,
      completed: false
    }
  ];

  it('renders task list and search filter', () => {
    render(
      <ThemeProvider>
        <TaskManager
          tasks={sampleTasks}
          onAddTask={vi.fn()}
          onToggleTask={vi.fn()}
          onDeleteTask={vi.fn()}
          onEditTask={vi.fn()}
          selectedDate={null}
          onClearDateFilter={vi.fn()}
          onOpenDataClean={vi.fn()}
        />
      </ThemeProvider>
    );

    expect(screen.getByText('Review pull request')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Search tasks...')).toBeInTheDocument();
  });

  it('allows manual entry of a new custom category', () => {
    const onAddTask = vi.fn();

    render(
      <ThemeProvider>
        <TaskManager
          tasks={sampleTasks}
          onAddTask={onAddTask}
          onToggleTask={vi.fn()}
          onDeleteTask={vi.fn()}
          onEditTask={vi.fn()}
          selectedDate={null}
          onClearDateFilter={vi.fn()}
          onOpenDataClean={vi.fn()}
        />
      </ThemeProvider>
    );

    // Open add task form
    const addBtn = screen.getByText('Add New Task');
    fireEvent.click(addBtn);

    // Click "+ Enter Manually"
    const enterManuallyBtn = screen.getByText('+ Enter Manually');
    fireEvent.click(enterManuallyBtn);

    // Type task title and custom category
    const titleInput = screen.getByPlaceholderText(/e\.g\. Implement dynamic heat map tooltip/i);
    const categoryInput = screen.getByPlaceholderText('Type new category...');

    fireEvent.change(titleInput, { target: { value: 'Design new architecture' } });
    fireEvent.change(categoryInput, { target: { value: 'System Design' } });

    // Submit form
    const saveBtn = screen.getByText('Save & Add Task');
    fireEvent.click(saveBtn);

    expect(onAddTask).toHaveBeenCalledWith(
      expect.objectContaining({
        title: 'Design new architecture',
        category: 'System Design'
      })
    );
  });

  it('filters tasks by priority', () => {
    render(
      <ThemeProvider>
        <TaskManager
          tasks={sampleTasks}
          onAddTask={vi.fn()}
          onToggleTask={vi.fn()}
          onDeleteTask={vi.fn()}
          onEditTask={vi.fn()}
          selectedDate={null}
          onClearDateFilter={vi.fn()}
        />
      </ThemeProvider>
    );

    // Initially all 3 tasks are present
    expect(screen.getByText('Review pull request')).toBeInTheDocument();
    expect(screen.getByText('Gym workout')).toBeInTheDocument();
    expect(screen.getByText('Study React')).toBeInTheDocument();

    // Click 'High Priority' filter
    fireEvent.click(screen.getByText('High Priority'));
    expect(screen.getByText('Review pull request')).toBeInTheDocument();
    expect(screen.queryByText('Gym workout')).not.toBeInTheDocument();
    expect(screen.queryByText('Study React')).not.toBeInTheDocument();

    // Click 'Medium Priority' filter
    fireEvent.click(screen.getByText('Medium Priority'));
    expect(screen.queryByText('Review pull request')).not.toBeInTheDocument();
    expect(screen.getByText('Study React')).toBeInTheDocument();
  });

  it('sorts tasks by priority order', () => {
    render(
      <ThemeProvider>
        <TaskManager
          tasks={sampleTasks}
          onAddTask={vi.fn()}
          onToggleTask={vi.fn()}
          onDeleteTask={vi.fn()}
          onEditTask={vi.fn()}
          selectedDate={null}
          onClearDateFilter={vi.fn()}
        />
      </ThemeProvider>
    );

    const sortSelect = screen.getByLabelText('Sort tasks by priority or date');
    fireEvent.change(sortSelect, { target: { value: 'high-first' } });

    // Verify select value changed
    expect(sortSelect.value).toBe('high-first');
  });

  it('requires password authorization to modify, toggle, edit, or delete past date tasks', () => {
    const onToggleTask = vi.fn();
    const onDeleteTask = vi.fn();
    const onEditTask = vi.fn();
    const mockProfile = {
      username: 'testuser',
      password: 'SecretPassword123!'
    };

    const pastTasks = [
      {
        id: 'past-1',
        title: 'Completed algorithm practice',
        category: 'Coding',
        priority: 'High',
        estimatedMinutes: 45,
        date: '2026-01-01',
        completed: true
      }
    ];

    render(
      <ThemeProvider>
        <TaskManager
          tasks={pastTasks}
          onAddTask={vi.fn()}
          onToggleTask={onToggleTask}
          onDeleteTask={onDeleteTask}
          onEditTask={onEditTask}
          selectedDate="2026-01-01"
          onClearDateFilter={vi.fn()}
          userProfile={mockProfile}
        />
      </ThemeProvider>
    );

    // Verify history locked indicator appears
    expect(screen.getByText(/History Locked/i)).toBeInTheDocument();
    expect(screen.getByText('Protected History')).toBeInTheDocument();

    // 1. Toggling past task triggers password prompt modal
    const checkboxBtn = screen.getByTitle('Modifying past task status requires password');
    fireEvent.click(checkboxBtn);

    expect(screen.getByText('Authorize Status Change')).toBeInTheDocument();
    expect(
      screen.getByText(/Modifying completion status for past task "Completed algorithm practice"/i)
    ).toBeInTheDocument();

    // Cancel prompt
    fireEvent.click(screen.getByRole('button', { name: 'Cancel' }));
    expect(onToggleTask).not.toHaveBeenCalled();

    // 2. Deleting past task triggers password prompt modal
    const deleteBtn = screen.getByTitle('Delete past task (Requires password)');
    fireEvent.click(deleteBtn);

    expect(screen.getByText('Authorize Task Deletion')).toBeInTheDocument();

    // Enter wrong password
    const passwordInput = screen.getByPlaceholderText('Enter your account password...');
    fireEvent.change(passwordInput, { target: { value: 'WrongPassword' } });
    fireEvent.click(screen.getByRole('button', { name: /Authorize & Proceed/i }));

    expect(screen.getByText(/Incorrect password\. Authorization failed\./i)).toBeInTheDocument();
    expect(onDeleteTask).not.toHaveBeenCalled();

    // Enter correct password and authorize
    fireEvent.change(passwordInput, { target: { value: 'SecretPassword123!' } });
    fireEvent.click(screen.getByRole('button', { name: /Authorize & Proceed/i }));

    expect(onDeleteTask).toHaveBeenCalledWith('past-1');
  });

  it('displays Goal Challenge badge when a task is linked to a challenge day', () => {
    const challengeTasks = [
      {
        id: 'task-ch-1',
        title: 'Solve LeetCode #15',
        category: 'Coding',
        priority: 'High',
        estimatedMinutes: 30,
        date: todayStr,
        completed: false,
        challengeId: 'ch-1',
        challengeTitle: '30-Day LeetCode Grind',
        dayNumber: 3
      }
    ];

    render(
      <ThemeProvider>
        <TaskManager
          tasks={challengeTasks}
          onAddTask={vi.fn()}
          onToggleTask={vi.fn()}
          onDeleteTask={vi.fn()}
          onEditTask={vi.fn()}
        />
      </ThemeProvider>
    );

    expect(screen.getByText(/Day 3 • 30-Day LeetCode Grind/i)).toBeInTheDocument();
  });

  it('displays rollover badge when a task was carried over from previous day', () => {
    const rolledOverTasks = [
      {
        id: 'rollover-task-2',
        title: 'Review System Design Microservices',
        category: 'Study',
        priority: 'High',
        estimatedMinutes: 45,
        date: todayStr,
        completed: false,
        challengeId: 'ch-1',
        challengeTitle: '30-Day LeetCode Grind',
        dayNumber: 2,
        rolledOverFrom: {
          dayNumber: 1,
          date: '2026-11-01',
          originalTaskId: 'task-orig-1'
        }
      }
    ];

    render(
      <ThemeProvider>
        <TaskManager
          tasks={rolledOverTasks}
          onAddTask={vi.fn()}
          onToggleTask={vi.fn()}
          onDeleteTask={vi.fn()}
          onEditTask={vi.fn()}
        />
      </ThemeProvider>
    );

    expect(
      screen.getByText(/Pending from Day 1 \(2026-11-01\)/i)
    ).toBeInTheDocument();
  });

  it('opens EditTaskModal when clicking the edit button on a task and saves changes without crashing', () => {
    const onEditTask = vi.fn();
    render(
      <ThemeProvider>
        <TaskManager
          tasks={sampleTasks}
          onAddTask={vi.fn()}
          onToggleTask={vi.fn()}
          onDeleteTask={vi.fn()}
          onEditTask={onEditTask}
        />
      </ThemeProvider>
    );

    const editButtons = screen.getAllByTitle('Edit individual task');
    expect(editButtons.length).toBeGreaterThan(0);

    // Click edit on the first task
    fireEvent.click(editButtons[0]);

    // Verify modal opened properly and rendered task fields without crashing
    expect(screen.getByText('Edit Task Details')).toBeInTheDocument();
    const titleInput = screen.getByDisplayValue('Review pull request');
    expect(titleInput).toBeInTheDocument();

    // Change title and submit
    fireEvent.change(titleInput, { target: { value: 'Review pull request thoroughly' } });
    fireEvent.click(screen.getByRole('button', { name: 'Update Task' }));

    expect(onEditTask).toHaveBeenCalledWith(
      'task-1',
      expect.objectContaining({
        title: 'Review pull request thoroughly'
      })
    );
  });

  it('allows associating a task with a Goal Challenge when creating a task', () => {
    const onAddTask = vi.fn();
    const mockChallenges = [
      {
        id: 'ch-leetcode',
        title: '30-Day LeetCode Grind',
        durationDays: 30,
        checkIns: [
          { dayNumber: 1, date: todayStr }
        ]
      }
    ];

    render(
      <ThemeProvider>
        <TaskManager
          tasks={sampleTasks}
          challenges={mockChallenges}
          onAddTask={onAddTask}
          onToggleTask={vi.fn()}
          onDeleteTask={vi.fn()}
          onEditTask={vi.fn()}
        />
      </ThemeProvider>
    );

    fireEvent.click(screen.getByText('Add New Task'));

    const titleInput = screen.getByPlaceholderText(/e\.g\. Implement dynamic heat map tooltip/i);
    fireEvent.change(titleInput, { target: { value: 'Solve Two Sum' } });

    const selects = screen.getAllByRole('combobox');
    const challengeSelect = selects.find(s => s.innerHTML.includes('30-Day LeetCode Grind'));
    expect(challengeSelect).toBeDefined();
    fireEvent.change(challengeSelect, { target: { value: 'ch-leetcode' } });

    fireEvent.click(screen.getByText('Save & Add Task'));

    expect(onAddTask).toHaveBeenCalledWith(
      expect.objectContaining({
        title: 'Solve Two Sum',
        challengeId: 'ch-leetcode',
        challengeTitle: '30-Day LeetCode Grind',
        dayNumber: 1
      })
    );
  });

  it('filters tasks using the Due filter button', () => {
    const mixedTasks = [
      {
        id: 'task-today-pending',
        title: 'Due today pending',
        category: 'Work',
        priority: 'High',
        date: todayStr,
        completed: false
      },
      {
        id: 'task-past-pending',
        title: 'Overdue past pending',
        category: 'Work',
        priority: 'High',
        date: '2026-10-01',
        completed: false
      },
      {
        id: 'task-completed',
        title: 'Finished task',
        category: 'Work',
        priority: 'Low',
        date: '2026-10-01',
        completed: true
      },
      {
        id: 'task-future',
        title: 'Future task',
        category: 'Work',
        priority: 'Low',
        date: '2099-01-01',
        completed: false
      }
    ];

    render(
      <ThemeProvider>
        <TaskManager
          tasks={mixedTasks}
          onAddTask={vi.fn()}
          onToggleTask={vi.fn()}
          onDeleteTask={vi.fn()}
          onEditTask={vi.fn()}
        />
      </ThemeProvider>
    );

    const dueBtn = screen.getByText(/Due \(2\)/i);
    expect(dueBtn).toBeInTheDocument();

    fireEvent.click(dueBtn);

    expect(screen.getByText('Due today pending')).toBeInTheDocument();
    expect(screen.getByText('Overdue past pending')).toBeInTheDocument();
    expect(screen.queryByText('Finished task')).not.toBeInTheDocument();
    expect(screen.queryByText('Future task')).not.toBeInTheDocument();
  });

  it('displays completed timestamp when a task is completed', () => {
    const completedTasks = [
      {
        id: 'task-done-1',
        title: 'Completed task with timestamp',
        category: 'Coding',
        priority: 'Medium',
        estimatedMinutes: 25,
        date: todayStr,
        completed: true,
        completedAt: '2026-11-06T02:15:00.000Z'
      }
    ];

    render(
      <ThemeProvider>
        <TaskManager
          tasks={completedTasks}
          onAddTask={vi.fn()}
          onToggleTask={vi.fn()}
          onDeleteTask={vi.fn()}
          onEditTask={vi.fn()}
        />
      </ThemeProvider>
    );

    expect(screen.getByText(/Completed:/i)).toBeInTheDocument();
  });

  it('requires password authorization when deleting any task (including today tasks)', () => {
    const onDeleteTask = vi.fn();
    const mockProfile = {
      username: 'taskuser',
      password: 'TaskPassword999!'
    };

    render(
      <ThemeProvider>
        <TaskManager
          tasks={sampleTasks}
          onAddTask={vi.fn()}
          onToggleTask={vi.fn()}
          onDeleteTask={onDeleteTask}
          onEditTask={vi.fn()}
          userProfile={mockProfile}
        />
      </ThemeProvider>
    );

    const deleteBtns = screen.getAllByTitle('Delete task (Requires password)');
    fireEvent.click(deleteBtns[0]);

    expect(screen.getByText('Authorize Task Deletion')).toBeInTheDocument();
    const passwordInput = screen.getByPlaceholderText('Enter your account password...');
    fireEvent.change(passwordInput, { target: { value: 'TaskPassword999!' } });
    fireEvent.click(screen.getByRole('button', { name: /Authorize & Proceed/i }));

    expect(onDeleteTask).toHaveBeenCalledWith(sampleTasks[0].id);
  });
});
