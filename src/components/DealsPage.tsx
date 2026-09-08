import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { PropertyDeal, DealStage, Grade } from '../types/crm';
import {
  Kanban,
  List,
  Plus,
  Search,
  Filter,
  Building,
  DollarSign,
  User,
  Clock,
  ChevronRight,
  Flame
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
  const { deals, updateDealStage, currentUser } = useApp();
  
  const [pipelineTab, setPipelineTab] = useState<'DEALS' | 'AI_INBOUND'>('DEALS');
  const [viewMode, setViewMode] = useState<'kanban' | 'list'>('kanban');
  const [search, setSearch] = useState('');
  const [ownerFilter, setOwnerFilter] = useState('ALL');

  const filteredDeals = deals.filter((d) => {
    const matchesPipeline = pipelineTab === 'AI_INBOUND' ? d.isAiInbound : true;
    const matchesSearch = d.address.toLowerCase().includes(search.toLowerCase()) ||
      d.realtorName.toLowerCase().includes(search.toLowerCase()) ||
      d.city.toLowerCase().includes(search.toLowerCase());
    const matchesOwner = ownerFilter === 'ALL' || d.ownerId === ownerFilter;

    return matchesPipeline && matchesSearch && matchesOwner;
  });

  const handleDragStart = (e: React.DragEvent, dealId: string) => {
    e.dataTransfer.setData('dealId', dealId);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, targetStage: DealStage) => {
    e.preventDefault();
    const dealId = e.dataTransfer.getData('dealId');
    if (dealId && currentUser.role !== 'READ_ONLY') {
      updateDealStage(dealId, targetStage);
    }
  };

  const isReadOnly = currentUser.role === 'READ_ONLY';

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto pb-12">
      
      {/* HEADER & SWITCHERS */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            Acquisition Deals Workspace
            <span className="px-2 py-0.5 rounded-full text-xs font-mono bg-amber-500/10 text-amber-400 border border-amber-500/20">
              {filteredDeals.length} Deals
            </span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Drag-and-drop Kanban pipeline, underwriting inspection, offer tracking, and contract wizard.
          </p>
        </div>

        {/* View Mode & Pipeline Switcher */}
        <div className="flex items-center gap-3">
          
          {/* Dual Pipeline Selector */}
          <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800">
            <button
              onClick={() => setPipelineTab('DEALS')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                pipelineTab === 'DEALS' ? 'bg-amber-500 text-slate-950 shadow-md' : 'text-slate-400 hover:text-white'
              }`}
            >
              All Active Deals
            </button>
            <button
              onClick={() => setPipelineTab('AI_INBOUND')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                pipelineTab === 'AI_INBOUND' ? 'bg-purple-500 text-white shadow-md' : 'text-slate-400 hover:text-white'
              }`}
            >
              AI / Inbound Deals
            </button>
          </div>

          {/* Kanban vs List Switcher */}
          <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800">
            <button
              onClick={() => setViewMode('kanban')}
              className={`p-1.5 rounded-lg transition-colors ${viewMode === 'kanban' ? 'bg-slate-800 text-amber-400' : 'text-slate-400'}`}
              title="Kanban Board View"
            >
              <Kanban className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-1.5 rounded-lg transition-colors ${viewMode === 'list' ? 'bg-slate-800 text-amber-400' : 'text-slate-400'}`}
              title="List View"
            >
              <List className="w-4 h-4" />
            </button>
          </div>

        </div>
      </div>

      {/* SEARCH & FILTERS BAR */}
      <div className="luxury-card rounded-2xl p-3 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search address, city, realtor..."
            className="w-full pl-9 pr-3 py-1.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-amber-500"
          />
        </div>

        <div className="text-xs text-slate-400 flex items-center gap-2">
          <span className="font-semibold text-slate-300">Total Volume:</span>
          <span className="font-mono font-bold text-amber-400 text-sm">
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
                className="w-80 flex-shrink-0 bg-slate-950/60 border border-slate-800/80 rounded-2xl p-3.5 flex flex-col max-h-[75vh]"
              >
                {/* Column Header */}
                <div className="flex justify-between items-center pb-3 border-b border-slate-800 mb-3">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-200">{stage}</span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-slate-900 text-amber-400 border border-slate-800">
                    {stageDeals.length}
                  </span>
                </div>

                {/* Cards Container */}
                <div className="flex-1 overflow-y-auto space-y-3 pr-1">
                  {stageDeals.map((deal) => (
                    <div
                      key={deal.id}
                      draggable={!isReadOnly}
                      onDragStart={(e) => handleDragStart(e, deal.id)}
                      onClick={() => onSelectDeal(deal)}
                      className="luxury-card luxury-card-hover rounded-xl p-3.5 cursor-pointer border border-slate-800/80 hover:border-amber-500/50 transition-all group relative"
                    >
                      <div className="flex justify-between items-start mb-1.5">
                        <span className={`w-5 h-5 rounded font-bold text-[10px] flex items-center justify-center ${
                          deal.grade === 'A' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-blue-500/20 text-blue-400'
                        }`}>
                          {deal.grade}
                        </span>
                        <span className="text-xs font-mono font-bold text-amber-400">
                          ${deal.askingPrice.toLocaleString()}
                        </span>
                      </div>

                      <div className="font-bold text-xs text-white group-hover:text-amber-300 transition-colors">
                        {deal.address}
                      </div>
                      <div className="text-[10px] text-slate-400 mb-3">{deal.city}, {deal.state}</div>

                      <div className="flex items-center justify-between pt-2 border-t border-slate-800/60 text-[10px] text-slate-400">
                        <span>{deal.realtorName}</span>
                        <span className="font-mono text-slate-400">{deal.updatedAt}</span>
                      </div>
                    </div>
                  ))}

                  {stageDeals.length === 0 && (
                    <div className="h-24 border-2 border-dashed border-slate-900 rounded-xl flex items-center justify-center text-[11px] text-slate-400">
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
        <div className="luxury-card rounded-2xl overflow-hidden shadow-xl">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 uppercase tracking-wider text-[10px] bg-slate-950/60">
                <th className="py-3 px-4">Property Address</th>
                <th className="py-3 px-4">Stage</th>
                <th className="py-3 px-4">Asking Price</th>
                <th className="py-3 px-4">Realtor</th>
                <th className="py-3 px-4">Owner</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-200">
              {filteredDeals.map((deal) => (
                <tr key={deal.id} className="hover:bg-slate-900/40 transition-colors">
                  <td className="py-3.5 px-4 font-bold text-white">{deal.address}, {deal.city}</td>
                  <td className="py-3.5 px-4">
                    <span className="px-2.5 py-1 rounded bg-slate-900 border border-slate-700 text-amber-400 font-bold text-[10px]">
                      {deal.stage}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 font-mono font-bold text-white">${deal.askingPrice.toLocaleString()}</td>
                  <td className="py-3.5 px-4 text-slate-300">{deal.realtorName}</td>
                  <td className="py-3.5 px-4 text-slate-300">{deal.ownerName}</td>
                  <td className="py-3.5 px-4 text-right">
                    <button
                      onClick={() => onSelectDeal(deal)}
                      className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-white font-semibold rounded-lg text-[11px]"
                    >
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

    </div>
  );
};
