<script setup>
import { ref, computed, watch } from 'vue';

const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['close', 'save']);

// Form state
const holidayName = ref('');
const holidayDate = ref(new Date().toISOString().slice(0, 10)); // YYYY-MM-DD format
const selectedOfficeLocations = ref([]);
const selectedHolidayType = ref(null);

// Dropdown state
const openLocationMenu = ref(false);
const officeLocations = ref(['Headquarters', 'Branch A', 'Branch B', 'Remote']);
const holidayTypes = ref(['One-time holiday', 'Annual fixed date', 'Annual variable date']);

// Custom directive to handle clicks outside an element
const vClickOutside = {
  mounted(el, binding) {
    el.clickOutsideEvent = (event) => {
      if (!el.contains(event.target)) {
        binding.value();
      }
    };
    document.addEventListener('click', el.clickOutsideEvent);
  },
  unmounted(el) {
    document.removeEventListener('click', el.clickOutsideEvent);
  },
};

// Reset form when the modal is opened
watch(() => props.isOpen, (newValue) => {
  if (newValue) {
    holidayName.value = '';
    holidayDate.value = new Date().toISOString().slice(0, 10);
    selectedOfficeLocations.value = [];
    selectedHolidayType.value = null;
  }
});

const handleSave = () => {
  if (holidayName.value && holidayDate.value && selectedHolidayType.value && selectedOfficeLocations.value.length > 0) {
    const newHoliday = {
      name: holidayName.value,
      date: holidayDate.value,
      officeLocations: selectedOfficeLocations.value,
      type: selectedHolidayType.value,
    };
    emit('save', newHoliday);
  } else {
    // You could show a validation message here
    console.log('Please fill in all fields.');
  }
};

const handleClose = () => {
  emit('close');
};

const toggleLocationSelection = (location) => {
  const index = selectedOfficeLocations.value.indexOf(location);
  if (index === -1) {
    selectedOfficeLocations.value.push(location);
  } else {
    selectedOfficeLocations.value.splice(index, 1);
  }
};

</script>

<template>
  <Transition name="modal">
    <div v-if="isOpen"
      class="fixed inset-0 z-50 flex items-center justify-center bg-gray-900 bg-opacity-50 dark:bg-gray-900 dark:bg-opacity-80">
      <div class="relative bg-white dark:bg-gray-800 rounded-xl shadow-2xl p-6 w-full max-w-lg">
        
        <!-- Modal Header -->
        <div class="flex justify-between items-center mb-4">
          <h3 class="text-xl font-bold text-gray-800 dark:text-white">
            Create New Holiday
          </h3>
          <button @click="handleClose" class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
            <!-- Close icon SVG -->
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24"
              stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <!-- Modal Body -->
        <div class="space-y-4">
          <!-- Holiday Name Field -->
          <div>
            <label for="holidayName" class="block text-sm font-medium text-gray-700 dark:text-gray-200">
              Holiday Name
            </label>
            <input type="text" id="holidayName" v-model="holidayName" placeholder="e.g. Employee Appreciation Day"
              class="mt-1 px-3 py-2 block w-full rounded-md border border-gray-400 dark:border-gray-600 shadow-sm dark:bg-gray-800 bg-white dark:text-white text-gray-700 outline-none">
          </div>

          <!-- Office Locations Multi-select -->
          <div class="relative" v-click-outside="() => (openLocationMenu = false)">
            <label for="officeLocations" class="block text-sm font-medium text-gray-700 dark:text-gray-200">
              Office Locations
            </label>
            <button @click="openLocationMenu = !openLocationMenu"
              class="mt-1 w-full text-left px-3 py-2 bg-white dark:bg-gray-800 border border-gray-400 dark:border-gray-600 dark:text-white text-gray-700 rounded-md shadow-sm">
              {{ selectedOfficeLocations.length > 0 ? selectedOfficeLocations.join(', ') : 'Select Locations' }}
            </button>
            <div v-if="openLocationMenu"
              class="absolute z-10 mt-1 w-full rounded-md bg-white dark:bg-gray-800 dark:text-white text-gray-700 border border-gray-400 dark:border-gray-600">
              <ul class="max-h-60 overflow-y-auto">
                <li v-for="location in officeLocations" :key="location" @click.stop="toggleLocationSelection(location)"
                  class="px-4 py-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center">
                  <input type="checkbox" :checked="selectedOfficeLocations.includes(location)" class="mr-2" />
                  {{ location }}
                </li>
              </ul>
            </div>
          </div>

          <!-- Holiday Type Dropdown -->
          <div>
            <label for="holidayType" class="block text-sm font-medium text-gray-700 dark:text-gray-200">
              Holiday Type
            </label>
            <select id="holidayType" v-model="selectedHolidayType"
              class="mt-1 px-3 py-2 block w-full rounded-md border border-gray-400 dark:border-gray-600 shadow-sm dark:bg-gray-800 bg-white dark:text-white text-gray-700 outline-none">
              <option :value="null" disabled>Select a type</option>
              <option v-for="type in holidayTypes" :key="type" :value="type">
                {{ type }}
              </option>
            </select>
          </div>

          <!-- Date Picker -->
          <div>
            <label for="holidayDate" class="block text-sm font-medium text-gray-700 dark:text-gray-200">
              Holiday Date
            </label>
            <input type="date" id="holidayDate" v-model="holidayDate"
              class="mt-1 px-3 py-2 block w-full rounded-md border border-gray-400 dark:border-gray-600 shadow-sm dark:bg-gray-800 bg-white dark:text-white text-gray-700 outline-none">
          </div>
        </div>

        <!-- Modal Actions -->
        <div class="mt-6 flex justify-end gap-2">
          <button @click="handleClose"
            class="px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md shadow-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700">
            Cancel
          </button>
          <button @click="handleSave"
            class="px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700">
            Save Holiday
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