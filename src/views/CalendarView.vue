<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import CalendarHeader from '@/components/calendar/CalendarHeader.vue';
import CalendarMonthGrid from '@/components/calendar/CalendarMonthGrid.vue';
import CalendarDayView from '@/components/calendar/CalendarDayView.vue';
import CalendarWeekView from '@/components/calendar/CalendarWeekView.vue';
import AddEvents from '@/components/calendar/AddEvents.vue';
import DayEvents from '@/components/calendar/DayEvents.vue';

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

const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const monthNames = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

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
  { id: 12, date: '2025-07-03T17:00:00', title: 'Team Meeting', color: 'red' },
  { id: 12, date: '2025-07-03T17:00:00', title: 'Team Meeting', color: 'red' },
  { id: 12, date: '2025-07-03T17:00:00', title: 'Team Meeting', color: 'red' },
  { id: 12, date: '2025-07-03T17:00:00', title: 'Team Meeting', color: 'red' },
  { id: 12, date: '2025-07-03T17:00:00', title: 'Team Meeting', color: 'red' },
  { id: 12, date: '2025-07-03T17:00:00', title: 'Team Meeting', color: 'red' },
  { id: 12, date: '2025-07-03T17:00:00', title: 'Team Meeting', color: 'red' },
  { id: 12, date: '2025-07-03T17:00:00', title: 'Team Meeting', color: 'red' },
  { id: 12, date: '2025-07-03T17:00:00', title: 'Team Meeting', color: 'red' },
  { id: 12, date: '2025-07-03T17:00:00', title: 'Team Meeting', color: 'red' },
  { id: 13, date: '2025-07-30T17:00:00', title: 'Team Meeting', color: 'red' },
  { id: 13, date: '2025-07-30T17:00:00', title: 'Team Meeting', color: 'red' },
  { id: 13, date: '2025-07-31T20:00:00', title: 'Team Meeting', color: 'red' },
]);

const currentMonthName = computed(() => monthNames[currentMonth.value]);

const daysInMonth = computed(() => {
  const year = currentYear.value;
  const month = currentMonth.value;
  const firstDayOfMonth = new Date(year, month, 1);
  const lastDayOfMonth = new Date(year, month + 1, 0);
  const daysInCurrentMonth = lastDayOfMonth.getDate();

  const startDay = firstDayOfMonth.getDay();
  const leadingDaysCount = startDay;
  const days = [];

  const prevMonthLastDay = new Date(year, month, 0).getDate();
  for (let i = leadingDaysCount - 1; i >= 0; i--) {
    const date = new Date(year, month - 1, prevMonthLastDay - i);
    days.push({
      date: date.toISOString().split('T')[0],
      dayOfMonth: date.getDate(),
      isCurrentMonth: false,
      isToday: false,
      isSelected: false,
      events: [],
    });
  }

  for (let i = 1; i <= daysInCurrentMonth; i++) {
    const date = new Date(year, month, i);
    const isToday = date.toDateString() === today.toDateString();
    const isSelected = selectedDate.value === date.toISOString().split('T')[0];
    const dayEvents = events.value.filter(event => {
      const eventDate = new Date(event.date);
      return (
        eventDate.getFullYear() === date.getFullYear() &&
        eventDate.getMonth() === date.getMonth() &&
        eventDate.getDate() === date.getDate()
      );
    }).map(event => {
      let bgColor = '', textColor = 'white';
      switch (event.color) {
        case 'red': bgColor = '#EF4444'; break;
        case 'teal': bgColor = '#14B8A6'; break;
        case 'purple': bgColor = '#A855F7'; break;
        case 'yellow': bgColor = '#F59E0B'; break;
        default: bgColor = '#3B82F6';
      }
      return { ...event, bgColor, textColor };
    });

    // Group and count events by title for summary
    const summaryMap = {};
    dayEvents.forEach(event => {
      if (!summaryMap[event.title]) {
        summaryMap[event.title] = { count: 1, bgColor: event.bgColor, textColor: event.textColor };
      } else {
        summaryMap[event.title].count++;
      }
    });
    const eventSummary = Object.entries(summaryMap).map(([title, info]) => ({
      title,
      count: info.count,
      bgColor: info.bgColor,
      textColor: info.textColor
    }));

    days.push({
      date: date.toISOString().split('T')[0],
      dayOfMonth: i,
      isCurrentMonth: true,
      isToday,
      isSelected,
      events: dayEvents,
      eventSummary,
    });
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
  const intervals = [];
  // Loop from 8 AM (8) to 6 PM (18)
  for (let i = 8; i <= 18; i++) {
    // Add keys for the hour (e.g., 08:00, 09:00, etc.)
    intervals.push({ hour: i, minutes: 0 });
    // Add keys for the half-hour (e.g., 08:30, 09:30, etc.)
    intervals.push({ hour: i, minutes: 30 });
  }

  const eventMap = {};
  for (const { hour, minutes } of intervals) {
    const key = `${hour.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
    eventMap[key] = [];
  }

  for (const event of events.value) {
    const eventDate = new Date(event.date);
    const selected = new Date(selectedDate.value);

    const eventDateStr = eventDate.getFullYear() + '-' + String(eventDate.getMonth() + 1).padStart(2, '0') + '-' + String(eventDate.getDate()).padStart(2, '0');

    if (eventDateStr === selectedDate.value) {
      const hour = eventDate.getHours();
      // Check if the event's hour is within the desired range (8 AM to 6 PM)
      if (hour >= 8 && hour < 19) {
        const minutes = eventDate.getMinutes() - (eventDate.getMinutes() % 30);
        const key = `${hour.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;

        let bgColor = '', textColor = 'white';
        switch (event.color) {
          case 'red': bgColor = '#EF4444'; break;
          case 'teal': bgColor = '#14B8A6'; break;
          case 'purple': bgColor = '#A855F7'; break;
          case 'yellow': bgColor = '#F59E0B'; break;
          default: bgColor = '#3B82F6';
        }

        eventMap[key].push({
          ...event,
          bgColor,
          textColor,
          timeStr: eventDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        });
      }
    }
  }

  return eventMap;
});

