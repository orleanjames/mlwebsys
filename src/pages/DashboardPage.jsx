import React, { useState } from 'react';

export default function DashboardPage({
  members = [],
  checkInLogs = [],
  username = 'Admin',
}) {
  const [searchTerm, setSearchTerm] = useState('');
  
  // Sorting State for Monthly Table
  const [monthlySortField, setMonthlySortField] = useState('endDate');
  const [monthlySortDirection, setMonthlySortDirection] = useState('asc');

  // Sorting State for Members Table
  const [memberSortField, setMemberSortField] = useState('name');
  const [memberSortDirection, setMemberSortDirection] = useState('asc');

  const activeMembersCount = members.filter((m) => (m.status || 'ACTIVE') === 'ACTIVE').length;
  const inactiveMembersCount = members.filter((m) => m.status === 'INACTIVE').length;
  const totalMembersCount = members.length;

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

  const currentDate = new Date();

  // Filter out expired passes, independently match search term, and apply sort
  const activeMonthlyHolders = Array.from(monthlyHoldersMap.values())
    .filter((holder) => {
      const endDateObj = new Date(holder.endDate);
      const isNotExpired = endDateObj >= currentDate;
      const matchesSearch = holder.name.toUpperCase().includes(searchTerm.toUpperCase());
      return isNotExpired && matchesSearch;
    })
    .sort((a, b) => {
      let valA = a[monthlySortField] || '';
      let valB = b[monthlySortField] || '';
      if (valA < valB) return monthlySortDirection === 'asc' ? -1 : 1;
      if (valA > valB) return monthlySortDirection === 'asc' ? 1 : -1;
      return 0;
    });

  // Independently filter members by search term and apply sort
  const filteredMembers = members
    .filter((m) => (m.name || '').toUpperCase().includes(searchTerm.toUpperCase()))
    .sort((a, b) => {
      let valA = memberSortField === 'name' ? (a.name || '') : (a.dateJoined || '');
      let valB = memberSortField === 'name' ? (b.name || '') : (b.dateJoined || '');
      if (valA < valB) return memberSortDirection === 'asc' ? -1 : 1;
      if (valA > valB) return memberSortDirection === 'asc' ? 1 : -1;
      return 0;
    });

  const handleMonthlySort = (field) => {
    if (monthlySortField === field) {
      setMonthlySortDirection(monthlySortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setMonthlySortField(field);
      setMonthlySortDirection('asc');
    }
  };

  const handleMemberSort = (field) => {
    if (memberSortField === field) {
      setMemberSortDirection(memberSortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setMemberSortField(field);
      setMemberSortDirection('asc');
    }
  };

  return (
    <div className="flex-1 bg-[#070a11] p-6 flex flex-col overflow-y-auto relative text-slate-100">
      <div className="flex justify-between items-center border-b border-amber-500/40 pb-3 mb-6">
        <h1 className="text-xl font-black uppercase tracking-wider">DASHBOARD</h1>
        <span className="text-lg font-bold">Welcome, {username}!</span>
      </div>

      {/* Search bar in its original position above the metric cards */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search here"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full bg-[#0b0f19] border border-amber-500/40 rounded-xl px-4 py-2.5 text-xs font-bold text-slate-100 focus:outline-none focus:border-amber-400 placeholder:text-slate-500"
        />
      </div>

      {/* Top Metric Cards */}
      <div className="grid grid-cols-4 gap-6 mb-8">
        <div className="bg-[#0b0f19] border border-amber-500/30 rounded-2xl p-5 shadow-lg flex flex-col justify-between">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">ACTIVE MEMBERS</span>
          <span className="text-3xl font-black text-emerald-400 font-mono mt-3">{activeMembersCount}</span>
        </div>
        <div className="bg-[#0b0f19] border border-amber-500/30 rounded-2xl p-5 shadow-lg flex flex-col justify-between">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">INACTIVE MEMBERS</span>
          <span className="text-3xl font-black text-rose-400 font-mono mt-3">{inactiveMembersCount}</span>
        </div>
        <div className="bg-[#0b0f19] border border-amber-500/30 rounded-2xl p-5 shadow-lg flex flex-col justify-between">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">TOTAL MEMBERS</span>
          <span className="text-3xl font-black text-amber-400 font-mono mt-3">{totalMembersCount}</span>
        </div>
        <div className="bg-[#0b0f19] border border-amber-500/30 rounded-2xl p-5 shadow-lg flex flex-col justify-between">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">MONTHLY PASS</span>
          <span className="text-3xl font-black text-amber-400 font-mono mt-3">{activeMonthlyHolders.length}</span>
        </div>
      </div>

      {/* Tables Section */}
      <div className="grid grid-cols-2 gap-6">
        {/* Monthly Table */}
        <div className="bg-[#0b0f19] border border-amber-500/30 rounded-2xl p-6 flex flex-col">
          <h2 className="text-center text-sm font-black uppercase tracking-wider text-amber-400 mb-4">
            MONTHLY ({activeMonthlyHolders.length})
          </h2>
          <div className="border border-amber-500/40 rounded-xl overflow-hidden">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-amber-500/40 bg-[#070a11]">
                  <th onClick={() => handleMonthlySort('name')} className="p-3 border-r border-amber-500/40 font-bold uppercase text-left pl-6 cursor-pointer hover:text-amber-400 select-none">
                    NAME {monthlySortField === 'name' ? (monthlySortDirection === 'asc' ? '▾' : '▴') : '▾'}
                  </th>
                  <th onClick={() => handleMonthlySort('startDate')} className="p-3 border-r border-amber-500/40 font-bold uppercase text-center w-36 cursor-pointer hover:text-amber-400 select-none">
                    START DATE {monthlySortField === 'startDate' ? (monthlySortDirection === 'asc' ? '▾' : '▴') : '▾'}
                  </th>
                  <th onClick={() => handleMonthlySort('endDate')} className="p-3 font-bold uppercase text-center w-36 cursor-pointer hover:text-amber-400 select-none">
                    END DATE {monthlySortField === 'endDate' ? (monthlySortDirection === 'asc' ? '▾' : '▴') : '▾'}
                  </th>
                </tr>
              </thead>
              <tbody>
                {activeMonthlyHolders.length === 0 ? (
                  <tr>
                    <td colSpan="3" className="p-6 text-center text-slate-500 italic">No matching monthly passes found.</td>
                  </tr>
                ) : (
                  activeMonthlyHolders.map((holder, idx) => {
                    const endDateObj = new Date(holder.endDate);
                    const diffTime = endDateObj - currentDate;
                    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                    const isExpiringSoon = diffDays <= 7;

                    return (
                      <tr 
                        key={idx} 
                        className={`border-b border-amber-500/20 transition ${isExpiringSoon ? 'bg-rose-950/40 hover:bg-rose-900/40 text-rose-300' : 'hover:bg-amber-500/10'}`}
                      >
                        <td className={`p-3 border-r border-amber-500/20 pl-6 font-semibold ${isExpiringSoon ? 'text-rose-300' : 'text-slate-100'}`}>
                          {holder.name}
                        </td>
                        <td className="p-3 border-r border-amber-500/20 text-center font-mono text-slate-300">
                          {holder.startDate}
                        </td>
                        <td className={`p-3 text-center font-mono font-bold ${isExpiringSoon ? 'text-rose-400' : 'text-amber-300'}`}>
                          {holder.endDate} {isExpiringSoon && <span className="text-[10px] block font-extrabold animate-pulse">(Ends in {diffDays}d)</span>}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Members Table */}
        <div className="bg-[#0b0f19] border border-amber-500/30 rounded-2xl p-6 flex flex-col">
          <h2 className="text-center text-sm font-black uppercase tracking-wider text-amber-400 mb-4">
            MEMBERS ({filteredMembers.length})
          </h2>
          <div className="border border-amber-500/40 rounded-xl overflow-hidden">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-amber-500/40 bg-[#070a11]">
                  <th onClick={() => handleMemberSort('name')} className="p-3 border-r border-amber-500/40 font-bold uppercase text-left pl-6 cursor-pointer hover:text-amber-400 select-none">
                    NAME {memberSortField === 'name' ? (memberSortDirection === 'asc' ? '▾' : '▴') : '▾'}
                  </th>
                  <th onClick={() => handleMemberSort('dateJoined')} className="p-3 font-bold uppercase text-center w-36 cursor-pointer hover:text-amber-400 select-none">
                    DATE ADDED {memberSortField === 'dateJoined' ? (memberSortDirection === 'asc' ? '▾' : '▴') : '▾'}
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredMembers.length === 0 ? (
                  <tr>
                    <td colSpan="2" className="p-6 text-center text-slate-500 italic">No matching members found.</td>
                  </tr>
                ) : (
                  filteredMembers.map((member, idx) => (
                    <tr key={member.id || idx} className="border-b border-amber-500/20 hover:bg-amber-500/10 transition">
                      <td className="p-3 border-r border-amber-500/20 pl-6 font-semibold text-slate-100">
                        {member.name}
                      </td>
                      <td className="p-3 text-center font-mono text-amber-300">
                        {member.dateJoined || 'N/A'}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}