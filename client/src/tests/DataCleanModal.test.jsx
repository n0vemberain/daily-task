import { describe, it, expect, vi } from 'vitest';
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import DataCleanModal from '../components/DataCleanModal';
import { ThemeProvider } from '../context/ThemeContext';

describe('DataCleanModal Component', () => {
  it('does not render when closed', () => {
    const { container } = render(
      <ThemeProvider>
        <DataCleanModal isOpen={false} onClose={vi.fn()} />
      </ThemeProvider>
    );
    expect(container).toBeEmptyDOMElement();
  });

  it('renders all cleaning options when open', () => {
    render(
      <ThemeProvider>
        <DataCleanModal
          isOpen={true}
          onClose={vi.fn()}
          onClearAllData={vi.fn()}
          onClearCompletedTasks={vi.fn()}
          onClearChallenges={vi.fn()}
          onResetDemoData={vi.fn()}
          tasksCount={5}
          challengesCount={2}
        />
      </ThemeProvider>
    );

    expect(screen.getByText('Data Cleaning & Reset Management')).toBeInTheDocument();
    expect(screen.getByText('Clean Completed Tasks Only')).toBeInTheDocument();
    expect(screen.getByText('Clean All Habit Challenges')).toBeInTheDocument();
    expect(screen.getByText('Restore Standard Sample Data')).toBeInTheDocument();
    expect(screen.getByText('Factory Reset: Clear All Data')).toBeInTheDocument();
  });

  it('handles clean completed tasks action', () => {
    const onClearCompletedTasks = vi.fn();

    render(
      <ThemeProvider>
        <DataCleanModal
          isOpen={true}
          onClose={vi.fn()}
          onClearAllData={vi.fn()}
          onClearCompletedTasks={onClearCompletedTasks}
          onClearChallenges={vi.fn()}
          onResetDemoData={vi.fn()}
          tasksCount={5}
          challengesCount={2}
        />
      </ThemeProvider>
    );

    const clearCompletedBtn = screen.getByText('Clear Completed');
    fireEvent.click(clearCompletedBtn);

    expect(onClearCompletedTasks).toHaveBeenCalledTimes(1);
    expect(screen.getByText('Completed tasks cleared.')).toBeInTheDocument();
  });

  it('handles factory wipe with double confirmation', () => {
    const onClearAllData = vi.fn();

    render(
      <ThemeProvider>
        <DataCleanModal
          isOpen={true}
          onClose={vi.fn()}
          onClearAllData={onClearAllData}
          onClearCompletedTasks={vi.fn()}
          onClearChallenges={vi.fn()}
          onResetDemoData={vi.fn()}
          tasksCount={10}
          challengesCount={3}
        />
      </ThemeProvider>
    );

    // Initial click on Wipe Everything
    const wipeBtn = screen.getByText('Wipe Everything');
    fireEvent.click(wipeBtn);

    // Confirmation row appears
    expect(screen.getByText(/Are you certain\? This cannot be undone\./i)).toBeInTheDocument();
    const confirmBtn = screen.getByText('Confirm Wipe');
    fireEvent.click(confirmBtn);

    expect(onClearAllData).toHaveBeenCalledTimes(1);
    expect(screen.getByText('All application data cleared successfully.')).toBeInTheDocument();
  });
});
