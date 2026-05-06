import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  Users, 
  Building2, 
  TrendingUp, 
  Plus, 
  BarChart3,
  Briefcase,
  ShieldCheck,
  MessageSquare,
  Loader2,
  Lock
} from 'lucide-react';
import { Project, Investor, User, PendingUpdate, cn } from '../../constants';
import { 
  db, 
  auth,
  onAuthStateChanged,
  getDoc,
  collection, 
  onSnapshot, 
  query, 
  where,
  orderBy, 
  doc, 
  updateDoc, 
  deleteDoc, 
  addDoc,
  serverTimestamp,
  handleFirestoreError, 
  OperationType,
  moveFile
} from '../../lib/firebase';
import { OverviewTab } from './OverviewTab';
import { ProjectsTab } from './ProjectsTab';
import { InvestorsTab } from './InvestorsTab';
import { InvestorDetail } from './InvestorDetail';
import { UsersTab } from './UsersTab';
import { ApprovalsTab } from './ApprovalsTab';
import { InquiriesTab } from './InquiriesTab';
import { AddProjectModal } from './AddProjectModal';
import { AddUserModal } from './AddUserModal';
import { AddInvestorModal } from './AddInvestorModal';

type AdminTab = 'overview' | 'projects' | 'investors' | 'inquiries' | 'users' | 'approvals';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState<AdminTab>('overview');
  const [projects, setProjects] = useState<Project[]>([]);
  const [investors, setInvestors] = useState<Investor[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [inquiries, setInquiries] = useState<any[]>([]);
  const [pendingUpdates, setPendingUpdates] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);
  const [showAddProject, setShowAddProject] = useState(false);
  const [showAddUser, setShowAddUser] = useState(false);
  const [showAddInvestor, setShowAddInvestor] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | undefined>(undefined);
  const [editingInvestor, setEditingInvestor] = useState<Investor | undefined>(undefined);
  const [selectedInvestor, setSelectedInvestor] = useState<Investor | null>(null);

  useEffect(() => {
    // Always allow access for now as requested
    setIsAuthorized(true);
    
    // Attach listeners regardless of auth state
    const unsubProjects = onSnapshot(collection(db, 'projects'), (snapshot) => {
      const projectsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Project));
      setProjects(projectsData);
    }, (error) => handleFirestoreError(error, OperationType.GET, 'projects'));

    const unsubInvestors = onSnapshot(collection(db, 'investors'), (snapshot) => {
      const investorsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Investor));
      setInvestors(investorsData);
    }, (error) => handleFirestoreError(error, OperationType.GET, 'investors'));

    const unsubUsers = onSnapshot(collection(db, 'users'), (snapshot) => {
      const usersData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setUsers(usersData);
    }, (error) => handleFirestoreError(error, OperationType.GET, 'users'));

    const unsubInquiries = onSnapshot(collection(db, 'message_inquiries'), (snapshot) => {
      const inquiriesData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setInquiries(inquiriesData);
    }, (error) => handleFirestoreError(error, OperationType.GET, 'message_inquiries'));

    const unsubApprovals = onSnapshot(
      query(
        collection(db, 'pending_approvals'), 
        where('status', '==', 'pending'),
        orderBy('requestedAt', 'desc')
      ), 
      (snapshot) => {
        const approvalsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setPendingUpdates(approvalsData);
        setIsLoading(false);
      }, 
      (error) => handleFirestoreError(error, OperationType.GET, 'pending_approvals')
    );

    return () => {
      unsubProjects();
      unsubInvestors();
      unsubUsers();
      unsubInquiries();
      unsubApprovals();
    };
  }, []);

  const handleEditProject = (project: Project) => {
    setEditingProject(project);
    setShowAddProject(true);
  };

  const handleUpdateInvestor = async (updatedInvestor: Investor) => {
    try {
      await addDoc(collection(db, 'pending_approvals'), {
        type: 'UPDATE_INVESTOR',
        targetId: updatedInvestor.id,
        data: {
          name: updatedInvestor.name,
          sector: updatedInvestor.sector,
          country: updatedInvestor.country,
          status: updatedInvestor.status,
          background: updatedInvestor.background,
          totalInvested: updatedInvestor.totalInvested,
          projectsCount: updatedInvestor.projectsCount,
          headOfCompany: updatedInvestor.headOfCompany,
          image: updatedInvestor.image,
          headOfCompanyPhoto: updatedInvestor.headOfCompanyPhoto,
          investments: updatedInvestor.investments || []
        },
        status: 'pending',
        requestedBy: auth.currentUser?.uid || 'anonymous',
        requestedAt: serverTimestamp()
      });
      setSelectedInvestor(null); // Go back to list after submitting update
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, 'pending_approvals');
    }
  };

  const handleAddUser = async (userData: any) => {
    try {
      await addDoc(collection(db, 'pending_approvals'), {
        type: 'CREATE_USER',
        data: { ...userData, status: 'active', createdAt: new Date().toISOString() },
        status: 'pending',
        requestedBy: auth.currentUser?.uid || 'anonymous',
        requestedAt: serverTimestamp()
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, 'pending_approvals');
    }
  };

  const handleDeleteUser = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'users', id));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `users/${id}`);
    }
  };

  const handleDeleteProject = async (project: Project) => {
    try {
      await addDoc(collection(db, 'pending_approvals'), {
        type: 'DELETE_PROJECT',
        targetId: project.id,
        data: { title: project.title },
        status: 'pending',
        requestedBy: auth.currentUser?.uid || 'anonymous',
        requestedAt: serverTimestamp()
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, 'pending_approvals');
    }
  };

  const handleDeleteInvestor = async (investor: Investor) => {
    try {
      await addDoc(collection(db, 'pending_approvals'), {
        type: 'DELETE_INVESTOR',
        targetId: investor.id,
        data: { name: investor.name },
        status: 'pending',
        requestedBy: auth.currentUser?.uid || 'anonymous',
        requestedAt: serverTimestamp()
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, 'pending_approvals');
    }
  };

  const handleUpdateUserRole = async (id: string, role: string) => {
    try {
      await addDoc(collection(db, 'pending_approvals'), {
        type: 'UPDATE_USER_ROLE',
        targetId: id,
        data: { role },
        status: 'pending',
        requestedBy: auth.currentUser?.uid || 'anonymous',
        requestedAt: serverTimestamp()
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, 'pending_approvals');
    }
  };

  const handleApproveUpdate = async (approval: any) => {
    try {
      const data = { ...approval.data };

      // Move images from pending_approval to final folders if they exist
      if (approval.type === 'CREATE_PROJECT' || approval.type === 'UPDATE_PROJECT') {
        if (data.proposedImage?.includes('pending_approval')) {
          data.proposedImage = await moveFile(data.proposedImage, `projects/proposed/${Date.now()}`);
        }
        if (data.beneficiariesImage?.includes('pending_approval')) {
          data.beneficiariesImage = await moveFile(data.beneficiariesImage, `projects/beneficiaries/${Date.now()}`);
        }
        if (data.proposalUrl?.includes('pending_approval')) {
          data.proposalUrl = await moveFile(data.proposalUrl, `projects/proposals/${Date.now()}`);
        }
        if (data.testimonials) {
          data.testimonials = await Promise.all(data.testimonials.map(async (t: any) => {
            if (t.photo?.includes('pending_approval')) {
              const newPhoto = await moveFile(t.photo, `projects/testimonials/${Date.now()}_${t.id}`);
              return { ...t, photo: newPhoto };
            }
            return t;
          }));
        }
      } else if (approval.type === 'CREATE_INVESTOR' || approval.type === 'UPDATE_INVESTOR') {
        if (data.image?.includes('pending_approval')) {
          data.image = await moveFile(data.image, `investors/logos/${Date.now()}`);
        }
        if (data.headOfCompanyPhoto?.includes('pending_approval')) {
          data.headOfCompanyPhoto = await moveFile(data.headOfCompanyPhoto, `investors/heads/${Date.now()}`);
        }
      }

      if (approval.type === 'CREATE_PROJECT') {
        await addDoc(collection(db, 'projects'), data);
      } else if (approval.type === 'UPDATE_PROJECT') {
        await updateDoc(doc(db, 'projects', approval.targetId), data);
      } else if (approval.type === 'DELETE_PROJECT') {
        await deleteDoc(doc(db, 'projects', approval.targetId));
      } else if (approval.type === 'UPDATE_USER_ROLE') {
        if (approval.targetId) {
          await updateDoc(doc(db, 'users', approval.targetId), data);
        } else {
          await addDoc(collection(db, 'users'), data);
        }
      } else if (approval.type === 'CREATE_USER') {
        await addDoc(collection(db, 'users'), data);
      } else if (approval.type === 'CREATE_INVESTOR') {
        await addDoc(collection(db, 'investors'), data);
      } else if (approval.type === 'UPDATE_INVESTOR') {
        await updateDoc(doc(db, 'investors', approval.targetId), data);
      } else if (approval.type === 'DELETE_INVESTOR') {
        await deleteDoc(doc(db, 'investors', approval.targetId));
      }
      
      await updateDoc(doc(db, 'pending_approvals', approval.id), {
        status: 'approved',
        reviewedBy: auth.currentUser?.uid || 'anonymous',
        reviewedAt: serverTimestamp()
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `pending_approvals/${approval.id}`);
    }
  };

  const handleRejectUpdate = async (id: string) => {
    try {
      await updateDoc(doc(db, 'pending_approvals', id), {
        status: 'rejected',
        reviewedBy: auth.currentUser?.uid || 'anonymous',
        reviewedAt: serverTimestamp()
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `pending_approvals/${id}`);
    }
  };

  const handleCloseModal = () => {
    setShowAddProject(false);
    setEditingProject(undefined);
  };

  const stats = [
    { label: 'Total Projects', value: projects.length, icon: Building2, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Active Investors', value: investors.length, icon: TrendingUp, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { label: 'System Users', value: users.length, icon: Users, color: 'text-purple-600', bg: 'bg-purple-50' },
    { label: 'New Inquiries', value: inquiries.filter(i => i.status === 'new').length, icon: MessageSquare, color: 'text-pink-600', bg: 'bg-pink-50' },
  ];

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
        <Loader2 size={40} className="text-emerald-600 animate-spin" />
        <p className="text-slate-500 font-bold animate-pulse">Loading Admin Dashboard...</p>
      </div>
    );
  }

  if (!isAuthorized) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-6 px-4 text-center">
        <div className="w-20 h-20 bg-rose-50 rounded-full flex items-center justify-center text-rose-600">
          <Lock size={40} />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Access Denied</h2>
          <p className="text-slate-500 max-w-md mx-auto">
            You do not have the required permissions to access the Admin Dashboard. 
            Please contact a system administrator if you believe this is an error.
          </p>
        </div>
        <button 
          onClick={() => window.location.href = '/'}
          className="bg-slate-900 text-white px-8 py-3 rounded-xl font-bold hover:bg-slate-800 transition-all"
        >
          Return to Dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Admin Control Center</h1>
          <p className="text-slate-500">Manage projects, monitor investments, and oversee system users.</p>
        </div>
        <div className="flex gap-3">
          {activeTab === 'projects' && (
            <button 
              onClick={() => setShowAddProject(true)}
              className="bg-emerald-600 text-white px-4 py-2 rounded-xl font-bold hover:bg-emerald-700 transition-all flex items-center gap-2 shadow-lg shadow-emerald-200"
            >
              <Plus size={18} /> New Project
            </button>
          )}
          {activeTab === 'investors' && (
            <button 
              onClick={() => setShowAddInvestor(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded-xl font-bold hover:bg-blue-700 transition-all flex items-center gap-2 shadow-lg shadow-blue-200"
            >
              <Plus size={18} /> New Investor
            </button>
          )}
          {activeTab === 'users' && (
            <button 
              onClick={() => setShowAddUser(true)}
              className="bg-purple-600 text-white px-4 py-2 rounded-xl font-bold hover:bg-purple-700 transition-all flex items-center gap-2 shadow-lg shadow-purple-200"
            >
              <Plus size={18} /> New User
            </button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 p-1 bg-slate-200 rounded-2xl w-fit mb-8 overflow-x-auto max-w-full no-scrollbar">
        {(['overview', 'projects', 'investors', 'inquiries', 'users', 'approvals'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={cn(
              "px-6 py-2.5 rounded-xl text-sm font-bold capitalize transition-all flex items-center gap-2 relative whitespace-nowrap flex-shrink-0",
              activeTab === tab ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700"
            )}
          >
            {tab === 'overview' && <BarChart3 size={16} />}
            {tab === 'projects' && <Building2 size={16} />}
            {tab === 'investors' && <Briefcase size={16} />}
            {tab === 'inquiries' && <MessageSquare size={16} />}
            {tab === 'users' && <Users size={16} />}
            {tab === 'approvals' && <ShieldCheck size={16} />}
            {tab === 'approvals' ? 'Update Approval' : tab}
            
            {tab === 'approvals' && pendingUpdates.length > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-[10px] flex items-center justify-center rounded-full border-2 border-slate-200">
                {pendingUpdates.length}
              </span>
            )}
          </button>
        ))}
      </div>

      <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
      >
        {activeTab === 'overview' && (
          <OverviewTab projects={projects} investors={investors} stats={stats} />
        )}
        {activeTab === 'projects' && (
          <ProjectsTab 
            projects={projects} 
            onEdit={handleEditProject} 
            onDelete={handleDeleteProject}
          />
        )}
        {activeTab === 'investors' && (
          selectedInvestor ? (
            <InvestorDetail 
              investor={selectedInvestor} 
              onBack={() => setSelectedInvestor(null)} 
              projects={projects}
              onUpdateInvestor={handleUpdateInvestor}
            />
          ) : (
            <InvestorsTab 
              investors={investors} 
              onSelectInvestor={setSelectedInvestor}
              onEditInvestor={(inv) => {
                setEditingInvestor(inv);
                setShowAddInvestor(true);
              }}
              onDeleteInvestor={handleDeleteInvestor}
            />
          )
        )}
        {activeTab === 'users' && (
          <UsersTab 
            users={users} 
            onAddUser={() => setShowAddUser(true)}
            onDeleteUser={handleDeleteUser}
            onUpdateRole={handleUpdateUserRole}
          />
        )}
        {activeTab === 'approvals' && (
          <ApprovalsTab 
            updates={pendingUpdates}
            onApprove={handleApproveUpdate}
            onReject={handleRejectUpdate}
          />
        )}
        {activeTab === 'inquiries' && (
          <InquiriesTab />
        )}
      </motion.div>

      <AddProjectModal 
        key={editingProject?.id || 'new'}
        isOpen={showAddProject} 
        onClose={handleCloseModal} 
        project={editingProject}
      />

      <AddUserModal 
        isOpen={showAddUser}
        onClose={() => setShowAddUser(false)}
        onAdd={handleAddUser}
      />

      <AddInvestorModal
        key={editingInvestor?.id || 'new-investor'}
        isOpen={showAddInvestor}
        onClose={() => {
          setShowAddInvestor(false);
          setEditingInvestor(undefined);
        }}
        investor={editingInvestor}
      />
    </div>
  );
};

export default AdminDashboard;
