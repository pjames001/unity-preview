<script setup>
import { ref, computed, watch } from 'vue';
import AddWeeklySchedule from '../components/week-schedule/AddWeeklySchedule.vue';
import EditWeeklySchedule from '../components/week-schedule/EditWeeklySchedule.vue';

// --- State: Mock Data ---
const mockDepartments = ref([
  { id: 1, name: 'Engineering' },
  { id: 2, name: 'Marketing' },
  { id: 3, name: 'Sales' },
]);
const mockOfficeLocations = ref([
  { id: 'HQ', name: 'Headquarters' },
  { id: 'BR', name: 'Branch Office' },
  { id: 'RM', name: 'Remote' },
]);
const mockPositions = ref([
  { id: 'Dev', name: 'Software Developer' },
  { id: 'Eng', name: 'Engineering Manager' },
  { id: 'Mkt', name: 'Marketing Specialist' },
  { id: 'Slp', name: 'Salesperson' },
]);
const mockScheduleTemplates = ref([
  {
    id: 1, name: 'Standard 9-5 Shift', color: '#34d399',
    weeklySchedule: [
      { day: 'Monday', scheduleType: 'Default Shift', clockIn: '09:00', clockOut: '17:00',
        breaks: [
          { type: 'Short Break', startTime: '10:45', endTime: '11:00' },
          { type: 'Lunch', startTime: '13:00', endTime: '13:30' },
          { type: 'Short Break', startTime: '15:15', endTime: '15:30' }
        ]
      },
      { day: 'Tuesday', scheduleType: 'Default Shift', clockIn: '09:00', clockOut: '17:00',
        breaks: [
          { type: 'Short Break', startTime: '10:45', endTime: '11:00' },
          { type: 'Lunch', startTime: '13:00', endTime: '13:30' },
          { type: 'Short Break', startTime: '15:15', endTime: '15:30' }
        ]
      },
      { day: 'Wednesday', scheduleType: 'Default Shift', clockIn: '09:00', clockOut: '17:00',
        breaks: [
          { type: 'Short Break', startTime: '10:45', endTime: '11:00' },
          { type: 'Lunch', startTime: '13:00', endTime: '13:30' },
          { type: 'Short Break', startTime: '15:15', endTime: '15:30' }
        ]
      },
      { day: 'Thursday', scheduleType: 'Default Shift', clockIn: '09:00', clockOut: '17:00',
        breaks: [
          { type: 'Short Break', startTime: '10:45', endTime: '11:00' },
          { type: 'Lunch', startTime: '13:00', endTime: '13:30' },
          { type: 'Short Break', startTime: '15:15', endTime: '15:30' }
        ]
      },
      { day: 'Friday', scheduleType: 'Default Shift', clockIn: '09:00', clockOut: '17:00',
        breaks: [
          { type: 'Short Break', startTime: '10:45', endTime: '11:00' },
          { type: 'Lunch', startTime: '13:00', endTime: '13:30' },
          { type: 'Short Break', startTime: '15:15', endTime: '15:30' }
        ]
      },
      { day: 'Saturday', scheduleType: 'Day Off', clockIn: '', clockOut: '', breaks: [] },
      { day: 'Sunday', scheduleType: 'Day Off', clockIn: '', clockOut: '', breaks: [] },
    ]
  },
  {
    id: 2, name: 'Night Shift', color: '#8b5cf6',
    weeklySchedule: [
      { day: 'Monday', scheduleType: 'Default Shift', clockIn: '21:00', clockOut: '05:00',
        breaks: [
          { type: 'Short Break', startTime: '23:00', endTime: '23:15' },
          { type: 'Dinner', startTime: '01:00', endTime: '01:30' },
          { type: 'Short Break', startTime: '03:30', endTime: '03:45' }
        ]
      },
      { day: 'Tuesday', scheduleType: 'Default Shift', clockIn: '21:00', clockOut: '05:00',
        breaks: [
          { type: 'Short Break', startTime: '23:00', endTime: '23:15' },
          { type: 'Dinner', startTime: '01:00', endTime: '01:30' },
          { type: 'Short Break', startTime: '03:30', endTime: '03:45' }
        ]
      },
      { day: 'Wednesday', scheduleType: 'Default Shift', clockIn: '21:00', clockOut: '05:00',
        breaks: [
          { type: 'Short Break', startTime: '23:00', endTime: '23:15' },
          { type: 'Dinner', startTime: '01:00', endTime: '01:30' },
          { type: 'Short Break', startTime: '03:30', endTime: '03:45' }
        ]
      },
      { day: 'Thursday', scheduleType: 'Default Shift', clockIn: '21:00', clockOut: '05:00',
        breaks: [
          { type: 'Short Break', startTime: '23:00', endTime: '23:15' },
          { type: 'Dinner', startTime: '01:00', endTime: '01:30' },
          { type: 'Short Break', startTime: '03:30', endTime: '03:45' }
        ]
      },
      { day: 'Friday', scheduleType: 'Default Shift', clockIn: '21:00', clockOut: '05:00',
        breaks: [
          { type: 'Short Break', startTime: '23:00', endTime: '23:15' },
          { type: 'Dinner', startTime: '01:00', endTime: '01:30' },
          { type: 'Short Break', startTime: '03:30', endTime: '03:45' }
        ]
      },
      { day: 'Saturday', scheduleType: 'Day Off', clockIn: '', clockOut: '', breaks: [] },
      { day: 'Sunday', scheduleType: 'Day Off', clockIn: '', clockOut: '', breaks: [] },
    ]
  },
]);
const mockEmployees = ref([
  { id: 101, name: 'Alice Johnson', departmentId: 1, officeLocationId: 'HQ', positionId: 'Eng', scheduleId: 2 },
  { id: 102, name: 'Bob Smith', departmentId: 1, officeLocationId: 'BR', positionId: 'Dev', scheduleId: 1 },
  { id: 103, name: 'Charlie Brown', departmentId: 2, officeLocationId: 'HQ', positionId: 'Mkt', scheduleId: 1 },
  { id: 104, name: 'Diana Prince', departmentId: 2, officeLocationId: 'RM', positionId: 'Mkt', scheduleId: 1 },
  { id: 105, name: 'Eve Adams', departmentId: 3, officeLocationId: 'BR', positionId: 'Slp', scheduleId: 2 },
  { id: 106, name: 'Frank Lee', departmentId: 3, officeLocationId: 'HQ', positionId: 'Slp', scheduleId: 1 },
]);

