<script setup>
import { ref, computed, watch } from 'vue';

const emit = defineEmits(['close', 'save']);

// -- Data --
const scheduleName = ref('');
const scheduleColor = ref('#60a5fa');
const weekDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const weeklySchedule = ref(
  weekDays.map(day => ({
    day,
    scheduleType: 'Day Off',
    clockIn: '09:00',
    clockOut: '17:00',
    breaks: 'Lunch (12:00-13:00)',
  }))
);

const scheduleTypes = ['Day Off', 'Default Shift', 'Lebanon Team Shift'];

// Employee assignment filters
const locations = ['USA office', 'Lebanon office', 'Kenya office', 'Philippines office'];
const selectedLocations = ref([]);
const departments = ['Admin', 'Collection', 'Sales', 'HR', 'Quality Assurance', 'Executive Management', 'Software Development'];
const selectedDepartments = ref([]);
const positions = ['Manager', 'Associate', 'Analyst', 'Director', 'Team Lead', 'Intern'];
const selectedPositions = ref([]);

// State for multi-select dropdowns visibility
const showLocationDropdown = ref(false);
const showDepartmentDropdown = ref(false);
const showPositionDropdown = ref(false);

// Employee table data
const employees = ref([
  { id: 1, name: 'John Doe', department: 'Sales', position: 'Manager', location: 'USA office', currentShift: 'Standard 9-5 Shift' },
  { id: 2, name: 'Jane Smith', department: 'HR', position: 'Analyst', location: 'Lebanon office', currentShift: 'Part-Time Flex' },
  { id: 3, name: 'Peter Jones', department: 'Software Development', position: 'Associate', location: 'USA office', currentShift: 'Night Shift' },
  { id: 4, name: 'Mary Williams', department: 'Admin', position: 'Team Lead', location: 'Kenya office', currentShift: 'Standard 9-5 Shift' },
  { id: 5, name: 'Sam Brown', department: 'Sales', position: 'Associate', location: 'Philippines office', currentShift: 'Weekend Coverage' },
]);
const employeeSearchTerm = ref('');
const selectedEmployees = ref([]);

// -- Computed properties --
const selectAllEmployees = computed({
  get: () =>
    filteredEmployees.value.length > 0 &&
    selectedEmployees.value.length === filteredEmployees.value.length,
  set: (value) => {
    selectedEmployees.value = value ? filteredEmployees.value.map((e) => e.id) : [];
  },
});

const filteredEmployees = computed(() => {
  const term = employeeSearchTerm.value.toLowerCase();
  let result = employees.value;

  // Filter by search term
  if (term) {
    result = result.filter(e => e.name.toLowerCase().includes(term) || e.department.toLowerCase().includes(term) || e.position.toLowerCase().includes(term));
  }

  // Filter by locations
  if (selectedLocations.value.length > 0) {
    result = result.filter(e => selectedLocations.value.includes(e.location));
  }

  // Filter by departments
  if (selectedDepartments.value.length > 0) {
    result = result.filter(e => selectedDepartments.value.includes(e.department));
  }

  // Filter by positions
  if (selectedPositions.value.length > 0) {
    result = result.filter(e => selectedPositions.value.includes(e.position));
  }

  return result;
});

const locationSelectAll = computed({
  get: () => selectedLocations.value.length === locations.length,
  set: (value) => {
    selectedLocations.value = value ? [...locations] : [];
  }
});

const departmentSelectAll = computed({
  get: () => selectedDepartments.value.length === departments.length,
  set: (value) => {
    selectedDepartments.value = value ? [...departments] : [];
  }
});

const positionSelectAll = computed({
  get: () => selectedPositions.value.length === positions.length,
  set: (value) => {
    selectedPositions.value = value ? [...positions] : [];
  }
});

// -- Methods --
const close = () => {
  emit('close');
};

const saveSchedule = () => {
  const newSchedule = {
    name: scheduleName.value,
    color: scheduleColor.value,
    weeklySchedule: weeklySchedule.value,
    assignedEmployees: selectedEmployees.value,
  };
  emit('save', newSchedule);
};

