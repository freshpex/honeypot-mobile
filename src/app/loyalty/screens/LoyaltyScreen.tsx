import { ModuleSurface } from "@/components";

export const LoyaltyScreen = () => (
  <ModuleSurface
    actions={["Points", "Rewards", "Referrals"]}
    icon="gift-outline"
    metric="Rewards coming soon"
    subtitle="Show points, earned perks, and loyalty milestones when the rewards API is connected."
    title="Loyalty"
  />
);

