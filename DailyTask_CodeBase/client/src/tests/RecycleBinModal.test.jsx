import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import RecycleBinModal from '../components/RecycleBinModal';

describe('RecycleBinModal Component', () => {
  const mockProfile = {
    username: 'testuser',
    password: 'RecyclePassword123!'
  };

  const mockBinItems = [
    {
      recycleBinId: 'bin-1',
      type: 'task',
      deletedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      expiresAt: new Date(Date.now() + 28 * 24 * 60 * 60 * 1000).toISOString(),
      item: {
        id: 'task-1',
        title: 'Complete System Refactor',
        category: 'Development',
        priority: 'High'
      },
      cascadeTasks: []
    },
    {
      recycleBinId: 'bin-2',
      type: 'challenge',
      deletedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      expiresAt: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000).toISOString(),
      item: {
        id: 'ch-1',
        title: '30-Day Fitness Blast',
        category: 'Health',
        durationDays: 30
      },
      cascadeTasks: [
        { id: 'ct-1', title: 'Morning 5km Run' },
        { id: 'ct-2', title: 'Hydration Intake' }
      ]
    },
    {
      recycleBinId: 'bin-3',
      type: 'session',
      deletedAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      item: {
        id: 'session-1',
        title: 'Deep Focus Session',
        durationMinutes: 45
      },
      cascadeTasks: []
    }
  ];

  it('does not render when isOpen is false', () => {
    const { container } = render(
      <RecycleBinModal
        isOpen={false}
        onClose={vi.fn()}
        recycleBin={mockBinItems}
      />
    );
    expect(container).toBeEmptyDOMElement();
  });

  it('renders recycle bin items, item counts, and retention warnings', () => {
    render(
      <RecycleBinModal
        isOpen={true}
        onClose={vi.fn()}
        recycleBin={mockBinItems}
        userProfile={mockProfile}
      />
    );

    expect(screen.getByText('Recycle Bin (Trash)')).toBeInTheDocument();
    expect(screen.getByText(/3 items/i)).toBeInTheDocument();
    expect(screen.getByText('Complete System Refactor')).toBeInTheDocument();
    expect(screen.getByText('30-Day Fitness Blast')).toBeInTheDocument();
    expect(screen.getByText('Deep Focus Session')).toBeInTheDocument();

    // Challenge cascade tasks are listed
    expect(screen.getByText(/Includes 2 linked tasks/i)).toBeInTheDocument();
  });

  it('filters items by tab (Tasks, Challenges, Sessions)', () => {
    render(
      <RecycleBinModal
        isOpen={true}
        onClose={vi.fn()}
        recycleBin={mockBinItems}
        userProfile={mockProfile}
      />
    );

    // Filter by Challenges
    fireEvent.click(screen.getByRole('button', { name: /^Challenges/i }));
    expect(screen.getByText('30-Day Fitness Blast')).toBeInTheDocument();
    expect(screen.queryByText('Complete System Refactor')).not.toBeInTheDocument();
    expect(screen.queryByText('Deep Focus Session')).not.toBeInTheDocument();

    // Filter by Tasks
    fireEvent.click(screen.getByRole('button', { name: /^Tasks/i }));
    expect(screen.getByText('Complete System Refactor')).toBeInTheDocument();
    expect(screen.queryByText('30-Day Fitness Blast')).not.toBeInTheDocument();

    // Filter by Sessions
    fireEvent.click(screen.getByRole('button', { name: /^Sessions/i }));
    expect(screen.getByText('Deep Focus Session')).toBeInTheDocument();
    expect(screen.queryByText('Complete System Refactor')).not.toBeInTheDocument();
  });

  it('restores item when Restore button is clicked without requiring password', () => {
    const handleRestore = vi.fn();
    render(
      <RecycleBinModal
        isOpen={true}
        onClose={vi.fn()}
        recycleBin={mockBinItems}
        onRestore={handleRestore}
        userProfile={mockProfile}
      />
    );

    const restoreButtons = screen.getAllByRole('button', { name: /^Restore$/i });
    fireEvent.click(restoreButtons[0]);

    expect(handleRestore).toHaveBeenCalledWith(mockBinItems[0]);
  });

  it('requires password authorization to permanently delete an item', () => {
    const handlePermanentDelete = vi.fn();
    render(
      <RecycleBinModal
        isOpen={true}
        onClose={vi.fn()}
        recycleBin={mockBinItems}
        onPermanentDelete={handlePermanentDelete}
        userProfile={mockProfile}
      />
    );

    const deleteButtons = screen.getAllByTitle('Delete Permanently (Requires password)');
    fireEvent.click(deleteButtons[0]);

    // Password prompt opens
    expect(screen.getByText('Authorize Permanent Deletion')).toBeInTheDocument();
    const pwdInput = screen.getByPlaceholderText('Enter your account password...');

    // Enter wrong password
    fireEvent.change(pwdInput, { target: { value: 'WrongPassword' } });
    fireEvent.click(screen.getByRole('button', { name: /Authorize & Proceed/i }));
    expect(screen.getByText(/Incorrect password\. Authorization failed\./i)).toBeInTheDocument();
    expect(handlePermanentDelete).not.toHaveBeenCalled();

    // Enter correct password
    fireEvent.change(pwdInput, { target: { value: 'RecyclePassword123!' } });
    fireEvent.click(screen.getByRole('button', { name: /Authorize & Proceed/i }));
    expect(handlePermanentDelete).toHaveBeenCalledWith('bin-1');
  });

  it('requires password authorization to empty the entire recycle bin', () => {
    const handleEmptyBin = vi.fn();
    render(
      <RecycleBinModal
        isOpen={true}
        onClose={vi.fn()}
        recycleBin={mockBinItems}
        onEmptyBin={handleEmptyBin}
        userProfile={mockProfile}
      />
    );

    fireEvent.click(screen.getByRole('button', { name: /Empty Recycle Bin/i }));
    expect(screen.getByText('Authorize Permanent Deletion')).toBeInTheDocument();

    const pwdInput = screen.getByPlaceholderText('Enter your account password...');
    fireEvent.change(pwdInput, { target: { value: 'RecyclePassword123!' } });
    fireEvent.click(screen.getByRole('button', { name: /Authorize & Proceed/i }));

    expect(handleEmptyBin).toHaveBeenCalledTimes(1);
  });
});
