<script setup>
import { ref, computed } from 'vue';
// The BulkAssignModal component is imported from a separate file.
import BulkAssign from '../components/week-schedule/BulkAssign.vue';

// --- Main Component Setup ---
const teamName = "Lebanon Team";

// Break types with colors for visual distinction
const breakTypes = [
  { id: "short1", name: "Short Break (15 min)", color: "#fbbf24", paid: true },
  { id: "lunch", name: "Lunch Break (30 min)", color: "#f87171", paid: false },
  { id: "short2", name: "Short Break (15 min)", color: "#60a5fa", paid: true },
];

// Employee data with shifts and breaks
const employees = ref([
  {
    id: 1,
    name: "John Doe",
    shiftStart: "18:30",
    shiftEnd: "02:30",
    breaks: [
      { type: "short1", start: "21:00", end: "21:15" },
      { type: "lunch", start: "22:00", end: "22:30" }
    ]
  },
  {
    id: 2,
    name: "Jane Smith",
    shiftStart: "19:00",
    shiftEnd: "03:30",
    breaks: [
      { type: "lunch", start: "22:30", end: "23:00" }
    ]
  },
  {
    id: 3,
    name: "Mark Brown",
    shiftStart: "18:00",
    shiftEnd: "00:30",
    breaks: []
  }
]);

// --- Timeline Configuration ---
const timelineStartHour = 18; // 6:00 PM
const timelineEndHour = 30;   // 6:00 AM of the next day (24 + 6)
const totalTimelineHours = timelineEndHour - timelineStartHour;
const totalTimelineMinutes = totalTimelineHours * 60;

// State for showing/hiding break details and the modal
const showBreaksFor = ref(null);
const showBulkAssignModal = ref(false);

// --- Helper Functions ---

/**
 * Converts a time string (HH:MM) to total minutes from a given reference hour.
 * Accounts for times crossing midnight.
 * @param {string} timeString - The time string (e.g., '20:30').
 * @param {number} referenceHour - The reference hour (e.g., 18 for 6 PM).
 * @returns {number} The total minutes from the reference hour.
 */
function toMinutesFromReference(timeString, referenceHour) {
  const [hour, minute] = timeString.split(':').map(Number);
  let totalHours = hour;
  if (hour < referenceHour) {
    totalHours += 24; // Handle times that cross midnight
  }
  return (totalHours - referenceHour) * 60 + minute;
}

/**
 * Calculates the total duration of a shift in minutes.
 * @param {string} start - Start time (HH:mm).
 * @param {string} end - End time (HH:mm).
 * @returns {number} The duration in minutes.
 */
function getShiftDurationInMinutes(start, end) {
  let startMin = toMinutesFromReference(start, 0);
  let endMin = toMinutesFromReference(end, 0);
  if (endMin <= startMin) {
    endMin += 24 * 60;
  }
  return endMin - startMin;
}

// --- Computed Properties for Display ---

/**
 * Calculates the CSS styles for a shift bar's position and width.
 * @param {object} employee - The employee object.
 * @returns {object} An object with CSS styles.
 */
const getShiftBarStyles = (employee) => {
  const startMinutes = toMinutesFromReference(employee.shiftStart, timelineStartHour);
  const durationMinutes = getShiftDurationInMinutes(employee.shiftStart, employee.shiftEnd);

  const left = (startMinutes / totalTimelineMinutes) * 100;
  const width = (durationMinutes / totalTimelineMinutes) * 100;
  
  return {
    left: `${left}%`,
    width: `${width}%`,
  };
};

/**
 * Calculates the CSS styles for a break bar's position and width.
 * @param {object} employee - The employee object.
 * @param {object} breakItem - The break item object.
 * @returns {object} An object with CSS styles.
 */
