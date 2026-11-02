import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import EditChallengeModal from '../components/EditChallengeModal';

describe('EditChallengeModal Component', () => {
  const mockChallenge = {
    id: 'ch-1',
    title: '30-Day TypeScript Mastery',
    category: 'Coding',
    description: 'Master advanced TypeScript generics',
    startDate: '2026-11-01',
    endDate: '2026-11-30',
    durationDays: 30
  };

  const mockUserProfile = {
    username: 'testuser',
    password: 'Password123!'
  };

  it('renders existing challenge details and schedule dates', () => {
    render(
      <EditChallengeModal
        isOpen={true}
        challenge={mockChallenge}
        onClose={vi.fn()}
        onSaveChallenge={vi.fn()}
        userProfile={mockUserProfile}
      />
    );

    expect(screen.getByText('Edit Challenge Details')).toBeInTheDocument();
    expect(screen.getByDisplayValue('30-Day TypeScript Mastery')).toBeInTheDocument();
    expect(screen.getByDisplayValue('2026-11-01')).toBeInTheDocument();
    expect(screen.getByDisplayValue('2026-11-30')).toBeInTheDocument();
    expect(screen.getByDisplayValue('30')).toBeInTheDocument();
  });

  it('allows updating duration and dates and requires password to save', () => {
    const handleSave = vi.fn();
    const handleClose = vi.fn();

    render(
      <EditChallengeModal
        isOpen={true}
        challenge={mockChallenge}
        onClose={handleClose}
        onSaveChallenge={handleSave}
        userProfile={mockUserProfile}
      />
    );

    // Update start date
    const startDateInput = screen.getByDisplayValue('2026-11-01');
    fireEvent.change(startDateInput, { target: { value: '2026-11-05' } });

    // Click quick duration preset (e.g. 50D)
    const preset50 = screen.getByRole('button', { name: '50D' });
    fireEvent.click(preset50);

    // Click Save Changes button
    const saveBtn = screen.getByRole('button', { name: /Save Changes/i });
    fireEvent.click(saveBtn);

    // Password Prompt Modal should appear
    expect(screen.getByText('Authorize Challenge Update')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Enter your account password...')).toBeInTheDocument();

    // Enter correct password and authorize
    const passwordInput = screen.getByPlaceholderText('Enter your account password...');
    fireEvent.change(passwordInput, { target: { value: 'Password123!' } });

    const authorizeBtn = screen.getByRole('button', { name: /Authorize & Proceed/i });
    fireEvent.click(authorizeBtn);

    expect(handleSave).toHaveBeenCalledTimes(1);
    expect(handleSave).toHaveBeenCalledWith(
      'ch-1',
      expect.objectContaining({
        title: '30-Day TypeScript Mastery',
        startDate: '2026-11-05',
        durationDays: 50
      })
    );
  });
});
