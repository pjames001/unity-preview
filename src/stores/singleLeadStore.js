// src/stores/leadDetailsStore.js
import { useQuery } from '@tanstack/vue-query';
import axios from 'axios';
import { toValue } from 'vue'; // Import toValue

export function useLeadDetailsStore(leadIdRef) { // Accept a ref
  const fetchLeadDetails = async () => {
    const leadId = toValue(leadIdRef); // Unwrap the ref
    if (!leadId) {
      return null;
    }
    const url = `https://ulg.unitytelco.com/api/v1/leads/lead/view/${leadId}`;
    const response = await axios.get(url, {
      headers: {
        Authorization: 'Token dde68e7434e4e0523ed435a622b5a05f6668ce82'
      }
    });
    return response.data;
  };

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['leadDetails', leadIdRef],
    queryFn: fetchLeadDetails,
    enabled: !!toValue(leadIdRef), // Ensure query is enabled only if ref has a value
  });

  return {
    lead: data,
    isLoading,
    isError,
    error,
  };
}