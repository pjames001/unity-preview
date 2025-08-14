<script setup>
import { ref, computed, watch } from 'vue';
import AddBreakType from '../components/breaks/AddBreakType.vue';

// --- Page State ---
const isAddBreakModalOpen = ref(false);

// Dummy break type data
const breakData = ref([
  {
    id: 1,
    name: 'Lunch Break',
    hours: 1,
    minutes: 0,
    isPaid: false,
    updatedAt: '2024-05-20',
  },
  {
    id: 2,
    name: 'Coffee Break',
    hours: 0,
    minutes: 15,
    isPaid: true,
    updatedAt: '2024-05-18',
  },
  {
    id: 3,
    name: 'Quick Break',
    hours: 0,
    minutes: 5,
    isPaid: true,
    updatedAt: '2024-05-18',
  },
]);

// State for multi-select checkboxes in the table
const selectedBreaks = ref([]);
const selectAll = computed({
  get: () =>
    breakData.value.length > 0 &&
    selectedBreaks.value.length === breakData.value.length,
  set: (value) => {
    selectedBreaks.value = value ? breakData.value.map((b) => b.id) : [];
  },
});

// State for individual actions dropdowns in the table
const activeActionsMenu = ref(null);

// --- Functions ---
const openAddBreakModal = () => {
  isAddBreakModalOpen.value = true;
};

const handleSaveBreak = (newBreak) => {
  console.log('New break to be saved:', newBreak);
  const newId =
    breakData.value.length > 0
      ? Math.max(...breakData.value.map((b) => b.id)) + 1
      : 1;
  breakData.value.push({
    ...newBreak,
    id: newId,
    updatedAt: new Date().toISOString().slice(0, 10),
  });
  isAddBreakModalOpen.value = false;
};

const toggleActionsMenu = (id) => {
  activeActionsMenu.value = activeActionsMenu.value === id ? null : id;
};

const editBreak = (id) => {
  console.log('Editing break with ID:', id);
  activeActionsMenu.value = null;
};

const deleteBreak = (id) => {
  console.log('Deleting break with ID:', id);
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
      <div class="flex justify-end flex-wrap items-center mb-6">
        <button
          @click="openAddBreakModal"
          class="dark:bg-darkGreen bg-pigmentGreen border dark:border-lightGreen border-lightGreen dark:text-lightGreen text-white font-bold px-4 py-2 rounded-xl shadow-outer"
        >
          Add Break Type
        </button>
      </div>

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
                <th class="px-4 py-2">Duration</th>
                <th class="px-4 py-2">Paid Break</th>
                <th class="px-4 py-2">Updated At</th>
                <th class="px-4 py-2 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="breakType in breakData"
                :key="breakType.id"
                class="border-t border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800"
              >
                <td class="px-4 py-2">
                  <input
                    type="checkbox"
                    :value="breakType.id"
                    v-model="selectedBreaks"
                    class="rounded"
                  />
                </td>
                <td class="px-4 py-2">{{ breakType.name }}</td>
                <td class="px-4 py-2">
                  {{ breakType.hours }}h {{ breakType.minutes }}m
                </td>
                <td class="px-4 py-2">{{ breakType.isPaid ? 'Yes' : 'No' }}</td>
                <td class="px-4 py-2">{{ breakType.updatedAt }}</td>
                <td class="px-4 py-2 text-center relative">
                  <div
                    class="inline-block relative"
                    v-click-outside="() => (activeActionsMenu = null)"
                  >
                    <button
                      @click.stop="toggleActionsMenu(breakType.id)"
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

                    <div
                      v-if="activeActionsMenu === breakType.id"
                      class="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg z-20 ring-1 ring-black ring-opacity-5"
                    >
                      <div class="py-1">
                        <button
                          @click="editBreak(breakType.id)"
                          class="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                        >
                          Edit
                        </button>
                        <button
                          @click="deleteBreak(breakType.id)"
                          class="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </section>
  </main>

  <AddBreakType
    :isOpen="isAddBreakModalOpen"
    @close="isAddBreakModalOpen = false"
    @save="handleSaveBreak"
  />
</template>