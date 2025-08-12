<script setup>
import { defineProps, ref } from 'vue';

// Define props passed from the parent component
const props = defineProps({
  leaveData: {
    type: Array,
    required: true,
  },
});

// State for the pop-up modal
const isModalOpen = ref(false);
const currentEmployee = ref(null);
const allocatedDays = ref(0);
const carriedForwardDays = ref(0);

// Function to open the modal and populate data
const openEditModal = (employee) => {
  currentEmployee.value = employee;
  // Use the total allocated and carried forward values for the initial fields
  allocatedDays.value = employee.totalAllocated;
  carriedForwardDays.value = employee.totalCarriedForward;
  isModalOpen.value = true;
};

// Function to close the modal
const closeModal = () => {
  isModalOpen.value = false;
  currentEmployee.value = null;
  allocatedDays.value = 0;
  carriedForwardDays.value = 0;
};

// Function to handle saving the balances (for demonstration)
const saveBalances = () => {
  console.log(`Saving new balances for ${currentEmployee.value.employeeName}`);
  console.log('New Allocated Days:', allocatedDays.value);
  console.log('New Carried Forward Days:', carriedForwardDays.value);
  
  // Here you would typically emit an event or call an API to update the data
  // For this example, we'll just close the modal
  closeModal();
};
</script>

<template>
  <div class="p-4 bg-white dark:bg-gray-900 rounded-xl shadow-md">
    <!-- Message for no data -->
    <div v-if="leaveData.length === 0" class="text-center py-4 text-gray-500 dark:text-gray-400">
      No employee leave data found.
    </div>

    <!-- Employee details card -->
    <div v-for="employee in leaveData" :key="employee.id"
      class="mb-6 border border-gray-400 dark:border-gray-700 rounded-xl p-4">
      <div class="flex justify-between items-start flex-wrap gap-4 mb-4">
        <div>
          <p class="text-lg font-bold text-gray-800 dark:text-white">
            {{ employee.employeeName }}
          </p>
          <p class="text-sm text-gray-600 dark:text-gray-400">
            Department: {{ employee.department }} | Position:
            {{ employee.position }} | Gender: {{ employee.gender }}
          </p>
        </div>
        <div class="flex gap-4 text-sm font-semibold text-gray-800 dark:text-white">
          <span>Allocated: {{ employee.totalAllocated }}</span>
          <span>Used: {{ employee.totalUsed }}</span>
          <span>Carried Forward: {{ employee.totalCarriedForward }}</span>
          <span>Remaining: {{ employee.totalRemaining }}</span>
        </div>
      </div>

      <!-- Leave details table -->
      <div class="overflow-x-auto">
        <table class="w-full text-left border border-gray-300 dark:border-gray-600 rounded-md overflow-hidden">
          <thead class="bg-gray-100 dark:bg-gray-800 text-sm text-gray-700 dark:text-gray-200">
            <tr>
              <th class="px-4 py-2">Leave Type</th>
              <th class="px-4 py-2">Allocated</th>
              <th class="px-4 py-2">Used</th>
              <th class="px-4 py-2">Carried Forward</th>
              <th class="px-4 py-2">Remaining</th>
              <th class="px-4 py-2">Status</th>
              <th class="px-4 py-2 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="leave in employee.leaveDetails" :key="leave.leaveType"
              class="border-t border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800">
              <td class="px-4 py-2">{{ leave.leaveType }}</td>
              <td class="px-4 py-2">{{ leave.allocated.toFixed(1) }}</td>
              <td class="px-4 py-2">{{ leave.used.toFixed(1) }}</td>
              <td class="px-4 py-2">{{ leave.carriedForward.toFixed(1) }}</td>
              <td class="px-4 py-2">{{ leave.remaining.toFixed(1) }}</td>
              <td class="px-4 py-2">
                <span :class="{
                  'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-200':
                    leave.status === 'Active',
                  'bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-200':
                    leave.status === 'Inactive',
                }" class="px-2 py-1 rounded-full text-xs font-semibold">{{ leave.status }}</span>
              </td>
              <td class="px-4 py-2 text-center">
                <button @click="openEditModal(employee)"
                  class="text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-600">
                  Edit
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>

  <!-- Pop-up Modal with Transition -->
  <Transition name="modal">
    <div v-if="isModalOpen"
      class="fixed inset-0 z-50 backdrop-blur-sm flex items-center justify-center bg-gray-900 bg-opacity-50 dark:bg-gray-900 dark:bg-opacity-80">
      <div class="relative bg-white dark:bg-gray-800 rounded-xl shadow-2xl p-6 w-full max-w-md">
        <div class="flex justify-between items-center mb-4">
          <h3 class="text-xl font-bold text-gray-800 dark:text-white">
            Create Leave Balance for {{ currentEmployee?.employeeName }}
          </h3>
          <button @click="closeModal" class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
            <!-- Close icon SVG -->
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24"
              stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div class="space-y-4">
          <!-- Allocated Days Input -->
          <div>
            <label for="allocatedDays" class="block text-sm font-medium text-gray-700 dark:text-gray-200">
              Allocated Days
            </label>
            <input type="number" id="allocatedDays" v-model="allocatedDays"
              class="mt-1 px-3 py-2 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm dark:bg-gray-700 dark:text-white outline-none"
              step="0.5" />
          </div>

          <!-- Carried Forward Days Input -->
          <div>
            <label for="carriedForwardDays" class="block text-sm font-medium text-gray-700 dark:text-gray-200">
              Carried Forward Days
            </label>
            <input type="number" id="carriedForwardDays" v-model="carriedForwardDays"
              class="mt-1 px-3 py-2 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm dark:bg-gray-700 dark:text-white outline-none"
              step="0.5" />
          </div>
        </div>

        <!-- Modal Actions -->
        <div class="mt-6 flex justify-end gap-2">
          <button @click="closeModal"
            class="px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md shadow-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700">
            Cancel
          </button>
          <button @click="saveBalances"
            class="px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700">
            Save
          </button>
        </div>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
/* Define the transition styles */
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-active .relative,
.modal-leave-active .relative {
  transition: transform 0.3s cubic-bezier(0.68, -0.55, 0.27, 1.55);
}

.modal-enter-from .relative,
.modal-leave-to .relative {
  transform: scale(0.9);
}
</style>