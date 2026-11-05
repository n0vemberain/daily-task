import React, { useState } from 'react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import ErrorBoundary from '../components/ErrorBoundary';

function ProblematicComponent({ shouldThrow }) {
  if (shouldThrow) {
    throw new Error('Simulated critical UI exception');
  }
  return <div data-testid="healthy-content">Application running normally</div>;
}

describe('ErrorBoundary Component', () => {
  let originalConsoleError;

  beforeEach(() => {
    // Suppress console.error output during intentional error boundary testing
    originalConsoleError = console.error;
    console.error = vi.fn();
  });

  afterEach(() => {
    console.error = originalConsoleError;
  });

  it('renders children without disruption when no runtime errors occur', () => {
    render(
      <ErrorBoundary>
        <ProblematicComponent shouldThrow={false} />
      </ErrorBoundary>
    );

    expect(screen.getByTestId('healthy-content')).toBeInTheDocument();
    expect(screen.getByText('Application running normally')).toBeInTheDocument();
  });

  it('catches runtime exceptions and renders the GitHub-styled recovery screen instead of blacking out', () => {
    render(
      <ErrorBoundary>
        <ProblematicComponent shouldThrow={true} />
      </ErrorBoundary>
    );

    // Prevents black screen by rendering fallback UI
    expect(screen.getByText('Application Exception Intercepted')).toBeInTheDocument();
    expect(screen.getByText('The system prevented a screen blackout.')).toBeInTheDocument();
    expect(screen.getByText('Simulated critical UI exception')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Reload Dashboard/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Reset Session/i })).toBeInTheDocument();
  });

  it('allows user to click Reload Dashboard button', () => {
    render(
      <ErrorBoundary>
        <ProblematicComponent shouldThrow={true} />
      </ErrorBoundary>
    );

    const reloadBtn = screen.getByRole('button', { name: /Reload Dashboard/i });
    expect(reloadBtn).toBeInTheDocument();
  });

  it('clears session when user triggers Reset Session', () => {
    window.localStorage.setItem('daily_task_auth_session', 'active-token-123');
    const removeItemSpy = vi.spyOn(window.localStorage, 'removeItem');
    const originalLocation = window.location;
    delete window.location;
    window.location = { ...originalLocation, reload: vi.fn() };

    render(
      <ErrorBoundary>
        <ProblematicComponent shouldThrow={true} />
      </ErrorBoundary>
    );

    const resetBtn = screen.getByRole('button', { name: /Reset Session/i });
    fireEvent.click(resetBtn);

    expect(removeItemSpy).toHaveBeenCalledWith('daily_task_auth_session');
    expect(window.localStorage.getItem('daily_task_auth_session')).toBeNull();
    expect(window.location.reload).toHaveBeenCalled();

    removeItemSpy.mockRestore();
    window.location = originalLocation;
  });
});
