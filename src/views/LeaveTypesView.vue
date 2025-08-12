<script setup>
import { ref, computed } from 'vue';
import CreateLeaveTypeModal from '../components/leave-types/CreateLeaveType.vue';

const isModalOpen = ref(false);
const sortColumn = ref('');
const sortOrder = ref('asc');
const openMenu = ref(null);
const selectedItems = ref([]);

const leaveTypes = ref([
  {
    id: 1,
    name: 'Vacation',
    description: 'Annual paid leave',
    days: 15,
    payment: 'Paid',
    gender: 'Both',
    carryFwd: true,
    accrued: true,
    anniversary: 'January',
    updatedAt: '2025-08-01',
    createdBy: 'Admin',
  },
  {
    id: 2,
    name: 'Sick Leave',
    description: 'For personal illness',
    days: 10,
    payment: 'Paid',
    gender: 'Both',
    carryFwd: false,
    accrued: true,
    anniversary: 'January',
    updatedAt: '2025-07-25',
    createdBy: 'Admin',
  },
  {
    id: 3,
    name: 'Maternity Leave',
    description: 'Leave for new mothers',
    days: 90,
    payment: 'Paid',
    gender: 'Female',
    carryFwd: false,
    accrued: false,
    anniversary: 'N/A',
    updatedAt: '2025-07-20',
    createdBy: 'Admin',
  },
  {
    id: 4,
    name: 'Unpaid Leave',
    description: 'Extended leave without pay',
    days: 30,
    payment: 'Unpaid',
    gender: 'Both',
    carryFwd: false,
    accrued: false,
    anniversary: 'N/A',
    updatedAt: '2025-07-15',
    createdBy: 'Admin',
  },
]);

const columns = [
  { key: 'name', label: 'Name' },
  { key: 'description', label: 'Description' },
  { key: 'days', label: 'Days' },
  { key: 'payment', label: 'Payment' },
  { key: 'gender', label: 'Gender' },
  { key: 'carryFwd', label: 'Carry Fwd' },
  { key: 'accrued', label: 'Accrued' },
  { key: 'anniversary', label: 'Anniversary' },
  { key: 'updatedAt', label: 'Updated At' },
  { key: 'createdBy', label: 'Created By' },
];

const sortedLeaveTypes = computed(() => {
  let result = [...leaveTypes.value];
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

const isAllSelected = computed(() => {
  return selectedItems.value.length === leaveTypes.value.length && leaveTypes.value.length > 0;
});

const toggleSelectAll = () => {
  if (isAllSelected.value) {
    selectedItems.value = [];
  } else {
    selectedItems.value = leaveTypes.value.map(item => item.id);
  }
};

const toggleSelectItem = (id) => {
  const index = selectedItems.value.indexOf(id);
  if (index === -1) {
    selectedItems.value.push(id);
  } else {
    selectedItems.value.splice(index, 1);
  }
};

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

// Directive to handle clicks outside the dropdown menu
const vClickOutside = {
  mounted(el, binding) {
    el.clickOutsideEvent = (event) => {
      // Check if the clicked element is not a child of the dropdown button
      if (!el.parentNode.contains(event.target)) {
        binding.value();
      }
    };
    document.addEventListener('click', el.clickOutsideEvent);
  },
  unmounted(el) {
    document.removeEventListener('click', el.clickOutsideEvent);
  },
};

const createLeaveType = () => {
  isModalOpen.value = true;
};

const editItem = (item) => {
  console.log('Edit item:', item);
  toggleMenu(null); // Close the menu
};

const deleteItem = (item) => {
  console.log('Delete item:', item);
  toggleMenu(null); // Close the menu
};
</script>

<template>
  <main class="view dark:bg-darkBlue bg-white">
    <section
      class="max-w-[1700px] mx-auto mt-10 rounded-xl shadow-outer dark:bg-darkPurple bg-[rgba(90,169,230,.35)] border dark:border-lightBlue border-clientPurple px-8 py-4 transition-all duration-300 ease">
      <div class="flex justify-between flex-wrap items-center mb-6">
        <div class="flex gap-2">
        </div>
        <button @click="createLeaveType"
          class="dark:bg-darkGreen bg-pigmentGreen border dark:border-lightGreen border-lightGreen dark:text-lightGreen text-white font-bold px-4 py-2 rounded-xl shadow-outer">
          Create Leave Type
        </button>
      </div>

      <div class="p-4 bg-white dark:bg-gray-900 rounded-xl shadow-md">
        <div class="overflow-x-auto">
          <table class="w-full text-left border border-gray-300 dark:border-gray-600 rounded-md overflow-hidden">
            <thead class="bg-gray-100 dark:bg-gray-800 text-sm text-gray-700 dark:text-gray-200">
              <tr>
                <th class="px-4 py-2">
                  <input type="checkbox" :checked="isAllSelected" @change="toggleSelectAll"
                    class="form-checkbox text-blue-500 rounded-sm" />
                </th>
                <th v-for="column in columns" :key="column.key" class="px-4 py-2 cursor-pointer"
                  @click="toggleSort(column.key)">
                  {{ column.label }}
                  <v-icon name="md-keyboardarrowup" class="inline-block ml-1 -mt-1" :class="{
                    'rotate-180': sortColumn === column.key && sortOrder === 'desc',
                    'text-blue-500': sortColumn === column.key,
                  }" />
                </th>
                <th class="px-4 py-2 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in sortedLeaveTypes" :key="item.id"
                class="border-t border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800">
                <td class="px-4 py-2">
                  <input type="checkbox" :checked="selectedItems.includes(item.id)" @change="toggleSelectItem(item.id)"
                    class="form-checkbox text-blue-500 rounded-sm" />
                </td>
                <td class="px-4 py-2">{{ item.name }}</td>
                <td class="px-4 py-2">{{ item.description }}</td>
                <td class="px-4 py-2">{{ item.days }}</td>
                <td class="px-4 py-2">{{ item.payment }}</td>
                <td class="px-4 py-2">{{ item.gender }}</td>
                <td class="px-4 py-2">{{ item.carryFwd ? 'Yes' : 'No' }}</td>
                <td class="px-4 py-2">{{ item.accrued ? 'Yes' : 'No' }}</td>
                <td class="px-4 py-2">{{ item.anniversary }}</td>
                <td class="px-4 py-2">{{ item.updatedAt }}</td>
                <td class="px-4 py-2">{{ item.createdBy }}</td>
                <td class="px-4 py-2 text-center relative">
                  <button @click.stop="toggleMenu(item.id)">
                    <v-icon name="bi-three-dots-vertical"
                      class="w-5 h-5 text-gray-500 hover:text-gray-800 dark:hover:text-white" />
                  </button>
                  <div v-if="openMenu === item.id" v-click-outside="() => toggleMenu(null)"
                    class="absolute right-0 mt-2 w-32 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 shadow-lg rounded-md z-10">
                    <ul class="text-sm text-gray-700 dark:text-gray-200">
                      <li class="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 cursor-pointer"
                        @click="editItem(item)">Edit</li>
                      <li class="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 cursor-pointer"
                        @click="deleteItem(item)">Delete</li>
                    </ul>
                  </div>
                </td>
              </tr>
              <tr v-if="leaveTypes.length === 0">
                <td colspan="12" class="text-center py-4 text-gray-500 dark:text-gray-400">
                  No leave types found.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </section>
  </main>
  <CreateLeaveTypeModal
    :isOpen="isModalOpen"
    @close="isModalOpen = false"
    @save="handleSave"
  />
</template>

