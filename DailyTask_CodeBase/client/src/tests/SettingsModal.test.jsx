import { describe, it, expect, vi } from 'vitest';
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import SettingsModal from '../components/SettingsModal';
import { ThemeProvider } from '../context/ThemeContext';

describe('SettingsModal Component', () => {
  const mockUser = {
    name: 'Fatin Ishraque',
    username: 'n0vemberain',
    role: 'admin',
    skills: ['React', 'Node.js']
  };

  const mockProps = {
    isOpen: true,
    onClose: vi.fn(),
    mongoStatus: { isMongoConnected: true },
    isSyncing: false,
    lastSyncTime: new Date().toISOString(),
    onManualSync: vi.fn(),
    data: { user: mockUser, tasks: [], challenges: [] },
    onRestoreData: vi.fn(),
    onOpenCleanCenter: vi.fn(),
    userProfile: mockUser,
    currentUser: mockUser,
    onSaveProfile: vi.fn()
  };

  it('does not render when closed', () => {
    const { container } = render(
      <ThemeProvider>
        <SettingsModal {...mockProps} isOpen={false} />
      </ThemeProvider>
    );
    expect(container).toBeEmptyDOMElement();
  });

  it('renders application settings header and navigation tabs', () => {
    render(
      <ThemeProvider>
        <SettingsModal {...mockProps} />
      </ThemeProvider>
    );

    expect(screen.getByText('Application Settings')).toBeInTheDocument();
    expect(screen.getByText('Theme & Preferences')).toBeInTheDocument();
    expect(screen.getByText('Skills & Badges')).toBeInTheDocument();
    expect(screen.getByText('Remote Access & QR')).toBeInTheDocument();
    expect(screen.getByText('User Management')).toBeInTheDocument();
    expect(screen.getByText('Sync & Backup')).toBeInTheDocument();
  });

  it('switches to Skills & Badges tab and allows adding skills', () => {
    const onSave = vi.fn();
    render(
      <ThemeProvider>
        <SettingsModal {...mockProps} onSaveProfile={onSave} />
      </ThemeProvider>
    );

    const skillsTab = screen.getByText('Skills & Badges');
    fireEvent.click(skillsTab);

    expect(screen.getByText(/Technical Skills & Competencies/i)).toBeInTheDocument();
    expect(screen.getByText('React')).toBeInTheDocument();
    expect(screen.getByText('Node.js')).toBeInTheDocument();

    const input = screen.getByPlaceholderText(/Type a skill/i);
    const addBtn = screen.getByText('Add Skill');

    fireEvent.change(input, { target: { value: 'Docker' } });
    fireEvent.click(addBtn);

    expect(screen.getByText('Docker')).toBeInTheDocument();
    expect(onSave).toHaveBeenCalledWith(
      expect.objectContaining({
        skills: expect.arrayContaining(['React', 'Node.js', 'Docker'])
      })
    );
  });

  it('switches to Remote Access & QR tab and renders URLs', () => {
    render(
      <ThemeProvider>
        <SettingsModal {...mockProps} />
      </ThemeProvider>
    );

    const networkTab = screen.getByText('Remote Access & QR');
    fireEvent.click(networkTab);

    expect(screen.getByText('Multi-Device & Remote Network Access')).toBeInTheDocument();
    expect(screen.getByText('Scan QR Code on Phone')).toBeInTheDocument();
    expect(screen.getByText('Public Internet Access')).toBeInTheDocument();
  });

  it('switches to Sync & Backup tab and displays sync status', () => {
    render(
      <ThemeProvider>
        <SettingsModal {...mockProps} />
      </ThemeProvider>
    );

    const syncTab = screen.getByText('Sync & Backup');
    fireEvent.click(syncTab);

    expect(screen.getByText(/Dual Persistence & Sync/i)).toBeInTheDocument();
    expect(screen.getByText(/Download Backup \(JSON\)/i)).toBeInTheDocument();

    const syncBtn = screen.getByText('Sync Now');
    fireEvent.click(syncBtn);
    expect(mockProps.onManualSync).toHaveBeenCalled();
  });

  it('provides button to launch password-protected Clean Center from Sync & Backup', () => {
    render(
      <ThemeProvider>
        <SettingsModal {...mockProps} />
      </ThemeProvider>
    );

    const syncTab = screen.getByText('Sync & Backup');
    fireEvent.click(syncTab);

    const openCleanBtn = screen.getByText('Open Clean Center');
    expect(openCleanBtn).toBeInTheDocument();
    fireEvent.click(openCleanBtn);

    expect(mockProps.onClose).toHaveBeenCalled();
    expect(mockProps.onOpenCleanCenter).toHaveBeenCalled();
  });
});
