<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import CalendarHeader from '@/components/calendar/CalendarHeader.vue';
import CalendarMonthGrid from '@/components/calendar/CalendarMonthGrid.vue';
import CalendarDayView from '@/components/calendar/CalendarDayView.vue';
import CalendarWeekView from '@/components/calendar/CalendarWeekView.vue';
import AddEvents from '@/components/calendar/AddEvents.vue';
import DayEvents from '@/components/calendar/DayEvents.vue';

// --- State Management ---
const today = new Date();
const currentMonth = ref(today.getMonth());
const currentYear = ref(today.getFullYear());
const activeView = ref('Month');
const selectedDate = ref(today.toISOString().split('T')[0]); // 'YYYY-MM-DD'
const isDayModalOpen = ref(false);
const modalDayEvents = ref([]);
const modalDayDate = ref('');
const isAddEventModalOpen = ref(false);
const peopleDropdownOpen = ref(false);
const frequencyMode = ref('week');
const newEventData = ref({
  type: '',
  time: '12:00',
  preReminderValue: '5',
  preReminderUnit: 'minutes',
  frequencyPattern: 'doNotRepeat',
  frequencyDays: [],
  frequencyDates: [],
  priority: '',
  visibilityType: 'Only Me',
  visibilityValue: [],
  onlyOneCompletes: false,
  note: '',
});
const events = ref([
  { id: 1, date: '2025-07-03T09:00:00', title: 'Team Meeting', color: 'red' },
  { id: 2, date: '2025-07-03T14:30:00', title: 'Call Back', color: 'teal' },
  { id: 3, date: '2025-07-10T07:00:00', title: 'Call Back', color: 'teal' },
  { id: 4, date: '2025-07-05T11:00:00', title: 'Follow Up on SA', color: 'purple' },
  { id: 5, date: '2025-07-05T15:00:00', title: 'Send SA', color: 'yellow' },
  { id: 6, date: '2025-07-15T10:00:00', title: 'Follow Up on SA', color: 'purple' },
  { id: 7, date: '2025-07-20T16:00:00', title: 'Send SA', color: 'yellow' },
  { id: 8, date: '2025-07-25T08:00:00', title: 'Team Meeting', color: 'red' },
  { id: 9, date: '2025-07-03T08:00:00', title: 'Call Back', color: 'teal' },
  { id: 10, date: '2025-07-03T11:00:00', title: 'Call Back', color: 'teal' },
  { id: 11, date: '2025-07-03T13:00:00', title: 'Follow Up on SA', color: 'purple' },
  { id: 12, date: '2025-07-03T17:00:00', title: 'Team Meeting', color: 'red' },
  { id: 13, date: '2025-07-03T17:00:00', title: 'Team Meeting', color: 'red' },
]);
const allDepartments = [
  { id: 1, name: 'Legal' }, { id: 2, name: 'IT' }, { id: 3, name: 'Collections' },
  { id: 4, name: 'Sales' }, { id: 5, name: 'Admin' }, { id: 6, name: 'HR' },
];
const allBranches = [
  { id: 1, name: 'Lebanon' }, { id: 2, name: 'Kenya' }, { id: 3, name: 'Phillippines' }, { id: 4, name: 'USA' },
];
const allPositions = [
  { id: 1, name: 'Manager' }, { id: 2, name: 'Developer' }, { id: 3, name: 'Designer' },
  { id: 4, name: 'QA Engineer' }, { id: 5, name: 'Product Owner' },
];
const allPeople = [
  { id: 1, name: 'Ali' }, { id: 2, name: 'Sarah' }, { id: 3, name: 'John' },
  { id: 4, name: 'Lea' }, { id: 5, name: 'Toni' }, { id: 6, name: 'Maya' },
  { id: 7, name: 'Omar' }, { id: 8, name: 'Zara' }, { id: 9, name: 'Liam' },
  { id: 10, name: 'Emma' }, { id: 11, name: 'Noah' }, { id: 12, name: 'Olivia' },
  { id: 13, name: 'Ava' }, { id: 14, name: 'Sophia' }, { id: 15, name: 'Isabella' },
];

// --- Data & Computed Properties ---
const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const monthNames = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];
const views = ['Day', 'Week', 'Month'];
const currentMonthName = computed(() => monthNames[currentMonth.value]);

const colorMap = {
  red: '#EF4444',
  teal: '#14B8A6',
  purple: '#A855F7',
  yellow: '#F59E0B',
  blue: '#3B82F6',
};

const getEventColor = (event) => {
  const bgColor = colorMap[event.color] || colorMap.blue;
  const textColor = 'white';
  return { ...event, bgColor, textColor };
};

