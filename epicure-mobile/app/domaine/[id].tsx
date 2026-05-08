import { useLocalSearchParams } from "expo-router";

import { DomaineProfileScreen } from "../../src/features/domaines/components/DomaineProfileScreen";
import { useDomaine } from "../../src/features/domaines/hooks/useDomaine";

export default function DomainePage() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { domaine } = useDomaine(id ?? "");

  return <DomaineProfileScreen domaineId={id ?? ""} domaine={domaine} />;
}
