import React, { useState, useEffect } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { Project } from '../../constants';
import { db, doc, onSnapshot, handleFirestoreError, OperationType } from '../../lib/firebase';
import { ProjectHero } from './ProjectHero';
import { ProjectOverview } from './ProjectOverview';
import { CommunityImpact } from './CommunityImpact';
import { CommunityVoices } from './CommunityVoices';
import { TestimonialSection } from './TestimonialSection';
import { InvestmentInquiryCard } from './InvestmentInquiryCard';
import { ProjectResources } from './ProjectResources';
import { Loader2 } from 'lucide-react';

const ProjectDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [project, setProject] = useState<Project | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    window.scrollTo(0, 0);
    if (!id) return;

    const unsub = onSnapshot(doc(db, 'projects', id), (snapshot) => {
      if (snapshot.exists()) {
        setProject({ id: snapshot.id, ...snapshot.data() } as Project);
      } else {
        setProject(null);
      }
      setIsLoading(false);
    }, (error) => handleFirestoreError(error, OperationType.GET, `projects/${id}`));

    return () => unsub();
  }, [id]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-slate-50">
        <Loader2 size={40} className="text-emerald-600 animate-spin" />
        <p className="text-slate-500 font-bold animate-pulse">Loading Project Details...</p>
      </div>
    );
  }

  if (!project) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <ProjectHero project={project} />

      <main className="max-w-7xl mx-auto px-4 -mt-16 pb-24 relative z-20">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column: Details */}
          <div className="lg:col-span-2 space-y-8">
            <ProjectOverview project={project} />
            <CommunityImpact project={project} />
            <CommunityVoices project={project} />
            <TestimonialSection project={project} />
          </div>

          {/* Right Column: Action Card */}
          <div className="space-y-6">
            <InvestmentInquiryCard project={project} />
            <ProjectResources project={project} />
          </div>
        </div>
      </main>
    </div>
  );
};

export default ProjectDetail;
