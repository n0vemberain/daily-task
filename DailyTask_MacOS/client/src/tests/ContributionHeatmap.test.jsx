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

  it('renders heatmap title', () => {
    render(<ContributionHeatmap tasks={sampleTasks} />);
    expect(screen.getByText(/Activity Contribution Heatmap/i)).toBeInTheDocument();
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

  it('reflects selected theme styling on active timeframe buttons', () => {
    render(<ContributionHeatmap tasks={sampleTasks} />);
    const halfYearBtn = screen.getByText('Last 6 Months');
    fireEvent.click(halfYearBtn);
    expect(halfYearBtn).toHaveClass('bg-olive-800');
  });

  it('toggles selection off when clicking an already selected cell', () => {
    const handleSelectDate = vi.fn();
    const today = formatDateStr(new Date());

    const { container } = render(
      <ContributionHeatmap
        tasks={sampleTasks}
        selectedDate={today}
        onSelectDate={handleSelectDate}
      />
    );

    const cells = container.querySelectorAll('[data-heatmap-cell="true"]');
    const nonDisabledCells = Array.from(cells).filter((c) => !c.disabled);
    expect(nonDisabledCells.length).toBeGreaterThan(0);
    const todayCell = nonDisabledCells[nonDisabledCells.length - 1];
    fireEvent.click(todayCell);
    expect(handleSelectDate).toHaveBeenCalledWith(null);
  });

  it('renders neutral dark color for 0 tasks and bright radiant glow for higher task activity', () => {
    const today = formatDateStr(new Date());
    const manyTasks = Array.from({ length: 6 }, (_, i) => ({
      id: `task-high-${i}`,
      title: `Intense task ${i}`,
      date: today,
      completed: true
    }));

    const { container } = render(
      <ContributionHeatmap
        tasks={manyTasks}
        selectedDate={null}
      />
    );

    // Check that 0-task cells have neutral background bg-[#161b22]
    const zeroTaskCells = container.querySelectorAll('.bg-\\[\\#161b22\\]');
    expect(zeroTaskCells.length).toBeGreaterThan(0);

    // Check that Level 4 high activity day has radiant shadow glow
    const highActivityCell = container.querySelectorAll('.shadow-sm');
    expect(highActivityCell.length).toBeGreaterThan(0);
  });

  it('renders completely clean heatmap (0 completed tasks, 0 active days) when tasks array is empty', () => {
    render(<ContributionHeatmap tasks={[]} />);
    expect(screen.getByText(/completed tasks in/i)).toBeInTheDocument();
    expect(screen.getByText(/active days/i)).toBeInTheDocument();
    const zeros = screen.getAllByText('0');
    expect(zeros.length).toBeGreaterThanOrEqual(2);
  });
});
