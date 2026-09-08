import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import type { PropertyDeal } from '../types/crm';
import {
  X,
  FileCheck,
  Building,
  Download,
  FileText,
  RefreshCw,
  AlertTriangle
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface DealDetailProps {
  deal: PropertyDeal | null;
  onClose: () => void;
  onOpenConversation: (convId: string) => void;
}

export const DealDetailDrawer: React.FC<DealDetailProps> = ({ deal, onClose, onOpenConversation }) => {
  const { addGeneratedContract, currentUser } = useApp();
  
  // Contract Generator Wizard Modal State
  const [showContractWizard, setShowContractWizard] = useState(false);
  const [wizardStep, setWizardStep] = useState<1 | 2 | 3 | 4>(1);
  const [selectedTemplate, setSelectedTemplate] = useState('TREC One to Four Family Residential Contract');
  const [isGenerating, setIsGenerating] = useState(false);

  // Validation state
  const [purchasePriceVal, setPurchasePriceVal] = useState<number>(deal?.offerDetails?.purchasePrice || 0);

  if (!deal) return null;

  const isReadOnly = currentUser.role === 'READ_ONLY';

  const handleStartContractWizard = () => {
    setPurchasePriceVal(deal.offerDetails?.purchasePrice || deal.askingPrice);
    setShowContractWizard(true);
    setWizardStep(1);
  };

  const handleGenerateContract = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
      addGeneratedContract(deal.id, {
        templateName: selectedTemplate,
        fileName: `${deal.address.replace(/\s+/g, '_')}_Purchase_Agreement_v${(deal.generatedContracts?.length || 0) + 1}.pdf`,
        fileType: 'pdf',
        generatedBy: currentUser.name
      });
      setWizardStep(4);
      confetti({ particleCount: 80, spread: 60, origin: { y: 0.6 } });
    }, 1500);
  };

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex justify-end">
      <div className="w-full max-w-3xl bg-[#070811] border-l border-[#202641] h-full flex flex-col shadow-2xl relative overflow-y-auto">
        
        {/* HEADER BAR */}
        <div className="p-6 border-b border-[#202641] bg-[#0b0d18] flex items-start justify-between sticky top-0 z-20">
          <div>
            <div className="flex items-center gap-3">
              <h2 className="text-xl font-bold text-white">{deal.address}</h2>
              <span className="px-2.5 py-1 rounded bg-[#101323] border border-[#202641] text-[#9b8afb] font-bold text-xs">
                {deal.stage}
              </span>
            </div>
            <p className="text-xs text-[#a7adc0] mt-1">{deal.city}, {deal.state} {deal.zip} &bull; <span className="font-mono text-slate-300">{deal.propertyType}</span></p>
          </div>

          <div className="flex items-center gap-2">
            {!isReadOnly && (
              <button
                onClick={handleStartContractWizard}
                className="px-4 py-2 bg-[#7c5cfc] hover:bg-[#6847e8] text-white font-bold text-xs rounded-xl shadow-lg shadow-[#7c5cfc]/20 flex items-center gap-2 cursor-pointer"
              >
                <FileCheck className="w-4 h-4" /> GENERATE CONTRACT
              </button>
            )}

            <button onClick={onClose} className="p-1.5 text-[#737b91] hover:text-white rounded-lg border border-[#202641]">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* BODY CONTENT */}
        <div className="p-6 space-y-6">
          
          {/* METRICS GRID */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className="p-3.5 rounded-xl bg-[#101323] border border-[#202641]">
              <span className="text-[#737b91] block text-[10px] uppercase font-bold">Asking Price</span>
              <span className="text-lg font-bold font-mono text-[#9b8afb]">${deal.askingPrice.toLocaleString()}</span>
            </div>
            <div className="p-3.5 rounded-xl bg-[#101323] border border-[#202641]">
              <span className="text-[#737b91] block text-[10px] uppercase font-bold">Beds / Baths</span>
              <span className="text-base font-bold text-white">{deal.beds} Beds &bull; {deal.baths} Baths</span>
            </div>
            <div className="p-3.5 rounded-xl bg-[#101323] border border-[#202641]">
              <span className="text-[#737b91] block text-[10px] uppercase font-bold">Square Footage</span>
              <span className="text-base font-bold text-white">{deal.sqft.toLocaleString()} sqft</span>
            </div>
            <div className="p-3.5 rounded-xl bg-[#101323] border border-[#202641]">
              <span className="text-[#737b91] block text-[10px] uppercase font-bold">Year Built</span>
              <span className="text-base font-bold text-white">{deal.yearBuilt}</span>
            </div>
          </div>

          {/* REALTOR CONTACT CARD */}
          <div className="executive-panel rounded-2xl p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#7c5cfc]/20 text-[#9b8afb] font-bold flex items-center justify-center border border-[#7c5cfc]/30">
                {deal.realtorName.substring(0, 2)}
              </div>
              <div>
                <div className="font-bold text-sm text-white">{deal.realtorName}</div>
                <div className="text-xs text-[#a7adc0]">{deal.realtorBrokerage} &bull; {deal.realtorPhone}</div>
              </div>
            </div>

            {deal.conversationId && (
              <button
                onClick={() => { onClose(); onOpenConversation(deal.conversationId!); }}
                className="px-3 py-1.5 rounded-lg bg-[#070811] border border-[#202641] text-xs font-bold text-[#9b8afb]"
              >
                View SMS History &rarr;
              </button>
            )}
          </div>

          {/* OFFER TERMS */}
          {deal.offerDetails && (
            <div className="executive-panel rounded-2xl p-5 space-y-4">
              <h3 className="text-xs font-bold text-white uppercase tracking-wider border-b border-[#202641] pb-2">
                Underwriting Purchase Terms
              </h3>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs">
                <div>
                  <span className="text-[#737b91] block text-[10px]">Purchase Offer</span>
                  <strong className="text-white text-sm font-mono">${deal.offerDetails.purchasePrice.toLocaleString()}</strong>
                </div>
                <div>
                  <span className="text-[#737b91] block text-[10px]">Earnest Money</span>
                  <strong className="text-white text-sm font-mono">${deal.offerDetails.earnestMoney.toLocaleString()}</strong>
                </div>
                <div>
                  <span className="text-[#737b91] block text-[10px]">Option Fee</span>
                  <strong className="text-white text-sm font-mono">${deal.offerDetails.optionFee} ({deal.offerDetails.optionPeriodDays} Days)</strong>
                </div>
                <div>
                  <span className="text-[#737b91] block text-[10px]">Buyer Entity</span>
                  <strong className="text-white">{deal.offerDetails.buyerEntity}</strong>
                </div>
                <div>
                  <span className="text-[#737b91] block text-[10px]">Closing Target</span>
                  <strong className="text-[#9b8afb] font-mono">{deal.offerDetails.closingDate}</strong>
                </div>
              </div>
            </div>
          )}

          {/* GENERATED CONTRACTS LOG */}
          <div className="executive-panel rounded-2xl p-5 space-y-3">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">
              Generated Contract Documents ({deal.generatedContracts?.length || 0})
            </h3>

            {deal.generatedContracts && deal.generatedContracts.length > 0 ? (
              <div className="space-y-2">
                {deal.generatedContracts.map((c) => (
                  <div key={c.id} className="p-3 rounded-xl bg-[#070811] border border-[#202641] flex items-center justify-between text-xs">
                    <div className="flex items-center gap-3">
                      <FileText className="w-5 h-5 text-[#9b8afb]" />
                      <div>
                        <div className="font-bold text-white">{c.fileName}</div>
                        <div className="text-[10px] text-[#737b91]">{c.templateName} &bull; Generated by {c.generatedBy} on {c.generatedAt}</div>
                      </div>
                    </div>

                    <button
                      onClick={() => alert(`Simulated download: ${c.fileName}`)}
                      className="px-3 py-1 bg-[#101323] text-slate-200 text-[11px] font-bold rounded-lg flex items-center gap-1"
                    >
                      <Download className="w-3.5 h-3.5" /> Download
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-[#737b91] text-center py-4">
                No contracts generated yet. Click "GENERATE CONTRACT" above.
              </p>
            )}
          </div>

        </div>

      </div>

      {/* CONTRACT GENERATOR WIZARD MODAL */}
      {showContractWizard && (
        <div className="fixed inset-0 bg-slate-950/85 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="executive-panel w-full max-w-xl rounded-2xl p-6 relative space-y-4">
            <button onClick={() => setShowContractWizard(false)} className="absolute top-5 right-5 text-[#737b91] hover:text-white">
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-[#7c5cfc]/20 border border-[#7c5cfc]/30 text-[#7c5cfc]">
                <FileCheck className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">Generate Real Estate Contract</h3>
                <p className="text-xs text-[#a7adc0]">Step {wizardStep} of 4 • Auto-populates Underwriting Terms</p>
              </div>
            </div>

            {/* STEP 1: SELECT TEMPLATE */}
            {wizardStep === 1 && (
              <div className="space-y-4 text-xs">
                <label className="block text-[#a7adc0] font-bold">Select Contract Template</label>
                <div className="space-y-2">
                  {[
                    'TREC One to Four Family Residential Contract (Resale)',
                    'Apex Standard Cash Purchase & Sale Agreement',
                    'Assignment of Real Estate Purchase Contract'
                  ].map((t) => (
                    <div
                      key={t}
                      onClick={() => setSelectedTemplate(t)}
                      className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                        selectedTemplate === t ? 'bg-[#7c5cfc]/15 border-[#7c5cfc] text-[#9b8afb] font-bold' : 'bg-[#070811] border-[#202641] text-[#a7adc0]'
                      }`}
                    >
                      {t}
                    </div>
                  ))}
                </div>

                <button
                  onClick={() => setWizardStep(2)}
                  className="w-full py-3 bg-[#7c5cfc] text-white font-bold text-xs rounded-xl"
                >
                  Next: Review Fields & Validation &rarr;
                </button>
              </div>
            )}

            {/* STEP 2: REVIEW REQUIRED FIELDS */}
            {wizardStep === 2 && (
              <div className="space-y-4 text-xs">
                <div className="p-3 rounded-xl bg-[#070811] border border-[#202641] space-y-3">
                  <div className="flex justify-between text-[#a7adc0]"><span>Target Property:</span><strong className="text-white">{deal.address}</strong></div>
                  
                  <div>
                    <label className="block text-[#737b91] mb-1">Purchase Price ($)</label>
                    <input
                      type="number"
                      value={purchasePriceVal}
                      onChange={(e) => setPurchasePriceVal(Number(e.target.value))}
                      className="w-full p-2 bg-[#101323] border border-[#202641] rounded-lg text-white font-mono"
                    />
                  </div>

                  <div className="flex justify-between text-[#a7adc0]"><span>Buyer Entity:</span><strong className="text-white">{deal.offerDetails?.buyerEntity || 'Apex Acquisitions DFW LLC'}</strong></div>
                </div>

                {purchasePriceVal <= 0 && (
                  <div className="p-3 rounded-xl bg-[#d05a72]/10 border border-[#d05a72]/30 text-[#d05a72] flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4" /> Required purchase price field is missing or invalid.
                  </div>
                )}

                <button
                  disabled={purchasePriceVal <= 0}
                  onClick={() => {
                    setWizardStep(3);
                    handleGenerateContract();
                  }}
                  className="w-full py-3 bg-[#7c5cfc] disabled:opacity-50 text-white font-bold text-xs rounded-xl"
                >
                  Confirm & Generate Document Bundle
                </button>
              </div>
            )}

            {/* STEP 3: LOADING */}
            {wizardStep === 3 && (
              <div className="py-12 text-center space-y-3">
                <RefreshCw className="w-8 h-8 text-[#7c5cfc] animate-spin mx-auto" />
                <p className="text-xs font-bold text-white">Compiling Legal Clauses & Merging Fields...</p>
              </div>
            )}

            {/* STEP 4: SUCCESS */}
            {wizardStep === 4 && (
              <div className="space-y-4 text-xs text-center">
                <div className="w-12 h-12 rounded-full bg-[#35b77a]/20 text-[#35b77a] font-bold flex items-center justify-center mx-auto">
                  ✓
                </div>
                <h4 className="text-base font-bold text-white">Contract Package Generated!</h4>
                <p className="text-[#a7adc0]">PDF and DOCX bundles are generated and attached to deal records.</p>

                <button
                  onClick={() => setShowContractWizard(false)}
                  className="w-full py-3 bg-[#7c5cfc] text-white font-bold rounded-xl"
                >
                  Return To Deal Details
                </button>
              </div>
            )}

          </div>
        </div>
      )}

    </div>
  );
};