// --- State: Component & Filter Management ---
const currentView = ref('weekly');
const selectedFilters = ref({
  departments: mockDepartments.value.map(d => d.id),
  officeLocations: mockOfficeLocations.value.map(l => l.id),
  positions: mockPositions.value.map(p => p.id),
  scheduleTemplates: mockScheduleTemplates.value.map(s => s.id),
  employees: [],
});
const showDropdowns = ref({
  departments: false,
  officeLocations: false,
  positions: false,
  scheduleTemplates: false,
  employees: false,
});
const weeklyStartDate = ref('2025-08-11');
const weeklyEndDate = ref('2025-08-17');
const dailyDate = ref('2025-08-11');
const showAddScheduleModal = ref(false);
const showEditScheduleModal = ref(false);
const scheduleToEdit = ref(null);

const filterOptions = computed(() => [
  { label: 'Departments', key: 'departments', options: mockDepartments.value },
  { label: 'Office Locations', key: 'officeLocations', options: mockOfficeLocations.value },
  { label: 'Positions', key: 'positions', options: mockPositions.value },
  { label: 'Schedule Templates', key: 'scheduleTemplates', options: mockScheduleTemplates.value },
  { label: 'Employees', key: 'employees', options: filteredEmployees.value },
]);

// --- Computed Properties ---
const dateRange = computed(() => {
  const dates = [];
  let currentDate = new Date(weeklyStartDate.value + 'T00:00:00Z');
  const endDate = new Date(weeklyEndDate.value + 'T00:00:00Z');
  while (currentDate <= endDate) {
    dates.push(new Date(currentDate));
    currentDate.setUTCDate(currentDate.getUTCDate() + 1);
  }
  return dates;
});

