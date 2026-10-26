import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import ContributionHeatmap from '../components/ContributionHeatmap';
import { formatDateStr } from '../data/initialData';

describe('ContributionHeatmap Component', () => {
  const sampleTasks = [
    {
      id: 't1',
      title: 'Task 1',
      date: formatDateStr(new Date()),
      completed: true
    },
    {
      id: 't2',
      title: 'Task 2',
      date: formatDateStr(new Date()),
      completed: true
    }
  ];

  it('renders heatmap title and default olive shades indicator', () => {
    render(<ContributionHeatmap tasks={sampleTasks} />);
    expect(screen.getByText(/Activity Contribution Heatmap/i)).toBeInTheDocument();
    expect(screen.getByText(/Olive Green Shades/i)).toBeInTheDocument();
  });

  it('renders month labels and day of week labels', () => {
    render(<ContributionHeatmap tasks={sampleTasks} />);
    expect(screen.getByText('Mon')).toBeInTheDocument();
    expect(screen.getByText('Wed')).toBeInTheDocument();
    expect(screen.getByText('Fri')).toBeInTheDocument();
  });

  it('displays correct summary count of completed tasks', () => {
    render(<ContributionHeatmap tasks={sampleTasks} />);
    expect(screen.getByText(/completed tasks in/i)).toBeInTheDocument();
  });

  it('toggles time range across 1 Year, Last 6 Months, and 1 Month', () => {
    render(<ContributionHeatmap tasks={sampleTasks} />);

    // 6 Months button
    const halfYearBtn = screen.getByText('Last 6 Months');
    fireEvent.click(halfYearBtn);
    expect(halfYearBtn).toHaveClass('bg-olive-800');

    // 1 Month button
    const monthBtn = screen.getByText('1 Month');
    fireEvent.click(monthBtn);
    expect(monthBtn).toHaveClass('bg-olive-800');
    expect(screen.getByText(/Focused 30-Day Activity Grid/i)).toBeInTheDocument();
  });

  it('allows switching color theme', () => {
    render(<ContributionHeatmap tasks={sampleTasks} />);

    // Open theme picker
    const themeBtn = screen.getByTitle('Select Heatmap Color Theme');
    fireEvent.click(themeBtn);

    // Select Emerald Mint
    const emeraldOption = screen.getByText('Emerald Mint');
    fireEvent.click(emeraldOption);

    // Verify theme badge updated
    expect(screen.getByText(/Emerald Mint Shades/i)).toBeInTheDocument();
  });
});
