import { describe, it, expect, vi } from 'vitest';
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import SettingsModal from '../components/SettingsModal';
import { ThemeProvider } from '../context/ThemeContext';

describe('SettingsModal Component', () => {
  const mockProps = {
    isOpen: true,
    onClose: vi.fn(),
    mongoStatus: { isMongoConnected: true },
    isSyncing: false,
    lastSyncTime: new Date().toISOString(),
    onManualSync: vi.fn(),
    data: { user: {}, tasks: [], challenges: [] },
    onRestoreData: vi.fn(),
    onOpenCleanCenter: vi.fn()
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
    expect(screen.getByText('Sync & Backup')).toBeInTheDocument();
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
