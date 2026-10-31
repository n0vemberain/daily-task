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

  it('locks past date tasks so they cannot be toggled or edited, but allows deletion', () => {
    const onToggleTask = vi.fn();
    const onDeleteTask = vi.fn();
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
          onEditTask={vi.fn()}
          selectedDate="2026-01-01"
          onClearDateFilter={vi.fn()}
        />
      </ThemeProvider>
    );

    // Verify history locked indicator appears
    expect(screen.getByText(/History Locked/i)).toBeInTheDocument();

    // Verify checkbox button is disabled for past task
    const checkboxBtn = screen.getByTitle('Past date task status is locked and cannot be changed');
    expect(checkboxBtn).toBeDisabled();
    fireEvent.click(checkboxBtn);
    expect(onToggleTask).not.toHaveBeenCalled();

    // Verify edit button is locked/disabled
    expect(screen.getByTitle(/Past date tasks cannot be edited\. You can only delete them\./i)).toBeInTheDocument();
    expect(screen.queryByTitle('Edit individual task')).not.toBeInTheDocument();

    // Verify delete button is active and callable
    const deleteBtn = screen.getByTitle('Delete task');
    expect(deleteBtn).toBeInTheDocument();
    fireEvent.click(deleteBtn);
    expect(onDeleteTask).toHaveBeenCalledWith('past-1');
  });
});
