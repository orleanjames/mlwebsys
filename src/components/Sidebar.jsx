import React from 'react';

export default function Sidebar({ activePage, setActivePage, onLogout }) {
  const navItems = [
    { id: 'dashboard', label: 'DASHBOARD' },
    { id: 'pos', label: 'POINT OF SALES' },
    { id: 'member-management', label: 'MEMBER MANAGEMENT' },
    { id: 'log-history', label: 'LOG HISTORY' },
    { id: 'settings', label: 'SETTINGS' },
  ];

  return (
    <div className="w-64 bg-[#0b0f19] border-r border-amber-500/40 flex flex-col justify-between p-4 min-h-screen select-none shrink-0">
      <div className="space-y-6">
        {/* Header Branding */}
        <div className="border-b border-amber-500/40 pb-4 text-center">
          <h1 className="text-amber-400 font-extrabold text-sm tracking-wider uppercase leading-snug">
            MUSCLE LEGENDS<br />OLYMPIC GYM
          </h1>
        </div>

        {/* Navigation Buttons */}
        <nav className="space-y-2">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActivePage(item.id)}
              className={`w-full text-left px-4 py-3 text-xs font-bold uppercase tracking-wider transition-all rounded-md border ${
                activePage === item.id
                  ? 'bg-amber-500/20 text-amber-400 border-amber-400 shadow-[0_0_10px_rgba(245,158,11,0.2)]'
                  : 'bg-transparent text-slate-200 border-amber-500/40 hover:bg-amber-500/10 hover:text-amber-300'
              }`}
            >
              {item.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Logout Icon Button */}
      <div className="pt-4 border-t border-amber-500/20 flex justify-center">
        <button 
          onClick={onLogout}
          title="Log Out"
          className="p-2 border border-amber-500/40 rounded-lg text-amber-400 hover:bg-amber-500/20 transition cursor-pointer"
        >
          <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
            <path d="M16 17v-3H9v-4h7V7l5 5-5 5M14 2a2 2 0 0 1 2 2v2h-2V4H5v16h9v-2h2v2a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9z"/>
          </svg>
        </button>
      </div>
    </div>
  );
}