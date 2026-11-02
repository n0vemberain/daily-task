import { describe, it, expect, vi } from 'vitest';
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import LoginView from '../components/LoginView';
import { ThemeProvider } from '../context/ThemeContext';

describe('LoginView Full-Screen Authentication Gate', () => {
  const mockUserProfile = {
    username: 'n0vemberain',
    password: 'Password123!',
    name: 'Fatin Ishraque'
  };

  it('renders branding and login input fields', () => {
    render(
      <ThemeProvider>
        <LoginView userProfile={mockUserProfile} onLoginSuccess={vi.fn()} />
      </ThemeProvider>
    );

    expect(screen.getByText('DailyTask')).toBeInTheDocument();
    expect(screen.getByText('Authentication Required')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('e.g. n0vemberain')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Enter your password')).toBeInTheDocument();
    expect(screen.getByText('Auto-fill Demo Credentials')).toBeInTheDocument();
  });

  it('displays error on incorrect login attempt', () => {
    render(
      <ThemeProvider>
        <LoginView userProfile={mockUserProfile} onLoginSuccess={vi.fn()} />
      </ThemeProvider>
    );

    const userInput = screen.getByPlaceholderText('e.g. n0vemberain');
    const passInput = screen.getByPlaceholderText('Enter your password');
    const submitBtn = screen.getByRole('button', { name: /Sign In to Dashboard/i });

    fireEvent.change(userInput, { target: { value: 'unknown_user' } });
    fireEvent.change(passInput, { target: { value: 'bad_password' } });
    fireEvent.click(submitBtn);

    expect(screen.getByText(/Invalid username or password/i)).toBeInTheDocument();
  });

  it('authenticates and calls onLoginSuccess with demo credentials', () => {
    const onLoginSuccess = vi.fn();

    render(
      <ThemeProvider>
        <LoginView userProfile={mockUserProfile} onLoginSuccess={onLoginSuccess} />
      </ThemeProvider>
    );

    const fillBtn = screen.getByText('Auto-fill Demo Credentials');
    fireEvent.click(fillBtn);

    const submitBtn = screen.getByRole('button', { name: /Sign In to Dashboard/i });
    fireEvent.click(submitBtn);

    expect(onLoginSuccess).toHaveBeenCalledWith(
      expect.objectContaining({ username: 'n0vemberain' })
    );
  });
});
