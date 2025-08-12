<script setup>
import { ref, computed } from 'vue';

const sortColumn = ref('');
const sortOrder = ref('asc');
const activeMenuId = ref(null);
const menuPosition = ref({ top: '0px', left: '0px' });
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
    dueDate: new Date('2025-08-01T10:00:00'),
    frequency: 'Weekly',
    notes: 'Check progress on contract',
    createdBy: 'Alice',
    completed: false
  },
  {
    id: 2,
    name: 'Send invoice',
    priority: 'Medium',
    dueDate: new Date('2025-07-29T14:00:00'),
    frequency: 'Monthly',
    notes: 'Invoice for July',
    createdBy: 'Bob',
    completed: true
  },
   {
    id: 3,
    name: 'Review project proposal',
    priority: 'High',
    dueDate: new Date('2025-08-05T17:00:00'),
    frequency: 'Once',
    notes: 'Urgent review',
    createdBy: 'Charlie',
    completed: false
  },
  {
    id: 4,
    name: 'Update client records',
    priority: 'Low',
    dueDate: new Date('2025-08-15T09:00:00'),
    frequency: 'Bi-annually',
    notes: 'New contact information',
    createdBy: 'Dave',
    completed: false
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
  const now = new Date();
  if (filterStatus.value === 'completed') {
    result = result.filter(r => r.completed);
  } else if (filterStatus.value === 'not-completed') {
    result = result.filter(r => !r.completed && r.dueDate > now);
  } else if (filterStatus.value === 'failed-to-complete') {
    result = result.filter(r => !r.completed && r.dueDate <= now);
  }

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

const toggleMenu = (id, event) => {
  if (activeMenuId.value === id) {
    activeMenuId.value = null;
  } else {
    const rect = event.currentTarget.getBoundingClientRect();
    activeMenuId.value = id;
    menuPosition.value = {
        top: `${rect.bottom + window.scrollY}px`,
        left: `${rect.left + window.scrollX}px`,
    };
  }
};

const markAsComplete = () => {
  const reminder = reminders.value.find(r => r.id === activeMenuId.value);
  if (reminder) {
    reminder.completed = true;
    activeMenuId.value = null; // Close the menu
  }
};

const deleteReminder = () => {
  reminders.value = reminders.value.filter(r => r.id !== activeMenuId.value);
  activeMenuId.value = null; // Close the menu
};

const formatDate = (date) => {
  return new Date(date).toLocaleDateString();
};

const formatTime = (date) => {
  return new Date(date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

const buttonClass = (active) =>
  `px-3 py-1 text-sm rounded-md ${active ? 'bg-blue-600 text-white' : 'bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-100 hover:bg-gray-300 dark:hover:bg-gray-500'}`;

const vClickOutside = {
  mounted(el, binding) {
    el.clickOutsideEvent = (event) => {
      if (!(el === event.target || el.contains(event.target))) {
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
  <section class="p-6 my-10 w-full rounded-xl shadow-outer dark:bg-darkBrown bg-warmYellow/70 border border-darkOrange">
    <div class="p-4 bg-white dark:bg-gray-900 rounded-xl shadow-md">
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
          <button
            @click="filterStatus = 'failed-to-complete'"
            :class="buttonClass(filterStatus === 'failed-to-complete')"
          >Failed to Complete</button>
        </div>
      </div>

      <div class="mb-4">
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Search all reminders..."
          class="w-full px-3 py-2 border rounded-md dark:bg-gray-800 dark:text-white dark:border-gray-600 outline-none"
        />
      </div>

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
              class="border-t dark:bg-darkBlue bg-white border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800 relative"
            >
              <td class="px-4 py-2">{{ reminder.name }}</td>
              <td class="px-4 py-2">{{ reminder.priority }}</td>
              <td class="px-4 py-2">
                {{ formatDate(reminder.dueDate) }} {{ formatTime(reminder.dueDate) }}
              </td>
              <td class="px-4 py-2">{{ reminder.frequency }}</td>
              <td class="px-4 py-2">{{ reminder.notes }}</td>
              <td class="px-4 py-2">{{ reminder.createdBy }}</td>
              <td class="px-4 py-2 text-center">
                <div class="inline-block relative">
                    <button @click.stop="toggleMenu(reminder.id, $event)">
                        <v-icon name="bi-three-dots-vertical" class="w-5 h-5 text-gray-500 hover:text-gray-800 dark:hover:text-white" />
                    </button>
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

  <Teleport to="body">
    <div
      v-if="activeMenuId !== null"
      class="fixed w-32 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 shadow-lg rounded-md z-[9999] ring-1 ring-black ring-opacity-5"
      :style="{ top: menuPosition.top, left: menuPosition.left }"
      v-click-outside="() => (activeMenuId = null)"
    >
      <ul class="text-sm text-gray-700 dark:text-gray-200 py-1">
        <li 
          v-if="!reminders.find(r => r.id === activeMenuId)?.completed"
          @click="markAsComplete"
          class="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 cursor-pointer"
        >
          Complete
        </li>
        <li class="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 cursor-pointer">Edit</li>
        <li 
          v-if="!reminders.find(r => r.id === activeMenuId)?.completed"
          @click="deleteReminder"
          class="px-4 py-2 hover:bg-red-500 hover:text-white dark:hover:bg-red-600 cursor-pointer"
        >
          Delete
        </li>
      </ul>
    </div>
  </Teleport>
</template>