// useOrganisations.ts
import { useEffect, useState } from "react";
import { Organisation } from "../databaseModels/databaseClasses/Organisation";

function useAllOrganisations() {
  const [allOrganisations, setAllOrganisations] = useState<Organisation[]>([]);
  const [_error, _setError] = useState<Error | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const unsubscribe = Organisation.listenToAllOrganisations(orgs => {
      setAllOrganisations(orgs);
      setLoading(false);
    });

    // Clean up the listener when the component unmounts
    return () => {
      unsubscribe();
    };
  }, []);

  return { allOrganisations, loading };
}

export default useAllOrganisations;
