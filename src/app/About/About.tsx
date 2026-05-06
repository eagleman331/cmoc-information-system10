import React from 'react';
import { Shield, MapPin, Phone, Facebook, Youtube, Twitter } from 'lucide-react';
import { Link } from 'react-router-dom';
import { AboutHero } from './AboutHero';
import { WhyWeExist } from './WhyWeExist';
import { HowWeOperate } from './HowWeOperate';
import { Capabilities } from './Capabilities';
import { PartnerValue } from './PartnerValue';

const About = () => {
  return (
    <div className="min-h-screen bg-slate-50">
      <AboutHero />
      <WhyWeExist />
      <HowWeOperate />
      <Capabilities />
      <PartnerValue />

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 pt-20 pb-10 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-12 mb-16">
            <div className="col-span-2 space-y-6">
              <div className="flex items-center gap-2">
                <Shield className="text-emerald-600" size={24} />
                <span className="font-bold text-xl tracking-tight text-slate-900">Civil-Military Information Management System Portal</span>
              </div>
              <p className="text-slate-500 max-w-sm">
                The official coordination platform for Civil-Military Operations in the Philippines. Bridging the gap between security and development.
              </p>
            </div>
            <div>
              <h4 className="font-bold text-slate-900 mb-6">Quick Links</h4>
              <ul className="space-y-4 text-slate-500 text-sm">
                <li><Link to="/" className="hover:text-emerald-600">Dashboard</Link></li>
                <li><Link to="/about" className="hover:text-emerald-600">About CMOC</Link></li>
                <li><Link to="/faq" className="hover:text-emerald-600">FAQ</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-slate-900 mb-6">Contact</h4>
              <ul className="space-y-4 text-slate-500 text-sm">
                <li className="flex items-center gap-2"><Phone size={14} /> +63 (2) 8888-0000</li>
                <li className="flex items-center gap-2"><MapPin size={14} /> Camp Aguinaldo, QC</li>
                <li>cmoc@afp.mil.ph</li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-slate-900 mb-6">Follow Us</h4>
              <div className="flex gap-4">
                <a href="#" className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 hover:bg-emerald-600 hover:text-white transition-all">
                  <Facebook size={20} />
                </a>
                <a href="#" className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 hover:bg-emerald-600 hover:text-white transition-all">
                  <Youtube size={20} />
                </a>
                <a href="#" className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 hover:bg-emerald-600 hover:text-white transition-all">
                  <Twitter size={20} />
                </a>
              </div>
            </div>
          </div>
          <div className="pt-8 border-t border-slate-100 text-center text-slate-400 text-xs">
            © 2026 Civil-Military Information Management System Portal.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default About;
