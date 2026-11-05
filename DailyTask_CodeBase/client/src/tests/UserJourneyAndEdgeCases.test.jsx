import React, { useState } from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, within } from '@testing-library/react';
import TaskManager from '../components/TaskManager';
import ChallengeTracker from '../components/ChallengeTracker';
import ContributionHeatmap from '../components/ContributionHeatmap';
import { formatDateStr } from '../data/initialData';

const mockProfile = {
  username: 'n0vemberain',
  password: 'SecurePassword123!',
  email: 'test@example.com'
};

describe('User Journey & Edge Case Testing Suite', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('TaskManager Tab Ordering Requirement', () => {
    it('strictly renders filter tabs in order: Today -> Due -> Pending -> Completed -> All', () => {
      const mockTasks = [
        { id: 't1', title: 'Task 1', date: formatDateStr(new Date()), completed: false }
      ];

      render(
        <TaskManager
          tasks={mockTasks}
          onAddTask={vi.fn()}
          onToggleTask={vi.fn()}
          onDeleteTask={vi.fn()}
          onEditTask={vi.fn()}
          userProfile={mockProfile}
        />
      );

      // Find the tab buttons container
      const tabNames = ['Today', 'Due', 'Pending', 'Completed', 'All'];
      const buttons = screen.getAllByRole('button');
      const foundTabLabels = [];

      buttons.forEach((btn) => {
        const text = btn.textContent || '';
        for (const name of tabNames) {
          if (text.startsWith(name)) {
            foundTabLabels.push(name);
            break;
          }
        }
      });

      // Assert that Due appears BEFORE Pending
      const dueIndex = foundTabLabels.indexOf('Due');
      const pendingIndex = foundTabLabels.indexOf('Pending');
      const todayIndex = foundTabLabels.indexOf('Today');
      const completedIndex = foundTabLabels.indexOf('Completed');
      const allIndex = foundTabLabels.indexOf('All');

      expect(todayIndex).toBeLessThan(dueIndex);
      expect(dueIndex).toBeLessThan(pendingIndex);
      expect(pendingIndex).toBeLessThan(completedIndex);
      expect(completedIndex).toBeLessThan(allIndex);
    });
  });

  describe('Heatmap Cell Selection, Task Edit & Task Delete Flow', () => {
    it('allows editing a task while filtered by a selected heatmap date without resetting filter', () => {
      const todayStr = formatDateStr(new Date());
      const mockTasks = [
        {
          id: 'task-today-1',
          title: 'Review System Metrics',
          date: todayStr,
          completed: false,
          category: 'Work',
          priority: 'high',
          estimate: 45
        },
        {
          id: 'task-other',
          title: 'Unrelated Day Task',
          date: '2025-01-01',
          completed: false,
          category: 'Personal',
          priority: 'medium'
        }
      ];

      const handleEditTask = vi.fn();
      const handleClearFilter = vi.fn();

      render(
        <TaskManager
          tasks={mockTasks}
          selectedDate={todayStr}
          onClearDateFilter={handleClearFilter}
          onAddTask={vi.fn()}
          onToggleTask={vi.fn()}
          onDeleteTask={vi.fn()}
          onEditTask={handleEditTask}
          userProfile={mockProfile}
        />
      );

      // Filter banner should be visible
      expect(screen.getByText(new RegExp(`Filtered: ${todayStr}`, 'i'))).toBeInTheDocument();
      expect(screen.getByText('Review System Metrics')).toBeInTheDocument();
      expect(screen.queryByText('Unrelated Day Task')).not.toBeInTheDocument();

      // Click Edit Task button
      const editBtn = screen.getByTitle(/Edit/i);
      fireEvent.click(editBtn);

      // EditTaskModal opens
      expect(screen.getByText('Edit Task Details')).toBeInTheDocument();

      // Update the title input
      const titleInput = screen.getByDisplayValue('Review System Metrics');
      fireEvent.change(titleInput, { target: { value: 'Review System Metrics Updated' } });

      // Save changes
      const saveBtn = screen.getByRole('button', { name: /Update Task/i });
      fireEvent.click(saveBtn);

      expect(handleEditTask).toHaveBeenCalledWith(
        'task-today-1',
        expect.objectContaining({ title: 'Review System Metrics Updated' })
      );
    });

    it('requires password authorization when deleting a task in the date-filtered view', () => {
      const todayStr = formatDateStr(new Date());
      const mockTasks = [
        {
          id: 'task-today-del',
          title: 'Task To Delete',
          date: todayStr,
          completed: false,
          category: 'Work',
          priority: 'low'
        }
      ];

      const handleDeleteTask = vi.fn();

      render(
        <TaskManager
          tasks={mockTasks}
          selectedDate={todayStr}
          onClearDateFilter={vi.fn()}
          onAddTask={vi.fn()}
          onToggleTask={vi.fn()}
          onDeleteTask={handleDeleteTask}
          onEditTask={vi.fn()}
          userProfile={mockProfile}
        />
      );

      // Click Delete button on the task
      const deleteBtn = screen.getByTitle(/Delete task/i);
      fireEvent.click(deleteBtn);

      // PasswordPromptModal should pop up
      expect(screen.getByText(/Authorize Task Deletion/i)).toBeInTheDocument();

      // Enter incorrect password
      const passwordInput = screen.getByPlaceholderText(/account password/i);
      fireEvent.change(passwordInput, { target: { value: 'WrongPassword' } });
      fireEvent.click(screen.getByRole('button', { name: /Authorize & Proceed/i }));

      expect(screen.getByText(/Incorrect password/i)).toBeInTheDocument();
      expect(handleDeleteTask).not.toHaveBeenCalled();

      // Enter correct password
      fireEvent.change(passwordInput, { target: { value: 'SecurePassword123!' } });
      fireEvent.click(screen.getByRole('button', { name: /Authorize & Proceed/i }));

      expect(handleDeleteTask).toHaveBeenCalledWith('task-today-del');
    });
  });

  describe('ChallengeTracker Minimize/Maximize & Tab Switch Auto-Minimize', () => {
    const mockChallenge = {
      id: 'ch-journey',
      title: '7-Day Fasting & Fitness',
      description: 'Daily body wellness challenge',
      category: 'Health',
      durationDays: 7,
      startDate: '2026-10-10',
      endDate: '2026-10-16',
      status: 'active',
      checkIns: Array.from({ length: 7 }, (_, i) => ({
        dayNumber: i + 1,
        date: `2026-10-${10 + i}`,
        status: 'pending',
        note: ''
      }))
    };

    it('starts minimized and toggles open when clicking anywhere on the header bar', () => {
      render(
        <ChallengeTracker
          challenges={[mockChallenge]}
          tasks={[]}
          activeTab="challenges"
          onAddTask={vi.fn()}
          onToggleTask={vi.fn()}
          onDeleteTask={vi.fn()}
          onCreateChallenge={vi.fn()}
          onCheckIn={vi.fn()}
          onDeleteChallenge={vi.fn()}
          userProfile={mockProfile}
        />
      );

      // Challenge begins in minimized state
      expect(screen.queryByText('Day-by-Day Check-in Grid')).not.toBeInTheDocument();
      expect(screen.getByText('Expand')).toBeInTheDocument();

      // Click anywhere on the challenge header bar
      const challengeTitle = screen.getByText('7-Day Fasting & Fitness');
      const headerBar = challengeTitle.closest('.cursor-pointer');
      fireEvent.click(headerBar);

      // It is now expanded
      expect(screen.getByText('Day-by-Day Check-in Grid')).toBeInTheDocument();
      expect(screen.getByText('Minimize')).toBeInTheDocument();

      // Click the top portion of the header again to collapse
      fireEvent.click(headerBar);
      expect(screen.queryByText('Day-by-Day Check-in Grid')).not.toBeInTheDocument();
    });

    it('automatically resets all challenges to minimized when activeTab switches', () => {
      function TabSwitchHarness() {
        const [tab, setTab] = useState('challenges');
        return (
          <div>
            <button onClick={() => setTab('overview')} data-testid="goto-overview">
              Go to Overview
            </button>
            <button onClick={() => setTab('challenges')} data-testid="goto-challenges">
              Go to Challenges
            </button>
            <ChallengeTracker
              challenges={[mockChallenge]}
              tasks={[]}
              activeTab={tab}
              onAddTask={vi.fn()}
              onToggleTask={vi.fn()}
              onDeleteTask={vi.fn()}
              onCreateChallenge={vi.fn()}
              onCheckIn={vi.fn()}
              onDeleteChallenge={vi.fn()}
              userProfile={mockProfile}
            />
          </div>
        );
      }

      render(<TabSwitchHarness />);

      // Initially minimized
      expect(screen.queryByText('Day-by-Day Check-in Grid')).not.toBeInTheDocument();

      // Expand challenge
      const expandBtn = screen.getByTitle('Maximize Challenge Grid');
      fireEvent.click(expandBtn);
      expect(screen.getByText('Day-by-Day Check-in Grid')).toBeInTheDocument();

      // Switch to overview tab
      fireEvent.click(screen.getByTestId('goto-overview'));

      // Switch back to challenges tab
      fireEvent.click(screen.getByTestId('goto-challenges'));

      // Challenges must have automatically reset to minimized!
      expect(screen.queryByText('Day-by-Day Check-in Grid')).not.toBeInTheDocument();
    });
  });
});
