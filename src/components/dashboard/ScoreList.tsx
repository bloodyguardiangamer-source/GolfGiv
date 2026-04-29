"use client";

import { useState } from "react";
import { Edit2, Trash2, Check, X as XIcon, Loader2 } from "lucide-react";
import { DeleteConfirmModal } from "./DeleteConfirmModal";

type Score = {
  id: string;
  score: number;
  score_date: string;
};

export function ScoreList({
  scores,
  isLoading,
  onDelete,
  onUpdate,
}: {
  scores: Score[];
  isLoading: boolean;
  onDelete: (id: string) => Promise<void>;
  onUpdate: (id: string, newScore: number, newDate: string) => Promise<void>;
}) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editScore, setEditScore] = useState("");
  const [editDate, setEditDate] = useState("");
  
  // Per-row loading states
  const [processingId, setProcessingId] = useState<string | null>(null);
  
  // Delete Modal state
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);

  const startEdit = (score: Score) => {
    setEditingId(score.id);
    setEditScore(score.score.toString());
    setEditDate(score.score_date);
  };

  const cancelEdit = () => {
    setEditingId(null);
  };

  const handleUpdate = async (id: string) => {
    setProcessingId(id);
    try {
      await onUpdate(id, parseInt(editScore), editDate);
      setEditingId(null);
    } finally {
      setProcessingId(null);
    }
  };

  const openDeleteModal = (id: string) => {
    setPendingDeleteId(id);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!pendingDeleteId) return;
    setProcessingId(pendingDeleteId);
    try {
      await onDelete(pendingDeleteId);
      setShowDeleteModal(false);
      setPendingDeleteId(null);
    } finally {
      setProcessingId(null);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <Loader2 className="w-6 h-6 animate-spin text-primary" />
      </div>
    );
  }

  if (scores.length === 0) {
    return (
      <div className="text-center p-6 bg-[#1c1c30]/50 rounded-md border border-border">
        <p className="text-sm text-muted">No scores entered yet this month.</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {scores.map((score) => (
        <div
          key={score.id}
          className="bg-[#1c1c30] border border-border rounded-md p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 relative overflow-hidden group"
        >
          {/* Row Loading Overlay */}
          {processingId === score.id && !showDeleteModal && (
            <div className="absolute inset-0 bg-surface/40 backdrop-blur-[1px] z-10 flex items-center justify-center">
              <Loader2 className="w-5 h-5 animate-spin text-primary" />
            </div>
          )}

          {editingId === score.id ? (
            <div className="flex-1 flex flex-col sm:flex-row gap-3 w-full">
              <input
                type="date"
                value={editDate}
                onChange={(e) => setEditDate(e.target.value)}
                className="bg-[#111120] border border-border rounded-md px-3 py-2 text-white text-[13px] focus:border-primary focus:outline-none w-full sm:w-auto"
              />
              <input
                type="number"
                min="1"
                max="45"
                value={editScore}
                onChange={(e) => setEditScore(e.target.value)}
                className="bg-[#111120] border border-border rounded-md px-3 py-2 text-white text-[13px] focus:border-primary focus:outline-none w-full sm:w-24"
              />
              <div className="flex items-center gap-2 mt-2 sm:mt-0">
                <button
                  onClick={() => handleUpdate(score.id)}
                  className="p-2 bg-primary/20 text-primary hover:bg-primary hover:text-[#0a0a14] rounded-md transition-all active:scale-95"
                >
                  <Check className="w-4 h-4" />
                </button>
                <button
                  onClick={cancelEdit}
                  className="p-2 bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white rounded-md transition-all active:scale-95"
                >
                  <XIcon className="w-4 h-4" />
                </button>
              </div>
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between w-full sm:w-auto flex-1">
                <span className="text-[13px] text-muted">
                  {new Date(score.score_date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                </span>
                <span className="text-2xl font-bold text-white sm:ml-8 font-mono">
                  {score.score}
                </span>
              </div>
              <div className="flex items-center gap-2 w-full sm:w-auto justify-end border-t border-border sm:border-0 pt-3 sm:pt-0">
                <button
                  onClick={() => startEdit(score)}
                  className="p-2 text-muted hover:text-white hover:bg-surface-alt rounded-md transition-all active:scale-95"
                  aria-label="Edit score"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => openDeleteModal(score.id)}
                  className="p-2 text-muted hover:text-red-500 hover:bg-red-500/10 rounded-md transition-all active:scale-95"
                  aria-label="Delete score"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </>
          )}
        </div>
      ))}

      <DeleteConfirmModal 
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={confirmDelete}
        isLoading={processingId === pendingDeleteId}
      />
    </div>
  );
}

