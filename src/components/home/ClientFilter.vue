<script setup>
import { defineProps, defineEmits, ref } from 'vue';

const props = defineProps({
  isOpen: {
    type: Boolean,
    required: true
  }
});
const emit = defineEmits(['close']);

const closeModal = () => emit('close');

// Example filter fields
const clientName = ref('');
const industry = ref('');
const status = ref('');
const contact = ref('');
const showActiveClients = ref(false);
const filterAppliedMessage = ref('');

const statusOptions = ['Active', 'Inactive', 'Prospect', 'Blacklisted'];

const applyFilters = () => {
  console.log('Applying client filters:', {
    clientName: clientName.value,
    industry: industry.value,
    status: status.value,
    contact: contact.value,
    showActiveClients: showActiveClients.value
  });
  filterAppliedMessage.value = 'Filters applied!';
  setTimeout(() => {
    filterAppliedMessage.value = '';
    closeModal();
  }, 1000);
};

const resetFilters = () => {
  clientName.value = '';
  industry.value = '';
  status.value = '';
  contact.value = '';
  showActiveClients.value = false;
  filterAppliedMessage.value = 'Filters reset!';
  setTimeout(() => {
    filterAppliedMessage.value = '';
  }, 1000);
};
</script>

<template>
  <Transition name="modal-fade">
    <div v-if="isOpen" class="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div class="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm" @click="closeModal"></div>
      <div class="relative bg-white dark:bg-darkBlue rounded-xl shadow-2xl p-8 w-full max-w-2xl border dark:border-lightBlue border-clientPurple">
        <div class="flex justify-between items-center mb-6">
          <h2 class="text-2xl font-bold dark:text-white text-gray-800">Client Filters</h2>
          <button @click="closeModal" class="text-gray-500 dark:text-gray-300 hover:text-gray-700 dark:hover:text-white">
            <v-icon name="bi-x-lg" scale="1.5"></v-icon>
          </button>
        </div>
        <div class="space-y-6 mb-6">
          <div>
            <label class="block text-sm font-medium dark:text-gray-300 text-gray-700 mb-1">Client Name</label>
            <input v-model="clientName" type="text" class="block w-full rounded-md border-gray-300 p-2 dark:bg-darkBlue dark:text-white" placeholder="Enter client name" />
          </div>
          <div>
            <label class="block text-sm font-medium dark:text-gray-300 text-gray-700 mb-1">Industry</label>
            <input v-model="industry" type="text" class="block w-full rounded-md border-gray-300 p-2 dark:bg-darkBlue dark:text-white" placeholder="Enter industry" />
          </div>
          <div>
            <label class="block text-sm font-medium dark:text-gray-300 text-gray-700 mb-1">Status</label>
            <select v-model="status" class="block w-full rounded-md border-gray-300 p-2 dark:bg-darkBlue dark:text-white">
              <option value="">Select Status</option>
              <option v-for="opt in statusOptions" :key="opt" :value="opt">{{ opt }}</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium dark:text-gray-300 text-gray-700 mb-1">Contact</label>
            <input v-model="contact" type="text" class="block w-full rounded-md border-gray-300 p-2 dark:bg-darkBlue dark:text-white" placeholder="Enter contact name" />
          </div>
          <div class="flex items-center">
            <input id="showActiveClients" type="checkbox" v-model="showActiveClients" class="h-4 w-4 text-lightBlue border-gray-300 rounded" />
            <label for="showActiveClients" class="ml-2 block text-sm dark:text-gray-300 text-gray-700">Show only active clients</label>
          </div>
        </div>
        <div v-if="filterAppliedMessage" class="mt-4 text-center text-sm font-medium text-green-600 dark:text-green-400">
          {{ filterAppliedMessage }}
        </div>
        <div class="mt-8 flex justify-end gap-3">
          <button @click="resetFilters" class="px-4 py-2 rounded-md border border-gray-300 dark:bg-gray-700 dark:text-gray-200 text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600">Reset</button>
          <button @click="applyFilters" class="px-4 py-2 rounded-md bg-lightBlue text-white hover:bg-blue-600">Apply Filters</button>
        </div>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.3s ease;
}
.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}
</style>