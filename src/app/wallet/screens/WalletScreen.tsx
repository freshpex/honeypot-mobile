import { ModuleSurface } from "@/components";

export const WalletScreen = () => (
  <ModuleSurface
    actions={["Coming soon", "Top-up account", "Wallet funding"]}
    icon="wallet-outline"
    metric="Wallet coming soon"
    subtitle="The wallet surface is visually ready, but funding and balance sync will wait for backend integration."
    title="My Wallet"
  />
);

