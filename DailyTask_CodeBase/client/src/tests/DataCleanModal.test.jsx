import { describe, it, expect, vi } from 'vitest';
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import DataCleanModal from '../components/DataCleanModal';
import { ThemeProvider } from '../context/ThemeContext';

describe('DataCleanModal Component', () => {
  const userProfile = {
    username: 'n0vemberain',
    password: 'SecretPassword123!'
  };

  it('does not render when closed', () => {
    const { container } = render(
      <ThemeProvider>
        <DataCleanModal isOpen={false} onClose={vi.fn()} userProfile={userProfile} />
      </ThemeProvider>
    );
    expect(container).toBeEmptyDOMElement();
  });

  it('renders all cleaning options and password input when open', () => {
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
          userProfile={userProfile}
        />
      </ThemeProvider>
    );

    expect(screen.getByText('Data Cleaning Center')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Enter account password...')).toBeInTheDocument();
    expect(screen.getByText('Clean Completed Tasks Only')).toBeInTheDocument();
    expect(screen.getByText('Clean All Habit Challenges')).toBeInTheDocument();
    expect(screen.getByText('Restore Standard Sample Data')).toBeInTheDocument();
    expect(screen.getByText('Factory Reset: Clear All Data')).toBeInTheDocument();
  });

  it('blocks cleaning action and shows error when password is empty or wrong', () => {
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
          userProfile={userProfile}
        />
      </ThemeProvider>
    );

    const clearCompletedBtn = screen.getByText('Clear Completed');

    // 1. Click without entering password
    fireEvent.click(clearCompletedBtn);
    expect(onClearCompletedTasks).not.toHaveBeenCalled();
    expect(
      screen.getByText(/Account password is required to authorize data cleaning\./i)
    ).toBeInTheDocument();

    // 2. Enter wrong password
    const passwordInput = screen.getByPlaceholderText('Enter account password...');
    fireEvent.change(passwordInput, { target: { value: 'WrongPassword' } });
    fireEvent.click(clearCompletedBtn);
    expect(onClearCompletedTasks).not.toHaveBeenCalled();
    expect(
      screen.getByText(/Incorrect password! Data cleaning was blocked\./i)
    ).toBeInTheDocument();
  });

  it('allows cleaning action when correct password is provided', () => {
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
          userProfile={userProfile}
        />
      </ThemeProvider>
    );

    const passwordInput = screen.getByPlaceholderText('Enter account password...');
    fireEvent.change(passwordInput, { target: { value: 'SecretPassword123!' } });

    const clearCompletedBtn = screen.getByText('Clear Completed');
    fireEvent.click(clearCompletedBtn);

    expect(onClearCompletedTasks).toHaveBeenCalledTimes(1);
    expect(screen.getByText('Completed tasks cleared.')).toBeInTheDocument();
  });

  it('handles factory wipe with correct password and double confirmation', () => {
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
          userProfile={userProfile}
        />
      </ThemeProvider>
    );

    // Enter correct password first
    const passwordInput = screen.getByPlaceholderText('Enter account password...');
    fireEvent.change(passwordInput, { target: { value: 'SecretPassword123!' } });

    // Click on Wipe Everything
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
