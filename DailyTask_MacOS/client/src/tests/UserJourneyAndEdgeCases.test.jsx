import React, { useState } from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, within } from '@testing-library/react';
import TaskManager from '../components/TaskManager';
import ChallengeTracker from '../components/ChallengeTracker';
import ContributionHeatmap from '../components/ContributionHeatmap';
import { formatDateStr } from '../data/initialData';
import { storageService } from '../services/storageService';

vi.mock('canvas-confetti', () => ({
  default: vi.fn()
}));

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
    it('strictly renders filter tabs in order: Today -> Due -> Active -> Completed -> All', () => {
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
      const tabNames = ['Today', 'Due', 'Active', 'Pending', 'Completed', 'All'];
      const buttons = screen.getAllByRole('button');
      const foundTabLabels = [];

      buttons.forEach((btn) => {
        const text = btn.textContent || '';
        for (const name of tabNames) {
          if (text.startsWith(name)) {
            foundTabLabels.push(name === 'Pending' ? 'Active' : name);
            break;
          }
        }
      });

      // Assert that Due appears BEFORE Active
      const dueIndex = foundTabLabels.indexOf('Due');
      const activeIndex = foundTabLabels.indexOf('Active');
      const todayIndex = foundTabLabels.indexOf('Today');
      const completedIndex = foundTabLabels.indexOf('Completed');
      const allIndex = foundTabLabels.indexOf('All');

      expect(todayIndex).toBeLessThan(dueIndex);
      expect(dueIndex).toBeLessThan(activeIndex);
      expect(activeIndex).toBeLessThan(completedIndex);
      expect(completedIndex).toBeLessThan(allIndex);
    });

    it('moves completed task to Completed filter, excludes it from Active, and shows both in All', () => {
      function TaskManagerFilterHarness() {
        const [tasks, setTasks] = useState([
          { id: 't-active-1', title: 'Pending Active Task', date: '2026-11-06', completed: false, category: 'Work', priority: 'Medium' },
          { id: 't-completed-1', title: 'Already Done Task', date: '2026-11-06', completed: true, category: 'Work', priority: 'Low' }
        ]);

        const handleToggle = (id) => {
          setTasks((prev) =>
            prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
          );
        };

        return (
          <TaskManager
            tasks={tasks}
            onAddTask={vi.fn()}
            onToggleTask={handleToggle}
            onDeleteTask={vi.fn()}
            onEditTask={vi.fn()}
            userProfile={mockProfile}
          />
        );
      }

      render(<TaskManagerFilterHarness />);

      // Switch to Active filter
      const activeBtn = screen.getByRole('button', { name: /^Active \(/i });
      fireEvent.click(activeBtn);

      // In Active filter, only incomplete task shows
      expect(screen.getByText('Pending Active Task')).toBeInTheDocument();
      expect(screen.queryByText('Already Done Task')).not.toBeInTheDocument();

      // Complete the active task by clicking toggle button
      const toggleBtn = screen.getByTitle('Mark completed');
      fireEvent.click(toggleBtn);

      // It must immediately disappear from Active filter!
      expect(screen.queryByText('Pending Active Task')).not.toBeInTheDocument();
      expect(screen.getByText('No tasks found')).toBeInTheDocument();

      // Switch to Completed filter
      const completedBtn = screen.getByRole('button', { name: /^Completed \(/i });
      fireEvent.click(completedBtn);

      // Both tasks are now completed and visible in Completed filter
      expect(screen.getByText('Pending Active Task')).toBeInTheDocument();
      expect(screen.getByText('Already Done Task')).toBeInTheDocument();

      // Switch to All filter
      const allBtn = screen.getByRole('button', { name: /^All \(/i });
      fireEvent.click(allBtn);

      // All filter shows all tasks
      expect(screen.getByText('Pending Active Task')).toBeInTheDocument();
      expect(screen.getByText('Already Done Task')).toBeInTheDocument();
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

  describe('Heatmap Outside Click Deselection & TaskManager Interaction Isolation', () => {
    it('unselects date when clicking elsewhere on the page, but preserves selection when clicking task actions', async () => {
      const handleSelectDate = vi.fn();
      const todayStr = formatDateStr(new Date());

      function IntegratedViewHarness() {
        return (
          <div>
            <div data-testid="outside-background-area">Page Background Header</div>
            <ContributionHeatmap
              tasks={[]}
              selectedDate={todayStr}
              onSelectDate={handleSelectDate}
            />
            <div data-testid="task-manager-container">
              <button data-task-action="true" data-testid="task-edit-btn">Edit Task Inside Manager</button>
            </div>
          </div>
        );
      }

      render(<IntegratedViewHarness />);

      // Wait a tick for the outside click listener to be attached
      await new Promise((r) => setTimeout(r, 20));

      // 1. Click inside TaskManager container -> MUST NOT deselect
      const taskEditBtn = screen.getByTestId('task-edit-btn');
      fireEvent.click(taskEditBtn);
      expect(handleSelectDate).not.toHaveBeenCalledWith(null);

      // 2. Click outside in the background area -> MUST deselect
      const outsideArea = screen.getByTestId('outside-background-area');
      fireEvent.click(outsideArea);
      expect(handleSelectDate).toHaveBeenCalledWith(null);
    });
  });

  describe('Recycle Bin Data Integrity & Array Preservation', () => {
    it('returns an array and maintains valid structure when adding, removing, and emptying the bin', () => {
      const testUser = 'rb_test_user';

      // Ensure clean state
      storageService.clearRecycleBin(testUser);

      // Add a task to recycle bin
      const mockTask = { id: 'task-rb-1', title: 'Recycled Task', date: '2026-11-01' };
      const binAfterAdd = storageService.addToRecycleBin('task', mockTask, [], testUser);

      expect(Array.isArray(binAfterAdd)).toBe(true);
      expect(binAfterAdd.length).toBe(1);
      expect(binAfterAdd[0].item.title).toBe('Recycled Task');
      expect(binAfterAdd[0].recycleBinId).toBe(binAfterAdd[0].id);

      // Remove the item from recycle bin
      const binAfterRemove = storageService.removeFromRecycleBin(binAfterAdd[0].id, testUser);
      expect(Array.isArray(binAfterRemove)).toBe(true);
      expect(binAfterRemove.length).toBe(0);

      // Clear empty bin returns empty array
      const binAfterClear = storageService.clearRecycleBin(testUser);
      expect(Array.isArray(binAfterClear)).toBe(true);
      expect(binAfterClear.length).toBe(0);
    });
  });
});
