import React, { useState } from 'react';

export default function LoginPage({ onLogin }) {
  const [usernameInput, setUsernameInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // Define the valid admin credentials
  const ADMIN_USERNAME = 'ADMIN';
  const ADMIN_PASSWORD = '1234'; // Customize your password here

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMessage('');

    const trimmedUsername = usernameInput.trim().toUpperCase();

    // Check credentials
    if (trimmedUsername === ADMIN_USERNAME && passwordInput === ADMIN_PASSWORD) {
      if (onLogin) {
        onLogin(trimmedUsername);
      }
    } else {
      setErrorMessage('ACCESS DENIED: INVALID CREDENTIALS');
    }
  };

  return (
    <div className="flex-1 h-screen bg-[#070a11] flex items-center justify-center p-6 text-slate-100">
      <div className="w-full max-w-md bg-[#0b0f19] border-2 border-amber-500/60 shadow-[0_0_40px_rgba(245,158,11,0.25)] rounded-3xl p-8 space-y-6">
        <div className="text-center space-y-2 border-b border-amber-500/40 pb-4">
          <h1 className="text-2xl font-black uppercase tracking-wider text-slate-100">
            LOGIN
          </h1>
          <p className="text-xs font-bold text-amber-400 uppercase tracking-widest">
            MUSCLE LEGENDS OLYMPIC GYM
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold mb-1 text-amber-400 uppercase">
              Username
            </label>
            <input
              type="text"
              placeholder="ENTER USERNAME"
              value={usernameInput}
              onChange={(e) => setUsernameInput(e.target.value)}
              required
              className="w-full bg-[#070a11] border border-amber-500/40 rounded-xl px-4 py-2.5 text-xs font-bold text-slate-100 focus:outline-none focus:border-amber-400 placeholder:text-slate-600"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold mb-1 text-amber-400 uppercase">
              Password
            </label>
            <input
              type="password"
              placeholder="ENTER PASSWORD"
              value={passwordInput}
              onChange={(e) => setPasswordInput(e.target.value)}
              required
              className="w-full bg-[#070a11] border border-amber-500/40 rounded-xl px-4 py-2.5 text-xs font-bold text-slate-100 focus:outline-none focus:border-amber-400 placeholder:text-slate-600"
            />
          </div>

          {errorMessage && (
            <div className="p-3 bg-rose-500/10 border border-rose-500/50 rounded-xl text-center text-rose-400 text-xs font-bold uppercase tracking-wider animate-pulse">
              {errorMessage}
            </div>
          )}

          <div className="pt-2 flex justify-center">
            <button
              type="submit"
              className="w-full border border-amber-500/60 bg-[#070a11] text-amber-400 hover:bg-amber-500 hover:text-slate-950 text-xs font-bold py-3 rounded-xl transition cursor-pointer uppercase tracking-wider shadow-lg"
            >
              LOG IN
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}