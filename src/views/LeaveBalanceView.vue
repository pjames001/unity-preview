<script setup>
import { ref, computed } from 'vue';
import EmployeeLeaveBalances from '../components/leave-balance/EmployeeLeaveBalances.vue'


const selectedYear = ref(new Date().getFullYear());
const selectedDepartments = ref([]);
const selectedEmployees = ref([]);
const searchQuery = ref('');
const openDepartmentMenu = ref(false);
const openEmployeeMenu = ref(false);

const departments = ref(['HR', 'Engineering', 'Sales', 'Marketing']);
const employees = ref(['John Doe', 'Jane Smith', 'Peter Jones', 'Mary Williams']);

const leaveData = ref([
  {
    id: 1,
    employeeName: 'John Doe',
    department: 'Engineering',
    position: 'Software Engineer',
    gender: 'Male',
    totalAllocated: 25.0,
    totalUsed: 10.5,
    totalCarriedForward: 5.0,
    totalRemaining: 19.5,
    leaveDetails: [
      {
        leaveType: 'Annual Leave (Paid)',
        allocated: 20.0,
        used: 10.0,
        carriedForward: 5.0,
        remaining: 15.0,
        status: 'Active',
      },
      {
        leaveType: 'Paternity Leave (Paid)',
        allocated: 5.0,
        used: 0.5,
        carriedForward: 0.0,
        remaining: 4.5,
        status: 'Active',
      },
    ],
  },
  {
    id: 2,
    employeeName: 'Jane Smith',
    department: 'HR',
    position: 'HR Manager',
    gender: 'Female',
    totalAllocated: 30.0,
    totalUsed: 15.0,
    totalCarriedForward: 8.0,
    totalRemaining: 23.0,
    leaveDetails: [
      {
        leaveType: 'Annual Leave (Paid)',
        allocated: 25.0,
        used: 15.0,
        carriedForward: 8.0,
        remaining: 18.0,
        status: 'Active',
      },
      {
        leaveType: 'Maternity Leave (Paid)',
        allocated: 5.0,
        used: 0.0,
        carriedForward: 0.0,
        remaining: 5.0,
        status: 'Active',
      },
    ],
  },
]);

// Computed property for the current year and 10 past years
const years = computed(() => {
  const currentYear = new Date().getFullYear();
  const yearsArray = [];
  for (let year = currentYear; year >= currentYear - 10; year--) {
    yearsArray.push(year);
  }
  return yearsArray;
});

// Computed property to filter leave data based on user selections
const filteredLeaveData = computed(() => {
  let result = leaveData.value;

  if (selectedDepartments.value.length > 0) {
    result = result.filter((item) =>
      selectedDepartments.value.includes(item.department)
    );
  }

  if (selectedEmployees.value.length > 0) {
    result = result.filter((item) =>
      selectedEmployees.value.includes(item.employeeName)
    );
  }

  if (searchQuery.value) {
    result = result.filter((item) =>
      item.employeeName.toLowerCase().includes(searchQuery.value.toLowerCase())
    );
  }

  return result;
});

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

// -- Generate Leave Balances Modal State and Functions --
const isGenerateModalOpen = ref(false);
const generateYear = ref(new Date().getFullYear() + 1);
const useBackgroundProcessing = ref(false);

const futureYears = computed(() => {
  const currentYear = new Date().getFullYear();
  const yearsArray = [];
  for (let year = currentYear + 1; year <= currentYear + 5; year++) { // Show next 5 years
    yearsArray.push(year);
  }
  return yearsArray;
});

const openGenerateModal = () => {
  isGenerateModalOpen.value = true;
};

const closeGenerateModal = () => {
  isGenerateModalOpen.value = false;
};

const handleGenerateBalances = () => {
  console.log(`Generating leave balances for year: ${generateYear.value}`);
  console.log(`Using background processing: ${useBackgroundProcessing.value}`);
  // Here you would implement the actual generation logic
  closeGenerateModal();
};

// -- Import Carried Forward Modal State and Functions --
const isImportModalOpen = ref(false);
const importYear = ref(new Date().getFullYear());
const csvFile = ref(null);

const openImportModal = () => {
  isImportModalOpen.value = true;
};

const closeImportModal = () => {
  isImportModalOpen.value = false;
  // Reset the file input when the modal is closed
  csvFile.value = null;
};

const handleImportCarriedForward = () => {
  console.log(`Importing carried forward balances for year: ${importYear.value}`);
  if (csvFile.value) {
    console.log(`File to be uploaded: ${csvFile.value.name}`);
    // Here you would add the logic to parse and process the CSV file
  } else {
    console.log('No file selected.');
  }
  closeImportModal();
};

const handleDownloadTemplate = () => {
  console.log('Downloading template...');
  // Here you would trigger the file download
};

const handleFileUpload = (event) => {
  csvFile.value = event.target.files[0];
};

// Functions for multi-select dropdowns
const toggleDepartmentSelection = (department) => {
  const index = selectedDepartments.value.indexOf(department);
  if (index === -1) {
    selectedDepartments.value.push(department);
  } else {
    selectedDepartments.value.splice(index, 1);
  }
};

