import React, { useState, useEffect } from 'react';

export default function PointOfSalesPage({
  members = [],
  allDatabaseLogs = [],
  onAddMember,
  isShiftOpen,
  setIsShiftOpen,
  startingCash,
  setStartingCash,
  checkInLogs = [],
  onAddCheckInLog,
  expensesList = [],
  setExpensesList,
  initialModal,
  clearInitialModal,
  username = 'Admin',
}) {
  const [posView, setPosView] = useState('menu');
  const [activeModal, setActiveModal] = useState(null);
  const [selectedLogIndex, setSelectedLogIndex] = useState(null);

  // Dropdown open states
  const [isSuppDropdownOpen, setIsSuppDropdownOpen] = useState(false);
  const [isEditSuppDropdownOpen, setIsEditSuppDropdownOpen] = useState(false);

  // Available Supplement Options
  const supplementList = [
    'CREATINE','WHEY PROTEIN','KERATIN','TRT','FISH OIL','ANAVAR'
  ];

  useEffect(() => {
    if (initialModal) {
      if (!isShiftOpen) {
        setActiveModal('open-shift-first');
      } else {
        if (initialModal === 'avail-membership') {
          setPosView('avail-membership');
        } else {
          setActiveModal(initialModal);
          setPosView('log-customer');
        }
      }
      if (clearInitialModal) clearInitialModal();
    }
  }, [initialModal, isShiftOpen, clearInitialModal]);

  // Forms State
  const [customerForm, setCustomerForm] = useState({ 
    fullName: '', 
    water: 'NO', 
    supplements: [], 
    classification: 'NON-MEMBER', 
    passType: 'DAILY PASS', 
    customerType: 'REGULAR', 
    paymentMethod: 'CASH'
  });
  
  const [isCustomerSelected, setIsCustomerSelected] = useState(false);
  const [isMonthlySelected, setIsMonthlySelected] = useState(false);
  const [isMembershipSelected, setIsMembershipSelected] = useState(false);

  const [suggestions, setSuggestions] = useState([]);
  const [monthlySuggestions, setMonthlySuggestions] = useState([]);
  const [membershipSuggestions, setMembershipSuggestions] = useState([]);

  const [monthlyForm, setMonthlyForm] = useState({ 
    firstName: '', lastName: '', contact: '', classification: 'NON-MEMBER', customerType: 'REGULAR', dateAdded: new Date().toISOString().split('T')[0], durationMonths: 1, paymentMethod: 'CASH'
  });

  const [membershipForm, setMembershipForm] = useState({ 
    firstName: '', lastName: '', age: '', sex: 'M', contact: '', address: '', dateAdded: new Date().toISOString().split('T')[0], fee: '500.00', paymentMethod: 'CASH'
  });

  const [newExpense, setNewExpense] = useState({ desc: '', amt: '' });

  const [editLogForm, setEditLogForm] = useState({
    water: 'NO',
    supplements: []
  });

  const handleToggleSupplement = (supp, formType = 'customer') => {
    if (formType === 'customer') {
      setCustomerForm((prev) => {
        const current = prev.supplements;
        const exists = current.includes(supp);
        const updated = exists ? current.filter((s) => s !== supp) : [...current, supp];
        return { ...prev, supplements: updated };
      });
    } else {
      setEditLogForm((prev) => {
        const current = prev.supplements;
        const exists = current.includes(supp);
        const updated = exists ? current.filter((s) => s !== supp) : [...current, supp];
        return { ...prev, supplements: updated };
      });
    }
  };

  // LOG A CUSTOMER AUTOCOMPLETE
  const handleNameInputChange = (val) => {
    setCustomerForm((prev) => ({ 
      ...prev, 
      fullName: val,
    }));
    setIsCustomerSelected(false);

    if (!val.trim()) {
      setSuggestions([]);
      return;
    }

    const query = val.toUpperCase();
    const matchedMap = new Map();

    allDatabaseLogs.forEach((log) => {
      if (log.name.toUpperCase().includes(query)) {
        const existingPassType = log.passType || 'DAILY PASS';
        const existingClassification = log.classification || 'NON-MEMBER';
        const existingCustomerType = log.type || 'REGULAR';

        if (!matchedMap.has(log.name.toUpperCase())) {
          matchedMap.set(log.name.toUpperCase(), {
            name: log.name.toUpperCase(),
            classification: existingClassification,
            passType: existingPassType,
            customerType: existingCustomerType,
          });
        }
      }
    });

    members.forEach((m) => {
      if (m.name.toUpperCase().includes(query) && !matchedMap.has(m.name.toUpperCase())) {
        matchedMap.set(m.name.toUpperCase(), {
          name: m.name.toUpperCase(),
          classification: 'MEMBER',
          passType: 'DAILY PASS',
          customerType: 'REGULAR',
        });
      }
    });

    setSuggestions(Array.from(matchedMap.values()).slice(0, 5));
  };

  const handleSelectCustomer = (person) => {
    setCustomerForm({
      fullName: person.name,
      water: 'NO',
      supplements: [],
      classification: person.classification,
      passType: person.passType,
      customerType: person.customerType,
      paymentMethod: 'CASH'
    });
    setIsCustomerSelected(true);
    setSuggestions([]);
  };

  // MONTHLY PASS AUTOCOMPLETE
  const handleMonthlyNameInput = (val, isFirstName = true) => {
    const updatedFirstName = isFirstName ? val : monthlyForm.firstName;
    const updatedLastName = isFirstName ? monthlyForm.lastName : val;

    setMonthlyForm((prev) => ({
      ...prev,
      firstName: updatedFirstName,
      lastName: updatedLastName,
    }));
    setIsMonthlySelected(false);

    const searchStr = `${updatedFirstName} ${updatedLastName}`.trim();
    if (!searchStr) {
      setMonthlySuggestions([]);
      return;
    }

    const query = searchStr.toUpperCase();
    const matchedMap = new Map();

    members.forEach((m) => {
      if (m.name.toUpperCase().includes(query)) {
        matchedMap.set(m.name.toUpperCase(), {
          name: m.name.toUpperCase(),
          contact: m.contact || '',
          classification: 'MEMBER',
          customerType: 'REGULAR',
        });
      }
    });

    allDatabaseLogs.forEach((log) => {
      if (log.name.toUpperCase().includes(query) && !matchedMap.has(log.name.toUpperCase())) {
        matchedMap.set(log.name.toUpperCase(), {
          name: log.name.toUpperCase(),
          contact: '',
          classification: log.classification || 'NON-MEMBER',
          customerType: log.type || 'REGULAR',
        });
      }
    });

    setMonthlySuggestions(Array.from(matchedMap.values()).slice(0, 5));
  };

  const handleSelectMonthlyPerson = (person) => {
    const nameParts = person.name.trim().split(' ');
    const lastName = nameParts.length > 1 ? nameParts.pop() : '';
    const firstName = nameParts.join(' ');

    setMonthlyForm((prev) => ({
      ...prev,
      firstName: firstName || person.name,
      lastName: lastName,
      contact: person.contact || prev.contact,
      classification: person.classification,
      customerType: person.customerType,
    }));
    setIsMonthlySelected(true);
    setMonthlySuggestions([]);
  };

  // AVAIL MEMBERSHIP AUTOCOMPLETE (EXCLUDES EXISTING MEMBERS)
  const handleMembershipNameInput = (val, isFirstName = true) => {
    const updatedFirstName = isFirstName ? val : membershipForm.firstName;
    const updatedLastName = isFirstName ? membershipForm.lastName : val;

    setMembershipForm((prev) => ({
      ...prev,
      firstName: updatedFirstName,
      lastName: updatedLastName,
    }));
    setIsMembershipSelected(false);

    const searchStr = `${updatedFirstName} ${updatedLastName}`.trim();
    if (!searchStr) {
      setMembershipSuggestions([]);
      return;
    }

    const query = searchStr.toUpperCase();
    const matchedMap = new Map();

    // Create a Set of existing member names for fast lookup & exclusion
    const existingMemberNames = new Set(members.map((m) => m.name.toUpperCase()));

    allDatabaseLogs.forEach((log) => {
      const logName = log.name.toUpperCase();
      // Exclude if already registered in the official members list
      if (logName.includes(query) && !existingMemberNames.has(logName)) {
        if (!matchedMap.has(logName)) {
          matchedMap.set(logName, {
            name: logName,
          });
        }
      }
    });

    setMembershipSuggestions(Array.from(matchedMap.values()).slice(0, 5));
  };

  const handleSelectMembershipPerson = (person) => {
    const nameParts = person.name.trim().split(' ');
    const lastName = nameParts.length > 1 ? nameParts.pop() : '';
    const firstName = nameParts.join(' ');

    setMembershipForm((prev) => ({
      ...prev,
      firstName: firstName || person.name,
      lastName: lastName,
    }));
    setIsMembershipSelected(true);
    setMembershipSuggestions([]);
  };

  const calculateDailyTotal = (water, supplements, passType, customerType, classification) => {
    let basePrice = 0;
    if (passType === 'DAILY PASS') {
      basePrice = customerType === 'STUDENT' ? 75 : 85;
      if (classification === 'MEMBER') basePrice = Math.max(0, basePrice - 10);
    } else if (passType === 'MEMBERSHIP AVAIL') {
      basePrice = 500;
    }
    const waterPrice = water === 'YES' ? 15 : 0;
    const suppArray = Array.isArray(supplements) ? supplements : (supplements && supplements !== 'NONE' ? [supplements] : []);
    const suppPrice = suppArray.length * 50;
    return basePrice + waterPrice + suppPrice;
  };

  const calculateMonthlyTotal = () => {
    let monthlyRate = monthlyForm.customerType === 'STUDENT' ? 1000 : 1100;
    if (monthlyForm.classification === 'MEMBER') monthlyRate = Math.max(0, monthlyRate - 100);
    const months = parseInt(monthlyForm.durationMonths || 1, 10);
    return monthlyRate * months;
  };

  const totalCustomers = checkInLogs.length;
  const studentsCount = checkInLogs.filter((c) => c.type === 'STUDENT').length;
  const regularsCount = checkInLogs.filter((c) => c.type === 'REGULAR').length;
  const ticketSales = checkInLogs.reduce((sum, item) => sum + (item.amount || 0), 0);
  const startCashNum = parseFloat(startingCash || 0);
  const totalExpenses = expensesList.reduce((sum, item) => sum + item.amt, 0);
  const netSales = ticketSales - totalExpenses;
  const endingCash = startCashNum + netSales;

  const getCurrentDateTime = () => {
    const now = new Date();
    const date = now.toISOString().split('T')[0];
    const time = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
    return { date, time };
  };

  const handleRestrictedAccess = (targetView) => {
    if (!isShiftOpen) {
      setActiveModal('open-shift-first');
    } else {
      setPosView(targetView);
    }
  };

  const addCheckIn = (name, type, amount, passType, paymentMethod, classification, water, supplements, durationMonths = 1) => {
    const { date, time } = getCurrentDateTime();
    const suppString = Array.isArray(supplements) && supplements.length > 0 ? supplements.join(', ') : 'NONE';

    const newLogEntry = {
      name: name.toUpperCase(),
      date,
      time,
      type: type || 'REGULAR',
      amount,
      passType: passType || 'DAILY PASS',
      paymentMethod,
      water: water || 'NO',
      supplements: suppString,
      classification: classification || 'NON-MEMBER',
      durationMonths: durationMonths,
    };
    
    if (onAddCheckInLog) {
      onAddCheckInLog(newLogEntry);
    }
    setPosView('checkin-log');
  };

  const handleCustomerSubmit = (e) => {
    e.preventDefault();
    if (!customerForm.fullName.trim()) return;
    const finalAmount = calculateDailyTotal(
      customerForm.water, 
      customerForm.supplements, 
      customerForm.passType, 
      customerForm.customerType, 
      customerForm.classification
    );
    
    addCheckIn(
      customerForm.fullName, 
      customerForm.customerType, 
      finalAmount, 
      customerForm.passType, 
      customerForm.paymentMethod, 
      customerForm.classification,
      customerForm.water,
      customerForm.supplements,
      1
    );

    setCustomerForm({ 
      fullName: '', 
      water: 'NO', 
      supplements: [], 
      classification: 'NON-MEMBER', 
      passType: 'DAILY PASS', 
      customerType: 'REGULAR', 
      paymentMethod: 'CASH' 
    });
    setIsCustomerSelected(false);
    setIsSuppDropdownOpen(false);
    setSuggestions([]);
  };

  const handleMonthlySubmit = (e) => {
    e.preventDefault();
    if (!monthlyForm.firstName.trim()) return;
    const fullName = `${monthlyForm.firstName} ${monthlyForm.lastName}`.toUpperCase();
    const finalAmount = calculateMonthlyTotal();
    
    addCheckIn(
      fullName,
      monthlyForm.customerType,
      finalAmount,
      'MONTHLY PASS',
      monthlyForm.paymentMethod,
      monthlyForm.classification,
      'NO',
      'NONE',
      parseInt(monthlyForm.durationMonths, 10)
    );

    setMonthlyForm({ firstName: '', lastName: '', contact: '', classification: 'NON-MEMBER', customerType: 'REGULAR', dateAdded: new Date().toISOString().split('T')[0], durationMonths: 1, paymentMethod: 'CASH' });
    setIsMonthlySelected(false);
  };

  const handleAvailMembershipSubmit = (e) => {
    e.preventDefault();
    if (!membershipForm.firstName.trim()) return;

    const fullName = `${membershipForm.firstName} ${membershipForm.lastName}`.toUpperCase();
    const feeNum = parseFloat(membershipForm.fee) || 500;
    
    addCheckIn(
      fullName,
      'REGULAR',
      feeNum,
      'MEMBERSHIP AVAIL',
      membershipForm.paymentMethod,
      'MEMBER',
      'NO',
      'NONE',
      1
    );

    if (onAddMember) {
      onAddMember({
        name: fullName,
        age: membershipForm.age || 'N/A',
        sex: membershipForm.sex,
        contact: membershipForm.contact || 'N/A',
        status: 'ACTIVE',
        address: membershipForm.address.toUpperCase() || 'N/A',
        dateJoined: membershipForm.dateAdded,
      });
    }

    setMembershipForm({ firstName: '', lastName: '', age: '', sex: 'M', contact: '', address: '', dateAdded: new Date().toISOString().split('T')[0], fee: '500.00', paymentMethod: 'CASH' });
    setIsMembershipSelected(false);
  };

  const handleExpenseSubmit = (e) => {
    e.preventDefault();
    if (!newExpense.desc || !newExpense.amt) return;
    setExpensesList([...expensesList, { id: Date.now(), desc: newExpense.desc.toUpperCase(), amt: parseFloat(newExpense.amt) }]);
    setNewExpense({ desc: '', amt: '' });
    setActiveModal(null);
  };

  const handleOpenEditLogModal = (idx) => {
    const targetLog = checkInLogs[idx];
    if (!targetLog) return;
    
    const existingSupps = targetLog.supplements && targetLog.supplements !== 'NONE'
      ? targetLog.supplements.split(', ')
      : [];

    setSelectedLogIndex(idx);
    setEditLogForm({
      water: targetLog.water || 'NO',
      supplements: existingSupps
    });
    setIsEditSuppDropdownOpen(false);
    setActiveModal('edit-checkin-log');
  };

  const handleSaveEditedLog = (e) => {
    e.preventDefault();
    if (selectedLogIndex === null) return;

    const targetLog = checkInLogs[selectedLogIndex];
    const newAmount = calculateDailyTotal(
      editLogForm.water,
      editLogForm.supplements,
      targetLog.passType,
      targetLog.type,
      targetLog.classification
    );

    const suppString = editLogForm.supplements.length > 0 ? editLogForm.supplements.join(', ') : 'NONE';

    checkInLogs[selectedLogIndex] = {
      ...targetLog,
      water: editLogForm.water,
      supplements: suppString,
      amount: newAmount
    };

    setActiveModal(null);
    setSelectedLogIndex(null);
    setIsEditSuppDropdownOpen(false);
  };

  return (
    <div className="flex-1 bg-[#070a11] p-6 flex flex-col overflow-y-auto relative text-slate-100">
      <div className="flex justify-between items-center border-b border-amber-500/40 pb-3 mb-6">
        <h1 className="text-xl font-black uppercase tracking-wider">POINT OF SALES</h1>
        <span className="text-lg font-bold">Welcome, {username}!</span>
      </div>

      {posView === 'menu' && (
        <div className="flex-1 flex items-center justify-center">
          <div className="w-full max-w-4xl bg-[#0b0f19] border-2 border-amber-500/60 rounded-3xl p-12 shadow-[0_0_40px_rgba(147,51,234,0.3)]">
            <div className="grid grid-cols-2 gap-8">
              {[
                { label: 'LOG A CUSTOMER', action: () => handleRestrictedAccess('log-customer') },
                { label: 'CHECK-IN LOG', action: () => handleRestrictedAccess('checkin-log') },
                { label: 'DAILY SALES DASHBOARD', action: () => handleRestrictedAccess('daily-sales') },
                { label: 'ADD EXPENSES', action: () => handleRestrictedAccess('expenses') },
                { label: 'MONTHLY REPORT', action: () => setActiveModal('coming-soon') },
                { label: 'HISTORY', action: () => setActiveModal('coming-soon') },
                { label: 'SETTINGS', action: () => setActiveModal('coming-soon') },
                { label: isShiftOpen ? 'CLOSE SHIFT' : 'OPEN SHIFT', action: () => setActiveModal(isShiftOpen ? 'close-shift' : 'open-shift') },
              ].map((btn, idx) => (
                <button key={idx} type="button" onClick={btn.action} className="bg-[#7c6200] hover:bg-[#967700] border border-amber-400 font-black text-sm tracking-wider py-6 px-4 rounded-xl shadow-lg transition cursor-pointer uppercase">
                  {btn.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* LOG A CUSTOMER */}
      {posView === 'log-customer' && (
        <ViewCard title="LOG A CUSTOMER" onBack={() => setPosView('menu')}>
          <div className="absolute top-8 right-8 flex gap-2">
            <button type="button" onClick={() => setPosView('avail-membership')} className="border border-amber-500/60 bg-[#070a11] text-amber-400 text-xs font-bold px-3 py-2 rounded-lg hover:bg-amber-500 hover:text-slate-950 transition uppercase cursor-pointer">
              AVAIL MEMBERSHIP
            </button>
            <button type="button" onClick={() => setPosView('monthly-pass')} className="border border-amber-500/60 bg-[#070a11] text-amber-400 text-xs font-bold px-3 py-2 rounded-lg hover:bg-amber-500 hover:text-slate-950 transition uppercase cursor-pointer">
              AVAIL MONTHLY PASS
            </button>
          </div>

          <form onSubmit={handleCustomerSubmit} className="space-y-4 pt-2">
            <div className="relative">
              <label className="block text-xs font-semibold mb-1">Full Name</label>
              <input 
                type="text" 
                placeholder="Type or search full name" 
                value={customerForm.fullName} 
                onChange={(e) => handleNameInputChange(e.target.value)} 
                required 
                className="w-full bg-[#070a11] border border-amber-500/40 rounded-lg px-4 py-2 text-xs font-bold text-slate-100 focus:outline-none focus:border-amber-400" 
              />
              {suggestions.length > 0 && (
                <div className="absolute top-full left-0 right-0 bg-[#070a11] border border-amber-400 rounded-lg mt-1 z-30 overflow-hidden shadow-2xl">
                  {suggestions.map((person, idx) => (
                    <div
                      key={idx}
                      onClick={() => handleSelectCustomer(person)}
                      className="px-4 py-2 hover:bg-amber-500/20 cursor-pointer text-xs font-bold flex justify-between items-center border-b border-amber-500/10 last:border-0"
                    >
                      <span>{person.name}</span>
                      <span className="text-[10px] text-amber-400 font-mono">[{person.classification} • {person.passType}]</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormSelect label="Water (+P15)" value={customerForm.water} onChange={(val) => setCustomerForm({ ...customerForm, water: val })} options={['NO', 'YES']} />
              
              <div className="relative">
                <label className="block text-xs font-semibold mb-1">Supplements (+P50 each)</label>
                <div 
                  onClick={() => setIsSuppDropdownOpen(!isSuppDropdownOpen)}
                  className="w-full bg-[#070a11] border border-amber-500/40 rounded-lg px-4 py-2 text-xs font-bold text-slate-100 focus:border-amber-400 flex justify-between items-center cursor-pointer select-none"
                >
                  <span className="truncate pr-2">
                    {customerForm.supplements.length > 0 ? customerForm.supplements.join(', ') : 'NONE'}
                  </span>
                  <span className="text-amber-400 text-xs">▼</span>
                </div>

                {isSuppDropdownOpen && (
                  <div className="absolute top-full left-0 right-0 mt-1 bg-[#070a11] border border-amber-400 rounded-lg shadow-2xl z-40 p-2 max-h-48 overflow-y-auto space-y-1">
                    {supplementList.map((supp) => {
                      const isSelected = customerForm.supplements.includes(supp);
                      return (
                        <div
                          key={supp}
                          onClick={() => handleToggleSupplement(supp, 'customer')}
                          className={`flex items-center justify-between px-3 py-2 rounded text-xs font-bold cursor-pointer transition ${isSelected ? 'bg-amber-500/20 text-amber-300' : 'hover:bg-slate-800 text-slate-300'}`}
                        >
                          <span>{supp}</span>
                          <span>{isSelected ? '✓' : ''}</span>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {isCustomerSelected ? (
                <div>
                  <label className="block text-xs font-semibold mb-1">Classification (Auto-filled)</label>
                  <input type="text" readOnly value={customerForm.classification} className="w-full bg-slate-900/60 border border-amber-500/40 rounded-lg px-4 py-2.5 text-xs text-amber-300 font-bold focus:outline-none cursor-not-allowed" />
                </div>
              ) : (
                <FormSelect label="Classification" value={customerForm.classification} onChange={(val) => setCustomerForm({ ...customerForm, classification: val })} options={['NON-MEMBER', 'MEMBER']} />
              )}

              {isCustomerSelected ? (
                <div>
                  <label className="block text-xs font-semibold mb-1">Pass Type (Auto-filled)</label>
                  <input type="text" readOnly value={customerForm.passType} className="w-full bg-slate-900/60 border border-amber-500/40 rounded-lg px-4 py-2.5 text-xs text-amber-300 font-bold focus:outline-none cursor-not-allowed" />
                </div>
              ) : (
                <FormSelect label="Pass Type" value={customerForm.passType} onChange={(val) => setCustomerForm({ ...customerForm, passType: val })} options={['DAILY PASS', 'MONTHLY PASS']} />
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              {isCustomerSelected ? (
                <div>
                  <label className="block text-xs font-semibold mb-1">Customer Type (Auto-filled)</label>
                  <input type="text" readOnly value={customerForm.customerType} className="w-full bg-slate-900/60 border border-amber-500/40 rounded-lg px-4 py-2.5 text-xs text-amber-300 font-bold focus:outline-none cursor-not-allowed" />
                </div>
              ) : (
                <FormSelect 
                  label="Customer Type" 
                  value={customerForm.customerType} 
                  onChange={(val) => setCustomerForm({ ...customerForm, customerType: val })} 
                  options={['REGULAR', 'STUDENT']} 
                />
              )}
              <FormSelect label="Payment Method" value={customerForm.paymentMethod} onChange={(val) => setCustomerForm({ ...customerForm, paymentMethod: val })} options={['CASH', 'ONLINE PAYMENT']} />
            </div>

            <FormFooter amount={calculateDailyTotal(customerForm.water, customerForm.supplements, customerForm.passType, customerForm.customerType, customerForm.classification).toFixed(2)} />
          </form>
        </ViewCard>
      )}

      {/* MONTHLY PASS */}
      {posView === 'monthly-pass' && (
        <ViewCard title="MONTHLY PASS" onBack={() => setPosView('log-customer')}>
          <form onSubmit={handleMonthlySubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="relative">
                <label className="block text-xs font-semibold mb-1">First Name</label>
                <input 
                  type="text" 
                  value={monthlyForm.firstName} 
                  onChange={(e) => handleMonthlyNameInput(e.target.value, true)} 
                  placeholder="First Name" 
                  required 
                  className="w-full bg-[#070a11] border border-amber-500/40 rounded-lg px-4 py-2 text-xs font-bold text-slate-100 focus:outline-none focus:border-amber-400" 
                />
                {monthlySuggestions.length > 0 && (
                  <div className="absolute top-full left-0 right-0 bg-[#070a11] border border-amber-400 rounded-lg mt-1 z-30 overflow-hidden shadow-2xl">
                    {monthlySuggestions.map((person, idx) => (
                      <div
                        key={idx}
                        onClick={() => handleSelectMonthlyPerson(person)}
                        className="px-4 py-2 hover:bg-amber-500/20 cursor-pointer text-xs font-bold flex justify-between items-center border-b border-amber-500/10 last:border-0"
                      >
                        <span>{person.name}</span>
                        <span className="text-[10px] text-amber-400 font-mono">[{person.classification}]</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1">Last Name</label>
                <input 
                  type="text" 
                  value={monthlyForm.lastName} 
                  onChange={(e) => handleMonthlyNameInput(e.target.value, false)} 
                  placeholder="Last Name" 
                  required 
                  className="w-full bg-[#070a11] border border-amber-500/40 rounded-lg px-4 py-2 text-xs font-bold text-slate-100 focus:outline-none focus:border-amber-400" 
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold mb-1">Contact</label>
              {isMonthlySelected ? (
                <input 
                  type="text" 
                  readOnly 
                  value={monthlyForm.contact} 
                  placeholder="09XXXXXXXXX" 
                  className="w-full bg-slate-900/60 border border-amber-500/40 rounded-lg px-4 py-2.5 text-xs text-amber-300 font-bold focus:outline-none cursor-not-allowed" 
                />
              ) : (
                <input 
                  type="text" 
                  value={monthlyForm.contact} 
                  onChange={(e) => setMonthlyForm({ ...monthlyForm, contact: e.target.value })} 
                  placeholder="09XXXXXXXXX" 
                  className="w-full bg-[#070a11] border border-amber-500/40 rounded-lg px-4 py-2 text-xs font-bold text-slate-100 focus:outline-none focus:border-amber-400" 
                />
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              {isMonthlySelected ? (
                <div>
                  <label className="block text-xs font-semibold mb-1">Classification (Auto-filled)</label>
                  <input 
                    type="text" 
                    readOnly 
                    value={monthlyForm.classification} 
                    className="w-full bg-slate-900/60 border border-amber-500/40 rounded-lg px-4 py-2.5 text-xs text-amber-300 font-bold focus:outline-none cursor-not-allowed" 
                  />
                </div>
              ) : (
                <FormSelect label="Classification (-P100 Member Discount)" value={monthlyForm.classification} onChange={(val) => setMonthlyForm({ ...monthlyForm, classification: val })} options={['NON-MEMBER', 'MEMBER']} />
              )}

              {isMonthlySelected ? (
                <div>
                  <label className="block text-xs font-semibold mb-1">Customer Type (Auto-filled)</label>
                  <input 
                    type="text" 
                    readOnly 
                    value={monthlyForm.customerType} 
                    className="w-full bg-slate-900/60 border border-amber-500/40 rounded-lg px-4 py-2.5 text-xs text-amber-300 font-bold focus:outline-none cursor-not-allowed" 
                  />
                </div>
              ) : (
                <FormSelect label="Customer Type" value={monthlyForm.customerType} onChange={(val) => setMonthlyForm({ ...monthlyForm, customerType: val })} options={['REGULAR', 'STUDENT']} />
              )}
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold mb-1">Date Added</label>
                <input type="date" value={monthlyForm.dateAdded} onChange={(e) => setMonthlyForm({ ...monthlyForm, dateAdded: e.target.value })} className="w-full bg-[#070a11] border border-amber-500/40 rounded-lg px-3 py-2 text-xs text-slate-100 font-bold focus:outline-none"/>
              </div>
              <FormSelect label="Duration (1 Month = 30 Days)" value={monthlyForm.durationMonths} onChange={(val) => setMonthlyForm({ ...monthlyForm, durationMonths: parseInt(val, 10) })} options={['1', '2', '3', '4', '6', '12']} />
              <FormSelect label="Payment Method" value={monthlyForm.paymentMethod} onChange={(val) => setMonthlyForm({ ...monthlyForm, paymentMethod: val })} options={['CASH', 'ONLINE PAYMENT']} />
            </div>
            <FormFooter amount={calculateMonthlyTotal().toFixed(2)} />
          </form>
        </ViewCard>
      )}

      {/* AVAIL MEMBERSHIP */}
      {posView === 'avail-membership' && (
        <ViewCard title="AVAIL MEMBERSHIP" onBack={() => setPosView('log-customer')}>
          <form onSubmit={handleAvailMembershipSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="relative">
                <label className="block text-xs font-semibold mb-1">First Name</label>
                <input 
                  type="text" 
                  value={membershipForm.firstName} 
                  onChange={(e) => handleMembershipNameInput(e.target.value, true)} 
                  placeholder="First Name" 
                  required 
                  className="w-full bg-[#070a11] border border-amber-500/40 rounded-lg px-4 py-2 text-xs font-bold text-slate-100 focus:outline-none focus:border-amber-400" 
                />
                {membershipSuggestions.length > 0 && (
                  <div className="absolute top-full left-0 right-0 bg-[#070a11] border border-amber-400 rounded-lg mt-1 z-30 overflow-hidden shadow-2xl">
                    {membershipSuggestions.map((person, idx) => (
                      <div
                        key={idx}
                        onClick={() => handleSelectMembershipPerson(person)}
                        className="px-4 py-2 hover:bg-amber-500/20 cursor-pointer text-xs font-bold flex justify-between items-center border-b border-amber-500/10 last:border-0"
                      >
                        <span>{person.name}</span>
                        <span className="text-[10px] text-amber-400 font-mono">[NON-MEMBER]</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1">Last Name</label>
                <input 
                  type="text" 
                  value={membershipForm.lastName} 
                  onChange={(e) => handleMembershipNameInput(e.target.value, false)} 
                  placeholder="Last Name" 
                  required 
                  className="w-full bg-[#070a11] border border-amber-500/40 rounded-lg px-4 py-2 text-xs font-bold text-slate-100 focus:outline-none focus:border-amber-400" 
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormInput 
                label="Age" 
                value={membershipForm.age} 
                onChange={(val) => {
                  if (val === '') {
                    setMembershipForm({ ...membershipForm, age: '' });
                    return;
                  }
                  const num = parseInt(val, 10);
                  if (!isNaN(num)) {
                    const clampedAge = Math.min(100, Math.max(1, num));
                    setMembershipForm({ ...membershipForm, age: clampedAge.toString() });
                  }
                }} 
                placeholder="Age" 
                type="number" 
                min="1" 
                max="100"
              />
              <FormSelect label="Sex" value={membershipForm.sex} onChange={(val) => setMembershipForm({ ...membershipForm, sex: val })} options={['M', 'F']} />
            </div>

            <FormInput label="Contact" value={membershipForm.contact} onChange={(val) => setMembershipForm({ ...membershipForm, contact: val })} placeholder="09XXXXXXXXX" />
            <FormInput label="Address" value={membershipForm.address} onChange={(val) => setMembershipForm({ ...membershipForm, address: val })} placeholder="City / Location" />

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold mb-1">Date Added</label>
                <input 
                  type="date" 
                  value={membershipForm.dateAdded} 
                  onChange={(e) => setMembershipForm({ ...membershipForm, dateAdded: e.target.value })} 
                  className="w-full bg-[#070a11] border border-amber-500/40 rounded-lg px-3 py-2 text-xs text-slate-100 font-bold focus:outline-none"
                />
              </div>
              <FormSelect label="Payment Method" value={membershipForm.paymentMethod} onChange={(val) => setMembershipForm({ ...membershipForm, paymentMethod: val })} options={['CASH', 'ONLINE PAYMENT']} />
            </div>

            <FormFooter amount={parseFloat(membershipForm.fee || 500).toFixed(2)} buttonLabel="SUBMIT & REGISTER" />
          </form>
        </ViewCard>
      )}

      {/* CHECK-IN LOG TABLE */}
      {posView === 'checkin-log' && (
        <TableCard title="CHECK-IN LOG" onBack={() => setPosView('menu')} rightBtn="+" onRightBtnClick={() => setPosView('log-customer')}>
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-amber-500/40 bg-[#070a11]">
                <th className="p-2 border-r border-amber-500/40 font-bold uppercase text-center">NAME</th>
                <th className="p-2 border-r border-amber-500/40 font-bold uppercase text-center">CLASSIFICATION</th>
                <th className="p-2 border-r border-amber-500/40 font-bold uppercase text-center">CLASS TYPE</th>
                <th className="p-2 border-r border-amber-500/40 font-bold uppercase text-center">PASS TYPE</th>
                <th className="p-2 font-bold uppercase text-center w-36">DATE AND TIME</th>
              </tr>
            </thead>
            <tbody>
              {checkInLogs.length === 0 ? (
                <tr><td colSpan="5" className="p-4 text-center text-slate-500 italic">No customer logs for this shift yet.</td></tr>
              ) : (
                checkInLogs.map((item, idx) => (
                  <tr key={idx} className="border-b border-amber-500/20 hover:bg-amber-500/10 transition">
                    <td className="p-2 border-r border-amber-500/20 pl-4 font-semibold">
                      <button
                        type="button"
                        onClick={() => handleOpenEditLogModal(idx)}
                        className="text-amber-300 font-bold hover:underline cursor-pointer text-left"
                      >
                        {idx + 1}. {item.name}
                      </button>
                    </td>
                    <td className="p-2 border-r border-amber-500/20 text-center font-bold text-amber-400">{item.classification || 'NON-MEMBER'}</td>
                    <td className="p-2 border-r border-amber-500/20 text-center font-bold text-slate-200">{item.type || 'REGULAR'}</td>
                    <td className="p-2 border-r border-amber-500/20 text-center font-bold text-amber-300">{item.passType || 'DAILY PASS'}</td>
                    <td className="p-2 text-center font-mono text-amber-300">{item.date} {item.time}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </TableCard>
      )}

      {/* DAILY SALES DASHBOARD */}
      {posView === 'daily-sales' && (
        <TableCard title="DAILY SALES DASHBOARD" onBack={() => setPosView('menu')} rightBtn="🖨 PRINT">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-amber-500/40 bg-[#070a11]">
                <th className="p-3 border-r border-amber-500/40 font-bold uppercase">DESCRIPTION</th>
                <th className="p-3 font-bold uppercase text-center">AMOUNT</th>
              </tr>
            </thead>
            <tbody>
              {[
                { desc: 'STARTING CASH', amt: `P ${startCashNum.toFixed(2)}` },
                { desc: 'TOTAL CUSTOMERS', amt: totalCustomers },
                { desc: 'STUDENTS', amt: studentsCount },
                { desc: 'REGULAR', amt: regularsCount },
                { desc: 'CASH PAYMENTS', amt: `P ${ticketSales.toFixed(2)}` },
                { desc: 'NON CASH PAYMENTS', amt: 'P 0.00' },
                { desc: 'GROSS SALES', amt: `P ${ticketSales.toFixed(2)}` },
                { desc: 'EXPENSES', amt: `P ${totalExpenses.toFixed(2)}` },
                { desc: 'NET SALES', amt: `P ${netSales.toFixed(2)}` },
                { desc: 'ENDING CASH (SYSTEM)', amt: `P ${endingCash.toFixed(2)}` },
                { desc: 'ACTUAL CASH REMIT', amt: `P ${endingCash.toFixed(2)}` },
                { desc: 'DIFFERENCE', amt: '+0' },
              ].map((row, idx) => (
                <tr key={idx} className="border-b border-amber-500/20">
                  <td className="p-2.5 border-r border-amber-500/20 pl-6 font-bold uppercase">{row.desc}</td>
                  <td className="p-2.5 text-center font-mono font-bold text-amber-300">{row.amt}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </TableCard>
      )}

      {/* EXPENSES */}
      {posView === 'expenses' && (
        <TableCard title="EXPENSES" onBack={() => setPosView('menu')} rightBtn="+ ADD EXPENSES" onRightBtnClick={() => setActiveModal('add-expense')}>
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-amber-500/40 bg-[#070a11]">
                <th className="p-3 border-r border-amber-500/40 font-bold uppercase">DESCRIPTION</th>
                <th className="p-3 font-bold uppercase text-center">AMOUNT</th>
              </tr>
            </thead>
            <tbody>
              {expensesList.length === 0 ? (
                <tr><td colSpan="2" className="p-4 text-center text-slate-500 italic">No expenses recorded for this shift.</td></tr>
              ) : (
                expensesList.map((item) => (
                  <tr key={item.id} className="border-b border-amber-500/20">
                    <td className="p-2.5 border-r border-amber-500/20 pl-6 font-bold uppercase">{item.desc}</td>
                    <td className="p-2.5 text-center font-mono font-bold text-amber-300">P {item.amt.toFixed(2)}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </TableCard>
      )}

      {/* MODALS */}
      {activeModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          {activeModal === 'open-shift-first' && (
            <ModalBox title="Open Shift First!" onClose={() => setActiveModal(null)}>
              <p className="text-xs font-semibold text-slate-200">You must open a shift before accessing sales and customer logs.</p>
              <div className="flex justify-center pt-2">
                <button type="button" onClick={() => setActiveModal('open-shift')} className="bg-[#4a3b00] border border-amber-400 text-xs font-bold px-6 py-2 rounded-lg cursor-pointer uppercase">OPEN SHIFT NOW</button>
              </div>
            </ModalBox>
          )}

          {activeModal === 'coming-soon' && (
            <ModalBox title="Coming Soon!" onClose={() => setActiveModal(null)}>
              <p className="text-xs font-semibold text-slate-200">This feature is currently under development.</p>
            </ModalBox>
          )}

          {activeModal === 'open-shift' && (
            <ModalBox title="OPEN SHIFT" onClose={() => setActiveModal(null)}>
              <div className="space-y-2">
                <label className="block text-xs font-extrabold uppercase">ENTER STARTING CASH:</label>
                <div className="bg-[#4a3b00] border-2 border-amber-400 rounded-xl px-4 py-2">
                  <input type="text" placeholder="1000.00" value={startingCash} onChange={(e) => setStartingCash(e.target.value.replace(/[^0-9.]/g, ''))} className="w-full bg-transparent text-center font-black text-sm focus:outline-none" />
                </div>
              </div>
              <button type="button" onClick={() => { setIsShiftOpen(true); setActiveModal(null); }} className="bg-[#4a3b00] border border-amber-400 text-xs font-bold px-8 py-2 rounded-lg cursor-pointer uppercase">SUBMIT</button>
            </ModalBox>
          )}

          {activeModal === 'close-shift' && (
            <ModalBox title="CLOSE SHIFT" onClose={() => setActiveModal(null)}>
              <div className="space-y-2">
                <label className="block text-xs font-extrabold uppercase">ENTER ENDING CASH REMIT:</label>
                <div className="bg-[#4a3b00] border-2 border-amber-400 rounded-xl px-4 py-2">
                  <input type="text" defaultValue={`P ${endingCash.toFixed(2)}`} className="w-full bg-transparent text-center font-black text-sm focus:outline-none" />
                </div>
              </div>
              <button type="button" onClick={() => { setIsShiftOpen(false); setActiveModal(null); setExpensesList([]); }} className="bg-[#4a3b00] border border-amber-400 text-xs font-bold px-8 py-2 rounded-lg cursor-pointer uppercase">SUBMIT & CLOSE</button>
            </ModalBox>
          )}

          {activeModal === 'add-expense' && (
            <ModalBox title="ADD EXPENSE" onClose={() => setActiveModal(null)}>
              <form onSubmit={handleExpenseSubmit} className="space-y-3 text-left text-xs font-bold">
                <FormInput label="DESCRIPTION:" value={newExpense.desc} onChange={(val) => setNewExpense({ ...newExpense, desc: val })} placeholder="e.g. Delivery Water" required />
                <FormInput label="AMOUNT (PHP):" value={newExpense.amt} onChange={(val) => setNewExpense({ ...newExpense, amt: val })} placeholder="100.00" type="number" required />
                <div className="flex justify-center pt-2">
                  <button type="submit" className="bg-[#4a3b00] border border-amber-400 text-xs font-bold px-8 py-2 rounded-lg cursor-pointer uppercase">SUBMIT</button>
                </div>
              </form>
            </ModalBox>
          )}

          {activeModal === 'edit-checkin-log' && selectedLogIndex !== null && (
            <ModalBox title="ADD WATER / SUPPLEMENTS" onClose={() => setActiveModal(null)}>
              <form onSubmit={handleSaveEditedLog} className="space-y-4 text-left text-xs font-bold">
                <div className="text-center font-extrabold text-amber-300 text-sm">
                  {checkInLogs[selectedLogIndex]?.name}
                </div>
                
                <FormSelect 
                  label="Water (+P15)" 
                  value={editLogForm.water} 
                  onChange={(val) => setEditLogForm({ ...editLogForm, water: val })} 
                  options={['NO', 'YES']} 
                />

                <div className="relative">
                  <label className="block text-xs font-semibold mb-1">Supplements (+P50 each)</label>
                  <div 
                    onClick={() => setIsEditSuppDropdownOpen(!isEditSuppDropdownOpen)}
                    className="w-full bg-[#070a11] border border-amber-500/40 rounded-lg px-4 py-2 text-xs font-bold text-slate-100 focus:border-amber-400 flex justify-between items-center cursor-pointer select-none"
                  >
                    <span className="truncate pr-2">
                      {editLogForm.supplements.length > 0 ? editLogForm.supplements.join(', ') : 'NONE'}
                    </span>
                    <span className="text-amber-400 text-xs">▼</span>
                  </div>

                  {isEditSuppDropdownOpen && (
                    <div className="absolute top-full left-0 right-0 mt-1 bg-[#070a11] border border-amber-400 rounded-lg shadow-2xl z-40 p-2 max-h-40 overflow-y-auto space-y-1">
                      {supplementList.map((supp) => {
                        const isSelected = editLogForm.supplements.includes(supp);
                        return (
                          <div
                            key={supp}
                            onClick={() => handleToggleSupplement(supp, 'edit')}
                            className={`flex items-center justify-between px-3 py-2 rounded text-xs font-bold cursor-pointer transition ${isSelected ? 'bg-amber-500/20 text-amber-300' : 'hover:bg-slate-800 text-slate-300'}`}
                          >
                            <span>{supp}</span>
                            <span>{isSelected ? '✓' : ''}</span>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

                <div className="flex justify-center pt-2">
                  <button type="submit" className="bg-[#4a3b00] border border-amber-400 text-xs font-bold px-8 py-2 rounded-lg cursor-pointer uppercase">
                    UPDATE & SAVE
                  </button>
                </div>
              </form>
            </ModalBox>
          )}
        </div>
      )}
    </div>
  );
}

function ViewCard({ title, onBack, children }) {
  return (
    <div className="flex-1 flex items-center justify-center">
      <div className="w-full max-w-3xl bg-[#0b0f19] border-2 border-amber-500/60 shadow-[0_0_30px_rgba(245,158,11,0.2)] rounded-3xl p-8 space-y-6 relative">
        <button type="button" onClick={onBack} className="text-slate-100 font-extrabold text-lg tracking-wider hover:text-amber-400 cursor-pointer uppercase">‹ {title}</button>
        {children}
      </div>
    </div>
  );
}

function TableCard({ title, onBack, rightBtn, onRightBtnClick, children }) {
  return (
    <div className="flex-1 flex items-center justify-center">
      <div className="w-full max-w-4xl bg-[#0b0f19] border border-amber-500/30 rounded-2xl p-6 space-y-4">
        <div className="flex justify-between items-center">
          <button type="button" onClick={onBack} className="text-slate-100 font-extrabold text-lg tracking-wider hover:text-amber-400 cursor-pointer uppercase">‹ {title}</button>
          {rightBtn && <button type="button" onClick={onRightBtnClick} className="border border-amber-500/60 text-amber-400 text-xs font-bold px-4 py-2 rounded-lg hover:bg-amber-500 hover:text-slate-950 transition cursor-pointer uppercase">{rightBtn}</button>}
        </div>
        <div className="border border-amber-500/40 rounded-xl overflow-hidden min-h-[160px]">{children}</div>
      </div>
    </div>
  );
}

function FormInput({ label, value, onChange, placeholder, type = "text", required, min, max }) {
  return (
    <div>
      <label className="block text-xs font-semibold mb-1">{label}</label>
      <input 
        type={type} 
        min={min}
        max={max}
        placeholder={placeholder} 
        value={value} 
        onChange={(e) => onChange(e.target.value)} 
        required={required} 
        className="w-full bg-[#070a11] border border-amber-500/40 rounded-lg px-4 py-2 text-xs font-bold text-slate-100 focus:outline-none focus:border-amber-400" 
      />
    </div>
  );
}

function FormSelect({ label, value, onChange, options }) {
  return (
    <div>
      <label className="block text-xs font-semibold mb-1">{label}</label>
      <select 
        value={value} 
        onChange={(e) => onChange(e.target.value)} 
        className="w-full bg-[#070a11] border border-amber-500/40 rounded-lg px-4 py-2.5 text-xs text-slate-100 font-bold focus:outline-none focus:border-amber-400"
      >
        {options.map((opt) => <option key={opt} value={opt}>{opt}</option>)}
      </select>
    </div>
  );
}

function FormFooter({ amount, buttonLabel = "SUBMIT" }) {
  return (
    <>
      <div className="pt-4 border-t border-amber-500/20 flex justify-between items-center text-xs font-bold">
        <span>AMOUNT:</span>
        <span className="text-sm font-mono text-amber-400">P {amount}</span>
      </div>
      <div className="flex justify-center pt-2">
        <button type="submit" className="border border-amber-500/60 bg-[#070a11] text-amber-400 text-xs font-bold px-8 py-2.5 rounded-lg hover:bg-amber-500 hover:text-slate-950 transition cursor-pointer uppercase">{buttonLabel}</button>
      </div>
    </>
  );
}

function ModalBox({ title, onClose, children }) {
  return (
    <div className="w-full max-w-md bg-[#7c6200] border-2 border-amber-400 rounded-2xl p-6 text-center shadow-[0_0_40px_rgba(245,158,11,0.4)] relative space-y-4">
      <button type="button" onClick={onClose} className="absolute top-3 right-4 hover:text-amber-300 font-bold text-xl cursor-pointer">✕</button>
      <h2 className="text-2xl font-black uppercase tracking-wider">{title}</h2>
      {children}
    </div>
  );
}