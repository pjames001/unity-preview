<script setup>
import { ref, computed } from 'vue';

const tabs = ['Pending', 'Approved', 'Rejected'];
const activeTab = ref('Pending');
const searchQuery = ref('');
const sortColumn = ref(null);
const sortOrder = ref('asc');

const columns = [
  { key: 'start', label: 'Start Date' },
  { key: 'end', label: 'End Date' },
  { key: 'description', label: 'Description' },
  { key: 'status', label: 'Status' },
];

// Mock data
const allData = ref([
  {
    id: 1,
    start: '2025-08-01',
    end: '2025-08-03',
    description: 'Medical Leave',
    status: 'Pending',
  },
  {
    id: 2,
    start: '2025-08-05',
    end: '2025-08-07',
    description: 'Family Emergency',
    status: 'Approved',
  },
  {
    id: 3,
    start: '2025-08-08',
    end: '2025-08-10',
    description: 'Travel',
    status: 'Rejected',
  },
]);

const filteredSortedData = computed(() => {
  let filtered = allData.value.filter(
    (item) =>
      item.status === activeTab.value &&
      (item.description.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
        item.start.includes(searchQuery.value) ||
        item.end.includes(searchQuery.value))
  );

  if (sortColumn.value) {
    filtered.sort((a, b) => {
      const aVal = a[sortColumn.value];
      const bVal = b[sortColumn.value];

      if (sortOrder.value === 'asc') return aVal > bVal ? 1 : -1;
      else return aVal < bVal ? 1 : -1;
    });
  }

  return filtered;
});

function toggleSort(column) {
  if (sortColumn.value === column) {
    sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc';
  } else {
    sortColumn.value = column;
    sortOrder.value = 'asc';
  }
}
</script>

<template>
  <main class="view dark:bg-darkBlue bg-white">
    <section class="max-w-[1600px] mx-auto mt-10 rounded-xl shadow-outer dark:bg-darkPurple bg-[rgba(90,169,230,.35)] border dark:border-lightBlue border-clientPurple px-8 py-4 transition-all duration-300 ease">
      <div class="flex justify-between flex-wrap items-center mb-6">
        <div class="flex gap-2">
          <button
            v-for="tab in tabs"
            :key="tab"
            @click="activeTab = tab"
            :class="[
              'px-4 py-2 rounded-lg font-semibold transition-all',
              activeTab === tab
                ? 'dark:bg-darkBrown bg-warmYellow/70 border border-darkOrange dark:text-darkOrange text-white shadow-inner'
                : 'bg-gray-200 text-gray-700 dark:bg-gray-800 dark:text-gray-300 shadow-outer',
            ]"
          >
            {{ tab }}
          </button>
        </div>
      </div>

      <!-- Search -->
      <div class="mb-4">
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Search leave requests..."
          class="w-full md:w-1/3 px-3 py-2 border rounded-md dark:bg-gray-800 dark:text-white dark:border-gray-600 outline-none"
        />
      </div>

      <!-- Table -->
      <Transition name="fade" mode="out-in">
        <div :key="activeTab" class="p-4 bg-white dark:bg-gray-900 rounded-xl shadow-md">
          <div class="overflow-x-auto">
            <table class="w-full text-left border border-gray-300 dark:border-gray-600 rounded-md overflow-hidden">
              <thead class="bg-gray-100 dark:bg-gray-800 text-sm text-gray-700 dark:text-gray-200">
                <tr>
                  <th
                    v-for="column in columns"
                    :key="column.key"
                    class="px-4 py-2 cursor-pointer"
                    @click="toggleSort(column.key)"
                  >
                    {{ column.label }}
                    <v-icon
                      name="md-keyboardarrowup"
                      class="inline-block ml-1 -mt-1"
                      :class="{
                        'rotate-180': sortColumn === column.key && sortOrder === 'desc',
                        'text-blue-500': sortColumn === column.key,
                      }"
                    />
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="item in filteredSortedData"
                  :key="item.id"
                  class="border-t border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800"
                >
                  <td class="px-4 py-2">{{ item.start }}</td>
                  <td class="px-4 py-2">{{ item.end }}</td>
                  <td class="px-4 py-2">{{ item.description }}</td>
                  <td class="px-4 py-2">{{ item.status }}</td>
                </tr>
                <tr v-if="filteredSortedData.length === 0">
                  <td colspan="4" class="text-center py-4 text-gray-500 dark:text-gray-400">
                    No leave requests found.
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </Transition>
    </section>
  </main>
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