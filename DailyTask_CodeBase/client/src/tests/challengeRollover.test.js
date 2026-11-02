import { describe, it, expect } from 'vitest';
import { processChallengeTaskRollovers } from '../utils/challengeRollover';

describe('processChallengeTaskRollovers', () => {
  const todayStr = '2026-11-02';

  const sampleChallenge = {
    id: 'ch-1',
    title: '10-Day DSA Grind',
    category: 'Coding',
    checkIns: [
      { dayNumber: 1, date: '2026-11-01', status: 'completed' },
      { dayNumber: 2, date: '2026-11-02', status: 'pending' },
      { dayNumber: 3, date: '2026-11-03', status: 'pending' }
    ]
  };

  it('rolls over uncompleted tasks from a past challenge day to the next day', () => {
    const tasks = [
      {
        id: 'task-1',
        title: 'Completed Task on Day 1',
        challengeId: 'ch-1',
        dayNumber: 1,
        date: '2026-11-01',
        completed: true
      },
      {
        id: 'task-2',
        title: 'Unfinished DSA Problem',
        challengeId: 'ch-1',
        dayNumber: 1,
        date: '2026-11-01',
        completed: false
      }
    ];

    const result = processChallengeTaskRollovers(tasks, [sampleChallenge], todayStr);

    expect(result.hasChanges).toBe(true);
    expect(result.updatedTasks).toHaveLength(3);

    // The original task on Day 1 marked as hasRolledOver: true
    const original = result.updatedTasks.find((t) => t.id === 'task-2');
    expect(original.hasRolledOver).toBe(true);

    // The new carried over task on Day 2
    const rolledOver = result.updatedTasks.find(
      (t) => t.id === 'rollover-task-2-d2'
    );
    expect(rolledOver).toBeDefined();
    expect(rolledOver.title).toBe('Unfinished DSA Problem');
    expect(rolledOver.dayNumber).toBe(2);
    expect(rolledOver.date).toBe('2026-11-02');
    expect(rolledOver.completed).toBe(false);
    expect(rolledOver.rolledOverFrom).toEqual({
      dayNumber: 1,
      date: '2026-11-01',
      originalTaskId: 'task-2'
    });
  });

  it('does not re-duplicate rolled over tasks on subsequent runs', () => {
    const tasks = [
      {
        id: 'task-2',
        title: 'Unfinished DSA Problem',
        challengeId: 'ch-1',
        dayNumber: 1,
        date: '2026-11-01',
        completed: false,
        hasRolledOver: true
      },
      {
        id: 'rollover-task-2-d2',
        title: 'Unfinished DSA Problem',
        challengeId: 'ch-1',
        dayNumber: 2,
        date: '2026-11-02',
        completed: false,
        rolledOverFrom: {
          dayNumber: 1,
          date: '2026-11-01',
          originalTaskId: 'task-2'
        }
      }
    ];

    const result = processChallengeTaskRollovers(tasks, [sampleChallenge], todayStr);
    expect(result.hasChanges).toBe(false);
    expect(result.updatedTasks).toHaveLength(2);
  });

  it('does not roll over tasks from future or today challenge days', () => {
    const tasks = [
      {
        id: 'task-today',
        title: 'Task for Today',
        challengeId: 'ch-1',
        dayNumber: 2,
        date: '2026-11-02',
        completed: false
      }
    ];

    const result = processChallengeTaskRollovers(tasks, [sampleChallenge], todayStr);
    expect(result.hasChanges).toBe(false);
    expect(result.updatedTasks).toHaveLength(1);
  });
});
