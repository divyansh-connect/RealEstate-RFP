import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { RealtorContact, ContactStatus, Grade } from '../types/crm';
import {
  Users,
  Upload,
  Search,
  Filter,
  Plus,
  Tag,
  UserCheck,
  Ban,
  FileSpreadsheet,
  X,
  CheckCircle,
  AlertTriangle,
  ChevronRight,
  Phone,
  Mail,
  MoreHorizontal
} from 'lucide-react';

interface ContactsProps {
  onSelectContact: (contact: RealtorContact) => void;
}

export const ContactsPage: React.FC<ContactsProps> = ({ onSelectContact }) => {
  const { contacts, addContact, bulkUpdateContacts, importContacts, currentUser } = useApp();
  
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [gradeFilter, setGradeFilter] = useState<string>('ALL');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  
  // Modals state
  const [showAddModal, setShowAddModal] = useState(false);
  const [showCsvWizard, setShowCsvWizard] = useState(false);
  const [csvStep, setCsvStep] = useState<1 | 2 | 3>(1);

  // New Contact Form State
  const [newContact, setNewContact] = useState({
    name: '',
    licenseNumber: '',
    brokerage: '',
    email: '',
    phone: '',
    market: 'Dallas Metro',
    status: 'Enrolled' as ContactStatus,
    ownerId: currentUser.id,
    ownerName: currentUser.name,
    tags: ['New Realtor'],
    grade: 'B' as Grade,
    score: 75
  });

  // Filtered contacts calculation
  const filteredContacts = contacts.filter((c) => {
    const matchesSearch = c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.brokerage.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase()) ||
      c.phone.includes(search);
    
    const matchesStatus = statusFilter === 'ALL' || c.status === statusFilter;
    const matchesGrade = gradeFilter === 'ALL' || c.grade === gradeFilter;

    return matchesSearch && matchesStatus && matchesGrade;
  });

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedIds(filteredContacts.map(c => c.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleToggleSelect = (id: string) => {
    setSelectedIds(prev => prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]);
  };

  const handleCreateContact = (e: React.FormEvent) => {
    e.preventDefault();
    addContact({
      ...newContact,
      lastContacted: 'Just now',
      lastResponse: 'None',
      notesCount: 0
    });
    setShowAddModal(false);
  };

  const isReadOnly = currentUser.role === 'READ_ONLY';

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      
      {/* Header & Main CTAs */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            Realtor Directory & CRM
            <span className="px-2 py-0.5 rounded-full text-xs font-mono bg-amber-500/10 text-amber-400 border border-amber-500/20">
              {contacts.length} Total
            </span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Manage realtors across DFW markets, bulk enroll in email/SMS cadences, and review AI interaction grades.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {!isReadOnly && (
            <>
              <button
                onClick={() => { setShowCsvWizard(true); setCsvStep(1); }}
                className="px-3.5 py-2 bg-slate-900 border border-slate-800 hover:border-amber-500/40 text-slate-200 text-xs font-semibold rounded-xl transition-all flex items-center gap-2 cursor-pointer shadow-sm"
              >
                <Upload className="w-4 h-4 text-amber-400" /> Upload CSV
              </button>
              <button
                onClick={() => setShowAddModal(true)}
                className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold rounded-xl shadow-lg shadow-amber-500/10 transition-all flex items-center gap-2 cursor-pointer"
              >
                <Plus className="w-4 h-4" /> Add Realtor Contact
              </button>
            </>
          )}
        </div>
      </div>

      {/* FILTER & SEARCH TOOLBAR */}
      <div className="luxury-card rounded-2xl p-4 flex flex-col md:flex-row items-center justify-between gap-4">
        
        {/* Search Input */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search name, brokerage, email..."
            className="w-full pl-10 pr-4 py-2 bg-slate-950/80 border border-slate-800 rounded-xl text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-amber-500/50"
          />
        </div>

        {/* Dropdown Filters */}
        <div className="flex items-center gap-3 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
          <div className="flex items-center gap-1.5 text-xs text-slate-400">
            <Filter className="w-3.5 h-3.5" /> Status:
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-slate-950 border border-slate-800 text-slate-200 text-xs rounded-xl px-3 py-2 focus:outline-none focus:border-amber-500"
          >
            <option value="ALL">All Statuses</option>
            <option value="New">New</option>
            <option value="Enrolled">Enrolled</option>
            <option value="Engaged">Engaged</option>
            <option value="Opted Out">Opted Out</option>
            <option value="DNC">DNC</option>
          </select>

          <div className="flex items-center gap-1.5 text-xs text-slate-400 ml-2">
            Grade:
          </div>
          <select
            value={gradeFilter}
            onChange={(e) => setGradeFilter(e.target.value)}
            className="bg-slate-950 border border-slate-800 text-slate-200 text-xs rounded-xl px-3 py-2 focus:outline-none focus:border-amber-500"
          >
            <option value="ALL">All Grades</option>
            <option value="A">Grade A (90+)</option>
            <option value="B">Grade B (75-89)</option>
            <option value="C">Grade C (50-74)</option>
            <option value="D">Grade D (&lt;50)</option>
          </select>
        </div>

      </div>

      {/* BULK SELECTION ACTION BAR */}
      {selectedIds.length > 0 && !isReadOnly && (
        <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-between animate-fadeIn">
          <div className="text-xs text-amber-300 font-semibold flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
            {selectedIds.length} Realtors Selected
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                bulkUpdateContacts(selectedIds, { status: 'Enrolled' });
                setSelectedIds([]);
              }}
              className="px-3 py-1.5 rounded-lg bg-amber-500 text-slate-950 text-xs font-bold hover:bg-amber-400 transition-colors"
            >
              Enroll in Cadence
            </button>
            <button
              onClick={() => {
                bulkUpdateContacts(selectedIds, { status: 'Opted Out' });
                setSelectedIds([]);
              }}
              className="px-3 py-1.5 rounded-lg bg-slate-800 text-rose-300 hover:bg-rose-500/20 text-xs font-semibold transition-colors"
            >
              Set Do Not Contact
            </button>
          </div>
        </div>
      )}

      {/* REALTOR CONTACTS TABLE */}
      <div className="luxury-card rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 uppercase tracking-wider text-[10px] bg-slate-950/60">
                <th className="py-3 px-4 w-10">
                  <input
                    type="checkbox"
                    checked={selectedIds.length === filteredContacts.length && filteredContacts.length > 0}
                    onChange={handleSelectAll}
                    disabled={isReadOnly}
                    className="rounded border-slate-700 bg-slate-900 text-amber-500 focus:ring-amber-500"
                  />
                </th>
                <th className="py-3 px-4">Realtor Name & Brokerage</th>
                <th className="py-3 px-4">Contact Info</th>
                <th className="py-3 px-4">Market Region</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Grade</th>
                <th className="py-3 px-4">Owner</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-200">
              {filteredContacts.map((c) => (
                <tr
                  key={c.id}
                  className="hover:bg-slate-900/40 transition-colors group cursor-pointer"
                >
                  <td className="py-3.5 px-4" onClick={(e) => e.stopPropagation()}>
                    <input
                      type="checkbox"
                      checked={selectedIds.includes(c.id)}
                      onChange={() => handleToggleSelect(c.id)}
                      disabled={isReadOnly}
                      className="rounded border-slate-700 bg-slate-900 text-amber-500 focus:ring-amber-500"
                    />
                  </td>
                  
                  <td className="py-3.5 px-4" onClick={() => onSelectContact(c)}>
                    <div className="font-bold text-white group-hover:text-amber-400 transition-colors flex items-center gap-2">
                      {c.name}
                    </div>
                    <div className="text-[11px] text-slate-400">{c.brokerage} &bull; <span className="font-mono text-[10px]">{c.licenseNumber}</span></div>
                  </td>

                  <td className="py-3.5 px-4" onClick={() => onSelectContact(c)}>
                    <div className="text-slate-300 flex items-center gap-1.5">
                      <Mail className="w-3 h-3 text-slate-500" /> {c.email}
                    </div>
                    <div className="text-slate-400 text-[11px] flex items-center gap-1.5 mt-0.5">
                      <Phone className="w-3 h-3 text-slate-500" /> {c.phone}
                    </div>
                  </td>

                  <td className="py-3.5 px-4 text-slate-300" onClick={() => onSelectContact(c)}>
                    {c.market}
                  </td>

                  <td className="py-3.5 px-4" onClick={() => onSelectContact(c)}>
                    <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider ${
                      c.status === 'Engaged' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' :
                      c.status === 'Enrolled' ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' :
                      c.status === 'Opted Out' || c.status === 'DNC' ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30' :
                      'bg-slate-800 text-slate-300'
                    }`}>
                      {c.status}
                    </span>
                  </td>

                  <td className="py-3.5 px-4" onClick={() => onSelectContact(c)}>
                    <div className="flex items-center gap-2">
                      <span className={`w-6 h-6 rounded-md font-bold text-xs flex items-center justify-center ${
                        c.grade === 'A' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' :
                        c.grade === 'B' ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' :
                        c.grade === 'C' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' :
                        'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                      }`}>
                        {c.grade}
                      </span>
                      <span className="font-mono text-slate-400 text-[11px]">{c.score}/100</span>
                    </div>
                  </td>

                  <td className="py-3.5 px-4 text-slate-300" onClick={() => onSelectContact(c)}>
                    {c.ownerName}
                  </td>

                  <td className="py-3.5 px-4 text-right">
                    <button
                      onClick={() => onSelectContact(c)}
                      className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 hover:border-amber-500/40 text-slate-200 text-[11px] font-semibold transition-all inline-flex items-center gap-1 cursor-pointer"
                    >
                      Profile <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* CSV IMPORT SIMULATION WIZARD MODAL */}
      {showCsvWizard && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="luxury-card w-full max-w-xl rounded-2xl p-6 relative">
            <button onClick={() => setShowCsvWizard(false)} className="absolute top-5 right-5 text-slate-400 hover:text-white">
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 rounded-xl bg-amber-500/20 border border-amber-500/30 text-amber-400">
                <FileSpreadsheet className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">Import Realtor CSV List</h3>
                <p className="text-xs text-slate-400">Phase 1 Visual Simulation • Automatic Field Mapping & Duplicate Detection</p>
              </div>
            </div>

            {/* Step Indicators */}
            <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-6">
              <div className={`text-xs font-bold ${csvStep === 1 ? 'text-amber-400' : 'text-slate-400'}`}>1. Upload File</div>
              <div className={`text-xs font-bold ${csvStep === 2 ? 'text-amber-400' : 'text-slate-400'}`}>2. Field Mapping</div>
              <div className={`text-xs font-bold ${csvStep === 3 ? 'text-amber-400' : 'text-slate-400'}`}>3. Verification & Import</div>
            </div>

            {/* STEP 1: UPLOAD FILE */}
            {csvStep === 1 && (
              <div className="space-y-4">
                <div className="border-2 border-dashed border-slate-800 rounded-xl p-8 text-center hover:border-amber-500/40 transition-colors bg-slate-950/40 cursor-pointer">
                  <Upload className="w-8 h-8 text-slate-500 mx-auto mb-2" />
                  <p className="text-xs text-slate-300 font-semibold">Drag & Drop DFW Realtor CSV file here</p>
                  <p className="text-[10px] text-slate-400 mt-1">Supports TREC License Lists, Brokerage Rosters (Max 50MB)</p>
                </div>
                <button
                  onClick={() => setCsvStep(2)}
                  className="w-full py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl shadow-lg transition-all"
                >
                  Simulate Upload "dfw_realtors_q3_2026.csv"
                </button>
              </div>
            )}

            {/* STEP 2: FIELD MAPPING */}
            {csvStep === 2 && (
              <div className="space-y-4">
                <div className="space-y-2 text-xs">
                  <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-950/60 border border-slate-800">
                    <span className="text-slate-400">CSV Column: "First & Last Name"</span>
                    <span className="text-amber-400 font-semibold">&rarr; Full Name</span>
                  </div>
                  <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-950/60 border border-slate-800">
                    <span className="text-slate-400">CSV Column: "TREC_ID"</span>
                    <span className="text-amber-400 font-semibold">&rarr; License Number</span>
                  </div>
                  <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-950/60 border border-slate-800">
                    <span className="text-slate-400">CSV Column: "Brokerage Office"</span>
                    <span className="text-amber-400 font-semibold">&rarr; Brokerage</span>
                  </div>
                  <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-950/60 border border-slate-800">
                    <span className="text-slate-400">CSV Column: "Primary Email"</span>
                    <span className="text-amber-400 font-semibold">&rarr; Email</span>
                  </div>
                </div>

                <button
                  onClick={() => setCsvStep(3)}
                  className="w-full py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl shadow-lg transition-all"
                >
                  Confirm Column Mapping & Validate
                </button>
              </div>
            )}

            {/* STEP 3: DUPLICATE VERIFICATION & CONFIRM */}
            {csvStep === 3 && (
              <div className="space-y-4">
                <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-xs text-amber-300 flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold">Duplicate Match Warning:</span> 2 rows match existing email/phone records and will be merged automatically.
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs space-y-1">
                  <div className="flex justify-between text-slate-300">
                    <span>Valid New Realtor Records:</span>
                    <strong className="text-emerald-400">48 Records</strong>
                  </div>
                  <div className="flex justify-between text-slate-300"><span>Duplicates Flagged:</span><strong className="text-amber-400">2 Records</strong></div>
                  <div className="flex justify-between text-slate-300"><span>Target Market:</span><strong className="text-white">Dallas North & Tarrant</strong></div>
                </div>

                <button
                  onClick={() => {
                    importContacts([
                      {
                        name: 'Jonathan Sterling',
                        licenseNumber: 'TREC #0891234',
                        brokerage: 'Sotheby\'s International',
                        email: 'j.sterling@sothebys.com',
                        phone: '(214) 771-0099',
                        market: 'Dallas Metro - Southlake',
                        status: 'Enrolled',
                        ownerId: currentUser.id,
                        ownerName: currentUser.name,
                        tags: ['Imported CSV', 'Luxury'],
                        lastContacted: 'Just now',
                        lastResponse: 'None',
                        grade: 'B',
                        score: 78,
                        notesCount: 0
                      }
                    ]);
                    setShowCsvWizard(false);
                  }}
                  className="w-full py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-xl shadow-lg transition-all"
                >
                  Confirm & Import 48 Realtors To CRM
                </button>
              </div>
            )}

          </div>
        </div>
      )}

      {/* MANUAL ADD CONTACT MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="luxury-card w-full max-w-lg rounded-2xl p-6 relative">
            <button onClick={() => setShowAddModal(false)} className="absolute top-5 right-5 text-slate-400 hover:text-white">
              <X className="w-5 h-5" />
            </button>
            
            <h3 className="text-lg font-bold text-white mb-4">Add Realtor Contact</h3>
            
            <form onSubmit={handleCreateContact} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={newContact.name}
                  onChange={(e) => setNewContact({ ...newContact, name: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-amber-500"
                  placeholder="e.g. Rachel Sterling"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">TREC License Number</label>
                  <input
                    type="text"
                    required
                    value={newContact.licenseNumber}
                    onChange={(e) => setNewContact({ ...newContact, licenseNumber: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-amber-500"
                    placeholder="TREC #0928192"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Brokerage Office</label>
                  <input
                    type="text"
                    required
                    value={newContact.brokerage}
                    onChange={(e) => setNewContact({ ...newContact, brokerage: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-amber-500"
                    placeholder="Compass Real Estate"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Email Address</label>
                  <input
                    type="email"
                    required
                    value={newContact.email}
                    onChange={(e) => setNewContact({ ...newContact, email: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Mobile Phone</label>
                  <input
                    type="text"
                    required
                    value={newContact.phone}
                    onChange={(e) => setNewContact({ ...newContact, phone: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-amber-500"
                    placeholder="(214) 555-0199"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl mt-4"
              >
                Save Contact To CRM
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