const timelineStartHour = 18;
const timelineEndHour = 30;
const totalTimelineHours = timelineEndHour - timelineStartHour;

const filteredEmployees = computed(() => {
  return mockEmployees.value.filter(employee =>
    selectedFilters.value.departments.includes(employee.departmentId) &&
    selectedFilters.value.officeLocations.includes(employee.officeLocationId) &&
    selectedFilters.value.positions.includes(employee.positionId) &&
    selectedFilters.value.scheduleTemplates.includes(employee.scheduleId)
  );
});

const displayedEmployees = computed(() => {
  if (selectedFilters.value.employees.length === 0) {
    return filteredEmployees.value;
  }
  return filteredEmployees.value.filter(employee =>
    selectedFilters.value.employees.includes(employee.id)
  );
});

const shifts = computed(() => {
  const allShifts = [];
  mockEmployees.value.forEach(employee => {
    const scheduleTemplate = mockScheduleTemplates.value.find(s => s.id === employee.scheduleId);
    if (!scheduleTemplate) return;

    dateRange.value.forEach(day => {
      const dayOfWeek = day.toLocaleString('en-US', { weekday: 'long', timeZone: 'UTC' });
      const daySchedule = scheduleTemplate.weeklySchedule.find(d => d.day === dayOfWeek);

      if (daySchedule?.scheduleType !== 'Day Off') {
        allShifts.push({
          employeeId: employee.id,
          date: formatDate(day),
          shiftType: daySchedule.scheduleType,
          startTime: daySchedule.clockIn,
          endTime: daySchedule.clockOut,
          breaks: daySchedule.breaks || [],
        });
      }
    });
  });
  return allShifts;
});

