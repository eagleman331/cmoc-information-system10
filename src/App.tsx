import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Toaster } from 'sonner';
import { Navbar } from './components/Navbar';
import { ScrollToTop } from './components/ScrollToTop';
import About from './app/About/About';
import FAQ from './app/FAQ/FAQ';
import ProjectDetail from './app/ProjectDetail/ProjectDetail';
import ProspectusPage from './app/Prospectus/ProspectusPage';
import ProspectusSelection from './app/ProspectusSelection/ProspectusSelection';
import AdminDashboard from './app/Admin/AdminDashboard';
import Dashboard from './app/Dashboard/Dashboard';
import { Framework } from './app/Framework/Framework';
import { UnderDevelopment } from './components/UnderDevelopment';

export default function App() {
  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      <Toaster position="top-center" richColors />
      <ScrollToTop />
      <Navbar />

      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/about" element={<About />} />
        <Route path="/framework" element={<Framework />} />
        <Route path="/framework/details" element={<UnderDevelopment />} />
        <Route path="/faq" element={<FAQ />} />
        <Route path="/project/:id" element={<ProjectDetail />} />
        <Route path="/project/:id/prospectus" element={<ProspectusPage />} />
        <Route path="/prospectus" element={<ProspectusSelection />} />
        {/* <Route path="/admin" element={<AdminDashboard />} /> */}
      </Routes>
    </div>
  );
}
