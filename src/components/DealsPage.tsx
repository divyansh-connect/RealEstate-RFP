import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import type { PropertyDeal, DealStage } from '../types/crm';
import {
  Kanban,
  List,
  Plus,
  Search,
  Trash2,
  X,
  Building2,
  Home,
  Zap
} from 'lucide-react';

interface DealsProps {
  onSelectDeal: (deal: PropertyDeal) => void;
}

const STAGES: DealStage[] = [
  'New Property',
  'Qualifying',
  'Offer Made',
  'Offer Accepted',
  'Offer Rejected',
  'Trash',
  'Duplicate Lead',
  'Need Help'
];

const STAGE_CONFIG: Record<DealStage, {
  label: string;
  gradientHeader: string;
  glowBg: string;
  badgeStyle: string;
  cardStripe: string;
}> = {
  'New Property': {
    label: 'NEW PROPERTY',
    gradientHeader: 'bg-gradient-to-r from-[#0B1F3A] via-[#155EEF] to-[#2563EB] text-white',
    glowBg: 'bg-[#155EEF]/25',
    badgeStyle: 'bg-white/20 backdrop-blur-md text-white border border-white/30',
    cardStripe: 'bg-[#155EEF]'
  },
  'Qualifying': {
    label: 'QUALIFYING',
    gradientHeader: 'bg-gradient-to-r from-[#0B1F3A] via-[#155EEF] to-[#2563EB] text-white',
    glowBg: 'bg-[#155EEF]/25',
    badgeStyle: 'bg-white/20 backdrop-blur-md text-white border border-white/30',
    cardStripe: 'bg-[#155EEF]'
  },
  'Offer Made': {
    label: 'OFFER MADE',
    gradientHeader: 'bg-gradient-to-r from-[#0B1F3A] via-[#155EEF] to-[#2563EB] text-white',
    glowBg: 'bg-[#155EEF]/25',
    badgeStyle: 'bg-white/20 backdrop-blur-md text-white border border-white/30',
    cardStripe: 'bg-[#155EEF]'
  },
  'Offer Accepted': {
    label: 'OFFER ACCEPTED',
    gradientHeader: 'bg-gradient-to-r from-[#0B1F3A] via-[#155EEF] to-[#2563EB] text-white',
    glowBg: 'bg-[#155EEF]/25',
    badgeStyle: 'bg-white/20 backdrop-blur-md text-white border border-white/30',
    cardStripe: 'bg-[#155EEF]'
  },
  'Offer Rejected': {
    label: 'OFFER REJECTED',
    gradientHeader: 'bg-gradient-to-r from-[#0B1F3A] via-[#155EEF] to-[#2563EB] text-white',
    glowBg: 'bg-[#155EEF]/25',
    badgeStyle: 'bg-white/20 backdrop-blur-md text-white border border-white/30',
    cardStripe: 'bg-[#155EEF]'
  },
  'Trash': {
    label: 'TRASH',
    gradientHeader: 'bg-gradient-to-r from-[#0B1F3A] via-[#155EEF] to-[#2563EB] text-white',
    glowBg: 'bg-[#155EEF]/25',
    badgeStyle: 'bg-white/20 backdrop-blur-md text-white border border-white/30',
    cardStripe: 'bg-[#155EEF]'
  },
  'Duplicate Lead': {
    label: 'DUPLICATE LEAD',
    gradientHeader: 'bg-gradient-to-r from-[#0B1F3A] via-[#155EEF] to-[#2563EB] text-white',
    glowBg: 'bg-[#155EEF]/25',
    badgeStyle: 'bg-white/20 backdrop-blur-md text-white border border-white/30',
    cardStripe: 'bg-[#155EEF]'
  },
  'Need Help': {
    label: 'NEED HELP',
    gradientHeader: 'bg-gradient-to-r from-[#0B1F3A] via-[#155EEF] to-[#2563EB] text-white',
    glowBg: 'bg-[#155EEF]/25',
    badgeStyle: 'bg-white/20 backdrop-blur-md text-white border border-white/30',
    cardStripe: 'bg-[#155EEF]'
  }
};

