<script setup>
import { reactive, ref, computed, watch } from 'vue';
import { leadsSteps } from '@/stores/leadForm';
import { useLeadDetailsStore } from '@/stores/singleLeadStore';
import { VueSpinnerPie } from 'vue3-spinners';
import { useRoute } from 'vue-router';
import LeadDetailsHeader from '@/components/lead-details/LeadDetailsHeader.vue';
import Notes from '@/components/lead-details/Notes.vue';
import Reminders from '@/components/lead-details/Reminders.vue';
import Contacts from '@/components/lead-details/Contacts.vue';
import Emails from '@/components/lead-details/Emails.vue';
import Calls from '@/components/lead-details/Calls.vue';
import Documents from '@/components/lead-details/Documents.vue';
import Chats from '@/components/lead-details/Chats.vue';

// --- Global State ---
const route = useRoute();
const leadId = computed(() => route.params.leadId);
const { lead, isLoading, isError, error } = useLeadDetailsStore(leadId);

// --- Local State ---
const steps = reactive([...leadsSteps]);
const activeTab = ref('notes');
const formData = reactive({});
const showAllFields = ref(true);

// --- Functions (Moved to the top to prevent "Cannot access before initialization" errors) ---
const mapDataToForm = (apiLeadData) => {
  // Use optional chaining for safe access from the API response
  formData.companyName = apiLeadData?.name ?? '';
  formData.leadsMedical = apiLeadData?.medical ?? '';
  formData.leadsBusinessType = apiLeadData?.business_type ?? '';
  formData.leadsWebsite = apiLeadData?.website ?? '';
  formData.leadsCompanyEmail = apiLeadData?.email ?? '';
  formData.leadsCompanyPhoneNumber = apiLeadData?.phone_number ?? '';
  formData.leadsFaxNumber = apiLeadData?.fax_number ?? '';
  formData.leadsCompanyCountry = apiLeadData?.country ?? '';
  formData.leadsCompanyAddress1 = apiLeadData?.address ?? '';
  formData.leadsCompanyAddress2 = apiLeadData?.address2 ?? '';
  formData.leadsCopmanyCity = apiLeadData?.city ?? '';
  formData.leadsCompanyState = apiLeadData?.state ?? '';
  formData.leadsCompanyZipCode = apiLeadData?.zipcode ?? '';

  // Accessing actioned_by for user details
  formData.leadsFirstName = apiLeadData?.actioned_by?.first_name ?? '';
  formData.leadsMiddleName = apiLeadData?.actioned_by?.middle_name ?? '';
  formData.leadsLastName = apiLeadData?.actioned_by?.last_name ?? '';

  formData.leadsTitle = apiLeadData?.title ?? '';
  formData.leadsContactEmail = apiLeadData?.email ?? '';
  formData.leadsContactPhoneNumber = apiLeadData?.phone_number ?? '';
  formData.leadsContactMobileNumber = apiLeadData?.cell_phone ?? '';
  formData.leadsContactCountry = apiLeadData?.country ?? '';
  formData.leadsContactAddress1 = apiLeadData?.address ?? '';
  formData.leadsContactAddress2 = apiLeadData?.address2 ?? '';
  formData.leadsContactCity = apiLeadData?.city ?? '';
  formData.leadsContactState = apiLeadData?.state ?? '';
  formData.leadsContactZipCode = apiLeadData?.zipcode ?? '';

  formData.commercialOrConsumer = apiLeadData?.account_type ?? '';
  formData.leadsMoneyExpected = apiLeadData?.money_expected ?? '';
  formData.clientAccountsExpected = apiLeadData?.accounts_expected ?? '';
  formData.leadsClientSize = apiLeadData?.client_size ?? '';
  formData.underOneYear = apiLeadData?.under_1_year ?? '';
  formData.overOneYear = apiLeadData?.over_1_year ?? '';
  formData.legalAndUnder1000 = apiLeadData?.legal_and_under_1000 ?? '';
  formData.referredBy = apiLeadData?.referred_by ?? '';
  formData.cardConvenienceFee = apiLeadData?.card_convenience_fee ?? '';
  formData.nextFollowUp = apiLeadData?.next_follow_up ?? '';

  formData.interestMin = apiLeadData?.interest_agency ?? '';
  formData.interestMax = apiLeadData?.interest_client ?? '';
  formData.lateFeesMin = apiLeadData?.late_fees_agency ?? '';
  formData.lateFeesMax = apiLeadData?.late_fees_client ?? '';
};

