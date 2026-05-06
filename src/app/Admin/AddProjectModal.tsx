import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  User, 
  FileText, 
  Target, 
  Shield, 
  MapPin, 
  Users, 
  Clock, 
  History, 
  ClipboardList, 
  Scale, 
  DollarSign, 
  Layers, 
  Handshake, 
  Settings, 
  Calendar, 
  Navigation,
  Image as ImageIcon,
  Upload,
  Plus,
  Trash2,
  MessageSquareQuote,
  Loader2
} from 'lucide-react';

import { Project, Testimonial } from '../../constants';
import { auth, db, collection, addDoc, serverTimestamp, handleFirestoreError, OperationType, uploadFile } from '../../lib/firebase';

interface AddProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  project?: Project;
}

export const AddProjectModal: React.FC<AddProjectModalProps> = ({ isOpen, onClose, project }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [objectives, setObjectives] = useState<string[]>(
    Array.isArray(project?.objectives) ? project.objectives : (project?.objectives ? [project.objectives] : [''])
  );
  const [stages, setStages] = useState<{ name: string; duration: string; deliverables: string }[]>(
    project?.stages || [{ name: '', duration: '', deliverables: '' }]
  );
  const [selectedCategories, setSelectedCategories] = useState<string[]>(project?.categories || (project?.category ? [project.category] : []));
  const [status, setStatus] = useState<Project['status']>(project?.status || 'proposed');
  const [investors, setInvestors] = useState<{ name: string; headOfCompany: string; sector: string; country: string; amount: string; date: string }[]>(
    project?.investors?.map(inv => ({
      name: inv.name,
      headOfCompany: inv.headOfCompany || '',
      sector: inv.sector || '',
      country: inv.country || '',
      amount: inv.amount,
      date: inv.date
    })) || []
  );
  const [testimonials, setTestimonials] = useState<Testimonial[]>(
    project?.testimonials || []
  );

  const [proposedImage, setProposedImage] = useState(project?.proposedImage || '');
  const [beneficiariesImage, setBeneficiariesImage] = useState(project?.beneficiariesImage || '');
  const [proposalUrl, setProposalUrl] = useState(project?.proposalUrl || '');
  const [files, setFiles] = useState<Record<string, File | null>>({
    proposed: null,
    beneficiaries: null,
    proposal: null
  });
  const [testimonialFiles, setTestimonialFiles] = useState<Record<string, File | null>>({});

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    setIsSubmitting(true);
    try {
      let finalProposedImage = proposedImage;
      let finalBeneficiariesImage = beneficiariesImage;
      let finalProposalUrl = proposalUrl;

      if (files.proposed) {
        finalProposedImage = await uploadFile(files.proposed, 'pending_approval/projects/proposed');
      }
      if (files.beneficiaries) {
        finalBeneficiariesImage = await uploadFile(files.beneficiaries, 'pending_approval/projects/beneficiaries');
      }
      if (files.proposal) {
        finalProposalUrl = await uploadFile(files.proposal, 'pending_approval/projects/proposals');
      }

      const updatedTestimonials = await Promise.all(testimonials.map(async (t) => {
        if (testimonialFiles[t.id]) {
          const photoUrl = await uploadFile(testimonialFiles[t.id], 'pending_approval/projects/testimonials');
          return { ...t, photo: photoUrl };
        }
        return t;
      }));

      const formData = new FormData(form);
      const lat = parseFloat(formData.get('latitude') as string);
      const lng = parseFloat(formData.get('longitude') as string);
      const duration = formData.get('duration') ? Number(formData.get('duration')) : null;
      const areaCoverage = formData.get('areaCoverage') ? Number(formData.get('areaCoverage')) : null;
      const budget = formData.get('budget') ? Number(formData.get('budget')) : null;
      const investorGoal = formData.get('investorGoal') ? Number(formData.get('investorGoal')) : null;
      const currentFunding = formData.get('currentFunding') ? Number(formData.get('currentFunding')) : null;
      const beneficiariesCount = formData.get('beneficiariesCount') ? Number(formData.get('beneficiariesCount')) : null;
      const impactPercentage = formData.get('impactPercentage') ? Number(formData.get('impactPercentage')) : null;
      
      const data = {
        proponent: formData.get('proponent'),
        title: formData.get('title'),
        aboutProponent: formData.get('aboutProponent'),
        contactPerson: formData.get('contactPerson'),
        legalStatus: formData.get('legalStatus'),
        unitInCharge: formData.get('unitInCharge'),
        coordinationLevel: formData.get('coordinationLevel'),
        background: formData.get('background'),
        description: formData.get('description'),
        policy: formData.get('policy'),
        duration,
        targetStart: formData.get('targetStart'),
        location: formData.get('location'),
        areaCoverage,
        beneficiaries: formData.get('beneficiaries'),
        beneficiariesCount,
        impactPercentage,
        coordinates: (!isNaN(lat) && !isNaN(lng)) ? [lng, lat] : null,
        budget,
        investorGoal,
        currentFunding,
        status,
        categories: selectedCategories,
        objectives,
        stages: stages.map(s => ({ ...s, duration: Number(s.duration) })),
        investors: investors.map(i => ({ ...i, amount: Number(i.amount) })),
        testimonials: updatedTestimonials,
        proposedImage: finalProposedImage,
        beneficiariesImage: finalBeneficiariesImage,
        proposalUrl: finalProposalUrl,
        updatedAt: new Date().toISOString(),
        authorId: auth.currentUser?.uid || 'anonymous'
      };

      await addDoc(collection(db, 'pending_approvals'), {
        type: project ? 'UPDATE_PROJECT' : 'CREATE_PROJECT',
        data,
        targetId: project?.id || null,
        status: 'pending',
        requestedBy: auth.currentUser?.uid || 'anonymous',
        requestedAt: serverTimestamp()
      });

      onClose();
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, 'pending_approvals');
    } finally {
      setIsSubmitting(false);
    }
  };

  const categories = [
    'Health and Sanitation',
    'Education',
    'Cultural Diversity',
    'Economic',
    'Security',
    'Mental Health'
  ];

  const toggleCategory = (category: string) => {
    setSelectedCategories(prev => 
      prev.includes(category) 
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  const addObjective = () => {
    if (objectives.length < 5) {
      setObjectives([...objectives, '']);
    }
  };

  const removeObjective = (index: number) => {
    if (objectives.length > 1) {
      const newObjectives = objectives.filter((_, i) => i !== index);
      setObjectives(newObjectives);
    }
  };

  const updateObjective = (index: number, value: string) => {
    const newObjectives = [...objectives];
    newObjectives[index] = value;
    setObjectives(newObjectives);
  };

  const addStage = () => {
    setStages([...stages, { name: '', duration: '', deliverables: '' }]);
  };

  const removeStage = (index: number) => {
    if (stages.length > 1) {
      const newStages = stages.filter((_, i) => i !== index);
      setStages(newStages);
    }
  };

  const updateStage = (index: number, field: keyof typeof stages[0], value: string) => {
    const newStages = [...stages];
    newStages[index][field] = value;
    setStages(newStages);
  };

  const addInvestor = () => {
    setInvestors([...investors, { name: '', headOfCompany: '', sector: '', country: '', amount: '', date: new Date().toISOString().split('T')[0] }]);
  };

  const removeInvestor = (index: number) => {
    const newInvestors = investors.filter((_, i) => i !== index);
    setInvestors(newInvestors);
  };

  const updateInvestor = (index: number, field: keyof typeof investors[0], value: string) => {
    const newInvestors = [...investors];
    newInvestors[index][field] = value;
    setInvestors(newInvestors);
  };

  const addTestimonial = () => {
    const id = Math.random().toString(36).substr(2, 9);
    setTestimonials([...testimonials, { id, name: '', position: '', statement: '', voiceType: 'minor' }]);
  };

  const removeTestimonial = (index: number) => {
    const newTestimonials = testimonials.filter((_, i) => i !== index);
    setTestimonials(newTestimonials);
  };

  const updateTestimonial = (index: number, field: keyof Testimonial, value: string) => {
    const newTestimonials = [...testimonials];
    (newTestimonials[index] as any)[field] = value;
    setTestimonials(newTestimonials);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
          />
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-4xl bg-white rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
          >
            <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-white sticky top-0 z-10">
              <div>
                <h3 className="text-2xl font-bold text-slate-900">{project ? 'Edit Project' : 'Add New Project'}</h3>
                <p className="text-slate-500 text-sm">{project ? 'Update the existing project details below.' : 'Fill in the comprehensive project details below.'}</p>
              </div>
              <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors"><X size={24} /></button>
            </div>

            <div className="p-8 overflow-y-auto">
              <form id="projectForm" onSubmit={handleSubmit} className="space-y-12">
                {/* Section 1: General Information */}
                <section className="space-y-6">
                  <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
                    <User className="text-emerald-600" size={20} />
                    <h4 className="font-bold text-slate-900 uppercase tracking-wider text-sm">General Information</h4>
                  </div>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Proponent</label>
                      <input name="proponent" type="text" defaultValue={project?.proponent} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none" placeholder="Organization or Individual" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Project Title</label>
                      <input name="title" type="text" defaultValue={project?.title} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none" placeholder="e.g. Community Health Center" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Project Status</label>
                      <select 
                        value={status}
                        onChange={(e) => setStatus(e.target.value as Project['status'])}
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none appearance-none cursor-pointer"
                      >
                        <option value="proposed">Proposed</option>
                        <option value="ongoing">Ongoing</option>
                        <option value="postponed">Postponed</option>
                        <option value="on hold">On Hold</option>
                        <option value="completed">Completed</option>
                      </select>
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">About the Proponent</label>
                      <textarea name="aboutProponent" rows={2} defaultValue={project?.aboutProponent} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none" placeholder="Brief background of the proponent..." />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Contact Person</label>
                      <input name="contactPerson" type="text" defaultValue={project?.contactPerson} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none" placeholder="Name and Designation" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Legal Status</label>
                      <input name="legalStatus" type="text" defaultValue={project?.legalStatus} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none" placeholder="e.g. Registered NGO, Government Unit" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Unit in Charge</label>
                      <input name="unitInCharge" type="text" defaultValue={project?.unitInCharge} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none" placeholder="e.g. Engineering Brigade" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Coordination Level</label>
                      <select 
                        name="coordinationLevel" 
                        defaultValue={project?.coordinationLevel || 'municipal'} 
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none appearance-none cursor-pointer"
                      >
                        <option value="municipal">Municipal</option>
                        <option value="provincial">Provincial</option>
                        <option value="regional">Regional</option>
                        <option value="national">National</option>
                      </select>
                    </div>
                    <div className="space-y-3 md:col-span-2">
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Project Category (Select all that apply)</label>
                      <div className="flex flex-wrap gap-2">
                        {categories.map((category) => (
                          <button
                            key={category}
                            type="button"
                            onClick={() => toggleCategory(category)}
                            className={`px-4 py-2 rounded-full text-sm font-bold transition-all border ${
                              selectedCategories.includes(category)
                                ? 'bg-emerald-600 border-emerald-600 text-white shadow-md shadow-emerald-600/20'
                                : 'bg-white border-slate-200 text-slate-600 hover:border-emerald-500 hover:text-emerald-600'
                            }`}
                          >
                            {category}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </section>

                {/* Section 2: Project Details */}
                <section className="space-y-6">
                  <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
                    <FileText className="text-emerald-600" size={20} />
                    <h4 className="font-bold text-slate-900 uppercase tracking-wider text-sm">Project Details</h4>
                  </div>
                  <div className="space-y-6">
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Objectives (Max 5)</label>
                        {objectives.length < 5 && (
                          <button 
                            type="button"
                            onClick={addObjective}
                            className="flex items-center gap-1 text-xs font-bold text-emerald-600 hover:text-emerald-700 transition-colors"
                          >
                            <Plus size={14} /> Add Objective
                          </button>
                        )}
                      </div>
                      <div className="space-y-3">
                        {objectives.map((obj, index) => (
                          <div key={index} className="flex gap-2">
                            <input 
                              type="text" 
                              value={obj}
                              onChange={(e) => updateObjective(index, e.target.value)}
                              className="flex-1 px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none" 
                              placeholder={`Objective ${index + 1}`} 
                            />
                            {objectives.length > 1 && (
                              <button 
                                type="button"
                                onClick={() => removeObjective(index)}
                                className="p-3 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                              >
                                <Trash2 size={18} />
                              </button>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Background of the Project</label>
                      <textarea name="background" rows={3} defaultValue={project?.background} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none" placeholder="Historical context or need for the project..." />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Project Description</label>
                      <textarea name="description" rows={4} defaultValue={project?.description} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none" placeholder="Detailed scope of work..." />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Policy of the project</label>
                      <textarea name="policy" rows={2} defaultValue={project?.policy} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none" placeholder="Guidelines and regulatory framework..." />
                    </div>
                  </div>
                </section>

                {/* Section 3: Implementation & Timeline */}
                <section className="space-y-6">
                  <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
                    <Clock className="text-emerald-600" size={20} />
                    <h4 className="font-bold text-slate-900 uppercase tracking-wider text-sm">Implementation & Timeline</h4>
                  </div>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Project Duration</label>
                      <input name="duration" type="number" defaultValue={project?.duration} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none" placeholder="e.g. 12" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Target start of Operation</label>
                      <input name="targetStart" type="date" defaultValue={project?.targetStart} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none" />
                    </div>
                    <div className="space-y-4 md:col-span-2">
                      <div className="flex justify-between items-center">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Project Stages / Phases</label>
                        <button 
                          type="button"
                          onClick={addStage}
                          className="flex items-center gap-1 text-xs font-bold text-emerald-600 hover:text-emerald-700 transition-colors"
                        >
                          <Plus size={14} /> Add Phase
                        </button>
                      </div>
                      <div className="space-y-4">
                        {stages.map((stage, index) => (
                          <div key={index} className="p-6 bg-slate-50 border border-slate-200 rounded-2xl space-y-4 relative group">
                            <div className="flex justify-between items-center">
                              <span className="text-xs font-bold text-emerald-600 uppercase tracking-widest">Phase {index + 1}</span>
                              {stages.length > 1 && (
                                <button 
                                  type="button"
                                  onClick={() => removeStage(index)}
                                  className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                                >
                                  <Trash2 size={16} />
                                </button>
                              )}
                            </div>
                            <div className="grid md:grid-cols-2 gap-4">
                              <div className="space-y-2">
                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Stage Name</label>
                                <input 
                                  type="text" 
                                  value={stage.name}
                                  onChange={(e) => updateStage(index, 'name', e.target.value)}
                                  className="w-full px-4 py-2 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none text-sm" 
                                  placeholder="e.g. Planning & Design" 
                                />
                              </div>
                              <div className="space-y-2">
                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Duration</label>
                                <input 
                                  type="number" 
                                  value={stage.duration}
                                  onChange={(e) => updateStage(index, 'duration', e.target.value)}
                                  className="w-full px-4 py-2 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none text-sm" 
                                  placeholder="e.g. 2" 
                                />
                              </div>
                              <div className="space-y-2 md:col-span-2">
                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Deliverables</label>
                                <textarea 
                                  rows={2}
                                  value={stage.deliverables}
                                  onChange={(e) => updateStage(index, 'deliverables', e.target.value)}
                                  className="w-full px-4 py-2 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none text-sm" 
                                  placeholder="List the key outputs for this stage..." 
                                />
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Implementing partner</label>
                      <input name="implementingPartner" type="text" defaultValue={project?.implementingPartner} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none" placeholder="Partner agencies or groups" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Implementing Mechanism</label>
                      <input name="implementingMechanism" type="text" defaultValue={project?.implementingMechanism} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none" placeholder="e.g. Direct Labor, Contract" />
                    </div>
                  </div>
                </section>

                {/* Section 4: Scope & Location */}
                <section className="space-y-6">
                  <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
                    <MapPin className="text-emerald-600" size={20} />
                    <h4 className="font-bold text-slate-900 uppercase tracking-wider text-sm">Scope & Location</h4>
                  </div>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Project Location</label>
                      <input name="location" type="text" defaultValue={project?.location} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none" placeholder="City, Province" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Area Coverage</label>
                      <input name="areaCoverage" type="number" defaultValue={project?.areaCoverage} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none" placeholder="e.g. 5" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Longitude</label>
                      <input name="longitude" type="text" defaultValue={project?.coordinates?.[0] ?? (project as any)?.longitude} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none" placeholder="0.0000" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Latitude</label>
                      <input name="latitude" type="text" defaultValue={project?.coordinates?.[1] ?? (project as any)?.latitude} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none" placeholder="0.0000" />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Project Beneficiaries</label>
                      <textarea name="beneficiaries" rows={2} defaultValue={project?.beneficiaries} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none" placeholder="Who will benefit from this project?" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Number of Beneficiaries</label>
                      <input name="beneficiariesCount" type="number" defaultValue={project?.beneficiariesCount} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none" placeholder="e.g. 1000" />
                    </div>
                  </div>
                </section>

                {/* Section 5: Financials */}
                <section className="space-y-6">
                  <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
                    <DollarSign className="text-emerald-600" size={20} />
                    <h4 className="font-bold text-slate-900 uppercase tracking-wider text-sm">Financials</h4>
                  </div>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Project Estimate</label>
                      <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-slate-400">₱</span>
                        <input name="budget" type="number" defaultValue={project?.budget?.toString().replace('₱', '').replace(/,/g, '')} className="w-full pl-8 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none" placeholder="0.00" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Funding Gap</label>
                      <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-slate-400">₱</span>
                        <input name="investorGoal" type="number" defaultValue={project?.investorGoal?.toString().replace('₱', '').replace(/,/g, '')} className="w-full pl-8 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none" placeholder="0.00" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Funding Progress</label>
                      <div className="relative">
                        <span className="absolute right-4 top-1/2 -translate-y-1/2 font-bold text-slate-400">%</span>
                        <input name="currentFunding" type="number" defaultValue={project?.currentFunding} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none" placeholder="e.g. 45" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Impact Percentage</label>
                      <div className="relative">
                        <span className="absolute right-4 top-1/2 -translate-y-1/2 font-bold text-slate-400">%</span>
                        <input name="impactPercentage" type="number" defaultValue={project?.impactPercentage} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none" placeholder="e.g. 85" />
                      </div>
                    </div>
                  </div>
                </section>

                {/* Section 6: Investors */}
                <section className="space-y-6">
                  <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
                    <Handshake className="text-emerald-600" size={20} />
                    <h4 className="font-bold text-slate-900 uppercase tracking-wider text-sm">Investors</h4>
                  </div>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Project Investors</label>
                      <button 
                        type="button"
                        onClick={addInvestor}
                        className="flex items-center gap-1 text-xs font-bold text-emerald-600 hover:text-emerald-700 transition-colors"
                      >
                        <Plus size={14} /> Add Investor
                      </button>
                    </div>
                    <div className="space-y-4">
                      {investors.map((investor, index) => (
                        <div key={index} className="p-6 bg-slate-50 border border-slate-200 rounded-2xl space-y-4 relative group">
                          <div className="flex justify-between items-center">
                            <span className="text-xs font-bold text-emerald-600 uppercase tracking-widest">Investor {index + 1}</span>
                            <button 
                              type="button"
                              onClick={() => removeInvestor(index)}
                              className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                          <div className="grid md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Company Name</label>
                              <input 
                                type="text" 
                                value={investor.name}
                                onChange={(e) => updateInvestor(index, 'name', e.target.value)}
                                className="w-full px-4 py-2 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none text-sm" 
                                placeholder="Name of the Company" 
                              />
                            </div>
                            <div className="space-y-2">
                              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Head of Company</label>
                              <input 
                                type="text" 
                                value={investor.headOfCompany}
                                onChange={(e) => updateInvestor(index, 'headOfCompany', e.target.value)}
                                className="w-full px-4 py-2 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none text-sm" 
                                placeholder="CEO / Manager / Head" 
                              />
                            </div>
                            <div className="space-y-2">
                              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Sector</label>
                              <input 
                                type="text" 
                                value={investor.sector}
                                onChange={(e) => updateInvestor(index, 'sector', e.target.value)}
                                className="w-full px-4 py-2 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none text-sm" 
                                placeholder="e.g. Technology, Finance, Agriculture" 
                              />
                            </div>
                            <div className="space-y-2">
                              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Country</label>
                              <input 
                                type="text" 
                                value={investor.country}
                                onChange={(e) => updateInvestor(index, 'country', e.target.value)}
                                className="w-full px-4 py-2 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none text-sm" 
                                placeholder="Country of Origin" 
                              />
                            </div>
                            <div className="space-y-2">
                              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Amount to be Donated</label>
                              <div className="relative">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 font-bold text-slate-400 text-xs">₱</span>
                                <input 
                                  type="number" 
                                  value={investor.amount}
                                  onChange={(e) => updateInvestor(index, 'amount', e.target.value)}
                                  className="w-full pl-7 pr-4 py-2 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none text-sm" 
                                  placeholder="0.00" 
                                />
                              </div>
                            </div>
                            <div className="space-y-2">
                              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Date of Donation</label>
                              <input 
                                type="date" 
                                value={investor.date}
                                onChange={(e) => updateInvestor(index, 'date', e.target.value)}
                                className="w-full px-4 py-2 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none text-sm" 
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                      {investors.length === 0 && (
                        <div className="text-center py-8 bg-slate-50 border-2 border-dashed border-slate-200 rounded-2xl">
                          <p className="text-sm text-slate-400 font-medium">No investors added yet.</p>
                        </div>
                      )}
                    </div>
                  </div>
                </section>

                {/* Section 6: Media Uploads */}
                <section className="space-y-6">
                  <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
                    <ImageIcon className="text-emerald-600" size={20} />
                    <h4 className="font-bold text-slate-900 uppercase tracking-wider text-sm">Media Uploads</h4>
                  </div>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Proposed Project Image</label>
                      </div>
                      <div className="relative group">
                        <input 
                          type="file" 
                          accept="image/*"
                          onChange={(e) => setFiles(prev => ({ ...prev, proposed: e.target.files?.[0] || null }))}
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" 
                        />
                        <div className="w-full px-4 py-8 bg-slate-50 border-2 border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center gap-2 group-hover:border-emerald-500 transition-colors">
                          <Upload className="text-slate-400 group-hover:text-emerald-500 transition-colors" size={24} />
                          <span className="text-sm font-bold text-slate-500">
                            {files.proposed ? files.proposed.name : 'Upload Project Image'}
                          </span>
                          <span className="text-[10px] text-slate-400 uppercase">JPG, PNG up to 5MB</span>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Beneficiaries Project Image</label>
                      </div>
                      <div className="relative group">
                        <input 
                          type="file" 
                          accept="image/*"
                          onChange={(e) => setFiles(prev => ({ ...prev, beneficiaries: e.target.files?.[0] || null }))}
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" 
                        />
                        <div className="w-full px-4 py-8 bg-slate-50 border-2 border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center gap-2 group-hover:border-emerald-500 transition-colors">
                          <Upload className="text-slate-400 group-hover:text-emerald-500 transition-colors" size={24} />
                          <span className="text-sm font-bold text-slate-500">
                            {files.beneficiaries ? files.beneficiaries.name : 'Upload Beneficiaries Image'}
                          </span>
                          <span className="text-[10px] text-slate-400 uppercase">JPG, PNG up to 5MB</span>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Project Proposal File</label>
                      </div>
                      <div className="relative group">
                        <input 
                          type="file" 
                          accept=".pdf,.doc,.docx"
                          onChange={(e) => setFiles(prev => ({ ...prev, proposal: e.target.files?.[0] || null }))}
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" 
                        />
                        <div className="w-full px-4 py-8 bg-slate-50 border-2 border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center gap-2 group-hover:border-emerald-500 transition-colors">
                          <FileText className="text-slate-400 group-hover:text-emerald-500 transition-colors" size={24} />
                          <span className="text-sm font-bold text-slate-500">
                            {files.proposal ? files.proposal.name : 'Upload Project Proposal'}
                          </span>
                          <span className="text-[10px] text-slate-400 uppercase">PDF, DOC up to 10MB</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </section>

                {/* Section 7: Testimonials */}
                <section className="space-y-6">
                  <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
                    <MessageSquareQuote className="text-emerald-600" size={20} />
                    <h4 className="font-bold text-slate-900 uppercase tracking-wider text-sm">Testimonials</h4>
                  </div>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Project Testimonials</label>
                      <button 
                        type="button"
                        onClick={addTestimonial}
                        className="flex items-center gap-1 text-xs font-bold text-emerald-600 hover:text-emerald-700 transition-colors"
                      >
                        <Plus size={14} /> Add Testimonial
                      </button>
                    </div>
                    <div className="space-y-4">
                      {testimonials.map((testimonial, index) => (
                        <div key={testimonial.id} className="p-6 bg-slate-50 border border-slate-200 rounded-2xl space-y-4 relative group">
                          <div className="flex justify-between items-center">
                            <span className="text-xs font-bold text-emerald-600 uppercase tracking-widest">Testimony {index + 1}</span>
                            <button 
                              type="button"
                              onClick={() => removeTestimonial(index)}
                              className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                          <div className="grid md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Name</label>
                              <input 
                                type="text" 
                                value={testimonial.name}
                                onChange={(e) => updateTestimonial(index, 'name', e.target.value)}
                                className="w-full px-4 py-2 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none text-sm" 
                                placeholder="Name of the person" 
                              />
                            </div>
                            <div className="space-y-2">
                              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Position</label>
                              <input 
                                type="text" 
                                value={testimonial.position}
                                onChange={(e) => updateTestimonial(index, 'position', e.target.value)}
                                className="w-full px-4 py-2 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none text-sm" 
                                placeholder="Position / Designation" 
                              />
                            </div>
                            <div className="space-y-2 md:col-span-2">
                              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Statement</label>
                              <textarea 
                                rows={3}
                                value={testimonial.statement}
                                onChange={(e) => updateTestimonial(index, 'statement', e.target.value)}
                                className="w-full px-4 py-2 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none text-sm" 
                                placeholder="What did they say about the project?" 
                              />
                            </div>
                            <div className="space-y-2">
                              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Voice Classification</label>
                              <div className="flex gap-2">
                                {(['minor', 'major'] as const).map((type) => (
                                  <button
                                    key={type}
                                    type="button"
                                    onClick={() => updateTestimonial(index, 'voiceType', type)}
                                    className={`flex-1 py-2 rounded-xl text-xs font-bold capitalize transition-all border ${
                                      testimonial.voiceType === type
                                        ? 'bg-emerald-600 border-emerald-600 text-white'
                                        : 'bg-white border-slate-200 text-slate-600 hover:border-emerald-500'
                                    }`}
                                  >
                                    {type} Voice
                                  </button>
                                ))}
                              </div>
                            </div>
                            <div className="space-y-2">
                              <div className="flex justify-between items-center">
                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Photo</label>
                              </div>
                              <div className="relative group/photo">
                                <input 
                                  type="file" 
                                  accept="image/*"
                                  onChange={(e) => setTestimonialFiles(prev => ({ ...prev, [testimonial.id]: e.target.files?.[0] || null }))}
                                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" 
                                />
                                <div className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl flex items-center gap-3 group-hover/photo:border-emerald-500 transition-colors">
                                  <Upload className="text-slate-400 group-hover/photo:text-emerald-500 transition-colors" size={16} />
                                  <span className="text-xs font-bold text-slate-500">
                                    {testimonialFiles[testimonial.id] ? testimonialFiles[testimonial.id]?.name : 'Upload Photo'}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                      {testimonials.length === 0 && (
                        <div className="text-center py-8 bg-slate-50 border-2 border-dashed border-slate-200 rounded-2xl">
                          <p className="text-sm text-slate-400 font-medium">No testimonials added yet.</p>
                        </div>
                      )}
                    </div>
                  </div>
                </section>
              </form>
            </div>

            <div className="p-8 bg-slate-50 border-t border-slate-100 flex justify-end gap-4 sticky bottom-0 z-10">
              <button type="button" onClick={onClose} className="px-6 py-3 text-slate-600 font-bold hover:text-slate-900 transition-colors">Cancel</button>
              <button 
                type="submit"
                form="projectForm"
                disabled={isSubmitting}
                className="px-8 py-3 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-600/20 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    Submitting...
                  </>
                ) : (
                  project ? 'Update Project' : 'Create Project'
                )}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
