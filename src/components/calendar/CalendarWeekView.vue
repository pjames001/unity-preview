<script setup>
import { ref, computed } from 'vue';

// --- Props & Emits ---
const props = defineProps({
  selectedDate: String,
  getWeekDays: Function
});

const emit = defineEmits(['add-event'])

// --- State Management ---
const activeDayIndex = ref(null);
const activeTitle = ref(null);

// --- Computed Properties ---
const weekDaysWithSummary = computed(() => {
  const weekDays = props.getWeekDays?.(props.selectedDate) || [];
  return weekDays.map(day => ({
    ...day,
    eventSummary: day.events?.length > 0 ? getEventSummary(day.events) : []
  }));
});

const activeEvents = computed(() => {
  if (activeDayIndex.value === null || !activeTitle.value) return [];
  const day = weekDaysWithSummary.value[activeDayIndex.value];
  if (!day || !Array.isArray(day.events)) return [];
  return day.events.filter(event => event.title === activeTitle.value);
});

// --- Event Handlers & Methods ---
const formatTime = (isoDateString) => {
  if (!isoDateString) return 'No time set';
  const date = new Date(isoDateString);
  if (isNaN(date)) return 'Invalid date';
  let hours = date.getHours();
  const minutes = date.getMinutes().toString().padStart(2, '0');
  const ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12 || 12;
  return `${hours}:${minutes} ${ampm}`;
};

const getColorStyle = (color) => {
  let bgColor = '', textColor = 'white';
  switch (color) {
    case 'red': bgColor = '#EF4444'; break;
    case 'teal': bgColor = '#14B8A6'; break;
    case 'purple': bgColor = '#A855F7'; break;
    case 'yellow': bgColor = '#F59E0B'; break;
    default: bgColor = '#3B82F6';
  }
  return { bgColor, textColor };
};

const getEventSummary = (events) => {
  const summaryMap = {};
  events.forEach(event => {
    if (!summaryMap[event.title]) {
      const { bgColor, textColor } = getColorStyle(event.color);
      summaryMap[event.title] = { count: 1, bgColor, textColor };
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
};

const toggleActiveSummary = (index, title) => {
  if (activeDayIndex.value === index && activeTitle.value === title) {
    activeDayIndex.value = null;
    activeTitle.value = null;
  } else {
    activeDayIndex.value = index;
    activeTitle.value = title;
  }
};
</script>

<template>
  <div class="bg-white dark:bg-darkPurple p-4 rounded-lg shadow-inner relative z-10 min-h-max">
      <h3 class="text-lg font-semibold dark:text-white text-gray-800">
        Events for Week of {{ selectedDate }}
      </h3>
    
    <div class="grid grid-cols-7 gap-4 h-min">
      <div v-for="(day, index) in weekDaysWithSummary" :key="index"
        class="bg-gray-200 dark:bg-[#333] shadow-inner rounded-lg p-2 relative">
        <h4 class="text-sm text-center font-bold mb-2 dark:text-white text-gray-700">{{ day.dateStr }}</h4>

        <button
          class="dark:bg-darkGreen bg-pigmentGreen border dark:border-lightGreen border-lightGreen dark:text-lightGreen text-white text-xs font-medium mb-4 w-full h-6 rounded shadow-outer transition"
          @click="emit('add-event')"
        >
          Add Event +
        </button>

        <div v-if="day.eventSummary.length > 0" class="space-y-1">
          <div v-for="summary in day.eventSummary" :key="summary.title"
            class="px-2 py-1 rounded-md text-xs flex items-center relative shadow-sm cursor-pointer"
            :style="{ backgroundColor: summary.bgColor, color: summary.textColor }"
            @click="toggleActiveSummary(index, summary.title)">
            <span class="mr-1 font-semibold">{{ summary.count }}</span>
            <span>{{ summary.title }}</span>
          </div>
        </div>

        <div v-else class="text-gray-400 text-xs text-center">No events</div>
      </div>
    </div>

    <Transition name="fade" mode="out-in">
      <div v-if="activeEvents.length > 0" class="mt-4 p-4 rounded-lg bg-gray-100 dark:bg-darkBlue shadow-md">
        <h4 class="text-lg font-semibold text-gray-800 dark:text-white mb-2">
          Details for {{ activeTitle }} on {{ weekDaysWithSummary[activeDayIndex]?.dateStr }}
        </h4>
        <div class="space-y-2">
          <div v-for="event in activeEvents" :key="event.id" class="p-2 border-b border-gray-300 last:border-b-0">
            <div class="font-medium text-gray-800 dark:text-white">{{ formatTime(event.date) }}</div>
            <div class="text-gray-600 dark:text-gray-300">{{ event.note || 'No details' }}</div>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<style>
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}
</style>