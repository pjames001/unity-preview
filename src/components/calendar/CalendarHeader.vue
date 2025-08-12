<script setup>
defineProps({
  currentMonthName: String,
  currentYear: [String, Number],
  previousMonth: Function,
  nextMonth: Function,
  views: Array,
  activeView: String,
  isOpen: Boolean
})
defineEmits(['update:activeView']);
</script>

<template>
  <div class="flex items-center justify-between mb-6 flex-wrap gap-4">
    <div class="flex items-center space-x-2">
      <button @click="previousMonth" class="p-2 rounded-full hover:bg-gray-200 transition-colors duration-200">
        <svg class="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
        </svg>
      </button>
      <div class="text-2xl font-semibold dark:text-white text-gray-800 rounded-md py-1 px-3">
        {{ currentMonthName }} {{ currentYear }}
      </div>
      <button @click="nextMonth" class="p-2 rounded-full hover:bg-gray-200 transition-colors duration-200">
        <svg class="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
        class="flex items-center px-6 py-4 dark:bg-navbtn bg-white border dark:border-lightBlue border-transparent dark:text-white text-gray-700 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors duration-200 text-sm  font-medium shadow-outer"
      >
        <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM4 7h16v10a1 1 0 01-1 1H4a1 1 0 01-1-1V7z">
          </path>
        </svg>
        View Filters
      </button>
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

