<script setup>
import { ref, computed } from 'vue';

// --- Props & Emits ---
const props = defineProps({
  isOpen: Boolean,
  date: String,
  newEventData: Object,
  allDepartments: Array,
  allBranches: Array,
  allPositions: Array,
  allPeople: Array,
  frequencyMode: String,
});

const emit = defineEmits(['save-event', 'cancel', 'update:newEventData', 'update-frequency-mode']);

// --- State Management ---
// Consolidated dropdown state into a single object
const dropdownOpenState = ref({
  people: false,
  positions: false,
  branches: false,
  departments: false,
});

// --- Computed Properties ---
const dropdownLists = computed(() => {
  return {
    Department: props.allDepartments,
    Branch: props.allBranches,
    Positions: props.allPositions,
    'Certain People': props.allPeople,
  };
});

const isAllSelected = computed(() => (listType) => {
  const list = dropdownLists.value[listType];
  return props.newEventData.visibilityValue.length === list?.length;
});

// --- Event Handlers & Methods ---
const addToFrequencyDates = (e) => {
  const val = e.target.value;
  if (val && !props.newEventData.frequencyDates.includes(val)) {
    const updatedDates = [...props.newEventData.frequencyDates, val];
    emit('update:newEventData', { ...props.newEventData, frequencyDates: updatedDates });
  }
};

const removeFrequencyDate = (index) => {
  const updatedDates = [...props.newEventData.frequencyDates];
  updatedDates.splice(index, 1);
  emit('update:newEventData', { ...props.newEventData, frequencyDates: updatedDates });
};

// Reusable function to toggle any dropdown
const toggleDropdown = (listType) => {
  const key = listType.toLowerCase().replace(' ', '');
  dropdownOpenState.value[key] = !dropdownOpenState.value[key];
};

// Reusable function to toggle 'Select All' for any list
const toggleSelectAll = (listType) => {
  const list = dropdownLists.value[listType];
  const newVisibilityValue = isAllSelected.value(listType) ? [] : list.map(item => item.name);
  
  emit('update:newEventData', {
    ...props.newEventData,
    visibilityValue: newVisibilityValue
  });
};
</script>

