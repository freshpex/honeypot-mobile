import { ModuleSurface } from "@/components";

export const PersonalizationScreen = () => (
  <ModuleSurface
    actions={["Diet tags", "Allergies", "Meal goals"]}
    icon="options-outline"
    metric="Preferences"
    subtitle="Capture dietary preferences, allergies, delivery cadence, and meal recommendation rules."
    title="Personalization"
  />
);

