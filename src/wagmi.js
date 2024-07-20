import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import { baseSepolia } from "wagmi/chains";

export const config = getDefaultConfig({
  appName: "Hunger Games",
  projectId: "a642e4dea46076bb675c3a1512b2253e",
  chains: [baseSepolia],
  ssr: true,
});
