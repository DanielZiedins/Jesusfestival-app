"use client";

import { useEffect, useState } from "react";
import type { RealtimeChannel, SupabaseClient } from "@supabase/supabase-js";
import { getSupabase } from "./supabase";

// Live count of people currently on a shared Realtime presence channel.
export function usePresence(channelName = "revive-city-presence"): number {
  const [count, setCount] = useState(1);

  useEffect(() => {
    const key = Math.random().toString(36).slice(2);
    let cancelled = false;
    let sb: SupabaseClient | null = null;
    let channel: RealtimeChannel | null = null;

    // The client loads lazily, so the screen can unmount before it arrives:
    // never subscribe after cleanup, and always unsubscribe if we did.
    void getSupabase().then((client) => {
      if (cancelled) return;
      sb = client;
      const ch = client.channel(channelName, { config: { presence: { key } } });
      channel = ch;
      ch.on("presence", { event: "sync" }, () => {
        const n = Object.keys(ch.presenceState()).length;
        setCount(n > 0 ? n : 1);
      }).subscribe((status) => {
        if (status === "SUBSCRIBED") ch.track({ at: Date.now() });
      });
    });

    return () => {
      cancelled = true;
      if (sb && channel) void sb.removeChannel(channel);
    };
  }, [channelName]);

  return count;
}