<template>
  <Transition name="modal-fade">
    <div v-if="isOpen" class="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div class="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm" @click="$emit('cancel')"></div>
      <div
        class="relative bg-white dark:bg-darkBlue rounded-xl shadow-2xl p-6 w-full max-w-xl border dark:border-lightBlue border-clientPurple space-y-4">
        <h2 class="text-xl font-bold text-gray-800 dark:text-white mb-4">Add Event for {{ date }}</h2>

        <div class="space-y-3 text-gray-800 dark:text-white">
          <div>
            <label class="block text-sm font-medium mb-1">Event Type</label>
            <select :value="newEventData.type" @input="emit('update:newEventData', { ...newEventData, type: $event.target.value })"
              class="p-2 border border-gray-400 rounded bg-white w-full dark:bg-darkBlue text-gray-700 dark:text-white outline-none shadow-inner"
              required>
              <option disabled value="">Select type</option>
              <option>Team Meeting</option>
              <option>Call Back</option>
              <option>Follow Up</option>
              <option>Send Service Agreement</option>
            </select>
          </div>

          <div class="flex gap-2">
            <div class="flex-1">
              <label class="block text-sm font-medium mb-1">Reminder Time</label>
              <input :value="newEventData.time" @input="emit('update:newEventData', { ...newEventData, time: $event.target.value })" type="time"
                class="p-2 border border-gray-400 rounded bg-white w-full dark:bg-darkBlue text-gray-700 dark:text-white outline-none shadow-inner"
                required />
            </div>
            <div>
            <label class="block text-sm font-medium mb-1">Pre-Reminder</label>
            <div class="flex gap-2">
              <input :value="newEventData.preReminderValue" @input="emit('update:newEventData', { ...newEventData, preReminderValue: $event.target.value })" type="number" min="0"
                class="p-2 border border-gray-400 rounded bg-white w-1/2 dark:bg-darkBlue text-gray-700 dark:text-white outline-none shadow-inner" />
              <select :value="newEventData.preReminderUnit" @input="emit('update:newEventData', { ...newEventData, preReminderUnit: $event.target.value })"
                class="w-1/2 p-2 border border-gray-400 rounded bg-white dark:bg-darkBlue text-gray-700 dark:text-white outline-none shadow-inner">
                <option value="minutes">Minutes</option>
                <option value="hours">Hours</option>
                <option value="days">Days</option>
                <option value="months">Months</option>
              </select>
            </div>
          </div>
          </div>

          

          <div>
            <label class="block text-sm font-medium mb-1">Frequency</label>
            <div class="flex justify-between items-center gap-6 mb-2">
              <select :value="newEventData.frequencyPattern" @input="emit('update:newEventData', { ...newEventData, frequencyPattern: $event.target.value })"
                class="p-2 border border-gray-400 rounded bg-white w-full dark:bg-darkBlue text-gray-700 dark:text-white outline-none shadow-inner"
                required>
                <option value="doNotRepeat">Do Not Repeat</option>
                <option value="every">Every</option>
                <option value="everyOther">Every Other</option>
                <option value="everyWeekday">Every Weekday</option>
                <option value="every1st">Every 1st</option>
                <option value="every2nd">Every 2nd</option>
                <option value="every3rd">Every 3rd</option>
                <option value="every4th">Every 4th</option>
              </select>

              <div v-if="newEventData.frequencyPattern !== 'doNotRepeat'" class="flex gap-2 mb-2">
                <button @click="emit('update-frequency-mode', 'week')"
                  :class="frequencyMode === 'week' ? 'shadow-inner' : 'shadow-outer'"
                  class="px-2 py-1 border dark:bg-darkBrown bg-warmYellow/70 border-darkOrange dark:text-darkOrange text-gray-800 rounded">Week</button>

                <button @click="emit('update-frequency-mode', 'month')"
                  :class="frequencyMode === 'month' ? 'shadow-inner' : 'shadow-outer'"
                  class="px-2 py-1 border dark:bg-darkBrown bg-warmYellow/70 border-darkOrange dark:text-darkOrange text-gray-800 rounded">Month</button>
              </div>
            </div>

            <div v-if="frequencyMode === 'week' && newEventData.frequencyPattern !== 'doNotRepeat'"
              class="flex gap-2 flex-wrap">
              <label v-for="day in ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']" :key="day"
                class="flex items-center gap-1">
                <input type="checkbox" :value="day" v-model="newEventData.frequencyDays" />
                {{ day }}
              </label>
            </div>

            <div v-else-if="frequencyMode === 'month' && newEventData.frequencyPattern !== 'doNotRepeat'" class="mt-2">
              <label class="block text-sm font-medium mb-1">Select Dates</label>
              <input type="date" @change="addToFrequencyDates" class="border border-gray-500 rounded p-2 dark:bg-darkBlue shadow-inner" />
              <div class="flex gap-2 mt-1 flex-wrap">
                <span v-for="(date, i) in newEventData.frequencyDates" :key="i"
                  class="bg-gray-400 dark:bg-navBlue text-gray-700 dark:text-white px-2 py-1 rounded text-sm">
                  {{ date }}
                  <button @click="removeFrequencyDate(i)" class="ml-1 text-red-600 font-bold">&times;</button>
                </span>
              </div>
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium mb-1">Priority</label>
            <select :value="newEventData.priority" @input="emit('update:newEventData', { ...newEventData, priority: $event.target.value })"
              class="p-2 border border-gray-400 rounded bg-white w-full dark:bg-darkBlue text-gray-700 dark:text-white outline-none shadow-inner"
              required>
              <option disabled value="">Select priority</option>
              <option>High</option>
              <option>Medium</option>
              <option>Low</option>
            </select>
          </div>

          <div>
            <label class="block text-sm font-medium mb-1">Visibility</label>
            <select :value="newEventData.visibilityType" @input="emit('update:newEventData', { ...newEventData, visibilityType: $event.target.value, visibilityValue: [] })"
              class="p-2 border border-gray-400 rounded bg-white w-full dark:bg-darkBlue text-gray-700 dark:text-white outline-none shadow-inner"
              required>
              <option>Only Me</option>
              <option>Department</option>
              <option>Branch</option>
              <option>Positions</option>
              <option>Certain People</option>
            </select>

            <template v-for="[listType, list] in Object.entries(dropdownLists)" :key="listType">
              <div v-if="newEventData.visibilityType === listType" class="mt-2 relative">
                <label class="block text-sm font-medium mb-1">Select {{ listType }}</label>
                <div @click="toggleDropdown(listType)" class="p-2 border border-gray-400 rounded bg-white w-full dark:bg-darkBlue text-gray-700 dark:text-white outline-none shadow-inner">
                  <span v-if="newEventData.visibilityValue.length">
                    {{ newEventData.visibilityValue.join(', ') }}
                  </span>
                  <span v-else class="text-gray-400">Select {{ listType.toLowerCase() }}</span>
                </div>
                <div v-if="dropdownOpenState[listType.toLowerCase().replace(' ', '')]"
                  class="absolute z-10 mt-1 bg-white dark:bg-darkBlue border rounded shadow w-full max-h-48 overflow-y-auto">
                  <label class="flex items-center px-2 py-1 hover:bg-gray-100 dark:hover:bg-darkPurple cursor-pointer">
                    <input type="checkbox" :checked="isAllSelected(listType)" @change="toggleSelectAll(listType)" class="mr-2" />
                    Select All
                  </label>
                  <label v-for="item in list" :key="item.id"
                    class="flex items-center px-2 py-1 hover:bg-gray-100 dark:hover:bg-darkPurple cursor-pointer">
                    <input type="checkbox" :value="item.name" v-model="newEventData.visibilityValue" class="mr-2" />
                    {{ item.name }}
                  </label>
                </div>
              </div>
            </template>

            <div v-if="newEventData.visibilityType !== 'Only Me'" class="mt-2">
              <label class="inline-flex items-center">
                <input type="checkbox" v-model="newEventData.onlyOneCompletes" class="mr-2" />
                Only one can complete this reminder
              </label>
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium mb-1">Notes</label>
            <textarea v-model="newEventData.note" rows="1"
              class="p-2 border border-gray-400 rounded bg-white w-full h-28 dark:bg-darkBlue text-gray-700 dark:text-white outline-none resize-none overflow-y-scroll shadow-inner"></textarea>
          </div>
        </div>

        <div class="flex justify-end space-x-2 pt-4">
          <button @click="$emit('cancel')"
            class="px-4 py-2 rounded dark:bg-darkBrown bg-warmYellow/70 border border-darkOrange dark:text-darkOrange text-black shadow-outer">Cancel</button>
          <button @click="$emit('save-event')" class="px-4 py-2 rounded dark:bg-darkGreen bg-pigmentGreen border border-lightGreen dark:text-lightGreen text-white shadow-outer">Save</button>
        </div>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
::-webkit-scrollbar {
  display: none;
}

.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.3s ease;
}

.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}
</style>