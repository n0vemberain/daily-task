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

  it('neutralizes selection when clicking outside the heatmap', () => {
    const handleSelectDate = vi.fn();
    const today = formatDateStr(new Date());

    render(
      <div>
        <div data-testid="outside-element">Outside Area</div>
        <ContributionHeatmap
          tasks={sampleTasks}
          selectedDate={today}
          onSelectDate={handleSelectDate}
        />
      </div>
    );

    // Simulate clicking outside the heatmap container
    const outsideEl = screen.getByTestId('outside-element');
    fireEvent.mouseDown(outsideEl);

    expect(handleSelectDate).toHaveBeenCalledWith(null);
  });

  it('keeps clean activity level appearance without glowing shadow halos when selected', () => {
    const today = formatDateStr(new Date());

    const { container } = render(
      <ContributionHeatmap
        tasks={sampleTasks}
        selectedDate={today}
      />
    );

    // Any cell with selectedRing should have border-white and ring-1 without glowing shadow-md
    const selectedCells = container.querySelectorAll('.ring-1.ring-white\\/80');
    expect(selectedCells.length).toBeGreaterThan(0);
    selectedCells.forEach((cell) => {
      expect(cell.className).not.toMatch(/shadow-md/);
      expect(cell.className).not.toMatch(/shadow-olive/);
    });
  });
});
