import { onlineManager } from "@tanstack/react-query";
import * as Network from "expo-network";
import { useEffect } from "react";

export function useOnlineManager() {
  useEffect(() => {
    const eventSubscription = Network.addNetworkStateListener((state) => {
      onlineManager.setOnline(!!state.isConnected);
    });

    return () => {
      eventSubscription.remove();
    };
  }, []);
}