const getOutOfRangeEvents = computed(() => {
  const outOfRange = [];
  for (const event of events.value) {
    const eventDate = new Date(event.date);
    const eventDateStr = eventDate.getFullYear() + '-' + String(eventDate.getMonth() + 1).padStart(2, '0') + '-' + String(eventDate.getDate()).padStart(2, '0');

    if (eventDateStr === selectedDate.value) {
      const hour = eventDate.getHours();
      if (hour < 8 || hour >= 19) {
        let bgColor = '', textColor = 'white';
        switch (event.color) {
          case 'red': bgColor = '#EF4444'; break;
          case 'teal': bgColor = '#14B8A6'; break;
          case 'purple': bgColor = '#A855F7'; break;
          case 'yellow': bgColor = '#F59E0B'; break;
          default: bgColor = '#3B82F6';
        }

        outOfRange.push({
          ...event,
          bgColor,
          textColor,
          timeStr: eventDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        });
      }
    }
  }
  return outOfRange;
});

const getWeekDays = (centerDate) => {
  const date = new Date(centerDate);
  const dayOfWeek = date.getDay(); // 0 = Sun
  const weekStart = new Date(date);
  weekStart.setDate(date.getDate() - dayOfWeek);

  return Array.from({ length: 7 }, (_, i) => {
    const day = new Date(weekStart);
    day.setDate(weekStart.getDate() + i);
    const dateStr = day.toISOString().split('T')[0];

    const dayEvents = daysInMonth.value.find(d => d.date === dateStr)?.events || [];

    return {
      dateStr,
      events: dayEvents,
    };
  });
};

const previousMonth = () => {
  if (currentMonth.value === 0) {
    currentMonth.value = 11;
    currentYear.value--;
  } else {
    currentMonth.value--;
  }
};

const nextMonth = () => {
  if (currentMonth.value === 11) {
    currentMonth.value = 0;
    currentYear.value++;
  } else {
    currentMonth.value++;
  }
};

