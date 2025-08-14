<script setup>
import { ref, computed } from 'vue';

// --- State ---
const searchQuery = ref('');
const showOnlyImportant = ref(false);
const selectedSource = ref('All Notes');
const sortColumn = ref('');
const sortOrder = ref('asc');
const newNoteText = ref('');
const selectedPreset = ref('');
const newPresetName = ref('');
const newPresetMessage = ref('');
const showPresetCreation = ref(false);

const presetMessages = ref([
  { label: '-- Select a preset --', value: '' },
  { label: 'Follow up with client', value: 'Followed up with client regarding the recent discussion.' },
  { label: 'Document sent for signature', value: 'Sent the required document for signature via email.' },
  { label: 'Reminder to review application', value: 'This is a reminder to review the new application by the end of the day.' },
]);

const originalNotes = ref([
  {
    id: 1,
    text: 'Followed up with client.',
    by: 'Sarah',
    createdAt: new Date('2025-07-30T10:15:00'),
    source: 'Call Notes',
    important: false
  },
  {
    id: 2,
    text: 'Sent document for signature.',
    by: 'Mike',
    createdAt: new Date('2025-07-29T14:42:00'),
    source: 'Doc gen',
    important: true
  },
  {
    id: 3,
    text: 'Reminder to review application.',
    by: 'Tina',
    createdAt: new Date('2025-07-28T09:20:00'),
    source: 'Reminder Notes',
    important: false
  },
]);

const sourceOptions = [
  'All Notes',
  'Automated',
  'System Generated',
  'Doc gen',
  'Email gen',
  'Call Notes',
  'Reminder Notes',
  'User Defined',
  'Bulk Notes'
];

// --- Computed Properties ---
const displayedNotes = computed(() => {
  const filtered = originalNotes.value.filter(note => {
    const isMatchingSearch = searchQuery.value
      ? Object.values(note).some(val => 
          String(val).toLowerCase().includes(searchQuery.value.toLowerCase())
        )
      : true;
    
    const isImportant = showOnlyImportant.value ? note.important : true;
    const isSourceMatch = selectedSource.value === 'All Notes' || note.source === selectedSource.value;

    return isMatchingSearch && isImportant && isSourceMatch;
  });

  return sortData(filtered);
});

// --- Methods ---
const toggleImportant = (note) => {
  note.important = !note.important;
};

const toggleSort = (col) => {
  if (sortColumn.value === col) {
    sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc';
  } else {
    sortColumn.value = col;
    sortOrder.value = 'asc';
  }
};

const sortData = (data) => {
  if (!sortColumn.value) return data;

  return [...data].sort((a, b) => {
    let valA = a[sortColumn.value];
    let valB = b[sortColumn.value];

    if (sortColumn.value === 'important') {
      const order = sortOrder.value === 'asc' ? 1 : -1;
      return (valA === valB) ? 0 : (valA ? 1 : -1) * order;
    }

    if (valA instanceof Date) valA = valA.getTime();
    if (valB instanceof Date) valB = valB.getTime();
    if (typeof valA === 'string') valA = valA.toLowerCase();
    if (typeof valB === 'string') valB = valB.toLowerCase();

    if (valA < valB) return sortOrder.value === 'asc' ? -1 : 1;
    if (valA > valB) return sortOrder.value === 'asc' ? 1 : -1;
    return 0;
  });
};

const saveNewPreset = () => {
  if (newPresetName.value && newPresetMessage.value) {
    presetMessages.value.push({ 
      label: newPresetName.value, 
      value: newPresetMessage.value 
    });
    newPresetName.value = '';
    newPresetMessage.value = '';
    showPresetCreation.value = false;
  }
};
</script>

