import { describe, it, expect, vi } from 'vitest';
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import TaskManager from '../components/TaskManager';
import { ThemeProvider } from '../context/ThemeContext';

describe('TaskManager Component', () => {
  const sampleTasks = [
    {
      id: 'task-1',
      title: 'Review pull request',
      category: 'Coding',
      priority: 'High',
      estimatedMinutes: 30,
      date: '2026-10-26',
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
});
