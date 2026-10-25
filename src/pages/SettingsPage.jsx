import React, { useState } from 'react';

export default function SettingsPage({ username = 'Admin' }) {
  const [activeModal, setActiveModal] = useState(null);

  return (
    <div className="flex-1 bg-[#070a11] p-6 flex flex-col overflow-y-auto text-slate-100">
      {/* Top Banner Header: Title Left | Greeting Right */}
      <div className="flex justify-between items-center border-b border-amber-500/40 pb-3 mb-6">
        <h1 className="text-xl font-black uppercase tracking-wider">SETTINGS</h1>
        <span className="text-lg font-bold">Welcome, {username}!</span>
      </div>

      <div className="flex-1 flex items-center justify-center">
        <div className="w-full max-w-3xl bg-[#0b0f19] border border-amber-500/30 rounded-3xl p-12 shadow-[0_0_40px_rgba(245,158,11,0.15)] flex flex-col items-center justify-center space-y-6">
          <div className="w-full max-w-md space-y-4">
            <button
              onClick={() => setActiveModal('register')}
              className="w-full bg-[#7c6200] hover:bg-[#967700] border border-amber-400 font-black text-xs tracking-wider py-4 px-6 rounded-xl shadow-lg transition cursor-pointer uppercase text-slate-100"
            >
              REGISTER NEW ACCOUNT
            </button>

            <button
              onClick={() => setActiveModal('manage')}
              className="w-full bg-[#7c6200] hover:bg-[#967700] border border-amber-400 font-black text-xs tracking-wider py-4 px-6 rounded-xl shadow-lg transition cursor-pointer uppercase text-slate-100"
            >
              MANAGE ACCOUNTS
            </button>
          </div>
        </div>
      </div>

      {activeModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="w-full max-w-sm bg-[#7c6200] border-2 border-amber-400 rounded-2xl p-6 text-center shadow-[0_0_40px_rgba(245,158,11,0.4)] relative space-y-4">
            <button onClick={() => setActiveModal(null)} className="absolute top-3 right-4 hover:text-amber-300 font-bold text-xl cursor-pointer">✕</button>
            <h2 className="text-xl font-black uppercase tracking-wider">
              {activeModal === 'register' ? 'Register New Account' : 'Manage Accounts'}
            </h2>
            <p className="text-xs font-semibold text-slate-200">This feature is currently under development.</p>
            <button onClick={() => setActiveModal(null)} className="bg-[#4a3b00] border border-amber-400 text-xs font-bold px-6 py-2 rounded-lg cursor-pointer uppercase">CLOSE</button>
          </div>
        </div>
      )}
    </div>
  );
}