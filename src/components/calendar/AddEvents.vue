<script setup>

import { ref, computed } from 'vue';
const peopleDropdownOpenLocal = ref(false);
const positionsDropdownOpenLocal = ref(false);
const branchesDropdownOpenLocal = ref(false);
const departmentsDropdownOpenLocal = ref(false);

const props = defineProps({
  isOpen: Boolean,
  date: String,
  newEventData: Object,
  allDepartments: Array,
  allBranches: Array,
  allPositions: Array,
  allPeople: Array,
  frequencyMode: String,
  peopleDropdownOpen: Boolean,
});

const emit = defineEmits(['save-event', 'cancel', 'update:newEventData']);

const addToFrequencyDates = (e) => {
  const val = e.target.value;
  if (val && !newEventData.value.frequencyDates.includes(val)) {
    newEventData.value.frequencyDates.push(val);
  }
};

const removeFrequencyDate = (index) => {
  newEventData.value.frequencyDates.splice(index, 1);
};

// Computed property to check if all are selected
const allSelected = computed(() => {
    return props.newEventData.visibilityValue.length === props.allPeople.length;
});

const allDepartmentsSelected = computed(() => {
  return props.newEventData.visibilityValue.length === props.allDepartments.length;
});

const allBranchesSelected = computed(() => {
  return props.newEventData.visibilityValue.length === props.allBranches.length;
});

const allPositionsSelected = computed(() => {
  return props.newEventData.visibilityValue.length === props.allPositions.length;
});

// Method to toggle 'Select All'
const toggleSelectAll = (listType) => {
  let list = [];
  let allSelected = false;

  switch (listType) {
    case 'Department':
      list = props.allDepartments;
      allSelected = allDepartmentsSelected.value;
      break;
    case 'Branch':
      list = props.allBranches;
      allSelected = allBranchesSelected.value;
      break;
    case 'Positions':
      list = props.allPositions;
      allSelected = allPositionsSelected.value;
      break;
    default:
      return;
  }

  // If already all selected, clear the list. Otherwise, map all names.
  const newVisibilityValue = allSelected ? [] : list.map(item => item.name);

  emit('update:newEventData', {
    ...props.newEventData,
    visibilityValue: newVisibilityValue
  });
};

const togglePeopleDropdown = () => {
  peopleDropdownOpenLocal.value = !peopleDropdownOpenLocal.value;
};

const togglePositionsDropdown = () => {
  positionsDropdownOpenLocal.value = !positionsDropdownOpenLocal.value;
};

const toggleBranchesDropdown = () => {
  branchesDropdownOpenLocal.value = !branchesDropdownOpenLocal.value;
};

const toggleDepartmentsDropdown = () => {
  departmentsDropdownOpenLocal.value = !departmentsDropdownOpenLocal.value;
};

</script>

