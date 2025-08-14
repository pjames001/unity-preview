<script setup>
import { defineProps, defineEmits, ref, computed, watch } from 'vue';

// --- Props & Emits ---
const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false
  },
  holiday: {
    type: Object,
    default: null
  }
});

const emit = defineEmits(['close', 'save', 'delete']);

// --- Form State ---
const holidayName = ref('');
const holidayDate = ref(new Date().toISOString().slice(0, 10));
const selectedOfficeLocations = ref([]);
const selectedHolidayType = ref(null);
const selectedDayNumber = ref(null);
const selectedDayName = ref(null);
const selectedMonth = ref(null);
const isPaid = ref(null);
const openLocationMenu = ref(false);

// --- Static Data ---
const officeLocations = ref(['All', 'Headquarters', 'Branch A', 'Branch B', 'Remote']);
const holidayTypes = ref(['One-time holiday', 'Annual fixed date', 'Annual variable date']);
const dayNumbers = ref(['First', 'Second', 'Third', 'Fourth', 'Last']);
const dayNames = ref(['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']);
const months = ref([
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
]);

// --- Computed Properties ---
const showVariableDateInputs = computed(() => selectedHolidayType.value === 'Annual variable date');

// --- Watchers ---
watch(() => props.isOpen, (newValue) => {
  if (newValue && props.holiday) {
    populateForm(props.holiday);
  } else {
    resetForm();
  }
});

// --- Event Handlers & Methods ---
const populateForm = (holiday) => {
  holidayName.value = holiday.name || '';
  selectedHolidayType.value = holiday.type || null;
  isPaid.value = holiday.isPaid !== undefined ? holiday.isPaid : null;

  if (holiday.officeLocations && holiday.officeLocations.includes('All')) {
    selectedOfficeLocations.value = ['All'];
  } else {
    selectedOfficeLocations.value = holiday.officeLocations ? [...holiday.officeLocations] : [];
  }

  if (holiday.type === 'Annual variable date') {
    selectedDayNumber.value = holiday.dayNumber || null;
    selectedDayName.value = holiday.dayName || null;
    selectedMonth.value = holiday.month || null;
  } else {
    holidayDate.value = holiday.date || new Date().toISOString().slice(0, 10);
  }
};

const resetForm = () => {
  holidayName.value = '';
  selectedOfficeLocations.value = [];
  selectedHolidayType.value = null;
  isPaid.value = null;
  holidayDate.value = new Date().toISOString().slice(0, 10);
  selectedDayNumber.value = null;
  selectedDayName.value = null;
  selectedMonth.value = null;
};

const validateForm = () => {
  const commonValid = holidayName.value && selectedHolidayType.value && selectedOfficeLocations.value.length > 0 && isPaid.value !== null;
  
  if (showVariableDateInputs.value) {
    return commonValid && selectedDayNumber.value && selectedDayName.value && selectedMonth.value;
  }
  return commonValid && holidayDate.value;
};

const handleSave = () => {
  if (!validateForm()) {
    console.log('Please fill in all fields.');
    return;
  }

  const updatedHoliday = {
    id: props.holiday.id,
    name: holidayName.value,
    officeLocations: selectedOfficeLocations.value,
    type: selectedHolidayType.value,
    isPaid: isPaid.value,
  };

  if (showVariableDateInputs.value) {
    Object.assign(updatedHoliday, {
      dayNumber: selectedDayNumber.value,
      dayName: selectedDayName.value,
      month: selectedMonth.value
    });
  } else {
    Object.assign(updatedHoliday, {
      date: holidayDate.value
    });
  }

  emit('save', updatedHoliday);
};

const handleDelete = () => {
  if (confirm(`Are you sure you want to delete ${props.holiday.name}?`)) {
    emit('delete', props.holiday.id);
  }
};

const handleClose = () => {
  emit('close');
};

const toggleLocationSelection = (location) => {
  if (location === 'All') {
    selectedOfficeLocations.value = selectedOfficeLocations.value.includes('All') ? [] : ['All'];
  } else {
    const allIndex = selectedOfficeLocations.value.indexOf('All');
    if (allIndex !== -1) selectedOfficeLocations.value.splice(allIndex, 1);
    
    const index = selectedOfficeLocations.value.indexOf(location);
    if (index === -1) {
      selectedOfficeLocations.value.push(location);
    } else {
      selectedOfficeLocations.value.splice(index, 1);
    }
  }
};

// --- Custom Directives ---
const vClickOutside = {
  mounted: (el, binding) => {
    el.clickOutsideEvent = (event) => {
      if (!el.contains(event.target)) binding.value();
    };
    document.addEventListener('click', el.clickOutsideEvent);
  },
  unmounted: (el) => {
    document.removeEventListener('click', el.clickOutsideEvent);
  },
};
</script>

