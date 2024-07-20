import { RainbowKitProvider } from "@rainbow-me/rainbowkit";
import "@rainbow-me/rainbowkit/styles.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React from "react";
import { WagmiProvider } from "wagmi";
import { config } from "../../wagmi";
import Main from "./main";

const queryClient = new QueryClient();

export default function MainHOC() {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider>
          <Main />
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
