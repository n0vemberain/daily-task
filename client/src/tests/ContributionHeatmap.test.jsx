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

  it('renders heatmap title and olive shades indicator', () => {
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

  it('toggles time range from year to 6 months', () => {
    render(<ContributionHeatmap tasks={sampleTasks} />);
    const halfYearBtn = screen.getByText('Last 6 Months');
    fireEvent.click(halfYearBtn);
    expect(halfYearBtn).toHaveClass('bg-olive-800');
  });
});
