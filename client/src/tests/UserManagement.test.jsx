import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import React from 'react';
import UserManagementSection from '../components/UserManagementSection';
import UserProfile from '../components/UserProfile';
import { apiService } from '../services/apiService';

vi.mock('../services/apiService', () => ({
  apiService: {
    getAllUsers: vi.fn(),
    createUser: vi.fn(),
    updateUserCredentials: vi.fn(),
    forceLogoutUser: vi.fn(),
    toggleUserStatus: vi.fn(),
    deleteUser: vi.fn(),
    getNetworkAccess: vi.fn().mockResolvedValue({ success: true, data: {} })
  }
}));

describe('User & Guest Accounts Management', () => {
  const adminProfile = {
    id: 'user-admin',
    name: 'Fatin Ishraque',
    username: 'n0vemberain',
    password: 'Password123!',
    role: 'admin',
    fieldOfStudy: 'Computer Science & Engineering',
    skills: ['React', 'Node.js']
  };

  const guestUser = {
    id: 'user-guest-1',
    name: 'Rahim Khan',
    username: 'rahim_guest',
    password: 'RahimPassword123!',
    role: 'guest',
    fieldOfStudy: 'Software Engineering',
    isActive: true,
    sessionVersion: 1
  };

  const mockTheme = {
    accent: '#7eb644',
    accentDark: '#1a2710',
    accentLight: '#9fdb52',
    primaryBtn: 'bg-olive-600 text-white'
  };

  beforeEach(() => {
    vi.clearAllMocks();
    apiService.getAllUsers.mockResolvedValue({
      success: true,
      data: [adminProfile, guestUser]
    });
  });

  it('renders User & Guest Accounts Management heading and user list', async () => {
    render(
      <UserManagementSection
        currentUser={adminProfile}
        theme={mockTheme}
      />
    );

    expect(screen.getByText('User & Guest Accounts Management')).toBeInTheDocument();
    expect(screen.getByText('Administrator Access')).toBeInTheDocument();
    expect(screen.getByText('Add New User / Guest')).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText('Fatin Ishraque')).toBeInTheDocument();
      expect(screen.getByText('@n0vemberain')).toBeInTheDocument();
      expect(screen.getByText('Rahim Khan')).toBeInTheDocument();
      expect(screen.getByText('@rahim_guest')).toBeInTheDocument();
    });
  });

  it('opens Add New User modal and creates a user', async () => {
    apiService.createUser.mockResolvedValue({
      success: true,
      data: {
        id: 'user-new',
        username: 'karim_test',
        name: 'Karim Test',
        role: 'guest'
      }
    });

    render(
      <UserManagementSection
        currentUser={adminProfile}
        theme={mockTheme}
      />
    );

    const addBtn = screen.getByText('Add New User / Guest');
    fireEvent.click(addBtn);

    expect(screen.getByText('Create New User / Guest Account')).toBeInTheDocument();

    const nameInput = screen.getByPlaceholderText('e.g. Rahim Khan');
    const usernameInput = screen.getByPlaceholderText('e.g. rahim_guest');
    const passwordInput = screen.getByPlaceholderText(/min 4 characters/i);
    const submitBtn = screen.getByRole('button', { name: /Create Account/i });

    fireEvent.change(nameInput, { target: { value: 'Karim Test' } });
    fireEvent.change(usernameInput, { target: { value: 'karim_test' } });
    fireEvent.change(passwordInput, { target: { value: 'KarimPass123!' } });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(apiService.createUser).toHaveBeenCalledWith(
        expect.objectContaining({
          name: 'Karim Test',
          username: 'karim_test',
          password: 'KarimPass123!',
          role: 'guest'
        })
      );
    });
  });

  it('handles force logout on guest user session', async () => {
    apiService.forceLogoutUser.mockResolvedValue({
      success: true,
      message: 'Active session for user rahim_guest has been terminated.'
    });

    render(
      <UserManagementSection
        currentUser={adminProfile}
        theme={mockTheme}
      />
    );

    await waitFor(() => {
      expect(screen.getByText('Rahim Khan')).toBeInTheDocument();
    });

    const forceLogoutButtons = screen.getAllByRole('button', { name: /Force Logout/i });
    expect(forceLogoutButtons.length).toBe(1); // Only guest user has force logout

    fireEvent.click(forceLogoutButtons[0]); // Guest user's force logout button

    await waitFor(() => {
      expect(apiService.forceLogoutUser).toHaveBeenCalledWith('user-guest-1');
    });
  });

  it('does NOT render UserManagementSection when user is a non-admin guest', () => {
    render(
      <UserProfile
        userProfile={{
          name: 'Guest User',
          username: 'guest_user',
          role: 'guest',
          skills: []
        }}
        onSaveProfile={vi.fn()}
        mongoStatus={{ isMongoConnected: true }}
      />
    );

    expect(screen.queryByText('User & Guest Accounts Management')).not.toBeInTheDocument();
    expect(screen.queryByText('Add New User / Guest')).not.toBeInTheDocument();
  });
});
