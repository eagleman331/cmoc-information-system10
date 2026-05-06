import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: string | number | undefined): string {
  if (amount === undefined || amount === null || amount === '') return '₱0';
  
  // If it's already a string with a peso sign, just return it (or re-format to be safe)
  const cleanAmount = String(amount).replace(/[^0-9.]/g, '');
  const num = parseFloat(cleanAmount);
  
  if (isNaN(num)) return String(amount);
  
  return new Intl.NumberFormat('en-PH', {
    style: 'currency',
    currency: 'PHP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(num);
}

export function formatDate(dateString: string | undefined): string {
  if (!dateString) return 'TBA';
  
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;
    
    return new Intl.DateTimeFormat('en-US', {
      month: 'long',
      day: '2-digit',
      year: 'numeric',
    }).format(date);
  } catch (e) {
    return dateString;
  }
}

export interface Testimonial {
  id: string;
  name: string;
  position: string;
  statement: string;
  photo?: string;
  voiceType: 'minor' | 'major';
}

export interface Project {
  id: string;
  title: string;
  location: string;
  coordinates: [number, number]; // [longitude, latitude]
  status: 'proposed' | 'ongoing' | 'completed' | 'postponed' | 'on hold';
  category: string; // Primary category for display
  categories?: string[]; // Multiple categories
  description: string;
  budget: string | number;
  investorGoal: string;
  currentFunding: number;
  startDate: string;
  completionDate?: string;
  // New fields from Admin encoding requirements
  proponent?: string;
  aboutProponent?: string;
  objectives?: string | string[];
  contactPerson?: string;
  legalStatus?: string;
  beneficiaries?: string;
  beneficiariesCount?: number;
  impactPercentage?: number;
  duration?: string | number;
  background?: string;
  timeline?: string;
  policy?: string;
  areaCoverage?: string | number;
  implementingPartner?: string;
  implementingMechanism?: string;
  unitInCharge?: string;
  coordinationLevel?: string;
  targetStartOperation?: string;
  proposedImage?: string;
  beneficiariesImage?: string;
  proposalUrl?: string;
  stages?: { name: string; duration: string | number; deliverables: string }[];
  investors?: { name: string; headOfCompany?: string; sector?: string; country?: string; amount: string | number; date: string }[];
  testimonials?: Testimonial[];
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'Admin' | 'Manager' | 'Encoder' | 'Guest';
  status: 'active' | 'inactive';
  lastActive: string;
  password?: string;
}

export interface PendingUpdate {
  id: string;
  encoderName: string;
  time: string;
  type: 'Project' | 'Investor';
  targetName: string;
  changes: { field: string; old: string; new: string }[];
  status: 'pending' | 'approved' | 'rejected';
}

export interface Investor {
  id: string;
  name: string;
  image: string;
  background: string;
  totalInvested: string;
  projectsCount: number;
  status: 'verified' | 'pending';
  sector: string;
  country: string;
  headOfCompany?: string;
  headOfCompanyPhoto?: string;
  investments?: {
    projectId: string;
    projectName: string;
    status: string;
    amount: string;
    date: string;
  }[];
}

export const MOCK_PROJECTS: Project[] = [];

export const MOCK_INVESTORS: Investor[] = [];

export const FAQS = [
  {
    question: "How is the military involved in these civilian projects?",
    answer: "The military provides engineering expertise, logistics support, and security in remote or conflict-affected areas, ensuring projects are completed safely and efficiently where private contractors might face challenges."
  },
  {
    question: "What are the benefits for private investors?",
    answer: "Investors gain access to high-impact social projects with reduced operational risk due to military coordination. It fulfills CSR goals and contributes to national stability and economic development."
  },
  {
    question: "How is funding transparency maintained?",
    answer: "All projects undergo rigorous auditing by both civilian oversight committees and military financial controllers. Regular progress reports and fund utilization statements are provided to investors."
  },
  {
    question: "Can I choose a specific region for my investment?",
    answer: "Yes, our interactive map allows you to filter projects by region, status, and category, enabling you to fund initiatives that align with your strategic interests."
  }
];