const daysInMonth = computed(() => {
  const year = currentYear.value;
  const month = currentMonth.value;
  const firstDayOfMonth = new Date(year, month, 1);
  const lastDayOfMonth = new Date(year, month + 1, 0);
  const daysInCurrentMonth = lastDayOfMonth.getDate();
  const startDay = firstDayOfMonth.getDay();
  const days = [];

  const prevMonthLastDay = new Date(year, month, 0).getDate();
  for (let i = startDay - 1; i >= 0; i--) {
    const date = new Date(year, month - 1, prevMonthLastDay - i);
    days.push({
      date: date.toISOString().split('T')[0],
      dayOfMonth: date.getDate(),
      isCurrentMonth: false,
      isToday: false,
      isSelected: false,
      events: [],
      eventSummary: [],
    });
  }

  for (let i = 1; i <= daysInCurrentMonth; i++) {
    const date = new Date(year, month, i);
    const dateStr = date.toISOString().split('T')[0];
    const isToday = date.toDateString() === today.toDateString();
    const isSelected = selectedDate.value === dateStr;
    const dayEvents = events.value.filter(event => event.date.startsWith(dateStr)).map(getEventColor);
    const summaryMap = dayEvents.reduce((acc, event) => {
      if (!acc[event.title]) acc[event.title] = { count: 0, bgColor: event.bgColor, textColor: event.textColor };
      acc[event.title].count++;
      return acc;
    }, {});
    const eventSummary = Object.entries(summaryMap).map(([title, info]) => ({ title, ...info }));
    days.push({ date: dateStr, dayOfMonth: i, isCurrentMonth: true, isToday, isSelected, events: dayEvents, eventSummary });
  }

  const totalCells = 42;
  const trailingDaysCount = totalCells - days.length;
  for (let i = 1; i <= trailingDaysCount; i++) {
    const date = new Date(year, month + 1, i);
    days.push({
      date: date.toISOString().split('T')[0],
      dayOfMonth: i,
      isCurrentMonth: false,
      isToday: false,
      isSelected: false,
      events: [],
      eventSummary: [],
    });
  }

  return days.map((day, index) => ({
    ...day,
    isFirstDayOfWeek: index % 7 === 0,
    isLastDayOfWeek: index % 7 === 6,
    isFirstRow: index < 7,
    isLastRow: index >= days.length - 7,
  }));
});

const getEventsByHalfAnHour = computed(() => {
  const eventMap = {};
  for (let i = 8; i <= 18; i++) {
    const keyHour = i.toString().padStart(2, '0');
    eventMap[`${keyHour}:00`] = [];
    eventMap[`${keyHour}:30`] = [];
  }
  events.value.forEach(event => {
    const eventDate = new Date(event.date);
    const eventDateStr = eventDate.toISOString().split('T')[0];
    if (eventDateStr === selectedDate.value) {
      const hour = eventDate.getHours();
      const minutes = eventDate.getMinutes();
      if (hour >= 8 && hour <= 18) {
        const keyMinutes = minutes - (minutes % 30);
        const key = `${hour.toString().padStart(2, '0')}:${keyMinutes.toString().padStart(2, '0')}`;
        eventMap[key]?.push({ ...getEventColor(event), timeStr: eventDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) });
      }
    }
  });
  return eventMap;
});