export const DealsPage: React.FC<DealsProps> = ({ onSelectDeal }) => {
  const { deals, addDeal, updateDealStage, archiveDeal, currentUser } = useApp();

  const [pipelineTab, setPipelineTab] = useState<'DEALS' | 'AI_INBOUND'>('DEALS');
  const [viewMode, setViewMode] = useState<'kanban' | 'list'>('kanban');
  const [search, setSearch] = useState('');

  // Modals state
  const [showAddDealModal, setShowAddDealModal] = useState(false);
  const [archivingDealId, setArchivingDealId] = useState<string | null>(null);

  const [newDeal, setNewDeal] = useState({
    address: '',
    city: 'Dallas',
    state: 'TX',
    zip: '75205',
    askingPrice: 500000,
    beds: 3,
    baths: 2,
    sqft: 2000,
    yearBuilt: 2000,
    propertyType: 'Single Family Residence',
    stage: 'New Property' as DealStage,
    realtorName: '',
    realtorBrokerage: '',
    realtorPhone: '',
    realtorEmail: ''
  });

  const activeDeals = deals.filter(d => !d.isArchived);

  const filteredDeals = activeDeals.filter((d) => {
    const matchesPipeline = pipelineTab === 'AI_INBOUND' ? d.isAiInbound : true;
    const matchesSearch = d.address.toLowerCase().includes(search.toLowerCase()) ||
      d.realtorName.toLowerCase().includes(search.toLowerCase()) ||
      d.city.toLowerCase().includes(search.toLowerCase());

    return matchesPipeline && matchesSearch;
  });

  const handleDragStart = (e: React.DragEvent, dealId: string) => {
    e.dataTransfer.setData('dealId', dealId);
    e.dataTransfer.setData('text/plain', dealId);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent, targetStage: DealStage) => {
    e.preventDefault();
    const dealId = e.dataTransfer.getData('dealId') || e.dataTransfer.getData('text/plain');
    if (dealId && currentUser.role !== 'READ_ONLY') {
      updateDealStage(dealId, targetStage);
    }
  };

  const handleCreateDeal = (e: React.FormEvent) => {
    e.preventDefault();
    addDeal({
      ...newDeal,
      contactId: `cnt-${Date.now()}`,
      isAiInbound: false,
      ownerId: currentUser.id,
      ownerName: currentUser.name,
      grade: 'B',
      score: 80,
      source: 'Manual Acquisition Entry'
    });
    setShowAddDealModal(false);
  };

  const isReadOnly = currentUser.role === 'READ_ONLY';

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">

      {/* HEADER & SWITCHERS */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#0B1F3A] flex items-center gap-2">
            Deals Workspace
            <span className="px-2.5 py-0.5 rounded-full text-xs font-mono bg-[#EAF2FF] text-[#155EEF] border border-[#155EEF]/20 font-semibold">
              {filteredDeals.length} Active Deals
            </span>
          </h1>
          <p className="text-xs text-[#475569] mt-1">
            Drag-and-drop Kanban pipeline, underwriting analysis, offer tracking, and contract wizard.
          </p>
        </div>

        {/* View Mode & Pipeline Switcher */}
        <div className="flex items-center gap-3">

          {!isReadOnly && (
            <button
              onClick={() => setShowAddDealModal(true)}
              className="px-3.5 py-2 btn-executive-primary text-white text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 cursor-pointer shadow-md"
            >
              <Plus className="w-4 h-4" /> Create Deal
            </button>
          )}

          {/* Dual Pipeline Selector */}
          <div className="flex items-center bg-[#F5F8FC] p-1 rounded-xl border border-[#E2E8F0]">
            <button
              onClick={() => setPipelineTab('DEALS')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                pipelineTab === 'DEALS' ? 'btn-executive-primary text-white shadow-sm' : 'text-[#64748B] hover:text-[#0F172A]'
              }`}
            >
              All Deals
            </button>
            <button
              onClick={() => setPipelineTab('AI_INBOUND')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                pipelineTab === 'AI_INBOUND' ? 'bg-[#155EEF]/10 text-[#155EEF] border border-[#155EEF]/30' : 'text-[#64748B] hover:text-[#0F172A]'
              }`}
            >
              AI / Inbound Deals
            </button>
          </div>

          {/* Kanban vs List Switcher */}
          <div className="flex items-center bg-[#F5F8FC] p-1 rounded-xl border border-[#E2E8F0]">
            <button
              onClick={() => setViewMode('kanban')}
              className={`p-1.5 rounded-lg transition-colors ${viewMode === 'kanban' ? 'bg-white text-[#155EEF] shadow-sm' : 'text-[#64748B]'}`}
            >
              <Kanban className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-1.5 rounded-lg transition-colors ${viewMode === 'list' ? 'bg-white text-[#155EEF] shadow-sm' : 'text-[#64748B]'}`}
            >
              <List className="w-4 h-4" />
            </button>
          </div>

        </div>
      </div>

      {/* SEARCH & FILTERS BAR */}
      <div className="executive-panel rounded-2xl p-3 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-[#64748B] absolute left-3 top-2.5" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search address, city, realtor..."
            className="w-full pl-9 pr-3 py-1.5 bg-white border border-[#E2E8F0] rounded-xl text-xs text-[#0F172A] placeholder-[#94A3B8] focus:outline-none focus:border-[#155EEF] shadow-sm"
          />
        </div>

        <div className="text-xs text-[#475569] flex items-center gap-2">
          <span className="font-semibold text-[#0F172A]">Active Volume:</span>
          <span className="font-mono font-bold text-[#155EEF] text-sm">
            ${filteredDeals.reduce((sum, d) => sum + d.askingPrice, 0).toLocaleString()}
          </span>
        </div>
      </div>

      {/* KANBAN BOARD VIEW */}
      {viewMode === 'kanban' && (
        <div className="flex gap-4 overflow-x-auto pb-6 pt-2">
          {STAGES.map((stage) => {
            const stageDeals = filteredDeals.filter(d => d.stage === stage);
            const conf = STAGE_CONFIG[stage] || STAGE_CONFIG['New Property'];

            return (
              <div
                key={stage}
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, stage)}
                className="w-80 flex-shrink-0 bg-white border border-[#E2E8F0] rounded-2xl flex flex-col max-h-[78vh] shadow-sm overflow-hidden"
              >
                {/* Blurred Gradient Header Banner - Uniform Executive Blue Gradient */}
                <div className="relative overflow-hidden">
                  {/* Ambient Glow Orb Behind Header */}
                  <div className={`absolute -inset-2 ${conf.glowBg} blur-xl pointer-events-none`} />

                  {/* Gradient Banner Header */}
                  <div className={`relative px-4 py-3.5 flex justify-between items-center ${conf.gradientHeader} shadow-md backdrop-blur-md`}>
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-white shadow-[0_0_10px_rgba(255,255,255,0.9)] animate-pulse" />
                      <span className="text-xs font-extrabold tracking-wider uppercase font-sans">
                        {conf.label}
                      </span>
                    </div>
                    <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-mono font-bold ${conf.badgeStyle} shadow-xs`}>
                      {stageDeals.length}
                    </span>
                  </div>
                </div>

                {/* Card Droppable Container */}
                <div
                  onDragOver={handleDragOver}
                  onDrop={(e) => handleDrop(e, stage)}
                  className="flex-1 overflow-y-auto space-y-3 p-3 bg-[#F8FAFC]/60"
                >
                  {stageDeals.map((deal) => (
                    <div
                      key={deal.id}
                      draggable={!isReadOnly}
                      onDragStart={(e) => handleDragStart(e, deal.id)}
                      onClick={() => onSelectDeal(deal)}
                      className="executive-panel executive-panel-hover rounded-2xl p-3.5 cursor-pointer border border-[#E2E8F0] group relative bg-white overflow-hidden shadow-xs hover:shadow-md hover:-translate-y-0.5 transition-all duration-200"
                    >
                      {/* Left vertical color accent bar */}
                      <div className={`absolute left-0 top-0 bottom-0 w-1.5 ${conf.cardStripe}`} />

                      {/* Header Row: Grade + AI Badge + Asking Price */}
                      <div className="flex justify-between items-center mb-2 pl-1.5">
                        <div className="flex items-center gap-1.5">
                          <span className={`w-6 h-6 rounded-lg text-[11px] flex items-center justify-center font-extrabold text-white shadow-2xs ${
                            deal.grade === 'A' ? 'bg-gradient-to-br from-emerald-500 to-teal-600' :
                            deal.grade === 'B' ? 'bg-gradient-to-br from-blue-600 to-indigo-600' :
                            deal.grade === 'C' ? 'bg-gradient-to-br from-amber-500 to-orange-500' :
                            'bg-gradient-to-br from-rose-500 to-red-600'
                          }`}>
                            {deal.grade}
                          </span>
                          {deal.isAiInbound && (
                            <span className="px-2 py-0.5 rounded-full text-[9px] font-extrabold bg-gradient-to-r from-indigo-600 to-blue-600 text-white shadow-2xs flex items-center gap-1">
                              <Zap className="w-2.5 h-2.5 fill-white" /> AI
                            </span>
                          )}
                        </div>

                        <span className="text-xs font-mono font-extrabold text-emerald-700 bg-emerald-50 border border-emerald-200/80 px-2.5 py-1 rounded-lg shadow-2xs">
                          ${deal.askingPrice.toLocaleString()}
                        </span>
                      </div>

                      {/* Address & Specs */}
                      <div className="pl-1.5 space-y-1">
                        <div className="font-bold text-xs text-[#0F172A] group-hover:text-[#155EEF] transition-colors line-clamp-1 flex items-center gap-1.5">
                          <Home className="w-3.5 h-3.5 text-[#155EEF] shrink-0" />
                          <span className="truncate">{deal.address}</span>
                        </div>
                        
                        <div className="text-[10px] text-[#64748B] flex items-center gap-2">
                          <span>{deal.city}, {deal.state}</span>
                          {deal.beds ? (
                            <>
                              <span>•</span>
                              <span className="font-medium text-[#475569]">{deal.beds}b / {deal.baths}b</span>
                            </>
                          ) : null}
                          {deal.sqft ? (
                            <>
                              <span>•</span>
                              <span className="font-medium text-[#475569]">{deal.sqft.toLocaleString()} sqft</span>
                            </>
                          ) : null}
                        </div>
                      </div>

                      {/* Footer: Realtor Badge + Actions */}
                      <div className="flex items-center justify-between pt-2.5 mt-3 border-t border-[#E2E8F0]/80 pl-1.5 text-[10px]">
                        <div className="flex items-center gap-1.5 text-[#475569] font-medium truncate max-w-[170px]">
                          <Building2 className="w-3.5 h-3.5 text-[#155EEF] shrink-0" />
                          <span className="truncate">{deal.realtorName}</span>
                        </div>

                        {!isReadOnly && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setArchivingDealId(deal.id);
                            }}
                            className="p-1 rounded-lg text-[#94A3B8] hover:text-rose-600 hover:bg-rose-50 transition-colors"
                            title="Soft Delete Deal"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}

                  {stageDeals.length === 0 && (
                    <div className="h-24 border-2 border-dashed border-[#CBD5E1] rounded-2xl flex flex-col items-center justify-center text-[11px] text-[#94A3B8] gap-1 bg-white/60">
                      <span>Drop Deal Here</span>
                    </div>
                  )}
                </div>

              </div>
            );
          })}
        </div>
      )}

      {/* LIST VIEW */}
      {viewMode === 'list' && (
        <div className="executive-panel rounded-2xl overflow-hidden shadow-sm border border-[#E2E8F0]">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[#E2E8F0] text-[#64748B] uppercase tracking-wider text-[10px] bg-[#F8FAFC]">
                <th className="py-3 px-4">Property Address</th>
                <th className="py-3 px-4">Stage</th>
                <th className="py-3 px-4">Asking Price</th>
                <th className="py-3 px-4">Realtor</th>
                <th className="py-3 px-4">Owner</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E2E8F0] text-[#0F172A]">
              {filteredDeals.map((deal) => {
                const conf = STAGE_CONFIG[deal.stage] || STAGE_CONFIG['New Property'];

                return (
                  <tr key={deal.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3.5 px-4 font-bold text-[#0F172A]">
                      <div className="flex items-center gap-2">
                        <Home className="w-3.5 h-3.5 text-[#155EEF]" />
                        <span>{deal.address}, {deal.city}</span>
                        {deal.isAiInbound && (
                          <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-indigo-100 text-indigo-700">AI</span>
                        )}
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className={`px-2.5 py-1 rounded-lg ${conf.gradientHeader} font-bold text-[10px] shadow-2xs`}>
                        {deal.stage}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-mono font-extrabold text-emerald-700">${deal.askingPrice.toLocaleString()}</td>
                    <td className="py-3.5 px-4 text-[#475569]">{deal.realtorName}</td>
                    <td className="py-3.5 px-4 text-[#475569]">{deal.ownerName}</td>
                    <td className="py-3.5 px-4 text-right space-x-2">
                      <button
                        onClick={() => onSelectDeal(deal)}
                        className="px-3 py-1 btn-executive-primary text-white font-semibold rounded-lg text-[11px] transition-all cursor-pointer shadow-xs"
                      >
                        Inspect
                      </button>
                      {!isReadOnly && (
                        <button
                          onClick={() => setArchivingDealId(deal.id)}
                          className="p-1 rounded bg-slate-100 text-rose-600 hover:bg-rose-100 transition-colors"
                          title="Archive Deal"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* CREATE DEAL MODAL */}
      {showAddDealModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="executive-panel w-full max-w-lg rounded-2xl p-6 relative space-y-4 shadow-2xl border border-[#E2E8F0]">
            <button onClick={() => setShowAddDealModal(false)} className="absolute top-5 right-5 text-[#64748B] hover:text-[#0F172A]">
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-lg font-bold text-[#0B1F3A]">Create Acquisition Deal</h3>

            <form onSubmit={handleCreateDeal} className="space-y-3 text-xs">
              <div>
                <label className="block text-[#475569] font-semibold mb-1">Property Address</label>
                <input
                  type="text"
                  required
                  value={newDeal.address}
                  onChange={(e) => setNewDeal({ ...newDeal, address: e.target.value })}
                  className="w-full px-3 py-2 bg-white border border-[#E2E8F0] rounded-xl text-[#0F172A] focus:outline-none focus:border-[#155EEF]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#475569] font-semibold mb-1">Asking Price ($)</label>
                  <input
                    type="number"
                    required
                    value={newDeal.askingPrice}
                    onChange={(e) => setNewDeal({ ...newDeal, askingPrice: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-white border border-[#E2E8F0] rounded-xl text-[#0F172A] focus:outline-none focus:border-[#155EEF]"
                  />
                </div>
                <div>
                  <label className="block text-[#475569] font-semibold mb-1">Realtor Name</label>
                  <input
                    type="text"
                    required
                    value={newDeal.realtorName}
                    onChange={(e) => setNewDeal({ ...newDeal, realtorName: e.target.value })}
                    className="w-full px-3 py-2 bg-white border border-[#E2E8F0] rounded-xl text-[#0F172A] focus:outline-none focus:border-[#155EEF]"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 btn-executive-primary text-white font-bold rounded-xl mt-3 transition-all shadow-md cursor-pointer"
              >
                Save Deal To Pipeline
              </button>
            </form>
          </div>
        </div>
      )}

      {/* CONFIRM ARCHIVE DEAL MODAL */}
      {archivingDealId && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="executive-panel w-full max-w-sm rounded-2xl p-6 relative space-y-4 text-center shadow-2xl border border-[#E2E8F0]">
            <h3 className="text-base font-bold text-[#0B1F3A]">Archive Deal Record?</h3>
            <p className="text-xs text-[#475569]">Soft-deletes deal and moves it to Trash stage.</p>
            <div className="flex gap-2">
              <button onClick={() => setArchivingDealId(null)} className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-[#475569] text-xs font-bold rounded-xl transition-colors">Cancel</button>
              <button
                onClick={() => {
                  archiveDeal(archivingDealId);
                  setArchivingDealId(null);
                }}
                className="flex-1 py-2.5 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-xl transition-colors"
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