const getBreakBarStyles = (employee, breakItem) => {
  const shiftStartMinutes = toMinutesFromReference(employee.shiftStart, timelineStartHour);
  const breakStartMinutes = toMinutesFromReference(breakItem.start, timelineStartHour);
  const breakEndMinutes = toMinutesFromReference(breakItem.end, timelineStartHour);
  
  const totalShiftMinutes = getShiftDurationInMinutes(employee.shiftStart, employee.shiftEnd);

  if (totalShiftMinutes <= 0) {
    return {};
  }

  const left = ((breakStartMinutes - shiftStartMinutes) / totalShiftMinutes) * 100;
  const width = ((breakEndMinutes - breakStartMinutes) / totalShiftMinutes) * 100;
  
  return {
    left: `${left}%`,
    width: `${width}%`,
  };
};

/**
 * Finds a break type object by its ID.
 * @param {string} id - The ID of the break type.
 * @returns {object | undefined} The break type object.
 */
function getBreakType(id) {
  return breakTypes.find(b => b.id === id);
}

/**
 * Toggles the visibility of an employee's break details.
 * @param {number} id - The ID of the employee.
 */
function toggleBreaks(id) {
  showBreaksFor.value = showBreaksFor.value === id ? null : id;
}

/**
 * Handles the 'assign' event from the BulkAssignModal.
 * @param {object} data - The data from the modal, including employees and break data.
 */
function handleBulkAssign(data) {
  const { employees: selectedEmployeeIds, breakData } = data;
  
  employees.value = employees.value.map(employee => {
    if (selectedEmployeeIds.includes(employee.id)) {
      // Check if this break already exists for the employee to avoid duplicates
      const exists = employee.breaks.some(
        br => br.type === breakData.type && br.start === breakData.start
      );
      if (!exists) {
        employee.breaks.push(breakData);
      }
    }
    return employee;
  });

  // Close the modal after assignment
  showBulkAssignModal.value = false;
}
</script>