const addNewEvent = (dateStr) => {
  const newEvent = {
    id: events.value.length + 1,
    date: `${dateStr}T12:00:00`, // Default time
    title: 'New Event',
    color: 'blue', // Default color
  };

  events.value.push(newEvent);

  // Refresh modal events immediately
  const dayEvents = events.value.filter(event => event.date.startsWith(dateStr)).map(event => {
    let bgColor = '', textColor = 'white';
    switch (event.color) {
      case 'red': bgColor = '#EF4444'; break;
      case 'teal': bgColor = '#14B8A6'; break;
      case 'purple': bgColor = '#A855F7'; break;
      case 'yellow': bgColor = '#F59E0B'; break;
      default: bgColor = '#3B82F6';
    }
    return { ...event, bgColor, textColor };
  });

  modalDayEvents.value = dayEvents;
};

const allDepartments = [
  { id: 1, name: 'Legal' },
  { id: 2, name: 'IT' },
  { id: 3, name: 'Collections' },
  { id: 4, name: 'Sales' },
  { id: 5, name: 'Admin' },
  { id: 6, name: 'HR' },
];

const allBranches = [
  { id: 1, name: 'Lebanon' },
  { id: 2, name: 'Kenya' },
  { id: 3, name: 'Phillippines' },
  { id: 4, name: 'USA' },
];

const allPositions = [
  { id: 1, name: 'Manager' },
  { id: 2, name: 'Developer' },
  { id: 3, name: 'Designer' },
  { id: 4, name: 'QA Engineer' },
  { id: 5, name: 'Product Owner' },
];

const allPeople = [
  { id: 1, name: 'Ali' },
  { id: 2, name: 'Sarah' },
  { id: 3, name: 'John' },
  { id: 4, name: 'Lea' },
  { id: 5, name: 'Toni' },
  { id: 6, name: 'Maya' },
  { id: 7, name: 'Omar' },
  { id: 8, name: 'Zara' },
  { id: 9, name: 'Liam' },
  { id: 10, name: 'Emma' },
  { id: 11, name: 'Noah' },
  { id: 12, name: 'Olivia' },
  { id: 13, name: 'Ava' },
  { id: 14, name: 'Sophia' },
  { id: 15, name: 'Isabella' },
];

const togglePeopleDropdown = () => {
  peopleDropdownOpen.value = !peopleDropdownOpen.value;
};

const closeDropdown = () => {
  peopleDropdownOpen.value = false;
};


const onClickOutside = (element, callback) => {
  const handler = (e) => {
    if (!element.contains(e.target)) callback();
  };
  onMounted(() => document.addEventListener('click', handler));
  onUnmounted(() => document.removeEventListener('click', handler));
}

const handleAddEventCancel = () => {
  isAddEventModalOpen.value = false;
  isDayModalOpen.value = true;
};

onClickOutside(document, closeDropdown);

const saveNewEvent = () => {
  const eventDateTime = `${modalDayDate.value}T${newEventData.value.time}`;

  events.value.push({
    id: events.value.length + 1,
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

  // Refresh modal
  const refreshed = events.value.filter(e => e.date.startsWith(modalDayDate.value)).map(event => {
    let bgColor = '', textColor = 'white';
    switch (event.color) {
      case 'red': bgColor = '#EF4444'; break;
      case 'teal': bgColor = '#14B8A6'; break;
      case 'purple': bgColor = '#A855F7'; break;
      case 'yellow': bgColor = '#F59E0B'; break;
      default: bgColor = '#3B82F6';
    }
    return { ...event, bgColor, textColor };
  });

  modalDayEvents.value = refreshed;
  isAddEventModalOpen.value = false;

  // Reset form
  newEventData.value = {
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
  };
};



// const selectDay = (dateString) => {
//   selectedDate.value = dateString;
// };

const views = ['Day', 'Week', 'Month'];

const activeViewComponent = computed(() => {
  switch (activeView.value) {
    case 'Month':
      return CalendarMonthGrid;
    case 'Day':
      return CalendarDayView;
    case 'Week':
      return CalendarWeekView;
    default:
      return CalendarMonthGrid;
  }
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
        :previousMonth="previousMonth"
        :nextMonth="nextMonth"
        :views="views"
        :activeView="activeView"
        :isOpen="isAddEventModalOpen"
        @update:activeView="(view) => activeView = view"
        @add-event="() => { 
        isAddEventModalOpen = true;
        isDayModalOpen = false;
        }"
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