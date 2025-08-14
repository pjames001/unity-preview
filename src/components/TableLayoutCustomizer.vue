<script setup>
import { defineProps, defineEmits, ref, computed, watch } from 'vue';

// Define props to make the component reusable for any table
const props = defineProps({
  isOpen: {
    type: Boolean,
    required: true,
  },
  initialColumns: {
    type: Array,
    default: () => []
  },
  allColumnOptions: {
    type: Array,
    required: true
  },
  title: {
    type: String,
    required: true
  }
});

// Define emits to communicate with the parent component
const emit = defineEmits(['close', 'save-layout']);

// --- Component State ---
// A local copy of the columns from props, which we can modify
const selectedColumns = ref([...props.initialColumns]);

// Reactive state for the dropdown to add new columns
const newColumnToAdd = ref('');

// Drag and drop state
const draggingItem = ref(null);
const draggingIndex = ref(-1);

// A watcher to update the local selectedColumns if the prop changes from the parent
// This ensures the modal opens with the most up-to-date layout
watch(() => props.initialColumns, (newVal) => {
  selectedColumns.value = [...newVal];
}, { immediate: true });

// Computed property for columns that can still be added (not already selected)
const columnsAvailableToAdd = computed(() => {
  return props.allColumnOptions.filter(col => !selectedColumns.value.includes(col));
});

// --- Modal Actions ---
const closeModal = () => {
  emit('close');
};

const saveLayout = () => {
  emit('save-layout', selectedColumns.value);
  closeModal();
};

const cancelLayout = () => {
  closeModal();
};

// --- Column Management (Add/Remove) ---
const addColumn = () => {
  if (newColumnToAdd.value && !selectedColumns.value.includes(newColumnToAdd.value)) {
    selectedColumns.value.push(newColumnToAdd.value);
    newColumnToAdd.value = ''; // Clear selection
  }
};

const removeColumn = (columnToRemove) => {
  selectedColumns.value = selectedColumns.value.filter(col => col !== columnToRemove);
};

// --- Drag and Drop Logic ---
const handleDragStart = (event, index) => {
  draggingItem.value = selectedColumns.value[index];
  draggingIndex.value = index;
  event.dataTransfer.effectAllowed = 'move';
  event.dataTransfer.setData('text/plain', index);
  event.target.classList.add('opacity-50');
};

const handleDragOver = (event, index) => {
  event.preventDefault();
  const targetItem = selectedColumns.value[index];
  if (draggingItem.value && draggingItem.value !== targetItem) {
    const newColumns = [...selectedColumns.value];
    newColumns.splice(draggingIndex.value, 1);
    newColumns.splice(index, 0, draggingItem.value);
    selectedColumns.value = newColumns;
    draggingIndex.value = index;
  }
};

const handleDragEnd = (event) => {
  event.target.classList.remove('opacity-50');
  draggingItem.value = null;
  draggingIndex.value = -1;
};
</script>

<template>
  <Transition name="modal-fade">
    <div v-if="isOpen" class="fixed inset-0 z-50 flex items-center justify-center p-4">
      <!-- Overlay -->
      <div class="absolute inset-0 bg-black bg-opacity-50 dark:bg-opacity-70 backdrop-blur-sm" @click="closeModal">
      </div>

      <!-- Modal Content -->
      <div
        class="relative bg-white dark:bg-darkBlue rounded-xl shadow-2xl p-8 w-full max-w-xl border dark:border-lightBlue border-clientPurple transform transition-all duration-300 ease-out"
        :class="{
          'scale-100 opacity-100': isOpen,
          'scale-95 opacity-0': !isOpen
        }">
        <!-- Modal Header -->
        <div class="flex justify-between items-center mb-6">
          <h2 class="text-2xl font-bold dark:text-white text-gray-800">{{ title }}</h2>
          <button @click="closeModal"
            class="text-gray-500 dark:text-gray-300 hover:text-gray-700 dark:hover:text-white transition-colors duration-200">
            <v-icon name="bi-x-lg" scale="1.5"></v-icon>
          </button>
        </div>

        <!-- Top Section: Select fields to display -->
        <div class="mb-8 p-4 rounded-lg border dark:border-gray-700 border-gray-300">
          <p class="text-sm font-medium dark:text-gray-400 text-gray-600 mb-3">- Select fields to display on table -</p>
          <div class="flex flex-wrap items-center gap-2 p-2 border dark:border-gray-600 border-gray-400 rounded-md bg-gray-50 dark:bg-navBlue min-h-[40px]">
            <!-- Selected Column Tags with 'X' button -->
            <span v-for="column in selectedColumns" :key="column"
              class="flex items-center bg-lightBlue text-white text-sm px-3 py-1 rounded-full gap-2 shadow-sm">
              {{ column }}
              <button @click="removeColumn(column)" class="text-white hover:text-gray-200" title="Remove column">
                <v-icon name="bi-x" scale="1"></v-icon>
              </button>
            </span>

            <!-- Dropdown for adding new columns -->
            <div class="relative flex-grow min-w-[120px]">
              <select
                v-model="newColumnToAdd"
                @change="addColumn"
                class="w-full bg-transparent dark:text-white text-gray-800 p-1 rounded-md outline-none cursor-pointer"
              >
                <option value="" disabled>Add Column...</option>
                <option v-for="col in columnsAvailableToAdd" :key="col" :value="col" class="text-gray-700">{{ col }}</option>
              </select>
            </div>
          </div>
        </div>

        <!-- Bottom Section: Drag & Drop Reorder -->
        <div class="mb-8 p-4 rounded-lg border dark:border-gray-700 border-gray-300">
          <div class="flex items-center text-sm font-medium dark:text-warmYellow text-darkOrange mb-4">
            <v-icon name="bi-lightbulb-fill" scale="1.2" class="mr-2"></v-icon>
            <span>Hint: Drag & Drop the Columns to order them.</span>
          </div>

          <ul class="space-y-2">
            <li v-for="(column, index) in selectedColumns" :key="column"
              :draggable="true"
              @dragstart="handleDragStart($event, index)"
              @dragover="handleDragOver($event, index)"
              @dragend="handleDragEnd($event)"
              class="flex items-center justify-between p-3 dark:bg-navBlue bg-gray-100 rounded-md shadow-sm cursor-grab dark:text-white text-gray-800 border dark:border-darkBlue border-gray-200 hover:shadow-md transition-shadow duration-200 ease-in-out"
            >
              <div class="flex items-center gap-3">
                <v-icon name="md-drag-indicator" scale="1.5" class="text-gray-500 dark:text-gray-400 cursor-grab"></v-icon>
                <span>{{ column }}</span>
              </div>
            </li>
          </ul>
        </div>

        <!-- Modal Footer -->
        <div class="mt-8 flex justify-end gap-3">
          <button @click="cancelLayout"
            class="px-6 py-2 rounded-md border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors duration-200">
            CANCEL
          </button>
          <button @click="saveLayout"
            class="px-6 py-2 rounded-md bg-lightGreen text-white hover:bg-green-600 transition-colors duration-200">
            SAVE LAYOUT
          </button>
        </div>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
/* Transition styles for the modal */
.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.3s ease;
}

.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}

/* For the content inside the modal, if you want a subtle scale effect */
.modal-fade-enter-active .relative,
.modal-fade-leave-active .relative {
  transition: transform 0.3s ease, opacity 0.3s ease;
}

.modal-fade-enter-from .relative,
.modal-fade-leave-to .relative {
  transform: scale(0.95);
  opacity: 0;
}
</style>
