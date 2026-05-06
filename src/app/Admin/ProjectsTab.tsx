import React, { useState } from 'react';
import { Search, Filter, Edit2, Trash2, X } from 'lucide-react';
import { Project, cn, formatCurrency } from '../../constants';

interface ProjectsTabProps {
  projects: Project[];
  onEdit: (project: Project) => void;
  onDelete: (project: Project) => void;
}

export const ProjectsTab: React.FC<ProjectsTabProps> = ({ projects, onEdit, onDelete }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [showFilters, setShowFilters] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState<Project | null>(null);

  const categories = [
    'Health and Sanitation',
    'Education',
    'Cultural Diversity',
    'Economic',
    'Security',
    'Mental Health'
  ];

  const filteredProjects = projects.filter(p => {
    const matchesSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         p.location.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || p.status === statusFilter;
    const matchesCategory = categoryFilter === 'all' || 
                           p.category === categoryFilter || 
                           p.categories?.includes(categoryFilter);
    
    return matchesSearch && matchesStatus && matchesCategory;
  });

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Search projects..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
            />
          </div>
          <div className="flex gap-2">
            <button 
              onClick={() => setShowFilters(!showFilters)}
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-xl border transition-all",
                showFilters || statusFilter !== 'all' || categoryFilter !== 'all'
                  ? "bg-emerald-50 border-emerald-200 text-emerald-600"
                  : "bg-white border-slate-200 text-slate-500 hover:bg-slate-50"
              )}
            >
              <Filter size={18} />
              <span className="text-sm font-bold uppercase tracking-wider">Filters</span>
              {(statusFilter !== 'all' || categoryFilter !== 'all') && (
                <span className="w-2 h-2 bg-emerald-500 rounded-full" />
              )}
            </button>
          </div>
        </div>

        {showFilters && (
          <div className="p-6 bg-slate-50 border-b border-slate-100 grid md:grid-cols-2 gap-6 animate-in slide-in-from-top duration-200">
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Filter by Status</label>
              <div className="flex flex-wrap gap-2">
                {['all', 'proposed', 'ongoing', 'postponed', 'on hold', 'completed'].map((status) => (
                  <button
                    key={status}
                    onClick={() => setStatusFilter(status)}
                    className={cn(
                      "px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all border",
                      statusFilter === status
                        ? "bg-emerald-600 border-emerald-600 text-white shadow-md shadow-emerald-600/20"
                        : "bg-white border-slate-200 text-slate-500 hover:border-emerald-500 hover:text-emerald-600"
                    )}
                  >
                    {status}
                  </button>
                ))}
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Filter by Category</label>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setCategoryFilter('all')}
                  className={cn(
                    "px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all border",
                    categoryFilter === 'all'
                      ? "bg-emerald-600 border-emerald-600 text-white shadow-md shadow-emerald-600/20"
                      : "bg-white border-slate-200 text-slate-500 hover:border-emerald-500 hover:text-emerald-600"
                  )}
                >
                  All
                </button>
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setCategoryFilter(category)}
                    className={cn(
                      "px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all border",
                      categoryFilter === category
                        ? "bg-emerald-600 border-emerald-600 text-white shadow-md shadow-emerald-600/20"
                        : "bg-white border-slate-200 text-slate-500 hover:border-emerald-500 hover:text-emerald-600"
                    )}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 text-slate-500 text-xs font-bold uppercase tracking-widest">
                <th className="px-6 py-4">Project Name</th>
                <th className="px-6 py-4">Location</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Budget</th>
                <th className="px-6 py-4">Funding Gap</th>
                <th className="px-6 py-4">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredProjects.length > 0 ? (
                filteredProjects.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 font-bold text-slate-900">{p.title}</td>
                    <td className="px-6 py-4 text-sm text-slate-600">{p.location}</td>
                    <td className="px-6 py-4">
                      <span className={cn(
                        "px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider",
                        p.status === 'completed' ? "bg-emerald-100 text-emerald-700" :
                        p.status === 'ongoing' ? "bg-blue-100 text-blue-700" :
                        p.status === 'postponed' ? "bg-red-100 text-red-700" :
                        p.status === 'on hold' ? "bg-slate-100 text-slate-700" :
                        "bg-amber-100 text-amber-700"
                      )}>
                        {p.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-mono text-sm">{formatCurrency(p.budget)}</td>
                    <td className="px-6 py-4 font-mono text-sm text-emerald-600">{formatCurrency(p.investorGoal)}</td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <button 
                          onClick={() => onEdit(p)}
                          className="p-1.5 text-slate-400 hover:text-blue-600 transition-colors"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button 
                          onClick={() => setProjectToDelete(p)}
                          className="p-1.5 text-slate-400 hover:text-red-600 transition-colors"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-slate-400 font-medium">
                    No projects found matching your filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {projectToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-[2.5rem] w-full max-w-md p-8 shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="w-16 h-16 bg-rose-50 rounded-2xl flex items-center justify-center text-rose-600 mb-6">
              <Trash2 size={32} />
            </div>
            <h3 className="text-2xl font-bold text-slate-900 mb-2">Delete Project?</h3>
            <p className="text-slate-500 mb-8">
              Are you sure you want to delete <span className="font-bold text-slate-900">"{projectToDelete.title}"</span>? 
              This will submit a deletion request for approval.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setProjectToDelete(null)}
                className="flex-1 px-6 py-3 bg-slate-100 text-slate-600 rounded-xl font-bold hover:bg-slate-200 transition-all"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  onDelete(projectToDelete);
                  setProjectToDelete(null);
                }}
                className="flex-1 px-6 py-3 bg-rose-600 text-white rounded-xl font-bold hover:bg-rose-700 transition-all shadow-lg shadow-rose-200"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
