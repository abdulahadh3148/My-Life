import React from 'react';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { BottomNav } from './BottomNav';
import { NotificationModal } from './NotificationModal';
import { PwaPromptModal } from './PwaPromptModal';
import { TimeBalancerModal } from '../balancer/TimeBalancerModal';
import { ActivityFormModal } from '../schedule/ActivityFormModal';
import { DashboardView } from '../dashboard/DashboardView';
import { ScheduleView } from '../schedule/ScheduleView';
import { WorkView } from '../work/WorkView';
import { FitnessView } from '../fitness/FitnessView';
import { GardeningView } from '../gardening/GardeningView';
import { PrayerView } from '../prayer/PrayerView';
import { GrowthView } from '../growth/GrowthView';
import { WeeklyView } from '../weekly/WeeklyView';
import { AnalyticsView } from '../analytics/AnalyticsView';
import { SettingsView } from '../settings/SettingsView';
import { FinanceView } from '../finance/FinanceView';
import { ExplorerView } from '../explorer/ExplorerView';
import { useApp } from '../../context/AppContext';

export const AppLayout: React.FC = () => {
  const {
    activeView,
    isQuickAddOpen,
    setIsQuickAddOpen,
    isBalancerOpen,
    setIsBalancerOpen,
    isPwaPromptOpen,
    setIsPwaPromptOpen,
    isNotificationCenterOpen,
    setIsNotificationCenterOpen,
    selectedDate
  } = useApp();

  const renderActiveView = () => {
    switch (activeView) {
      case 'dashboard':
        return <DashboardView />;
      case 'schedule':
        return <ScheduleView />;
      case 'work':
        return <WorkView />;
      case 'fitness':
        return <FitnessView />;
      case 'gardening':
        return <GardeningView />;
      case 'prayer':
        return <PrayerView />;
      case 'finance':
        return <FinanceView />;
      case 'explorer':
        return <ExplorerView />;
      case 'growth':
        return <GrowthView />;
      case 'weekly':
        return <WeeklyView />;
      case 'analytics':
        return <AnalyticsView />;
      case 'settings':
        return <SettingsView />;
      default:
        return <DashboardView />;
    }
  };

  return (
    <div className="min-h-screen flex bg-slate-50 dark:bg-[#0B0F17] text-slate-900 dark:text-slate-100 transition-colors">
      {/* Desktop Sidebar */}
      <Sidebar />

      {/* Main Column */}
      <div className="flex-1 flex flex-col min-w-0">
        <Header />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full">
          {renderActiveView()}
        </main>

        {/* Mobile Navigation */}
        <BottomNav />
      </div>

      {/* Global Modals */}
      <ActivityFormModal
        isOpen={isQuickAddOpen}
        onClose={() => setIsQuickAddOpen(false)}
        defaultDate={selectedDate}
      />

      <TimeBalancerModal
        isOpen={isBalancerOpen}
        onClose={() => setIsBalancerOpen(false)}
      />

      <NotificationModal
        isOpen={isNotificationCenterOpen}
        onClose={() => setIsNotificationCenterOpen(false)}
      />

      <PwaPromptModal
        isOpen={isPwaPromptOpen}
        onClose={() => setIsPwaPromptOpen(false)}
      />
    </div>
  );
};
