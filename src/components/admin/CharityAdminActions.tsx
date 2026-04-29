"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Trash2, Loader2, Star, Power } from "lucide-react";
import { AdminStatusModal } from "./AdminStatusModal";

export function CharityAdminActions({ charityId, isFeatured, isActive }: { charityId: string, isFeatured: boolean, isActive: boolean }) {
  const router = useRouter();
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const supabase = createClient();

  const [statusModal, setStatusModal] = useState<{
    isOpen: boolean;
    type: "success" | "error";
    title: string;
    message: string;
  }>({
    isOpen: false,
    type: "success",
    title: "",
    message: "",
  });

  const handleToggleActive = async () => {
    setIsUpdating(true);
    try {
      const { error } = await supabase
        .from('charities')
        .update({ is_active: !isActive })
        .eq('id', charityId);

      if (error) throw error;
      setStatusModal({
        isOpen: true,
        type: "success",
        title: "Status Updated",
        message: `Charity has been ${!isActive ? 'activated' : 'deactivated'} successfully.`
      });
      router.refresh();
    } catch (err: any) {
      setStatusModal({
        isOpen: true,
        type: "error",
        title: "Update Failed",
        message: err.message
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const handleToggleFeatured = async () => {
    setIsUpdating(true);
    try {
      const { error } = await supabase
        .from('charities')
        .update({ is_featured: !isFeatured })
        .eq('id', charityId);

      if (error) throw error;
      setStatusModal({
        isOpen: true,
        type: "success",
        title: "Featured Updated",
        message: `Charity has been ${!isFeatured ? 'set as featured' : 'removed from featured'}.`
      });
      router.refresh();
    } catch (err: any) {
      setStatusModal({
        isOpen: true,
        type: "error",
        title: "Update Failed",
        message: err.message
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this charity? This might affect users who have selected it.")) return;

    setIsDeleting(true);
    try {
      const { error } = await supabase
        .from('charities')
        .delete()
        .eq('id', charityId);

      if (error) throw error;
      setStatusModal({
        isOpen: true,
        type: "success",
        title: "Charity Deleted",
        message: "The charity has been successfully removed from the platform."
      });
      router.refresh();
    } catch (err: any) {
      setStatusModal({
        isOpen: true,
        type: "error",
        title: "Deletion Failed",
        message: err.message
      });
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="flex gap-2">
      <button
        onClick={handleToggleFeatured}
        disabled={isUpdating}
        title={isFeatured ? "Remove from featured" : "Set as featured"}
        className={`p-1.5 rounded transition-all ${isFeatured ? 'text-primary bg-primary/10' : 'text-muted hover:text-white'}`}
      >
        <Star className={`w-4 h-4 ${isFeatured ? 'fill-current' : ''}`} />
      </button>

      <button
        onClick={handleToggleActive}
        disabled={isUpdating}
        title={isActive ? "Deactivate" : "Activate"}
        className={`p-1.5 rounded transition-all ${isActive ? 'text-green-400 bg-green-400/10' : 'text-muted hover:text-white'}`}
      >
        <Power className="w-4 h-4" />
      </button>

      <button
        onClick={handleDelete}
        disabled={isDeleting}
        title="Delete charity"
        className="p-1.5 rounded text-muted hover:text-[#ff6b4a] hover:bg-[#ff6b4a]/10 transition-all"
      >
        {isDeleting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
      </button>

      <AdminStatusModal 
        isOpen={statusModal.isOpen}
        onClose={() => setStatusModal(prev => ({ ...prev, isOpen: false }))}
        type={statusModal.type}
        title={statusModal.title}
        message={statusModal.message}
      />
    </div>
  );
}