const initializeFormData = () => {
  steps.forEach(step => {
    step.fields.forEach(field => {
      if (field.type === 'dual-number') {
        formData[field.key + 'Min'] = '';
        formData[field.key + 'Max'] = '';
      } else if (field.key === 'nextFollowUpRequestedDate') {
        formData.nextFollowUp = '';
      } else if (field.key !== 'time' && !(field.key in formData)) {
        formData[field.key] = '';
      }
    });
  });
};
initializeFormData();

const submitForm = () => {
  console.log('Submitted data:', JSON.parse(JSON.stringify(formData)));
};

// --- Computed Properties ---
const headerData = computed(() => {
  if (!lead.value) { // Use 'lead' instead of 'currentLead'
    return {
      leadAccountNumber: '',
      age: '',
      name: '',
      firstName: ''
    };
  }
  const apiLeadData = lead.value.lead; // Access the 'lead' property from the API response
  const leadAge = lead.value.lead_age; // Access the 'lead_age' property
  return {
    leadAccountNumber: apiLeadData?.account_number ?? '',
    age: leadAge ?? '',
    name: apiLeadData?.name ?? '',
    firstName: apiLeadData?.actioned_by?.first_name ?? ''
  };
});

const filteredSteps = computed(() => {
  if (showAllFields.value) {
    return steps;
  }
  return steps.map(step => ({
    ...step,
    fields: step.fields.filter(field => {
      if (field.type === 'dual-number') {
        return formData[field.key + 'Min'] || formData[field.key + 'Max'];
      }
      return formData[field.key];
    })
  }));
});

const currentComponent = computed(() => {
  const componentMap = {
    notes: Notes,
    reminders: Reminders,
    contacts: Contacts,
    emails: Emails,
    calls: Calls,
    documents: Documents,
    chats: Chats
  };
  return componentMap[activeTab.value] || Notes;
});

// --- Watcher to Populate Form ---
watch(lead, (newLeadData) => {
  if (newLeadData && newLeadData.lead) {
    mapDataToForm(newLeadData.lead);
  }
}, { immediate: true });
</script>

