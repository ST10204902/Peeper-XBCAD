// useAllOrganisations.ts

import { useEffect, useState } from 'react';
import { Organisation } from '../databaseModels/databaseClasses/Organisation';

function useAllOrganisations() {
  const [allOrganisations, setAllOrganisations] = useState<Organisation[]>([]);
  const [error, setError] = useState<Error | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const unsubscribe = Organisation.listenToAllOrganisations((orgs) => {
      setAllOrganisations(orgs);
      setLoading(false);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  return { allOrganisations, error, loading };
}

export default useAllOrganisations;