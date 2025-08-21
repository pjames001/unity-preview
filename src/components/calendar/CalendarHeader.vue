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
      <button @click="handlePrevious" class="w-[40px] h-[40px] p-2 rounded-full dark:hover:bg-gray-500 hover:bg-white transition-colors duration-200">
        <v-icon name="md-keyboardarrowleft" scale="1.2" class="dark:text-white text-gray-700 w-5 h-5"></v-icon>
      </button>
      <div class="text-2xl font-semibold dark:text-white text-gray-800 rounded-md py-1 px-3">
        {{ headerDateDisplay }}
      </div>
      <button @click="handleNext" class="w-[40px] h-[40px] p-2 rounded-full dark:hover:bg-gray-500 hover:bg-white transition-colors duration-200">
        <v-icon name="md-keyboardarrowright" scale="1.2" class="dark:text-white text-gray-700 w-5 h-5"></v-icon>
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

    </div>
  </div>
</template>