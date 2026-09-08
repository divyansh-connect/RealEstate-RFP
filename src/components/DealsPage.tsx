import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import type { PropertyDeal, DealStage } from '../types/crm';
import {
  Kanban,
  List,
  Plus,
  Search,
  Trash2,
  X
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
    <div className="space-y-6 max-w-[1600px] mx-auto pb-12">
      
      {/* HEADER & SWITCHERS */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            Deals Workspace
            <span className="px-2 py-0.5 rounded-full text-xs font-mono bg-[#7c5cfc]/15 text-[#9b8afb] border border-[#7c5cfc]/30">
              {filteredDeals.length} Active Deals
            </span>
          </h1>
          <p className="text-xs text-[#a7adc0] mt-1">
            Drag-and-drop Kanban pipeline, underwriting analysis, offer tracking, and contract wizard.
          </p>
        </div>

        {/* View Mode & Pipeline Switcher */}
        <div className="flex items-center gap-3">
          
          {!isReadOnly && (
            <button
              onClick={() => setShowAddDealModal(true)}
              className="px-3.5 py-2 bg-[#7c5cfc] hover:bg-[#6847e8] text-white text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 cursor-pointer shadow-md shadow-[#7c5cfc]/20"
            >
              <Plus className="w-4 h-4" /> Create Deal
            </button>
          )}

          {/* Dual Pipeline Selector */}
          <div className="flex items-center bg-[#070811] p-1 rounded-xl border border-[#202641]">
            <button
              onClick={() => setPipelineTab('DEALS')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                pipelineTab === 'DEALS' ? 'bg-[#7c5cfc] text-white shadow-md' : 'text-[#a7adc0] hover:text-white'
              }`}
            >
              All Deals
            </button>
            <button
              onClick={() => setPipelineTab('AI_INBOUND')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                pipelineTab === 'AI_INBOUND' ? 'bg-[#a855f7]/20 text-[#a855f7] border border-[#a855f7]/30' : 'text-[#a7adc0] hover:text-white'
              }`}
            >
              AI / Inbound Deals
            </button>
          </div>

          {/* Kanban vs List Switcher */}
          <div className="flex items-center bg-[#070811] p-1 rounded-xl border border-[#202641]">
            <button
              onClick={() => setViewMode('kanban')}
              className={`p-1.5 rounded-lg transition-colors ${viewMode === 'kanban' ? 'bg-[#101323] text-[#7c5cfc]' : 'text-[#737b91]'}`}
            >
              <Kanban className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-1.5 rounded-lg transition-colors ${viewMode === 'list' ? 'bg-[#101323] text-[#7c5cfc]' : 'text-[#737b91]'}`}
            >
              <List className="w-4 h-4" />
            </button>
          </div>

        </div>
      </div>

      {/* SEARCH & FILTERS BAR */}
      <div className="executive-panel rounded-2xl p-3 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-[#737b91] absolute left-3 top-2.5" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search address, city, realtor..."
            className="w-full pl-9 pr-3 py-1.5 bg-[#070811] border border-[#202641] rounded-xl text-xs text-white focus:outline-none focus:border-[#7c5cfc]"
          />
        </div>

        <div className="text-xs text-[#a7adc0] flex items-center gap-2">
          <span className="font-semibold text-slate-300">Active Volume:</span>
          <span className="font-mono font-bold text-[#9b8afb] text-sm">
            ${filteredDeals.reduce((sum, d) => sum + d.askingPrice, 0).toLocaleString()}
          </span>
        </div>
      </div>

      {/* KANBAN BOARD VIEW */}
      {viewMode === 'kanban' && (
        <div className="flex gap-4 overflow-x-auto pb-6 pt-2">
          {STAGES.map((stage) => {
            const stageDeals = filteredDeals.filter(d => d.stage === stage);

            return (
              <div
                key={stage}
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, stage)}
                className="w-80 flex-shrink-0 bg-[#0b0d18] border border-[#202641] rounded-2xl p-3.5 flex flex-col max-h-[75vh]"
              >
                <div className="flex justify-between items-center pb-3 border-b border-[#202641] mb-3">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#a7adc0]">{stage}</span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-[#070811] text-[#9b8afb] border border-[#202641]">
                    {stageDeals.length}
                  </span>
                </div>

                <div
                  onDragOver={handleDragOver}
                  onDrop={(e) => handleDrop(e, stage)}
                  className="flex-1 overflow-y-auto space-y-3 pr-1"
                >
                  {stageDeals.map((deal) => (
                    <div
                      key={deal.id}
                      draggable={!isReadOnly}
                      onDragStart={(e) => handleDragStart(e, deal.id)}
                      onClick={() => onSelectDeal(deal)}
                      className="executive-panel executive-panel-hover rounded-xl p-3.5 cursor-pointer border border-[#202641] group relative"
                    >
                      <div className="flex justify-between items-start mb-1.5">
                        <span className="w-5 h-5 rounded font-bold text-[10px] flex items-center justify-center bg-[#101323] text-[#9b8afb] border border-[#202641]">
                          {deal.grade}
                        </span>
                        <span className="text-xs font-mono font-bold text-[#f5f5f7]">
                          ${deal.askingPrice.toLocaleString()}
                        </span>
                      </div>

                      <div className="font-bold text-xs text-white group-hover:text-[#9b8afb] transition-colors">
                        {deal.address}
                      </div>
                      <div className="text-[10px] text-[#737b91] mb-3">{deal.city}, {deal.state}</div>

                      <div className="flex items-center justify-between pt-2 border-t border-[#202641] text-[10px] text-[#737b91]">
                        <span>{deal.realtorName}</span>
                        {!isReadOnly && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setArchivingDealId(deal.id);
                            }}
                            className="text-[#737b91] hover:text-[#d05a72]"
                            title="Soft Delete Deal"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}

                  {stageDeals.length === 0 && (
                    <div className="h-20 border border-dashed border-[#202641] rounded-xl flex items-center justify-center text-[11px] text-[#737b91]">
                      Drop Deal Here
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
        <div className="executive-panel rounded-2xl overflow-hidden shadow-xl">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[#202641] text-[#737b91] uppercase tracking-wider text-[10px] bg-[#070811]">
                <th className="py-3 px-4">Property Address</th>
                <th className="py-3 px-4">Stage</th>
                <th className="py-3 px-4">Asking Price</th>
                <th className="py-3 px-4">Realtor</th>
                <th className="py-3 px-4">Owner</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#202641] text-[#f5f5f7]">
              {filteredDeals.map((deal) => (
                <tr key={deal.id} className="hover:bg-[#171c33]/40 transition-colors">
                  <td className="py-3.5 px-4 font-bold text-white">{deal.address}, {deal.city}</td>
                  <td className="py-3.5 px-4">
                    <span className="px-2.5 py-1 rounded bg-[#070811] border border-[#202641] text-[#9b8afb] font-bold text-[10px]">
                      {deal.stage}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 font-mono font-bold text-white">${deal.askingPrice.toLocaleString()}</td>
                  <td className="py-3.5 px-4 text-[#a7adc0]">{deal.realtorName}</td>
                  <td className="py-3.5 px-4 text-[#a7adc0]">{deal.ownerName}</td>
                  <td className="py-3.5 px-4 text-right space-x-2">
                    <button
                      onClick={() => onSelectDeal(deal)}
                      className="px-3 py-1 bg-[#101323] text-white font-semibold rounded-lg text-[11px]"
                    >
                      Inspect
                    </button>
                    {!isReadOnly && (
                      <button
                        onClick={() => setArchivingDealId(deal.id)}
                        className="p-1 rounded bg-[#101323] text-[#d05a72] hover:bg-[#d05a72]/20"
                        title="Archive Deal"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* CREATE DEAL MODAL */}
      {showAddDealModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="executive-panel w-full max-w-lg rounded-2xl p-6 relative space-y-4">
            <button onClick={() => setShowAddDealModal(false)} className="absolute top-5 right-5 text-[#737b91] hover:text-white">
              <X className="w-5 h-5" />
            </button>
            
            <h3 className="text-lg font-bold text-white">Create Acquisition Deal</h3>
            
            <form onSubmit={handleCreateDeal} className="space-y-3 text-xs">
              <div>
                <label className="block text-[#a7adc0] font-semibold mb-1">Property Address</label>
                <input
                  type="text"
                  required
                  value={newDeal.address}
                  onChange={(e) => setNewDeal({ ...newDeal, address: e.target.value })}
                  className="w-full px-3 py-2 bg-[#070811] border border-[#202641] rounded-xl text-white focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#a7adc0] font-semibold mb-1">Asking Price ($)</label>
                  <input
                    type="number"
                    required
                    value={newDeal.askingPrice}
                    onChange={(e) => setNewDeal({ ...newDeal, askingPrice: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-[#070811] border border-[#202641] rounded-xl text-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[#a7adc0] font-semibold mb-1">Realtor Name</label>
                  <input
                    type="text"
                    required
                    value={newDeal.realtorName}
                    onChange={(e) => setNewDeal({ ...newDeal, realtorName: e.target.value })}
                    className="w-full px-3 py-2 bg-[#070811] border border-[#202641] rounded-xl text-white focus:outline-none"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-[#7c5cfc] hover:bg-[#6847e8] text-white font-bold rounded-xl mt-3"
              >
                Save Deal To Pipeline
              </button>
            </form>
          </div>
        </div>
      )}

      {/* CONFIRM ARCHIVE DEAL MODAL */}
      {archivingDealId && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="executive-panel w-full max-w-sm rounded-2xl p-6 relative space-y-4 text-center">
            <h3 className="text-base font-bold text-white">Archive Deal Record?</h3>
            <p className="text-xs text-[#a7adc0]">Soft-deletes deal and moves it to Trash stage.</p>
            <div className="flex gap-2">
              <button onClick={() => setArchivingDealId(null)} className="flex-1 py-2.5 bg-[#101323] text-slate-300 text-xs font-bold rounded-xl">Cancel</button>
              <button
                onClick={() => {
                  archiveDeal(archivingDealId);
                  setArchivingDealId(null);
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
