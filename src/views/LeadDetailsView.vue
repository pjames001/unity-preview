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

// Setup
const steps = reactive([...leadsSteps]);
const activeTab = ref('notes');

// Flatten fields into a single reactive object
const formData = reactive({});
steps.forEach(step => {
  step.fields.forEach(field => {
    if (field.type === 'dual-number') {
      formData[field.key + 'Min'] = '';
      formData[field.key + 'Max'] = '';
    } else if (field.key === 'nextFollowUpRequestedDate') {
      formData['nextFollowUp'] = '';
    } else if (field.key !== 'time' && !(field.key in formData)) {
      formData[field.key] = '';
    }
  });
});

const submitForm = () => {
  console.log('Submitted data:', JSON.parse(JSON.stringify(formData)));
  // Handle form submission here
};

const tabs = [
  { name: 'Notes', key: 'notes' },
  { name: 'Reminders', key: 'reminders' },
  { name: 'Contacts', key: 'contacts' },
  { name: 'Emails', key: 'emails' },
  { name: 'Calls', key: 'calls' },
  { name: 'Documents', key: 'documents' },
  { name: 'Chats', key: 'chats' }
];

const currentComponent = computed(() => {
  switch (activeTab.value) {
    case 'notes': return Notes;
    case 'reminders': return Reminders;
    case 'contacts': return Contacts;
    case 'emails': return Emails;
    case 'calls': return Calls;
    case 'documents': return Documents;
    case 'chats': return Chats;
    default: return Notes;
  }
});
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

      <!-- Grid layout: 3 columns -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        <div v-for="step in steps" :key="step.title" class="flex flex-col space-y-4">
          <!-- Step Title -->
          <h3 class="text-lg font-semibold text-gray-800 dark:text-white">
            {{ step.title }}
          </h3>

          <!-- Fields under this step -->
          <div v-for="field in step.fields" :key="field.key" class="flex flex-col">
            <label :for="field.key" class="text-sm font-medium mb-1 text-gray-700 dark:text-gray-200">
              {{ field.label }}
              <span v-if="field.required" class="text-red-500">*</span>
            </label>

            <!-- Standard input types -->
            <input
              v-if="['text', 'email', 'tel', 'url', 'number'].includes(field.type)"
              :type="field.type"
              v-model="formData[field.key]"
              :id="field.key"
              :placeholder="field.placeholder"
              :required="field.required"
              class="input-style"
            />

            <!-- Date / Time inputs -->
            <input
              v-else-if="['date', 'time', 'datetime-local'].includes(field.type)"
              :type="field.type"
              v-model="formData[field.key]"
              :id="field.key"
              :required="field.required"
              class="input-style"
            />

            <!-- Select -->
            <select
              v-else-if="field.type === 'select'"
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

            <!-- Radio group -->
            <div v-else-if="field.type === 'radio'" class="flex flex-col gap-1 mt-1">
              <label
                v-for="opt in field.options"
                :key="opt.value"
                class="flex items-center space-x-2"
              >
                <input
                  type="radio"
                  :name="field.key"
                  :value="opt.value"
                  v-model="formData[field.key]"
                />
                <span class="text-sm text-gray-700 dark:text-gray-200">
                  {{ opt.label }}
                </span>
              </label>
            </div>

            <div v-else-if="field.type === 'dual-number'" class="flex items-center space-x-2">
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

            <!-- add other input types as needed -->
          </div>
        </div>
        <!-- <div>
          <h3 class="text-lg font-semibold text-gray-800 dark:text-white">Action Codes</h3>
          <input type="color" name="color" id="color" class="input-style" v-model="formData.actionCodeColor" />
        </div> -->
      </div>
    </form>

    <!-- tabs switcher -->

    <div class="w-full px-16 mt-20 bg-white dark:bg-gray-900 rounded-xl shadow-md">
      <!-- Button Row -->
      <div class="flex justify-between items-center flex-wrap gap-2 mb-6">
        <button
          v-for="tab in tabs"
          :key="tab.key"
          @click="activeTab = tab.key"
          class="px-4 py-2 flex-1 rounded-lg font-semibold dark:bg-darkBlue bg-lightBlue dark:text-lightBlue text-white border dark:border-lightBlue border-blue-700 transition"
          :class="{
            'shadow-inner': activeTab === tab.key,
            'shadow-outer': activeTab !== tab.key
          }"
        >
          {{ tab.name }}
        </button>
      </div>

      <!-- Active Component -->
   
        <component :is="currentComponent" :key="activeTab" />
 
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
