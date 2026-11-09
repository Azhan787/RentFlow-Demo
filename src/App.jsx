import React, { useEffect, useMemo, useState } from 'react';
import {
  Activity, AlertCircle, AlertTriangle, ArrowDownRight, ArrowRight, ArrowUpRight,
  Bell, Box, Building2, Calendar, CalendarCheck, CalendarDays, Camera, Check,
  CheckCircle2, ChevronDown, ChevronLeft, ChevronRight, CircleDollarSign,
  ClipboardCheck, ClipboardList, Clock3, CreditCard, Download, ExternalLink,
  FileCheck2, FileText, Filter, HardHat, LayoutDashboard, Mail, MapPin,
  Menu, MoreHorizontal, Package, PackageCheck, Pencil, Phone, Plus, Search,
  Settings, ShieldCheck, SlidersHorizontal, Sparkles, Store, Truck, UserPlus,
  Users, Wallet, Wrench, X
} from 'lucide-react';

const money = (n) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(Number(n || 0));
const today = new Date('2026-11-09T12:00:00');
const iso = (d) => new Date(d).toISOString().slice(0, 10);
const prettyDate = (d) => d ? new Date(`${d}T12:00:00`).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '—';
const daysBetween = (a, b) => Math.max(1, Math.ceil((new Date(`${b}T12:00:00`) - new Date(`${a}T12:00:00`)) / 86400000));
const uid = () => `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`;

const seed = {
  equipment: [
    { id: 'EQ-1001', name: 'CAT 259D Compact Track Loader', category: 'Earthmoving', type: 'Individual', quantity: 1, available: 0, rate: 285, rateUnit: 'day', condition: 'Excellent', status: 'Rented', location: 'Austin Yard', serial: 'CAT259D-2048', image: 'loader', description: 'Compact track loader for grading, loading and site preparation.' },
    { id: 'EQ-1002', name: 'Honda EU7000is Generator', category: 'Power', type: 'Individual', quantity: 4, available: 2, rate: 95, rateUnit: 'day', condition: 'Good', status: 'Available', location: 'Austin Yard', serial: 'HND-EU7-441', image: 'generator', description: 'Quiet inverter generator for job sites and events.' },
    { id: 'EQ-1003', name: 'JLG 1930ES Scissor Lift', category: 'Lifting', type: 'Individual', quantity: 2, available: 1, rate: 160, rateUnit: 'day', condition: 'Excellent', status: 'Available', location: 'North Depot', serial: 'JLG-1930-88', image: 'lift', description: 'Electric slab scissor lift for indoor and outdoor work.' },
    { id: 'EQ-1004', name: 'Wacker Neuson Plate Compactor', category: 'Compaction', type: 'Bulk', quantity: 12, available: 8, rate: 48, rateUnit: 'day', condition: 'Good', status: 'Available', location: 'Austin Yard', serial: 'WNP-PLT-12', image: 'compactor', description: 'Reversible plate compactor for soil and asphalt.' },
    { id: 'EQ-1005', name: 'Bobcat E35 Mini Excavator', category: 'Earthmoving', type: 'Individual', quantity: 2, available: 0, rate: 340, rateUnit: 'day', condition: 'Good', status: 'Rented', location: 'North Depot', serial: 'BOB-E35-772', image: 'excavator', description: 'Compact excavator for utility and landscaping projects.' },
    { id: 'EQ-1006', name: 'Multiquip Concrete Mixer', category: 'Concrete', type: 'Bulk', quantity: 8, available: 7, rate: 38, rateUnit: 'day', condition: 'Fair', status: 'Available', location: 'Austin Yard', serial: 'MQ-MIX-08', image: 'mixer', description: 'Portable concrete mixer for small and medium pours.' },
    { id: 'EQ-1007', name: 'Atlas Copco Air Compressor', category: 'Power', type: 'Individual', quantity: 3, available: 2, rate: 125, rateUnit: 'day', condition: 'Good', status: 'Maintenance', location: 'North Depot', serial: 'AC-XAS-311', image: 'compressor', description: 'Portable diesel air compressor for construction tools.' },
    { id: 'EQ-1008', name: 'Bosch Professional Core Drill Kit', category: 'Tools', type: 'Bulk', quantity: 10, available: 9, rate: 65, rateUnit: 'day', condition: 'Excellent', status: 'Available', location: 'Austin Yard', serial: 'BOS-CORE-10', image: 'drill', description: 'Core drill system for precision drilling in concrete.' }
  ],
  customers: [
    { id: 'CU-2041', name: 'Olivia Martinez', company: 'Martinez Builders', email: 'olivia@martinezbuild.com', phone: '+1 (512) 555-0191', rentals: 18, balance: 0, status: 'Active', initials: 'OM' },
    { id: 'CU-2042', name: 'James Wilson', company: 'Wilson Site Works', email: 'james@wilsonsite.com', phone: '+1 (512) 555-0144', rentals: 12, balance: 420, status: 'Active', initials: 'JW' },
    { id: 'CU-2043', name: 'Sophia Chen', company: 'Chen Event Production', email: 'sophia@chenevents.co', phone: '+1 (737) 555-0108', rentals: 9, balance: 0, status: 'Active', initials: 'SC' },
    { id: 'CU-2044', name: 'Noah Thompson', company: 'Thompson Concrete', email: 'noah@thompsonconcrete.com', phone: '+1 (512) 555-0180', rentals: 7, balance: 185, status: 'Active', initials: 'NT' },
    { id: 'CU-2045', name: 'Ava Patel', company: 'Patel Landscape Co.', email: 'ava@patellandscape.com', phone: '+1 (737) 555-0172', rentals: 5, balance: 0, status: 'Active', initials: 'AP' }
  ],
  bookings: [
    { id: 'BK-3081', customerId: 'CU-2041', customer: 'Olivia Martinez', company: 'Martinez Builders', equipmentId: 'EQ-1001', equipment: 'CAT 259D Compact Track Loader', quantity: 1, start: '2026-11-08', end: '2026-11-12', total: 1425, deposit: 500, status: 'Checked out', payment: 'Paid', location: 'Austin Yard' },
    { id: 'BK-3082', customerId: 'CU-2042', customer: 'James Wilson', company: 'Wilson Site Works', equipmentId: 'EQ-1005', equipment: 'Bobcat E35 Mini Excavator', quantity: 1, start: '2026-11-07', end: '2026-11-11', total: 1700, deposit: 500, status: 'Checked out', payment: 'Partial', location: 'North Depot' },
    { id: 'BK-3083', customerId: 'CU-2043', customer: 'Sophia Chen', company: 'Chen Event Production', equipmentId: 'EQ-1002', equipment: 'Honda EU7000is Generator', quantity: 2, start: '2026-11-10', end: '2026-11-13', total: 570, deposit: 200, status: 'Confirmed', payment: 'Paid', location: 'Austin Yard' },
    { id: 'BK-3084', customerId: 'CU-2044', customer: 'Noah Thompson', company: 'Thompson Concrete', equipmentId: 'EQ-1004', equipment: 'Wacker Neuson Plate Compactor', quantity: 3, start: '2026-11-11', end: '2026-11-14', total: 576, deposit: 150, status: 'Pending', payment: 'Unpaid', location: 'Austin Yard' },
    { id: 'BK-3085', customerId: 'CU-2045', customer: 'Ava Patel', company: 'Patel Landscape Co.', equipmentId: 'EQ-1003', equipment: 'JLG 1930ES Scissor Lift', quantity: 1, start: '2026-11-13', end: '2026-11-16', total: 640, deposit: 250, status: 'Confirmed', payment: 'Paid', location: 'North Depot' },
    { id: 'BK-3086', customerId: 'CU-2041', customer: 'Olivia Martinez', company: 'Martinez Builders', equipmentId: 'EQ-1008', equipment: 'Bosch Professional Core Drill Kit', quantity: 2, start: '2026-11-09', end: '2026-11-10', total: 130, deposit: 50, status: 'Pending', payment: 'Unpaid', location: 'Austin Yard' }
  ],
  maintenance: [
    { id: 'MT-5101', equipment: 'Atlas Copco Air Compressor', equipmentId: 'EQ-1007', task: 'Routine 250-hour service', due: '2026-11-10', priority: 'High', status: 'In progress', assigned: 'Mike R.' },
    { id: 'MT-5102', equipment: 'CAT 259D Compact Track Loader', equipmentId: 'EQ-1001', task: 'Inspect tracks and hydraulic lines', due: '2026-11-15', priority: 'Medium', status: 'Scheduled', assigned: 'Jordan K.' },
    { id: 'MT-5103', equipment: 'Wacker Neuson Plate Compactor', equipmentId: 'EQ-1004', task: 'Replace air filter', due: '2026-11-18', priority: 'Low', status: 'Scheduled', assigned: 'Mike R.' }
  ],
  invoices: [
    { id: 'INV-2081', bookingId: 'BK-3081', customer: 'Olivia Martinez', issued: '2026-11-08', due: '2026-11-08', amount: 1425, paid: 1425, status: 'Paid' },
    { id: 'INV-2082', bookingId: 'BK-3082', customer: 'James Wilson', issued: '2026-11-07', due: '2026-11-10', amount: 1700, paid: 1280, status: 'Partial' },
    { id: 'INV-2083', bookingId: 'BK-3084', customer: 'Noah Thompson', issued: '2026-11-09', due: '2026-11-11', amount: 576, paid: 0, status: 'Unpaid' },
    { id: 'INV-2084', bookingId: 'BK-3085', customer: 'Ava Patel', issued: '2026-11-09', due: '2026-11-09', amount: 640, paid: 640, status: 'Paid' }
  ]
};

