import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Shield, LayoutGrid, X, User, LogOut, Settings } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../constants';
import { auth, googleProvider, signInWithPopup, signOut, onAuthStateChanged, db, doc, getDoc, setDoc, serverTimestamp } from '../lib/firebase';

export const Navbar = () => {
  const location = useLocation();
  const [user, setUser] = useState<any>(null);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser);
        
        // 1. Try to get role from custom claims (Custom Token identification)
        const idTokenResult = await firebaseUser.getIdTokenResult();
        const claimRole = idTokenResult.claims.role as string;
        
        if (claimRole) {
          setUserRole(claimRole);
          console.log("User role identified from custom claims:", claimRole);
        } else {
          // 2. Fallback to Firestore if claims are not yet set
          const userDocRef = doc(db, 'users', firebaseUser.uid);
          const userDoc = await getDoc(userDocRef);
          
          if (userDoc.exists()) {
            setUserRole(userDoc.data().role);
          } else {
            // Default role is 'Guest' unless it's the bootstrap admin
            const role = firebaseUser.email === 'warrenching33@gmail.com' ? 'Admin' : 'Guest';
            await setDoc(userDocRef, {
              uid: firebaseUser.uid,
              email: firebaseUser.email,
              displayName: firebaseUser.displayName,
              role: role,
              status: 'active',
              lastActive: serverTimestamp(),
              createdAt: serverTimestamp()
            });
            setUserRole(role);
          }
        }
      } else {
        setUser(null);
        setUserRole(null);
      }
    });

    return () => unsubscribe();
  }, []);

  const handleLogin = async () => {
    try {
      console.log("Attempting login with Google popup...");
      const result = await signInWithPopup(auth, googleProvider);
      console.log("Login success:", result.user.email);
    } catch (error: any) {
      console.error('Login failed:', error);
      if (error.code === 'auth/internal-error') {
        console.error('Internal error details:', error.customData);
        // Sometimes this is due to the authDomain being blocked or incorrect.
        // We can try to suggest a fix or log more context.
      }
    }
    setIsMobileMenuOpen(false);
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setIsUserMenuOpen(false);
    } catch (error) {
      console.error('Logout failed:', error);
    }
    setIsMobileMenuOpen(false);
  };

  const navLinks = [
    { to: '/', label: 'Dashboard' },
    { to: '/about', label: 'About Us' },
    { to: '/framework', label: 'Framework' },
    { to: '/faq', label: 'FAQ' },
    { to: '/admin', label: 'Admin' },
  ];

  return (
    <>
      <nav className="sticky top-0 z-50 glass-panel border-b border-slate-200 px-4 py-3">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <Link to="/" className="flex items-center gap-2" onClick={() => setIsMobileMenuOpen(false)}>
            <div className="bg-[#0f172a] p-1.5 rounded-lg">
              <Shield className="text-white" size={20} />
            </div>
            <span className="font-bold text-lg tracking-tight text-slate-900">CMIMS <span className="text-emerald-600 font-medium">Portal</span></span>
          </Link>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
            {navLinks.map((link) => (
              <Link 
                key={link.to}
                to={link.to} 
                className={cn("hover:text-emerald-600 transition-colors", location.pathname === link.to && "text-emerald-600 font-bold")}
              >
                {link.label}
              </Link>
            ))}
            
            {user ? (
              <div className="relative">
                <button 
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center gap-2 px-4 py-2 rounded-full bg-slate-100 hover:bg-slate-200 transition-colors border border-slate-200"
                >
                  <div className="w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center text-white text-[10px] font-bold">
                    {user.displayName?.[0] || 'U'}
                  </div>
                  <span className="text-slate-700 font-bold">{user.displayName?.split(' ')[0]}</span>
                </button>
                
                <AnimatePresence>
                  {isUserMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute right-0 mt-2 w-48 bg-white rounded-2xl shadow-xl border border-slate-100 py-2 z-50"
                    >
                      <div className="px-4 py-2 border-b border-slate-50 mb-1">
                        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Role</div>
                        <div className="text-xs font-bold text-emerald-600 capitalize">{userRole}</div>
                      </div>
                      <button 
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2 px-4 py-2 text-sm text-slate-600 hover:bg-slate-50 hover:text-rose-600 transition-colors"
                      >
                        <LogOut size={16} />
                        Log Out
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <button 
                onClick={handleLogin}
                className="bg-[#0f172a] text-white px-6 py-2 rounded-full hover:bg-slate-800 transition-all shadow-sm font-bold"
              >
                Login
              </button>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <button 
            className="md:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X size={24} /> : <LayoutGrid size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden overflow-hidden bg-white border-t border-slate-100 mt-3"
            >
              <div className="flex flex-col gap-4 py-6 px-2">
                {navLinks.map((link) => (
                  <Link 
                    key={link.to}
                    to={link.to} 
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={cn(
                      "px-4 py-2 rounded-xl transition-colors text-sm font-medium",
                      location.pathname === link.to 
                        ? "bg-emerald-50 text-emerald-600 font-bold" 
                        : "text-slate-600 hover:bg-slate-50 hover:text-emerald-600"
                    )}
                  >
                    {link.label}
                  </Link>
                ))}
                <div className="pt-2 border-t border-slate-100">
                  {user ? (
                    <button 
                      onClick={handleLogout}
                      className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-rose-50 text-rose-600 font-bold hover:bg-rose-100 transition-colors"
                    >
                      <LogOut size={18} />
                      Log Out
                    </button>
                  ) : (
                    <button 
                      onClick={handleLogin}
                      className="w-full px-6 py-3 rounded-xl bg-[#0f172a] text-white font-bold hover:bg-slate-800 transition-all shadow-sm text-center"
                    >
                      Login
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </>
  );
};
