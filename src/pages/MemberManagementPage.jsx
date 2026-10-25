import React, { useState } from 'react';

export default function MemberManagementPage({
  members = [],
  checkInLogs = [],
  onNavigateToAvailMembership,
  onUpdateMember,
  username = 'Admin',
}) {
  const [activeTab, setActiveTab] = useState('members'); // 'members' or 'monthly'
  const [searchTerm, setSearchTerm] = useState('');
  
  // Member Edit State
  const [selectedMember, setSelectedMember] = useState(null);
  const [editForm, setEditForm] = useState({
    id: null,
    firstName: '',
    lastName: '',
    contact: '',
    dateAdded: '',
    age: '',
    address: '',
    sex: 'M',
    status: 'ACTIVE',
  });

  // Monthly Pass Edit State
  const [selectedMonthlyHolder, setSelectedMonthlyHolder] = useState(null);
  const [monthlyEditForm, setMonthlyEditForm] = useState({
    id: null,
    name: '',
    startDate: '',
    endDate: '',
  });

  // DYNAMICALLY ACCUMULATE MONTHLY PASS HOLDERS FROM LOG HISTORY
  const monthlyHoldersMap = new Map();
  const sortedLogsForMonthly = [...checkInLogs].sort((a, b) => (a.date + (a.time || '')).localeCompare(b.date + (b.time || '')));

  sortedLogsForMonthly.forEach((log) => {
    if ((log.passType || '').toUpperCase().includes('MONTHLY')) {
      const name = log.name.toUpperCase();
      const passDate = log.date || '2026-10-18';
      const monthsToAdd = parseInt(log.durationMonths || 1, 10);
      const daysToAdd = monthsToAdd * 30;

      if (!monthlyHoldersMap.has(name)) {
        const startDateObj = new Date(passDate);
        startDateObj.setDate(startDateObj.getDate() + daysToAdd);
        const calculatedEndDate = startDateObj.toISOString().split('T')[0];

        monthlyHoldersMap.set(name, {
          id: log.id || `${name}-${passDate}`,
          name: name,
          startDate: passDate,
          endDate: calculatedEndDate,
        });
      } else {
        const existing = monthlyHoldersMap.get(name);
        const baseDate = new Date(existing.endDate > passDate ? existing.endDate : passDate);
        baseDate.setDate(baseDate.getDate() + daysToAdd);
        existing.endDate = baseDate.toISOString().split('T')[0];
      }
    }
  });
  const monthlyHoldersList = Array.from(monthlyHoldersMap.values());

  // Filter members by search term
  const filteredMembers = members.filter((m) =>
    m.name.toUpperCase().includes(searchTerm.toUpperCase())
  );

  // Filter monthly pass holders by search term
  const filteredMonthlyHolders = monthlyHoldersList.filter((m) =>
    m.name.toUpperCase().includes(searchTerm.toUpperCase())
  );

  // Open Edit Member Modal
  const handleOpenEditModal = (member) => {
    const nameParts = member.name.trim().split(' ');
    const lastName = nameParts.length > 1 ? nameParts.pop() : '';
    const firstName = nameParts.join(' ');

    setEditForm({
      id: member.id,
      firstName: firstName || member.name,
      lastName: lastName || '',
      contact: member.contact || '',
      dateAdded: member.dateJoined || '',
      age: member.age || '',
      address: member.address || '',
      sex: member.sex || 'M',
      status: member.status || 'ACTIVE',
    });
    setSelectedMember(member);
  };

  const handleSubmitEdit = (e) => {
    e.preventDefault();
    if (!selectedMember) return;

    const updatedMember = {
      ...selectedMember,
      contact: editForm.contact,
      age: editForm.age,
      address: editForm.address.toUpperCase(),
      status: editForm.status,
    };

    if (onUpdateMember) {
      onUpdateMember(updatedMember);
    }

    setSelectedMember(null);
  };

  // Open Edit Monthly Pass Modal
  const handleOpenEditMonthlyModal = (holder) => {
    setMonthlyEditForm({
      id: holder.id,
      name: holder.name,
      startDate: holder.startDate,
      endDate: holder.endDate,
    });
    setSelectedMonthlyHolder(holder);
  };

  const handleSubmitMonthlyEdit = (e) => {
    e.preventDefault();
    if (!selectedMonthlyHolder) return;

    selectedMonthlyHolder.endDate = monthlyEditForm.endDate;
    setSelectedMonthlyHolder(null);
  };

  return (
    <div className="flex-1 bg-[#070a11] p-6 flex flex-col overflow-y-auto relative text-slate-100 min-h-full">
      {/* Header */}
      <div className="flex justify-between items-center border-b border-amber-500/40 pb-3 mb-6 shrink-0">
        <h1 className="text-xl font-black uppercase tracking-wider">MEMBER MANAGEMENT</h1>
        <span className="text-lg font-bold">Welcome, {username}!</span>
      </div>

      {/* Main Container - Natural height expansion for full page scrolling */}
      <div className="flex flex-col bg-[#0b0f19] border border-amber-500/30 rounded-2xl p-6 space-y-4">
        
        {/* Navigation Tabs Bar */}
        <div className="flex justify-between items-center gap-4 border-b border-amber-500/20 pb-4">
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => { setActiveTab('members'); setSearchTerm(''); }}
              className={`px-4 py-2 text-xs font-bold rounded-xl uppercase transition cursor-pointer border ${activeTab === 'members' ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-lg' : 'bg-[#070a11] text-amber-400 border-amber-500/40 hover:bg-amber-500/20'}`}
            >
              Registered Members ({members.length})
            </button>
            <button
              type="button"
              onClick={() => { setActiveTab('monthly'); setSearchTerm(''); }}
              className={`px-4 py-2 text-xs font-bold rounded-xl uppercase transition cursor-pointer border ${activeTab === 'monthly' ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-lg' : 'bg-[#070a11] text-amber-400 border-amber-500/40 hover:bg-amber-500/20'}`}
            >
              Monthly Pass Holders ({monthlyHoldersList.length})
            </button>
          </div>

          <button
            type="button"
            onClick={onNavigateToAvailMembership}
            className="border border-amber-500/60 bg-[#070a11] text-amber-400 text-xs font-bold px-4 py-2 rounded-xl hover:bg-amber-500 hover:text-slate-950 transition cursor-pointer uppercase"
          >
            + REGISTER NEW MEMBER
          </button>
        </div>

        {/* Search Bar */}
        <div className="w-full max-w-md">
          <input
            type="text"
            placeholder={activeTab === 'members' ? "SEARCH MEMBER NAME..." : "SEARCH MONTHLY PASS HOLDER..."}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-[#070a11] border border-amber-500/40 rounded-xl px-4 py-2 text-xs font-bold text-slate-100 focus:outline-none focus:border-amber-400 placeholder:text-slate-500"
          />
        </div>

        {/* TAB 1: REGISTERED MEMBERS TABLE */}
        {activeTab === 'members' && (
          <div className="border border-amber-500/40 rounded-xl overflow-hidden">
            <table className="w-full text-xs">
              <thead className="bg-[#070a11]">
                <tr className="border-b border-amber-500/40">
                  <th className="p-3 border-r border-amber-500/40 font-bold uppercase text-left pl-6">NAME</th>
                  <th className="p-3 border-r border-amber-500/40 font-bold uppercase text-center w-20">AGE</th>
                  <th className="p-3 border-r border-amber-500/40 font-bold uppercase text-center w-16">SEX</th>
                  <th className="p-3 border-r border-amber-500/40 font-bold uppercase text-center">CONTACT</th>
                  <th className="p-3 border-r border-amber-500/40 font-bold uppercase text-center">STATUS</th>
                  <th className="p-3 border-r border-amber-500/40 font-bold uppercase text-center">ADDRESS</th>
                  <th className="p-3 font-bold uppercase text-center w-32">DATE JOINED</th>
                </tr>
              </thead>
              <tbody>
                {filteredMembers.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="p-6 text-center text-slate-500 italic">
                      No members found.
                    </td>
                  </tr>
                ) : (
                  filteredMembers.map((member, idx) => (
                    <tr key={member.id || idx} className="border-b border-amber-500/20 hover:bg-amber-500/10 transition">
                      <td className="p-2.5 border-r border-amber-500/20 pl-6 font-semibold">
                        <button
                          type="button"
                          onClick={() => handleOpenEditModal(member)}
                          className="text-amber-300 font-bold hover:underline cursor-pointer text-left"
                        >
                          {member.name}
                        </button>
                      </td>
                      <td className="p-2.5 border-r border-amber-500/20 text-center font-mono">{member.age || 'N/A'}</td>
                      <td className="p-2.5 border-r border-amber-500/20 text-center font-mono">{member.sex || 'M'}</td>
                      <td className="p-2.5 border-r border-amber-500/20 text-center font-mono text-slate-300">{member.contact || 'N/A'}</td>
                      <td className="p-2.5 border-r border-amber-500/20 text-center font-bold">
                        <span className={member.status === 'ACTIVE' ? 'text-emerald-400' : 'text-rose-400'}>
                          {member.status || 'ACTIVE'}
                        </span>
                      </td>
                      <td className="p-2.5 border-r border-amber-500/20 text-center text-slate-300 uppercase">{member.address || 'N/A'}</td>
                      <td className="p-2.5 text-center font-mono text-amber-300">{member.dateJoined || 'N/A'}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* TAB 2: MONTHLY PASS HOLDERS TABLE */}
        {activeTab === 'monthly' && (
          <div className="border border-amber-500/40 rounded-xl overflow-hidden">
            <table className="w-full text-xs">
              <thead className="bg-[#070a11]">
                <tr className="border-b border-amber-500/40">
                  <th className="p-3 border-r border-amber-500/40 font-bold uppercase text-left pl-6">NAME</th>
                  <th className="p-3 border-r border-amber-500/40 font-bold uppercase text-center w-40">START DATE</th>
                  <th className="p-3 border-r border-amber-500/40 font-bold uppercase text-center w-40">END DATE</th>
                  <th className="p-3 font-bold uppercase text-center w-32">STATUS</th>
                </tr>
              </thead>
              <tbody>
                {filteredMonthlyHolders.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="p-6 text-center text-slate-500 italic">
                      No monthly pass records found.
                    </td>
                  </tr>
                ) : (
                  filteredMonthlyHolders.map((holder, idx) => {
                    const isExpired = new Date(holder.endDate) < new Date();
                    return (
                      <tr key={holder.id || idx} className="border-b border-amber-500/20 hover:bg-amber-500/10 transition">
                        <td className="p-3 border-r border-amber-500/20 pl-6 font-semibold">
                          <button
                            type="button"
                            onClick={() => handleOpenEditMonthlyModal(holder)}
                            className="text-amber-300 font-bold hover:underline cursor-pointer text-left"
                          >
                            {holder.name}
                          </button>
                        </td>
                        <td className="p-3 border-r border-amber-500/20 text-center font-mono text-slate-300">{holder.startDate}</td>
                        <td className="p-3 border-r border-amber-500/20 text-center font-mono text-amber-300">{holder.endDate}</td>
                        <td className="p-3 text-center font-bold">
                          <span className={!isExpired ? 'text-emerald-400' : 'text-rose-400'}>
                            {!isExpired ? 'ACTIVE PASS' : 'EXPIRED'}
                          </span>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        )}

      </div>

      {/* EDIT MEMBER INFO POPUP MODAL */}
      {selectedMember && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="w-full max-w-3xl bg-[#0b0f19] border-2 border-amber-500/60 shadow-[0_0_40px_rgba(245,158,11,0.2)] rounded-3xl p-8 relative space-y-6">
            <div className="flex justify-between items-center border-b border-amber-500/30 pb-3">
              <h2 className="text-xl font-extrabold text-slate-100 tracking-wider uppercase flex items-center gap-2">
                <span className="text-amber-400">EDIT MEMBER INFO</span>
              </h2>
              <button
                type="button"
                onClick={() => setSelectedMember(null)}
                className="text-slate-400 hover:text-amber-400 font-bold text-xl cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmitEdit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold mb-1 text-slate-300">First Name*</label>
                  <input type="text" readOnly value={editForm.firstName} className="w-full bg-slate-900/80 border border-amber-500/40 rounded-xl px-4 py-2.5 text-xs font-bold text-slate-400 focus:outline-none cursor-not-allowed" />
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1 text-slate-300">Last Name*</label>
                  <input type="text" readOnly value={editForm.lastName} className="w-full bg-slate-900/80 border border-amber-500/40 rounded-xl px-4 py-2.5 text-xs font-bold text-slate-400 focus:outline-none cursor-not-allowed" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold mb-1 text-slate-300">Contact*</label>
                  <input type="text" value={editForm.contact} onChange={(e) => setEditForm({ ...editForm, contact: e.target.value })} className="w-full bg-[#070a11] border border-amber-500/40 rounded-xl px-4 py-2.5 text-xs font-bold text-slate-100 focus:outline-none focus:border-amber-400" />
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1 text-slate-300">Date added*</label>
                  <input type="text" readOnly value={editForm.dateAdded} className="w-full bg-slate-900/80 border border-amber-500/40 rounded-xl px-4 py-2.5 text-xs font-bold text-slate-400 focus:outline-none cursor-not-allowed" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold mb-1 text-slate-300">Age</label>
                  <input type="number" min="1" max="100" value={editForm.age} onChange={(e) => setEditForm({ ...editForm, age: e.target.value })} className="w-full bg-[#070a11] border border-amber-500/40 rounded-xl px-4 py-2.5 text-xs font-bold text-slate-100 focus:outline-none focus:border-amber-400" />
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1 text-slate-300">Address</label>
                  <input type="text" value={editForm.address} onChange={(e) => setEditForm({ ...editForm, address: e.target.value })} className="w-full bg-[#070a11] border border-amber-500/40 rounded-xl px-4 py-2.5 text-xs font-bold text-slate-100 focus:outline-none focus:border-amber-400" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold mb-1 text-slate-300">Sex</label>
                  <input type="text" readOnly value={editForm.sex} className="w-full bg-slate-900/80 border border-amber-500/40 rounded-xl px-4 py-2.5 text-xs font-bold text-slate-400 focus:outline-none cursor-not-allowed" />
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1 text-slate-300">Status</label>
                  <select value={editForm.status} onChange={(e) => setEditForm({ ...editForm, status: e.target.value })} className="w-full bg-[#070a11] border border-amber-500/40 rounded-xl px-4 py-2.5 text-xs text-slate-100 font-bold focus:outline-none focus:border-amber-400">
                    <option value="ACTIVE">ACTIVE</option>
                    <option value="INACTIVE">INACTIVE</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-center pt-4">
                <button type="submit" className="border border-amber-500/60 bg-[#070a11] text-amber-400 text-xs font-bold px-12 py-3 rounded-xl hover:bg-amber-500 hover:text-slate-950 transition cursor-pointer uppercase tracking-wider">
                  SUBMIT
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EDIT MONTHLY PASS POPUP MODAL */}
      {selectedMonthlyHolder && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="w-full max-w-md bg-[#0b0f19] border-2 border-amber-500/60 shadow-[0_0_40px_rgba(245,158,11,0.2)] rounded-3xl p-8 relative space-y-6">
            <div className="flex justify-between items-center border-b border-amber-500/30 pb-3">
              <h2 className="text-lg font-extrabold text-slate-100 tracking-wider uppercase text-amber-400">
                EDIT MONTHLY PASS
              </h2>
              <button type="button" onClick={() => setSelectedMonthlyHolder(null)} className="text-slate-400 hover:text-amber-400 font-bold text-xl cursor-pointer">✕</button>
            </div>

            <form onSubmit={handleSubmitMonthlyEdit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold mb-1 text-slate-300">Holder Name</label>
                <input type="text" readOnly value={monthlyEditForm.name} className="w-full bg-slate-900/80 border border-amber-500/40 rounded-xl px-4 py-2.5 text-xs font-bold text-amber-300 focus:outline-none cursor-not-allowed" />
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1 text-slate-300">Start Date</label>
                <input type="date" readOnly value={monthlyEditForm.startDate} className="w-full bg-slate-900/80 border border-amber-500/40 rounded-xl px-4 py-2.5 text-xs font-bold text-slate-400 focus:outline-none cursor-not-allowed" />
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1 text-slate-300">End Date (Expiration)</label>
                <input type="date" value={monthlyEditForm.endDate} onChange={(e) => setMonthlyEditForm({ ...monthlyEditForm, endDate: e.target.value })} className="w-full bg-[#070a11] border border-amber-500/40 rounded-xl px-4 py-2.5 text-xs font-bold text-slate-100 focus:outline-none focus:border-amber-400" required />
              </div>

              <div className="flex justify-center pt-4">
                <button type="submit" className="border border-amber-500/60 bg-[#070a11] text-amber-400 text-xs font-bold px-8 py-3 rounded-xl hover:bg-amber-500 hover:text-slate-950 transition cursor-pointer uppercase tracking-wider">
                  UPDATE PASS
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}