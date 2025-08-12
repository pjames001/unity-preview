<script setup>
import { ref, computed } from 'vue';

import CreateHoliday from '../components/public-holidays/CreateHoliday.vue';

// -- Page State --
const selectedYear = ref(new Date().getFullYear());
const selectedMonth = ref(null);
const selectedOfficeLocations = ref([]);
const selectedHolidayType = ref(null);
const searchQuery = ref('');
const isTableView = ref(true); // State to switch between Table and Calendar view
const isCreateModalOpen = ref(false);

// State for dropdown menus
const openLocationMenu = ref(false);
const openHolidayTypeMenu = ref(false);

// Dummy data for filters
const officeLocations = ref(['Headquarters', 'Branch A', 'Branch B', 'Remote']);
const holidayTypes = ref(['One-time holiday', 'Annual fixed date', 'Annual variable date']);
const months = ref([
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
]);

const holidayData = ref([
  {
    id: 1,
    name: 'New Year\'s Day',
    date: '2024-01-01',
    officeLocations: ['All'],
    type: 'Annual fixed date',
    updatedAt: '2023-11-15',
    createdBy: 'Admin',
  },
  {
    id: 2,
    name: 'Company Picnic',
    date: '2024-07-20',
    officeLocations: ['Headquarters', 'Branch A'],
    type: 'One-time holiday',
    updatedAt: '2024-03-10',
    createdBy: 'Jane Smith',
  },
  {
    id: 3,
    name: 'Independence Day',
    date: '2024-07-04',
    officeLocations: ['All'],
    type: 'Annual fixed date',
    updatedAt: '2023-11-15',
    createdBy: 'Admin',
  },
  {
    id: 4,
    name: 'Christmas Eve',
    date: '2024-12-24',
    officeLocations: ['Headquarters'],
    type: 'Annual variable date',
    updatedAt: '2024-01-05',
    createdBy: 'John Doe',
  },
]);

// filtering the holiday data
const filteredHolidays = computed(() => {
  let result = holidayData.value.filter(holiday => {
    // Filter by year
    const holidayYear = new Date(holiday.date).getFullYear();
    const matchesYear = holidayYear === selectedYear.value;

    // Filter by month
    const holidayMonth = new Date(holiday.date).getMonth();
    const matchesMonth = selectedMonth.value === null || holidayMonth === months.value.indexOf(selectedMonth.value);

    // Filter by holiday type
    const matchesHolidayType = selectedHolidayType.value === null || holiday.type === selectedHolidayType.value;

    // Filter by search query (name)
    const matchesSearch = holiday.name.toLowerCase().includes(searchQuery.value.toLowerCase());

    return matchesYear && matchesMonth && matchesHolidayType && matchesSearch;
  });

  // Filter by office location
  if (selectedOfficeLocations.value.length > 0) {
    result = result.filter(holiday => {
      return selectedOfficeLocations.value.some(location => holiday.officeLocations.includes(location) || holiday.officeLocations.includes('All'));
    });
  }

  return result;
});

// Computed properties for the calendar view
const currentYear = computed(() => selectedYear.value);
const currentMonthIndex = computed(() => months.value.indexOf(selectedMonth.value));

const daysInMonth = computed(() => {
  if (selectedMonth.value === null) return [];
  return new Date(currentYear.value, currentMonthIndex.value + 1, 0).getDate();
});

const getFirstDayOfMonth = computed(() => {
  if (selectedMonth.value === null) return 0;
  return new Date(currentYear.value, currentMonthIndex.value, 1).getDay(); // 0 = Sunday, 1 = Monday
});

