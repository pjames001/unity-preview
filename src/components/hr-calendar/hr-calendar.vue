<script setup>
import { ref, computed, watch } from 'vue';

// --- Mock Data ---
// A mock list of departments
const mockDepartments = ref([
  { id: 1, name: 'Engineering' },
  { id: 2, name: 'Marketing' },
  { id: 3, name: 'Sales' },
]);

// A mock list of office locations
const mockOfficeLocations = ref([
  { id: 'HQ', name: 'Headquarters' },
  { id: 'BR', name: 'Branch Office' },
  { id: 'RM', name: 'Remote' },
]);

// A mock list of positions
const mockPositions = ref([
  { id: 'Dev', name: 'Software Developer' },
  { id: 'Eng', name: 'Engineering Manager' },
  { id: 'Mkt', name: 'Marketing Specialist' },
  { id: 'Slp', name: 'Salesperson' },
]);

// A mock list of employees assigned to departments, locations, and positions
const mockEmployees = ref([
  { id: 101, name: 'Alice Johnson', departmentId: 1, officeLocationId: 'HQ', positionId: 'Eng' },
  { id: 102, name: 'Bob Smith', departmentId: 1, officeLocationId: 'BR', positionId: 'Dev' },
  { id: 103, name: 'Charlie Brown', departmentId: 2, officeLocationId: 'HQ', positionId: 'Mkt' },
  { id: 104, name: 'Diana Prince', departmentId: 2, officeLocationId: 'RM', positionId: 'Mkt' },
  { id: 105, name: 'Eve Adams', departmentId: 3, officeLocationId: 'BR', positionId: 'Slp' },
  { id: 106, name: 'Frank Lee', departmentId: 3, officeLocationId: 'HQ', positionId: 'Slp' },
]);