const toggleEmployeeSelection = (employee) => {
  const index = selectedEmployees.value.indexOf(employee);
  if (index === -1) {
    selectedEmployees.value.push(employee);
  } else {
    selectedEmployees.value.splice(index, 1);
  }
};

</script>

<template>
  <main class="view dark:bg-darkBlue bg-white">
    <section
      class="max-w-[1700px] mx-auto mt-10 rounded-xl shadow-outer dark:bg-darkPurple bg-[rgba(90,169,230,.35)] border dark:border-lightBlue border-clientPurple px-8 py-4 transition-all duration-300 ease">
      
      <!-- Top buttons -->
      <div class="flex justify-end flex-wrap items-center mb-6">
        <div class="flex gap-6">
          <button @click="openGenerateModal"
            class="dark:bg-darkGreen bg-pigmentGreen border dark:border-lightGreen border-lightGreen dark:text-lightGreen text-white font-bold px-4 py-2 rounded-xl shadow-outer">
            Generate Leave Balances
          </button>
          <button @click="openImportModal"
            class="dark:bg-darkBrown bg-warmYellow/60 border border-darkOrange dark:text-darkOrange text-white font-bold px-4 py-2 rounded-xl shadow-outer">
            Import Carried Forward
          </button>
        </div>
      </div>

      <!-- Filters Section -->
      <div class="p-4 bg-white dark:bg-gray-900 rounded-xl shadow-md mb-6">
        <div class="flex flex-wrap gap-4 items-center">
          <!-- Year Dropdown -->
          <div class="relative w-full sm:w-auto">
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-200">Select Year</label>
            <select v-model="selectedYear"
              class="mt-1 px-3 py-2 block w-full rounded-md border border-gray-400 dark:border-gray-600 shadow-sm dark:bg-gray-800 bg-white dark:text-white text-gray-700 outline-none">
              <option v-for="year in years" :key="year" :value="year">
                {{ year }}
              </option>
            </select>
          </div>

          <!-- Department Dropdown (Multi-select) -->
          <div class="relative w-full sm:w-auto min-w-48" v-click-outside="() => (openDepartmentMenu = false)">
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-200">Department</label>
            <button @click="openDepartmentMenu = !openDepartmentMenu"
              class="mt-1 w-full text-left px-3 py-2 bg-white dark:bg-gray-800 border border-gray-400 dark:border-gray-600 dark:text-white text-gray-700 rounded-md shadow-sm">
              {{
                selectedDepartments.length
                ? selectedDepartments.join(', ')
                : 'Select Departments'
              }}
            </button>
            <div v-if="openDepartmentMenu"
              class="absolute z-10 mt-1 w-full rounded-md bg-white dark:bg-gray-800 dark:text-white text-gray-700 border border-gray-400 dark:border-gray-600">
              <ul class="max-h-60 overflow-y-auto">
                <li v-for="dept in departments" :key="dept" @click.stop="toggleDepartmentSelection(dept)"
                  class="px-4 py-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center">
                  <input type="checkbox" :checked="selectedDepartments.includes(dept)" class="mr-2" />
                  {{ dept }}
                </li>
              </ul>
            </div>
          </div>

          <!-- Employees Dropdown (Multi-select) -->
          <div class="relative w-full sm:w-auto min-w-48" v-click-outside="() => (openEmployeeMenu = false)">
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-200">Employees</label>
            <button @click="openEmployeeMenu = !openEmployeeMenu"
              class="mt-1 w-full text-left px-3 py-2 bg-white dark:bg-gray-800 border border-gray-400 dark:border-gray-600 dark:text-white text-gray-700 rounded-md shadow-sm">
              {{
                selectedEmployees.length
                ? selectedEmployees.join(', ')
                : 'Select Employees'
              }}
            </button>
            <div v-if="openEmployeeMenu"
              class="absolute z-10 mt-1 w-full rounded-md bg-white dark:bg-gray-800 dark:text-white text-gray-700 border border-gray-400 dark:border-gray-600">
              <ul class="max-h-60 overflow-y-auto">
                <li v-for="emp in employees" :key="emp" @click.stop="toggleEmployeeSelection(emp)"
                  class="px-4 py-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center">
                  <input type="checkbox" :checked="selectedEmployees.includes(emp)" class="mr-2" />
                  {{ emp }}
                </li>
              </ul>
            </div>
          </div>

          <!-- Search Bar -->
          <div class="relative w-full sm:w-auto flex-grow">
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-200">Search</label>
            <input type="text" v-model="searchQuery" placeholder="Search by name"
              class="mt-1 px-3 py-2 block w-full sm:w-auto rounded-md border border-gray-400 dark:border-gray-600 shadow-sm dark:bg-gray-800 dark:text-white outline-none" />
          </div>
        </div>
      </div>

      <!-- Employee Leave Balances Component (Child) -->
      <EmployeeLeaveBalances :leaveData="filteredLeaveData" />
    </section>
  </main>

  <!-- Generate Leave Balances Modal -->
  <Transition name="modal">
    <div v-if="isGenerateModalOpen"
      class="fixed inset-0 z-50 flex items-center justify-center bg-gray-900 bg-opacity-50 dark:bg-gray-900 dark:bg-opacity-80">
      <div class="relative bg-white dark:bg-gray-800 rounded-xl shadow-2xl p-6 w-full max-w-md">
        <div class="flex justify-between items-center mb-4">
          <h3 class="text-xl font-bold text-gray-800 dark:text-white">
            Generate Leave Balances
          </h3>
          <button @click="closeGenerateModal" class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
            <!-- Close icon SVG -->
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24"
              stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div class="space-y-4">
          <!-- Year Dropdown for Generation -->
          <div>
            <label for="generateYear" class="block text-sm font-medium text-gray-700 dark:text-gray-200">
              Choose a Year
            </label>
            <select id="generateYear" v-model="generateYear"
              class="mt-1 px-3 py-2 block w-full rounded-md border border-gray-400 dark:border-gray-600 shadow-sm dark:bg-gray-800 bg-white dark:text-white text-gray-700 outline-none">
              <option v-for="year in futureYears" :key="year" :value="year">
                {{ year }}
              </option>
            </select>
          </div>

          <!-- Background Processing Checkbox -->
          <div class="flex items-start">
            <div class="flex items-center h-5">
              <input id="backgroundProcessing" name="backgroundProcessing" type="checkbox" v-model="useBackgroundProcessing"
                class="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded" />
            </div>
            <div class="ml-3 text-sm">
              <label for="backgroundProcessing" class="font-medium text-gray-700 dark:text-gray-200">
                Use background processing (recommended for large organizations)
              </label>
            </div>
          </div>
        </div>

        <!-- Modal Actions -->
        <div class="mt-6 flex justify-end gap-2">
          <button @click="closeGenerateModal"
            class="px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md shadow-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700">
            Cancel
          </button>
          <button @click="handleGenerateBalances"
            class="px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700">
            Generate
          </button>
        </div>
      </div>
    </div>
  </Transition>

  <!-- Import Carried Forward Modal -->
  <Transition name="modal">
    <div v-if="isImportModalOpen"
      class="fixed inset-0 z-50 flex items-center justify-center bg-gray-900 bg-opacity-50 dark:bg-gray-900 dark:bg-opacity-80">
      <div class="relative bg-white dark:bg-gray-800 rounded-xl shadow-2xl p-6 w-full max-w-md">
        <div class="flex justify-between items-center mb-4">
          <h3 class="text-xl font-bold text-gray-800 dark:text-white">
            Import Carried Forward Balances
          </h3>
          <button @click="closeImportModal" class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
            <!-- Close icon SVG -->
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24"
              stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div class="space-y-4">
          <!-- Year Dropdown for Import -->
          <div>
            <label for="importYear" class="block text-sm font-medium text-gray-700 dark:text-gray-200">
              Choose a Year to Apply Carried Forward Days
            </label>
            <select id="importYear" v-model="importYear"
              class="mt-1 px-3 py-2 block w-full rounded-md border border-gray-400 dark:border-gray-600 shadow-sm dark:bg-gray-800 bg-white dark:text-white text-gray-700 outline-none">
              <option v-for="year in years" :key="year" :value="year">
                {{ year }}
              </option>
            </select>
          </div>

          <!-- File Upload -->
          <div>
            <label for="file-upload" class="block text-sm font-medium text-gray-700 dark:text-gray-200">
              Upload a CSV file
            </label>
            <div class="mt-1 flex items-center space-x-2">
              <label for="file-upload" class="relative cursor-pointer bg-white dark:bg-gray-800 py-2 px-3 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm leading-4 font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 outline-none">
                <span>Select file</span>
                <input id="file-upload" name="file-upload" type="file" class="sr-only" @change="handleFileUpload" accept=".csv" />
              </label>
              <span class="text-sm text-gray-500 dark:text-gray-400">
                {{ csvFile ? csvFile.name : 'No file selected' }}
              </span>
            </div>
          </div>
          
          <!-- Download Template Button -->
          <button @click="handleDownloadTemplate"
            class="px-4 py-2 border border-gray-400 dark:border-gray-600 text-sm font-medium rounded-md shadow-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700">
            Download Template
          </button>
        </div>

        <!-- Modal Actions -->
        <div class="mt-6 flex justify-end gap-2">
          <button @click="closeImportModal"
            class="px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md shadow-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700">
            Cancel
          </button>
          <button @click="handleImportCarriedForward"
            class="px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700">
            Import
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

/* Optional: Add a subtle scaling transition to the modal content */
.modal-enter-active .relative,
.modal-leave-active .relative {
  transition: transform 0.3s cubic-bezier(0.68, -0.55, 0.27, 1.55);
}

.modal-enter-from .relative,
.modal-leave-to .relative {
  transform: scale(0.9);
}
</style>
