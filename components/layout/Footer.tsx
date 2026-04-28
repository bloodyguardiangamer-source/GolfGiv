'use client';

import { X, Instagram, Linkedin } from 'lucide-react';

export function Footer() {
  return (
    <footer className="w-full bg-background border-t border-border pt-20 pb-10 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-20">
          {/* Col 1 */}
          <div>
            <div className="font-serif text-2xl font-bold mb-4">
              Golf<span className="text-primary">Give</span>
            </div>
            <p className="text-muted text-sm mb-6">Play. Give. Win.</p>
            <p className="text-muted text-[12px]">© 2026 GolfGive. All rights reserved.</p>
          </div>

          {/* Col 2 */}
          <div>
            <h4 className="text-white font-bold text-sm mb-6">Platform</h4>
            <ul className="space-y-4 text-sm text-muted">
              <li><a href="#" className="hover:text-primary transition-colors">How It Works</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Prize Pool</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Charity Directory</a></li>
              <li className="opacity-50">Leaderboard (coming soon)</li>
            </ul>
          </div>

          {/* Col 3 */}
          <div>
            <h4 className="text-white font-bold text-sm mb-6">Account</h4>
            <ul className="space-y-4 text-sm text-muted">
              <li><a href="#" className="hover:text-primary transition-colors">Sign Up</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Log In</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">My Dashboard</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">My Scores</a></li>
            </ul>
          </div>

          {/* Col 4 */}
          <div>
            <h4 className="text-white font-bold text-sm mb-6">Legal & Social</h4>
            <ul className="space-y-4 text-sm text-muted mb-8">
              <li><a href="#" className="hover:text-primary transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Terms of Service</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Cookie Policy</a></li>
            </ul>
            <div className="flex gap-6">
              <a href="#" className="text-muted hover:text-primary transition-colors"><X className="w-5 h-5" /></a>
              <a href="#" className="text-muted hover:text-primary transition-colors"><Instagram className="w-5 h-5" /></a>
              <a href="#" className="text-muted hover:text-primary transition-colors"><Linkedin className="w-5 h-5" /></a>
            </div>
          </div>
        </div>

        <div className="pt-10 border-t border-border text-center">
          <p className="text-[12px] text-muted max-w-2xl mx-auto">
            A portion of every subscription is donated to charity. GolfGive is not affiliated with any golf governing body.
          </p>
        </div>
      </div>
    </footer>
  );
}
