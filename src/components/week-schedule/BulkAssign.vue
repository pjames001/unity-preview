<script setup>
import { ref, computed, defineProps, defineEmits } from 'vue';

// --- Props & Emits ---
// The component receives employees and break types from the parent.
const props = defineProps({
  employees: {
    type: Array,
    required: true,
  },
  breakTypes: {
    type: Array,
    required: true,
  },
});

// The component emits 'close' and 'assign' events to the parent.
const emit = defineEmits(['close', 'assign']);

// --- State Management ---
const selectedBreakType = ref(null);
const selectedEmployees = ref([]);
const selectedTime = ref('18:00');

// --- Computed Properties ---
// Generates a list of time slots in 15-minute increments for the dropdown.
const breakTimeSlots = computed(() => {
  const slots = [];
  for (let h = 18; h < 24; h++) {
    slots.push(`${String(h).padStart(2, '0')}:00`);
    slots.push(`${String(h).padStart(2, '0')}:15`);
    slots.push(`${String(h).padStart(2, '0')}:30`);
    slots.push(`${String(h).padStart(2, '0')}:45`);
  }
  for (let h = 0; h < 6; h++) {
    slots.push(`${String(h).padStart(2, '0')}:00`);
    slots.push(`${String(h).padStart(2, '0')}:15`);
    slots.push(`${String(h).padStart(2, '0')}:30`);
    slots.push(`${String(h).padStart(2, '0')}:45`);
  }
  return slots;
});

// A computed property to check if all employees are currently selected
const areAllEmployeesSelected = computed(() => {
  return selectedEmployees.value.length === props.employees.length;
});

// --- Methods ---
// Handles the form submission to assign breaks.
const assignBreaks = () => {
  if (!selectedBreakType.value || selectedEmployees.value.length === 0 || !selectedTime.value) {
    // Simple validation check
    console.error("Please select a break type, at least one employee, and a time.");
    return;
  }
  const selectedBreak = props.breakTypes.find(b => b.id === selectedBreakType.value);
  if (!selectedBreak) {
    console.error("Selected break type not found.");
    return;
  }

  // Calculate the end time of the break based on its duration.
  const [startHour, startMinute] = selectedTime.value.split(':').map(Number);
  const breakDuration = parseInt(selectedBreak.name.match(/\((\d+) min\)/)[1]);
  let endMinute = startMinute + breakDuration;
  let endHour = startHour;
  if (endMinute >= 60) {
    endHour += Math.floor(endMinute / 60);
    endMinute = endMinute % 60;
  }
  // Adjust for times crossing midnight (24h clock)
  if (endHour >= 24) {
    endHour = endHour % 24;
  }

  const breakData = {
    type: selectedBreak.id,
    start: selectedTime.value,
    end: `${String(endHour).padStart(2, '0')}:${String(endMinute).padStart(2, '0')}`
  };

  // Emit the 'assign' event with the new break data and selected employees.
  emit('assign', { employees: selectedEmployees.value, breakData });
  
  // Reset the form fields after a successful assignment.
  selectedBreakType.value = null;
  selectedEmployees.value = [];
  selectedTime.value = '18:00';
};

// Toggles the selection of all employees
const toggleSelectAll = () => {
  if (areAllEmployeesSelected.value) {
    selectedEmployees.value = [];
  } else {
    selectedEmployees.value = props.employees.map(employee => employee.id);
  }
};

// Emits the 'close' event when the modal should be closed.
const closeModal = () => {
  emit('close');
};
</script>

<template>
  <!-- The transition component wraps the modal for a smooth fade effect -->
  <Transition name="modal-fade">
    <div class="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div class="bg-white dark:bg-gray-800 rounded-xl shadow-2xl p-6 w-full max-w-lg relative transition-all duration-300">
        <div class="flex justify-between items-center pb-3 mb-4 border-b border-gray-200 dark:border-gray-700">
          <h3 class="text-xl font-bold text-gray-900 dark:text-gray-100">Bulk Assign Breaks</h3>
          <button @click="closeModal" class="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-500 dark:text-gray-400" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
            </svg>
          </button>
        </div>

        <form @submit.prevent="assignBreaks" class="space-y-6">
          <!-- Break Type Dropdown -->
          <div>
            <label for="break-type" class="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Select Break Type</label>
            <select
              id="break-type"
              v-model="selectedBreakType"
              class="w-full px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-md shadow-sm border border-gray-300 dark:border-gray-600 focus:ring-blue-500 focus:border-blue-500 transition"
            >
              <option :value="null" disabled>-- Choose a break type --</option>
              <option v-for="breakType in breakTypes" :key="breakType.id" :value="breakType.id">
                {{ breakType.name }}
              </option>
            </select>
          </div>

          <Transition name="fade-slide">
            <div v-if="selectedBreakType">
              <!-- Employees Checkbox List -->
              <div>
                <label class="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Select Employees</label>
                <div class="h-40 overflow-y-auto bg-gray-100 dark:bg-gray-700 rounded-md shadow-sm border border-gray-300 dark:border-gray-600 p-2">
                  <!-- Select All Checkbox -->
                  <div
                    class="flex items-center space-x-2 py-1 px-2 border-b border-gray-300 dark:border-gray-600 mb-2 transition cursor-pointer"
                    @click="toggleSelectAll"
                  >
                    <input
                      type="checkbox"
                      :checked="areAllEmployeesSelected"
                      class="h-4 w-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                    />
                    <span class="text-sm font-semibold text-gray-700 dark:text-gray-300 cursor-pointer w-full">
                      Select All
                    </span>
                  </div>
                  <!-- Individual Employee Checkboxes -->
                  <div
                    v-for="employee in employees"
                    :key="employee.id"
                    class="flex items-center space-x-2 py-1 px-2 hover:bg-gray-200 dark:hover:bg-gray-600 rounded transition cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      :id="'employee-' + employee.id"
                      :value="employee.id"
                      v-model="selectedEmployees"
                      class="h-4 w-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                    />
                    <label :for="'employee-' + employee.id" class="text-sm text-gray-700 dark:text-gray-300 cursor-pointer w-full">
                      {{ employee.name }}
                    </label>
                  </div>
                </div>
              </div>

              <!-- Start Time Field -->
              <div>
                <label for="start-time" class="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Start Time</label>
                <select
                  id="start-time"
                  v-model="selectedTime"
                  class="w-full px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-md shadow-sm border border-gray-300 dark:border-gray-600 focus:ring-blue-500 focus:border-blue-500 transition"
                >
                  <option v-for="time in breakTimeSlots" :key="time" :value="time">
                    {{ time }}
                  </option>
                </select>
              </div>
            </div>
          </Transition>

          <!-- Action Buttons -->
          <div class="flex justify-end space-x-3 mt-6">
            <button @click="closeModal" type="button" class="px-5 py-2.5 text-sm font-medium rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition">
              Cancel
            </button>
            <button type="submit" class="px-5 py-2.5 text-sm font-medium rounded-lg text-white bg-green-600 hover:bg-green-700 transition">
              Assign Breaks
            </button>
          </div>
        </form>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: all 0.3s ease;
}

.fade-slide-enter-from,
.fade-slide-leave-to {
  transform: translateY(-10px);
  opacity: 0;
}

.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: all 0.3s ease-in-out;
}

.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}
</style>
