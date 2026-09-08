import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import type { RealtorContact, ContactStatus, Grade } from '../types/crm';
import {
  Users,
  Upload,
  Search,
  Filter,
  Plus,
  Trash2,
  Edit2,
  FileSpreadsheet,
  X,
  AlertTriangle,
  Phone,
  Mail
} from 'lucide-react';

interface ContactsProps {
  onSelectContact: (contact: RealtorContact) => void;
}

export const ContactsPage: React.FC<ContactsProps> = ({ onSelectContact }) => {
  const { contacts, addContact, updateContact, archiveContact, bulkUpdateContacts, importContacts, currentUser } = useApp();

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [gradeFilter, setGradeFilter] = useState<string>('ALL');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // Modals state
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingContact, setEditingContact] = useState<RealtorContact | null>(null);
  const [archivingContactId, setArchivingContactId] = useState<string | null>(null);
  const [showCsvWizard, setShowCsvWizard] = useState(false);
  const [csvStep, setCsvStep] = useState<1 | 2 | 3>(1);

  const [formData, setFormData] = useState({
    name: '',
    licenseNumber: '',
    brokerage: '',
    email: '',
    phone: '',
    market: 'Dallas Metro',
    status: 'Active in Outreach' as ContactStatus,
    ownerId: currentUser.id,
    ownerName: currentUser.name,
    tags: ['Realtor Directory'],
    grade: 'B' as Grade,
    score: 75
  });

  const activeContacts = contacts.filter(c => !c.isArchived);

  const filteredContacts = activeContacts.filter((c) => {
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

  const handleCreateOrUpdateContact = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingContact) {
      updateContact(editingContact.id, formData);
      setEditingContact(null);
    } else {
      addContact({
        ...formData,
        lastContacted: 'Just now',
        lastResponse: 'None',
        notes: []
      });
    }
    setShowAddModal(false);
  };

  const isAdmin = currentUser.role === 'ADMIN';
  const isManager = currentUser.role === 'MANAGER';
  const canCreate = isAdmin || isManager;
  const canBulk = isAdmin || isManager;

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">

      {/* Header & Main CTAs */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            Realtor Directory
            <span className="px-2 py-0.5 rounded-full text-xs font-mono bg-[#7c5cfc]/15 text-[#9b8afb] border border-[#7c5cfc]/30">
              {activeContacts.length} Active
            </span>
          </h1>
          <p className="text-xs text-[#a7adc0] mt-1">
            Manage licensed realtors across DFW markets, campaign enrollment, and interaction grades.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {isAdmin && (
            <button
              onClick={() => { setShowCsvWizard(true); setCsvStep(1); }}
              className="px-3.5 py-2 bg-[#12162a] border border-[#202641] hover:border-[#7c5cfc]/40 text-[#f5f5f7] text-xs font-semibold rounded-xl transition-all flex items-center gap-2 cursor-pointer"
            >
              <Upload className="w-4 h-4 text-[#7c5cfc]" /> Upload CSV
            </button>
          )}

          {canCreate && (
            <button
              onClick={() => {
                setEditingContact(null);
                setFormData({
                  name: '',
                  licenseNumber: '',
                  brokerage: '',
                  email: '',
                  phone: '',
                  market: 'Dallas Metro',
                  status: 'Active in Outreach',
                  ownerId: currentUser.id,
                  ownerName: currentUser.name,
                  tags: ['Realtor Directory'],
                  grade: 'B',
                  score: 75
                });
                setShowAddModal(true);
              }}
              className="px-4 py-2 bg-[#7c5cfc] hover:bg-[#6847e8] text-white text-xs font-bold rounded-xl shadow-lg shadow-[#7c5cfc]/20 transition-all flex items-center gap-2 cursor-pointer"
            >
              <Plus className="w-4 h-4" /> Add Realtor
            </button>
          )}
        </div>
      </div>

      {/* FILTER & SEARCH TOOLBAR */}
      <div className="executive-panel rounded-2xl p-4 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-[#737b91] absolute left-3.5 top-3" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search name, brokerage, email..."
            className="w-full pl-10 pr-4 py-2 bg-[#070811] border border-[#202641] rounded-xl text-xs text-[#f5f5f7] placeholder-[#737b91] focus:outline-none focus:border-[#7c5cfc]"
          />
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto overflow-x-auto">
          <div className="flex items-center gap-1.5 text-xs text-[#a7adc0]">
            <Filter className="w-3.5 h-3.5" /> Status:
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-[#070811] border border-[#202641] text-[#f5f5f7] text-xs rounded-xl px-3 py-2 focus:outline-none focus:border-[#7c5cfc]"
          >
            <option value="ALL">All Statuses</option>
            <option value="Active in Outreach">Active in Outreach</option>
            <option value="Responded">Responded</option>
            <option value="Escalated">Escalated</option>
            <option value="Declined">Declined</option>
            <option value="Opted Out">Opted Out</option>
            <option value="Do Not Contact">Do Not Contact</option>
          </select>

          <div className="flex items-center gap-1.5 text-xs text-[#a7adc0] ml-2">Grade:</div>
          <select
            value={gradeFilter}
            onChange={(e) => setGradeFilter(e.target.value)}
            className="bg-[#070811] border border-[#202641] text-[#f5f5f7] text-xs rounded-xl px-3 py-2 focus:outline-none focus:border-[#7c5cfc]"
          >
            <option value="ALL">All Grades</option>
            <option value="A">Grade A (90+)</option>
            <option value="B">Grade B (75-89)</option>
            <option value="C">Grade C (50-74)</option>
            <option value="D">Grade D (&lt;50)</option>
          </select>
        </div>
      </div>

      {/* BULK ACTION BAR */}
      {selectedIds.length > 0 && canBulk && (
        <div className="p-3 rounded-xl bg-[#7c5cfc]/15 border border-[#7c5cfc]/30 flex items-center justify-between">
          <div className="text-xs text-[#9b8afb] font-bold">
            {selectedIds.length} Realtors Selected
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                bulkUpdateContacts(selectedIds, { status: 'Active in Outreach' });
                setSelectedIds([]);
              }}
              className="px-3 py-1.5 rounded-lg bg-[#7c5cfc] text-white text-xs font-bold hover:bg-[#6847e8]"
            >
              Enroll in Cadence
            </button>
            <button
              onClick={() => {
                bulkUpdateContacts(selectedIds, { status: 'Do Not Contact' });
                setSelectedIds([]);
              }}
              className="px-3 py-1.5 rounded-lg bg-[#101323] text-[#d05a72] hover:bg-[#d05a72]/20 text-xs font-semibold"
            >
              Set Do Not Contact
            </button>
          </div>
        </div>
      )}

      {/* REALTOR CONTACTS TABLE */}
      <div className="executive-panel rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[#202641] text-[#737b91] uppercase tracking-wider text-[10px] bg-[#070811]">
                {canBulk && (
                  <th className="py-3 px-4 w-10">
                    <input
                      type="checkbox"
                      checked={selectedIds.length === filteredContacts.length && filteredContacts.length > 0}
                      onChange={handleSelectAll}
                    />
                  </th>
                )}
                <th className="py-3 px-4">Realtor Name & Brokerage</th>
                <th className="py-3 px-4">Contact Info</th>
                <th className="py-3 px-4">Market Region</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Grade</th>
                <th className="py-3 px-4">Owner</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#202641] text-[#f5f5f7]">
              {filteredContacts.map((c) => (
                <tr key={c.id} className="hover:bg-[#171c33]/40 transition-colors group">
                  {canBulk && (
                    <td className="py-3.5 px-4">
                      <input
                        type="checkbox"
                        checked={selectedIds.includes(c.id)}
                        onChange={() => handleToggleSelect(c.id)}
                      />
                    </td>
                  )}

                  <td className="py-3.5 px-4 cursor-pointer" onClick={() => onSelectContact(c)}>
                    <div className="font-bold text-white group-hover:text-[#9b8afb] transition-colors">
                      {c.name}
                    </div>
                    <div className="text-[11px] text-[#a7adc0]">{c.brokerage} &bull; <span className="font-mono text-[10px]">{c.licenseNumber}</span></div>
                  </td>

                  <td className="py-3.5 px-4 cursor-pointer" onClick={() => onSelectContact(c)}>
                    <div className="text-[#a7adc0] flex items-center gap-1.5">
                      <Mail className="w-3 h-3 text-[#737b91]" /> {c.email}
                    </div>
                    <div className="text-[#737b91] text-[11px] flex items-center gap-1.5 mt-0.5">
                      <Phone className="w-3 h-3 text-[#737b91]" /> {c.phone}
                    </div>
                  </td>

                  <td className="py-3.5 px-4 text-[#a7adc0]">{c.market}</td>

                  <td className="py-3.5 px-4">
                    <span className={`px-2.5 py-1 rounded text-[10px] font-bold uppercase tracking-wider ${c.status === 'Responded' ? 'bg-[#35b77a]/15 text-[#35b77a] border border-[#35b77a]/30' :
                      c.status === 'Active in Outreach' ? 'bg-[#7c5cfc]/15 text-[#9b8afb] border border-[#7c5cfc]/30' :
                        c.status === 'Escalated' ? 'bg-[#7c5cfc] text-white shadow-sm' :
                          c.status === 'Declined' ? 'bg-[#101323] text-[#a7adc0] border border-[#202641]' :
                            'bg-[#d05a72]/15 text-[#d05a72] border border-[#d05a72]/30'
                      }`}>
                      {c.status}
                    </span>
                  </td>

                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-1.5">
                      <span className={`w-6 h-6 rounded-lg font-bold text-xs flex items-center justify-center border ${c.grade === 'A' ? 'bg-[#35b77a]/15 text-[#35b77a] border-[#35b77a]/30' :
                        c.grade === 'B' ? 'bg-[#5965d8]/15 text-[#5965d8] border-[#5965d8]/30' :
                          c.grade === 'C' ? 'bg-[#9b8afb]/15 text-[#9b8afb] border-[#9b8afb]/30' :
                            'bg-[#d05a72]/15 text-[#d05a72] border-[#d05a72]/30'
                        }`}>
                        {c.grade}
                      </span>
                      <span className="font-mono text-[#737b91] text-[11px]">{c.score}</span>
                    </div>
                  </td>

                  <td className="py-3.5 px-4 text-[#a7adc0]">{c.ownerName}</td>

                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => onSelectContact(c)}
                        className="px-2.5 py-1 rounded-lg bg-[#101323] border border-[#202641] text-[#f5f5f7] hover:bg-[#171c33] hover:border-[#7c5cfc]/40 text-[11px] font-semibold transition-all"
                      >
                        Profile
                      </button>

                      {canCreate && (
                        <button
                          onClick={() => {
                            setEditingContact(c);
                            setFormData({
                              name: c.name,
                              licenseNumber: c.licenseNumber,
                              brokerage: c.brokerage,
                              email: c.email,
                              phone: c.phone,
                              market: c.market,
                              status: c.status,
                              ownerId: c.ownerId,
                              ownerName: c.ownerName,
                              tags: c.tags,
                              grade: c.grade,
                              score: c.score
                            });
                            setShowAddModal(true);
                          }}
                          className="p-1.5 rounded-lg bg-[#101323] border border-[#202641] text-[#a7adc0] hover:text-white hover:border-[#7c5cfc]/40 transition-all"
                          title="Edit Realtor"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                      )}

                      {canCreate && (
                        <button
                          onClick={() => setArchivingContactId(c.id)}
                          className="p-1.5 rounded-lg bg-[#101323] border border-[#202641] text-[#d05a72] hover:bg-[#d05a72]/15 hover:border-[#d05a72]/40 transition-all"
                          title="Archive Realtor"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* CSV IMPORT MODAL */}
      {showCsvWizard && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="executive-panel w-full max-w-xl rounded-2xl p-6 relative space-y-4">
            <button onClick={() => setShowCsvWizard(false)} className="absolute top-5 right-5 text-[#737b91] hover:text-white">
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-[#7c5cfc]/20 border border-[#7c5cfc]/30 text-[#7c5cfc]">
                <FileSpreadsheet className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">Import Realtor CSV List</h3>
                <p className="text-xs text-[#a7adc0]">Column Mapping & Duplicate Verification</p>
              </div>
            </div>

            {csvStep === 1 && (
              <div className="space-y-4 pt-2">
                <div className="border-2 border-dashed border-[#202641] rounded-xl p-8 text-center bg-[#070811] cursor-pointer">
                  <Upload className="w-8 h-8 text-[#737b91] mx-auto mb-2" />
                  <p className="text-xs text-slate-300 font-semibold">Upload DFW Realtor CSV file</p>
                </div>
                <button
                  onClick={() => setCsvStep(2)}
                  className="w-full py-3 bg-[#7c5cfc] hover:bg-[#6847e8] text-white font-bold text-xs rounded-xl"
                >
                  Simulate Upload "dfw_realtors_q3.csv"
                </button>
              </div>
            )}

            {csvStep === 2 && (
              <div className="space-y-3 text-xs pt-2">
                <div className="flex justify-between p-2 bg-[#070811] rounded border border-[#202641]">
                  <span className="text-[#a7adc0]">Column: Name</span>
                  <strong className="text-[#9b8afb]">&rarr; Full Name</strong>
                </div>
                <button
                  onClick={() => setCsvStep(3)}
                  className="w-full py-3 bg-[#7c5cfc] text-white font-bold text-xs rounded-xl"
                >
                  Confirm Mapping & Validate
                </button>
              </div>
            )}

            {csvStep === 3 && (
              <div className="space-y-3 text-xs pt-2">
                <div className="p-3 rounded-xl bg-[#7c5cfc]/10 border border-[#7c5cfc]/30 text-[#9b8afb] flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                  <span>2 duplicate records detected & merged automatically.</span>
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
                        status: 'Active in Outreach',
                        ownerId: currentUser.id,
                        ownerName: currentUser.name,
                        tags: ['Imported CSV'],
                        lastContacted: 'Just now',
                        lastResponse: 'None',
                        grade: 'B',
                        score: 78,
                        notes: []
                      }
                    ]);
                    setShowCsvWizard(false);
                  }}
                  className="w-full py-3 bg-[#35b77a] text-slate-950 font-bold text-xs rounded-xl"
                >
                  Import 48 Valid Records To CRM
                </button>
              </div>
            )}

          </div>
        </div>
      )}

      {/* MANUAL ADD / EDIT CONTACT MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="executive-panel w-full max-w-lg rounded-2xl p-6 relative space-y-4">
            <button onClick={() => setShowAddModal(false)} className="absolute top-5 right-5 text-[#737b91] hover:text-white">
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-lg font-bold text-white">{editingContact ? 'Edit Realtor Record' : 'Add Realtor Contact'}</h3>

            <form onSubmit={handleCreateOrUpdateContact} className="space-y-3 text-xs">
              <div>
                <label className="block text-[#a7adc0] font-semibold mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 bg-[#070811] border border-[#202641] rounded-xl text-white focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#a7adc0] font-semibold mb-1">TREC License Number</label>
                  <input
                    type="text"
                    required
                    value={formData.licenseNumber}
                    onChange={(e) => setFormData({ ...formData, licenseNumber: e.target.value })}
                    className="w-full px-3 py-2 bg-[#070811] border border-[#202641] rounded-xl text-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[#a7adc0] font-semibold mb-1">Brokerage Office</label>
                  <input
                    type="text"
                    required
                    value={formData.brokerage}
                    onChange={(e) => setFormData({ ...formData, brokerage: e.target.value })}
                    className="w-full px-3 py-2 bg-[#070811] border border-[#202641] rounded-xl text-white focus:outline-none"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-[#7c5cfc] hover:bg-[#6847e8] text-white font-bold rounded-xl mt-3"
              >
                {editingContact ? 'Save Changes' : 'Save Realtor To Directory'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* CONFIRM ARCHIVE MODAL */}
      {archivingContactId && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="executive-panel w-full max-w-sm rounded-2xl p-6 relative space-y-4 text-center">
            <AlertTriangle className="w-10 h-10 text-[#d05a72] mx-auto" />
            <h3 className="text-base font-bold text-white">Archive Realtor Record?</h3>
            <p className="text-xs text-[#a7adc0]">Soft-deletes record while preserving audit trail history.</p>
            <div className="flex gap-2">
              <button onClick={() => setArchivingContactId(null)} className="flex-1 py-2.5 bg-[#101323] text-slate-300 text-xs font-bold rounded-xl">Cancel</button>
              <button
                onClick={() => {
                  archiveContact(archivingContactId);
                  setArchivingContactId(null);
                }}
                className="flex-1 py-2.5 bg-[#d05a72] text-white text-xs font-bold rounded-xl"
              >
                Confirm Archive
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
