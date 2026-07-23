"use client";

import { useEffect, useState } from "react";
import { supabase } from "./supabase";

// Live count of people currently on a shared Realtime presence channel.
export function usePresence(channelName = "revive-city-presence"): number {
  const [count, setCount] = useState(1);

  useEffect(() => {
    const key = Math.random().toString(36).slice(2);
    const channel = supabase.channel(channelName, {
      config: { presence: { key } },
    });

    channel
      .on("presence", { event: "sync" }, () => {
        const n = Object.keys(channel.presenceState()).length;
        setCount(n > 0 ? n : 1);
      })
      .subscribe((status) => {
        if (status === "SUBSCRIBED") {
          channel.track({ at: Date.now() });
        }
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, [channelName]);

  return count;
}
