import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import DashboardPage from './pages/DashboardPage';
import PointOfSalesPage from './pages/PointOfSalesPage';
import MemberManagementPage from './pages/MemberManagementPage';
import LogHistoryPage from './pages/LogHistoryPage';
import SettingsPage from './pages/SettingsPage';
import LoginPage from './pages/LoginPage';

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('Admin');
  const [currentPage, setCurrentPage] = useState('dashboard');

  const [checkInLogs, setCheckInLogs] = useState([]);

  const [historyLogs, setHistoryLogs] = useState([
    { id: 1, name: 'RONNIE COLEMAN', water: 'YES', supplements: 'KERATIN', classification: 'MEMBER', passType: 'MONTHLY PASS', type: 'REGULAR', date: '2026-09-23', time: '10:10', amount: 1000, durationMonths: 1 },
    { id: 2, name: 'JAY CUTLER', water: 'NO', supplements: 'WHEY PROTEIN', classification: 'MEMBER', passType: 'MONTHLY PASS', type: 'REGULAR', date: '2026-09-22', time: '09:30', amount: 1000, durationMonths: 1 },
    { id: 3, name: 'CHRIS BUMSTEAD', water: 'YES', supplements: 'CREATINE', classification: 'NON-MEMBER', passType: 'DAILY PASS', type: 'STUDENT', date: '2026-09-22', time: '15:45', amount: 140 },
    { id: 4, name: 'ARNOLD SCHWARZENIGGER', water: 'YES', supplements: 'NONE', classification: 'MEMBER', passType: 'MONTHLY PASS', type: 'REGULAR', date: '2026-08-15', time: '08:00', amount: 1000, durationMonths: 1 },
    { id: 5, name: 'DAVID LAID', water: 'NO', supplements: 'WHEY PROTEIN', classification: 'MEMBER', passType: 'DAILY PASS', type: 'REGULAR', date: '2026-07-04', time: '17:20', amount: 125 },
    { id: 6, name: 'WILL TENNYSON', water: 'YES', supplements: 'CREATINE', classification: 'MEMBER', passType: 'DAILY PASS', type: 'REGULAR', date: '2026-07-04', time: '17:20', amount: 140 },
    { id: 7, name: 'JEFF NIPPARD', water: 'YES', supplements: 'WHEY PROTEIN', classification: 'NON-MEMBER', passType: 'DAILY PASS', type: 'REGULAR', date: '2026-07-04', time: '17:20', amount: 150 },
    { id: 8, name: 'LARRY WHEELS', water: 'YES', supplements: 'TRT', classification: 'NON-MEMBER', passType: 'MONTHLY PASS', type: 'REGULAR', date: '2026-07-04', time: '17:20', amount: 1100, durationMonths: 1 },
    { id: 9, name: 'DORIAN YATES', water: 'NO', supplements: 'FISH OIL', classification: 'MEMBER', passType: 'MONTHLY PASS', type: 'REGULAR', date: '2026-07-04', time: '17:20', amount: 1000, durationMonths: 1 },
    { id: 10, name: 'TOM PLATZ', water: 'YES', supplements: 'WHEY PROTEIN', classification: 'MEMBER', passType: 'MONTHLY PASS', type: 'REGULAR', date: '2026-07-04', time: '17:20', amount: 1000, durationMonths: 1 },
    { id: 11, name: 'KEVIN LEVRONE', water: 'NO', supplements: 'ANAVAR', classification: 'MEMBER', passType: 'DAILY PASS', type: 'REGULAR', date: '2026-07-04', time: '17:20', amount: 125 },
    { id: 12, name: 'ORLEAN JAMES', water: 'YES', supplements: 'ANAVAR', classification: 'MEMBER', passType: 'MONTHLY PASS', type: 'REGULAR', date: '2026-07-04', time: '17:20', amount: 1000, durationMonths: 1 },
    { id: 13, name: 'PHIL HEATH', water: 'YES', supplements: 'WHEY PROTEIN', classification: 'MEMBER', passType: 'MONTHLY PASS', type: 'REGULAR', date: '2026-10-01', time: '08:30', amount: 1000, durationMonths: 1 },
    { id: 14, name: 'HANY RAMBOD', water: 'NO', supplements: 'CREATINE', classification: 'MEMBER', passType: 'MONTHLY PASS', type: 'REGULAR', date: '2026-10-01', time: '09:15', amount: 1000, durationMonths: 1 },
    { id: 15, name: 'HADI CHOOPAN', water: 'YES', supplements: 'NONE', classification: 'NON-MEMBER', passType: 'DAILY PASS', type: 'REGULAR', date: '2026-10-01', time: '10:00', amount: 100 },
    { id: 16, name: 'DEREK LUNSFORD', water: 'YES', supplements: 'WHEY PROTEIN, CREATINE', classification: 'MEMBER', passType: 'MONTHLY PASS', type: 'REGULAR', date: '2026-10-02', time: '11:20', amount: 1000, durationMonths: 1 },
    { id: 17, name: 'SAM SULEK', water: 'YES', supplements: 'WHEY PROTEIN', classification: 'NON-MEMBER', passType: 'DAILY PASS', type: 'STUDENT', date: '2026-10-02', time: '14:10', amount: 140 },
    { id: 18, name: 'TRISTYN LEE', water: 'NO', supplements: 'CREATINE', classification: 'NON-MEMBER', passType: 'DAILY PASS', type: 'STUDENT', date: '2026-10-02', time: '15:30', amount: 125 },
    { id: 19, name: 'NOEL DEYZEL', water: 'YES', supplements: 'FISH OIL', classification: 'MEMBER', passType: 'MONTHLY PASS', type: 'REGULAR', date: '2026-10-03', time: '07:45', amount: 1000, durationMonths: 1 },
    { id: 20, name: 'ALEX EUBANK', water: 'YES', supplements: 'WHEY PROTEIN', classification: 'NON-MEMBER', passType: 'DAILY PASS', type: 'STUDENT', date: '2026-10-03', time: '16:00', amount: 140 },
    { id: 21, name: 'JESSE JAMES WEST', water: 'YES', supplements: 'CREATINE', classification: 'NON-MEMBER', passType: 'DAILY PASS', type: 'STUDENT', date: '2026-10-03', time: '17:15', amount: 140 },
    { id: 22, name: 'MIKE O HERN', water: 'NO', supplements: 'NONE', classification: 'MEMBER', passType: 'MONTHLY PASS', type: 'REGULAR', date: '2026-10-04', time: '06:00', amount: 1000, durationMonths: 1 },
    { id: 23, name: 'RICH PIANA', water: 'YES', supplements: 'TRT', classification: 'NON-MEMBER', passType: 'DAILY PASS', type: 'REGULAR', date: '2026-10-04', time: '18:00', amount: 150 },
    { id: 24, name: 'GREG DOUCETTE', water: 'YES', supplements: 'FISH OIL', classification: 'MEMBER', passType: 'MONTHLY PASS', type: 'REGULAR', date: '2026-10-04', time: '19:30', amount: 1000, durationMonths: 1 },
    { id: 25, name: 'ATHLEAN X', water: 'NO', supplements: 'CREATINE', classification: 'MEMBER', passType: 'MONTHLY PASS', type: 'REGULAR', date: '2026-10-05', time: '08:00', amount: 1000, durationMonths: 1 },
    { id: 26, name: 'JO LINDNER', water: 'YES', supplements: 'WHEY PROTEIN', classification: 'MEMBER', passType: 'MONTHLY PASS', type: 'REGULAR', date: '2026-10-05', time: '12:00', amount: 1000, durationMonths: 1 },
    { id: 27, name: 'ZYZZ', water: 'YES', supplements: 'ANAVAR', classification: 'NON-MEMBER', passType: 'DAILY PASS', type: 'REGULAR', date: '2026-10-05', time: '20:00', amount: 150 },
    { id: 28, name: 'LEX LITTLE', water: 'NO', supplements: 'CREATINE', classification: 'NON-MEMBER', passType: 'DAILY PASS', type: 'STUDENT', date: '2026-10-06', time: '15:00', amount: 125 },
    { id: 29, name: 'TREN TWINS', water: 'YES', supplements: 'CREATINE', classification: 'NON-MEMBER', passType: 'DAILY PASS', type: 'STUDENT', date: '2026-10-06', time: '16:45', amount: 140 },
    { id: 30, name: 'SIMON MILLER', water: 'YES', supplements: 'WHEY PROTEIN', classification: 'MEMBER', passType: 'MONTHLY PASS', type: 'REGULAR', date: '2026-10-06', time: '18:10', amount: 1000, durationMonths: 1 },
    { id: 31, name: 'SEAN NALAWANYJ', water: 'NO', supplements: 'CREATINE', classification: 'MEMBER', passType: 'MONTHLY PASS', type: 'REGULAR', date: '2026-10-07', time: '09:00', amount: 1000, durationMonths: 1 },
    { id: 32, name: 'DR MIKE ISRAETEL', water: 'YES', supplements: 'FISH OIL', classification: 'MEMBER', passType: 'MONTHLY PASS', type: 'REGULAR', date: '2026-10-07', time: '10:30', amount: 1000, durationMonths: 1 },
    { id: 33, name: 'EUGENE TEAO', water: 'YES', supplements: 'NONE', classification: 'MEMBER', passType: 'MONTHLY PASS', type: 'REGULAR', date: '2026-10-07', time: '14:20', amount: 1000, durationMonths: 1 },
    { id: 34, name: 'DOM MAZZETTI', water: 'YES', supplements: 'WHEY PROTEIN', classification: 'NON-MEMBER', passType: 'DAILY PASS', type: 'REGULAR', date: '2026-10-08', time: '17:00', amount: 150 },
    { id: 35, name: 'BRADLEY MARTYN', water: 'YES', supplements: 'TRT', classification: 'NON-MEMBER', passType: 'DAILY PASS', type: 'REGULAR', date: '2026-10-08', time: '19:00', amount: 150 },
    { id: 36, name: 'CALUM VON MOGER', water: 'NO', supplements: 'CREATINE', classification: 'MEMBER', passType: 'MONTHLY PASS', type: 'REGULAR', date: '2026-10-08', time: '20:15', amount: 1000, durationMonths: 1 },
    { id: 37, name: 'SERGI CONSTANCE', water: 'YES', supplements: 'WHEY PROTEIN', classification: 'MEMBER', passType: 'MONTHLY PASS', type: 'REGULAR', date: '2026-10-09', time: '08:45', amount: 1000, durationMonths: 1 },
    { id: 38, name: 'LAZAR ANGELOV', water: 'YES', supplements: 'FISH OIL', classification: 'MEMBER', passType: 'MONTHLY PASS', type: 'REGULAR', date: '2026-10-09', time: '10:00', amount: 1000, durationMonths: 1 },
    { id: 39, name: 'SADIK HADZOVIC', water: 'NO', supplements: 'CREATINE', classification: 'MEMBER', passType: 'MONTHLY PASS', type: 'REGULAR', date: '2026-10-09', time: '11:30', amount: 1000, durationMonths: 1 },
    { id: 40, name: 'JEREMY BUENDIA', water: 'YES', supplements: 'WHEY PROTEIN', classification: 'MEMBER', passType: 'MONTHLY PASS', type: 'REGULAR', date: '2026-10-10', time: '13:00', amount: 1000, durationMonths: 1 },
    { id: 41, name: 'BRANDON CURRY', water: 'YES', supplements: 'CREATINE', classification: 'MEMBER', passType: 'MONTHLY PASS', type: 'REGULAR', date: '2026-10-10', time: '15:10', amount: 1000, durationMonths: 1 },
    { id: 42, name: 'WILLIAM BONAC', water: 'NO', supplements: 'NONE', classification: 'MEMBER', passType: 'MONTHLY PASS', type: 'REGULAR', date: '2026-10-10', time: '16:40', amount: 1000, durationMonths: 1 },
    { id: 43, name: 'ROELLY WINKLAAR', water: 'YES', supplements: 'WHEY PROTEIN', classification: 'NON-MEMBER', passType: 'DAILY PASS', type: 'REGULAR', date: '2026-10-11', time: '17:50', amount: 150 },
    { id: 44, name: 'BIG RAMY', water: 'YES', supplements: 'TRT', classification: 'NON-MEMBER', passType: 'DAILY PASS', type: 'REGULAR', date: '2026-10-11', time: '18:30', amount: 150 },
    { id: 45, name: 'HUNTER LABRADA', water: 'NO', supplements: 'CREATINE', classification: 'MEMBER', passType: 'MONTHLY PASS', type: 'REGULAR', date: '2026-10-11', time: '19:15', amount: 1000, durationMonths: 1 },
    { id: 46, name: 'NICK WALKER', water: 'YES', supplements: 'CREATINE', classification: 'MEMBER', passType: 'MONTHLY PASS', type: 'REGULAR', date: '2026-10-12', time: '09:10', amount: 1000, durationMonths: 1 },
    { id: 47, name: 'MAMDOUH ELSSBIAY', water: 'YES', supplements: 'WHEY PROTEIN', classification: 'MEMBER', passType: 'MONTHLY PASS', type: 'REGULAR', date: '2026-10-12', time: '10:45', amount: 1000, durationMonths: 1 },
    { id: 48, name: 'SAMSON DAUDA', water: 'NO', supplements: 'FISH OIL', classification: 'MEMBER', passType: 'MONTHLY PASS', type: 'REGULAR', date: '2026-10-12', time: '12:00', amount: 1000, durationMonths: 1 },
    { id: 49, name: 'ANDREW JACKED', water: 'YES', supplements: 'CREATINE', classification: 'NON-MEMBER', passType: 'DAILY PASS', type: 'REGULAR', date: '2026-10-13', time: '14:30', amount: 150 },
    { id: 50, name: 'MICHAEL CRICK', water: 'YES', supplements: 'WHEY PROTEIN', classification: 'NON-MEMBER', passType: 'DAILY PASS', type: 'STUDENT', date: '2026-10-13', time: '15:20', amount: 140 },
    { id: 51, name: 'URS KALECINSKI', water: 'NO', supplements: 'NONE', classification: 'MEMBER', passType: 'MONTHLY PASS', type: 'REGULAR', date: '2026-10-13', time: '16:10', amount: 1000, durationMonths: 1 },
    { id: 52, name: 'RAMON DINO', water: 'YES', supplements: 'CREATINE', classification: 'MEMBER', passType: 'MONTHLY PASS', type: 'REGULAR', date: '2026-10-14', time: '08:30', amount: 1000, durationMonths: 1 },
    { id: 53, name: 'TERRENCE RUFFIN', water: 'YES', supplements: 'WHEY PROTEIN', classification: 'MEMBER', passType: 'MONTHLY PASS', type: 'REGULAR', date: '2026-10-14', time: '09:45', amount: 1000, durationMonths: 1 },
    { id: 54, name: 'BREON ANSLEY', water: 'NO', supplements: 'FISH OIL', classification: 'MEMBER', passType: 'MONTHLY PASS', type: 'REGULAR', date: '2026-10-14', time: '11:15', amount: 1000, durationMonths: 1 },
    { id: 55, name: 'KEONE PEARSON', water: 'YES', supplements: 'CREATINE', classification: 'NON-MEMBER', passType: 'DAILY PASS', type: 'STUDENT', date: '2026-10-15', time: '13:40', amount: 140 },
    { id: 56, name: 'SHAUN CLARIDA', water: 'YES', supplements: 'WHEY PROTEIN', classification: 'MEMBER', passType: 'MONTHLY PASS', type: 'REGULAR', date: '2026-10-15', time: '15:00', amount: 1000, durationMonths: 1 },
    { id: 57, name: 'FLEX LEWIS', water: 'NO', supplements: 'CREATINE', classification: 'MEMBER', passType: 'MONTHLY PASS', type: 'REGULAR', date: '2026-10-15', time: '16:30', amount: 1000, durationMonths: 1 },
    { id: 58, name: 'DEXTER JACKSON', water: 'YES', supplements: 'FISH OIL', classification: 'MEMBER', passType: 'MONTHLY PASS', type: 'REGULAR', date: '2026-10-16', time: '09:00', amount: 1000, durationMonths: 1 },
    { id: 59, name: 'SHAWN RHODEN', water: 'YES', supplements: 'WHEY PROTEIN', classification: 'MEMBER', passType: 'MONTHLY PASS', type: 'REGULAR', date: '2026-10-16', time: '10:20', amount: 1000, durationMonths: 1 },
    { id: 60, name: 'BRANCH WARREN', water: 'NO', supplements: 'TRT', classification: 'NON-MEMBER', passType: 'DAILY PASS', type: 'REGULAR', date: '2026-10-16', time: '12:10', amount: 135 },
    { id: 61, name: 'VICTOR MARTINEZ', water: 'YES', supplements: 'CREATINE', classification: 'MEMBER', passType: 'MONTHLY PASS', type: 'REGULAR', date: '2026-10-17', time: '14:00', amount: 1000, durationMonths: 1 },
    { id: 62, name: 'KAI GREENE', water: 'YES', supplements: 'WHEY PROTEIN', classification: 'MEMBER', passType: 'MONTHLY PASS', type: 'REGULAR', date: '2026-10-17', time: '16:20', amount: 1000, durationMonths: 1 },
  ]);

  const [members, setMembers] = useState([
    { id: 1, name: 'RONNIE COLEMAN', age: '59', sex: 'M', contact: '09123456781', status: 'ACTIVE', address: 'TEXAS, USA', dateJoined: '2026-09-23' },
    { id: 2, name: 'JAY CUTLER', age: '50', sex: 'M', contact: '09123456782', status: 'ACTIVE', address: 'LAS VEGAS, USA', dateJoined: '2026-09-22' },
    { id: 3, name: 'ARNOLD SCHWARZENIGGER', age: '76', sex: 'M', contact: '09123456784', status: 'ACTIVE', address: 'CALIFORNIA, USA', dateJoined: '2026-08-15' },
    { id: 4, name: 'DAVID LAID', age: '26', sex: 'M', contact: '09123456785', status: 'ACTIVE', address: 'NEW YORK, USA', dateJoined: '2026-07-04' },
    { id: 5, name: 'WILL TENNYSON', age: '29', sex: 'M', contact: '09123456786', status: 'ACTIVE', address: 'TORONTO, CANADA', dateJoined: '2026-07-04' },
    { id: 6, name: 'DORIAN YATES', age: '61', sex: 'M', contact: '09123456789', status: 'ACTIVE', address: 'BIRMINGHAM, UK', dateJoined: '2026-07-04' },
    { id: 7, name: 'TOM PLATZ', age: '68', sex: 'M', contact: '09123456790', status: 'ACTIVE', address: 'CALIFORNIA, USA', dateJoined: '2026-07-04' },
    { id: 8, name: 'KEVIN LEVRONE', age: '58', sex: 'M', contact: '09123456791', status: 'INACTIVE', address: 'MARYLAND, USA', dateJoined: '2026-07-04' },
    { id: 9, name: 'ORLEAN JAMES', age: '22', sex: 'M', contact: '09696969696', status: 'ACTIVE', address: 'CAVITE, PHILIPPINES', dateJoined: '2026-07-04' },
    { id: 10, name: 'PHIL HEATH', age: '44', sex: 'M', contact: '09170000001', status: 'ACTIVE', address: 'COLORADO, USA', dateJoined: '2026-10-01' },
    { id: 11, name: 'HANY RAMBOD', age: '49', sex: 'M', contact: '09170000002', status: 'ACTIVE', address: 'CALIFORNIA, USA', dateJoined: '2026-10-01' },
    { id: 12, name: 'DEREK LUNSFORD', age: '31', sex: 'M', contact: '09170000003', status: 'ACTIVE', address: 'INDIANA, USA', dateJoined: '2026-10-02' },
    { id: 13, name: 'NOEL DEYZEL', age: '39', sex: 'M', contact: '09170000004', status: 'ACTIVE', address: 'SOUTH AFRICA', dateJoined: '2026-10-03' },
    { id: 14, name: 'MIKE O HERN', age: '55', sex: 'M', contact: '09170000005', status: 'ACTIVE', address: 'LOS ANGELES, USA', dateJoined: '2026-10-04' },
    { id: 15, name: 'GREG DOUCETTE', age: '48', sex: 'M', contact: '09170000006', status: 'ACTIVE', address: 'CANADA', dateJoined: '2026-10-04' },
    { id: 16, name: 'ATHLEAN X', age: '48', sex: 'M', contact: '09170000007', status: 'ACTIVE', address: 'CONNECTICUT, USA', dateJoined: '2026-10-05' },
    { id: 17, name: 'JO LINDNER', age: '30', sex: 'M', contact: '09170000008', status: 'INACTIVE', address: 'GERMANY', dateJoined: '2026-10-05' },
    { id: 18, name: 'SIMON MILLER', age: '38', sex: 'M', contact: '09170000009', status: 'ACTIVE', address: 'LONDON, UK', dateJoined: '2026-10-06' },
    { id: 19, name: 'SEAN NALAWANYJ', age: '35', sex: 'M', contact: '09170000010', status: 'ACTIVE', address: 'VANCOUVER, CANADA', dateJoined: '2026-10-07' },
    { id: 20, name: 'DR MIKE ISRAETEL', age: '40', sex: 'M', contact: '09170000011', status: 'ACTIVE', address: 'TEXAS, USA', dateJoined: '2026-10-07' },
    { id: 21, name: 'EUGENE TEAO', age: '36', sex: 'M', contact: '09170000012', status: 'ACTIVE', address: 'NEW ZEALAND', dateJoined: '2026-10-07' },
    { id: 22, name: 'CALUM VON MOGER', age: '33', sex: 'M', contact: '09170000013', status: 'ACTIVE', address: 'AUSTRALIA', dateJoined: '2026-10-08' },
    { id: 23, name: 'SERGI CONSTANCE', age: '35', sex: 'M', contact: '09170000014', status: 'ACTIVE', address: 'SPAIN', dateJoined: '2026-10-09' },
    { id: 24, name: 'LAZAR ANGELOV', age: '39', sex: 'M', contact: '09170000015', status: 'ACTIVE', address: 'BULGARIA', dateJoined: '2026-10-09' },
    { id: 25, name: 'SADIK HADZOVIC', age: '36', sex: 'M', contact: '09170000016', status: 'ACTIVE', address: 'NEW YORK, USA', dateJoined: '2026-10-09' },
    { id: 26, name: 'JEREMY BUENDIA', age: '33', sex: 'M', contact: '09170000017', status: 'ACTIVE', address: 'CALIFORNIA, USA', dateJoined: '2026-10-10' },
    { id: 27, name: 'BRANDON CURRY', age: '41', sex: 'M', contact: '09170000018', status: 'ACTIVE', address: 'TENNESSEE, USA', dateJoined: '2026-10-10' },
    { id: 28, name: 'WILLIAM BONAC', age: '51', sex: 'M', contact: '09170000019', status: 'INACTIVE', address: 'NETHERLANDS', dateJoined: '2026-10-10' },
    { id: 29, name: 'HUNTER LABRADA', age: '32', sex: 'M', contact: '09170000020', status: 'ACTIVE', address: 'TEXAS, USA', dateJoined: '2026-10-11' },
    { id: 30, name: 'NICK WALKER', age: '29', sex: 'M', contact: '09170000021', status: 'ACTIVE', address: 'FLORIDA, USA', dateJoined: '2026-10-12' },
    { id: 31, name: 'MAMDOUH ELSSBIAY', age: '39', sex: 'M', contact: '09170000022', status: 'ACTIVE', address: 'EGYPT', dateJoined: '2026-10-12' },
    { id: 32, name: 'SAMSON DAUDA', age: '37', sex: 'M', contact: '09170000023', status: 'ACTIVE', address: 'UNITED KINGDOM', dateJoined: '2026-10-12' },
    { id: 33, name: 'URS KALECINSKI', age: '26', sex: 'M', contact: '09170000024', status: 'ACTIVE', address: 'GERMANY', dateJoined: '2026-10-13' },
    { id: 34, name: 'RAMON DINO', age: '28', sex: 'M', contact: '09170000025', status: 'ACTIVE', address: 'BRAZIL', dateJoined: '2026-10-14' },
    { id: 35, name: 'TERRENCE RUFFIN', age: '30', sex: 'M', contact: '09170000026', status: 'ACTIVE', address: 'ALABAMA, USA', dateJoined: '2026-10-14' },
    { id: 36, name: 'BREON ANSLEY', age: '44', sex: 'M', contact: '09170000027', status: 'ACTIVE', address: 'CALIFORNIA, USA', dateJoined: '2026-10-14' },
    { id: 37, name: 'SHAUN CLARIDA', age: '41', sex: 'M', contact: '09170000028', status: 'ACTIVE', address: 'NEW JERSEY, USA', dateJoined: '2026-10-15' },
    { id: 38, name: 'FLEX LEWIS', age: '40', sex: 'M', contact: '09170000029', status: 'ACTIVE', address: 'WALES, UK', dateJoined: '2026-10-15' },
    { id: 39, name: 'DEXTER JACKSON', age: '54', sex: 'M', contact: '09170000030', status: 'INACTIVE', address: 'FLORIDA, USA', dateJoined: '2026-10-16' },
    { id: 40, name: 'SHAWN RHODEN', age: '46', sex: 'M', contact: '09170000031', status: 'INACTIVE', address: 'MARYLAND, USA', dateJoined: '2026-10-16' },
    { id: 41, name: 'VICTOR MARTINEZ', age: '50', sex: 'M', contact: '09170000032', status: 'ACTIVE', address: 'NEW YORK, USA', dateJoined: '2026-10-17' },
    { id: 42, name: 'KAI GREENE', age: '48', sex: 'M', contact: '09170000033', status: 'ACTIVE', address: 'NEW YORK, USA', dateJoined: '2026-10-17' },
    { id: 43, name: 'JEFF SEID', age: '29', sex: 'M', contact: '09170000034', status: 'ACTIVE', address: 'WASHINGTON, USA', dateJoined: '2026-10-17' },
    { id: 44, name: 'STEVEN CAO', age: '29', sex: 'M', contact: '09170000035', status: 'ACTIVE', address: 'FLORIDA, USA', dateJoined: '2026-10-17' },
    { id: 45, name: 'ANTONIETTE PACHECO', age: '27', sex: 'F', contact: '09170000036', status: 'ACTIVE', address: 'MANILA, PHILIPPINES', dateJoined: '2026-10-17' },
    { id: 46, name: 'KRISSY CELA', age: '29', sex: 'F', contact: '09170000037', status: 'ACTIVE', address: 'LONDON, UK', dateJoined: '2026-10-18' },
    { id: 47, name: 'CASSEY HO', age: '37', sex: 'F', contact: '09170000038', status: 'ACTIVE', address: 'CALIFORNIA, USA', dateJoined: '2026-10-18' },
    { id: 48, name: 'STEPHANIE SANZO', age: '36', sex: 'F', contact: '09170000039', status: 'ACTIVE', address: 'AUSTRALIA', dateJoined: '2026-10-18' },
    { id: 49, name: 'MEGAN DAVIES', age: '34', sex: 'F', contact: '09170000040', status: 'ACTIVE', address: 'FLORIDA, USA', dateJoined: '2026-10-18' },
    { id: 50, name: 'NATALIA COELHO', age: '27', sex: 'F', contact: '09170000041', status: 'ACTIVE', address: 'BRAZIL', dateJoined: '2026-10-18' },
    { id: 51, name: 'SARAH VILLEGAS', age: '33', sex: 'F', contact: '09170000042', status: 'ACTIVE', address: 'TEXAS, USA', dateJoined: '2026-10-18' },
    { id: 52, name: 'FRANCINELLES MATTOS', age: '38', sex: 'F', contact: '09170000043', status: 'ACTIVE', address: 'BRAZIL', dateJoined: '2026-10-18' },
    { id: 53, name: 'ISABELLE NUNES', age: '26', sex: 'F', contact: '09170000044', status: 'ACTIVE', address: 'BRAZIL', dateJoined: '2026-10-18' },
    { id: 54, name: 'ANGELA BORGE', age: '31', sex: 'F', contact: '09170000045', status: 'ACTIVE', address: 'COLOMBIA', dateJoined: '2026-10-18' },
    { id: 55, name: 'MAUREEN BLANQUISCO', age: '30', sex: 'F', contact: '09170000046', status: 'ACTIVE', address: 'PHILIPPINES', dateJoined: '2026-10-18' },
    { id: 56, name: 'LAURALIE CHAPADOS', age: '28', sex: 'F', contact: '09170000047', status: 'ACTIVE', address: 'CANADA', dateJoined: '2026-10-18' },
    { id: 57, name: 'ASHLYN LITTLE', age: '25', sex: 'F', contact: '09170000048', status: 'ACTIVE', address: 'TEXAS, USA', dateJoined: '2026-10-18' },
    { id: 58, name: 'JANET LAYUG', age: '35', sex: 'F', contact: '09170000049', status: 'ACTIVE', address: 'FLORIDA, USA', dateJoined: '2026-10-18' },
    { id: 59, name: 'ELISA PECINI', age: '27', sex: 'F', contact: '09170000050', status: 'ACTIVE', address: 'BRAZIL', dateJoined: '2026-10-18' },
  ]);

  const [isShiftOpen, setIsShiftOpen] = useState(false);
  const [startingCash, setStartingCash] = useState('');
  const [expensesList, setExpensesList] = useState([]);
  const [posInitialModal, setPosInitialModal] = useState(null);

  const handleLogin = (enteredUsername) => {
    if (enteredUsername.trim()) {
      setUsername(enteredUsername.toUpperCase());
    }
    setIsLoggedIn(true);
  };

  const addMember = (memberData) => {
    const newEntry = {
      id: Date.now(),
      ...memberData,
      name: memberData.name.toUpperCase(),
      status: memberData.status || 'ACTIVE',
      dateJoined: memberData.dateJoined || '2026-10-18',
    };
    setMembers((prev) => [...prev, newEntry]);
  };

  const updateMember = (updatedData) => {
    setMembers((prev) =>
      prev.map((m) => (m.id === updatedData.id ? { ...m, ...updatedData } : m))
    );
  };

  const handleAddCheckIn = (newLog) => {
    setCheckInLogs((prev) => [...prev, newLog]);
    setHistoryLogs((prev) => [...prev, newLog]);
  };

  const handleRedirectToAvailMembership = () => {
    setPosInitialModal('avail-membership');
    setCurrentPage('pos');
  };

  const handleRedirectToMonthlyPass = () => {
    setPosInitialModal('monthly-pass');
    setCurrentPage('pos');
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUsername('Admin');
    setCurrentPage('dashboard');
  };

  if (!isLoggedIn) {
    return <LoginPage onLogin={handleLogin} />;
  }

  const allCombinedLogs = [...checkInLogs, ...historyLogs];

  return (
    <div className="flex h-screen bg-[#070a11] font-sans text-slate-100 overflow-hidden">
      <Sidebar 
        activePage={currentPage} 
        setActivePage={setCurrentPage} 
        onLogout={handleLogout} 
      />

      <main className="flex-1 flex flex-col overflow-hidden">
        {currentPage === 'dashboard' && (
          <DashboardPage members={members} checkInLogs={allCombinedLogs} username={username} />
        )}
        {currentPage === 'pos' && (
          <PointOfSalesPage
            members={members}
            allDatabaseLogs={allCombinedLogs}
            onAddMember={addMember}
            isShiftOpen={isShiftOpen}
            setIsShiftOpen={setIsShiftOpen}
            startingCash={startingCash}
            setStartingCash={setStartingCash}
            checkInLogs={checkInLogs}
            onAddCheckInLog={handleAddCheckIn}
            expensesList={expensesList}
            setExpensesList={setExpensesList}
            initialModal={posInitialModal}
            clearInitialModal={() => setPosInitialModal(null)}
            username={username}
          />
        )}
        {currentPage === 'member-management' && (
          <MemberManagementPage
            members={members}
            checkInLogs={allCombinedLogs}
            onNavigateToAvailMembership={handleRedirectToAvailMembership}
            onNavigateToMonthlyPass={handleRedirectToMonthlyPass}
            onUpdateMember={updateMember}
            username={username}
            viewMode="members"
          />
        )}
        {currentPage === 'monthly-management' && (
          <MemberManagementPage
            members={members}
            checkInLogs={allCombinedLogs}
            onNavigateToAvailMembership={handleRedirectToAvailMembership}
            onNavigateToMonthlyPass={handleRedirectToMonthlyPass}
            onUpdateMember={updateMember}
            username={username}
            viewMode="monthly"
          />
        )}
        {currentPage === 'log-history' && (
          <LogHistoryPage checkInLogs={allCombinedLogs} username={username} />
        )}
        {currentPage === 'settings' && <SettingsPage username={username} />}
      </main>
    </div>
  );
}