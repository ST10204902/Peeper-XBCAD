import { useEffect, useState } from "react";
import { Organisation } from "../databaseModels/databaseClasses/Organisation";

/**
 * Custom hook to fetch and listen to all organisations
 * @returns {Object} An object containing the list of all organisations and the loading state
 */
function useAllOrganisations() {
  const [allOrganisations, setAllOrganisations] = useState<Organisation[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    // Start listening to all organisations
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