// --- Methods ---
const formatDate = (date) => {
  const y = date.getUTCFullYear();
  const m = String(date.getUTCMonth() + 1).padStart(2, '0');
  const d = String(date.getUTCDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
};

const isWeekend = (date) => {
  const day = new Date(date).getUTCDay();
  return day === 0 || day === 6;
};

const convertToTimelineMinutes = (timeString, referenceHour) => {
  if (!timeString) return 0;
  const [hour, minute] = timeString.split(':').map(Number);
  let totalHours = hour;
  if (hour < referenceHour && hour < 12) totalHours += 24;
  return (totalHours - referenceHour) * 60 + minute;
};

const findShift = (employeeId, date) => {
  const dateString = formatDate(date);
  return shifts.value.find(shift =>
    shift.employeeId === employeeId && shift.date === dateString
  );
};

const getShiftBarStyles = (shift) => {
  if (!shift) return {};
  const shiftStartMinutes = convertToTimelineMinutes(shift.startTime, timelineStartHour);
  const shiftEndMinutes = convertToTimelineMinutes(shift.endTime, timelineStartHour);
  const totalTimelineMinutes = totalTimelineHours * 60;
  const left = (shiftStartMinutes / totalTimelineMinutes) * 100;
  const width = ((shiftEndMinutes - shiftStartMinutes) / totalTimelineMinutes) * 100;
  return { left: `${left}%`, width: `${width}%` };
};

const getBreakBarStyles = (breakTime, shiftStartTime, shiftEndTime) => {
  const shiftStartMinutes = convertToTimelineMinutes(shiftStartTime, timelineStartHour);
  const shiftEndMinutes = convertToTimelineMinutes(shiftEndTime, timelineStartHour);
  const shiftDurationMinutes = shiftEndMinutes - shiftStartMinutes;
  const breakStartMinutes = convertToTimelineMinutes(breakTime.startTime, timelineStartHour);
  const breakEndMinutes = convertToTimelineMinutes(breakTime.endTime, timelineStartHour);
  const breakDurationMinutes = breakEndMinutes - breakStartMinutes;
  const left = ((breakStartMinutes - shiftStartMinutes) / shiftDurationMinutes) * 100;
  const width = (breakDurationMinutes / shiftDurationMinutes) * 100;
  return { left: `${left}%`, width: `${width}%` };
};

const toggleDropdown = (key) => {
  showDropdowns.value[key] = !showDropdowns.value[key];
};

const openAddSchedule = () => showAddScheduleModal.value = true;
const closeAddSchedule = () => showAddScheduleModal.value = false;

const saveNewSchedule = (newSchedule) => {
  newSchedule.id = Math.max(...mockScheduleTemplates.value.map(s => s.id)) + 1;
  mockScheduleTemplates.value.push(newSchedule);
  closeAddSchedule();
};

const openEditShiftModal = (employeeId, date) => {
  const employee = mockEmployees.value.find(e => e.id === employeeId);
  const schedule = mockScheduleTemplates.value.find(s => s.id === employee?.scheduleId);
  if (schedule) {
    scheduleToEdit.value = JSON.parse(JSON.stringify(schedule));
    showEditScheduleModal.value = true;
  }
};

const closeEditSchedule = () => {
  showEditScheduleModal.value = false;
  scheduleToEdit.value = null;
};

const saveEditedSchedule = (updatedSchedule) => {
  const index = mockScheduleTemplates.value.findIndex(s => s.id === updatedSchedule.id);
  if (index !== -1) mockScheduleTemplates.value[index] = updatedSchedule;
  closeEditSchedule();
};

// --- Watchers ---
watch([filteredEmployees], () => {
  selectedFilters.value.employees = [];
});
</script>

<template>
  <main class="view min-h-screen p-4 md:p-8 dark:bg-gray-900 bg-gray-100 text-gray-800 dark:text-gray-200 transition-colors duration-300">
    <div class="max-w-[1700px] mx-auto">
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

      <div class="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md transition-colors duration-300 mb-6">
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-xl font-bold">Filters</h2>
          <button @click="openAddSchedule" class="px-4 py-2 bg-blue-600 text-white rounded-md shadow-md hover:bg-blue-700 transition-colors">
            Add Weekly Schedule
          </button>
        </div>
        
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div
            v-for="filter in filterOptions"
            :key="filter.key"
            class="relative"
          >
            <label class="block text-sm font-medium mb-1">{{ filter.label }}</label>
            <div
              @click="toggleDropdown(filter.key)"
              class="relative w-full cursor-pointer rounded-md shadow-sm border border-gray-300 dark:border-gray-600 dark:bg-gray-700 px-3 py-2 text-sm focus:ring-blue-500 focus:border-blue-500 flex justify-between items-center"
            >
              <span>
                {{ selectedFilters[filter.key].length === 0 ? `Select ${filter.label.toLowerCase()}` : `${selectedFilters[filter.key].length} selected` }}
              </span>
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd" />
              </svg>
            </div>
            <ul v-if="showDropdowns[filter.key]" class="absolute z-20 w-full mt-1 bg-white dark:bg-gray-700 rounded-md shadow-lg border border-gray-300 dark:border-gray-600 max-h-40 overflow-y-auto">
              <li
                v-for="item in filter.options"
                :key="item.id"
                @click.stop="() => {
                  const index = selectedFilters[filter.key].indexOf(item.id);
                  if (index > -1) {
                    selectedFilters[filter.key].splice(index, 1);
                  } else {
                    selectedFilters[filter.key].push(item.id);
                  }
                }"
                class="px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-600 cursor-pointer flex items-center"
              >
                <input
                  type="checkbox"
                  :value="item.id"
                  v-model="selectedFilters[filter.key]"
                  class="mr-2 rounded text-blue-500"
                >
                <label>{{ item.name }}</label>
                <div v-if="filter.key === 'scheduleTemplates'" class="w-4 h-4 ml-2 rounded-full" :style="{ backgroundColor: item.color }"></div>
              </li>
            </ul>
          </div>
        
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

      <Transition name="slide-fade" mode="out-in">
        <div v-if="currentView === 'weekly'" key="weekly" class="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 overflow-x-auto transition-colors duration-300">
          <table class="w-full border-collapse">
            <thead>
              <tr class="text-sm font-medium bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-200">
                <th class="sticky left-0 bg-gray-50 dark:bg-gray-700 z-10 p-3 text-left w-40 min-w-[160px] border-b border-r border-gray-200 dark:border-gray-600">Employee</th>
                <th v-for="day in dateRange" :key="day.toDateString()" 
                    :class="{'bg-red-50 dark:bg-red-950 text-red-700 dark:text-red-300': isWeekend(day)}"
                    class="p-3 text-center border-b border-r last:border-r-0 border-gray-200 dark:border-gray-600">
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
                  <div
                    v-if="findShift(employee.id, day)"
                    @click="openEditShiftModal(employee.id, day)"
                    class="flex flex-col items-center justify-center cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md p-1 transition-colors"
                  >
                    <span class="font-semibold text-green-600 dark:text-green-400">
                      {{ findShift(employee.id, day).shiftType }}
                    </span>
                    <span class="text-gray-500 dark:text-gray-400">
                      {{ findShift(employee.id, day).startTime }} - {{ findShift(employee.id, day).endTime }}
                    </span>
                  </div>
                  <span v-else class="text-gray-400 dark:text-gray-600">-</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div v-else-if="currentView === 'daily'" key="daily" class="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 overflow-x-auto transition-colors duration-300">
          <h3 class="text-lg font-semibold mb-4 text-center">
            Shifts for {{ new Date(dailyDate + 'T00:00:00Z').toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC' }) }}
          </h3>
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
          <div class="space-y-4">
            <div v-for="employee in displayedEmployees" :key="employee.id" class="flex items-center">
              <div class="w-40 text-sm text-left pr-4 flex-shrink-0">
                <span class="font-medium block">{{ employee.name }}</span>
                <span v-if="findShift(employee.id, new Date(dailyDate + 'T00:00:00Z'))" 
                      class="text-xs text-gray-500 dark:text-gray-400 block">
                  ({{ findShift(employee.id, new Date(dailyDate + 'T00:00:00Z')).shiftType }})
                </span>
              </div>
              <div class="relative flex-1 bg-gray-200 dark:bg-gray-700 rounded-md h-8 overflow-hidden">
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
                  <div
                    @click="openEditShiftModal(employee.id, new Date(dailyDate + 'T00:00:00Z'))"
                    :style="getShiftBarStyles(findShift(employee.id, new Date(dailyDate + 'T00:00:00Z')))"
                    class="absolute h-full rounded-md shadow-sm flex items-center justify-center p-1 text-xs text-white z-10 bg-green-500 cursor-pointer"
                  >
                    <div
                      v-for="(breakTime, index) in findShift(employee.id, new Date(dailyDate + 'T00:00:00Z')).breaks"
                      :key="index"
                      :style="getBreakBarStyles(breakTime, findShift(employee.id, new Date(dailyDate + 'T00:00:00Z')).startTime, findShift(employee.id, new Date(dailyDate + 'T00:00:00Z')).endTime)"
                      class="absolute h-full rounded-sm bg-gray-600 dark:bg-gray-300 flex items-center justify-center text-[10px] dark:text-black text-white"
                    >
                      <span class="p-1">{{ breakTime.type }}</span>
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

    <Transition name="modal-fade">
      <AddWeeklySchedule v-if="showAddScheduleModal" @close="closeAddSchedule" @save="saveNewSchedule" />
    </Transition>

    <Transition name="modal-fade">
      <EditWeeklySchedule v-if="showEditScheduleModal" :schedule-data="scheduleToEdit" @close="closeEditSchedule" @save="saveEditedSchedule" />
    </Transition>

  </main>
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