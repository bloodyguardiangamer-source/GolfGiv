"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Shield, ShieldOff, Loader2 } from "lucide-react";
import { AdminStatusModal } from "./AdminStatusModal";

export function InlineRoleToggle({ userId, currentRole, userName }: { userId: string; currentRole: string; userName: string }) {
  const router = useRouter();
  const [isUpdating, setIsUpdating] = useState(false);
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

  const handleToggle = async () => {
    const newRole = currentRole === "admin" ? "user" : "admin";
    const action = newRole === "admin" ? "promote" : "demote";
    
    if (!confirm(`Are you sure you want to ${action} "${userName}" to ${newRole}?`)) return;

    setIsUpdating(true);
    try {
      const { error } = await supabase
        .from("users")
        .update({ role: newRole })
        .eq("id", userId);

      if (error) throw error;
      setStatusModal({
        isOpen: true,
        type: "success",
        title: "Role Updated",
        message: `"${userName}" has been successfully ${newRole === 'admin' ? 'promoted to admin' : 'demoted to user'}.`
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

  return (
    <>
      <button
        onClick={handleToggle}
        disabled={isUpdating}
        title={currentRole === "admin" ? "Revoke Admin" : "Make Admin"}
        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-bold uppercase tracking-widest transition-all disabled:opacity-50 ${
          currentRole === "admin"
            ? "bg-[#f5c842]/10 text-[#f5c842] hover:bg-[#f5c842]/20 border border-[#f5c842]/20"
            : "bg-[#1c1c30] text-muted hover:text-primary hover:bg-primary/10 border border-border hover:border-primary/20"
        }`}
      >
        {isUpdating ? (
          <Loader2 className="w-3 h-3 animate-spin" />
        ) : currentRole === "admin" ? (
          <Shield className="w-3 h-3 fill-current" />
        ) : (
          <ShieldOff className="w-3 h-3" />
        )}
        {currentRole}
      </button>

      <AdminStatusModal 
        isOpen={statusModal.isOpen}
        onClose={() => setStatusModal(prev => ({ ...prev, isOpen: false }))}
        type={statusModal.type}
        title={statusModal.title}
        message={statusModal.message}
      />
    </>
  );
}