<template>
  <Transition name="modal">
    <div v-if="isOpen"
      class="fixed inset-0 z-50 flex items-center justify-center bg-gray-900 bg-opacity-50 dark:bg-gray-900 dark:bg-opacity-80">
      <div class="relative bg-white dark:bg-gray-800 rounded-xl shadow-2xl p-6 w-full max-w-lg">
        
        <div class="flex justify-between items-center mb-4">
          <h3 class="text-xl font-bold text-gray-800 dark:text-white">
            Edit Holiday
          </h3>
          <button @click="handleClose" class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24"
              stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div class="space-y-4">
          <div>
            <label for="holidayName" class="block text-sm font-medium text-gray-700 dark:text-gray-200">
              Holiday Name
            </label>
            <input type="text" id="holidayName" v-model="holidayName" placeholder="e.g. Employee Appreciation Day"
              class="mt-1 px-3 py-2 block w-full rounded-md border border-gray-400 dark:border-gray-600 shadow-sm dark:bg-gray-800 bg-white dark:text-white text-gray-700 outline-none">
          </div>

          <div class="relative" v-click-outside="() => (openLocationMenu = false)">
            <label for="officeLocations" class="block text-sm font-medium text-gray-700 dark:text-gray-200">
              Office Locations
            </label>
            <button @click="openLocationMenu = !openLocationMenu"
              class="mt-1 w-full text-left px-3 py-2 bg-white dark:bg-gray-800 border border-gray-400 dark:border-gray-600 dark:text-white text-gray-700 rounded-md shadow-sm">
              {{ selectedOfficeLocations.length ? selectedOfficeLocations.join(', ') : 'Select Locations' }}
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

          <div v-if="!showVariableDateInputs">
            <label for="holidayDate" class="block text-sm font-medium text-gray-700 dark:text-gray-200">
              Holiday Date
            </label>
            <input type="date" id="holidayDate" v-model="holidayDate"
              class="mt-1 px-3 py-2 block w-full rounded-md border border-gray-400 dark:border-gray-600 shadow-sm dark:bg-gray-800 bg-white dark:text-white text-gray-700 outline-none">
          </div>

          <div v-if="showVariableDateInputs" class="space-y-4">
            <div>
              <label for="dayNumber" class="block text-sm font-medium text-gray-700 dark:text-gray-200">
                Day Number
              </label>
              <select id="dayNumber" v-model="selectedDayNumber"
                class="mt-1 px-3 py-2 block w-full rounded-md border border-gray-400 dark:border-gray-600 shadow-sm dark:bg-gray-800 bg-white dark:text-white text-gray-700 outline-none">
                <option :value="null" disabled>Select a day</option>
                <option v-for="day in dayNumbers" :key="day" :value="day">
                  {{ day }}
                </option>
              </select>
            </div>

            <div>
              <label for="dayName" class="block text-sm font-medium text-gray-700 dark:text-gray-200">
                Select Day
              </label>
              <select id="dayName" v-model="selectedDayName"
                class="mt-1 px-3 py-2 block w-full rounded-md border border-gray-400 dark:border-gray-600 shadow-sm dark:bg-gray-800 bg-white dark:text-white text-gray-700 outline-none">
                <option :value="null" disabled>Select a day</option>
                <option v-for="day in dayNames" :key="day" :value="day">
                  {{ day }}
                </option>
              </select>
            </div>

            <div>
              <label for="month" class="block text-sm font-medium text-gray-700 dark:text-gray-200">
                Month
              </label>
              <select id="month" v-model="selectedMonth"
                class="mt-1 px-3 py-2 block w-full rounded-md border border-gray-400 dark:border-gray-600 shadow-sm dark:bg-gray-800 bg-white dark:text-white text-gray-700 outline-none">
                <option :value="null" disabled>Select a month</option>
                <option v-for="month in months" :key="month" :value="month">
                  {{ month }}
                </option>
              </select>
            </div>
          </div>
        </div>

        <div class="mt-4">
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
            Holiday Status
          </label>
          <div class="flex space-x-2">
            <button
              @click="isPaid = true"
              :class="[
                'w-1/2 px-4 py-2 text-sm font-medium rounded-md shadow-sm transition-colors',
                isPaid === true
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600'
              ]"
            >
              Paid
            </button>
            <button
              @click="isPaid = false"
              :class="[
                'w-1/2 px-4 py-2 text-sm font-medium rounded-md shadow-sm transition-colors',
                isPaid === false
                  ? 'bg-red-600 text-white'
                  : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600'
              ]"
            >
              Unpaid
            </button>
          </div>
        </div>

        <div class="mt-6 flex justify-between gap-2">
          <button @click="handleDelete"
            class="px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700">
            Delete Holiday
          </button>
          <div class="flex gap-2">
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