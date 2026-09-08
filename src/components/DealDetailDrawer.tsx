import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { PropertyDeal, DealStage } from '../types/crm';
import {
  X,
  FileCheck,
  Building,
  DollarSign,
  User,
  Phone,
  Mail,
  Calendar,
  ShieldCheck,
  Download,
  Send,
  RefreshCw,
  FileText,
  ChevronRight,
  AlertCircle
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface DealDetailProps {
  deal: PropertyDeal | null;
  onClose: () => void;
  onOpenConversation: (convId: string) => void;
}

export const DealDetailDrawer: React.FC<DealDetailProps> = ({ deal, onClose, onOpenConversation }) => {
  const { updateDealStage, addGeneratedContract, currentUser } = useApp();
  
  // Contract Generator Wizard Modal State
  const [showContractWizard, setShowContractWizard] = useState(false);
  const [wizardStep, setWizardStep] = useState<1 | 2 | 3 | 4>(1);
  const [selectedTemplate, setSelectedTemplate] = useState('TREC One to Four Family Residential Contract');
  const [isGenerating, setIsGenerating] = useState(false);

  if (!deal) return null;

  const isReadOnly = currentUser.role === 'READ_ONLY';

  const handleStartContractWizard = () => {
    setShowContractWizard(true);
    setWizardStep(1);
  };

  const handleGenerateContract = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
      addGeneratedContract(deal.id, {
        templateName: selectedTemplate,
        fileName: `${deal.address.replace(/\s+/g, '_')}_Purchase_Agreement_v1.pdf`,
        fileType: 'pdf',
        generatedBy: currentUser.name
      });
      setWizardStep(4);
      confetti({ particleCount: 80, spread: 60, origin: { y: 0.6 } });
    }, 1800);
  };

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex justify-end animate-fadeIn">
      <div className="w-full max-w-3xl bg-slate-950 border-l border-slate-800 h-full flex flex-col shadow-2xl relative overflow-y-auto">
        
        {/* HEADER BAR */}
        <div className="p-6 border-b border-slate-800 bg-slate-900/80 flex items-start justify-between sticky top-0 z-20 backdrop-blur-md">
          <div>
            <div className="flex items-center gap-3">
              <h2 className="text-xl font-bold text-white">{deal.address}</h2>
              <span className="px-2.5 py-1 rounded bg-slate-800 border border-slate-700 text-amber-400 font-bold text-xs">
                {deal.stage}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">{deal.city}, {deal.state} {deal.zip} &bull; <span className="font-mono text-slate-300">{deal.propertyType}</span></p>
          </div>

          <div className="flex items-center gap-2">
            {!isReadOnly && (
              <button
                onClick={handleStartContractWizard}
                className="px-4 py-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs rounded-xl shadow-lg shadow-amber-500/20 flex items-center gap-2 cursor-pointer"
              >
                <FileCheck className="w-4 h-4" /> GENERATE CONTRACT
              </button>
            )}

            <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-white rounded-lg border border-slate-800">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* BODY CONTENT */}
        <div className="p-6 space-y-6">
          
          {/* PROPERTY METRICS GRID */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800">
              <span className="text-slate-400 block text-[10px] uppercase font-bold">Asking Price</span>
              <span className="text-lg font-bold font-mono text-amber-400">${deal.askingPrice.toLocaleString()}</span>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800">
              <span className="text-slate-400 block text-[10px] uppercase font-bold">Beds / Baths</span>
              <span className="text-base font-bold text-white">{deal.beds} Beds &bull; {deal.baths} Baths</span>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800">
              <span className="text-slate-400 block text-[10px] uppercase font-bold">Square Footage</span>
              <span className="text-base font-bold text-white">{deal.sqft.toLocaleString()} sqft</span>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800">
              <span className="text-slate-400 block text-[10px] uppercase font-bold">Year Built</span>
              <span className="text-base font-bold text-white">{deal.yearBuilt}</span>
            </div>
          </div>

          {/* REALTOR CONTACT CARD */}
          <div className="luxury-card rounded-2xl p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 font-bold flex items-center justify-center border border-amber-500/20">
                {deal.realtorName.substring(0, 2)}
              </div>
              <div>
                <div className="font-bold text-sm text-white">{deal.realtorName}</div>
                <div className="text-xs text-slate-400">{deal.realtorBrokerage} &bull; {deal.realtorPhone}</div>
              </div>
            </div>

            {deal.conversationId && (
              <button
                onClick={() => { onClose(); onOpenConversation(deal.conversationId!); }}
                className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs font-bold text-amber-400 hover:border-amber-500/40"
              >
                View SMS History &rarr;
              </button>
            )}
          </div>

          {/* OFFER & PURCHASE TERMS SECTION */}
          {deal.offerDetails && (
            <div className="luxury-card rounded-2xl p-5 space-y-4">
              <h3 className="text-xs font-bold text-white uppercase tracking-wider border-b border-slate-800 pb-2">
                Underwriting Purchase Terms
              </h3>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs">
                <div>
                  <span className="text-slate-400 block text-[10px]">Purchase Price Offer</span>
                  <strong className="text-white text-sm font-mono">${deal.offerDetails.purchasePrice.toLocaleString()}</strong>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Earnest Money Deposit</span>
                  <strong className="text-white text-sm font-mono">${deal.offerDetails.earnestMoney.toLocaleString()}</strong>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Option Fee / Period</span>
                  <strong className="text-white text-sm font-mono">${deal.offerDetails.optionFee} ({deal.offerDetails.optionPeriodDays} Days)</strong>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Buyer Entity</span>
                  <strong className="text-white">{deal.offerDetails.buyerEntity}</strong>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Closing Target Date</span>
                  <strong className="text-amber-400 font-mono">{deal.offerDetails.closingDate}</strong>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Title Company</span>
                  <strong className="text-white">{deal.offerDetails.titleCompany}</strong>
                </div>
              </div>

              <div className="pt-2">
                <span className="text-slate-400 block text-[10px] uppercase font-bold mb-1">Special Provisions</span>
                <p className="text-xs text-slate-300 bg-slate-950 p-3 rounded-xl border border-slate-800">
                  {deal.offerDetails.specialProvisions}
                </p>
              </div>
            </div>
          )}

          {/* GENERATED CONTRACTS LOG */}
          <div className="luxury-card rounded-2xl p-5 space-y-3">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">
              Generated Contract Documents ({deal.generatedContracts?.length || 0})
            </h3>

            {deal.generatedContracts && deal.generatedContracts.length > 0 ? (
              <div className="space-y-2">
                {deal.generatedContracts.map((c) => (
                  <div key={c.id} className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-3">
                      <FileText className="w-5 h-5 text-amber-400" />
                      <div>
                        <div className="font-bold text-white">{c.fileName}</div>
                        <div className="text-[10px] text-slate-400">{c.templateName} &bull; Generated by {c.generatedBy} on {c.generatedAt}</div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => alert(`Simulated downloading contract ${c.fileName}`)}
                        className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 text-[11px] font-bold rounded-lg flex items-center gap-1"
                      >
                        <Download className="w-3 h-3" /> Download
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-400 text-center py-4">
                No contract generated yet. Click "GENERATE CONTRACT" above to launch wizard.
              </p>
            )}
          </div>

        </div>

      </div>

      {/* CONTRACT GENERATOR WIZARD MODAL */}
      {showContractWizard && (
        <div className="fixed inset-0 bg-slate-950/85 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="luxury-card w-full max-w-xl rounded-2xl p-6 relative">
            <button onClick={() => setShowContractWizard(false)} className="absolute top-5 right-5 text-slate-400 hover:text-white">
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 rounded-xl bg-amber-500/20 border border-amber-500/30 text-amber-400">
                <FileCheck className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">Generate Real Estate Contract</h3>
                <p className="text-xs text-slate-400">Step {wizardStep} of 4 • Auto-populates Underwriting Terms</p>
              </div>
            </div>

            {/* STEP 1: SELECT TEMPLATE */}
            {wizardStep === 1 && (
              <div className="space-y-4 text-xs">
                <label className="block text-slate-300 font-bold">Select Contract Template</label>
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
                        selectedTemplate === t ? 'bg-amber-500/15 border-amber-500 text-amber-300 font-bold' : 'bg-slate-950 border-slate-800 text-slate-300'
                      }`}
                    >
                      {t}
                    </div>
                  ))}
                </div>

                <button
                  onClick={() => setWizardStep(2)}
                  className="w-full py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl mt-4"
                >
                  Next: Review Fields &rarr;
                </button>
              </div>
            )}

            {/* STEP 2: REVIEW FIELDS */}
            {wizardStep === 2 && (
              <div className="space-y-4 text-xs">
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                  <div className="flex justify-between text-slate-300"><span>Property:</span><strong className="text-white">{deal.address}</strong></div>
                  <div className="flex justify-between text-slate-300"><span>Purchase Price:</span><strong className="text-amber-400 font-mono">${deal.offerDetails?.purchasePrice.toLocaleString()}</strong></div>
                  <div className="flex justify-between text-slate-300"><span>Buyer:</span><strong className="text-white">{deal.offerDetails?.buyerEntity}</strong></div>
                </div>

                <button
                  onClick={() => {
                    setWizardStep(3);
                    handleGenerateContract();
                  }}
                  className="w-full py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl mt-4"
                >
                  Confirm & Generate Filled PDF
                </button>
              </div>
            )}

            {/* STEP 3: LOADING */}
            {wizardStep === 3 && (
              <div className="py-12 text-center space-y-3">
                <RefreshCw className="w-8 h-8 text-amber-400 animate-spin mx-auto" />
                <p className="text-xs font-bold text-white">Compiling TREC Legal Clauses & Merging Fields...</p>
              </div>
            )}

            {/* STEP 4: SUCCESS */}
            {wizardStep === 4 && (
              <div className="space-y-4 text-xs text-center">
                <div className="w-12 h-12 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 font-bold flex items-center justify-center mx-auto">
                  ✓
                </div>
                <h4 className="text-base font-bold text-white">Contract Ready!</h4>
                <p className="text-slate-400">Document generated successfully and attached to deal history.</p>

                <div className="flex gap-2 pt-2">
                  <button
                    onClick={() => setShowContractWizard(false)}
                    className="flex-1 py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl"
                  >
                    Done & Return To Deal
                  </button>
                </div>
              </div>
            )}

          </div>
        </div>
      )}

    </div>
  );
};
