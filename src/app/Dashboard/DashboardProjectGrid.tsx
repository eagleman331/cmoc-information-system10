import React from 'react';
import { Filter } from 'lucide-react';
import { ProjectCard } from '../../components/ProjectComponents';
import { Project, cn } from '../../constants';

interface DashboardProjectGridProps {
  activeTab: string;
  setActiveTab: (tab: any) => void;
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
  filteredProjects: Project[];
  selectedProject: Project | null;
  setSelectedProject: (project: Project | null) => void;
}

const CATEGORIES = ['All', 'Health', 'Education', 'Cultural Diversity', 'Economic', 'Security', 'Mental Health'];

export const DashboardProjectGrid = ({
  activeTab,
  setActiveTab,
  selectedCategory,
  setSelectedCategory,
  filteredProjects,
  selectedProject,
  setSelectedProject
}: DashboardProjectGridProps) => {
  return (
    <section id="projects" className="max-w-7xl mx-auto px-4 mb-24">
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-12">
        <div>
          <h2 className="text-3xl font-bold text-slate-900 mb-2">Project Portfolio</h2>
          <p className="text-slate-500">Comprehensive list of all civil-military coordination initiatives.</p>
        </div>
        <div className="flex flex-wrap items-center gap-4">
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
            <select 
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="pl-9 pr-8 py-2 bg-white border border-slate-200 rounded-full text-xs font-bold text-slate-600 outline-none focus:ring-2 focus:ring-emerald-500/20 appearance-none cursor-pointer"
            >
              {CATEGORIES.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
          <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0 no-scrollbar">
            {(['all', 'proposed', 'ongoing', 'completed'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={cn(
                  "px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider whitespace-nowrap flex-shrink-0 transition-all",
                  activeTab === tab ? "bg-[#0f172a] text-white" : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
                )}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProjects.map((project) => (
          <ProjectCard 
            key={project.id} 
            project={project} 
            onClick={() => {
              setSelectedProject(project);
              document.getElementById('map')?.scrollIntoView({ behavior: 'smooth' });
            }}
            isSelected={selectedProject?.id === project.id}
          />
        ))}
      </div>
    </section>
  );
};