<template>
  <div v-if="isLoading" class="dark:bg-black/40 bg-black/70 flex justify-center items-center w-full h-screen">
    <div class="text-black text-9xl">
      <VueSpinnerPie size="130" color="#4DAA57" />
    </div>
  </div>
  <div v-else-if="isError" class="flex justify-center items-center h-screen">
    <div class="text-red-500 text-2xl">Error: {{ error.message }}</div>
  </div>
  <div v-else-if="!lead" class="flex justify-center items-center h-screen">
    <div class="text-white text-2xl">Lead not found.</div>
  </div>
  
  <main v-else class="view dark:bg-darkBlue bg-white">
    <LeadDetailsHeader 
      :accNumber="headerData.leadAccountNumber" 
      :age="headerData.age" 
      :name="headerData.name" 
    />

    <div class="w-full flex justify-between items-center px-10">
      
      <div>
        <span class="dark:text-white text-gray-700 font-semibold text-lg">Contacts</span>
        <div class="w-28 h-20 mt-6 mb-6 border-l-4 border-lightBlue flex justify-center items-center cursor-pointer hover:bg-lightBlue/30 dark:hover:bg-lightBlue/10 transition duration-300 ease">
          <span class="dark:text-white text-gray-700">{{ headerData.firstName }}</span>
        </div>
      </div>
      <button @click="showAllFields = !showAllFields" class="px-4 py-2 mb-4 rounded-xl font-semibold dark:bg-darkBlue bg-light-blue border dark:border-lightBlue border-blue-700 text-gray-700 dark:text-white transition-colors duration-300" :class="showAllFields ? 'shadow-inner' : 'shadow-outer'">
        {{ showAllFields ? 'Show Non-Empty Fields' : 'Show All Fields' }}
      </button>
    </div>

    <form
      @submit.prevent="submitForm"
      class="max-w-[1440px] mx-auto p-6 bg-white dark:bg-gray-900 rounded-2xl"
    >
      <Transition name="fade" mode="out-in">
        <div :key="showAllFields ? 'all' : 'non-empty'"  class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div v-for="step in filteredSteps" :key="step.title" class="flex flex-col space-y-4">
            <h3 class="flex justify-between items-start text-lg font-semibold text-gray-800 dark:text-white h-10">
              {{ step.title }}
              <v-icon v-if="step.title === 'Contact Info'" name="la-copy-solid" scale="1.5" class="rounded-full p-1 dark:text-white text-gray-700 dark:hover:bg-white dark:hover:text-gray-700 hover:bg-gray-700 hover:text-white transition duration-300 ease cursor-pointer"></v-icon>
            </h3>

            <div v-for="field in step.fields" :key="field.key" class="flex flex-col">
              <label :for="field.key" class="text-sm font-medium mb-1 text-gray-700 dark:text-gray-200">
                {{ field.label }}
                <span v-if="field.required" class="text-red-500">*</span>
              </label>

              <template v-if="['text', 'email', 'tel', 'url', 'number', 'date', 'time', 'datetime-local'].includes(field.type)">
                <input
                  :type="field.type"
                  v-model="formData[field.key]"
                  :id="field.key"
                  :placeholder="field.placeholder"
                  :required="field.required"
                  class="input-style"
                />
              </template>
              
              <template v-else-if="field.type === 'select'">
                <select
                  v-model="formData[field.key]"
                  :id="field.key"
                  :required="field.required"
                  class="input-style"
                >
                  <option disabled value="">{{ field.placeholder || 'Select an option' }}</option>
                  <option
                    v-for="opt in field.options"
                    :key="opt.value"
                    :value="opt.value"
                  >
                    {{ opt.label }}
                  </option>
                </select>
              </template>

              <template v-else-if="field.type === 'radio'">
                <div class="flex gap-1 mt-1 h-[38px]">
                  <label
                    v-for="opt in field.options"
                    :key="opt.value"
                    class="flex items-center space-x-1 mr-2"
                  >
                    <input
                      type="radio"
                      :name="field.key"
                      :value="opt.value"
                      v-model="formData[field.key]"
                      :checked="opt.value === 'agency'"
                    />
                    <span class="text-sm text-gray-700 dark:text-gray-200">
                      {{ opt.label }}
                    </span>
                  </label>
                </div>
              </template>

              <template v-else-if="field.type === 'dual-number'">
                <div class="flex items-center space-x-2">
                  <input
                    type="number"
                    v-model.number="formData[field.key + 'Min']"
                    :id="field.key + 'Min'"
                    min="0"
                    max="100"
                    :placeholder="field.placeholder"
                    :required="field.required"
                    class="input-style flex-1"
                  />
                  <span class="text-gray-500 dark:text-gray-400">-</span>
                  <input
                    type="number"
                    v-model.number="formData[field.key + 'Max']"
                    :id="field.key + 'Max'"
                    min="0"
                    max="100"
                    :placeholder="field.placeholder"
                    :required="field.required"
                    class="input-style flex-1"
                  />
                </div>
              </template>

              </div>
          </div>
        </div>
      </Transition>
    </form>

    <div class="w-full px-16 mt-20 bg-white dark:bg-gray-900 rounded-xl shadow-md">
      <div class="flex justify-between items-center flex-wrap gap-2 mb-6">
        <button
          v-for="tab in tabs"
          :key="tab.key"
          @click="activeTab = tab.key"
          class="px-4 py-2 flex-1 rounded-lg font-semibold border dark:text-lightBlue dark:border-lightBlue border-blue-700 transition"
          :class="{
            'shadow-inner dark:bg-gray-700 text-gray-700': activeTab === tab.key,
            'shadow-outer dark:bg-darkBlue bg-lightBlue  text-white': activeTab !== tab.key
          }"
        >
          {{ tab.name }}
        </button>
      </div>

      <Transition name="fade">
        <component :is="currentComponent" :key="activeTab" />
      </Transition>
    </div>
  </main>
</template>

<style scoped>
.input-style {
  @apply px-3 py-2 h-[42px] border dark:border-gray-300 border-gray-400 rounded-lg bg-white text-gray-900 dark:bg-gray-800 dark:border-gray-600 dark:text-white outline-none shadow-inner;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>