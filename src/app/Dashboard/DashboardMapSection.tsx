import React from 'react';
import { Filter } from 'lucide-react';
import { ProjectMap } from '../../components/ProjectMap';
import { ProjectSidebar } from './ProjectSidebar';
import { Project, cn } from '../../constants';

interface DashboardMapSectionProps {
  activeTab: string;
  setActiveTab: (tab: any) => void;
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
  selectedProject: Project | null;
  setSelectedProject: (project: Project | null) => void;
  filteredProjects: Project[];
}

const CATEGORIES = ['All', 'Health', 'Education', 'Cultural Diversity', 'Economic', 'Security', 'Mental Health'];

export const DashboardMapSection = ({ 
  activeTab, 
  setActiveTab, 
  selectedCategory,
  setSelectedCategory,
  selectedProject, 
  setSelectedProject,
  filteredProjects
}: DashboardMapSectionProps) => {
  return (
    <section id="map" className="max-w-7xl mx-auto px-4 mb-24">
      <div className="grid lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-7 space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
            <div>
              <h2 className="text-3xl font-bold text-slate-900 mb-2">Interactive Project Map</h2>
              <p className="text-slate-500">Select a location to view detailed project specifications.</p>
            </div>
            <div className="flex flex-wrap gap-3 items-center">
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                <select 
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="pl-9 pr-8 py-2 bg-slate-100 border-none rounded-xl text-xs font-bold text-slate-600 outline-none focus:ring-2 focus:ring-emerald-500/20 appearance-none cursor-pointer"
                >
                  {CATEGORIES.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
              <div className="flex gap-2 p-1 bg-slate-200 rounded-xl overflow-x-auto max-w-full no-scrollbar">
                {(['all', 'proposed', 'ongoing', 'completed'] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={cn(
                      "px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all whitespace-nowrap flex-shrink-0",
                      activeTab === tab ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700"
                    )}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>
          </div>
          
          <ProjectMap 
            onSelectProject={setSelectedProject} 
            selectedProjectId={selectedProject?.id} 
            filteredProjects={filteredProjects}
          />
        </div>

        <ProjectSidebar 
          selectedProject={selectedProject} 
          onClose={() => setSelectedProject(null)} 
        />
      </div>
    </section>
  );
};
