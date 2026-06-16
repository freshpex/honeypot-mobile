import { ModuleSurface } from "@/components";

export const PaymentsScreen = () => (
  <ModuleSurface
    actions={["Cards", "Receipts", "Wallet soon"]}
    icon="card-outline"
    metric="Payments ready"
    subtitle="Manage saved cards and payment records while the HoneyPot wallet stays marked as coming soon."
    title="Payments"
  />
);