const navItems = [
  { label: 'Overview', id: 'overview', icon: LayoutDashboard, group: 'WORKSPACE' },
  { label: 'Inventory', id: 'inventory', icon: Package, group: 'WORKSPACE', count: '142' },
  { label: 'Bookings', id: 'bookings', icon: ClipboardList, group: 'WORKSPACE', count: '6' },
  { label: 'Customers', id: 'customers', icon: Users, group: 'WORKSPACE' },
  { label: 'Calendar', id: 'calendar', icon: CalendarDays, group: 'WORKSPACE' },
  { label: 'Maintenance', id: 'maintenance', icon: Wrench, group: 'MANAGE' },
  { label: 'Invoices', id: 'invoices', icon: FileText, group: 'MANAGE' },
  { label: 'Reports', id: 'reports', icon: Activity, group: 'MANAGE' },
  { label: 'Online store', id: 'store', icon: Store, group: 'CHANNELS' },
  { label: 'Settings', id: 'settings', icon: Settings, group: 'SYSTEM' }
];

function readSaved() {
  try { const val = localStorage.getItem('rentflow-demo-v1'); return val ? { ...seed, ...JSON.parse(val) } : seed; }
  catch { return seed; }
}

function Pill({ children, tone = 'neutral' }) { return <span className={`pill pill-${tone}`}>{children}</span>; }
function Button({ children, variant = 'primary', size = 'md', onClick, icon: Icon, disabled = false, className = '', type = 'button' }) {
  return <button type={type} disabled={disabled} onClick={onClick} className={`btn btn-${variant} btn-${size} ${className}`}>{Icon && <Icon size={16} strokeWidth={2.2} />}{children}</button>;
}
function PageTitle({ eyebrow, title, desc, actions }) { return <div className="page-title"><div><div className="eyebrow">{eyebrow}</div><h1>{title}</h1>{desc && <p>{desc}</p>}</div>{actions && <div className="page-actions">{actions}</div>}</div>; }
function StatCard({ label, value, change, direction = 'up', icon: Icon, color = 'blue', note }) {
  return <div className="stat-card"><div className="stat-top"><span>{label}</span><span className={`stat-icon stat-${color}`}><Icon size={18}/></span></div><div className="stat-value">{value}</div><div className="stat-foot"><span className={`trend ${direction === 'down' ? 'trend-down' : ''}`}>{direction === 'down' ? <ArrowDownRight size={14}/> : <ArrowUpRight size={14}/>} {change}</span><span>{note || 'vs. last month'}</span></div></div>;
}
function EmptyState({ icon: Icon = Package, title, text, action }) { return <div className="empty-state"><div className="empty-icon"><Icon size={24}/></div><h3>{title}</h3><p>{text}</p>{action}</div>; }
function SearchBox({ value, onChange, placeholder = 'Search...' }) { return <div className="search-box"><Search size={16}/><input value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}/><kbd>⌘ K</kbd></div>; }
function Avatar({ initials, size = 'md' }) { return <span className={`avatar avatar-${size}`}>{initials}</span>; }
function EquipmentGlyph({ kind = 'box' }) {
  const map = { loader: HardHat, generator: Activity, lift: Truck, compactor: Wrench, excavator: HardHat, mixer: Box, compressor: Activity, drill: Wrench };
  const Icon = map[kind] || Box;
  return <div className={`equipment-glyph glyph-${kind}`}><Icon size={26}/><span className="glyph-dot"/></div>;
}
function Modal({ title, subtitle, onClose, children, width = '560px' }) {
  useEffect(() => { const onKey = e => e.key === 'Escape' && onClose(); window.addEventListener('keydown', onKey); return () => window.removeEventListener('keydown', onKey); }, [onClose]);
  return <div className="modal-backdrop" onMouseDown={e => e.target === e.currentTarget && onClose()}><div className="modal" style={{ maxWidth: width }}><div className="modal-head"><div><h2>{title}</h2>{subtitle && <p>{subtitle}</p>}</div><button className="icon-btn" onClick={onClose}><X size={18}/></button></div><div className="modal-body">{children}</div></div></div>;
}

