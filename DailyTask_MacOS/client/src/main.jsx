import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import HeatmapWidget from './components/widgets/HeatmapWidget';
import ChallengesWidget from './components/widgets/ChallengesWidget';
import DailyTasksWidget from './components/widgets/DailyTasksWidget';
import { ThemeProvider } from './context/ThemeContext';
import './index.css';

// Check if running in dedicated widget window route
const searchParams = new URLSearchParams(window.location.search);
const widgetType = searchParams.get('widget');

function RootComponent() {
  if (widgetType === 'heatmap') {
    return <HeatmapWidget />;
  }
  if (widgetType === 'challenges') {
    return <ChallengesWidget />;
  }
  if (widgetType === 'daily-tasks') {
    return <DailyTasksWidget />;
  }

  // Default: Main Dashboard App
  return (
    <ThemeProvider>
      <App />
    </ThemeProvider>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RootComponent />
  </React.StrictMode>
);
