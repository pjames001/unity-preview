<script setup>
import { ref, computed } from 'vue';
import AddAttendanceGroup from '../components/attendance-groups/AddAttendanceGroup.vue'
import EditAttendanceGroup from '../components/attendance-groups/EditAttendanceGroup.vue'; // Import the new component

// Mock data for attendance groups
const attendanceGroups = ref([
  {
    id: 1,
    name: 'Morning Crew',
    description: 'Employees working the standard morning shift.',
    shiftSchedules: 2,
    updatedAt: '2024-05-22',
  },
  {
    id: 2,
    name: 'Support Team',
    description: 'Members providing customer support and assistance.',
    shiftSchedules: 1,
    updatedAt: '2024-05-21',
  },
  {
    id: 3,
    name: 'Management',
    description: 'Managers and team leads.',
    shiftSchedules: 3,
    updatedAt: '2024-05-20',
  },
  {
    id: 4,
    name: 'Evening Shift',
    description: 'Team members covering evening hours.',
    shiftSchedules: 2,
    updatedAt: '2024-05-19',
  },
]);

// State for search bar
const searchTerm = ref('');

// State for multi-select checkboxes in the table
const selectedGroups = ref([]);
const selectAll = computed({
  get: () =>
    filteredGroups.value.length > 0 &&
    selectedGroups.value.length === filteredGroups.value.length,
  set: (value) => {
    selectedGroups.value = value ? filteredGroups.value.map((g) => g.id) : [];
  },
});

// State for individual actions dropdowns in the table
const activeActionsMenu = ref(null);
const menuPosition = ref({ top: '0px', left: '0px' });

// States for modals
const showAddModal = ref(false);
const groupToEdit = ref(null); // The group to be passed to the edit modal

// -- Computed Properties --
// Filter the attendance groups based on the search term
const filteredGroups = computed(() => {
  if (!searchTerm.value) {
    return attendanceGroups.value;
  }
  const term = searchTerm.value.toLowerCase();
  return attendanceGroups.value.filter((group) =>
    group.name.toLowerCase().includes(term) ||
    group.description.toLowerCase().includes(term) ||
    group.updatedAt.toLowerCase().includes(term)
  );
});

// -- Methods --
const openAddGroupModal = () => {
  showAddModal.value = true;
};

const closeAddGroupModal = () => {
  showAddModal.value = false;
};

const handleSaveGroup = (newGroup) => {
  console.log('Received new group from modal:', newGroup);
  // Here, you would add the new group to your attendanceGroups array
  showAddModal.value = false;
};

const openEditGroupModal = (id) => {
  groupToEdit.value = attendanceGroups.value.find((g) => g.id === id);
  activeActionsMenu.value = null;
};

const closeEditGroupModal = () => {
  groupToEdit.value = null;
};

const handleUpdateGroup = (updatedGroup) => {
  console.log('Received updated group from modal:', updatedGroup);
  // Here, you would update the attendanceGroups array
  groupToEdit.value = null;
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

const editGroup = () => {
  openEditGroupModal(activeActionsMenu.value);
};

const deleteGroup = () => {
  console.log('Deleting attendance group with ID:', activeActionsMenu.value);
  // In a real app, a confirmation modal would appear here.
  attendanceGroups.value = attendanceGroups.value.filter(g => g.id !== activeActionsMenu.value);
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
          @click="openAddGroupModal"
          class="dark:bg-darkGreen bg-pigmentGreen border dark:border-lightGreen border-lightGreen dark:text-lightGreen text-white font-bold px-4 py-2 rounded-xl shadow-outer mb-4 sm:mb-0"
        >
          Add Attendance Group
        </button>
        <div class="relative w-full sm:w-auto">
          <input
            type="text"
            v-model="searchTerm"
            placeholder="Search groups..."
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

      <!-- Attendance Groups Table -->
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
                <th class="px-4 py-2">Description</th>
                <th class="px-4 py-2">Shift Schedules</th>
                <th class="px-4 py-2">Updated At</th>
                <th class="px-4 py-2 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="group in filteredGroups"
                :key="group.id"
                class="border-t border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800"
              >
                <td class="px-4 py-2">
                  <input
                    type="checkbox"
                    :value="group.id"
                    v-model="selectedGroups"
                    class="rounded"
                  />
                </td>
                <td class="px-4 py-2">{{ group.name }}</td>
                <td class="px-4 py-2">{{ group.description }}</td>
                <td class="px-4 py-2">{{ group.shiftSchedules }}</td>
                <td class="px-4 py-2">{{ group.updatedAt }}</td>
                <td class="px-4 py-2 text-center relative">
                  <div class="inline-block relative">
                    <button
                      @click.stop="toggleActionsMenu(group.id, $event)"
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
          @click="editGroup"
          class="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
        >
          Edit
        </button>
        <button
          @click="deleteGroup"
          class="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900"
        >
          Delete
        </button>
      </div>
    </div>

    <!-- Modals -->
    <AddAttendanceGroup v-if="showAddModal" @close="closeAddGroupModal" @save="handleSaveGroup" />
    <Transition name="modal-fade">
      <EditAttendanceGroup v-if="groupToEdit" :group="groupToEdit" @close="closeEditGroupModal" @save="handleUpdateGroup" />
    </Transition>
  </main>
</template>

<style scoped>

.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.3s ease;
}

.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}

.modal-fade-enter-active > div,
.modal-fade-leave-active > div {
  transition: transform 0.3s ease, opacity 0.3s ease;
}

.modal-fade-enter-from > div,
.modal-fade-leave-to > div {
  transform: translateY(-20px);
  opacity: 0;
}
</style>
