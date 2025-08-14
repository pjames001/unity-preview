<script setup>
import { leadsSteps } from '@/components/leadForm';
import { reactive, ref, computed } from 'vue';
import LeadDetailsHeader from '@/components/lead-details/LeadDetailsHeader.vue';
import Notes from '@/components/lead-details/Notes.vue';
import Reminders from '@/components/lead-details/Reminders.vue';
import Contacts from '@/components/lead-details/Contacts.vue';
import Emails from '@/components/lead-details/Emails.vue';
import Calls from '@/components/lead-details/Calls.vue';
import Documents from '@/components/lead-details/Documents.vue';
import Chats from '@/components/lead-details/Chats.vue';

// --- State ---
const steps = reactive([...leadsSteps]);
const activeTab = ref('notes');
const formData = reactive({});

// --- Constants ---
const tabs = [
  { name: 'Notes', key: 'notes' },
  { name: 'Reminders', key: 'reminders' },
  { name: 'Contacts', key: 'contacts' },
  { name: 'Emails', key: 'emails' },
  { name: 'Calls', key: 'calls' },
  { name: 'Documents', key: 'documents' },
  { name: 'Chats', key: 'chats' }
];

const componentMap = {
  notes: Notes,
  reminders: Reminders,
  contacts: Contacts,
  emails: Emails,
  calls: Calls,
  documents: Documents,
  chats: Chats
};

// --- Initialization ---
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

// --- Computed Properties ---
const currentComponent = computed(() => {
  return componentMap[activeTab.value] || Notes;
});

// --- Methods ---
const submitForm = () => {
  console.log('Submitted data:', JSON.parse(JSON.stringify(formData)));
  // Handle form submission here
};
</script>

<template>
  <main class="view dark:bg-darkBlue bg-white">
    <LeadDetailsHeader />

    <span class="dark:text-white text-gray-700 ml-10 font-semibold text-lg">Contacts</span>
    <div class="w-28 h-20 ml-10 mt-6 mb-6 border-l-4 border-lightBlue flex justify-center items-center cursor-pointer hover:bg-lightBlue/30 dark:hover:bg-lightBlue/10 transition duration-300 ease">
      <span class="dark:text-white text-gray-700">scott</span>
    </div>

    <form
      @submit.prevent="submitForm"
      class="max-w-[1440px] mx-auto p-6 bg-white dark:bg-gray-900 rounded-2xl"
    >
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        <div v-for="step in steps" :key="step.title" class="flex flex-col space-y-4">
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
    </form>

    <div class="w-full px-16 mt-20 bg-white dark:bg-gray-900 rounded-xl shadow-md">
      <div class="flex justify-between items-center flex-wrap gap-2 mb-6">
        <button
          v-for="tab in tabs"
          :key="tab.key"
          @click="activeTab = tab.key"
          class="px-4 py-2 flex-1 rounded-lg font-semibold dark:text-lightBlue text-white border dark:border-lightBlue border-blue-700 transition"
          :class="{
            'shadow-inner dark:bg-gray-700': activeTab === tab.key,
            'shadow-outer dark:bg-darkBlue bg-lightBlue ': activeTab !== tab.key
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
  @apply px-3 py-2 h-[42px] border dark:border-gray-300 border-gray-400 rounded-lg bg-white text-gray-900 dark:bg-gray-800 dark:border-gray-600 dark:text-white outline-none;
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