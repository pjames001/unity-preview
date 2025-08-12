<script setup>
import { ref, computed, watch } from 'vue';

// Define props and events
const props = defineProps({
  group: {
    type: Object,
    required: true,
  },
});
const emit = defineEmits(['close', 'save']);

// -- Form Data --
const groupName = ref('');
const description = ref('');

// -- Shift Schedules Table Data --
const shiftSchedules = ref([
  { id: 1, name: 'Morning Shift', status: 'Active' },
  { id: 2, name: 'Night Shift', status: 'Inactive' },
  { id: 3, name: 'Weekend Shift', status: 'Active' },
  { id: 4, name: 'On-Call', status: 'Active' },
  { id: 5, name: 'Part-Time', status: 'Inactive' },
]);
const searchTerm = ref('');
const selectedSchedules = ref([]);

// Watch the `group` prop to update the form fields
watch(
  () => props.group,
  (newGroup) => {
    if (newGroup) {
      groupName.value = newGroup.name;
      description.value = newGroup.description;
      // This is a simplified way to populate selected schedules based on a mock number
      selectedSchedules.value = newGroup.id === 1 ? [1, 2] : [newGroup.id];
    }
  },
  { immediate: true }
);

// -- Computed Properties --
const filteredSchedules = computed(() => {
  if (!searchTerm.value) {
    return shiftSchedules.value;
  }
  const term = searchTerm.value.toLowerCase();
  return shiftSchedules.value.filter(
    (schedule) =>
      schedule.name.toLowerCase().includes(term) ||
      schedule.status.toLowerCase().includes(term)
  );
});

const selectAllSchedules = computed({
  get: () =>
    filteredSchedules.value.length > 0 &&
    selectedSchedules.value.length === filteredSchedules.value.length,
  set: (value) => {
    selectedSchedules.value = value ? filteredSchedules.value.map((s) => s.id) : [];
  },
});

// -- Methods --
const saveGroup = () => {
  const updatedGroup = {
    ...props.group,
    name: groupName.value,
    description: description.value,
    assignedSchedules: selectedSchedules.value,
  };
  console.log('Updated attendance group to be saved:', updatedGroup);
  emit('save', updatedGroup);
};

const close = () => {
  emit('close');
};
</script>

<template>
  <Transition name="modal-fade">
    <div
      class="fixed inset-0 bg-gray-900 bg-opacity-75 flex items-center justify-center z-50 p-4"
      @click.self="close"
    >
      <div
        class="bg-white dark:bg-gray-800 rounded-xl shadow-outer max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col"
        @click.stop
      >
        <!-- Modal Header -->
        <div
          class="flex justify-between items-center px-6 py-4 border-b border-gray-200 dark:border-gray-700"
        >
          <h2 class="text-2xl font-bold dark:text-white">Edit Attendance Group</h2>
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

        <!-- Modal Body -->
        <div class="p-6 overflow-y-auto custom-scrollbar">
          <!-- Group Info Section -->
          <div class="mb-6">
            <div class="grid grid-cols-1 gap-6">
              <div>
                <label for="group-name" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Group Name</label>
                <input
                  type="text"
                  id="group-name"
                  v-model="groupName"
                  class="w-full rounded-xl shadow-inner border border-gray-300 dark:border-gray-600 dark:bg-gray-700 bg-white dark:text-white text-gray-700 px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  placeholder="e.g., Morning Shift Crew"
                />
              </div>
              <div>
                <label for="group-description" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description</label>
                <textarea
                  id="group-description"
                  v-model="description"
                  class="w-full rounded-xl shadow-inner border border-gray-300 dark:border-gray-600 dark:bg-gray-700 bg-white dark:text-white text-gray-700 px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none h-24"
                  placeholder="A short description of this group..."
                ></textarea>
              </div>
            </div>
          </div>

          <!-- Shift Schedules Section -->
          <div>
            <h3 class="text-lg font-semibold dark:text-white mb-4">Assign Shift Schedules</h3>
            <div class="flex justify-between items-center mb-4">
              <div class="relative w-full">
                <input
                  type="text"
                  v-model="searchTerm"
                  placeholder="Search schedules..."
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
                      <input type="checkbox" v-model="selectAllSchedules" class="rounded" />
                    </th>
                    <th class="px-4 py-2">Name</th>
                    <th class="px-4 py-2">Status</th>
                  </tr>
                </thead>
                <tbody>
                  <tr
                    v-for="schedule in filteredSchedules"
                    :key="schedule.id"
                    class="border-t border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200"
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
                    <td class="px-4 py-2">{{ schedule.status }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <!-- Modal Footer -->
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
            @click="saveGroup"
            class="px-4 py-2 rounded-xl dark:bg-darkGreen bg-pigmentGreen dark:text-white text-white hover:opacity-80 transition-opacity"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
/* Modal transition styles from previous components */
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