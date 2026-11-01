import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import PasswordPromptModal from '../components/PasswordPromptModal';

describe('PasswordPromptModal Component', () => {
  const mockProfile = {
    username: 'testuser',
    password: 'SecretPassword123!'
  };

  it('does not render when isOpen is false', () => {
    const { container } = render(
      <PasswordPromptModal isOpen={false} onClose={vi.fn()} onSuccess={vi.fn()} />
    );
    expect(container).toBeEmptyDOMElement();
  });

  it('renders modal with title and input when isOpen is true', () => {
    render(
      <PasswordPromptModal
        isOpen={true}
        onClose={vi.fn()}
        onSuccess={vi.fn()}
        title="Authorize Past Action"
        description="Password required to modify past task"
        userProfile={mockProfile}
      />
    );

    expect(screen.getByText('Authorize Past Action')).toBeInTheDocument();
    expect(screen.getByText('Password required to modify past task')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Enter your account password...')).toBeInTheDocument();
  });

  it('shows error if submitted with empty password', () => {
    const handleSuccess = vi.fn();
    render(
      <PasswordPromptModal
        isOpen={true}
        onClose={vi.fn()}
        onSuccess={handleSuccess}
        userProfile={mockProfile}
      />
    );

    const submitBtn = screen.getByRole('button', { name: /Authorize & Proceed/i });
    fireEvent.click(submitBtn);

    expect(
      screen.getByText(/Account password is required to authorize modifying past history\./i)
    ).toBeInTheDocument();
    expect(handleSuccess).not.toHaveBeenCalled();
  });

  it('shows error if submitted with incorrect password', () => {
    const handleSuccess = vi.fn();
    render(
      <PasswordPromptModal
        isOpen={true}
        onClose={vi.fn()}
        onSuccess={handleSuccess}
        userProfile={mockProfile}
      />
    );

    const input = screen.getByPlaceholderText('Enter your account password...');
    fireEvent.change(input, { target: { value: 'WrongPassword' } });

    const submitBtn = screen.getByRole('button', { name: /Authorize & Proceed/i });
    fireEvent.click(submitBtn);

    expect(screen.getByText(/Incorrect password\. Authorization failed\./i)).toBeInTheDocument();
    expect(handleSuccess).not.toHaveBeenCalled();
  });

  it('calls onSuccess and onClose when submitted with correct password', () => {
    const handleSuccess = vi.fn();
    const handleClose = vi.fn();

    render(
      <PasswordPromptModal
        isOpen={true}
        onClose={handleClose}
        onSuccess={handleSuccess}
        userProfile={mockProfile}
      />
    );

    const input = screen.getByPlaceholderText('Enter your account password...');
    fireEvent.change(input, { target: { value: 'SecretPassword123!' } });

    const submitBtn = screen.getByRole('button', { name: /Authorize & Proceed/i });
    fireEvent.click(submitBtn);

    expect(handleSuccess).toHaveBeenCalledTimes(1);
    expect(handleClose).toHaveBeenCalledTimes(1);
  });

  it('toggles password visibility between text and password type', () => {
    render(
      <PasswordPromptModal
        isOpen={true}
        onClose={vi.fn()}
        onSuccess={vi.fn()}
        userProfile={mockProfile}
      />
    );

    const input = screen.getByPlaceholderText('Enter your account password...');
    expect(input).toHaveAttribute('type', 'password');

    const toggleBtn = screen.getByTitle('Show password');
    fireEvent.click(toggleBtn);
    expect(input).toHaveAttribute('type', 'text');

    const hideBtn = screen.getByTitle('Hide password');
    fireEvent.click(hideBtn);
    expect(input).toHaveAttribute('type', 'password');
  });
});
