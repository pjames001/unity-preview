// src/stores/leadsStore.js
import { ref, watch } from 'vue';
import { useQuery } from '@tanstack/vue-query';
import axios from 'axios';

// Export a composable function
export function useLeadsStore() {
  const leadsData = ref([]);

  const leadsQueryKey = ['leads'];

  const fetchLeads = async () => {
    const form = {
      can_allocate: true,
      user_id: 92,
      company: 2
    };
    const response = await axios.post('https://ulg.unitytelco.com/api/v1/leads/user/accounts?page=1', form, {
      headers: {
        Authorization: 'Token dde68e7434e4e0523ed435a622b5a05f6668ce82'
      }
    });
    return response.data.results.accounts;
  };

  const { data, isLoading, isError, error } = useQuery({
    queryKey: leadsQueryKey,
    queryFn: fetchLeads
  });

  watch(data, (newLeads) => {
    leadsData.value = newLeads;
  }, { immediate: true });

  return {
    leads: leadsData,
    isLoading,
    isError,
    error
  };
}