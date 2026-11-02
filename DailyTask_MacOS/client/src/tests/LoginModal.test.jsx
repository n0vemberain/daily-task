import { describe, it, expect, vi } from 'vitest';
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import LoginModal from '../components/LoginModal';
import { ThemeProvider } from '../context/ThemeContext';

describe('LoginModal Component', () => {
  const mockUserProfile = {
    username: 'n0vemberain',
    password: 'Password123!',
    name: 'Fatin Ishraque'
  };

  it('does not render when isOpen is false', () => {
    const { container } = render(
      <ThemeProvider>
        <LoginModal isOpen={false} onClose={vi.fn()} userProfile={mockUserProfile} />
      </ThemeProvider>
    );
    expect(container).toBeEmptyDOMElement();
  });

  it('renders modal elements when open', () => {
    render(
      <ThemeProvider>
        <LoginModal isOpen={true} onClose={vi.fn()} userProfile={mockUserProfile} />
      </ThemeProvider>
    );

    expect(screen.getByText('Account Authentication')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Enter your username')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Enter password')).toBeInTheDocument();
    expect(screen.getByText('Auto-fill Credentials')).toBeInTheDocument();
  });

  it('displays error on incorrect credentials', () => {
    render(
      <ThemeProvider>
        <LoginModal isOpen={true} onClose={vi.fn()} userProfile={mockUserProfile} />
      </ThemeProvider>
    );

    const userInput = screen.getByPlaceholderText('Enter your username');
    const passInput = screen.getByPlaceholderText('Enter password');
    const submitBtn = screen.getByRole('button', { name: /Authenticate and Access/i });

    fireEvent.change(userInput, { target: { value: 'wronguser' } });
    fireEvent.change(passInput, { target: { value: 'wrongpassword' } });
    fireEvent.click(submitBtn);

    expect(screen.getByText(/Invalid username or password/i)).toBeInTheDocument();
  });

  it('calls onLoginSuccess on valid credentials', () => {
    const onLoginSuccess = vi.fn();
    const onClose = vi.fn();

    render(
      <ThemeProvider>
        <LoginModal
          isOpen={true}
          onClose={onClose}
          userProfile={mockUserProfile}
          onLoginSuccess={onLoginSuccess}
        />
      </ThemeProvider>
    );

    // Click demo fill
    const fillBtn = screen.getByText('Auto-fill Credentials');
    fireEvent.click(fillBtn);

    const submitBtn = screen.getByRole('button', { name: /Authenticate and Access/i });
    fireEvent.click(submitBtn);

    expect(onLoginSuccess).toHaveBeenCalledWith(
      expect.objectContaining({ username: 'n0vemberain' })
    );
    expect(onClose).toHaveBeenCalled();
  });
});
