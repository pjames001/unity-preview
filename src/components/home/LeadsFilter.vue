<script setup>
import { defineProps, defineEmits, ref, computed } from 'vue';

// Define props for controlling visibility
const props = defineProps({
  isOpen: {
    type: Boolean,
    required: true
  }
});

// Define emits for closing the modal
const emit = defineEmits(['close']);

// Function to close the modal
const closeModal = () => {
  emit('close');
};

// --- Filter Data ---
// Refactored leadsStatuses into an object for easier lookup
const leadStatusOptions = {
  coldLead: ['Answering Machine', 'Call Failed', 'Deceased', 'Fax Tone', 'Language Barrier', 'Never Contacted Owner or Manager', 'New Leads', 'No Answer', 'No Invoices', 'No Longer In Business', 'Duplicate Account', 'No Service/Disconnected', 'Not Happy With %', 'Not Interested', 'Not Qualified', 'Rework', 'Working', 'Wrong Number'],
  warmLeads: ['Email Sent', 'No Accounts Right Now', 'Not Happy With %', 'Not Liecensed in State', 'Not Ready/cb', 'Reached Email Only', 'With Another Agency'],
  hotLeads: ['Call Later', 'Has Accounts', 'Hot Follow Up', 'New Lead', 'Prospective', 'Qualified Lead', 'Referral', 'Sent Agreement Only', 'Sent Invoices Only', 'Super Hot', 'Working']
};

const conditionOptions = ['Equals To', 'Not Equals To', 'Is Blank', 'Is Not Blank'];

// Reactive states for the single filter configuration
const selectedLeadStatus = ref('');
const selectedLeadStatusCondition = ref('');
const selectedSubStatus = ref('');
const selectedSubStatusCondition = ref('');

// Function to get sub-statuses dynamically based on selected lead status
const getSubStatuses = (statusKey) => {
  return leadStatusOptions[statusKey] || [];
};

// Reactive state for other general filters (Closer, Show Active)
const closerName = ref('');
const showActiveLeads = ref(false);

// Reactive state for confirmation message
const filterAppliedMessage = ref('');

// Function to apply filters (placeholder for actual logic)
const applyFilters = () => {
  console.log('Applying filters:');
  console.log('Lead Status:', selectedLeadStatus.value);
  console.log('Lead Status Condition:', selectedLeadStatusCondition.value);
  console.log('Sub Status:', selectedSubStatus.value);
  console.log('Sub Status Condition:', selectedSubStatusCondition.value);
  console.log('Closer:', closerName.value);
  console.log('Show Active Leads:', showActiveLeads.value);

  // Show a temporary confirmation message
  filterAppliedMessage.value = 'Filters applied!';
  setTimeout(() => {
    filterAppliedMessage.value = '';
    closeModal(); // Close modal after showing message
  }, 1000); // Message disappears after 1 second
};

// Function to reset all filters
const resetFilters = () => {
  selectedLeadStatus.value = '';
  selectedLeadStatusCondition.value = '';
  selectedSubStatus.value = '';
  selectedSubStatusCondition.value = '';
  closerName.value = '';
  showActiveLeads.value = false;
  console.log('Filters reset.');
  filterAppliedMessage.value = 'Filters reset!';
  setTimeout(() => {
    filterAppliedMessage.value = '';
  }, 1000); // Message disappears after 1 second
};
</script>

