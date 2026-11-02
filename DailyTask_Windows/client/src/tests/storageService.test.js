import { describe, it, expect, beforeEach } from 'vitest';
import { storageService } from '../services/storageService';
import { initialUserProfile, initialTasks, initialChallenges } from '../data/initialData';

describe('storageService', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('should return initialUserProfile when localStorage is empty', () => {
    const profile = storageService.getUserProfile();
    expect(profile.name).toBe(initialUserProfile.name);
    expect(profile.username).toBe(initialUserProfile.username);
    expect(profile.fieldOfStudy).toBe(initialUserProfile.fieldOfStudy);
  });

  it('should persist and retrieve modified user profile', () => {
    const modified = {
      ...initialUserProfile,
      name: 'Fatin Ishraque Updated',
      skills: ['React', 'Node.js', 'Go']
    };
    storageService.saveUserProfile(modified);
    const retrieved = storageService.getUserProfile();
    expect(retrieved.name).toBe('Fatin Ishraque Updated');
    expect(retrieved.skills).toContain('Go');
  });

  it('should return initialTasks when localStorage is empty', () => {
    const tasks = storageService.getTasks();
    expect(tasks.length).toBeGreaterThan(0);
    expect(tasks[0]).toHaveProperty('title');
  });

  it('should persist new tasks correctly', () => {
    const customTask = {
      id: 'custom-1',
      title: 'Solve LeetCode Hard',
      category: 'Coding',
      completed: true,
      date: '2026-10-26'
    };
    storageService.saveTasks([customTask]);
    const retrieved = storageService.getTasks();
    expect(retrieved.length).toBe(1);
    expect(retrieved[0].title).toBe('Solve LeetCode Hard');
  });

  it('should save and load challenges', () => {
    const customChallenge = {
      id: 'ch-test-1',
      title: '7-Day Sprint',
      durationDays: 7,
      status: 'active',
      checkIns: []
    };
    storageService.saveChallenges([customChallenge]);
    const retrieved = storageService.getChallenges();
    expect(retrieved.length).toBe(1);
    expect(retrieved[0].title).toBe('7-Day Sprint');
  });

  it('should save and load timer sessions', () => {
    const customSession = {
      id: 'ts-test-1',
      durationMinutes: 45,
      date: '2026-10-27',
      category: 'Study',
      label: 'Deep Learning'
    };
    storageService.saveTimerSessions([customSession]);
    const retrieved = storageService.getTimerSessions();
    expect(retrieved.length).toBe(1);
    expect(retrieved[0].durationMinutes).toBe(45);
    expect(retrieved[0].label).toBe('Deep Learning');
  });
});