<template>
  <section class="p-6 my-10 w-full rounded-xl shadow-outer dark:bg-darkBrown bg-warmYellow/70 border border-darkOrange">

    <select
      v-model="newNoteText"
      class="mb-4 w-full p-2 border border-gray-300 rounded-lg bg-white dark:bg-darkBlue text-gray-800 dark:text-white outline-none"
    >
      <option v-for="preset in presetMessages" :key="preset.label" :value="preset.value">
        {{ preset.label }}
      </option>
    </select>
    
    <button 
      @click="showPresetCreation = !showPresetCreation"
      class="dark:bg-darkGreen bg-pigmentGreen border dark:border-lightGreen border-lightGreen dark:text-lightGreen text-white font-bold mb-4 px-4 py-2 rounded-xl shadow-outer"
    >
      Create a Preset Note
    </button>
    
    <div v-if="showPresetCreation" class="mt-4 p-4 border border-gray-300 rounded-lg dark:bg-gray-800">
      <label for="presetName" class="dark:text-white text-gray-800 mb-2 block">Preset Name</label>
      <input
        v-model="newPresetName"
        id="presetName"
        type="text"
        class="w-full p-2 border border-gray-300 rounded-lg bg-white dark:bg-darkBlue text-gray-800 dark:text-white outline-none mb-2"
      />
      
      <label for="presetMessage" class="dark:text-white text-gray-800 mb-2 block">Preset Message</label>
      <textarea 
        v-model="newPresetMessage"
        id="presetMessage" 
        rows="2" 
        class="w-full p-2 border border-gray-300 rounded-lg bg-white dark:bg-darkBlue text-gray-800 dark:text-white outline-none resize-none"
      ></textarea>
      
      <button 
        @click="saveNewPreset"
        class="dark:bg-darkGreen bg-pigmentGreen border dark:border-lightGreen border-lightGreen dark:text-lightGreen text-white font-bold mt-4 px-4 py-2 rounded-xl shadow-outer"
      >
        Save New Preset
      </button>
    </div>

    <label for="note" class="dark:text-white text-gray-800 mb-2 block mt-4">Add a new note</label>
    <textarea 
      v-model="newNoteText"
      name="note" 
      id="note" 
      rows="4" 
      class="w-full p-2 border border-gray-300 rounded-lg bg-white dark:bg-darkBlue text-gray-800 dark:text-white outline-none resize-none overflow-y-hidden" 
      style="height: 150px;"
    ></textarea>
    <button class="dark:bg-darkGreen bg-pigmentGreen border dark:border-lightGreen border-lightGreen dark:text-lightGreen text-white font-bold mt-4 px-4 py-2 rounded-xl shadow-outer">Save Note</button>
     <button class="dark:bg-darkBrown bg-warmYellow/60 border border-darkOrange dark:text-darkOrange text-white font-bold mt-4 px-4 py-2 rounded-xl shadow-outer ml-6">Save as Important</button>

    <div class="p-4 bg-white dark:bg-gray-900 rounded-xl shadow-md mt-10">
      <div class="flex justify-between flex-wrap items-center gap-4 mb-4">
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Search notes..."
          class="w-full md:w-1/3 px-3 py-2 border rounded-md dark:bg-gray-800 dark:text-white dark:border-gray-600 outline-none"
        />
        <div>
          <button
            @click="showOnlyImportant = !showOnlyImportant"
            class="px-4 py-2 mr-4 bg-blue-600 text-white font-semibold rounded hover:bg-blue-700"
          >
            Important Notes
          </button>
          <select
            v-model="selectedSource"
            class="px-3 py-2 border rounded-md dark:bg-gray-800 dark:text-white dark:border-gray-600 outline-none"
          >
            <option v-for="source in sourceOptions" :key="source" :value="source">{{ source }}</option>
          </select>
        </div>
      </div>

      <div class="overflow-x-auto">
        <table class="w-full text-left border border-gray-300 dark:border-gray-600 rounded-md overflow-hidden">
          <thead class="bg-gray-100 dark:bg-gray-800 text-sm text-gray-700 dark:text-gray-200">
            <tr>
              <th class="px-4 py-2 cursor-pointer" @click="toggleSort('text')">
                Notes
                <v-icon name="md-keyboardarrowup" :active="sortColumn === 'text'" :order="sortOrder" class="inline-block ml-1" />
              </th>
              <th class="px-4 py-2 cursor-pointer" @click="toggleSort('by')">
                By
                <v-icon name="md-keyboardarrowup" :active="sortColumn === 'by'" :order="sortOrder" class="inline-block ml-1" />
              </th>
              <th class="px-4 py-2 cursor-pointer" @click="toggleSort('createdAt')">
                Created At
                <v-icon name="md-keyboardarrowup" :active="sortColumn === 'createdAt'" :order="sortOrder" class="inline-block ml-1" />
              </th>
              <th class="px-4 py-2 cursor-pointer" @click="toggleSort('source')">
                Note Source
                <v-icon name="md-keyboardarrowup" :active="sortColumn === 'source'" :order="sortOrder" class="inline-block ml-1" />
              </th>
              <th class="px-4 py-2 text-center cursor-pointer" @click="toggleSort('important')">
                Important
                 <v-icon v-if="sortOrder === 'asc' && sortColumn === 'important'" name="bi-star-fill" class="inline-block ml-1 text-yellow-400" />
                 <v-icon v-else name="bi-star" class="inline-block ml-1" />
              </th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="note in displayedNotes"
              :key="note.id"
              class="border-t border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800"
            >
              <td class="px-4 py-2">{{ note.text }}</td>
              <td class="px-4 py-2">{{ note.by }}</td>
              <td class="px-4 py-2">
                {{ note.createdAt.toLocaleDateString() }} {{ note.createdAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }}
              </td>
              <td class="px-4 py-2">{{ note.source }}</td>
              <td class="px-4 py-2 text-center">
                <button @click="toggleImportant(note)" class="text-yellow-400">
                   <v-icon v-if="note.important" name="bi-star-fill" class="w-5 h-5 text-yellow-400" />
                   <v-icon v-else name="bi-star" class="w-5 h-5 text-gray-400" />
                </button>
              </td>
            </tr>
            <tr v-if="displayedNotes.length === 0">
              <td colspan="5" class="text-center py-4 text-gray-500 dark:text-gray-400">
                No notes found.
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </section>
</template>



<style scoped>

.sort-icon {
  transition: transform 0.2s;
}

.sort-icon.asc {
  transform: rotate(0deg);
}

.sort-icon.desc {
  transform: rotate(180deg);
}
</style>