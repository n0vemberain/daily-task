import { describe, it, expect, vi } from 'vitest';
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import ProfileModal from '../components/ProfileModal';
import { ThemeProvider } from '../context/ThemeContext';

describe('ProfileModal Component', () => {
  const mockProfile = {
    name: 'Fatin Ishraque',
    username: 'n0vemberain',
    password: 'Password123!',
    fieldOfStudy: 'Computer Science & Engineering',
    avatarUrl: ''
  };

  const mockProps = {
    isOpen: true,
    onClose: vi.fn(),
    userProfile: mockProfile,
    onSaveProfile: vi.fn()
  };

  it('does not render when closed', () => {
    const { container } = render(
      <ThemeProvider>
        <ProfileModal {...mockProps} isOpen={false} />
      </ThemeProvider>
    );
    expect(container).toBeEmptyDOMElement();
  });

  it('renders ONLY core profile information: photo, name, username, password, and field of study', () => {
    render(
      <ThemeProvider>
        <ProfileModal {...mockProps} />
      </ThemeProvider>
    );

    // Profile header
    expect(screen.getByText('User Profile')).toBeInTheDocument();

    // Core credentials labels and values
    expect(screen.getByText('Profile Photo & Avatar')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Fatin Ishraque')).toBeInTheDocument();
    expect(screen.getByDisplayValue('n0vemberain')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Computer Science & Engineering')).toBeInTheDocument();

    // Password is masked and protected
    expect(screen.getByText(/Password secured and hidden/i)).toBeInTheDocument();
    expect(screen.queryByDisplayValue('Password123!')).not.toBeInTheDocument();

    // Must NOT contain features reserved for SettingsModal
    expect(screen.queryByText(/Technical Skills/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/Scan QR Code/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/User Management/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/Data Clean Center/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/Dual Persistence/i)).not.toBeInTheDocument();
  });

  it('submits updated profile details on form save', () => {
    const onSave = vi.fn();
    render(
      <ThemeProvider>
        <ProfileModal {...mockProps} onSaveProfile={onSave} />
      </ThemeProvider>
    );

    const nameInput = screen.getByDisplayValue('Fatin Ishraque');
    fireEvent.change(nameInput, { target: { value: 'Fatin Updated' } });

    const submitBtn = screen.getByText('Save Profile Changes');
    fireEvent.click(submitBtn);

    expect(onSave).toHaveBeenCalledWith(
      expect.objectContaining({
        name: 'Fatin Updated',
        username: 'n0vemberain',
        fieldOfStudy: 'Computer Science & Engineering'
      })
    );
  });

  it('allows password change workflow when current password matches', () => {
    const onSave = vi.fn();
    render(
      <ThemeProvider>
        <ProfileModal {...mockProps} onSaveProfile={onSave} />
      </ThemeProvider>
    );

    // Open change password section
    const toggleBtn = screen.getByText('Change Password');
    fireEvent.click(toggleBtn);

    expect(screen.getByText('Update Account Password')).toBeInTheDocument();

    const currentPwdInput = screen.getByPlaceholderText(/Enter current password/i);
    const newPwdInput = screen.getByPlaceholderText(/Min 4 characters/i);
    const confirmPwdInput = screen.getByPlaceholderText(/Confirm new password/i);

    // Enter wrong current password
    fireEvent.change(currentPwdInput, { target: { value: 'WrongPassword' } });
    fireEvent.change(newPwdInput, { target: { value: 'NewSecret123!' } });
    fireEvent.change(confirmPwdInput, { target: { value: 'NewSecret123!' } });

    const submitBtn = screen.getByText('Save Profile Changes');
    fireEvent.click(submitBtn);

    expect(screen.getByText(/Current password does not match account records/i)).toBeInTheDocument();
    expect(onSave).not.toHaveBeenCalled();

    // Enter correct current password
    fireEvent.change(currentPwdInput, { target: { value: 'Password123!' } });
    fireEvent.click(submitBtn);

    expect(onSave).toHaveBeenCalledWith(
      expect.objectContaining({
        password: 'NewSecret123!'
      })
    );
  });
});