<template>
  <main class="view min-h-screen p-4 md:p-8 dark:bg-gray-900 bg-gray-100 text-gray-800 dark:text-gray-200 transition-colors duration-300">
    <div class="max-w-[1700px] mx-auto">
      <!-- Header Section -->
      <div class="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md transition-colors duration-300 mb-6">
        <h2 class="text-xl font-bold mb-4">{{ teamName }}</h2>
        <div class="flex flex-wrap items-center gap-4 mb-3">
          <div v-for="breakType in breakTypes" :key="breakType.id" class="flex items-center space-x-2">
            <span :style="{ backgroundColor: breakType.color }" class="w-5 h-5 rounded-md"></span>
            <span class="text-sm text-gray-700 dark:text-gray-300">{{ breakType.name }} — <em>{{ breakType.paid ? 'Paid' : 'Unpaid' }}</em></span>
          </div>
        </div>
        <div class="flex items-center space-x-6">
          <div class="text-gray-800 dark:text-gray-200 font-semibold">
            Employees: {{ employees.length }}
          </div>
          <button @click="showBulkAssignModal = true" class="px-4 py-2 bg-green-600 text-white rounded-lg shadow-sm hover:bg-green-700 transition">Bulk Assign</button>
          <button class="px-4 py-2 bg-blue-600 text-white rounded-lg shadow-sm hover:bg-blue-700 transition">Save Breaks</button>
        </div>
      </div>

      <!-- Schedule Content -->
      <div class="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 overflow-x-auto transition-colors duration-300">
        <!-- Timeline Header -->
        <div class="flex items-center text-gray-500 dark:text-gray-400 text-xs mb-2 pl-40 border-b border-gray-200 dark:border-gray-600">
          <div class="relative w-full flex-grow h-6">
            <div class="absolute inset-0 flex">
              <span
                v-for="i in totalTimelineHours"
                :key="i"
                class="flex-1 text-center border-r border-gray-300 dark:border-gray-600 last:border-r-0"
              >
                {{ (timelineStartHour + i - 1) % 24 }}:00
              </span>
            </div>
          </div>
        </div>
        
        <!-- Employee Shift Rows -->
        <div class="space-y-4">
          <div v-for="employee in employees" :key="employee.id">
            <div class="flex items-center">
              <!-- Employee Name and Toggle -->
              <div class="w-40 text-sm text-left pr-4 flex-shrink-0 flex items-center justify-between">
                <span class="font-medium block">{{ employee.name }}</span>
                <button
                  @click="toggleBreaks(employee.id)"
                  class="ml-2 p-1 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 focus:outline-none transition-colors duration-200"
                  :aria-expanded="showBreaksFor === employee.id"
                  :aria-controls="'breaks-' + employee.id"
                  title="Toggle breaks"
                >
                  <svg
                    :class="{'rotate-90': showBreaksFor === employee.id}"
                    class="h-4 w-4 text-gray-600 dark:text-gray-300 transition-transform duration-200"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>

              <!-- Shift and Break Timeline -->
              <div class="relative flex-1 bg-gray-200 dark:bg-gray-700 rounded-md h-8 overflow-hidden">
                <!-- Half-hour separators -->
                <div class="absolute inset-0 grid grid-cols-[repeat(24,minmax(0,1fr))] grid-rows-1 z-0">
                  <div v-for="i in totalTimelineHours * 2" :key="i"
                      :class="{
                        'border-r': (i-1) % 2 === 0,
                        'border-dotted': (i-1) % 2 !== 0,
                        'border-gray-300 dark:border-gray-600': true
                      }">
                  </div>
                </div>
                
                <template v-if="employee.shiftStart && employee.shiftEnd">
                  <!-- Shift Bar -->
                  <div
                    :style="getShiftBarStyles(employee)"
                    class="absolute h-full rounded-md shadow-sm flex items-center justify-center p-1 text-xs text-white z-10 bg-green-500"
                  >
                    <!-- Breaks within the shift bar -->
                    <div v-if="employee.breaks.length > 0" class="absolute inset-0 flex items-center">
                      <div
                        v-for="(breakItem, index) in employee.breaks"
                        :key="index"
                        :style="{...getBreakBarStyles(employee, breakItem), backgroundColor: getBreakType(breakItem.type)?.color || '#f87171'}"
                        class="absolute h-4/5 rounded-lg flex items-center justify-center text-[10px] dark:text-black text-white"
                        :title="getBreakType(breakItem.type)?.name + ' (' + breakItem.start + ' - ' + breakItem.end + ')'"
                      >
                        {{ breakItem.type.substring(0,5) }}
                      </div>
                    </div>
                  </div>
                </template>
                <div v-else class="text-gray-400 dark:text-gray-600 text-sm text-center w-full mt-1">No shift</div>
              </div>
            </div>

            <!-- Breaks Dropdown Section -->
            <Transition name="fade-slide">
              <div
                v-if="showBreaksFor === employee.id"
                class="mt-2 ml-40 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg shadow-inner text-sm text-gray-700 dark:text-gray-300"
                :id="'breaks-' + employee.id"
              >
                <div v-if="employee.breaks.length === 0" class="italic text-gray-500 dark:text-gray-400">No breaks assigned.</div>
                <ul v-else class="list-disc pl-5 space-y-1">
                  <li v-for="br in employee.breaks" :key="br.type + br.start">
                    <span class="font-bold">{{ getBreakType(br.type)?.name || br.type }}</span>:
                    {{ br.start }} - {{ br.end }}
                  </li>
                </ul>
              </div>
            </Transition>
          </div>
        </div>
      </div>

      <!-- Bulk Assign Modal -->
       <Transition name="modal-fade">
         <BulkAssign
           v-if="showBulkAssignModal"
           :employees="employees"
           :breakTypes="breakTypes"
           @close="showBulkAssignModal = false"
           @assign="handleBulkAssign"
         />
       </Transition>
    </div>
  </main>
</template>
