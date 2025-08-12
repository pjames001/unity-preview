<script setup>
import { ref, watch } from 'vue';

const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(['close', 'save']);

// Form state
const breakName = ref('');
const hours = ref(0);
const minutes = ref(0);
const isPaid = ref(true); // Default to 'Paid'

// Reset form when the modal is opened
watch(
  () => props.isOpen,
  (newValue) => {
    if (newValue) {
      breakName.value = '';
      hours.value = 0;
      minutes.value = 0;
      isPaid.value = true;
    }
  }
);

const handleSave = () => {
  // Simple validation to ensure all fields are filled
  if (breakName.value && (hours.value > 0 || minutes.value > 0)) {
    const newBreak = {
      name: breakName.value,
      hours: hours.value,
      minutes: minutes.value,
      isPaid: isPaid.value,
    };
    emit('save', newBreak);
  } else {
    console.log('Please fill in all fields correctly.');
  }
};

const handleClose = () => {
  emit('close');
};
</script>

<template>
  <Transition name="modal">
    <div
      v-if="isOpen"
      class="fixed inset-0 z-50 flex items-center justify-center bg-gray-900 bg-opacity-50 dark:bg-gray-900 dark:bg-opacity-80"
    >
      <div
        class="relative bg-white dark:bg-gray-800 rounded-xl shadow-2xl p-6 w-full max-w-lg"
      >
        <!-- Modal Header -->
        <div class="flex justify-between items-center mb-4">
          <h3 class="text-xl font-bold text-gray-800 dark:text-white">
            Add New Break Type
          </h3>
          <button
            @click="handleClose"
            class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            <!-- Close icon SVG -->
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <!-- Modal Body -->
        <div class="space-y-4">
          <!-- Break Name Field -->
          <div>
            <label
              for="breakName"
              class="block text-sm font-medium text-gray-700 dark:text-gray-200"
            >
              Break Name
            </label>
            <input
              type="text"
              id="breakName"
              v-model="breakName"
              placeholder="e.g. Lunch Break"
              class="mt-1 px-3 py-2 block w-full rounded-md border border-gray-400 dark:border-gray-600 shadow-sm dark:bg-gray-800 bg-white dark:text-white text-gray-700 outline-none"
            />
          </div>

          <!-- Duration Fields -->
          <div>
            <label
              class="block text-sm font-medium text-gray-700 dark:text-gray-200"
              >Duration</label
            >
            <div class="flex gap-4 mt-1">
              <div class="flex-1">
                <input
                  type="number"
                  id="hours"
                  v-model.number="hours"
                  min="0"
                  class="px-3 py-2 block w-full rounded-md border border-gray-400 dark:border-gray-600 shadow-sm dark:bg-gray-800 bg-white dark:text-white text-gray-700 outline-none"
                />
                <span class="text-xs text-gray-500 dark:text-gray-400">Hours</span>
              </div>
              <div class="flex-1">
                <input
                  type="number"
                  id="minutes"
                  v-model.number="minutes"
                  min="0"
                  max="59"
                  class="px-3 py-2 block w-full rounded-md border border-gray-400 dark:border-gray-600 shadow-sm dark:bg-gray-800 bg-white dark:text-white text-gray-700 outline-none"
                />
                <span class="text-xs text-gray-500 dark:text-gray-400">Minutes</span>
              </div>
            </div>
          </div>

          <!-- Break Payment Dropdown -->
          <div>
            <label
              for="isPaid"
              class="block text-sm font-medium text-gray-700 dark:text-gray-200"
            >
              Break Payment
            </label>
            <select
              id="isPaid"
              v-model="isPaid"
              class="mt-1 px-3 py-2 block w-full rounded-md border border-gray-400 dark:border-gray-600 shadow-sm dark:bg-gray-800 bg-white dark:text-white text-gray-700 outline-none"
            >
              <option :value="true">Paid</option>
              <option :value="false">Unpaid</option>
            </select>
          </div>
        </div>

        <!-- Modal Actions -->
        <div class="mt-6 flex justify-end gap-2">
          <button
            @click="handleClose"
            class="px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md shadow-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700"
          >
            Cancel
          </button>
          <button
            @click="handleSave"
            class="px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
          >
            Save Break
          </button>
        </div>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
/* Define the transition styles */
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

/* Add a subtle scaling transition to the modal content */
.modal-enter-active .relative,
.modal-leave-active .relative {
  transition: transform 0.3s cubic-bezier(0.68, -0.55, 0.27, 1.55);
}

.modal-enter-from .relative,
.modal-leave-to .relative {
  transform: scale(0.9);
}
</style>