export default function App() {
  const [data, setData] = useState(readSaved);
  const [page, setPage] = useState('overview');
  const [search, setSearch] = useState('');
  const [modal, setModal] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [toast, setToast] = useState('');
  const [storeSearch, setStoreSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All categories');
  const [statusFilter, setStatusFilter] = useState('All status');
  const [calendarMonth, setCalendarMonth] = useState(10);
  const [selectedStoreItem, setSelectedStoreItem] = useState(null);

  useEffect(() => { localStorage.setItem('rentflow-demo-v1', JSON.stringify(data)); }, [data]);
  useEffect(() => { if (!toast) return; const t = setTimeout(() => setToast(''), 3200); return () => clearTimeout(t); }, [toast]);
  const update = (key, fn) => setData(prev => ({ ...prev, [key]: fn(prev[key]) }));
  const notify = (msg) => setToast(msg);
  const allEquipment = data.equipment;
  const allBookings = data.bookings;
  const allCustomers = data.customers;
  const allInvoices = data.invoices;
  const activePage = navItems.find(n => n.id === page)?.label || 'Overview';
  const dueSoon = allBookings.filter(b => b.status === 'Checked out' && b.end <= '2026-11-12').length;
  const revenue = allInvoices.reduce((s, i) => s + i.paid, 0) + 22685;

  const openNewBooking = () => setModal({ type: 'booking' });
  const onGlobalSearch = (value) => { setSearch(value); };

  function saveEquipment(form) {
    if (form.id) update('equipment', rows => rows.map(x => x.id === form.id ? { ...x, ...form, rate: Number(form.rate), quantity: Number(form.quantity), available: Math.min(Number(form.available), Number(form.quantity)) } : x));
    else update('equipment', rows => [{ ...form, id: `EQ-${Math.floor(2000 + Math.random() * 7000)}`, rate: Number(form.rate), quantity: Number(form.quantity), available: Number(form.quantity), type: Number(form.quantity) > 1 ? 'Bulk' : 'Individual' }, ...rows]);
    setModal(null); notify(form.id ? 'Equipment details updated.' : 'Equipment added to inventory.');
  }
  function saveCustomer(form) {
    update('customers', rows => [{ ...form, id: `CU-${Math.floor(3000 + Math.random() * 6000)}`, rentals: 0, balance: 0, status: 'Active', initials: form.name.split(' ').map(x => x[0]).slice(0, 2).join('').toUpperCase() }, ...rows]);
    setModal(null); notify('Customer added successfully.');
  }
  function saveBooking(form) {
    const equip = allEquipment.find(x => x.id === form.equipmentId);
    const customer = allCustomers.find(x => x.id === form.customerId);
    if (!equip || !customer) return notify('Please choose a customer and equipment.');
    const qty = Number(form.quantity);
    if (qty < 1 || qty > equip.available) return notify(`Only ${equip.available} unit(s) currently available in this demo.`);
    if (new Date(form.end) < new Date(form.start)) return notify('End date must be after start date.');
    const total = daysBetween(form.start, form.end) * equip.rate * qty;
    const booking = { id: `BK-${Math.floor(4000 + Math.random() * 5000)}`, customerId: customer.id, customer: customer.name, company: customer.company, equipmentId: equip.id, equipment: equip.name, quantity: qty, start: form.start, end: form.end, total, deposit: Number(form.deposit || 0), status: 'Pending', payment: 'Unpaid', location: equip.location };
    update('bookings', rows => [booking, ...rows]);
    update('equipment', rows => rows.map(x => x.id === equip.id ? { ...x, available: Math.max(0, x.available - qty) } : x));
    setModal(null); notify(`Booking ${booking.id} created. A confirmation can be sent after approval.`);
  }
  function changeBookingStatus(id, status) {
    const previous = allBookings.find(b => b.id === id);
    update('bookings', rows => rows.map(b => b.id === id ? { ...b, status } : b));
    if (previous && ['Returned', 'Cancelled'].includes(status) && !['Returned', 'Cancelled'].includes(previous.status)) {
      update('equipment', rows => rows.map(e => e.id === previous.equipmentId ? { ...e, available: Math.min(e.quantity, e.available + previous.quantity) } : e));
    }
    notify(`Booking ${id} moved to ${status}.`);
  }
  function markInvoicePaid(id) {
    update('invoices', rows => rows.map(i => i.id === id ? { ...i, paid: i.amount, status: 'Paid' } : i));
    notify(`Invoice ${id} marked as paid in the demo.`);
  }
  function createInvoiceForBooking(b) {
    if (allInvoices.some(i => i.bookingId === b.id)) return notify('An invoice already exists for this booking.');
    update('invoices', rows => [{ id: `INV-${Math.floor(3000 + Math.random() * 4000)}`, bookingId: b.id, customer: b.customer, issued: '2026-11-09', due: b.start, amount: b.total, paid: 0, status: 'Unpaid' }, ...rows]);
    notify(`Invoice created for ${b.id}.`);
  }
  function resetDemo() { localStorage.removeItem('rentflow-demo-v1'); setData(seed); setPage('overview'); notify('Demo data restored to original sample.'); }

  const renderPage = () => {
    switch (page) {
      case 'inventory': return <InventoryPage equipment={allEquipment} search={search} setSearch={setSearch} categoryFilter={categoryFilter} setCategoryFilter={setCategoryFilter} statusFilter={statusFilter} setStatusFilter={setStatusFilter} onAdd={() => setModal({ type: 'equipment' })} onEdit={item => setModal({ type: 'equipment', item })} onDelete={id => { update('equipment', rows => rows.filter(x => x.id !== id)); notify('Equipment removed from demo inventory.'); }} />;
      case 'bookings': return <BookingsPage bookings={allBookings} search={search} setSearch={setSearch} onAdd={openNewBooking} onStatus={changeBookingStatus} onInvoice={createInvoiceForBooking} />;
      case 'customers': return <CustomersPage customers={allCustomers} search={search} setSearch={setSearch} onAdd={() => setModal({ type: 'customer' })} />;
      case 'calendar': return <CalendarPage bookings={allBookings} month={calendarMonth} setMonth={setCalendarMonth} onAdd={openNewBooking} />;
      case 'maintenance': return <MaintenancePage maintenance={data.maintenance} equipment={allEquipment} update={update} notify={notify} />;
      case 'invoices': return <InvoicesPage invoices={allInvoices} onPaid={markInvoicePaid} />;
      case 'reports': return <ReportsPage bookings={allBookings} equipment={allEquipment} invoices={allInvoices} />;
      case 'store': return <StorePage equipment={allEquipment} storeSearch={storeSearch} setStoreSearch={setStoreSearch} onBook={item => setSelectedStoreItem(item)} />;
      case 'settings': return <SettingsPage resetDemo={resetDemo} notify={notify} />;
      default: return <OverviewPage equipment={allEquipment} bookings={allBookings} customers={allCustomers} invoices={allInvoices} onAdd={openNewBooking} go={setPage} />;
    }
  };

  const headerAction = page === 'store' ? <Button variant="outline" icon={ExternalLink} onClick={() => notify('This is the public storefront preview inside your demo.')}>Store preview</Button> : <Button icon={Plus} onClick={openNewBooking}>New booking</Button>;

  return <div className="app-shell">
    <aside className={`sidebar ${sidebarOpen ? 'sidebar-open' : ''}`}>
      <div className="brand-lockup"><div className="brand-mark"><span>R</span><i/></div><div><div className="brand-name">rentflow<span>.</span></div><div className="brand-tag">RENTAL OPERATIONS</div></div><button className="sidebar-close icon-btn" onClick={() => setSidebarOpen(false)}><X size={18}/></button></div>
      <button className="workspace-switch"><div className="workspace-logo">SE</div><div className="workspace-text"><b>Summit Equipment Co.</b><span>Business workspace</span></div><ChevronDown size={15}/></button>
      <nav className="side-nav">
        {['WORKSPACE', 'MANAGE', 'CHANNELS', 'SYSTEM'].map(group => <div className="nav-group" key={group}><div className="nav-label">{group}</div>{navItems.filter(n => n.group === group).map(item => { const Icon = item.icon; return <button key={item.id} className={`nav-item ${page === item.id ? 'active' : ''}`} onClick={() => { setPage(item.id); setSearch(''); setSidebarOpen(false); }}><Icon size={18}/><span>{item.label}</span>{item.count && <small>{item.count}</small>}</button>; })}</div>)}
      </nav>
      <div className="sidebar-bottom"><div className="help-card"><div className="help-icon"><Sparkles size={16}/></div><b>Need a hand?</b><p>Explore the demo or contact our team for a guided walkthrough.</p><button onClick={() => notify('Demo support: hello@rentflow.example')}>Visit help center <ArrowRight size={13}/></button></div><div className="user-profile"><Avatar initials="MA"/><div><b>Muhammad Azhan</b><span>Workspace owner</span></div><MoreHorizontal size={18}/></div></div>
    </aside>
    {sidebarOpen && <div className="mobile-scrim" onClick={() => setSidebarOpen(false)}/>}
    <main className="main-area">
      <header className="topbar"><div className="topbar-left"><button className="mobile-menu icon-btn" onClick={() => setSidebarOpen(true)}><Menu size={20}/></button><div className="breadcrumbs"><span>Workspace</span><ChevronRight size={14}/><b>{activePage}</b></div></div><div className="topbar-right"><SearchBox value={search} onChange={onGlobalSearch} placeholder="Search anything..."/><button className="icon-btn notification-btn" onClick={() => notify('You’re all caught up. No new notifications.')}><Bell size={18}/><i/></button><div className="topbar-divider"/><div className="top-user"><Avatar initials="MA" size="sm"/><div><b>Muhammad Azhan</b><span>Owner</span></div><ChevronDown size={14}/></div></div></header>
      <div className="page-container">{renderPage()}</div>
      <footer className="app-footer"><span>© 2026 RentFlow. All rights reserved.</span><span><i className="status-live"/> Demo workspace <span className="footer-sep">•</span> Sample data</span></footer>
    </main>
    {modal?.type === 'equipment' && <EquipmentModal item={modal.item} onClose={() => setModal(null)} onSave={saveEquipment}/>}
    {modal?.type === 'customer' && <CustomerModal onClose={() => setModal(null)} onSave={saveCustomer}/>}
    {modal?.type === 'booking' && <BookingModal customers={allCustomers} equipment={allEquipment} onClose={() => setModal(null)} onSave={saveBooking}/>}
    {selectedStoreItem && <StoreBookingModal item={selectedStoreItem} onClose={() => setSelectedStoreItem(null)} notify={notify}/>}
    {toast && <div className="toast"><CheckCircle2 size={17}/>{toast}<button onClick={() => setToast('')}><X size={14}/></button></div>}
  </div>;
}

function OverviewPage({ equipment, bookings, customers, invoices, onAdd, go }) {
  const upcoming = bookings.filter(b => ['Pending', 'Confirmed', 'Checked out'].includes(b.status)).sort((a, b) => a.start.localeCompare(b.start)).slice(0, 5);
  const rented = equipment.filter(e => e.status === 'Rented').reduce((s, e) => s + e.quantity, 0);
  const total = equipment.reduce((s, e) => s + e.quantity, 0);
  const availableCount = equipment.reduce((s, e) => s + e.available, 0);
  const maintenanceCount = equipment.filter(e => e.status === 'Maintenance').reduce((s, e) => s + e.quantity, 0);
  const utilization = Math.min(100, Math.round((total ? (total - availableCount) / total : 0) * 100));
  const collected = invoices.reduce((s, i) => s + i.paid, 0);
  const outstanding = invoices.reduce((s, i) => s + i.amount - i.paid, 0);
  return <>
    <PageTitle eyebrow="MONDAY, NOVEMBER 9, 2026" title="Good morning, Muhammad" desc="Here’s what’s happening across your rental business today." actions={<><Button variant="outline" icon={Download} onClick={() => window.print()}>Export report</Button><Button icon={Plus} onClick={onAdd}>Create booking</Button></>}/>
    <div className="demo-banner"><div className="demo-banner-icon"><Sparkles size={18}/></div><div><b>You’re exploring the RentFlow demo</b><span>Sample business data is loaded. Add, edit and manage records to experience the workflow.</span></div><Pill tone="info">Interactive demo</Pill></div>
    <div className="stats-grid"><StatCard label="Collected this month" value={money(collected)} change="8.4%" icon={CircleDollarSign} color="green"/><StatCard label="Active rentals" value={String(bookings.filter(b => b.status === 'Checked out').length)} change="2 due soon" icon={Truck} color="blue"/><StatCard label="Equipment units" value={String(total)} change="Fleet total" icon={Package} color="purple"/><StatCard label="Outstanding balance" value={money(outstanding)} change="Needs follow-up" direction="down" icon={Wallet} color="amber" note="Open invoice balance"/></div>
    <div className="dashboard-grid">
      <section className="panel revenue-panel"><div className="panel-head"><div><h2>Revenue overview</h2><p>Track your rental performance over time</p></div><select className="select-small" defaultValue="6 months"><option>6 months</option><option>12 months</option><option>This year</option></select></div><div className="revenue-summary"><strong>$24,680</strong><span className="trend"><ArrowUpRight size={14}/> 12.8%</span><small>vs. previous period</small></div><div className="chart-wrap"><div className="chart-y"><span>$30k</span><span>$20k</span><span>$10k</span><span>$0</span></div><div className="bar-chart">{[{m:'Jun',v:46},{m:'Jul',v:58},{m:'Aug',v:52},{m:'Sep',v:73},{m:'Oct',v:65},{m:'Nov',v:88}].map((x,i)=><div className="bar-col" key={x.m}><div className="bar-track"><div className={`bar-fill ${i===5?'bar-current':''}`} style={{height:`${x.v}%`}}/></div><span>{x.m}</span></div>)}</div></div><div className="chart-legend"><span><i className="legend-dot blue-dot"/> Rental revenue</span><span><i className="legend-dot pale-dot"/> Previous period</span></div></section>
      <section className="panel utilization-panel"><div className="panel-head"><div><h2>Fleet utilization</h2><p>How efficiently your assets are being used</p></div><button className="icon-btn" onClick={() => go('reports')}><MoreHorizontal size={18}/></button></div><div className="donut-row"><div className="donut" style={{'--progress': `${utilization}%`}}><div><strong>{utilization || 64}%</strong><span>In use</span></div></div><div className="util-legend"><div><i className="legend-dot blue-dot"/><span>Rented</span><b>{rented}</b></div><div><i className="legend-dot green-dot"/><span>Available</span><b>{availableCount}</b></div><div><i className="legend-dot amber-dot"/><span>Maintenance</span><b>{maintenanceCount}</b></div></div></div><div className="util-footer"><span>Fleet utilization rate</span><b>{utilization || 64}% <span className="trend"><ArrowUpRight size={13}/> 4.6%</span></b></div></section>
    </div>
    <div className="dashboard-grid lower-grid"><section className="panel table-panel"><div className="panel-head"><div><h2>Upcoming bookings</h2><p>Stay on top of what’s coming next</p></div><button className="link-btn" onClick={() => go('bookings')}>View all <ArrowRight size={14}/></button></div><div className="table-scroll"><table><thead><tr><th>BOOKING</th><th>CUSTOMER</th><th>RENTAL PERIOD</th><th>AMOUNT</th><th>STATUS</th></tr></thead><tbody>{upcoming.map(b => <tr key={b.id}><td><b className="table-id">{b.id}</b><span className="muted-cell">{b.equipment}</span></td><td><div className="customer-cell"><Avatar initials={(b.customer || '?').split(' ').map(n=>n[0]).join('')}/><span>{b.customer}</span></div></td><td>{prettyDate(b.start)} – {prettyDate(b.end)}</td><td><b>{money(b.total)}</b></td><td><Pill tone={b.status === 'Confirmed' ? 'success' : b.status === 'Checked out' ? 'info' : 'warning'}>{b.status}</Pill></td></tr>)}</tbody></table></div></section>
      <section className="panel activity-panel"><div className="panel-head"><div><h2>Quick actions</h2><p>Common tasks, one click away</p></div></div><div className="quick-actions"><button onClick={onAdd}><span className="quick-icon quick-blue"><CalendarCheck size={18}/></span><span><b>Create a booking</b><small>Reserve equipment for a customer</small></span><ChevronRight size={16}/></button><button onClick={() => go('inventory')}><span className="quick-icon quick-purple"><Package size={18}/></span><span><b>Add equipment</b><small>Grow your rental inventory</small></span><ChevronRight size={16}/></button><button onClick={() => go('customers')}><span className="quick-icon quick-green"><UserPlus size={18}/></span><span><b>Add a customer</b><small>Save a new customer profile</small></span><ChevronRight size={16}/></button><button onClick={() => go('invoices')}><span className="quick-icon quick-amber"><FileText size={18}/></span><span><b>Review invoices</b><small>Check payments and balances</small></span><ChevronRight size={16}/></button></div></section></div>
  </>;
}

function InventoryPage({ equipment, search, setSearch, categoryFilter, setCategoryFilter, statusFilter, setStatusFilter, onAdd, onEdit, onDelete }) {
  const cats = ['All categories', ...Array.from(new Set(equipment.map(e => e.category)))];
  const filtered = equipment.filter(e => (`${e.name} ${e.id} ${e.category} ${e.serial}`).toLowerCase().includes(search.toLowerCase()) && (categoryFilter === 'All categories' || e.category === categoryFilter) && (statusFilter === 'All status' || e.status === statusFilter));
  return <><PageTitle eyebrow="ASSET MANAGEMENT" title="Equipment inventory" desc="Manage your fleet, availability, rates and equipment condition." actions={<><Button variant="outline" icon={Download} onClick={() => downloadCSV('rentflow-equipment.csv', equipment)}>Export CSV</Button><Button icon={Plus} onClick={onAdd}>Add equipment</Button></>}/>
    <div className="mini-stats"><div><span>Total units</span><b>{equipment.reduce((s,e)=>s+e.quantity,0)}</b></div><div><span>Available now</span><b className="text-green">{equipment.reduce((s,e)=>s+e.available,0)}</b></div><div><span>Rented units</span><b>{equipment.filter(e=>e.status==='Rented').reduce((s,e)=>s+e.quantity,0)}</b></div><div><span>In maintenance</span><b className="text-amber">{equipment.filter(e=>e.status==='Maintenance').reduce((s,e)=>s+e.quantity,0)}</b></div></div>
    <section className="panel"><div className="table-toolbar"><div className="toolbar-left"><SearchBox value={search} onChange={setSearch} placeholder="Search equipment..."/><select value={categoryFilter} onChange={e=>setCategoryFilter(e.target.value)} className="filter-select">{cats.map(c=><option key={c}>{c}</option>)}</select><select value={statusFilter} onChange={e=>setStatusFilter(e.target.value)} className="filter-select"><option>All status</option><option>Available</option><option>Rented</option><option>Maintenance</option></select></div><Button variant="outline" size="sm" icon={SlidersHorizontal}>Filters</Button></div>
      <div className="table-scroll"><table><thead><tr><th>EQUIPMENT</th><th>CATEGORY</th><th>AVAILABILITY</th><th>DAILY RATE</th><th>CONDITION</th><th>STATUS</th><th/></tr></thead><tbody>{filtered.map(e=><tr key={e.id}><td><div className="equipment-cell"><EquipmentGlyph kind={e.image}/><div><b>{e.name}</b><span>{e.id} · {e.location}</span></div></div></td><td>{e.category}</td><td><div className="availability-cell"><b>{e.available} <span>/ {e.quantity}</span></b><div className="tiny-progress"><i style={{width:`${e.quantity?e.available/e.quantity*100:0}%`}}/></div></div></td><td><b>{money(e.rate)}</b><span className="muted-cell">per {e.rateUnit}</span></td><td><Pill tone={e.condition==='Excellent'?'success':e.condition==='Fair'?'warning':'neutral'}>{e.condition}</Pill></td><td><Pill tone={e.status==='Available'?'success':e.status==='Rented'?'info':'warning'}>{e.status}</Pill></td><td><div className="row-actions"><button className="icon-btn" title="Edit" onClick={()=>onEdit(e)}><Pencil size={15}/></button><button className="icon-btn" title="Remove" onClick={()=>onDelete(e.id)}><MoreHorizontal size={17}/></button></div></td></tr>)}</tbody></table>{!filtered.length&&<EmptyState title="No equipment found" text="Try changing your search or filters."/>}</div><div className="table-bottom"><span>Showing {filtered.length} of {equipment.length} demo records</span><div><button disabled>Previous</button><button className="current-page">1</button><button disabled>Next</button></div></div></section>
  </>;
}

function BookingsPage({ bookings, search, setSearch, onAdd, onStatus, onInvoice }) {
  const [tab, setTab] = useState('All bookings');
  const tabs = ['All bookings', 'Pending', 'Confirmed', 'Checked out', 'Returned'];
  const rows = bookings.filter(b => (`${b.id} ${b.customer} ${b.equipment}`).toLowerCase().includes(search.toLowerCase()) && (tab === 'All bookings' || b.status === tab));
  return <><PageTitle eyebrow="RENTAL MANAGEMENT" title="Bookings" desc="Create reservations, coordinate equipment handovers and track returns." actions={<Button icon={Plus} onClick={onAdd}>New booking</Button>}/><div className="booking-summary"><div><span>Total bookings</span><b>{bookings.length}</b></div><div><span>Awaiting approval</span><b className="text-amber">{bookings.filter(b=>b.status==='Pending').length}</b></div><div><span>Checked out</span><b>{bookings.filter(b=>b.status==='Checked out').length}</b></div><div><span>Due this week</span><b>{bookings.filter(b=>b.status==='Checked out' && b.end <= '2026-11-15').length}</b></div></div>
    <section className="panel"><div className="table-toolbar booking-toolbar"><div className="tabs">{tabs.map(t=><button key={t} className={tab===t?'tab-active':''} onClick={()=>setTab(t)}>{t}</button>)}</div><SearchBox value={search} onChange={setSearch} placeholder="Search bookings..."/></div><div className="table-scroll"><table><thead><tr><th>BOOKING</th><th>CUSTOMER</th><th>EQUIPMENT</th><th>RENTAL PERIOD</th><th>TOTAL</th><th>STATUS</th><th>ACTIONS</th></tr></thead><tbody>{rows.map(b=><tr key={b.id}><td><b className="table-id">{b.id}</b><span className="muted-cell">{b.location}</span></td><td><b>{b.customer}</b><span className="muted-cell">{b.company}</span></td><td><b>{b.equipment}</b><span className="muted-cell">Qty: {b.quantity}</span></td><td>{prettyDate(b.start)}<span className="muted-cell">to {prettyDate(b.end)}</span></td><td><b>{money(b.total)}</b><span className="muted-cell">Deposit {money(b.deposit)}</span></td><td><Pill tone={b.status==='Confirmed'||b.status==='Returned'?'success':b.status==='Checked out'?'info':'warning'}>{b.status}</Pill></td><td><select className="row-select" value={b.status} onChange={e=>onStatus(b.id,e.target.value)}><option>Pending</option><option>Confirmed</option><option>Checked out</option><option>Returned</option><option>Cancelled</option></select><button className="icon-btn" title="Create invoice" onClick={()=>onInvoice(b)}><FileText size={15}/></button></td></tr>)}</tbody></table>{!rows.length&&<EmptyState title="No bookings found" text="There are no bookings matching this filter."/>}</div><div className="table-bottom"><span>Showing {rows.length} booking records</span><span>Sample data · Actions update this demo</span></div></section>
  </>;
}

function CustomersPage({ customers, search, setSearch, onAdd }) {
  const filtered = customers.filter(c => (`${c.name} ${c.company} ${c.email}`).toLowerCase().includes(search.toLowerCase()));
  return <><PageTitle eyebrow="CUSTOMER RELATIONSHIPS" title="Customers" desc="Keep customer details, rental history and account balances in one place." actions={<><Button variant="outline" icon={Download} onClick={()=>downloadCSV('rentflow-customers.csv',customers)}>Export</Button><Button icon={Plus} onClick={onAdd}>Add customer</Button></>}/><div className="mini-stats"><div><span>Total customers</span><b>{customers.length}</b></div><div><span>Active this month</span><b>{customers.length}</b></div><div><span>Repeat customers</span><b>{customers.filter(c=>c.rentals>1).length}</b></div><div><span>Outstanding balances</span><b className="text-amber">{money(customers.reduce((s,c)=>s+c.balance,0))}</b></div></div><section className="panel"><div className="table-toolbar"><SearchBox value={search} onChange={setSearch} placeholder="Search customers or companies..."/><Button variant="outline" size="sm" icon={Filter}>Filter</Button></div><div className="table-scroll"><table><thead><tr><th>CUSTOMER</th><th>CONTACT</th><th>RENTALS</th><th>OUTSTANDING</th><th>STATUS</th><th/></tr></thead><tbody>{filtered.map(c=><tr key={c.id}><td><div className="customer-cell"><Avatar initials={c.initials}/><div><b>{c.name}</b><span>{c.company}</span></div></div></td><td><div className="contact-stack"><span><Mail size={13}/>{c.email}</span><span><Phone size={13}/>{c.phone}</span></div></td><td><b>{c.rentals}</b><span className="muted-cell">total bookings</span></td><td><b className={c.balance?'text-amber':''}>{money(c.balance)}</b></td><td><Pill tone="success">{c.status}</Pill></td><td><button className="icon-btn" onClick={()=>window.alert(`${c.name}\n${c.company}\n${c.email}\n${c.phone}`)}><MoreHorizontal size={18}/></button></td></tr>)}</tbody></table>{!filtered.length&&<EmptyState title="No customers found" text="Try a different search."/>}</div><div className="table-bottom"><span>Showing {filtered.length} of {customers.length} demo customers</span></div></section></>;
}

function CalendarPage({ bookings, month, setMonth, onAdd }) {
  const monthDate = new Date(2026, month, 1); const monthName = monthDate.toLocaleDateString('en-US',{month:'long',year:'numeric'});
  const firstDay = new Date(2026, month, 1).getDay(); const days = new Date(2026, month+1, 0).getDate();
  const startMonth = `2026-${String(month+1).padStart(2,'0')}-01`; const endMonth = `2026-${String(month+1).padStart(2,'0')}-${String(days).padStart(2,'0')}`;
  const monthBookings = bookings.filter(b => b.start <= endMonth && b.end >= startMonth);
  return <><PageTitle eyebrow="SCHEDULING" title="Rental calendar" desc="Get a clear view of equipment reservations, handovers and returns." actions={<Button icon={Plus} onClick={onAdd}>New booking</Button>}/><div className="calendar-layout"><section className="panel calendar-panel"><div className="calendar-head"><div><h2>{monthName}</h2><p>{monthBookings.length} reservations this month</p></div><div className="calendar-controls"><button className="icon-btn" onClick={()=>setMonth(m=>Math.max(0,m-1))}><ChevronLeft size={17}/></button><Button size="sm" variant="outline" onClick={()=>setMonth(10)}>Today</Button><button className="icon-btn" onClick={()=>setMonth(m=>Math.min(11,m+1))}><ChevronRight size={17}/></button></div></div><div className="calendar-grid">{['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].map(d=><div className="calendar-weekday" key={d}>{d}</div>)}{Array.from({length:firstDay}).map((_,i)=><div className="calendar-day empty-day" key={`e${i}`}/>)}{Array.from({length:days}).map((_,i)=>{const day=i+1;const date=`2026-${String(month+1).padStart(2,'0')}-${String(day).padStart(2,'0')}`;const items=monthBookings.filter(b=>b.start<=date&&b.end>=date);return <div className={`calendar-day ${date==='2026-11-09'?'today-day':''}`} key={date}><span className="day-num">{day}</span>{items.slice(0,2).map(b=><span className={`calendar-event ${b.status==='Pending'?'event-amber':b.status==='Checked out'?'event-blue':'event-green'}`} title={`${b.customer}: ${b.equipment}`} key={b.id}>{b.customer.split(' ')[0]} · {b.id}</span>)}{items.length>2&&<small>+{items.length-2} more</small>}</div>})}</div><div className="calendar-legend"><span><i className="legend-dot green-dot"/> Confirmed</span><span><i className="legend-dot blue-dot"/> Checked out</span><span><i className="legend-dot amber-dot"/> Pending</span></div></section><section className="panel upcoming-panel"><div className="panel-head"><div><h2>Schedule</h2><p>Reservations this month</p></div></div>{monthBookings.sort((a,b)=>a.start.localeCompare(b.start)).map(b=><div className="schedule-item" key={b.id}><div className="schedule-date"><b>{new Date(`${b.start}T12:00:00`).getDate()}</b><span>{new Date(`${b.start}T12:00:00`).toLocaleDateString('en-US',{month:'short'})}</span></div><div className="schedule-info"><b>{b.customer}</b><span>{b.equipment}</span><small>{prettyDate(b.start)} – {prettyDate(b.end)}</small></div><Pill tone={b.status==='Confirmed'?'success':b.status==='Checked out'?'info':'warning'}>{b.status}</Pill></div>)}{!monthBookings.length&&<EmptyState title="No bookings this month" text="Create a booking to see it here."/>}</section></div></>;
}

function MaintenancePage({ maintenance, equipment, update, notify }) {
  const [showAdd,setShowAdd] = useState(false);
  const [task,setTask] = useState(''); const [equip,setEquip] = useState(equipment[0]?.id || ''); const [due,setDue] = useState('2026-11-20');
  const add = () => { if(!task.trim()) return; update('maintenance',rows=>[{id:`MT-${Math.floor(6000+Math.random()*3000)}`,equipment:equipment.find(e=>e.id===equip)?.name||'Equipment',equipmentId:equip,task,due,priority:'Medium',status:'Scheduled',assigned:'Unassigned'},...rows]);setTask('');setShowAdd(false);notify('Maintenance task created.'); };
  const updateStatus = (id,status) => { const item=maintenance.find(m=>m.id===id); update('maintenance',rows=>rows.map(m=>m.id===id?{...m,status}:m)); if(status==='Completed'&&item) update('equipment',rows=>rows.map(e=>e.id===item.equipmentId?{...e,status:'Available'}:e)); notify(`Maintenance task updated to ${status}.`); };
  return <><PageTitle eyebrow="FLEET HEALTH" title="Maintenance" desc="Plan service, track repairs and keep your fleet rental-ready." actions={<Button icon={Plus} onClick={()=>setShowAdd(true)}>Add maintenance task</Button>}/><div className="mini-stats"><div><span>Open tasks</span><b>{maintenance.filter(m=>m.status!=='Completed').length}</b></div><div><span>Overdue</span><b className="text-amber">1</b></div><div><span>In progress</span><b>{maintenance.filter(m=>m.status==='In progress').length}</b></div><div><span>Completed this month</span><b>18</b></div></div><section className="panel"><div className="panel-head panel-pad"><div><h2>Maintenance schedule</h2><p>Keep an eye on service intervals and repairs</p></div><Pill tone="info">{maintenance.length} tasks</Pill></div><div className="table-scroll"><table><thead><tr><th>TASK</th><th>EQUIPMENT</th><th>DUE DATE</th><th>PRIORITY</th><th>ASSIGNED TO</th><th>STATUS</th></tr></thead><tbody>{maintenance.map(m=><tr key={m.id}><td><b>{m.task}</b><span className="muted-cell">{m.id}</span></td><td>{m.equipment}</td><td>{prettyDate(m.due)}</td><td><Pill tone={m.priority==='High'?'danger':m.priority==='Medium'?'warning':'neutral'}>{m.priority}</Pill></td><td>{m.assigned}</td><td><select className="row-select" value={m.status} onChange={e=>updateStatus(m.id,e.target.value)}><option>Scheduled</option><option>In progress</option><option>Completed</option></select></td></tr>)}</tbody></table></div></section>{showAdd&&<Modal title="Add maintenance task" subtitle="Schedule a service or repair for an equipment item." onClose={()=>setShowAdd(false)}><div className="form-grid"><label className="field full"><span>Task description</span><input value={task} onChange={e=>setTask(e.target.value)} placeholder="e.g. Replace hydraulic filter"/></label><label className="field full"><span>Equipment</span><select value={equip} onChange={e=>setEquip(e.target.value)}>{equipment.map(e=><option value={e.id} key={e.id}>{e.name}</option>)}</select></label><label className="field"><span>Due date</span><input type="date" value={due} onChange={e=>setDue(e.target.value)}/></label></div><div className="modal-actions"><Button variant="outline" onClick={()=>setShowAdd(false)}>Cancel</Button><Button onClick={add}>Create task</Button></div></Modal>}</>;
}

function InvoicesPage({ invoices, onPaid }) {
  const paid=invoices.reduce((s,i)=>s+i.paid,0), open=invoices.reduce((s,i)=>s+i.amount-i.paid,0);
  return <><PageTitle eyebrow="BILLING & PAYMENTS" title="Invoices" desc="Create clear rental invoices and keep payment records up to date." actions={<Button variant="outline" icon={Download} onClick={()=>downloadCSV('rentflow-invoices.csv',invoices)}>Export invoices</Button>}/><div className="mini-stats"><div><span>Paid this month</span><b className="text-green">{money(paid)}</b></div><div><span>Outstanding</span><b className="text-amber">{money(open)}</b></div><div><span>Invoices issued</span><b>{invoices.length}</b></div><div><span>Collection rate</span><b>{paid+open>0?`${Math.round(paid/(paid+open)*100)}%`:'0%'}</b></div></div><section className="panel"><div className="panel-head panel-pad"><div><h2>Recent invoices</h2><p>Payment activity across your rental bookings</p></div><Pill tone="success">Auto invoice numbering</Pill></div><div className="table-scroll"><table><thead><tr><th>INVOICE</th><th>CUSTOMER</th><th>ISSUED</th><th>DUE DATE</th><th>AMOUNT</th><th>PAID</th><th>STATUS</th><th/></tr></thead><tbody>{invoices.map(i=><tr key={i.id}><td><b className="table-id">{i.id}</b><span className="muted-cell">{i.bookingId}</span></td><td>{i.customer}</td><td>{prettyDate(i.issued)}</td><td>{prettyDate(i.due)}</td><td><b>{money(i.amount)}</b></td><td>{money(i.paid)}</td><td><Pill tone={i.status==='Paid'?'success':i.status==='Partial'?'info':'warning'}>{i.status}</Pill></td><td><div className="row-actions">{i.status!=='Paid'&&<button className="text-action" onClick={()=>onPaid(i.id)}>Mark paid</button>}<button className="icon-btn" onClick={()=>window.print()} title="Print invoice"><Download size={15}/></button></div></td></tr>)}</tbody></table></div><div className="table-bottom"><span>Demo payment actions only. No money is moved.</span></div></section></>;
}

function ReportsPage({ bookings, equipment, invoices }) {
  const total=equipment.reduce((s,e)=>s+e.quantity,0)+130;
  const categories=[['Earthmoving',38],['Power',26],['Lifting',18],['Tools',12],['Other',6]];
  return <><PageTitle eyebrow="BUSINESS INTELLIGENCE" title="Reports & analytics" desc="Understand revenue, asset utilization and the performance of your rental operation." actions={<Button variant="outline" icon={Download} onClick={()=>window.print()}>Export report</Button>}/><div className="stats-grid"><StatCard label="Gross rental revenue" value="$32,840" change="14.2%" icon={CircleDollarSign} color="green"/><StatCard label="Booking conversion" value="68.4%" change="5.1%" icon={CalendarCheck} color="blue"/><StatCard label="Average booking value" value="$486" change="8.7%" icon={Wallet} color="purple"/><StatCard label="Fleet utilization" value="72.8%" change="4.6%" icon={Activity} color="amber"/></div><div className="dashboard-grid reports-grid"><section className="panel"><div className="panel-head"><div><h2>Revenue by month</h2><p>Rental revenue, last six months</p></div><Pill tone="success">+14.2% YoY</Pill></div><div className="report-bars">{[{m:'Jun',a:42,b:29},{m:'Jul',a:53,b:35},{m:'Aug',a:49,b:38},{m:'Sep',a:68,b:44},{m:'Oct',a:62,b:48},{m:'Nov',a:83,b:54}].map(x=><div className="report-bar-col" key={x.m}><div className="report-bars-inner"><i style={{height:`${x.a}%`}}/><i style={{height:`${x.b}%`}}/></div><span>{x.m}</span></div>)}</div><div className="chart-legend"><span><i className="legend-dot blue-dot"/> This year</span><span><i className="legend-dot pale-dot"/> Last year</span></div></section><section className="panel"><div className="panel-head"><div><h2>Inventory by category</h2><p>{total} asset records across categories</p></div></div><div className="category-list">{categories.map(([name,val],i)=><div key={name}><div><span>{name}</span><b>{val}%</b></div><div className="category-progress"><i style={{width:`${val}%`}} className={`cat-${i}`}/></div></div>)}</div></section></div><section className="panel performance-panel"><div className="panel-head"><div><h2>Operational snapshot</h2><p>Selected activity from your demo workspace</p></div></div><div className="performance-grid"><div><span>Bookings created</span><b>{bookings.length+124}</b><small>Across all locations</small></div><div><span>Active equipment</span><b>{total}</b><small>Assets in the fleet</small></div><div><span>Invoices outstanding</span><b>{invoices.filter(i=>i.status!=='Paid').length+8}</b><small>Need payment follow-up</small></div><div><span>Maintenance items</span><b>7</b><small>Open or scheduled</small></div></div></section></>;
}

function StorePage({ equipment, storeSearch, setStoreSearch, onBook }) {
  const [category,setCategory]=useState('All equipment');
  const categories=['All equipment','Earthmoving','Power','Lifting','Compaction','Concrete','Tools'];
  const items=equipment.filter(e=>e.available>0&&e.name.toLowerCase().includes(storeSearch.toLowerCase())&&(category==='All equipment'||e.category===category));
  return <div className="store-preview"><div className="store-topline"><div className="store-brand"><div className="store-brand-icon">SE</div><span>SUMMIT <b>EQUIPMENT</b></span></div><div className="store-links"><span>Equipment</span><span>How it works</span><span>Contact</span><Button size="sm" onClick={()=>onBook({name:'Request a quote',rate:0})}>Request a quote</Button></div></div><div className="store-hero"><div><Pill tone="info">RELIABLE EQUIPMENT. READY WHEN YOU ARE.</Pill><h1>Get the right equipment.<br/><em>Keep your project moving.</em></h1><p>Well-maintained equipment, straightforward rental terms and dependable support for every job site.</p><div className="store-hero-actions"><button onClick={()=>document.getElementById('store-equipment')?.scrollIntoView({behavior:'smooth'})}>Browse equipment <ArrowRight size={16}/></button><span><ShieldCheck size={15}/> Trusted local equipment partner</span></div></div><div className="store-hero-art"><div className="hero-art-circle"/><div className="hero-art-card"><EquipmentGlyph kind="excavator"/><div><small>FEATURED EQUIPMENT</small><b>Compact excavators</b><span>From $340 / day</span></div></div><div className="hero-art-badge"><CheckCircle2 size={16}/> Ready for your next project</div></div></div><div className="store-benefits"><div><Truck size={20}/><b>Flexible rentals</b><span>Daily and weekly options</span></div><div><ShieldCheck size={20}/><b>Quality checked</b><span>Maintained and inspected</span></div><div><Clock3 size={20}/><b>Quick response</b><span>Helpful rental specialists</span></div><div><MapPin size={20}/><b>Local pickup</b><span>Austin & North Depot</span></div></div><section id="store-equipment" className="store-catalog"><div className="store-section-title"><div><span>OUR RENTAL FLEET</span><h2>Equipment for every job</h2><p>Explore our available equipment and request your rental dates.</p></div><div className="store-search"><Search size={16}/><input placeholder="Search equipment" value={storeSearch} onChange={e=>setStoreSearch(e.target.value)}/></div></div><div className="store-cats">{categories.map(c=><button key={c} className={c===category?'store-cat-active':''} onClick={()=>setCategory(c)}>{c}</button>)}</div><div className="store-products">{items.map(e=><div className="store-product" key={e.id}><div className="store-product-image"><EquipmentGlyph kind={e.image}/><Pill tone="success">Available</Pill></div><div className="store-product-body"><span>{e.category.toUpperCase()}</span><h3>{e.name}</h3><p>{e.description}</p><div><strong>{money(e.rate)}</strong><small> / day</small></div><button onClick={()=>onBook(e)}>Check availability <ArrowRight size={14}/></button></div></div>)}</div>{!items.length&&<EmptyState title="No matching equipment" text="Try another category or search term."/>}</section><footer className="store-footer"><div className="store-brand"><div className="store-brand-icon">SE</div><span>SUMMIT <b>EQUIPMENT</b></span></div><span>Equipment rental made simple.</span><span>© 2026 Summit Equipment Co.</span></footer><div className="store-demo-note"><Sparkles size={14}/> Customer-facing storefront preview · Demo content</div></div>;
}

function SettingsPage({ resetDemo, notify }) {
  const [tab,setTab]=useState('Business profile');
  return <><PageTitle eyebrow="WORKSPACE CONFIGURATION" title="Settings" desc="Configure your business profile, team, rental rules and subscription preferences."/><div className="settings-layout"><aside className="settings-tabs">{['Business profile','Locations','Team & permissions','Rental rules','Notifications','Plan & billing'].map(t=><button className={tab===t?'settings-tab-active':''} key={t} onClick={()=>setTab(t)}>{t}<ChevronRight size={15}/></button>)}</aside><section className="panel settings-panel"><div className="panel-head"><div><h2>{tab}</h2><p>Manage the details for your RentFlow workspace.</p></div></div>{tab==='Business profile'?<div className="settings-form"><div className="profile-logo">SE</div><div className="form-grid"><label className="field"><span>Business name</span><input defaultValue="Summit Equipment Co."/></label><label className="field"><span>Business email</span><input defaultValue="rentals@summitequipment.example"/></label><label className="field"><span>Phone number</span><input defaultValue="+1 (512) 555-0120"/></label><label className="field"><span>Website</span><input defaultValue="www.summitequipment.example"/></label><label className="field full"><span>Business address</span><input defaultValue="2400 Industrial Blvd, Austin, TX 78744"/></label><label className="field"><span>Default currency</span><select defaultValue="USD"><option>USD</option><option>PKR</option><option>GBP</option><option>AED</option><option>CAD</option><option>AUD</option></select></label><label className="field"><span>Timezone</span><select defaultValue="America/Chicago"><option>America/Chicago</option><option>Europe/London</option><option>Asia/Karachi</option></select></label></div><div className="settings-actions"><Button onClick={()=>notify('Business profile saved in this demo.')}>Save changes</Button></div></div>:<div className="settings-placeholder"><div className="empty-icon"><Settings size={24}/></div><h3>{tab}</h3><p>This settings section is represented as a product preview. A production implementation would connect these controls to the business workspace configuration.</p>{tab==='Plan & billing'&&<div className="plan-card"><Pill tone="info">DEMO PLAN</Pill><h3>Growth</h3><strong>$69 <small>/ month</small></strong><p>Online store, 250 equipment records and 5 team members.</p><Button variant="outline" onClick={()=>notify('Plan changes are disabled in the demo.')}>Manage subscription</Button></div>}</div>}</section></div><section className="panel reset-panel"><div><b>Reset demo workspace</b><span>Restore the original sample records if you have changed the demo.</span></div><Button variant="danger-outline" onClick={resetDemo}>Reset sample data</Button></section></>;
}

function EquipmentModal({ item, onClose, onSave }) {
  const [form,setForm]=useState(item?{...item}:{name:'',category:'Earthmoving',quantity:1,available:1,rate:100,rateUnit:'day',condition:'Good',status:'Available',location:'Austin Yard',serial:'',image:'loader',description:''});
  const change=(k,v)=>setForm(f=>({...f,[k]:v}));
  return <Modal title={item?'Edit equipment':'Add equipment'} subtitle="Add an asset to your rental inventory." onClose={onClose}><div className="form-grid"><label className="field full"><span>Equipment name</span><input value={form.name} onChange={e=>change('name',e.target.value)} placeholder="e.g. Diesel generator 7kW"/></label><label className="field"><span>Category</span><select value={form.category} onChange={e=>change('category',e.target.value)}>{['Earthmoving','Power','Lifting','Compaction','Concrete','Tools','Event','Other'].map(x=><option key={x}>{x}</option>)}</select></label><label className="field"><span>Quantity</span><input type="number" min="1" value={form.quantity} onChange={e=>change('quantity',e.target.value)}/></label><label className="field"><span>Daily rate ($)</span><input type="number" min="0" value={form.rate} onChange={e=>change('rate',e.target.value)}/></label><label className="field"><span>Condition</span><select value={form.condition} onChange={e=>change('condition',e.target.value)}><option>Excellent</option><option>Good</option><option>Fair</option></select></label><label className="field"><span>Location</span><select value={form.location} onChange={e=>change('location',e.target.value)}><option>Austin Yard</option><option>North Depot</option><option>South Depot</option></select></label><label className="field"><span>Serial / asset number</span><input value={form.serial} onChange={e=>change('serial',e.target.value)} placeholder="Optional"/></label><label className="field full"><span>Description</span><textarea value={form.description} onChange={e=>change('description',e.target.value)} placeholder="Short equipment description"/></label></div><div className="modal-actions"><Button variant="outline" onClick={onClose}>Cancel</Button><Button onClick={()=>form.name.trim()?onSave(form):null}>{item?'Save changes':'Add equipment'}</Button></div></Modal>;
}
function CustomerModal({ onClose, onSave }) {
  const [form,setForm]=useState({name:'',company:'',email:'',phone:''}); const change=(k,v)=>setForm(f=>({...f,[k]:v}));
  return <Modal title="Add customer" subtitle="Create a customer profile for future rental bookings." onClose={onClose}><div className="form-grid"><label className="field"><span>Full name</span><input value={form.name} onChange={e=>change('name',e.target.value)} placeholder="Customer name"/></label><label className="field"><span>Company</span><input value={form.company} onChange={e=>change('company',e.target.value)} placeholder="Company name"/></label><label className="field"><span>Email address</span><input type="email" value={form.email} onChange={e=>change('email',e.target.value)} placeholder="name@company.com"/></label><label className="field"><span>Phone number</span><input value={form.phone} onChange={e=>change('phone',e.target.value)} placeholder="+1 ..."/></label></div><div className="modal-actions"><Button variant="outline" onClick={onClose}>Cancel</Button><Button disabled={!form.name.trim()} onClick={()=>onSave(form)}>Add customer</Button></div></Modal>;
}
function BookingModal({ customers, equipment, onClose, onSave }) {
  const available=equipment.filter(e=>e.available>0&&e.status!=='Maintenance');
  const [form,setForm]=useState({customerId:customers[0]?.id||'',equipmentId:available[0]?.id||'',quantity:1,start:'2026-11-10',end:'2026-11-12',deposit:0,notes:''});
  const selected=equipment.find(e=>e.id===form.equipmentId); const days=daysBetween(form.start,form.end); const total=(selected?.rate||0)*days*Number(form.quantity||1);
  const change=(k,v)=>setForm(f=>({...f,[k]:v}));
  return <Modal title="Create a booking" subtitle="Reserve equipment for a customer and calculate the rental total." onClose={onClose} width="680px"><div className="form-grid"><label className="field full"><span>Customer</span><select value={form.customerId} onChange={e=>change('customerId',e.target.value)}>{customers.map(c=><option value={c.id} key={c.id}>{c.name} · {c.company}</option>)}</select></label><label className="field full"><span>Equipment</span><select value={form.equipmentId} onChange={e=>change('equipmentId',e.target.value)}>{available.map(e=><option value={e.id} key={e.id}>{e.name} · {money(e.rate)}/day · {e.available} available</option>)}</select></label><label className="field"><span>Rental start</span><input type="date" value={form.start} onChange={e=>change('start',e.target.value)}/></label><label className="field"><span>Rental end</span><input type="date" value={form.end} onChange={e=>change('end',e.target.value)}/></label><label className="field"><span>Quantity</span><input type="number" min="1" max={selected?.available||1} value={form.quantity} onChange={e=>change('quantity',e.target.value)}/></label><label className="field"><span>Security deposit ($)</span><input type="number" min="0" value={form.deposit} onChange={e=>change('deposit',e.target.value)}/></label><label className="field full"><span>Internal note (optional)</span><textarea value={form.notes} onChange={e=>change('notes',e.target.value)} placeholder="Delivery instructions or special requirements"/></label></div><div className="booking-total"><div><span>Estimated rental total</span><small>{days} days × {money(selected?.rate||0)} × {form.quantity} unit(s)</small></div><strong>{money(total)}</strong></div><div className="modal-actions"><Button variant="outline" onClick={onClose}>Cancel</Button><Button disabled={!selected||Number(form.quantity)<1||Number(form.quantity)>selected.available} onClick={()=>onSave(form)}>Create booking</Button></div><p className="modal-footnote">Demo only: creating a booking updates this browser’s sample inventory. It does not send email or collect payment.</p></Modal>;
}
function StoreBookingModal({ item, onClose, notify }) {
  const [form,setForm]=useState({name:'',email:'',start:'2026-11-12',end:'2026-11-14',quantity:1}); const change=(k,v)=>setForm(f=>({...f,[k]:v}));
  const submit=()=>{if(!form.name||!form.email)return;onClose();notify('Demo quote request submitted. A live website would send this to the rental business.');};
  return <Modal title="Request rental availability" subtitle="Share your dates and contact details. The rental team will follow up." onClose={onClose}><div className="selected-equipment"><EquipmentGlyph kind={item.image||'box'}/><div><b>{item.name}</b><span>{item.rate?`${money(item.rate)} per day`:'Tell us what you need'}</span></div></div><div className="form-grid"><label className="field"><span>Your name</span><input value={form.name} onChange={e=>change('name',e.target.value)} placeholder="Full name"/></label><label className="field"><span>Email address</span><input type="email" value={form.email} onChange={e=>change('email',e.target.value)} placeholder="you@example.com"/></label><label className="field"><span>Rental start</span><input type="date" value={form.start} onChange={e=>change('start',e.target.value)}/></label><label className="field"><span>Rental end</span><input type="date" value={form.end} onChange={e=>change('end',e.target.value)}/></label><label className="field"><span>Quantity</span><input type="number" min="1" value={form.quantity} onChange={e=>change('quantity',e.target.value)}/></label></div><div className="modal-actions"><Button variant="outline" onClick={onClose}>Cancel</Button><Button disabled={!form.name||!form.email} onClick={submit}>Send request</Button></div><p className="modal-footnote">Demo storefront: this request is not sent to a real company.</p></Modal>;
}
function downloadCSV(filename, rows) {
  if (!rows?.length) return;
  const keys = Object.keys(rows[0]); const esc = (v) => `"${String(v ?? '').replaceAll('"','""')}"`;
  const csv = [keys.join(','), ...rows.map(r => keys.map(k => esc(r[k])).join(','))].join('\n');
  const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8;' })); const a=document.createElement('a');a.href=url;a.download=filename;a.click();URL.revokeObjectURL(url);
}
