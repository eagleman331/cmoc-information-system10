import React from 'react';
import { StatsSection } from '../../components/ProjectComponents';
import { Project } from '../../constants';

interface DashboardStatsProps {
  projects: Project[];
}

export const DashboardStats = ({ projects }: DashboardStatsProps) => {
  return (
    <section className="max-w-7xl mx-auto px-4 mb-24">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Aggregate Project Overview</h2>
        <p className="text-slate-500">Real-time tracking of civil-military coordination efforts nationwide.</p>
      </div>
      <StatsSection projects={projects} />
    </section>
  );
};