// Handle `Day Off` selection
watch(weeklySchedule, (newVal) => {
  newVal.forEach((day) => {
    if (day.scheduleType === 'Day Off') {
      day.clockIn = '';
      day.clockOut = '';
      day.breaks = '';
    }
  });
}, { deep: true });

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
</script>

<template>
  <div
    class="fixed inset-0 bg-gray-900 bg-opacity-75 flex items-center justify-center z-50 p-4 overflow-y-auto"
    @click.self="close"
  >
    <div
      class="bg-white dark:bg-gray-800 rounded-xl shadow-outer max-w-5xl w-full max-h-[90vh] overflow-hidden flex flex-col"
      @click.stop
    >
      <div
        class="flex justify-between items-center px-6 py-4 border-b border-gray-200 dark:border-gray-700"
      >
        <h2 class="text-2xl font-bold dark:text-white">Create Weekly Schedule</h2>
        <button @click="close" class="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-white">
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

      <div class="p-6 overflow-y-auto custom-scrollbar">
        <div class="mb-6">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label for="schedule-name" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Schedule Name</label>
              <input
                type="text"
                id="schedule-name"
                v-model="scheduleName"
                class="w-full rounded-xl shadow-inner border border-gray-300 dark:border-gray-600 dark:bg-gray-700 bg-white dark:text-white text-gray-700 px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                placeholder="e.g., Standard 9-5 Shift"
              />
            </div>
            <div>
              <label for="schedule-color" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Color</label>
              <div class="flex items-center space-x-3">
                <input
                  type="color"
                  id="schedule-color"
                  v-model="scheduleColor"
                  class="h-10 w-10 rounded-full cursor-pointer border-none p-0"
                  title="Choose a color"
                />
                <span class="text-sm font-mono dark:text-white">{{ scheduleColor }}</span>
              </div>
            </div>
          </div>
        </div>

        <div class="mb-6">
          <h3 class="text-lg font-semibold dark:text-white mb-4">Weekly Schedule</h3>
          <div class="overflow-x-auto">
            <table
              class="min-w-full text-left border border-gray-300 dark:border-gray-600 rounded-md overflow-hidden"
            >
              <thead class="bg-gray-100 dark:bg-gray-800 text-sm text-gray-700 dark:text-gray-200">
                <tr>
                  <th class="px-4 py-2">Day</th>
                  <th class="px-4 py-2">Schedule Type</th>
                  <th class="px-4 py-2">Clock In</th>
                  <th class="px-4 py-2">Clock Out</th>
                  <th class="px-4 py-2">Breaks</th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="(daySchedule) in weeklySchedule"
                  :key="daySchedule.day"
                  class="border-t border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200"
                >
                  <td class="px-4 py-2">{{ daySchedule.day }}</td>
                  <td class="px-4 py-2">
                    <select
                      v-model="daySchedule.scheduleType"
                      class="w-full rounded-xl shadow-inner border border-gray-300 dark:border-gray-600 dark:bg-gray-700 bg-white dark:text-white text-gray-700 px-2 py-1 outline-none"
                    >
                      <option v-for="type in scheduleTypes" :key="type" :value="type">
                        {{ type }}
                      </option>
                    </select>
                  </td>
                  <td class="px-4 py-2">
                    <input
                      type="time"
                      v-model="daySchedule.clockIn"
                      :disabled="daySchedule.scheduleType === 'Day Off'"
                      class="w-full rounded-xl shadow-inner border border-gray-300 dark:border-gray-600 dark:bg-gray-700 bg-white dark:text-white text-gray-700 px-2 py-1 outline-none"
                    />
                  </td>
                  <td class="px-4 py-2">
                    <input
                      type="time"
                      v-model="daySchedule.clockOut"
                      :disabled="daySchedule.scheduleType === 'Day Off'"
                      class="w-full rounded-xl shadow-inner border border-gray-300 dark:border-gray-600 dark:bg-gray-700 bg-white dark:text-white text-gray-700 px-2 py-1 outline-none"
                    />
                  </td>
                  <td class="px-4 py-2">
                    <input
                      type="text"
                      v-model="daySchedule.breaks"
                      :disabled="daySchedule.scheduleType === 'Day Off'"
                      class="w-full rounded-xl shadow-inner border border-gray-300 dark:border-gray-600 dark:bg-gray-700 bg-white dark:text-white text-gray-700 px-2 py-1 outline-none"
                    />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div class="mb-6">
          <h3 class="text-lg font-semibold dark:text-white mb-4">Employee Assignment</h3>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div class="relative" v-click-outside="() => showLocationDropdown = false">
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Location Filter</label>
              <button
                @click="showLocationDropdown = !showLocationDropdown"
                class="w-full rounded-xl shadow-inner border border-gray-300 dark:border-gray-600 dark:bg-gray-700 bg-white dark:text-white text-gray-700 px-4 py-2 text-left flex justify-between items-center"
              >
                <span v-if="selectedLocations.length === 0">Select locations...</span>
                <span v-else-if="selectedLocations.length === locations.length">All Locations</span>
                <span v-else>{{ selectedLocations.length }} selected</span>
                <svg
                  class="h-5 w-5 text-gray-400"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fill-rule="evenodd"
                    d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                    clip-rule="evenodd"
                  />
                </svg>
              </button>
              <div
                v-if="showLocationDropdown"
                class="absolute z-10 w-full mt-1 bg-white dark:bg-gray-700 rounded-xl shadow-lg border border-gray-300 dark:border-gray-600"
              >
                <ul class="py-1">
                  <li
                    class="px-4 py-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600 flex items-center space-x-2"
                  >
                    <input
                      type="checkbox"
                      v-model="locationSelectAll"
                      class="rounded text-blue-600"
                    />
                    <span class="dark:text-white">Select All</span>
                  </li>
                  <li
                    v-for="location in locations"
                    :key="location"
                    class="px-4 py-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600 flex items-center space-x-2"
                  >
                    <input
                      type="checkbox"
                      :value="location"
                      v-model="selectedLocations"
                      class="rounded text-blue-600"
                    />
                    <span class="dark:text-white">{{ location }}</span>
                  </li>
                </ul>
              </div>
            </div>

            <div class="relative" v-click-outside="() => showDepartmentDropdown = false">
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Department Filter</label>
              <button
                @click="showDepartmentDropdown = !showDepartmentDropdown"
                class="w-full rounded-xl shadow-inner border border-gray-300 dark:border-gray-600 dark:bg-gray-700 bg-white dark:text-white text-gray-700 px-4 py-2 text-left flex justify-between items-center"
              >
                <span v-if="selectedDepartments.length === 0">Select departments...</span>
                <span v-else-if="selectedDepartments.length === departments.length">All Departments</span>
                <span v-else>{{ selectedDepartments.length }} selected</span>
                <svg
                  class="h-5 w-5 text-gray-400"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fill-rule="evenodd"
                    d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                    clip-rule="evenodd"
                  />
                </svg>
              </button>
              <div
                v-if="showDepartmentDropdown"
                class="absolute z-10 w-full mt-1 bg-white dark:bg-gray-700 rounded-xl shadow-lg border border-gray-300 dark:border-gray-600"
              >
                <ul class="py-1">
                  <li
                    class="px-4 py-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600 flex items-center space-x-2"
                  >
                    <input
                      type="checkbox"
                      v-model="departmentSelectAll"
                      class="rounded text-blue-600"
                    />
                    <span class="dark:text-white">Select All</span>
                  </li>
                  <li
                    v-for="dept in departments"
                    :key="dept"
                    class="px-4 py-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600 flex items-center space-x-2"
                  >
                    <input
                      type="checkbox"
                      :value="dept"
                      v-model="selectedDepartments"
                      class="rounded text-blue-600"
                    />
                    <span class="dark:text-white">{{ dept }}</span>
                  </li>
                </ul>
              </div>
            </div>

            <div class="relative" v-click-outside="() => showPositionDropdown = false">
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Position Filter</label>
              <button
                @click="showPositionDropdown = !showPositionDropdown"
                class="w-full rounded-xl shadow-inner border border-gray-300 dark:border-gray-600 dark:bg-gray-700 bg-white dark:text-white text-gray-700 px-4 py-2 text-left flex justify-between items-center"
              >
                <span v-if="selectedPositions.length === 0">Select positions...</span>
                <span v-else-if="selectedPositions.length === positions.length">All Positions</span>
                <span v-else>{{ selectedPositions.length }} selected</span>
                <svg
                  class="h-5 w-5 text-gray-400"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fill-rule="evenodd"
                    d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                    clip-rule="evenodd"
                  />
                </svg>
              </button>
              <div
                v-if="showPositionDropdown"
                class="absolute z-10 w-full mt-1 bg-white dark:bg-gray-700 rounded-xl shadow-lg border border-gray-300 dark:border-gray-600"
              >
                <ul class="py-1">
                  <li
                    class="px-4 py-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600 flex items-center space-x-2"
                  >
                    <input
                      type="checkbox"
                      v-model="positionSelectAll"
                      class="rounded text-blue-600"
                    />
                    <span class="dark:text-white">Select All</span>
                  </li>
                  <li
                    v-for="pos in positions"
                    :key="pos"
                    class="px-4 py-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600 flex items-center space-x-2"
                  >
                    <input
                      type="checkbox"
                      :value="pos"
                      v-model="selectedPositions"
                      class="rounded text-blue-600"
                    />
                    <span class="dark:text-white">{{ pos }}</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        
        <div>
          <h3 class="text-lg font-semibold dark:text-white mb-4">Employees</h3>
          <div class="flex justify-between items-center mb-4">
              <div class="relative w-full md:w-64">
                  <input
                    type="text"
                    v-model="employeeSearchTerm"
                    placeholder="Search employees..."
                    class="w-full pl-10 pr-4 py-2 rounded-xl shadow-inner border border-gray-300 dark:border-gray-600 dark:bg-gray-700 bg-white dark:text-white text-gray-700 outline-none"
                  />
                  <svg
                    class="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                      clip-rule="evenodd"
                    />
                  </svg>
              </div>
          </div>
          <div class="overflow-x-auto">
            <table
              class="min-w-full text-left border border-gray-300 dark:border-gray-600 rounded-md overflow-hidden"
            >
              <thead class="bg-gray-100 dark:bg-gray-800 text-sm text-gray-700 dark:text-gray-200">
                <tr>
                  <th class="px-4 py-2">
                    <input type="checkbox" v-model="selectAllEmployees" class="rounded" />
                  </th>
                  <th class="px-4 py-2">Name</th>
                  <th class="px-4 py-2">Department</th>
                  <th class="px-4 py-2">Position</th>
                  <th class="px-4 py-2">Current Shift Schedule</th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="employee in filteredEmployees"
                  :key="employee.id"
                  class="border-t border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200"
                >
                  <td class="px-4 py-2">
                    <input
                      type="checkbox"
                      :value="employee.id"
                      v-model="selectedEmployees"
                      class="rounded"
                    />
                  </td>
                  <td class="px-4 py-2">{{ employee.name }}</td>
                  <td class="px-4 py-2">{{ employee.department }}</td>
                  <td class="px-4 py-2">{{ employee.position }}</td>
                  <td class="px-4 py-2">{{ employee.currentShift }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div
        class="flex justify-end items-center px-6 py-4 border-t border-gray-200 dark:border-gray-700"
      >
        <button
          @click="close"
          class="mr-4 px-4 py-2 rounded-xl border dark:border-gray-600 dark:text-white text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
        >
          Cancel
        </button>
        <button
          @click="saveSchedule"
          class="px-4 py-2 rounded-xl dark:bg-darkGreen bg-pigmentGreen dark:text-white text-white hover:opacity-80 transition-opacity"
        >
          Save Schedule
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Modal transition styles */
.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.3s ease;
}

.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}

.modal-fade-enter-active .rounded-xl,
.modal-fade-leave-active .rounded-xl {
  transition: transform 0.3s ease, opacity 0.3s ease;
}

.modal-fade-enter-from .rounded-xl,
.modal-fade-leave-to .rounded-xl {
  transform: translateY(-20px);
  opacity: 0;
}

/* Custom scrollbar for modal body */
.custom-scrollbar::-webkit-scrollbar {
  width: 8px;
}

.custom-scrollbar::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 10px;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 10px;
}

.dark .custom-scrollbar::-webkit-scrollbar-track {
  background: #2d3748;
}

.dark .custom-scrollbar::-webkit-scrollbar-thumb {
  background: #4a5568;
}
</style>