<script setup>
const props = defineProps({
  weekDays: Array,
  daysInMonth: Array
});
const emit = defineEmits(['day-click']);

const handleDayClick = (day) => {
  emit('day-click', day);
};

const getEventSummary = (events) => {
  const summaryMap = {};
  events.forEach(event => {
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
}
</script>

<template>
  <div>
    <div class="grid grid-cols-7 text-center text-sm font-medium dark:text-gray-200 text-gray-700 mb-2">
      <div v-for="day in weekDays" :key="day" class="py-2">{{ day }}</div>
    </div>
    <div class="grid grid-cols-7 gap-2 dark:bg-darkPurple bg-gray-200 rounded-lg overflow-hidden p-2">
      <div
        v-for="day in daysInMonth"
        :key="day.date"
        :class="[
          'min-h-[120px] dark:bg-darkPurple bg-white p-2 rounded-md relative',
          { 'dark:text-gray-600 shadow-none text-gray-400': !day.isCurrentMonth },
          { 'font-bold shadow-outer': !day.isToday },
          { 'font-bold shadow-inner': day.isToday },
          { 'border-blue-500 border text-green-600': day.isSelected },
          { 'rounded-tl-lg': day.isFirstDayOfWeek && day.isFirstRow },
          { 'rounded-tr-lg': day.isLastDayOfWeek && day.isFirstRow },
          { 'rounded-bl-lg': day.isFirstDayOfWeek && day.isLastRow },
          { 'rounded-br-lg': day.isLastDayOfWeek && day.isLastRow },
        ]"
        @click="handleDayClick(day)"
      >
        <div
          :class="[
            'text-right text-sm font-medium',
            {
              'text-[#fcba03]': day.isToday,
              'dark:text-white text-gray-800': day.isCurrentMonth && !day.isToday,
              'text-gray-400 dark:text-gray-600': !day.isCurrentMonth
            }
          ]"
        >
          {{ day.dayOfMonth }}
        </div>
        <div class="mt-2 space-y-1">
          <div
            v-for="summary in getEventSummary(day.events)"
            :key="summary.title"
            class="text-xs px-2 py-1 rounded-md overflow-hidden whitespace-nowrap text-ellipsis flex items-center"
            :style="{ backgroundColor: summary.bgColor, color: summary.textColor }"
          >
            <span class="font-bold mr-1">{{ summary.count }}</span>
            <span>{{ summary.title }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>