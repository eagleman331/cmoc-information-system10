import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Loader2, Plus, Trash2, Building2, Globe, User, Briefcase, FileText, Image as ImageIcon } from 'lucide-react';
import { Investor, cn } from '../../constants';
import { db, collection, addDoc, serverTimestamp, handleFirestoreError, OperationType, auth, uploadFile } from '../../lib/firebase';

interface AddInvestorModalProps {
  isOpen: boolean;
  onClose: () => void;
  investor?: Investor;
}

export const AddInvestorModal: React.FC<AddInvestorModalProps> = ({ isOpen, onClose, investor }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [headPhotoFile, setHeadPhotoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string>(investor?.image || '');
  const [headPhotoPreview, setHeadPhotoPreview] = useState<string>(investor?.headOfCompanyPhoto || '');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'logo' | 'head') => {
    const file = e.target.files?.[0];
    if (file) {
      if (type === 'logo') {
        setLogoFile(file);
        setLogoPreview(URL.createObjectURL(file));
      } else {
        setHeadPhotoFile(file);
        setHeadPhotoPreview(URL.createObjectURL(file));
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    setIsSubmitting(true);

    try {
      let logoUrl = investor?.image || '';
      let headPhotoUrl = investor?.headOfCompanyPhoto || '';

      if (logoFile) {
        logoUrl = await uploadFile(logoFile, 'pending_approval/investors/logos');
      }
      if (headPhotoFile) {
        headPhotoUrl = await uploadFile(headPhotoFile, 'pending_approval/investors/heads');
      }

      const formData = new FormData(form);
      const data = {
        name: formData.get('name'),
        sector: formData.get('sector'),
        country: formData.get('country'),
        status: formData.get('status') || 'pending',
        background: formData.get('background'),
        totalInvested: formData.get('totalInvested') || '₱0',
        projectsCount: Number(formData.get('projectsCount')) || 0,
        headOfCompany: formData.get('headOfCompany'),
        image: logoUrl,
        headOfCompanyPhoto: headPhotoUrl,
      };

      await addDoc(collection(db, 'pending_approvals'), {
        type: investor ? 'UPDATE_INVESTOR' : 'CREATE_INVESTOR',
        targetId: investor?.id || null,
        data,
        status: 'pending',
        requestedBy: auth.currentUser?.uid || 'anonymous',
        requestedAt: serverTimestamp(),
      });

      onClose();
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, 'pending_approvals');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="bg-white rounded-[2.5rem] w-full max-w-2xl max-h-[90vh] overflow-hidden shadow-2xl flex flex-col"
        >
          {/* Header */}
          <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
            <div>
              <h2 className="text-2xl font-bold text-slate-900">{investor ? 'Edit Investor' : 'Add New Investor'}</h2>
              <p className="text-slate-500 text-sm">Submit investor details for manager approval.</p>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-full transition-colors">
              <X size={24} />
            </button>
          </div>

          {/* Form */}
          <form id="investorForm" onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-8 space-y-8">
            {/* Basic Info */}
            <section className="space-y-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                  <Building2 size={20} />
                </div>
                <h3 className="font-bold text-slate-900 uppercase tracking-widest text-sm">Company Information</h3>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">Company Name</label>
                  <input
                    name="name"
                    defaultValue={investor?.name}
                    required
                    className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all"
                    placeholder="e.g. Global Dev Corp"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">Sector</label>
                  <input
                    name="sector"
                    defaultValue={investor?.sector}
                    required
                    className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all"
                    placeholder="e.g. Infrastructure & Energy"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">Country</label>
                  <input
                    name="country"
                    defaultValue={investor?.country}
                    required
                    className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all"
                    placeholder="e.g. Singapore"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">Status</label>
                  <select
                    name="status"
                    defaultValue={investor?.status || 'pending'}
                    className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all"
                  >
                    <option value="pending">Pending Verification</option>
                    <option value="verified">Verified</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">Company Background</label>
                <textarea
                  name="background"
                  defaultValue={investor?.background}
                  rows={4}
                  className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all resize-none"
                  placeholder="Describe the company's focus and history..."
                />
              </div>
            </section>

            {/* Leadership & Media */}
            <section className="space-y-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg">
                  <User size={20} />
                </div>
                <h3 className="font-bold text-slate-900 uppercase tracking-widest text-sm">Leadership & Media</h3>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">Head of Company</label>
                  <input
                    name="headOfCompany"
                    defaultValue={investor?.headOfCompany}
                    className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all"
                    placeholder="e.g. Dr. Sarah Chen"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">Company Logo</label>
                  <div className="flex items-center gap-4">
                    {logoPreview && (
                      <div className="w-12 h-12 rounded-xl border border-slate-200 overflow-hidden bg-white flex-shrink-0">
                        <img src={logoPreview} alt="Logo Preview" className="w-full h-full object-contain" referrerPolicy="no-referrer" />
                      </div>
                    )}
                    <div className="relative flex-1">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleFileChange(e, 'logo')}
                        className="hidden"
                        id="logo-upload"
                      />
                      <label
                        htmlFor="logo-upload"
                        className="flex items-center gap-2 px-5 py-3 bg-slate-50 border border-slate-200 rounded-2xl cursor-pointer hover:bg-slate-100 transition-all text-slate-500 text-sm"
                      >
                        <ImageIcon size={18} />
                        {logoFile ? logoFile.name : 'Choose Logo File'}
                      </label>
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">Head Photo</label>
                  <div className="flex items-center gap-4">
                    {headPhotoPreview && (
                      <div className="w-12 h-12 rounded-xl border border-slate-200 overflow-hidden bg-white flex-shrink-0">
                        <img src={headPhotoPreview} alt="Head Preview" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                      </div>
                    )}
                    <div className="relative flex-1">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleFileChange(e, 'head')}
                        className="hidden"
                        id="head-upload"
                      />
                      <label
                        htmlFor="head-upload"
                        className="flex items-center gap-2 px-5 py-3 bg-slate-50 border border-slate-200 rounded-2xl cursor-pointer hover:bg-slate-100 transition-all text-slate-500 text-sm"
                      >
                        <ImageIcon size={18} />
                        {headPhotoFile ? headPhotoFile.name : 'Choose Head Photo'}
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Investment Stats */}
            <section className="space-y-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-purple-50 text-purple-600 rounded-lg">
                  <Briefcase size={20} />
                </div>
                <h3 className="font-bold text-slate-900 uppercase tracking-widest text-sm">Investment Summary</h3>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">Total Invested (Amount)</label>
                  <input
                    name="totalInvested"
                    defaultValue={investor?.totalInvested}
                    className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all"
                    placeholder="e.g. ₱50,000,000"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">Projects Count</label>
                  <input
                    name="projectsCount"
                    type="number"
                    defaultValue={investor?.projectsCount}
                    className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all"
                    placeholder="0"
                  />
                </div>
              </div>
            </section>
          </form>

          {/* Footer */}
          <div className="p-8 border-t border-slate-100 bg-slate-50/50 flex justify-end gap-4">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 rounded-2xl font-bold text-slate-600 hover:bg-slate-200 transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              form="investorForm"
              disabled={isSubmitting}
              className="px-8 py-3 bg-emerald-600 text-white rounded-2xl font-bold hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-200 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <Loader2 size={20} className="animate-spin" />
                  Submitting...
                </>
              ) : (
                'Submit for Approval'
              )}
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
