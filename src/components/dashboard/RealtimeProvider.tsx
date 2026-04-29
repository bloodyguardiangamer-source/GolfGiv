"use client";

import { createContext, useContext, useEffect, useState, useCallback, ReactNode } from "react";
import { createClient } from "@/lib/supabase/client";

type RealtimeContextType = {
  /** Increments whenever any watched table changes — use as a useEffect dependency to refetch */
  refreshKey: number;
  /** Which table was last changed */
  lastChangedTable: string | null;
  /** Force a manual refresh (e.g. after a local mutation) */
  triggerRefresh: (table?: string) => void;
};

const RealtimeContext = createContext<RealtimeContextType>({
  refreshKey: 0,
  lastChangedTable: null,
  triggerRefresh: () => {},
});

export function useRealtime() {
  return useContext(RealtimeContext);
}

/** Hook that returns a refreshKey that changes whenever a specific table (or any table) changes */
export function useRealtimeTable(table?: string) {
  const { refreshKey, lastChangedTable } = useContext(RealtimeContext);
  // If no table filter, return every change. Otherwise only if matching table.
  if (!table) return refreshKey;
  return refreshKey; // We always return the key — components can check lastChangedTable if needed
}

const WATCHED_TABLES = ["scores", "draws", "draw_entries", "winners", "subscriptions", "charities", "users"];

export function RealtimeProvider({ children }: { children: ReactNode }) {
  const [refreshKey, setRefreshKey] = useState(0);
  const [lastChangedTable, setLastChangedTable] = useState<string | null>(null);

  const triggerRefresh = useCallback((table?: string) => {
    setLastChangedTable(table || "manual");
    setRefreshKey((k) => k + 1);
  }, []);

  useEffect(() => {
    const supabase = createClient();

    // Subscribe to all watched tables on a single channel
    const channel = supabase
      .channel("dashboard-realtime")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "scores" },
        () => { setLastChangedTable("scores"); setRefreshKey((k) => k + 1); }
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "draws" },
        () => { setLastChangedTable("draws"); setRefreshKey((k) => k + 1); }
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "draw_entries" },
        () => { setLastChangedTable("draw_entries"); setRefreshKey((k) => k + 1); }
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "winners" },
        () => { setLastChangedTable("winners"); setRefreshKey((k) => k + 1); }
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "subscriptions" },
        () => { setLastChangedTable("subscriptions"); setRefreshKey((k) => k + 1); }
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "charities" },
        () => { setLastChangedTable("charities"); setRefreshKey((k) => k + 1); }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return (
    <RealtimeContext.Provider value={{ refreshKey, lastChangedTable, triggerRefresh }}>
      {children}
    </RealtimeContext.Provider>
  );
}
