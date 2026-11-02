import React, { useEffect, useState } from 'react';
import { crmService } from '../../services/crmService';
import { CrmLead, LeadStage, CrmNote } from '../../types/crm';
import {
  Kanban,
  Plus,
  Flame,
  Phone,
  Mail,
  ArrowRight,
  ArrowLeft,
  DollarSign,
  MessageSquare,
  Building,
  CheckCircle,
  X,
  Send,
} from 'lucide-react';
import { Modal } from '../../components/common/Modal';

export const AgentPipelinePage: React.FC = () => {
  const [leads, setLeads] = useState<CrmLead[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedLead, setSelectedLead] = useState<CrmLead | null>(null);
  const [notes, setNotes] = useState<CrmNote[]>([]);
  const [newNoteContent, setNewNoteContent] = useState('');
  const [noteType, setNoteType] = useState<'CALL' | 'EMAIL' | 'MEETING' | 'GENERAL'>('CALL');
  const [savingNote, setSavingNote] = useState(false);

  const stages: { key: LeadStage; title: string; color: string; badge: string }[] = [
    { key: 'NEW_LEAD', title: 'New Leads', color: 'border-blue-500/40', badge: 'bg-blue-500/10 text-blue-400' },
    { key: 'CONTACTED', title: 'Contacted', color: 'border-purple-500/40', badge: 'bg-purple-500/10 text-purple-400' },
    { key: 'SHOWING_SCHEDULED', title: 'Tour Scheduled', color: 'border-amber-500/40', badge: 'bg-amber-500/10 text-amber-400' },
    { key: 'OFFER_NEGOTIATION', title: 'Negotiation', color: 'border-rose-500/40', badge: 'bg-rose-500/10 text-rose-400' },
    { key: 'UNDER_CONTRACT', title: 'Under Contract', color: 'border-cyan-500/40', badge: 'bg-cyan-500/10 text-cyan-400' },
    { key: 'CLOSED_WON', title: 'Closed Won', color: 'border-emerald-500/40', badge: 'bg-emerald-500/10 text-emerald-400' },
  ];

  const stageOrder: LeadStage[] = [
    'NEW_LEAD',
    'CONTACTED',
    'SHOWING_SCHEDULED',
    'OFFER_NEGOTIATION',
    'UNDER_CONTRACT',
    'CLOSED_WON',
  ];

  const fetchLeads = async () => {
    try {
      const data = await crmService.getLeads();
      setLeads(data);
    } catch (err) {
      console.error('Failed fetching leads:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeads();
    window.addEventListener('crm-lead-created', fetchLeads);
    return () => window.removeEventListener('crm-lead-created', fetchLeads);
  }, []);

  const handleAdvance = async (lead: CrmLead, direction: 'forward' | 'backward', e: React.MouseEvent) => {
    e.stopPropagation();
    const currIdx = stageOrder.indexOf(lead.stage);
    const newIdx = direction === 'forward' ? currIdx + 1 : currIdx - 1;
    if (newIdx < 0 || newIdx >= stageOrder.length) return;

    const nextStage = stageOrder[newIdx];
    try {
      const updated = await crmService.updateLeadStage(lead.id, nextStage);
      setLeads((prev) => prev.map((l) => (l.id === lead.id ? updated : l)));
      if (selectedLead?.id === lead.id) {
        setSelectedLead(updated);
      }
    } catch (err) {
      console.error('Failed updating lead stage:', err);
    }
  };

  const handleSelectLead = async (lead: CrmLead) => {
    setSelectedLead(lead);
    try {
      const n = await crmService.getNotes('LEAD', lead.id);
      setNotes(n);
    } catch (err) {
      console.error('Failed fetching notes:', err);
    }
  };

  const handleAddNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedLead || !newNoteContent.trim()) return;
    setSavingNote(true);
    try {
      const created = await crmService.createNote({
        entityType: 'LEAD',
        entityId: selectedLead.id,
        noteType,
        content: newNoteContent.trim(),
      });
      setNotes([created, ...notes]);
      setNewNoteContent('');
    } catch (err) {
      console.error('Failed creating note:', err);
    } finally {
      setSavingNote(false);
    }
  };

  if (loading) {
    return (
      <div className="h-96 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight flex items-center">
            <Kanban className="w-6 h-6 mr-2 text-indigo-400" />
            CRM Lead Pipeline
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Drag and advance buyer opportunities through each transaction stage.
          </p>
        </div>
      </div>

      {/* Kanban Board Horizontal Scroll */}
      <div className="overflow-x-auto pb-6">
        <div className="flex gap-4 min-w-[1200px]">
          {stages.map((stage) => {
            const stageLeads = leads.filter((l) => l.stage === stage.key);
            const totalStageBudget = stageLeads.reduce((acc, curr) => acc + (curr.budget || 0), 0);

            return (
              <div
                key={stage.key}
                className="flex-1 min-w-[240px] bg-slate-900/70 border border-slate-800 rounded-2xl p-3 flex flex-col max-h-[750px]"
              >
                {/* Stage Header */}
                <div className={`p-2.5 rounded-xl border-l-4 ${stage.color} bg-slate-950/70 mb-3`}>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-200">{stage.title}</span>
                    <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-slate-800 text-slate-300">
                      {stageLeads.length}
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-400 mt-1 font-medium">
                    ${totalStageBudget.toLocaleString()} pipeline
                  </p>
                </div>

                {/* Cards Container */}
                <div className="flex-1 overflow-y-auto space-y-3 pr-1">
                  {stageLeads.length === 0 ? (
                    <div className="p-6 text-center border-2 border-dashed border-slate-800/80 rounded-xl">
                      <p className="text-[11px] text-slate-600">No leads in this stage</p>
                    </div>
                  ) : (
                    stageLeads.map((lead) => {
                      const currIdx = stageOrder.indexOf(lead.stage);
                      return (
                        <div
                          key={lead.id}
                          onClick={() => handleSelectLead(lead)}
                          className="bg-slate-950/90 border border-slate-800 hover:border-indigo-500/50 rounded-xl p-3.5 cursor-pointer shadow-md hover:shadow-indigo-500/10 transition group"
                        >
                          <div className="flex items-start justify-between">
                            <span className="font-semibold text-xs text-white group-hover:text-indigo-300 transition">
                              {lead.contactName}
                            </span>
                            {lead.priority === 'HOT' && (
                              <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30">
                                <Flame className="w-2.5 h-2.5 mr-0.5 text-rose-400" />
                                HOT
                              </span>
                            )}
                          </div>

                          <div className="mt-2 text-[11px] text-slate-400">
                            {lead.propertyTitle && (
                              <p className="truncate flex items-center text-slate-300">
                                <Building className="w-3 h-3 mr-1 shrink-0 text-slate-500" />
                                {lead.propertyTitle}
                              </p>
                            )}
                            <p className="text-emerald-400 font-semibold mt-1">
                              ${lead.budget ? lead.budget.toLocaleString() : 'Undisclosed'}
                            </p>
                          </div>

                          {/* Quick Stage Controls */}
                          <div className="mt-3 pt-2.5 border-t border-slate-800/80 flex items-center justify-between">
                            {currIdx > 0 ? (
                              <button
                                onClick={(e) => handleAdvance(lead, 'backward', e)}
                                className="p-1 text-slate-400 hover:text-white hover:bg-slate-800 rounded transition"
                                title="Move Back"
                              >
                                <ArrowLeft className="w-3 h-3" />
                              </button>
                            ) : (
                              <span />
                            )}

                            <span className="text-[10px] font-medium text-slate-500 uppercase tracking-wider">
                              {lead.source}
                            </span>

                            {currIdx < stageOrder.length - 1 ? (
                              <button
                                onClick={(e) => handleAdvance(lead, 'forward', e)}
                                className="p-1 text-indigo-400 hover:text-indigo-200 hover:bg-indigo-500/20 rounded transition"
                                title="Advance Stage"
                              >
                                <ArrowRight className="w-3 h-3" />
                              </button>
                            ) : (
                              <span />
                            )}
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Lead Detail & Activity Drawer */}
      {selectedLead && (
        <Modal
          isOpen={true}
          onClose={() => setSelectedLead(null)}
          title={`Lead: ${selectedLead.contactName}`}
        >
          <div className="space-y-6 text-slate-900">
            {/* Quick Details */}
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 grid grid-cols-2 gap-3 text-xs">
              <div>
                <p className="text-slate-500 font-medium">Email</p>
                <p className="font-semibold text-slate-800">{selectedLead.contactEmail}</p>
              </div>
              <div>
                <p className="text-slate-500 font-medium">Phone</p>
                <p className="font-semibold text-slate-800">{selectedLead.contactPhone || 'N/A'}</p>
              </div>
              <div>
                <p className="text-slate-500 font-medium">Budget</p>
                <p className="font-semibold text-emerald-600">
                  ${selectedLead.budget ? selectedLead.budget.toLocaleString() : 'N/A'}
                </p>
              </div>
              <div>
                <p className="text-slate-500 font-medium">Lead Stage</p>
                <p className="font-bold text-indigo-600">{selectedLead.stage}</p>
              </div>
              {selectedLead.propertyTitle && (
                <div className="col-span-2">
                  <p className="text-slate-500 font-medium">Associated Property</p>
                  <p className="font-semibold text-slate-800">{selectedLead.propertyTitle}</p>
                </div>
              )}
            </div>

            {/* Log Activity Note */}
            <div>
              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
                Log Communication / Interaction
              </h4>
              <form onSubmit={handleAddNote} className="space-y-2">
                <div className="flex space-x-2">
                  {(['CALL', 'EMAIL', 'MEETING', 'GENERAL'] as const).map((type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setNoteType(type)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-medium border transition ${
                        noteType === type
                          ? 'bg-indigo-600 text-white border-indigo-600'
                          : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
                <textarea
                  rows={2}
                  required
                  value={newNoteContent}
                  onChange={(e) => setNewNoteContent(e.target.value)}
                  placeholder="Record summary of phone call, viewing feedback, or email exchange..."
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-indigo-500"
                />
                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={savingNote}
                    className="inline-flex items-center px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold disabled:opacity-50"
                  >
                    <Send className="w-3 h-3 mr-1" />
                    {savingNote ? 'Logging...' : 'Log Note'}
                  </button>
                </div>
              </form>
            </div>

            {/* Note History */}
            <div>
              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
                Activity Timeline ({notes.length})
              </h4>
              <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                {notes.length === 0 ? (
                  <p className="text-xs text-slate-400">No logged notes yet.</p>
                ) : (
                  notes.map((n) => (
                    <div key={n.id} className="p-2.5 bg-white border border-slate-200 rounded-lg text-xs">
                      <div className="flex items-center justify-between text-slate-400 mb-1">
                        <span className="font-bold text-indigo-700">{n.noteType}</span>
                        <span>{new Date(n.createdAt).toLocaleDateString()}</span>
                      </div>
                      <p className="text-slate-700">{n.content}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
