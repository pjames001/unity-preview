<script setup>
import { ref, computed, watch } from 'vue';

const searchQuery = ref('');
const sortColumn = ref('');
const sortOrder = ref('asc');
const openMenu = ref(null);
const selectAll = ref(false);
const selectedIds = ref([]);

const columns = [
  { key: 'firstName', label: 'First Name' },
  { key: 'middleName', label: 'Middle Name' },
  { key: 'lastName', label: 'Last Name' },
  { key: 'title', label: 'Title' },
  { key: 'email', label: 'Email' },
  { key: 'phone', label: 'Phone Number' },
  { key: 'address', label: 'Address' },
  { key: 'state', label: 'State' }
];

const contacts = ref([
  {
    id: 1,
    firstName: 'John',
    middleName: 'A.',
    lastName: 'Doe',
    title: 'Manager',
    email: 'john.doe@example.com',
    phone: '(555) 123-4567',
    address: '123 Main St',
    state: 'California'
  },
  {
    id: 2,
    firstName: 'Jane',
    middleName: 'B.',
    lastName: 'Smith',
    title: 'Director',
    email: 'jane.smith@example.com',
    phone: '(555) 987-6543',
    address: '456 Oak Ave',
    state: 'Texas'
  },
  {
    id: 3,
    firstName: 'John',
    middleName: 'A.',
    lastName: 'Doe',
    title: 'Manager',
    email: 'john.doe@example.com',
    phone: '(555) 123-4567',
    address: '123 Main St',
    state: 'California'
  },
  {
    id: 4,
    firstName: 'Jane',
    middleName: 'B.',
    lastName: 'Smith',
    title: 'Director',
    email: 'jane.smith@example.com',
    phone: '(555) 987-6543',
    address: '456 Oak Ave',
    state: 'Texas'
  }
]);

watch(selectAll, () => {
  if (selectAll.value) {
    selectedIds.value = contacts.value.map(c => c.id);
  } else {
    selectedIds.value = [];
  }
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

const filteredContacts = computed(() => {
  let result = [...contacts.value];

  if (searchQuery.value) {
    const q = searchQuery.value.toLowerCase();
    result = result.filter(contact =>
      Object.values(contact).some(val =>
        typeof val === 'string' && val.toLowerCase().includes(q)
      )
    );
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
</script>
<template>
  <section class="p-6 my-10 w-full rounded-xl shadow-outer dark:bg-darkBrown bg-warmYellow/70 border border-darkOrange">
    <div class="p-4 bg-white dark:bg-gray-900 rounded-xl shadow-md">
      <!-- Top Controls -->
      <div class="flex justify-between items-center mb-4">
        <button class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm">Add Contact</button>
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Search..."
          class="px-3 py-2 border rounded-md text-sm dark:bg-gray-800 dark:text-white dark:border-gray-600 outline-none"
        />
      </div>

      <!-- Table -->
      <div class="overflow-x-auto">
        <table class="w-full text-left border border-gray-300 dark:border-gray-600 rounded-md overflow-hidden">
          <thead class="bg-gray-100 dark:bg-gray-800 text-sm text-gray-700 dark:text-gray-200">
            <tr>
              <th class="px-4 py-2">
                <input type="checkbox" v-model="selectAll" @change="toggleAll" />
              </th>
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
              v-for="contact in filteredContacts"
              :key="contact.id"
              class="border-t dark:bg-darkBlue bg-white border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800"
            >
              <td class="px-4 py-2">
                <input type="checkbox" v-model="selectedIds" :value="contact.id" />
              </td>
              <td class="px-4 py-2">{{ contact.firstName }}</td>
              <td class="px-4 py-2">{{ contact.middleName }}</td>
              <td class="px-4 py-2">{{ contact.lastName }}</td>
              <td class="px-4 py-2">{{ contact.title }}</td>
              <td class="px-4 py-2">{{ contact.email }}</td>
              <td class="px-4 py-2">{{ contact.phone }}</td>
              <td class="px-4 py-2">{{ contact.address }}</td>
              <td class="px-4 py-2">{{ contact.state }}</td>
              <td class="px-4 py-2 text-center relative">
                <button @click="toggleMenu(contact.id)">
                  <v-icon name="bi-three-dots-vertical" class="w-5 h-5 text-gray-500 hover:text-gray-800 dark:hover:text-white" />
                </button>
                <div
                  v-if="openMenu === contact.id"
                  class="absolute right-0 mt-2 w-32 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 shadow-lg rounded-md z-10"
                >
                  <ul class="text-sm text-gray-700 dark:text-gray-200">
                    <li class="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 cursor-pointer">Edit</li>
                    <li class="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 cursor-pointer">Delete</li>
                  </ul>
                </div>
              </td>
            </tr>

            <tr v-if="filteredContacts.length === 0">
              <td colspan="11" class="text-center py-4 text-gray-500 dark:text-gray-400">
                No contacts found.
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </section>
</template>

