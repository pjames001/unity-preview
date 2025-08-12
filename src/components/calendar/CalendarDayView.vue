<script setup>
import { ref, computed } from 'vue';

const { selectedDate, getEventsByHalfAnHour, getOutOfRangeEvents } = defineProps({
  selectedDate: String,
  getEventsByHalfAnHour: Object,
  getOutOfRangeEvents: Array
});

const hoverTitle = ref(null);

const hoveredEvents = computed(() => {
  if (!hoverTitle.value) return [];
  return allEvents.value.filter(event => event.title === hoverTitle.value);
});

// Flatten all events for the selected day
const allEvents = computed(() => {
  return Object.values(getEventsByHalfAnHour).flat();
});

// Group and count events by title
const eventSummary = computed(() => {
  const summaryMap = {};
  allEvents.value.forEach(event => {
    if (!summaryMap[event.title]) {
      summaryMap[event.title] = { count: 1, bgColor: event.bgColor, textColor: event.textColor };
    } else {
      summaryMap[event.title].count++;
    }
  });
  return Object.entries(summaryMap).map(([title, info]) => ({
    title,
    count: info.count,
    bgColor: info.bgColor,
    textColor: info.textColor
  }));
});
</script>

<template>
  <div class="bg-white dark:bg-darkPurple p-4 rounded-lg shadow-inner">
    <h3 class="text-lg font-semibold mb-4 dark:text-white text-gray-800">
      Events for {{ selectedDate }}
    </h3>
    <div v-if="eventSummary.length" class="mb-6 flex flex-wrap gap-2">
      <div
        v-for="summary in eventSummary"
        :key="summary.title"
        class="px-3 py-1 rounded-md text-xs font-semibold flex items-center relative"
        :style="{ backgroundColor: summary.bgColor, color: summary.textColor }"
        @mouseenter="hoverTitle = summary.title"
        @mouseleave="hoverTitle = null"
      >
        <span class="mr-1">{{ summary.count }}</span>
        <span>{{ summary.title }}</span>

        <div
          v-if="hoverTitle === summary.title"
          class="absolute z-10 top-full mt-2 left-0 bg-white dark:bg-darkBlue shadow-lg border border-gray-300 dark:border-gray-600 rounded-md p-3 w-64 h-max transition-opacity duration-200"
        >
          <div v-for="event in hoveredEvents" :key="event.id" class="mb-2 last:mb-0 text-sm">
            <div class="font-medium text-gray-800 dark:text-white">{{ event.timeStr }}</div>
            <div class="text-gray-600 dark:text-gray-300">{{ event.note || 'No details' }}</div>
          </div>
        </div>
      </div>
    </div>
    
    <div class="space-y-4">
      <div v-for="time in Object.keys(getEventsByHalfAnHour)" :key="time" class="border-b dark:border-gray-500 border-gray-400 pb-2">
        <div class="text-sm font-medium text-gray-500 mb-1 dark:text-gray-400">
          {{ time }}
        </div>
        <div v-if="getEventsByHalfAnHour[time]?.length > 0" class="space-y-1">
          <div
            v-for="event in getEventsByHalfAnHour[time]"
            :key="event.id"
            class="px-3 py-2 rounded-md text-sm shadow-sm"
            :style="{ backgroundColor: event.bgColor, color: event.textColor }"
          >
            <div class="font-semibold">{{ event.timeStr }}</div>
            <div>{{ event.title }}</div>
          </div>
        </div>
        <div v-else class="text-xs text-gray-400 italic">No events</div>
      </div>
    </div>
    
    <div v-if="getOutOfRangeEvents.length > 0" class="mt-6 pt-4 border-t dark:border-gray-600 border-gray-300">
      <h4 class="text-md font-semibold mb-2 dark:text-white text-gray-800">Other Times</h4>
      <div class="space-y-1">
        <div
          v-for="event in getOutOfRangeEvents"
          :key="event.id"
          class="px-3 py-2 rounded-md text-sm shadow-sm"
          :style="{ backgroundColor: event.bgColor, color: event.textColor }"
        >
          <div class="font-semibold">{{ event.timeStr }}</div>
          <div>{{ event.title }}</div>
        </div>
      </div>
    </div>

  </div>
</template>