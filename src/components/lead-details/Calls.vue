<script setup>
import { ref, computed, watch } from "vue";

const calls = ref([
  {
    id: 1,
    from: "John Doe",
    fromNumber: "+1234567890",
    to: "Jane Smith",
    toNumber: "+0987654321",
    date: "2023-07-29T14:30:00Z",
    duration: "12 mins, 34 secs",
    disposition: "Completed",
    recordingUrl: "https://example.com/recording1.mp3",
    notes: "Discussed project details.",
  },
  {
    id: 2,
    from: "Alice Johnson",
    fromNumber: "+1234567890",
    to: "Bob Lee",
    toNumber: "+0987654321",
    date: "2023-07-28T09:15:00Z",
    duration: "5 mins 20 secs",
    disposition: "No Answer",
    recordingUrl: null,
    notes: "Left voicemail.",
  },
  // Add more sample calls here...
]);

const columns = [
  { key: "from", label: "From" },
  { key: "fromNumber", label: "From Number" },
  { key: "to", label: "To" },
  { key: "toNumber", label: "To Number" },
  { key: "date", label: "Date" },
  { key: "duration", label: "Call Duration" },
  { key: "disposition", label: "Disposition" },
  { key: "recording", label: "Call Recording" },
  { key: "notes", label: "Notes" },
];

const searchQuery = ref("");
const selectedIds = ref([]);
const selectAll = ref(false);

const sortColumn = ref("date");
const sortOrder = ref("asc");

// Watch selectAll to toggle selectedIds accordingly
watch(selectAll, (val) => {
  if (val) {
    selectedIds.value = calls.value.map((c) => c.id);
  } else {
    selectedIds.value = [];
  }
});

// Toggle sort by column
function toggleSort(col) {
  if (sortColumn.value === col) {
    sortOrder.value = sortOrder.value === "asc" ? "desc" : "asc";
  } else {
    sortColumn.value = col;
    sortOrder.value = "asc";
  }
}

// format date nicely
function formatDate(dateStr) {
  const d = new Date(dateStr);
  return d.toLocaleDateString();
}

// Computed filtered and sorted calls
const filteredCalls = computed(() => {
  let filtered = calls.value.filter((call) => {
    const search = searchQuery.value.toLowerCase();
    return (
      call.from.toLowerCase().includes(search) ||
      call.to.toLowerCase().includes(search) ||
      call.disposition.toLowerCase().includes(search) ||
      call.notes.toLowerCase().includes(search)
    );
  });

  filtered.sort((a, b) => {
    let valA = a[sortColumn.value];
    let valB = b[sortColumn.value];

    // Special handling for date column
    if (sortColumn.value === "date") {
      valA = new Date(valA);
      valB = new Date(valB);
    }

    // For recording column, sort by presence of recordingUrl
    if (sortColumn.value === "recording") {
      valA = a.recordingUrl ? 1 : 0;
      valB = b.recordingUrl ? 1 : 0;
    }

    if (valA < valB) return sortOrder.value === "asc" ? -1 : 1;
    if (valA > valB) return sortOrder.value === "asc" ? 1 : -1;
    return 0;
  });

  return filtered;
});
</script>
<template>
  <section
    class="p-6 my-10 w-full rounded-xl shadow-outer dark:bg-darkBrown bg-warmYellow/70 border border-darkOrange"
  >
    <div class="p-4 bg-white dark:bg-gray-900 rounded-xl shadow-md">
      <!-- Top Controls -->
      <div class="flex justify-between items-center mb-4">
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Search..."
          class="px-3 py-2 border rounded-md text-sm dark:bg-gray-800 dark:text-white dark:border-gray-600 w-full max-w-xs outline-none"
        />
      </div>

      <!-- Table -->
      <div class="overflow-x-auto">
        <table
          class="w-full text-left border border-gray-300 dark:border-gray-600 rounded-md overflow-hidden"
        >
          <thead
            class="bg-gray-100 dark:bg-gray-800 text-sm text-gray-700 dark:text-gray-200"
          >
            <tr>
              <th
                v-for="col in columns"
                :key="col.key"
                class="px-4 py-2 cursor-pointer select-none"
                @click="toggleSort(col.key)"
              >
                <div class="flex items-center">
                  <span>{{ col.label }}</span>
                  <div class="flex flex-col ml-1">
                    <svg
                      v-if="sortColumn === col.key && sortOrder === 'asc'"
                      class="w-3 h-3 text-gray-600 dark:text-gray-300"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        d="M5 12l5-5 5 5H5z"
                      />
                    </svg>
                    <svg
                      v-else
                      class="w-3 h-3 text-gray-300"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        d="M5 12l5-5 5 5H5z"
                      />
                    </svg>
                    <svg
                      v-if="sortColumn === col.key && sortOrder === 'desc'"
                      class="w-3 h-3 text-gray-600 dark:text-gray-300"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        d="M5 8l5 5 5-5H5z"
                      />
                    </svg>
                    <svg
                      v-else
                      class="w-3 h-3 text-gray-300"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        d="M5 8l5 5 5-5H5z"
                      />
                    </svg>
                  </div>
                </div>
              </th>
            </tr>
          </thead>

          <tbody>
            <tr
              v-for="call in filteredCalls"
              :key="call.id"
              class="border-t dark:bg-darkBlue bg-white border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800"
            >
              <td class="px-4 py-2">{{ call.from }}</td>
              <td class="px-4 py-2">{{ call.fromNumber }}</td>
              <td class="px-4 py-2">{{ call.to }}</td>
              <td class="px-4 py-2">{{ call.toNumber }}</td>
              <td class="px-4 py-2">{{ formatDate(call.date) }}</td>
              <td class="px-4 py-2">{{ call.duration }}</td>
              <td class="px-4 py-2">{{ call.disposition }}</td>
              <td class="px-4 py-2">
                <a
                  v-if="call.recordingUrl"
                  :href="call.recordingUrl"
                  target="_blank"
                  class="text-blue-600 hover:underline dark:text-blue-400"
                  >Listen</a
                >
                <span v-else class="text-gray-400 italic">No recording</span>
              </td>
              <td class="px-4 py-2">{{ call.notes }}</td>
            </tr>

            <tr v-if="filteredCalls.length === 0">
              <td colspan="9" class="text-center py-4 text-gray-500 dark:text-gray-400">
                No calls found.
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </section>
</template>

