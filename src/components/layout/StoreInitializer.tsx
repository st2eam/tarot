"use client";

import { useEffect } from "react";
import { useTarotStore } from "@/store/useTarotStore";
import { useChatStore } from "@/store/useChatStore";

export default function StoreInitializer() {
  useEffect(() => {
    useTarotStore.getState().loadFromStorage();
    useChatStore.getState().loadHistory();
  }, []);

  return null;
}
