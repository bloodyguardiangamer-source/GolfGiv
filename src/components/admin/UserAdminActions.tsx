"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Shield, Trash2, Loader2 } from "lucide-react";
import { AdminStatusModal } from "./AdminStatusModal";

export function UserAdminActions({ userId, currentRole }: { userId: string, currentRole: string }) {
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

  const handleRoleChange = async () => {
    const newRole = currentRole === 'admin' ? 'user' : 'admin';
    if (!confirm(`Are you sure you want to change this user's role to ${newRole}?`)) return;

    setIsUpdating(true);
    try {
      const { error } = await supabase
        .from('users')
        .update({ role: newRole })
        .eq('id', userId);

      if (error) throw error;
      setStatusModal({
        isOpen: true,
        type: "success",
        title: "Role Updated",
        message: `User has been successfully ${newRole === 'admin' ? 'promoted to admin' : 'demoted to user'}.`
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
    if (!confirm("CRITICAL: Are you sure you want to delete this user? This will remove all their data and cannot be undone.")) return;

    setIsDeleting(true);
    try {
      const { error } = await supabase
        .from('users')
        .delete()
        .eq('id', userId);

      if (error) throw error;
      setStatusModal({
        isOpen: true,
        type: "success",
        title: "User Deleted",
        message: "The user account and all associated data have been removed."
      });
      setTimeout(() => {
        router.push("/admin/users");
      }, 2000);
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
    <div className="flex flex-wrap gap-3">
      <button
        onClick={handleRoleChange}
        disabled={isUpdating}
        className="flex items-center gap-2 bg-[#1c1c30] hover:bg-[#2c2c48] text-white px-4 py-2 rounded-lg text-sm font-medium border border-border transition-all disabled:opacity-50"
      >
        {isUpdating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Shield className="w-4 h-4 text-primary" />}
        {currentRole === 'admin' ? 'Demote to User' : 'Promote to Admin'}
      </button>

      <button
        onClick={handleDelete}
        disabled={isDeleting}
        className="flex items-center gap-2 bg-[#ff6b4a]/10 hover:bg-[#ff6b4a] text-[#ff6b4a] hover:text-[#0a0a14] px-4 py-2 rounded-lg text-sm font-medium border border-[#ff6b4a]/30 transition-all disabled:opacity-50"
      >
        {isDeleting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
        Delete User
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
