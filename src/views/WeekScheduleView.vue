<script setup>
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import AddWeeklySchedule from '../components/week-schedule/AddWeeklySchedule.vue';
import EditWeeklySchedule from '../components/week-schedule/EditWeeklySchedule.vue';

const router = useRouter();
const showEditModal = ref(false);
const scheduleToEdit = ref(null);
const schedules = ref([
  {
    id: 1,
    name: 'Standard 9-5 Shift',
    color: '#34d399', // Emerald Green
    employeesCount: 45,
    updatedAt: '2024-05-20',
  },
  {
    id: 2,
    name: 'Weekend Coverage',
    color: '#60a5fa', // Blue
    employeesCount: 12,
    updatedAt: '2024-05-18',
  },
  {
    id: 3,
    name: 'Night Shift',
    color: '#8b5cf6', // Violet
    employeesCount: 8,
    updatedAt: '2024-05-18',
  },
  {
    id: 4,
    name: 'Part-Time Flex',
    color: '#f87171', // Red
    employeesCount: 22,
    updatedAt: '2024-05-19',
  },
]);

// State for search bar
const searchTerm = ref('');

// State for multi-select checkboxes in the table
const selectedSchedules = ref([]);
const selectAll = computed({
  get: () =>
    filteredSchedules.value.length > 0 &&
    selectedSchedules.value.length === filteredSchedules.value.length,
  set: (value) => {
    selectedSchedules.value = value ? filteredSchedules.value.map((s) => s.id) : [];
  },
});

// State for individual actions dropdowns in the table
const activeActionsMenu = ref(null);
const menuPosition = ref({ top: '0px', left: '0px' });

// State for the modal
const showModal = ref(false);

// -- Computed Properties --
// Filter the schedules based on the search term
const filteredSchedules = computed(() => {
  if (!searchTerm.value) {
    return schedules.value;
  }
  const term = searchTerm.value.toLowerCase();
  return schedules.value.filter((schedule) =>
    schedule.name.toLowerCase().includes(term) ||
    schedule.color.toLowerCase().includes(term) ||
    schedule.updatedAt.toLowerCase().includes(term)
  );
});

// -- Methods --
const openAddScheduleModal = () => {
  showModal.value = true;
};

const closeAddScheduleModal = () => {
  showModal.value = false;
};

const toggleActionsMenu = (id, event) => {
  if (activeActionsMenu.value === id) {
    activeActionsMenu.value = null;
  } else {
    // Get the position of the clicked button
    const rect = event.target.getBoundingClientRect();
    menuPosition.value = {
      top: `${rect.bottom + window.scrollY}px`,
      left: `${rect.left + window.scrollX}px`,
    };
    activeActionsMenu.value = id;
  }
};

const viewSchedule = () => {
  router.push({ name: 'View Schedule', params: { weekScheduleId: activeActionsMenu.value } });
  activeActionsMenu.value = null;
};

const editSchedule = () => {
  const schedule = schedules.value.find(s => s.id === activeActionsMenu.value);
  if (schedule) {
    scheduleToEdit.value = schedule;
    showEditModal.value = true;
  }
  activeActionsMenu.value = null;
};

const closeEditScheduleModal = () => {
  showEditModal.value = false;
  scheduleToEdit.value = null; // Clear the data when closing
};

const deleteSchedule = () => {
  console.log('Deleting schedule with ID:', activeActionsMenu.value);
  // In a real app, a confirmation modal would appear here.
  schedules.value = schedules.value.filter(s => s.id !== activeActionsMenu.value);
  activeActionsMenu.value = null;
};

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
  <main class="view dark:bg-darkBlue bg-white">
    <section
      class="max-w-[1700px] mx-auto mt-10 rounded-xl shadow-outer dark:bg-darkPurple bg-[rgba(90,169,230,.35)] border dark:border-lightBlue border-clientPurple px-8 py-4 transition-all duration-300 ease"
    >
      <!-- Top Section: Button and Search Bar -->
      <div class="flex flex-col sm:flex-row sm:justify-between items-center mb-6">
        <button
          @click="openAddScheduleModal"
          class="dark:bg-darkGreen bg-pigmentGreen border dark:border-lightGreen border-lightGreen dark:text-lightGreen text-white font-bold px-4 py-2 rounded-xl shadow-outer mb-4 sm:mb-0"
        >
          Add Weekly Schedule
        </button>
        <div class="relative w-full sm:w-auto">
          <input
            type="text"
            v-model="searchTerm"
            placeholder="Search schedules..."
            class="w-full sm:w-64 pl-10 pr-4 py-2 rounded-xl shadow-inner border border-gray-300 dark:border-gray-600 dark:bg-gray-800 bg-white dark:text-white text-gray-700 outline-none"
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

      <!-- Weekly Schedules Table -->
      <div class="p-4 bg-white dark:bg-gray-900 rounded-xl shadow-md">
        <div class="overflow-x-auto">
          <table
            class="w-full text-left border border-gray-300 dark:border-gray-600 rounded-md overflow-hidden"
          >
            <thead
              class="bg-gray-100 dark:bg-gray-800 text-sm text-gray-700 dark:text-gray-200"
            >
              <tr>
                <th class="px-4 py-2">
                  <input type="checkbox" v-model="selectAll" class="rounded" />
                </th>
                <th class="px-4 py-2">Name</th>
                <th class="px-4 py-2">Color</th>
                <th class="px-4 py-2">Employees Count</th>
                <th class="px-4 py-2">Updated At</th>
                <th class="px-4 py-2 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="schedule in filteredSchedules"
                :key="schedule.id"
                class="border-t border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800"
              >
                <td class="px-4 py-2">
                  <input
                    type="checkbox"
                    :value="schedule.id"
                    v-model="selectedSchedules"
                    class="rounded"
                  />
                </td>
                <td class="px-4 py-2">{{ schedule.name }}</td>
                <td class="px-4 py-2 flex items-center">
                  <div
                    class="w-6 h-6 rounded-full mr-2"
                    :style="{ backgroundColor: schedule.color }"
                  ></div>
                  <span class="text-xs font-mono">{{ schedule.color }}</span>
                </td>
                <td class="px-4 py-2">{{ schedule.employeesCount }}</td>
                <td class="px-4 py-2">{{ schedule.updatedAt }}</td>
                <td class="px-4 py-2 text-center relative">
                  <div class="inline-block relative">
                    <button
                      @click.stop="toggleActionsMenu(schedule.id, $event)"
                      class="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 focus:outline-none"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        class="h-5 w-5"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z"
                        />
                      </svg>
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </section>

    <!-- Shared Actions Dropdown Menu (Fixed Position) -->
    <div
      v-if="activeActionsMenu !== null"
      class="fixed w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg z-50 ring-1 ring-black ring-opacity-5"
      :style="{ top: menuPosition.top, left: menuPosition.left }"
      v-click-outside="() => (activeActionsMenu = null)"
    >
      <div class="py-1">
        <button
          @click="viewSchedule"
          class="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
        >
          View
        </button>
        <button
          @click="editSchedule"
          class="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
        >
          Edit
        </button>
        <button
          @click="deleteSchedule"
          class="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900"
        >
          Delete
        </button>
      </div>
    </div>

    <!-- The new modal component -->
       <Transition name="modal-fade">
         <AddWeeklySchedule v-if="showModal" @close="closeAddScheduleModal" />
       </Transition>

       <Transition name="modal-fade">
        <EditWeeklySchedule v-if="showEditModal" :schedule-data="scheduleToEdit" @close="closeEditScheduleModal" />
      </Transition>
  </main>
</template>