// A mock database of employee shifts with a unified structure.
const mockShifts = ref([
  // Alice's weekly shifts are now adjusted for the night view
  { employeeId: 101, date: '2025-08-11', shiftType: 'Default', startTime: '21:00', endTime: '05:00', breaks: [
    { type: 'Break', startTime: '23:00', endTime: '23:15' },
    { type: 'Lunch', startTime: '01:00', endTime: '01:30' },
    { type: 'Break', startTime: '03:00', endTime: '03:15' },
  ] },
  { employeeId: 101, date: '2025-08-12', shiftType: 'Default', startTime: '21:00', endTime: '05:00', breaks: [
    { type: 'Break', startTime: '23:00', endTime: '23:15' },
    { type: 'Lunch', startTime: '01:00', endTime: '01:30' },
    { type: 'Break', startTime: '03:00', endTime: '03:15' },
  ] },
  { employeeId: 101, date: '2025-08-13', shiftType: 'Default', startTime: '21:00', endTime: '05:00', breaks: [
    { type: 'Break', startTime: '23:00', endTime: '23:15' },
    { type: 'Lunch', startTime: '01:00', endTime: '01:30' },
    { type: 'Break', startTime: '03:00', endTime: '03:15' },
  ] },
  { employeeId: 101, date: '2025-08-14', shiftType: 'Default', startTime: '21:00', endTime: '05:00', breaks: [
    { type: 'Break', startTime: '23:00', endTime: '23:15' },
    { type: 'Lunch', startTime: '01:00', endTime: '01:30' },
    { type: 'Break', startTime: '03:00', endTime: '03:15' },
  ] },
  { employeeId: 101, date: '2025-08-15', shiftType: 'Default', startTime: '21:00', endTime: '05:00', breaks: [
    { type: 'Break', startTime: '23:00', endTime: '23:15' },
    { type: 'Lunch', startTime: '01:00', endTime: '01:30' },
    { type: 'Break', startTime: '03:00', endTime: '03:15' },
  ] },
  { employeeId: 101, date: '2025-08-16', shiftType: 'Default', startTime: '21:00', endTime: '05:00', breaks: [
    { type: 'Break', startTime: '23:00', endTime: '23:15' },
    { type: 'Lunch', startTime: '01:00', endTime: '01:30' },
    { type: 'Break', startTime: '03:00', endTime: '03:15' },
  ] },
  { employeeId: 101, date: '2025-08-17', shiftType: 'Default', startTime: '21:00', endTime: '05:00', breaks: [
    { type: 'Break', startTime: '23:00', endTime: '23:15' },
    { type: 'Lunch', startTime: '01:00', endTime: '01:30' },
    { type: 'Break', startTime: '03:00', endTime: '03:15' },
  ] },
  
  // Bob's weekly shifts are also adjusted for the night view
  { employeeId: 102, date: '2025-08-11', shiftType: 'Late', startTime: '20:00', endTime: '04:00', breaks: [
    { type: 'Break', startTime: '22:00', endTime: '22:15' },
    { type: 'Lunch', startTime: '00:00', endTime: '00:30' },
    { type: 'Break', startTime: '02:00', endTime: '02:15' },
  ] },
  { employeeId: 102, date: '2025-08-12', shiftType: 'Late', startTime: '20:00', endTime: '04:00', breaks: [
    { type: 'Break', startTime: '22:00', endTime: '22:15' },
    { type: 'Lunch', startTime: '00:00', endTime: '00:30' },
    { type: 'Break', startTime: '02:00', endTime: '02:15' },
  ] },
  { employeeId: 102, date: '2025-08-13', shiftType: 'Late', startTime: '20:00', endTime: '04:00', breaks: [
    { type: 'Break', startTime: '22:00', endTime: '22:15' },
    { type: 'Lunch', startTime: '00:00', endTime: '00:30' },
    { type: 'Break', startTime: '02:00', endTime: '02:15' },
  ] },
  { employeeId: 102, date: '2025-08-14', shiftType: 'Late', startTime: '20:00', endTime: '04:00', breaks: [
    { type: 'Break', startTime: '22:00', endTime: '22:15' },
    { type: 'Lunch', startTime: '00:00', endTime: '00:30' },
    { type: 'Break', startTime: '02:00', endTime: '02:15' },
  ] },
  { employeeId: 102, date: '2025-08-15', shiftType: 'Late', startTime: '20:00', endTime: '04:00', breaks: [
    { type: 'Break', startTime: '22:00', endTime: '22:15' },
    { type: 'Lunch', startTime: '00:00', endTime: '00:30' },
    { type: 'Break', startTime: '02:00', endTime: '02:15' },
  ] },

  // Daily shifts with breaks for various employees and dates (unchanged)
  { employeeId: 103, date: '2025-08-11', shiftType: 'Night', startTime: '20:00', endTime: '04:00', breaks: [
    { type: 'Break', startTime: '22:00', endTime: '22:15' },
    { type: 'Lunch', startTime: '00:00', endTime: '00:30' },
    { type: 'Break', startTime: '02:00', endTime: '02:15' },
  ]},
  { employeeId: 104, date: '2025-08-11', shiftType: 'Overnight', startTime: '22:00', endTime: '05:00', breaks: [
    { type: 'Break', startTime: '00:00', endTime: '00:15' },
    { type: 'Lunch', startTime: '02:00', endTime: '02:30' },
    { type: 'Break', startTime: '04:00', endTime: '04:15' },
  ]},
  { employeeId: 105, date: '2025-08-11', shiftType: 'Evening', startTime: '18:00', endTime: '22:00', breaks: [
    { type: 'Break', startTime: '20:00', endTime: '20:15' },
  ]},
  { employeeId: 106, date: '2025-08-11', shiftType: 'Default', startTime: '08:00', endTime: '16:00', breaks: [
    { type: 'Break', startTime: '10:00', endTime: '10:15' },
    { type: 'Lunch', startTime: '12:00', endTime: '12:30' },
  ]},
]);


// --- Component State ---
const currentView = ref('weekly'); // 'weekly' or 'daily'

// Multi-select dropdown state
const selectedDepartments = ref(mockDepartments.value.map(d => d.id)); // Default to ALL departments
const selectedOfficeLocations = ref(mockOfficeLocations.value.map(l => l.id)); // Default to ALL locations
const selectedPositions = ref(mockPositions.value.map(p => p.id)); // Default to ALL positions
const selectedEmployees = ref([]);
const showDepartmentsDropdown = ref(false);
const showOfficeLocationsDropdown = ref(false);
const showPositionsDropdown = ref(false);
const showEmployeesDropdown = ref(false);

// Date picker state
const weeklyStartDate = ref('2025-08-11');
const weeklyEndDate = ref('2025-08-17');
const dailyDate = ref('2025-08-11');

// --- Helper Functions ---
/**
 * Generates an array of Date objects for a given date range.
 * @param {string} startDateString - The start date in 'YYYY-MM-DD' format.
 * @param {string} endDateString - The end date in 'YYYY-MM-DD' format.
 * @returns {Date[]} An array of Date objects for the days in the range.
 */