const getHolidaysForDay = (day) => {
  if (selectedMonth.value === null) return [];
  const dateString = `${currentYear.value}-${String(currentMonthIndex.value + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
  return filteredHolidays.value.filter(holiday => holiday.date === dateString);
};

// State for multi-select checkboxes in the table
const selectedHolidays = ref([]);
const selectAll = computed({
  get: () => filteredHolidays.value.length > 0 && selectedHolidays.value.length === filteredHolidays.value.length,
  set: (value) => {
    selectedHolidays.value = value ? filteredHolidays.value.map(h => h.id) : [];
  },
});

// State for individual actions dropdowns in the table
const activeActionsMenu = ref(null);

// Functions
const toggleView = (view) => {
  isTableView.value = view === 'table';
};

const applyFilters = () => {
  console.log('Filters applied');
};


const openCreateModal = () => {
  isCreateModalOpen.value = true;
};


const handleSaveHoliday = (newHoliday) => {
  console.log('New holiday to be saved:', newHoliday);

  const newId = holidayData.value.length > 0 ? Math.max(...holidayData.value.map(h => h.id)) + 1 : 1;
  holidayData.value.push({
    ...newHoliday,
    id: newId,
    updatedAt: new Date().toISOString().slice(0, 10),
    createdBy: 'Current User', // Replace with dynamic user info
  });
  isCreateModalOpen.value = false;
};

const toggleActionsMenu = (id) => {
  activeActionsMenu.value = activeActionsMenu.value === id ? null : id;
};

const editHoliday = (id) => {
  console.log('Editing holiday with ID:', id);
  activeActionsMenu.value = null;
};

const deleteHoliday = (id) => {
  console.log('Deleting holiday with ID:', id);
  activeActionsMenu.value = null;
};

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
  <main class="view dark:bg-darkBlue bg-white">
    <section
      class="max-w-[1700px] mx-auto mt-10 rounded-xl shadow-outer dark:bg-darkPurple bg-[rgba(90,169,230,.35)] border dark:border-lightBlue border-clientPurple px-8 py-4 transition-all duration-300 ease">
      
      <!-- Top Section -->
      <div class="flex justify-end flex-wrap items-center mb-6">
        
        <button @click="openCreateModal"
          class="dark:bg-darkGreen bg-pigmentGreen border dark:border-lightGreen border-lightGreen dark:text-lightGreen text-white font-bold px-4 py-2 rounded-xl shadow-outer">
          Create Holiday
        </button>
      </div>

      <!-- Filters Section -->
      <div class="p-4 bg-white dark:bg-gray-900 rounded-xl shadow-md mb-6">
        <div class="flex flex-wrap items-end gap-4">
          <!-- Year Dropdown -->
          <div class="relative w-full sm:w-auto">
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-200">Year</label>
            <select v-model="selectedYear"
              class="mt-1 px-3 py-2 block w-full rounded-md border border-gray-400 dark:border-gray-600 shadow-sm dark:bg-gray-800 bg-white dark:text-white text-gray-700 outline-none">
              <option v-for="year in 5" :key="year" :value="new Date().getFullYear() + (year - 3)">
                {{ new Date().getFullYear() + (year - 3) }}
              </option>
            </select>
          </div>
          
          <!-- Month Dropdown -->
          <div class="relative w-full sm:w-auto">
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-200">Month</label>
            <select v-model="selectedMonth"
              class="mt-1 px-3 py-2 block w-full rounded-md border border-gray-400 dark:border-gray-600 shadow-sm dark:bg-gray-800 bg-white dark:text-white text-gray-700 outline-none">
              <option :value="null">All Months</option>
              <option v-for="month in months" :key="month" :value="month">
                {{ month }}
              </option>
            </select>
          </div>

          <!-- Office Location Multi-select -->
          <div class="relative w-full sm:w-auto min-w-48" v-click-outside="() => (openLocationMenu = false)">
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-200">Office Location</label>
            <button @click="openLocationMenu = !openLocationMenu"
              class="mt-1 w-full text-left px-3 py-2 bg-white dark:bg-gray-800 border border-gray-400 dark:border-gray-600 dark:text-white text-gray-700 rounded-md shadow-sm">
              {{
                selectedOfficeLocations.length
                ? selectedOfficeLocations.join(', ')
                : 'Select Locations'
              }}
            </button>
            <div v-if="openLocationMenu"
              class="absolute z-10 mt-1 w-full rounded-md bg-white dark:bg-gray-800 dark:text-white text-gray-700 border border-gray-400 dark:border-gray-600">
              <ul class="max-h-60 overflow-y-auto">
                <li v-for="location in officeLocations" :key="location" @click.stop="() => {
                    const index = selectedOfficeLocations.indexOf(location);
                    if (index === -1) selectedOfficeLocations.push(location);
                    else selectedOfficeLocations.splice(index, 1);
                  }"
                  class="px-4 py-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center">
                  <input type="checkbox" :checked="selectedOfficeLocations.includes(location)" class="mr-2" />
                  {{ location }}
                </li>
              </ul>
            </div>
          </div>
          
          <!-- Holiday Type Dropdown -->
          <div class="relative w-full sm:w-auto">
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-200">Holiday Type</label>
            <select v-model="selectedHolidayType"
              class="mt-1 px-3 py-2 block w-full rounded-md border border-gray-400 dark:border-gray-600 shadow-sm dark:bg-gray-800 bg-white dark:text-white text-gray-700 outline-none">
              <option :value="null">All Types</option>
              <option v-for="type in holidayTypes" :key="type" :value="type">
                {{ type }}
              </option>
            </select>
          </div>
          
          <!-- Search Bar -->
          <div class="relative w-full sm:w-auto flex-grow">
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-200">Search</label>
            <input type="text" v-model="searchQuery" placeholder="Search by name"
              class="mt-1 px-3 py-2 block w-full rounded-md border border-gray-400 dark:border-gray-600 shadow-sm dark:bg-gray-800 dark:text-white outline-none" />
          </div>

          <!-- Apply Filters Button -->
          <div class="flex-shrink-0 w-full sm:w-auto">
            <button @click="applyFilters"
              class="w-full px-4 py-2 mt-4 sm:mt-0 font-bold text-white bg-blue-600 rounded-xl shadow-md hover:bg-blue-700">
              Apply Filters
            </button>
          </div>
        </div>
      </div>
      
      <!-- Holiday List Section -->
      <div class="p-4 bg-white dark:bg-gray-900 rounded-xl shadow-md">
        
        <!-- View Toggle Buttons -->
        <div class="flex justify-end gap-2 mb-4">
          <button @click="toggleView('table')"
            :class="{ 'bg-blue-600 text-white': isTableView, 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200': !isTableView }"
            class="px-4 py-2 rounded-xl font-bold shadow-md transition-colors duration-200">
            Table View
          </button>
          <button @click="toggleView('calendar')"
            :class="{ 'bg-blue-600 text-white': !isTableView, 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200': isTableView }"
            class="px-4 py-2 rounded-xl font-bold shadow-md transition-colors duration-200">
            Calendar View
          </button>
        </div>

        <Transition name="fade" mode="out-in">
          <div v-if="isTableView" key="table">
            <!-- Table View -->
            <div class="overflow-x-auto">
              <table class="w-full text-left border border-gray-300 dark:border-gray-600 rounded-md overflow-hidden">
                <thead class="bg-gray-100 dark:bg-gray-800 text-sm text-gray-700 dark:text-gray-200">
                  <tr>
                    <th class="px-4 py-2">
                      <input type="checkbox" v-model="selectAll" class="rounded" />
                    </th>
                    <th class="px-4 py-2">Name</th>
                    <th class="px-4 py-2">Date</th>
                    <th class="px-4 py-2">Office Locations</th>
                    <th class="px-4 py-2">Updated At</th>
                    <th class="px-4 py-2">Created By</th>
                    <th class="px-4 py-2 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="holiday in filteredHolidays" :key="holiday.id"
                    class="border-t border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800">
                    <td class="px-4 py-2">
                      <input type="checkbox" :value="holiday.id" v-model="selectedHolidays" class="rounded" />
                    </td>
                    <td class="px-4 py-2">{{ holiday.name }}</td>
                    <td class="px-4 py-2">{{ holiday.date }}</td>
                    <td class="px-4 py-2">{{ holiday.officeLocations.join(', ') }}</td>
                    <td class="px-4 py-2">{{ holiday.updatedAt }}</td>
                    <td class="px-4 py-2">{{ holiday.createdBy }}</td>
                    <td class="px-4 py-2 text-center relative" v-click-outside="() => activeActionsMenu = null">
                      <button @click.stop="toggleActionsMenu(holiday.id)"
                        class="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 focus:outline-none">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                           <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                        </svg>
                      </button>
                      
                      <!-- Actions Dropdown Menu -->
                      <div v-if="activeActionsMenu === holiday.id"
                        class="absolute right-0 -top-10 z-50 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg ring-1 ring-black ring-opacity-5">
                        <div class="py-1">
                          <button @click="editHoliday(holiday.id)"
                            class="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700">
                            Edit
                          </button>
                          <button @click="deleteHoliday(holiday.id)"
                            class="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900">
                            Delete
                          </button>
                        </div>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div v-else key="calendar">
            <!-- Calendar View -->
            <div v-if="selectedMonth" class="grid grid-cols-7 gap-1 text-center font-bold text-gray-700 dark:text-gray-200 mb-2">
              <div>Sun</div>
              <div>Mon</div>
              <div>Tue</div>
              <div>Wed</div>
              <div>Thu</div>
              <div>Fri</div>
              <div>Sat</div>
            </div>
            <div v-if="selectedMonth" class="grid grid-cols-7 gap-1">
              <div v-for="i in getFirstDayOfMonth" :key="`empty-${i}`" class="h-20 bg-gray-100 dark:bg-gray-800 rounded-md"></div>
              <div v-for="day in daysInMonth" :key="day" class="relative h-20 p-2 bg-gray-100 dark:bg-gray-800 rounded-md">
                <span class="absolute top-1 right-2 text-sm font-bold text-gray-700 dark:text-gray-200">{{ day }}</span>
                <div class="mt-4 space-y-1 overflow-y-auto max-h-12">
                  <div v-for="holiday in getHolidaysForDay(day)" :key="holiday.id" class="text-xs text-white bg-blue-500 rounded-full px-2 py-1 truncate">
                    {{ holiday.name }}
                  </div>
                </div>
              </div>
            </div>
            <div v-else class="text-center py-4 text-gray-500 dark:text-gray-400">
              Please select a month to view the calendar.
            </div>
          </div>
        </Transition>
      </div>
    </section>
  </main>
  

  <CreateHoliday 
    :isOpen="isCreateModalOpen" 
    @close="isCreateModalOpen = false" 
    @save="handleSaveHoliday" />
</template>

<style scoped>

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>