const getOutOfRangeEvents = computed(() => {
  return events.value.filter(event => {
    const eventDate = new Date(event.date);
    const eventDateStr = eventDate.toISOString().split('T')[0];
    const hour = eventDate.getHours();
    return eventDateStr === selectedDate.value && (hour < 8 || hour > 18);
  }).map(event => ({ ...getEventColor(event), timeStr: new Date(event.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }));
});

const getWeekDays = (centerDate) => {
  const date = new Date(centerDate);
  const dayOfWeek = date.getDay();
  const weekStart = new Date(date);
  weekStart.setDate(date.getDate() - dayOfWeek);
  
  return Array.from({ length: 7 }, (_, i) => {
    const day = new Date(weekStart);
    day.setDate(weekStart.getDate() + i);
    const dateStr = day.toISOString().split('T')[0];
    const dayEvents = daysInMonth.value.find(d => d.date === dateStr)?.events || [];
    return { dateStr, events: dayEvents };
  });
};

const activeViewComponent = computed(() => {
  const viewsMap = { Month: CalendarMonthGrid, Day: CalendarDayView, Week: CalendarWeekView };
  return viewsMap[activeView.value] || CalendarMonthGrid;
});

// --- Event Handlers & Logic ---
const handleDayClick = (day) => {
  modalDayEvents.value = day.events;
  modalDayDate.value = day.date;
  selectedDate.value = day.date;
  isDayModalOpen.value = true;
};

const closeDayModal = () => {
  isDayModalOpen.value = false;
  modalDayEvents.value = [];
  modalDayDate.value = '';
};

const previousMonth = () => {
  currentMonth.value = currentMonth.value === 0 ? 11 : currentMonth.value - 1;
  if (currentMonth.value === 11) currentYear.value--;
};

const nextMonth = () => {
  currentMonth.value = currentMonth.value === 11 ? 0 : currentMonth.value + 1;
  if (currentMonth.value === 0) currentYear.value++;
};

const previousDay = () => {
  const date = new Date(selectedDate.value);
  date.setDate(date.getDate() - 1);
  selectedDate.value = date.toISOString().split('T')[0];
};

const nextDay = () => {
  const date = new Date(selectedDate.value);
  date.setDate(date.getDate() + 1);
  selectedDate.value = date.toISOString().split('T')[0];
};

const previousWeek = () => {
  const date = new Date(selectedDate.value);
  date.setDate(date.getDate() - 7);
  selectedDate.value = date.toISOString().split('T')[0];
};

const nextWeek = () => {
  const date = new Date(selectedDate.value);
  date.setDate(date.getDate() + 7);
  selectedDate.value = date.toISOString().split('T')[0];
};

const handlePrevious = () => {
  const handlers = { Month: previousMonth, Day: previousDay, Week: previousWeek };
  handlers[activeView.value]();
};

const handleNext = () => {
  const handlers = { Month: nextMonth, Day: nextDay, Week: nextWeek };
  handlers[activeView.value]();
};

const togglePeopleDropdown = () => {
  peopleDropdownOpen.value = !peopleDropdownOpen.value;
};

const closeDropdown = () => {
  peopleDropdownOpen.value = false;
};

const handleAddEventCancel = () => {
  isAddEventModalOpen.value = false;
  isDayModalOpen.value = true;
};

const saveNewEvent = () => {
  const eventDateTime = `${modalDayDate.value}T${newEventData.value.time}`;
  const newId = events.value.length ? Math.max(...events.value.map(e => e.id)) + 1 : 1;
  events.value.push({
    id: newId,
    date: eventDateTime,
    title: newEventData.value.type || 'Untitled',
    color: 'blue',
    frequencyPattern: newEventData.value.frequencyPattern,
    frequencyDays: [...newEventData.value.frequencyDays],
    frequencyDates: [...newEventData.value.frequencyDates],
    preReminderValue: parseInt(newEventData.value.preReminderValue),
    preReminderUnit: newEventData.value.preReminderUnit,
    priority: newEventData.value.priority,
    visibilityType: newEventData.value.visibilityType,
    visibilityValue: [...newEventData.value.visibilityValue],
    onlyOneCompletes: newEventData.value.onlyOneCompletes,
    note: newEventData.value.note,
  });

  const refreshedEvents = events.value.filter(e => e.date.startsWith(modalDayDate.value)).map(getEventColor);
  modalDayEvents.value = refreshedEvents;
  isAddEventModalOpen.value = false;

  // Reset form
  newEventData.value = {
    type: '', time: '12:00', preReminderValue: '5', preReminderUnit: 'minutes',
    frequencyPattern: 'doNotRepeat', frequencyDays: [], frequencyDates: [],
    priority: '', visibilityType: 'Only Me', visibilityValue: [],
    onlyOneCompletes: false, note: '',
  };
};

onMounted(() => {
  document.addEventListener('click', closeDropdown);
});
onUnmounted(() => {
  document.removeEventListener('click', closeDropdown);
});

</script>

<template>
  <main class="view dark:bg-darkBlue bg-white">
    <section
      class="max-w-[1600px] mx-auto my-10 flex justify-center items-center rounded-xl shadow-outer dark:bg-darkPurple bg-[rgba(90,169,230,.35)] border dark:border-lightBlue border-clientPurple px-8 py-4 overflow-hidden transition-all duration-300 ease">
      <div class="p-6 w-full max-w-6xl">
        <CalendarHeader   
          :currentMonthName="currentMonthName"
          :currentYear="currentYear"
          :selectedDate="selectedDate"
          :handlePrevious="handlePrevious"
          :handleNext="handleNext"
          :views="views"
          :activeView="activeView"
          @update:activeView="(view) => activeView = view"
          @add-event="() => { isAddEventModalOpen = true; isDayModalOpen = false; }"
        />

        <Transition name="fade" mode="out-in">
          <component
            :is="activeViewComponent"
            :key="activeView"
            :weekDays="weekDays"
            :daysInMonth="daysInMonth"
            :selectedDate="selectedDate"
            :getEventsByHalfAnHour="getEventsByHalfAnHour"
            :getOutOfRangeEvents="getOutOfRangeEvents"
            :getWeekDays="getWeekDays"
            @day-click="handleDayClick"
          />
        </Transition>

        <DayEvents
          :isOpen="isDayModalOpen"
          :date="modalDayDate"
          :events="modalDayEvents"
          @close="closeDayModal"
          @add-event="() => { isDayModalOpen = false; isAddEventModalOpen = true }"
        />
        <AddEvents
          :isOpen="isAddEventModalOpen"
          :date="modalDayDate"
          :newEventData="newEventData"
          :allDepartments="allDepartments"
          :allBranches="allBranches"
          :allPositions="allPositions"
          :allPeople="allPeople"
          :frequencyMode="frequencyMode"
          :peopleDropdownOpen="peopleDropdownOpen"
          @save-event="saveNewEvent"
          @cancel="handleAddEventCancel"
          @toggle-people-dropdown="togglePeopleDropdown"
          @update-frequency-mode="(mode) => frequencyMode = mode"
          @update:newEventData="newValue => newEventData = newValue"
        />
      </div>
    </section>
  </main>
</template>

<style scoped>
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}

::-webkit-scrollbar {
  display: none;
}
</style>