const getDateRange = (startDateString, endDateString) => {
  const dates = [];
  let currentDate = new Date(startDateString + 'T00:00:00Z');
  const endDate = new Date(endDateString + 'T00:00:00Z');

  while (currentDate <= endDate) {
    dates.push(new Date(currentDate));
    currentDate.setUTCDate(currentDate.getUTCDate() + 1);
  }
  return dates;
};

/**
 * Formats a Date object to a 'YYYY-MM-DD' string.
 * @param {Date} date - The Date object.
 * @returns {string} The formatted date string.
 */
const formatDate = (date) => {
  const y = date.getUTCFullYear();
  const m = String(date.getUTCMonth() + 1).padStart(2, '0');
  const d = String(date.getUTCDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
};

/**
 * Checks if a given date is a weekend (Saturday or Sunday).
 * @param {Date} date - The Date object.
 * @returns {boolean} True if the date is a weekend, false otherwise.
 */
const isWeekend = (date) => {
  const day = new Date(date).getUTCDay();
  return day === 0 || day === 6;
};

// Get the date range for the weekly view
const dateRange = computed(() => getDateRange(weeklyStartDate.value, weeklyEndDate.value));

// Define the start and end of the daily timeline in military time (e.g., 18 for 6 PM, 30 for 6 AM the next day)
const timelineStartHour = 18;
const timelineEndHour = 30; // 6 AM of the next day (24 + 6)
const totalTimelineHours = timelineEndHour - timelineStartHour;

/**
 * Converts a time string (HH:MM) to a minute value relative to a reference hour.
 * Accounts for times crossing midnight.
 * @param {string} timeString - The time string (e.g., '20:30').
 * @param {number} referenceHour - The reference hour (e.g., 18 for 6 PM).
 * @returns {number} The total minutes from the reference hour.
 */
const convertToTimelineMinutes = (timeString, referenceHour) => {
  const [hour, minute] = timeString.split(':').map(Number);
  let totalHours = hour;
  if (hour < referenceHour) {
    totalHours += 24; // Handle times that cross midnight
  }
  return (totalHours - referenceHour) * 60 + minute;
};

// --- Computed Properties for filtering and display ---
// Filtered employees based on department, office, and position selections
const filteredEmployees = computed(() => {
  return mockEmployees.value.filter(employee => {
    // Check if the employee's department is in the selected departments list
    const isDepartmentMatch = selectedDepartments.value.includes(employee.departmentId);
    
    // Check if the employee's office location is in the selected locations list
    const isLocationMatch = selectedOfficeLocations.value.includes(employee.officeLocationId);

    // Check if the employee's position is in the selected positions list
    const isPositionMatch = selectedPositions.value.includes(employee.positionId);

    return isDepartmentMatch && isLocationMatch && isPositionMatch;
  });
});

// Final list of employees to display based on department, location, position, and individual employee filters
const displayedEmployees = computed(() => {
  // If no employees are explicitly selected, show all filtered employees
  if (selectedEmployees.value.length === 0) {
    return filteredEmployees.value;
  }
  return filteredEmployees.value.filter(employee =>
    selectedEmployees.value.includes(employee.id)
  );
});

// A function to find a shift for a given employee and date
const findShift = (employeeId, date) => {
  const dateString = formatDate(date);
  return mockShifts.value.find(shift =>
    shift.employeeId === employeeId && shift.date === dateString
  );
};

// A function to calculate the position and width of a shift bar
const getShiftBarStyles = (shift) => {
  if (!shift) return {};

  const shiftStartMinutes = convertToTimelineMinutes(shift.startTime, timelineStartHour);
  const shiftEndMinutes = convertToTimelineMinutes(shift.endTime, timelineStartHour);
  const totalTimelineMinutes = totalTimelineHours * 60;

  const left = (shiftStartMinutes / totalTimelineMinutes) * 100;
  const width = ((shiftEndMinutes - shiftStartMinutes) / totalTimelineMinutes) * 100;

  return {
    left: `${left}%`,
    width: `${width}%`,
  };
};

// A function to calculate the position and width of a break bar
const getBreakBarStyles = (shift, breakItem) => {
  const shiftStartMinutes = convertToTimelineMinutes(shift.startTime, timelineStartHour);
  const breakStartMinutes = convertToTimelineMinutes(breakItem.startTime, timelineStartHour);
  const breakEndMinutes = convertToTimelineMinutes(breakItem.endTime, timelineStartHour);
  
  const totalShiftMinutes = convertToTimelineMinutes(shift.endTime, timelineStartHour) - shiftStartMinutes;

  if (totalShiftMinutes <= 0) { // Avoid division by zero for zero-length shifts
    return {};
  }

  const left = ((breakStartMinutes - shiftStartMinutes) / totalShiftMinutes) * 100;
  const width = ((breakEndMinutes - breakStartMinutes) / totalShiftMinutes) * 100;

  return {
    left: `${left}%`,
    width: `${width}%`,
  };
};

// Clear employee selections when other filters change to avoid showing empty results
watch([selectedDepartments, selectedOfficeLocations, selectedPositions], () => {
  selectedEmployees.value = [];
});
</script>

<template>
  <main class="view min-h-screen p-4 md:p-8 dark:bg-gray-900 bg-gray-100 text-gray-800 dark:text-gray-200 transition-colors duration-300">
    <div class="max-w-[1700px] mx-auto">
      <!-- Header: View Switcher Buttons -->
      <div class="flex justify-center mb-6">
        <button
          @click="currentView = 'weekly'"
          :class="{
            'bg-gray-300 dark:bg-gray-700 font-semibold': currentView === 'weekly',
            'hover:bg-gray-200 dark:hover:bg-gray-800': currentView !== 'weekly'
          }"
          class="px-4 py-2 rounded-l-lg shadow-inner-sm transition-colors duration-200"
        >
          Weekly View
        </button>
        <button
          @click="currentView = 'daily'"
          :class="{
            'bg-gray-300 dark:bg-gray-700 font-semibold': currentView === 'daily',
            'hover:bg-gray-200 dark:hover:bg-gray-800': currentView !== 'daily'
          }"
          class="px-4 py-2 rounded-r-lg shadow-inner-sm transition-colors duration-200"
        >
          Daily View
        </button>
      </div>

      <!-- Filters & Date Pickers Section -->
      <div class="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md transition-colors duration-300 mb-6">
        <h2 class="text-xl font-bold mb-4">Filters</h2>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <!-- Departments Custom Dropdown -->
          <div class="relative">
            <label class="block text-sm font-medium mb-1">Departments</label>
            <div
              @click="showDepartmentsDropdown = !showDepartmentsDropdown"
              class="relative w-full cursor-pointer rounded-md shadow-sm border border-gray-300 dark:border-gray-600 dark:bg-gray-700 px-3 py-2 text-sm focus:ring-blue-500 focus:border-blue-500 flex justify-between items-center"
            >
              <span>
                {{ selectedDepartments.length === 0 ? 'Select departments' : `${selectedDepartments.length} selected` }}
              </span>
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd" />
              </svg>
            </div>
            <ul v-if="showDepartmentsDropdown" class="absolute z-20 w-full mt-1 bg-white dark:bg-gray-700 rounded-md shadow-lg border border-gray-300 dark:border-gray-600 max-h-40 overflow-y-auto">
              <li
                v-for="dept in mockDepartments"
                :key="dept.id"
                class="px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-600 cursor-pointer flex items-center"
              >
                <input
                  type="checkbox"
                  :value="dept.id"
                  v-model="selectedDepartments"
                  class="mr-2 rounded text-blue-500"
                >
                <label>{{ dept.name }}</label>
              </li>
            </ul>
          </div>

          <!-- Office Locations Custom Dropdown -->
          <div class="relative">
            <label class="block text-sm font-medium mb-1">Office Locations</label>
            <div
              @click="showOfficeLocationsDropdown = !showOfficeLocationsDropdown"
              class="relative w-full cursor-pointer rounded-md shadow-sm border border-gray-300 dark:border-gray-600 dark:bg-gray-700 px-3 py-2 text-sm focus:ring-blue-500 focus:border-blue-500 flex justify-between items-center"
            >
              <span>
                {{ selectedOfficeLocations.length === 0 ? 'Select locations' : `${selectedOfficeLocations.length} selected` }}
              </span>
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd" />
              </svg>
            </div>
            <ul v-if="showOfficeLocationsDropdown" class="absolute z-20 w-full mt-1 bg-white dark:bg-gray-700 rounded-md shadow-lg border border-gray-300 dark:border-gray-600 max-h-40 overflow-y-auto">
              <li
                v-for="loc in mockOfficeLocations"
                :key="loc.id"
                class="px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-600 cursor-pointer flex items-center"
              >
                <input
                  type="checkbox"
                  :value="loc.id"
                  v-model="selectedOfficeLocations"
                  class="mr-2 rounded text-blue-500"
                >
                <label>{{ loc.name }}</label>
              </li>
            </ul>
          </div>

          <!-- Positions Custom Dropdown -->
          <div class="relative">
            <label class="block text-sm font-medium mb-1">Positions</label>
            <div
              @click="showPositionsDropdown = !showPositionsDropdown"
              class="relative w-full cursor-pointer rounded-md shadow-sm border border-gray-300 dark:border-gray-600 dark:bg-gray-700 px-3 py-2 text-sm focus:ring-blue-500 focus:border-blue-500 flex justify-between items-center"
            >
              <span>
                {{ selectedPositions.length === 0 ? 'Select positions' : `${selectedPositions.length} selected` }}
              </span>
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd" />
              </svg>
            </div>
            <ul v-if="showPositionsDropdown" class="absolute z-20 w-full mt-1 bg-white dark:bg-gray-700 rounded-md shadow-lg border border-gray-300 dark:border-gray-600 max-h-40 overflow-y-auto">
              <li
                v-for="pos in mockPositions"
                :key="pos.id"
                class="px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-600 cursor-pointer flex items-center"
              >
                <input
                  type="checkbox"
                  :value="pos.id"
                  v-model="selectedPositions"
                  class="mr-2 rounded text-blue-500"
                >
                <label>{{ pos.name }}</label>
              </li>
            </ul>
          </div>
          
          <!-- Employees Custom Dropdown -->
          <div class="relative">
            <label class="block text-sm font-medium mb-1">Employees</label>
            <div
              @click="showEmployeesDropdown = !showEmployeesDropdown"
              class="relative w-full cursor-pointer rounded-md shadow-sm border border-gray-300 dark:border-gray-600 dark:bg-gray-700 px-3 py-2 text-sm focus:ring-blue-500 focus:border-blue-500 flex justify-between items-center"
            >
              <span>
                {{ selectedEmployees.length === 0 ? 'Select employees' : `${selectedEmployees.length} selected` }}
              </span>
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd" />
              </svg>
            </div>
            <ul v-if="showEmployeesDropdown" class="absolute z-20 w-full mt-1 bg-white dark:bg-gray-700 rounded-md shadow-lg border border-gray-300 dark:border-gray-600 max-h-40 overflow-y-auto">
              <li
                v-for="emp in filteredEmployees"
                :key="emp.id"
                class="px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-600 cursor-pointer flex items-center"
              >
                <input
                  type="checkbox"
                  :value="emp.id"
                  v-model="selectedEmployees"
                  class="mr-2 rounded text-blue-500"
                >
                <label>{{ emp.name }}</label>
              </li>
            </ul>
          </div>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
          <!-- Weekly Date Pickers -->
          <Transition name="fade-slide">
            <template v-if="currentView === 'weekly'">
              <div class="contents">
                <div>
                  <label for="weekly-start" class="block text-sm font-medium mb-1">Start Date</label>
                  <input type="date" id="weekly-start" v-model="weeklyStartDate" class="w-full rounded-md shadow-sm border border-gray-300 dark:border-gray-600 dark:bg-gray-700 px-3 py-2 text-sm">
                </div>
                <div>
                  <label for="weekly-end" class="block text-sm font-medium mb-1">End Date</label>
                  <input type="date" id="weekly-end" v-model="weeklyEndDate" class="w-full rounded-md shadow-sm border border-gray-300 dark:border-gray-600 dark:bg-gray-700 px-3 py-2 text-sm">
                </div>
              </div>
            </template>
          </Transition>

          <!-- Daily Date Picker -->
          <Transition name="fade-slide">
            <template v-if="currentView === 'daily'">
              <div class="contents">
                <div>
                  <label for="daily-date" class="block text-sm font-medium mb-1">Date</label>
                  <input type="date" id="daily-date" v-model="dailyDate" class="w-full rounded-md shadow-sm border border-gray-300 dark:border-gray-600 dark:bg-gray-700 px-3 py-2 text-sm">
                </div>
              </div>
            </template>
          </Transition>
        </div>
      </div>

      <!-- Calendar Content -->
      <Transition name="slide-fade" mode="out-in">
        <!-- Weekly View -->
        <div v-if="currentView === 'weekly'" key="weekly" class="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 overflow-x-auto transition-colors duration-300">
          <table class="w-full border-collapse">
            <thead>
              <tr class="text-sm font-medium bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-200">
                <th class="sticky left-0 bg-gray-50 dark:bg-gray-700 z-10 p-3 text-left w-40 min-w-[160px] border-b border-r border-gray-200 dark:border-gray-600">Employee</th>
                <th v-for="day in dateRange" :key="day.toDateString()" 
                    :class="{'bg-red-50 dark:bg-red-950 text-red-700 dark:text-red-300': isWeekend(day)}"
                    class="p-3 text-center border-b border-r last:border-r-0 border-gray-200 dark:border-gray-600">
                  <!-- The 'timeZone' option ensures the displayed date matches the selected UTC date -->
                  {{ day.toLocaleString('en-US', { weekday: 'short', month: 'numeric', day: 'numeric', timeZone: 'UTC' }) }}
                </th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="employee in displayedEmployees" :key="employee.id" 
                  class="border-b border-gray-200 dark:border-gray-700 last:border-b-0">
                <td class="sticky left-0 bg-white dark:bg-gray-800 p-3 text-left text-sm font-medium border-r border-gray-200 dark:border-gray-600">
                  {{ employee.name }}
                </td>
                <td v-for="day in dateRange" :key="day.toDateString()" 
                    class="p-3 text-center text-xs border-r last:border-r-0 border-gray-200 dark:border-gray-600">
                  <div class="flex flex-col items-center justify-center">
                    <template v-if="findShift(employee.id, day)">
                      <span class="font-semibold text-green-600 dark:text-green-400">
                        {{ findShift(employee.id, day).shiftType }}
                      </span>
                      <span class="text-gray-500 dark:text-gray-400">
                        {{ findShift(employee.id, day).startTime }} - {{ findShift(employee.id, day).endTime }}
                      </span>
                    </template>
                    <span v-else class="text-gray-400 dark:text-gray-600">-</span>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Daily View -->
        <div v-else-if="currentView === 'daily'" key="daily" class="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 overflow-x-auto transition-colors duration-300">
          <h3 class="text-lg font-semibold mb-4 text-center">
            Shifts for {{ new Date(dailyDate + 'T00:00:00Z').toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC' }) }}
          </h3>
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
            <div v-for="employee in displayedEmployees" :key="employee.id" class="flex items-center">
              <!-- Combined employee name and shift type section -->
              <div class="w-40 text-sm text-left pr-4 flex-shrink-0">
                <span class="font-medium block">{{ employee.name }}</span>
                <span v-if="findShift(employee.id, new Date(dailyDate + 'T00:00:00Z'))" 
                      class="text-xs text-gray-500 dark:text-gray-400 block">
                  ({{ findShift(employee.id, new Date(dailyDate + 'T00:00:00Z')).shiftType }})
                </span>
              </div>
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
                
                <template v-if="findShift(employee.id, new Date(dailyDate + 'T00:00:00Z'))">
                  <!-- Shift Bar -->
                  <div
                    :style="getShiftBarStyles(findShift(employee.id, new Date(dailyDate + 'T00:00:00Z')))"
                    class="absolute h-full rounded-md shadow-sm flex items-center justify-center p-1 text-xs text-white z-10 bg-green-500"
                  >
                    <!-- Breaks within the shift bar -->
                    <div v-if="findShift(employee.id, new Date(dailyDate + 'T00:00:00Z')).breaks.length > 0" class="absolute inset-0 flex items-center">
                      <div
                        v-for="(breakItem, index) in findShift(employee.id, new Date(dailyDate + 'T00:00:00Z')).breaks"
                        :key="index"
                        :style="getBreakBarStyles(findShift(employee.id, new Date(dailyDate + 'T00:00:00Z')), breakItem)"
                        class="absolute h-4/5 rounded-sm bg-gray-600 dark:bg-gray-300 flex items-center justify-center text-[10px] dark:text-black text-white"
                      >
                        {{ breakItem.type }}
                      </div>
                    </div>
                  </div>
                </template>
                <div v-else class="text-gray-400 dark:text-gray-600 text-sm text-center w-full mt-1">No shift</div>
              </div>
            </div>
          </div>
        </div>
      </Transition>
    </div>
  </main>
</template>

<style scoped>
/* Scoped styles for the component */
.slide-fade-enter-active,
.slide-fade-leave-active {
  transition: all 0.3s ease-out;
}

.slide-fade-enter-from,
.slide-fade-leave-to {
  transform: translateX(20px);
  opacity: 0;
}

.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: all 0.3s ease;
}

.fade-slide-enter-from,
.fade-slide-leave-to {
  transform: translateY(-10px);
  opacity: 0;
}
</style>