<template>
  <Transition name="modal-fade">
    <div v-if="isOpen" class="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div class="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm" @click="$emit('cancel')"></div>
      <div
        class="relative bg-white dark:bg-darkBlue rounded-xl shadow-2xl p-6 w-full max-w-xl border dark:border-lightBlue border-clientPurple space-y-4">
        <h2 class="text-xl font-bold text-gray-800 dark:text-white mb-4">Add Event for {{ modalDayDate }}</h2>

        <div class="space-y-3 text-gray-800 dark:text-white">
          <div>
            <label class="block text-sm font-medium mb-1">Event Type</label>
            <select v-model="newEventData.type"
              class="p-2 border border-gray-400 rounded bg-white w-full dark:bg-darkBlue text-gray-700 dark:text-white outline-none"
              required>
              <option disabled value="">Select type</option>
              <option>Team Meeting</option>
              <option>Call Back</option>
              <option>Follow Up</option>
              <option>Send Service Agreement</option>
            </select>
          </div>

          <div>
            <label class="block text-sm font-medium mb-1">Reminder Time</label>
            <input v-model="newEventData.time" type="time"
              class="p-2 border border-gray-400 rounded bg-white w-full dark:bg-darkBlue text-gray-700 dark:text-white outline-none"
              required />
          </div>

          <div>
            <label class="block text-sm font-medium mb-1">Pre-Reminder</label>
            <div class="flex gap-2">
              <input v-model="newEventData.preReminderValue" type="number" min="0"
                class="p-2 border border-gray-400 rounded bg-white w-1/2 dark:bg-darkBlue text-gray-700 dark:text-white outline-none" />
              <select v-model="newEventData.preReminderUnit"
                class="w-1/2 p-2 border border-gray-400 rounded bg-white dark:bg-darkBlue text-gray-700 dark:text-white outline-none">
                <option value="minutes">Minutes</option>
                <option value="hours">Hours</option>
                <option value="days">Days</option>
              </select>
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium mb-1">Frequency</label>
            <div class="flex justify-between items-center gap-6 mb-2">
              <select v-model="newEventData.frequencyPattern"
                class="p-2 border border-gray-400 rounded bg-white w-full dark:bg-darkBlue text-gray-700 dark:text-white outline-none"
                required>
                <option value="doNotRepeat">Do Not Repeat</option>
                <option value="every">Every</option>
                <option value="everyDay">Every Day</option>
                <option value="everyOther">Every Other</option>
                <option value="everyWeekday">Every Weekday</option>
                <option value="every1st">Every 1st</option>
                <option value="every2nd">Every 2nd</option>
                <option value="every3rd">Every 3rd</option>
                <option value="every4th">Every 4th</option>
              </select>

              <div v-if="newEventData.frequencyPattern !== 'doNotRepeat'" class="flex gap-2 mb-2">
                <button @click="$emit('update-frequency-mode', 'week')"
                  :class="frequencyMode === 'week' ? 'bg-blue-500 text-white' : 'bg-gray-200'"
                  class="px-2 py-1 rounded">Week</button>

                <button @click="$emit('update-frequency-mode', 'month')"
                  :class="frequencyMode === 'month' ? 'bg-blue-500 text-white' : 'bg-gray-200'"
                  class="px-2 py-1 rounded">Month</button>
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
              <input type="date" @change="addToFrequencyDates($event)" class="border rounded p-2 dark:bg-darkBlue" />
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
            <select v-model="newEventData.priority"
              class="p-2 border border-gray-400 rounded bg-white w-full dark:bg-darkBlue text-gray-700 dark:text-white outline-none"
              required>
              <option disabled value="">Select priority</option>
              <option>Low</option>
              <option>Medium</option>
              <option>High</option>
            </select>
          </div>

          <div>
            <label class="block text-sm font-medium mb-1">Visibility</label>
            <select v-model="newEventData.visibilityType"
              class="p-2 border border-gray-400 rounded bg-white w-full dark:bg-darkBlue text-gray-700 dark:text-white outline-none"
              required>
              <option>Only Me</option>
              <option>Department</option>
              <option>Branch</option>
              <option>Positions</option>
              <option>Certain People</option>
            </select>

            <div class="mt-2" v-if="newEventData.visibilityType === 'Department'">
              <label class="block text-sm font-medium mb-1">Select Department</label>
              <div @click="toggleDepartmentsDropdown" class="border p-2 rounded cursor-pointer dark:bg-darkBlue bg-white">
                <span v-if="newEventData.visibilityValue.length">
                  {{ newEventData.visibilityValue.join(', ') }}
                </span>
                <span v-else class="text-gray-400">Select Department</span>
              </div>

              <div v-if="departmentsDropdownOpenLocal"
                class="absolute z-10 mt-1 bg-white dark:bg-darkBlue border rounded shadow w-full max-h-48 overflow-y-auto">
                <label class="flex items-center px-2 py-1 hover:bg-gray-100 dark:hover:bg-darkPurple cursor-pointer">
                  <input type="checkbox" :checked="allDepartmentsSelected" @change="toggleSelectAll('Department')" class="mr-2" />
                  Select All
                </label>
                <label v-for="department in allDepartments" :key="department.id"
                  class="flex items-center px-2 py-1 hover:bg-gray-100 dark:hover:bg-darkPurple cursor-pointer">
                  <input type="checkbox" :value="department.name" v-model="newEventData.visibilityValue" class="mr-2" />
                  {{ department.name }}
                </label>
              </div>
            </div> 

            <div class="mt-2" v-if="newEventData.visibilityType === 'Branch'">
              <label class="block text-sm font-medium mb-1">Select Branch</label>
              <div @click="toggleBranchesDropdown" class="border p-2 rounded cursor-pointer dark:bg-darkBlue bg-white">
                <span v-if="newEventData.visibilityValue.length">
                  {{ newEventData.visibilityValue.join(', ') }}
                </span>
                <span v-else class="text-gray-400">Select Branch</span>
              </div>

              <div v-if="branchesDropdownOpenLocal"
                class="absolute z-10 mt-1 bg-white dark:bg-darkBlue border rounded shadow w-full max-h-48 overflow-y-auto">
                <label class="flex items-center px-2 py-1 hover:bg-gray-100 dark:hover:bg-darkPurple cursor-pointer">
                  <input type="checkbox" :checked="allBranchesSelected" @change="toggleSelectAll('Branch')" class="mr-2" />
                  Select All
                </label>
                <label v-for="branch in allBranches" :key="branch.id"
                  class="flex items-center px-2 py-1 hover:bg-gray-100 dark:hover:bg-darkPurple cursor-pointer">
                  <input type="checkbox" :value="branch.name" v-model="newEventData.visibilityValue" class="mr-2" />
                  {{ branch.name }}
                </label>
              </div>
            </div>            

            <div class="mt-2" v-if="newEventData.visibilityType === 'Positions'">
              <label class="block text-sm font-medium mb-1">Select Position</label>
              <div @click="togglePositionsDropdown" class="border p-2 rounded cursor-pointer dark:bg-darkBlue bg-white">
                <span v-if="newEventData.visibilityValue.length">
                  {{ newEventData.visibilityValue.join(', ') }}
                </span>
                <span v-else class="text-gray-400">Select positions</span>
              </div>

              <div v-if="positionsDropdownOpenLocal"
                class="absolute z-10 mt-1 bg-white dark:bg-darkBlue border rounded shadow w-full max-h-48 overflow-y-auto">
                <label class="flex items-center px-2 py-1 hover:bg-gray-100 dark:hover:bg-darkPurple cursor-pointer">
                  <input type="checkbox" :checked="allPositionsSelected" @change="toggleSelectAll('Positions')" class="mr-2" />
                  Select All
                </label>
                <label v-for="position in allPositions" :key="position.id"
                  class="flex items-center px-2 py-1 hover:bg-gray-100 dark:hover:bg-darkPurple cursor-pointer">
                  <input type="checkbox" :value="position.name" v-model="newEventData.visibilityValue" class="mr-2" />
                  {{ position.name }}
                </label>
              </div>
            </div>

            <div class="mt-2 relative" v-if="newEventData.visibilityType === 'Certain People'">
              <label class="block text-sm font-medium mb-1">Select People</label>

              <div @click="togglePeopleDropdown" class="border p-2 rounded cursor-pointer dark:bg-darkBlue bg-white">
                <span v-if="newEventData.visibilityValue.length">
                  {{ newEventData.visibilityValue.join(', ') }}
                </span>
                <span v-else class="text-gray-400">Select people</span>
              </div>

              <div v-if="peopleDropdownOpenLocal"
                class="absolute z-10 mt-1 bg-white dark:bg-darkBlue border rounded shadow w-full max-h-48 overflow-y-auto">
                <label class="flex items-center px-2 py-1 hover:bg-gray-100 dark:hover:bg-darkPurple cursor-pointer">
                    <input type="checkbox" :checked="allSelected" @change="toggleSelectAll" class="mr-2" />
                    Select All
                </label>
                <label v-for="person in allPeople" :key="person.id"
                    class="flex items-center px-2 py-1 hover:bg-gray-100 dark:hover:bg-darkPurple cursor-pointer">
                    <input type="checkbox" :value="person.name" v-model="newEventData.visibilityValue" class="mr-2" />
                    {{ person.name }}
                </label>
              </div>
            </div>



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
              class="p-2 border border-gray-400 rounded bg-white w-full dark:bg-darkBlue text-gray-700 dark:text-white outline-none resize-none overflow-y-scroll"></textarea>
          </div>
        </div>

        <div class="flex justify-end space-x-2 pt-4">
          <button @click="$emit('cancel')"
            class="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400 text-black">Cancel</button>
          <button @click="$emit('save-event')" class="px-4 py-2 rounded bg-blue-600 hover:bg-blue-700 text-white">Save</button>
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
