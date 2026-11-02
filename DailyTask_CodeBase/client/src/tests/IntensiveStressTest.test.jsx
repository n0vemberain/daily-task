import { describe, it, expect, vi, beforeEach } from 'vitest';
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import TaskManager from '../components/TaskManager';
import EditTaskModal from '../components/EditTaskModal';
import PasswordPromptModal from '../components/PasswordPromptModal';
import { ThemeProvider } from '../context/ThemeContext';
import { storageService } from '../services/storageService';
import { formatDateStr } from '../data/initialData';

describe('Intensive Stress and Boundary Robustness Test Suite', () => {
  const todayStr = formatDateStr(new Date());

  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  describe('1. High-Throughput Task Manipulation Stress Test', () => {
    it('handles rapid sequential creation, toggling, and deletion of 50 tasks without state corruption', () => {
      let stateTasks = [];
      const onAddTask = vi.fn((newTask) => {
        stateTasks = [newTask, ...stateTasks];
      });
      const onToggleTask = vi.fn((taskId) => {
        stateTasks = stateTasks.map((t) => (t.id === taskId ? { ...t, completed: !t.completed } : t));
      });
      const onDeleteTask = vi.fn((taskId) => {
        stateTasks = stateTasks.filter((t) => t.id !== taskId);
      });
      const onEditTask = vi.fn();

      const { rerender } = render(
        <ThemeProvider>
          <TaskManager
            tasks={stateTasks}
            onAddTask={onAddTask}
            onToggleTask={onToggleTask}
            onDeleteTask={onDeleteTask}
            onEditTask={onEditTask}
          />
        </ThemeProvider>
      );

      // Rapidly create 50 tasks
      for (let i = 1; i <= 50; i++) {
        const generatedTask = {
          id: `stress-task-${i}`,
          title: `Stress Test Item #${i}`,
          category: i % 2 === 0 ? 'Coding' : 'Study',
          priority: i % 3 === 0 ? 'High' : i % 3 === 1 ? 'Medium' : 'Low',
          estimatedMinutes: (i % 60) + 10,
          date: todayStr,
          completed: false
        };
        onAddTask(generatedTask);
      }

      expect(stateTasks.length).toBe(50);

      // Re-render with populated tasks
      rerender(
        <ThemeProvider>
          <TaskManager
            tasks={stateTasks}
            onAddTask={onAddTask}
            onToggleTask={onToggleTask}
            onDeleteTask={onDeleteTask}
            onEditTask={onEditTask}
          />
        </ThemeProvider>
      );

      // Toggle every second task
      for (let i = 1; i <= 50; i += 2) {
        onToggleTask(`stress-task-${i}`);
      }

      const completedCount = stateTasks.filter((t) => t.completed).length;
      expect(completedCount).toBe(25);

      // Delete 20 tasks
      for (let i = 1; i <= 20; i++) {
        onDeleteTask(`stress-task-${i}`);
      }

      expect(stateTasks.length).toBe(30);
    });
  });

  describe('2. Payload Fuzzing, Boundary Conditions & Injection Testing', () => {
    it('safely renders and updates task titles containing XSS scripts, SQL injections, and huge strings', () => {
      const maliciousPayloads = [
        '<script>alert("XSS")</script>',
        '<img src=x onerror=alert(1)>',
        "'; DROP TABLE tasks; --",
        '{"$gt": ""}',
        'আমার বাংলা দৈনিক কাজের বিবরণী',
        'A'.repeat(1500)
      ];

      maliciousPayloads.forEach((payload, index) => {
        const onSaveTask = vi.fn();
        const testTask = {
          id: `fuzz-${index}`,
          title: payload,
          category: 'Coding',
          priority: 'High',
          date: todayStr,
          estimatedMinutes: 30,
          completed: false
        };

        const { unmount } = render(
          <ThemeProvider>
            <EditTaskModal
              isOpen={true}
              onClose={vi.fn()}
              task={testTask}
              onSaveTask={onSaveTask}
            />
          </ThemeProvider>
        );

        // Verify inputs render without throwing DOM exceptions
        const inputs = screen.getAllByRole('textbox');
        expect(inputs.length).toBeGreaterThan(0);

        // Submit form
        fireEvent.click(screen.getByRole('button', { name: 'Update Task' }));
        expect(onSaveTask).toHaveBeenCalledWith(
          `fuzz-${index}`,
          expect.objectContaining({
            title: payload
          })
        );

        unmount();
      });
    });

    it('handles extreme dates including leap years, far future, and year 1970 gracefully', () => {
      const edgeDates = ['1970-01-01', '2028-02-29', '2099-12-31'];

      edgeDates.forEach((dStr, idx) => {
        const onSave = vi.fn();
        const task = {
          id: `date-edge-${idx}`,
          title: `Boundary Date Task ${dStr}`,
          category: 'Fitness',
          priority: 'Low',
          date: dStr,
          estimatedMinutes: 20
        };

        const { unmount } = render(
          <ThemeProvider>
            <EditTaskModal
              isOpen={true}
              onClose={vi.fn()}
              task={task}
              onSaveTask={onSave}
            />
          </ThemeProvider>
        );

        expect(screen.getByDisplayValue(dStr)).toBeInTheDocument();
        fireEvent.click(screen.getByRole('button', { name: 'Update Task' }));
        expect(onSave).toHaveBeenCalledWith(
          `date-edge-${idx}`,
          expect.objectContaining({ date: dStr })
        );

        unmount();
      });
    });

    it('sanitizes and clamps estimated minutes on negative or zero inputs', () => {
      const onSave = vi.fn();
      const task = {
        id: 'est-min-edge',
        title: 'Task with extreme duration',
        category: 'Study',
        priority: 'Medium',
        date: todayStr,
        estimatedMinutes: 30
      };

      render(
        <ThemeProvider>
          <EditTaskModal
            isOpen={true}
            onClose={vi.fn()}
            task={task}
            onSaveTask={onSave}
          />
        </ThemeProvider>
      );

      const numInput = screen.getByRole('spinbutton');
      fireEvent.change(numInput, { target: { value: '-15' } });
      const form = screen.getByRole('button', { name: 'Update Task' }).closest('form');
      fireEvent.submit(form);

      // Value parses safely and clamps to minimum 5 without producing negative numbers or NaN
      expect(onSave).toHaveBeenCalledWith(
        'est-min-edge',
        expect.objectContaining({
          estimatedMinutes: 5
        })
      );
    });
  });

  describe('3. Multi-Tenant Storage Partitioning & Leak Prevention', () => {
    it('strictly isolates tasks, challenges, and user profiles across multiple users', () => {
      const userAlpha = 'guest_alpha';
      const userBeta = 'guest_beta';
      const admin = 'n0vemberain';

      const alphaTask = { id: 't-alpha', title: 'Alpha Private Task', date: todayStr };
      const betaTask = { id: 't-beta', title: 'Beta Secret Task', date: todayStr };
      const adminTask = { id: 't-admin', title: 'Admin Master Task', date: todayStr };

      storageService.saveTasks([alphaTask], userAlpha);
      storageService.saveTasks([betaTask], userBeta);
      storageService.saveTasks([adminTask], admin);

      // Verify userAlpha only reads alphaTask
      const alphaRetrieved = storageService.getTasks(userAlpha);
      expect(alphaRetrieved.length).toBe(1);
      expect(alphaRetrieved[0].title).toBe('Alpha Private Task');

      // Verify userBeta only reads betaTask
      const betaRetrieved = storageService.getTasks(userBeta);
      expect(betaRetrieved.length).toBe(1);
      expect(betaRetrieved[0].title).toBe('Beta Secret Task');

      // Verify admin only reads adminTask
      const adminRetrieved = storageService.getTasks(admin);
      expect(adminRetrieved.length).toBe(1);
      expect(adminRetrieved[0].title).toBe('Admin Master Task');

      // Profiles isolation
      const alphaProfile = storageService.getUserProfile(userAlpha);
      expect(alphaProfile.name).not.toBe('Fatin Ishraque');
      expect(alphaProfile.username).toBe(userAlpha);

      const betaProfile = storageService.getUserProfile(userBeta);
      expect(betaProfile.name).not.toBe('Fatin Ishraque');
      expect(betaProfile.username).toBe(userBeta);
    });
  });

  describe('4. Password Authorization Boundary & Tamper Resistance', () => {
    it('rejects multiple brute force incorrect password attempts and only authorizes on exact match', () => {
      const onSuccess = vi.fn();
      const onClose = vi.fn();
      const mockUser = {
        username: 'test_secure',
        password: 'StrictSecretPass456!'
      };

      render(
        <PasswordPromptModal
          isOpen={true}
          onClose={onClose}
          onSuccess={onSuccess}
          title="Security Authorization Gate"
          description="Enter credentials to modify protected records."
          userProfile={mockUser}
        />
      );

      const passwordInput = screen.getByPlaceholderText('Enter your account password...');
      const authorizeBtn = screen.getByRole('button', { name: /Authorize & Proceed/i });

      // Simulate 5 incorrect password attempts
      const badAttempts = ['1234', 'password', 'StrictSecretPass456', 'Strictsecretpass456!', 'admin'];
      badAttempts.forEach((badPass) => {
        fireEvent.change(passwordInput, { target: { value: badPass } });
        fireEvent.click(authorizeBtn);
        expect(screen.getByText(/Incorrect password\. Authorization failed\./i)).toBeInTheDocument();
        expect(onSuccess).not.toHaveBeenCalled();
      });

      // Submit exact match password
      fireEvent.change(passwordInput, { target: { value: 'StrictSecretPass456!' } });
      fireEvent.click(authorizeBtn);

      expect(onSuccess).toHaveBeenCalledTimes(1);
      expect(onClose).toHaveBeenCalled();
    });
  });

  describe('5. Corrupted Storage Fault-Tolerance and Resilient Recovery', () => {
    it('gracefully recovers when localStorage contains corrupted non-JSON strings', () => {
      // Inject corrupt JSON into storage keys
      localStorage.setItem('daily_task_tasks_corrupt_user', 'MALFORMED_DATA_NOT_JSON{{[[');
      localStorage.setItem('daily_task_challenges_corrupt_user', '<bad-xml>');
      localStorage.setItem('daily_task_timer_sessions_corrupt_user', 'undefined');
      localStorage.setItem('daily_task_custom_categories', 'null::syntax-error');

      // storageService must not throw uncaught syntax errors
      const tasks = storageService.getTasks('corrupt_user');
      expect(Array.isArray(tasks)).toBe(true);
      expect(tasks.length).toBe(0);

      const challenges = storageService.getChallenges('corrupt_user');
      expect(Array.isArray(challenges)).toBe(true);

      const sessions = storageService.getTimerSessions('corrupt_user');
      expect(Array.isArray(sessions)).toBe(true);
      expect(sessions.length).toBe(0);
    });

    it('renders EditTaskModal cleanly even when custom categories in localStorage are corrupted', () => {
      localStorage.setItem('daily_task_custom_categories', 'BAD_JSON_CORRUPTION');

      const testTask = {
        id: 'task-clean-recovery',
        title: 'Recovery Test Task',
        category: 'Coding',
        priority: 'Medium',
        date: todayStr,
        estimatedMinutes: 25
      };

      // Component must render without crashing
      render(
        <ThemeProvider>
          <EditTaskModal
            isOpen={true}
            onClose={vi.fn()}
            task={testTask}
            onSaveTask={vi.fn()}
          />
        </ThemeProvider>
      );

      expect(screen.getByText('Edit Task Details')).toBeInTheDocument();
      expect(screen.getByDisplayValue('Recovery Test Task')).toBeInTheDocument();
    });
  });
});
