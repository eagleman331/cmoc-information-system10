import React from 'react';
import { Link } from 'react-router-dom';
import { FileText, Building2 } from 'lucide-react';

interface ProjectResourcesProps {
  project: any;
}

export const ProjectResources = ({ project }: ProjectResourcesProps) => {
  return (
    <div className="space-y-6">
      <div className="bg-white p-8 rounded-[2.5rem] shadow-lg border border-slate-100">
        <div className="flex items-center gap-3 mb-4">
          <FileText className="text-emerald-600" size={24} />
          <h4 className="font-bold text-slate-900">Project Proposal</h4>
        </div>
        <p className="text-slate-500 text-sm mb-6">
          Download the complete technical and financial proposal for this project.
        </p>
        {project.proposalUrl ? (
          <a 
            href={project.proposalUrl}
            target="_blank"
            rel="noopener noreferrer"
            download={`Proposal-${project.title.replace(/\s+/g, '_')}.pdf`}
            className="w-full bg-slate-900 text-white py-4 rounded-2xl font-bold hover:bg-slate-800 transition-all flex items-center justify-center gap-2"
          >
            <FileText size={18} />
            Download Proposal
          </a>
        ) : (
          <Link 
            to={`/project/${project.id}/prospectus`}
            className="w-full bg-slate-900 text-white py-4 rounded-2xl font-bold hover:bg-slate-800 transition-all flex items-center justify-center gap-2"
          >
            <FileText size={18} />
            View Full Prospectus
          </Link>
        )}
      </div>

      <div className="bg-[#0f172a] p-8 rounded-[2.5rem] text-white">
        <div className="flex items-center gap-3 mb-4">
          <Building2 className="text-emerald-400" size={24} />
          <h4 className="font-bold">Unit in Charge</h4>
        </div>
        <p className="text-slate-400 text-sm mb-2">
          {project.unitInCharge || project.implementingPartner || 'Unit not specified'}
        </p>
        {project.contactPerson && (
          <div className="text-xs text-slate-300 mb-4">
            Contact: {project.contactPerson}
          </div>
        )}
        <div className="text-xs text-slate-500">
          Coordination Level: <span className="capitalize">{project.coordinationLevel || project.implementingMechanism || 'Not specified'}</span>
        </div>
      </div>
    </div>
  );
};