<template>
  <Transition name="modal-fade">
    <div v-if="isOpen" class="fixed inset-0 z-50 flex items-center justify-center p-4">
      <!-- Overlay -->
      <div class="absolute inset-0 bg-black bg-opacity-50 dark:bg-opacity-70 backdrop-blur-sm" @click="closeModal">
      </div>

      <!-- Modal Content -->
      <div
        class="relative bg-white dark:bg-darkBlue rounded-xl shadow-2xl p-8 w-full max-w-2xl border dark:border-lightBlue border-clientPurple transform transition-all duration-300 ease-out"
        :class="{
          'scale-100 opacity-100': isOpen,
          'scale-95 opacity-0': !isOpen
        }">
        <!-- Modal Header -->
        <div class="flex justify-between items-center mb-6">
          <h2 class="text-2xl font-bold dark:text-white text-gray-800">Filters</h2>
          <button @click="closeModal"
            class="text-gray-500 dark:text-gray-300 hover:text-gray-700 dark:hover:text-white transition-colors duration-200">
            <v-icon name="bi-x-lg" scale="1.5"></v-icon>
          </button>
        </div>

        <!-- Modal Body: Two Rows, Two Columns Layout -->
        <div class="space-y-6 mb-6">
          <!-- First Row: Lead Status and Condition -->
          <div class="flex flex-wrap justify-between items-center gap-4 p-3 rounded-lg dark:bg-navBlue bg-gray-100 border dark:border-darkBlue border-gray-200">
            <!-- Lead Status Dropdown -->
            <div class="flex-1 min-w-[150px]">
              <label for="leadStatus" class="block text-sm font-medium dark:text-gray-300 text-gray-700 mb-1">Lead Status</label>
              <select
                id="leadStatus"
                v-model="selectedLeadStatus"
                @change="selectedSubStatus = ''"
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-lightBlue focus:ring focus:ring-lightBlue focus:ring-opacity-50 dark:bg-darkBlue dark:border-gray-700 dark:text-white p-2"
              >
                <option value="">Select Status</option>
                <option value="coldLead">Cold Lead</option>
                <option value="warmLeads">Warm Lead</option>
                <option value="hotLeads">Hot Lead</option>
              </select>
            </div>

            <!-- Condition Dropdown for Lead Status -->
            <div class="flex-1 min-w-[150px]">
              <label for="leadStatusCondition" class="block text-sm font-medium dark:text-gray-300 text-gray-700 mb-1">Condition</label>
              <select
                id="leadStatusCondition"
                v-model="selectedLeadStatusCondition"
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-lightBlue focus:ring focus:ring-lightBlue focus:ring-opacity-50 dark:bg-darkBlue dark:border-gray-700 dark:text-white p-2"
              >
                <option value="">Select Condition</option>
                <option v-for="option in conditionOptions" :key="option" :value="option">{{ option }}</option>
              </select>
            </div>
          </div>

          <!-- Second Row: Sub Status and Condition -->
          <div class="flex flex-wrap justify-between items-center gap-4 p-3 rounded-lg dark:bg-navBlue bg-gray-100 border dark:border-darkBlue border-gray-200">
            <!-- Sub Status Dropdown -->
            <div class="flex-1 min-w-[150px]">
              <label for="subStatus" class="block text-sm font-medium dark:text-gray-300 text-gray-700 mb-1">Sub Status</label>
              <select
                id="subStatus"
                v-model="selectedSubStatus"
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-lightBlue focus:ring focus:ring-lightBlue focus:ring-opacity-50 dark:bg-darkBlue dark:border-gray-700 dark:text-white p-2"
                :disabled="!selectedLeadStatus"
              >
                <option value="">Select Sub Status</option>
                <option v-for="sub in getSubStatuses(selectedLeadStatus)" :key="sub" :value="sub">{{ sub }}</option>
              </select>
            </div>

            <!-- Condition Dropdown for Sub Status -->
            <div class="flex-1 min-w-[150px]">
              <label for="subStatusCondition" class="block text-sm font-medium dark:text-gray-300 text-gray-700 mb-1">Condition</label>
              <select
                id="subStatusCondition"
                v-model="selectedSubStatusCondition"
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-lightBlue focus:ring focus:ring-lightBlue focus:ring-opacity-50 dark:bg-darkBlue dark:border-gray-700 dark:text-white p-2"
              >
                <option value="">Select Condition</option>
                <option v-for="option in conditionOptions" :key="option" :value="option">{{ option }}</option>
              </select>
            </div>
          </div>
        </div>

        <!-- Other General Filters -->
        <div class="space-y-4">
          <div>
            <label for="closer" class="block text-sm font-medium dark:text-gray-300 text-gray-700 mb-1">Closer</label>
            <input
              type="text"
              id="closer"
              v-model="closerName"
              placeholder="Enter closer name"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-lightBlue focus:ring focus:ring-lightBlue focus:ring-opacity-50 dark:bg-navBlue dark:border-darkBlue dark:text-white p-2"
            />
          </div>

          <div class="flex items-center">
            <input
              id="showActive"
              type="checkbox"
              v-model="showActiveLeads"
              class="h-4 w-4 text-lightBlue border-gray-300 rounded focus:ring-lightBlue dark:bg-navBlue dark:border-darkBlue"
            />
            <label for="showActive" class="ml-2 block text-sm dark:text-gray-300 text-gray-700">Show only active leads</label>
          </div>
        </div>

        <!-- Confirmation Message -->
        <div v-if="filterAppliedMessage" class="mt-4 text-center text-sm font-medium text-green-600 dark:text-green-400">
          {{ filterAppliedMessage }}
        </div>

        <!-- Modal Footer -->
        <div class="mt-8 flex justify-end gap-3">
          <button @click="resetFilters"
            class="px-4 py-2 rounded-md border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors duration-200">
            Reset
          </button>
          <button @click="applyFilters"
            class="px-4 py-2 rounded-md bg-lightBlue text-white hover:bg-blue-600 transition-colors duration-200">
            Apply Filters
          </button>
        </div>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
/* Transition styles for the modal */
.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.3s ease;
}

.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}

/* For the content inside the modal, if you want a subtle scale effect */
.modal-fade-enter-active .relative,
.modal-fade-leave-active .relative {
  transition: transform 0.3s ease, opacity 0.3s ease;
}

.modal-fade-enter-from .relative,
.modal-fade-leave-to .relative {
  transform: scale(0.95);
  opacity: 0;
}
</style>