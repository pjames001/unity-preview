<script setup>
// --- Props & Emits ---
const props = defineProps({
  weekDays: Array,
  daysInMonth: Array,
});

const emit = defineEmits(['day-click']);

// --- Event Handlers & Methods ---
const handleDayClick = (day) => {
  emit('day-click', day);
};
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
          'min-h-[120px] dark:bg-darkPurple bg-white p-2 rounded-md relative cursor-pointer transition-all duration-200 ease-in-out',
          { 'dark:text-gray-600 shadow-none text-gray-400': !day.isCurrentMonth },
          { 'font-bold shadow-outer hover:scale-[1.03]': !day.isToday && day.isCurrentMonth },
          { 'font-bold text-[30px] shadow-inner border border-blue-500': day.isToday },
          { 'border border-blue-500 text-green-600': day.isSelected },
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
              'text-[#fcba03] text-xl': day.isToday,
              'dark:text-white text-gray-800': day.isCurrentMonth && !day.isToday,
              'text-gray-400 dark:text-gray-600': !day.isCurrentMonth
            }
          ]"
        >
          {{ day.dayOfMonth }}
        </div>

        <div class="mt-2 space-y-1">
          <div
            v-for="summary in day.eventSummary"
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