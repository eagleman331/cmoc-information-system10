import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Project } from '../../constants';
import { db, doc, onSnapshot, handleFirestoreError, OperationType } from '../../lib/firebase';
import { ProspectusNav } from './ProspectusNav';
import { ProspectusHero } from './ProspectusHero';
import { ProspectusSummary } from './ProspectusSummary';
import { Loader2 } from 'lucide-react';

const ProspectusPage = () => {
  const { id } = useParams<{ id: string }>();
  const [project, setProject] = useState<Project | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
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
        <p className="text-slate-500 font-bold animate-pulse">Loading Prospectus...</p>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Project Not Found</h2>
          <Link to="/" className="text-emerald-600 font-bold hover:underline">Return to Dashboard</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      <ProspectusNav id={id!} />

      <main className="pt-32 pb-24 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-start">
            <ProspectusHero project={project} />
            <ProspectusSummary project={project} />
          </div>
        </div>
      </main>
    </div>
  );
};

export default ProspectusPage;
