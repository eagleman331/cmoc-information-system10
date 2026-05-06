import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'motion/react';
import { FileText, Download, Search, Filter, MapPin, Building2, ChevronRight, ArrowLeft, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Project, formatCurrency } from '../../constants';
import { db, collection, onSnapshot, handleFirestoreError, OperationType } from '../../lib/firebase';

const ProspectusSelection = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('All');

  useEffect(() => {
    const unsub = onSnapshot(collection(db, 'projects'), (snapshot) => {
      const projectsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Project));
      setProjects(projectsData);
      setIsLoading(false);
    }, (error) => handleFirestoreError(error, OperationType.GET, 'projects'));

    return () => unsub();
  }, []);

  const categories = useMemo(() => ['All', ...new Set(projects.map(p => p.category))], [projects]);

  const filteredProjects = useMemo(() => projects.filter(project => {
    const matchesSearch = project.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          project.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'All' || project.category === filterCategory;
    return matchesSearch && matchesCategory;
  }), [projects, searchTerm, filterCategory]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-slate-50">
        <Loader2 size={40} className="text-emerald-600 animate-spin" />
        <p className="text-slate-500 font-bold animate-pulse">Loading Project Library...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 pt-24 pb-20 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <Link to="/" className="inline-flex items-center gap-2 text-slate-500 hover:text-emerald-600 transition-colors mb-6 font-medium">
            <ArrowLeft size={20} />
            Back to Dashboard
          </Link>
          <h1 className="text-4xl font-bold text-slate-900 mb-4 tracking-tight">Project Proposal Library</h1>
          <p className="text-slate-600 max-w-2xl leading-relaxed">
            Select a project proposal to view and download its detailed documentation. These documents contain comprehensive information on objectives, implementation mechanisms, and investment requirements.
          </p>
        </div>

        {/* Controls */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
            <input 
              type="text"
              placeholder="Search projects by title or location..."
              className="w-full pl-12 pr-4 py-4 bg-white border border-slate-200 rounded-2xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all shadow-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0">
            {categories.map((category, idx) => (
              <button
                key={`${category}-${idx}`}
                onClick={() => setFilterCategory(category)}
                className={`px-6 py-4 rounded-2xl font-bold whitespace-nowrap transition-all border ${
                  filterCategory === category 
                    ? 'bg-[#0f172a] text-white border-[#0f172a] shadow-lg shadow-slate-200' 
                    : 'bg-white text-slate-600 border-slate-200 hover:border-emerald-500 hover:text-emerald-600'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project, index) => (
            <motion.div
              key={`${project.id || 'project'}-${index}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="group bg-white border border-slate-200 rounded-[2rem] p-6 hover:shadow-xl hover:border-emerald-500/30 transition-all flex flex-col"
            >
              <div className="flex justify-between items-start mb-6">
                <div className="p-3 bg-emerald-50 text-emerald-600 rounded-2xl group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                  <FileText size={24} />
                </div>
                <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                  project.status === 'completed' ? 'bg-blue-50 text-blue-600' :
                  project.status === 'ongoing' ? 'bg-emerald-50 text-emerald-600' :
                  'bg-amber-50 text-amber-600'
                }`}>
                  {project.status}
                </span>
              </div>

              <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-emerald-600 transition-colors line-clamp-2 min-h-[3.5rem]">
                {project.title}
              </h3>

              <div className="space-y-3 mb-8">
                <div className="flex items-center gap-2 text-slate-500 text-sm">
                  <MapPin size={16} />
                  {project.location}
                </div>
                <div className="flex items-center gap-2 text-slate-500 text-sm">
                  <Building2 size={16} />
                  {project.category}
                </div>
              </div>

              <div className="mt-auto pt-6 border-t border-slate-50 flex items-center justify-between">
                <div className="text-xs font-bold text-slate-400 uppercase">
                  Budget: <span className="text-slate-900">{formatCurrency(project.budget)}</span>
                </div>
                <Link 
                  to={`/project/${project.id}/prospectus`}
                  className="p-3 bg-slate-50 text-slate-900 rounded-xl hover:bg-[#0f172a] hover:text-white transition-all shadow-sm"
                >
                  <Download size={20} />
                </Link>
              </div>
            </motion.div>
          ))}
        </div>

        {filteredProjects.length === 0 && (
          <div className="text-center py-20">
            <div className="bg-slate-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 text-slate-400">
              <Search size={32} />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">No projects found</h3>
            <p className="text-slate-500">Try adjusting your search or filter to find what you're looking for.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProspectusSelection;
