<script setup>
import { computed } from 'vue';

// --- Props & Emits ---
const props = defineProps({
  currentMonthName: String,
  currentYear: [String, Number],
  selectedDate: String,
  views: Array,
  activeView: String,
  handlePrevious: Function,
  handleNext: Function,
});

defineEmits(['update:activeView', 'add-event']);

// --- Computed Properties ---
const headerDateDisplay = computed(() => {
  const date = new Date(props.selectedDate);

  if (props.activeView === 'Month') {
    return `${props.currentMonthName} ${props.currentYear}`;
  }

  if (props.activeView === 'Day') {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString('en-US', options);
  }

  // Week view
  const startOfWeek = new Date(date);
  startOfWeek.setDate(date.getDate() - date.getDay());
  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(startOfWeek.getDate() + 6);

  const startOptions = { month: 'long', day: 'numeric' };
  const endOptions = { month: 'long', day: 'numeric', year: 'numeric' };

  const startString = startOfWeek.toLocaleDateString('en-US', startOptions);
  const endString = endOfWeek.toLocaleDateString('en-US', endOptions);

  return `${startString} - ${endString}`;
});
</script>

<template>
  <div class="flex items-center justify-between mb-6 flex-wrap gap-4">
    <div class="flex items-center space-x-2">
      <button @click="handlePrevious" class="p-2 rounded-full hover:bg-gray-600 transition-colors duration-200">
        <svg class="w-5 h-5 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
        </svg>
      </button>
      <div class="text-2xl font-semibold dark:text-white text-gray-800 rounded-md py-1 px-3">
        {{ headerDateDisplay }}
      </div>
      <button @click="handleNext" class="p-2 rounded-full hover:bg-gray-600 transition-colors duration-200">
        <svg class="w-5 h-5 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
        </svg>
      </button>
    </div>

    <div class="flex items-center space-x-4">
      <div class="flex dark:bg-navbtn bg-gray-100 rounded-lg p-2 text-sm font-medium shadow-outer border dark:border-lightBlue border-clientPurple">
        <button
          v-for="view in views"
          :key="view"
          @click="$emit('update:activeView', view)"
          :class="[
            'px-4 py-2 rounded-md transition-all duration-200',
            activeView === view ? 'dark:bg-darkBlue border dark:border-lightBlue bg-blue-500 dark:text-lightBlue text-white shadow-inner' : 'dark:text-white text-gray-700']">
          {{ view }}
        </button>
      </div>

      <button
        class="flex items-center px-6 py-4 dark:bg-darkBlue bg-blue-600 border dark:border-lightBlue dark:text-lightBlue text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 text-sm  font-medium shadow-outer"
        @click="$emit('add-event')"
      >
        <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6">
          </path>
        </svg>
        Add Event
      </button>
    </div>
  </div>
</template>