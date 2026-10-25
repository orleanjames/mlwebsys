import React, { useState } from 'react';

export default function LogHistoryPage({ checkInLogs = [], username = 'Admin' }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOrder, setSortOrder] = useState('DEFAULT');
  const [selectedYear, setSelectedYear] = useState('ALL');
  const [selectedMonth, setSelectedMonth] = useState('ALL');
  const [selectedDay, setSelectedDay] = useState('ALL');

  const years = ['2026', '2025', '2024'];
  const months = [
    { value: '01', label: 'Jan (01)' },
    { value: '02', label: 'Feb (02)' },
    { value: '03', label: 'Mar (03)' },
    { value: '04', label: 'Apr (04)' },
    { value: '05', label: 'May (05)' },
    { value: '06', label: 'Jun (06)' },
    { value: '07', label: 'Jul (07)' },
    { value: '08', label: 'Aug (08)' },
    { value: '09', label: 'Sep (09)' },
    { value: '10', label: 'Oct (10)' },
    { value: '11', label: 'Nov (11)' },
    { value: '12', label: 'Dec (12)' },
  ];
  const days = Array.from({ length: 31 }, (_, i) => String(i + 1).padStart(2, '0'));

  const filteredLogs = checkInLogs.filter((log) => {
    const matchesSearch =
      (log.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (log.passType || '').toLowerCase().includes(searchQuery.toLowerCase());

    const rawDate = log.date || '';
    let [year, month, day] = rawDate.split('-');

    if (year && year.length === 2) {
      const temp = year;
      year = `20${day}`;
      day = month;
      month = temp;
    }

    const matchesYear = selectedYear === 'ALL' || year === selectedYear;
    const matchesMonth = selectedMonth === 'ALL' || month === selectedMonth;
    const matchesDay = selectedDay === 'ALL' || day === selectedDay;

    return matchesSearch && matchesYear && matchesMonth && matchesDay;
  });

  const sortedLogs = [...filteredLogs].sort((a, b) => {
    if (sortOrder === 'NAME_ASC') return a.name.localeCompare(b.name);
    if (sortOrder === 'NAME_DESC') return b.name.localeCompare(a.name);
    if (sortOrder === 'DATE_DESC') return (b.date + b.time).localeCompare(a.date + a.time);
    if (sortOrder === 'DATE_ASC') return (a.date + a.time).localeCompare(b.date + b.time);
    return 0;
  });

  return (
    <div className="flex-1 bg-[#070a11] p-6 flex flex-col overflow-y-auto text-slate-100">
      <div className="flex justify-between items-center border-b border-amber-500/40 pb-3 mb-6">
        <h1 className="text-xl font-black uppercase tracking-wider">LOG HISTORY</h1>
        <span className="text-lg font-bold">Welcome, {username}!</span>
      </div>

      <div className="flex-1 flex items-center justify-center">
        <div className="w-full max-w-6xl bg-[#0b0f19] border border-amber-500/30 rounded-2xl p-6 space-y-4 shadow-[0_0_30px_rgba(245,158,11,0.1)]">
          <div className="flex flex-wrap items-center gap-4">
            <div className="relative flex-1 min-w-[200px]">
              <input
                type="text"
                placeholder="Search here"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#070a11] border border-amber-500/40 rounded-lg pl-9 pr-4 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-amber-400"
              />
              <span className="absolute left-3 top-2 text-amber-500">🔍</span>
            </div>

            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
              className="bg-[#070a11] border border-amber-500/40 rounded-lg px-4 py-2 text-xs text-slate-200 font-bold focus:outline-none focus:border-amber-400 cursor-pointer"
            >
              <option value="DEFAULT">Sort by</option>
              <option value="DATE_DESC">Newest First</option>
              <option value="DATE_ASC">Oldest First</option>
              <option value="NAME_ASC">Name (A-Z)</option>
              <option value="NAME_DESC">Name (Z-A)</option>
            </select>

            <div className="flex items-center gap-2">
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
                className="bg-[#070a11] border border-amber-500/40 rounded-lg px-3 py-2 text-xs text-amber-400 font-bold focus:outline-none focus:border-amber-400 cursor-pointer"
              >
                <option value="ALL">Year (All)</option>
                {years.map((y) => (<option key={y} value={y}>{y}</option>))}
              </select>

              <select
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
                className="bg-[#070a11] border border-amber-500/40 rounded-lg px-3 py-2 text-xs text-amber-400 font-bold focus:outline-none focus:border-amber-400 cursor-pointer"
              >
                <option value="ALL">Month (All)</option>
                {months.map((m) => (<option key={m.value} value={m.value}>{m.label}</option>))}
              </select>

              <select
                value={selectedDay}
                onChange={(e) => setSelectedDay(e.target.value)}
                className="bg-[#070a11] border border-amber-500/40 rounded-lg px-3 py-2 text-xs text-amber-400 font-bold focus:outline-none focus:border-amber-400 cursor-pointer"
              >
                <option value="ALL">Day (All)</option>
                {days.map((d) => (<option key={d} value={d}>{d}</option>))}
              </select>

              {(selectedYear !== 'ALL' || selectedMonth !== 'ALL' || selectedDay !== 'ALL') && (
                <button
                  onClick={() => { setSelectedYear('ALL'); setSelectedMonth('ALL'); setSelectedDay('ALL'); }}
                  className="text-slate-400 hover:text-rose-400 text-xs font-bold px-2 cursor-pointer"
                  title="Reset Date Filters"
                >
                  ✕ Clear
                </button>
              )}
            </div>
          </div>

          <div className="border border-amber-500/40 rounded-xl overflow-hidden shadow-[0_0_20px_rgba(245,158,11,0.1)]">
            <table className="w-full text-xs text-center">
              <thead>
                <tr className="border-b border-amber-500/40 bg-[#070a11]">
                  <th className="p-3 border-r border-amber-500/40 font-bold uppercase text-slate-100">NAME</th>
                  <th className="p-3 border-r border-amber-500/40 font-bold uppercase text-slate-100">WATER</th>
                  <th className="p-3 border-r border-amber-500/40 font-bold uppercase text-slate-100">SUPPLEMENT</th>
                  <th className="p-3 border-r border-amber-500/40 font-bold uppercase text-slate-100">CLASSIFICATION</th>
                  <th className="p-3 border-r border-amber-500/40 font-bold uppercase text-slate-100">PASS TYPE</th>
                  <th className="p-3 border-r border-amber-500/40 font-bold uppercase text-slate-100">CUSTOMER TYPE</th>
                  <th className="p-3 font-bold uppercase text-slate-100">DATE AND TIME</th>
                </tr>
              </thead>
              <tbody>
                {sortedLogs.length === 0 ? (
                  <tr><td colSpan="7" className="p-6 text-slate-500 italic">No transaction logs found for the selected date or search filter.</td></tr>
                ) : (
                  sortedLogs.map((log, idx) => (
                    <tr key={idx} className="border-b border-amber-500/20 hover:bg-amber-500/10 transition">
                      <td className="p-3 border-r border-amber-500/20 font-bold">{log.name}</td>
                      <td className="p-3 border-r border-amber-500/20">{log.water || 'NO'}</td>
                      <td className="p-3 border-r border-amber-500/20">{log.supplements || 'NONE'}</td>
                      <td className="p-3 border-r border-amber-500/20">{log.classification || 'MEMBER'}</td>
                      <td className="p-3 border-r border-amber-500/20">{log.passType || 'DAILY'}</td>
                      <td className="p-3 border-r border-amber-500/20">{log.type || 'REGULAR'}</td>
                      <td className="p-3 font-mono text-amber-300">{log.date} {log.time}</td>
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