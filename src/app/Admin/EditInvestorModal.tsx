import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Building2, Globe, TrendingUp, Image as ImageIcon, Upload, Save, Plus, Trash2, User } from 'lucide-react';
import { Investor, Project, cn } from '../../constants';
import { auth, handleFirestoreError, OperationType, uploadFile } from '../../lib/firebase';
import { Loader2 } from 'lucide-react';

interface EditInvestorModalProps {
  isOpen: boolean;
  onClose: () => void;
  investor: Investor;
  onUpdate: (updatedInvestor: Investor) => void;
  projects: Project[];
}

export const EditInvestorModal: React.FC<EditInvestorModalProps> = ({ isOpen, onClose, investor, onUpdate, projects }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [headPhotoFile, setHeadPhotoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string>(investor.image || '');
  const [headPhotoPreview, setHeadPhotoPreview] = useState<string>(investor.headOfCompanyPhoto || '');

  const [formData, setFormData] = useState<Investor>({
    ...investor,
    investments: investor.investments || []
  });

  useEffect(() => {
    // Derive current investments from projects if the investor doesn't have an explicit investments array
    const derivedInvestments = (projects || [])
      .filter(project => project.investors?.some(inv => inv.name === investor.name))
      .map(project => {
        const contribution = project.investors?.find(inv => inv.name === investor.name);
        return {
          projectId: project.id,
          projectName: project.title,
          status: project.status,
          amount: contribution?.amount || '0',
          date: contribution?.date || 'N/A'
        };
      });

    setFormData({
      ...investor,
      investments: investor.investments && investor.investments.length > 0 
        ? investor.investments 
        : derivedInvestments
    });
  }, [investor, projects]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };


  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, field: 'image' | 'headOfCompanyPhoto') => {
    const file = e.target.files?.[0];
    if (file) {
      if (field === 'image') {
        setLogoFile(file);
        setLogoPreview(URL.createObjectURL(file));
      } else {
        setHeadPhotoFile(file);
        setHeadPhotoPreview(URL.createObjectURL(file));
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      let logoUrl = formData.image || '';
      let headPhotoUrl = formData.headOfCompanyPhoto || '';

      if (logoFile) {
        logoUrl = await uploadFile(logoFile, 'pending_approval/investors/logos');
      }
      if (headPhotoFile) {
        headPhotoUrl = await uploadFile(headPhotoFile, 'pending_approval/investors/heads');
      }

      const finalData = {
        ...formData,
        image: logoUrl,
        headOfCompanyPhoto: headPhotoUrl
      };

      onUpdate(finalData);
      onClose();
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `investors/${investor.id}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const addInvestment = () => {
    const newInvestment = {
      projectId: '',
      projectName: '',
      status: 'ongoing',
      amount: '',
      date: new Date().toISOString().split('T')[0]
    };
    setFormData(prev => ({
      ...prev,
      investments: [...(prev.investments || []), newInvestment]
    }));
  };

  const removeInvestment = (index: number) => {
    setFormData(prev => ({
      ...prev,
      investments: prev.investments?.filter((_, i) => i !== index)
    }));
  };

  const updateInvestment = (index: number, field: string, value: string) => {
    setFormData(prev => {
      const newInvestments = [...(prev.investments || [])];
      if (field === 'projectId') {
        const project = (projects || []).find(p => p.id === value);
        newInvestments[index] = { 
          ...newInvestments[index], 
          projectId: value, 
          projectName: project?.title || '' 
        };
      } else {
        newInvestments[index] = { ...newInvestments[index], [field]: value };
      }
      return { ...prev, investments: newInvestments };
    });
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
            className="relative w-full max-w-2xl bg-white rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
          >
            <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-white sticky top-0 z-10">
              <div>
                <h3 className="text-2xl font-bold text-slate-900">Update Investor</h3>
                <p className="text-slate-500 text-sm">Modify the investor's profile information.</p>
              </div>
              <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                <X size={24} />
              </button>
            </div>

            <div className="p-8 overflow-y-auto">
              <form id="edit-investor-form" onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Investor Name</label>
                    <input 
                      type="text" 
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none" 
                      placeholder="Company Name" 
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Sector</label>
                    <input 
                      type="text" 
                      name="sector"
                      value={formData.sector}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none" 
                      placeholder="e.g. Infrastructure, Health" 
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Country</label>
                    <input 
                      type="text" 
                      name="country"
                      value={formData.country}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none" 
                      placeholder="Country" 
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Status</label>
                    <select 
                      name="status"
                      value={formData.status}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none appearance-none cursor-pointer"
                    >
                      <option value="verified">Verified</option>
                      <option value="pending">Pending</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Total Invested</label>
                    <input 
                      type="text" 
                      name="totalInvested"
                      value={formData.totalInvested}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none" 
                      placeholder="₱0.00" 
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Projects Count</label>
                    <input 
                      type="number" 
                      name="projectsCount"
                      value={formData.projectsCount}
                      onChange={(e) => setFormData(prev => ({ ...prev, projectsCount: parseInt(e.target.value) || 0 }))}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none" 
                    />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Head of Company</label>
                    <input 
                      type="text" 
                      name="headOfCompany"
                      value={formData.headOfCompany || ''}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none" 
                      placeholder="Name of CEO / Manager" 
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Invested Projects</label>
                    <button 
                      type="button"
                      onClick={addInvestment}
                      className="flex items-center gap-1 text-xs font-bold text-emerald-600 hover:text-emerald-700 transition-colors"
                    >
                      <Plus size={14} /> Add Investment
                    </button>
                  </div>
                  <div className="space-y-4">
                    {formData.investments?.map((inv, index) => (
                      <div key={index} className="p-6 bg-slate-50 border border-slate-200 rounded-2xl space-y-4 relative group">
                        <div className="flex justify-between items-center">
                          <span className="text-xs font-bold text-emerald-600 uppercase tracking-widest">Investment {index + 1}</span>
                          <button 
                            type="button"
                            onClick={() => removeInvestment(index)}
                            className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                        <div className="grid md:grid-cols-2 gap-4">
                          <div className="space-y-2 md:col-span-2">
                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Project</label>
                            <select 
                              value={inv.projectId}
                              onChange={(e) => updateInvestment(index, 'projectId', e.target.value)}
                              className="w-full px-4 py-2 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none text-sm appearance-none cursor-pointer"
                            >
                              <option value="">Select a Project</option>
                              {(projects || []).map(p => (
                                <option key={p.id} value={p.id}>{p.title}</option>
                              ))}
                            </select>
                          </div>
                          <div className="space-y-2">
                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Status</label>
                            <select 
                              value={inv.status}
                              onChange={(e) => updateInvestment(index, 'status', e.target.value)}
                              className="w-full px-4 py-2 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none text-sm appearance-none cursor-pointer"
                            >
                              <option value="proposed">Proposed</option>
                              <option value="ongoing">Ongoing</option>
                              <option value="postponed">Postponed</option>
                              <option value="on hold">On Hold</option>
                              <option value="completed">Completed</option>
                            </select>
                          </div>
                          <div className="space-y-2">
                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Amount Invested</label>
                            <div className="relative">
                              <span className="absolute left-3 top-1/2 -translate-y-1/2 font-bold text-slate-400 text-xs">₱</span>
                              <input 
                                type="text" 
                                value={inv.amount}
                                onChange={(e) => updateInvestment(index, 'amount', e.target.value)}
                                className="w-full pl-7 pr-4 py-2 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none text-sm" 
                                placeholder="0.00" 
                              />
                            </div>
                          </div>
                          <div className="space-y-2">
                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Date of Investment</label>
                            <input 
                              type="date" 
                              value={inv.date}
                              onChange={(e) => updateInvestment(index, 'date', e.target.value)}
                              className="w-full px-4 py-2 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none text-sm" 
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Background</label>
                  <textarea 
                    name="background"
                    value={formData.background}
                    onChange={handleChange}
                    rows={4}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none" 
                    placeholder="Investor background information..." 
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Company Photo / Logo</label>
                  </div>
                  <div className="flex flex-col gap-4">
                    <div className="flex gap-4 items-center">
                      <div className="w-20 h-20 rounded-2xl bg-slate-100 flex-shrink-0 overflow-hidden border border-slate-200 shadow-inner">
                        {logoPreview ? (
                          <img src={logoPreview} alt="Preview" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-slate-400">
                            <ImageIcon size={32} />
                          </div>
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="relative">
                          <input 
                            type="file" 
                            accept="image/*"
                            onChange={(e) => handleFileUpload(e, 'image')}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                          />
                          <div className="flex items-center justify-center gap-2 px-4 py-3 bg-emerald-50 border-2 border-dashed border-emerald-200 rounded-xl text-emerald-700 font-bold text-sm hover:bg-emerald-100 transition-colors">
                            <Upload size={18} />
                            Upload from Device
                          </div>
                        </div>
                        <p className="text-[10px] text-slate-400 mt-2 uppercase text-center tracking-wider">Recommended: Square image, max 5MB</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Head of Company Photo</label>
                  </div>
                  <div className="flex flex-col gap-4">
                    <div className="flex gap-4 items-center">
                      <div className="w-20 h-20 rounded-2xl bg-slate-100 flex-shrink-0 overflow-hidden border border-slate-200 shadow-inner">
                        {headPhotoPreview ? (
                          <img src={headPhotoPreview} alt="Head Preview" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-slate-400">
                            <User size={32} />
                          </div>
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="relative">
                          <input 
                            type="file" 
                            accept="image/*"
                            onChange={(e) => handleFileUpload(e, 'headOfCompanyPhoto')}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                          />
                          <div className="flex items-center justify-center gap-2 px-4 py-3 bg-emerald-50 border-2 border-dashed border-emerald-200 rounded-xl text-emerald-700 font-bold text-sm hover:bg-emerald-100 transition-colors">
                            <Upload size={18} />
                            Upload from Device
                          </div>
                        </div>
                        <p className="text-[10px] text-slate-400 mt-2 uppercase text-center tracking-wider">Recommended: Portrait image, max 5MB</p>
                      </div>
                    </div>
                  </div>
                </div>
              </form>
            </div>

            <div className="p-8 bg-slate-50 border-t border-slate-100 flex justify-end gap-4 sticky bottom-0 z-10">
              <button onClick={onClose} className="px-6 py-3 text-slate-600 font-bold hover:text-slate-900 transition-colors">
                Cancel
              </button>
              <button 
                type="submit"
                form="edit-investor-form"
                disabled={isSubmitting}
                className="flex items-center gap-2 px-8 py-3 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-600/20 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    Updating...
                  </>
                ) : (
                  <>
                    <Save size={18} />
                    Update Data
                  </>
                )}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
