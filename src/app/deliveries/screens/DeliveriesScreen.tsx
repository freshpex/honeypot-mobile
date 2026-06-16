import { ModuleSurface } from "@/components";

export const DeliveriesScreen = () => (
  <ModuleSurface
    actions={["Today", "Scheduled", "Completed"]}
    icon="car-outline"
    metric="Delivery tracking"
    subtitle="Track upcoming meal drops, delivery windows, riders, and proof-of-delivery states."
    title="Deliveries"
  />
);

