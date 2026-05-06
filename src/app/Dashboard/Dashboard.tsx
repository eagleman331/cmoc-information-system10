import React, { useState, useMemo, useEffect } from 'react';
import { DashboardHero } from './DashboardHero';
import { DashboardStats } from './DashboardStats';
import { DashboardMapSection } from './DashboardMapSection';
import { DashboardProjectGrid } from './DashboardProjectGrid';
import { Project } from '../../constants';
import { db, collection, onSnapshot, handleFirestoreError, OperationType } from '../../lib/firebase';

const Dashboard = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [activeTab, setActiveTab] = useState<'all' | 'proposed' | 'ongoing' | 'completed'>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  useEffect(() => {
    const unsub = onSnapshot(collection(db, 'projects'), (snapshot) => {
      const projectsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Project));
      setProjects(projectsData);
    }, (error) => handleFirestoreError(error, OperationType.GET, 'projects'));

    return () => unsub();
  }, []);

  const filteredProjects = useMemo(() => {
    let filtered = projects;
    
    if (activeTab !== 'all') {
      filtered = filtered.filter(p => p.status === activeTab);
    }
    
    if (selectedCategory !== 'All') {
      filtered = filtered.filter(p => 
        p.category === selectedCategory || 
        (p.categories && p.categories.includes(selectedCategory))
      );
    }
    
    return filtered;
  }, [activeTab, selectedCategory, projects]);

  return (
    <>
      <DashboardHero />
      <DashboardStats projects={projects} />
      <DashboardMapSection 
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        selectedProject={selectedProject}
        setSelectedProject={setSelectedProject}
        filteredProjects={filteredProjects}
      />
      <DashboardProjectGrid 
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        filteredProjects={filteredProjects}
        selectedProject={selectedProject}
        setSelectedProject={setSelectedProject}
      />
    </>
  );
};

export default Dashboard;
