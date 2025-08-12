<script setup>
import { ref, computed } from 'vue';

const sortColumn = ref('');
const sortOrder = ref('asc');
const openMenu = ref(null);
const filterStatus = ref('all');
const searchQuery = ref('');

const columns = [
  { key: 'name', label: 'Name' },
  { key: 'priority', label: 'Priority' },
  { key: 'dueDate', label: 'Due Date' },
  { key: 'frequency', label: 'Frequency' },
  { key: 'notes', label: 'Notes' },
  { key: 'createdBy', label: 'Created By' }
];

const reminders = ref([
  {
    id: 1,
    name: 'Follow up with John',
    priority: 'High',
    dueDate: new Date(),
    frequency: 'Weekly',
    notes: 'Check progress on contract',
    createdBy: 'Alice',
    completed: false
  },
  {
    id: 2,
    name: 'Send invoice',
    priority: 'Medium',
    dueDate: new Date(),
    frequency: 'Monthly',
    notes: 'Invoice for July',
    createdBy: 'Bob',
    completed: true
  }
]);

const filteredReminders = computed(() => {
  let result = [...reminders.value];

  //search logic
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    result = result.filter(r =>
      r.name.toLowerCase().includes(query) ||
      r.priority.toLowerCase().includes(query) ||
      r.frequency.toLowerCase().includes(query) ||
      r.notes.toLowerCase().includes(query) ||
      r.createdBy.toLowerCase().includes(query)
    );
  }
  
  //filtering logic
  if (filterStatus.value === 'completed') {
    result = result.filter(r => r.completed);
  } else if (filterStatus.value === 'not-completed') {
    result = result.filter(r => !r.completed);
  }
  // no filter is applied if filterStatus is 'all'

  if (sortColumn.value) {
    result.sort((a, b) => {
      const valA = a[sortColumn.value];
      const valB = b[sortColumn.value];

      if (valA === valB) return 0;
      return (valA > valB ? 1 : -1) * (sortOrder.value === 'asc' ? 1 : -1);
    });
  }

  return result;
});

const toggleSort = (column) => {
  if (sortColumn.value === column) {
    sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc';
  } else {
    sortColumn.value = column;
    sortOrder.value = 'asc';
  }
};

const toggleMenu = (id) => {
  openMenu.value = openMenu.value === id ? null : id;
};

const formatDate = (date) => {
  return new Date(date).toLocaleDateString();
};

const formatTime = (date) => {
  return new Date(date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

const buttonClass = (active) =>
  `px-3 py-1 text-sm rounded-md ${active ? 'bg-blue-600 text-white' : 'bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-100 hover:bg-gray-300 dark:hover:bg-gray-500'}`;
</script>



<template>
  <section class="p-6 my-10 w-full rounded-xl shadow-outer dark:bg-darkBrown bg-warmYellow/70 border border-darkOrange">
    <div class="p-4 bg-white dark:bg-gray-900 rounded-xl shadow-md">
      <!-- Top Controls -->
      <div class="flex justify-between items-center mb-4">
        <button class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm">Add Reminder</button>
        <div class="space-x-2">
          <button
            @click="filterStatus = 'all'"
            :class="buttonClass(filterStatus === 'all')"
          >All Reminders</button>
          <button
            @click="filterStatus = 'not-completed'"
            :class="buttonClass(filterStatus === 'not-completed')"
          >Not Completed</button>
          <button
            @click="filterStatus = 'completed'"
            :class="buttonClass(filterStatus === 'completed')"
          >Completed</button>
        </div>
      </div>

      <!-- search bar -->
      <div class="mb-4">
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Search all reminders..."
          class="w-full px-3 py-2 border rounded-md dark:bg-gray-800 dark:text-white dark:border-gray-600 outline-none"
        />
      </div>

      <!-- Table -->
      <div class="overflow-x-auto">
        <table class="w-full text-left border border-gray-300 dark:border-gray-600 rounded-md overflow-hidden">
          <thead class="bg-gray-100 dark:bg-gray-800 text-sm text-gray-700 dark:text-gray-200">
            <tr>
              <th v-for="col in columns" :key="col.key" class="px-4 py-2 cursor-pointer" @click="toggleSort(col.key)">
                {{ col.label }}
                <v-icon
                  name="md-keyboardarrowup"
                  :class="{ 'rotate-180': sortColumn === col.key && sortOrder === 'desc' }"
                  class="inline-block ml-1 transition-transform"
                />
              </th>
              <th class="px-4 py-2 text-center">Actions</th>
            </tr>
          </thead>

          <tbody>
            <tr
              v-for="reminder in filteredReminders"
              :key="reminder.id"
              class="border-t dark:bg-darkBlue bg-white border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800"
            >
              <td class="px-4 py-2">{{ reminder.name }}</td>
              <td class="px-4 py-2">{{ reminder.priority }}</td>
              <td class="px-4 py-2">
                {{ formatDate(reminder.dueDate) }} {{ formatTime(reminder.dueDate) }}
              </td>
              <td class="px-4 py-2">{{ reminder.frequency }}</td>
              <td class="px-4 py-2">{{ reminder.notes }}</td>
              <td class="px-4 py-2">{{ reminder.createdBy }}</td>
              <td class="px-4 py-2 text-center relative">
                <button @click="toggleMenu(reminder.id)">
                  <v-icon name="bi-three-dots-vertical" class="w-5 h-5 text-gray-500 hover:text-gray-800 dark:hover:text-white" />
                </button>
                <div
                  v-if="openMenu === reminder.id"
                  class="absolute right-0 mt-2 w-32 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 shadow-lg rounded-md z-10"
                >
                  <ul class="text-sm text-gray-700 dark:text-gray-200">
                    <li class="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 cursor-pointer">Edit</li>
                    <li class="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 cursor-pointer">Delete</li>
                  </ul>
                </div>
              </td>
            </tr>

            <tr v-if="filteredReminders.length === 0">
              <td colspan="7" class="text-center py-4 text-gray-500 dark:text-gray-400">
                No reminders found.
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </section>
</template>

