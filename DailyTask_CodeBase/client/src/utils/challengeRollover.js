/**
 * Utility for automatic task rollover across goal challenge days.
 * When a challenge day ends and is in the past (date < todayStr),
 * any uncompleted tasks from that day automatically roll over to the next day.
 *
 * Rolled-over tasks are tagged with:
 * rolledOverFrom: {
 *   dayNumber: number,
 *   date: string,
 *   originalTaskId: string
 * }
 */

export function processChallengeTaskRollovers(tasks = [], challenges = [], todayStr) {
  if (!Array.isArray(tasks) || !Array.isArray(challenges) || !todayStr) {
    return { updatedTasks: tasks, hasChanges: false };
  }

  let hasChanges = false;
  const taskMap = new Map();
  tasks.forEach((t) => {
    const id = t.id || t._id;
    taskMap.set(id, { ...t });
  });

  challenges.forEach((challenge) => {
    if (!challenge.checkIns || !Array.isArray(challenge.checkIns)) return;
    const challengeId = challenge.id || challenge._id;

    // Sort check-ins by dayNumber
    const sortedDays = [...challenge.checkIns].sort((a, b) => a.dayNumber - b.dayNumber);

    for (let i = 0; i < sortedDays.length - 1; i++) {
      const currentDay = sortedDays[i];
      const nextDay = sortedDays[i + 1];

      // If current day is in the past:
      if (currentDay.date < todayStr) {
        // Find tasks for this challenge on current day
        const dayTasks = Array.from(taskMap.values()).filter((t) => {
          const matchChallenge = t.challengeId === challengeId;
          const matchDay = t.dayNumber === currentDay.dayNumber || t.date === currentDay.date;
          return matchChallenge && matchDay;
        });

        dayTasks.forEach((task) => {
          const taskId = task.id || task._id;
          // If task is incomplete and hasn't been rolled over yet
          if (!task.completed && !task.hasRolledOver) {
            // Check if rollover already exists on nextDay
            const alreadyRolledOver = Array.from(taskMap.values()).some((t) => {
              return (
                t.challengeId === challengeId &&
                (t.dayNumber === nextDay.dayNumber || t.date === nextDay.date) &&
                t.rolledOverFrom?.originalTaskId === taskId
              );
            });

            if (!alreadyRolledOver) {
              const newTaskId = `rollover-${taskId}-d${nextDay.dayNumber}`;
              const rolledOverTask = {
                id: newTaskId,
                title: task.title,
                category: task.category || challenge.category || 'General',
                priority: task.priority || 'Medium',
                estimatedMinutes: task.estimatedMinutes || 30,
                date: nextDay.date,
                dayNumber: nextDay.dayNumber,
                challengeId: challengeId,
                challengeTitle: challenge.title,
                completed: false,
                completedAt: null,
                rolledOverFrom: {
                  dayNumber: currentDay.dayNumber,
                  date: currentDay.date,
                  originalTaskId: taskId
                }
              };

              taskMap.set(newTaskId, rolledOverTask);
              // Mark original task as having rolled over to prevent duplicate carryovers
              const original = taskMap.get(taskId);
              if (original) {
                original.hasRolledOver = true;
              }
              hasChanges = true;
            }
          }
        });
      }
    }
  });

  return {
    updatedTasks: hasChanges ? Array.from(taskMap.values()) : tasks,
    hasChanges
  };
}
