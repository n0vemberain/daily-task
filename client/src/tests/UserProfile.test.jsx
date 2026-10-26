import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import UserProfile from '../components/UserProfile';

describe('UserProfile Component', () => {
  const mockProfile = {
    name: 'Fatin Ishraque',
    username: 'n0vemberain',
    password: 'Password123!',
    fieldOfStudy: 'Computer Science & Engineering',
    skills: ['React', 'Node.js', 'MongoDB'],
    avatarUrl: ''
  };

  it('renders initial profile fields', () => {
    render(
      <UserProfile
        userProfile={mockProfile}
        onSaveProfile={vi.fn()}
        mongoStatus={{ isMongoConnected: true }}
      />
    );

    expect(screen.getByDisplayValue('Fatin Ishraque')).toBeInTheDocument();
    expect(screen.getByDisplayValue('n0vemberain')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Computer Science & Engineering')).toBeInTheDocument();
  });

  it('renders current skills and allows adding new skill', () => {
    render(
      <UserProfile
        userProfile={mockProfile}
        onSaveProfile={vi.fn()}
        mongoStatus={{ isMongoConnected: true }}
      />
    );

    expect(screen.getByText('React')).toBeInTheDocument();
    expect(screen.getByText('Node.js')).toBeInTheDocument();
    expect(screen.getByText('MongoDB')).toBeInTheDocument();

    const input = screen.getByPlaceholderText(/Type a skill/i);
    const addBtn = screen.getByText('Add Skill');

    fireEvent.change(input, { target: { value: 'Docker' } });
    fireEvent.click(addBtn);

    expect(screen.getByText('Docker')).toBeInTheDocument();
  });

  it('calls onSaveProfile when form is submitted', () => {
    const handleSave = vi.fn();
    render(
      <UserProfile
        userProfile={mockProfile}
        onSaveProfile={handleSave}
        mongoStatus={{ isMongoConnected: true }}
      />
    );

    const submitBtn = screen.getByText('Save Profile Changes');
    fireEvent.click(submitBtn);

    expect(handleSave).toHaveBeenCalledTimes(1);
    expect(handleSave).toHaveBeenCalledWith(
      expect.objectContaining({
        name: 'Fatin Ishraque',
        username: 'n0vemberain',
        fieldOfStudy: 'Computer Science & Engineering'
      })
    );
  });

  it('keeps account password masked on load and does not expose plain text', () => {
    render(
      <UserProfile
        userProfile={mockProfile}
        onSaveProfile={vi.fn()}
        mongoStatus={{ isMongoConnected: true }}
      />
    );

    // The raw password string 'Password123!' should NOT be displayed in any input value
    expect(screen.queryByDisplayValue('Password123!')).not.toBeInTheDocument();
    expect(screen.getByText(/Password secured and hidden/i)).toBeInTheDocument();
    expect(screen.getByText('Change Password')).toBeInTheDocument();
  });
});
