<script setup>
import { ref, computed } from 'vue';

const emails = ref([
  {
    id: 1,
    date: new Date(),
    subject: 'Meeting Agenda',
    from: 'manager@example.com',
    sender: 'manager',
    recipients: ['team@example.com'],
    receiver: ['george'],
    body: 'Here is the agenda for tomorrow’s meeting.',
    attachments: ['agenda.pdf'],
  },
  {
    id: 2,
    date: new Date(),
    subject: 'Project Update',
    from: 'dev@example.com',
    sender: 'manager',
    recipients: ['pm@example.com'],
    receiver: ['george'],
    body: 'We’ve made good progress on the project.',
    attachments: [],
  },
]);

const selectedEmails = ref([]);
const searchQuery = ref('');
const openPopupId = ref(null);

// Optional sorting logic placeholder
const sortedEmails = computed(() => emails.value); 

const filteredEmails = computed(() => {
  const query = searchQuery.value.toLowerCase().trim();
  if (!query) return sortedEmails.value;

  return sortedEmails.value.filter(email =>
    email.subject.toLowerCase().includes(query) ||
    email.from.toLowerCase().includes(query) ||
    email.body.toLowerCase().includes(query) ||
    email.recipients.some(r => r.toLowerCase().includes(query))
  );
});

const togglePopup = (id) => {
  openPopupId.value = openPopupId.value === id ? null : id;
};

const formatDate = (date) =>
  new Date(date).toLocaleDateString();
</script>

<template>
  <section class="p-6 my-10 w-full rounded-xl shadow-outer dark:bg-darkBrown bg-warmYellow/70 border border-darkOrange">
    <div class="p-4 bg-white dark:bg-gray-900 rounded-xl shadow-md">
      
      <!-- Top Bar -->
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Search emails..."
          class="px-4 py-2 mb-4 w-64 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm text-gray-700 dark:text-gray-200 placeholder-gray-400 outline-none"
        />


      <!-- Table -->
      <div class="overflow-x-auto">
        <table class="w-full text-left border border-gray-300 dark:border-gray-600 rounded-md overflow-hidden">
          <thead class="bg-gray-100 dark:bg-gray-800 text-sm text-gray-700 dark:text-gray-200">
            <tr>
              <th class="px-4 py-2">Date</th>
              <th class="px-4 py-2">Subject</th>
              <th class="px-4 py-2">From</th>
              <th class="px-4 py-2">Sender</th>
              <th class="px-4 py-2">Recipients</th>
              <th class="px-4 py-2">Receiver</th>
              <th class="px-4 py-2 text-center">Actions</th>
            </tr>
          </thead>

          <tbody>
            <tr
              v-for="email in filteredEmails"
              :key="email.id"
              class="border-t dark:bg-darkBlue bg-white border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800"
            >
              <td class="px-4 py-2">{{ formatDate(email.date) }}</td>
              <td class="px-4 py-2">{{ email.subject }}</td>
              <td class="px-4 py-2">{{ email.from }}</td>
              <td class="px-4 py-2">{{ email.sender }}</td>
              <td class="px-4 py-2">{{ email.recipients.join(', ') }}</td>
              <td class="px-4 py-2">{{ email.receiver.join(', ') }}</td>
              <td class="px-4 py-2 text-center relative">
                <button @click="togglePopup(email.id)">
                  <v-icon name="bi-eye" class="w-5 h-5 text-gray-500 hover:text-gray-800 dark:hover:text-white" />
                </button>

                <!-- Email Details Modal -->
                <Transition name="fade-scale">
                  <div
                    v-if="openPopupId === email.id"
                    class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm"
                  >
                    <div
                      class="bg-white dark:bg-gray-900 w-full max-w-2xl rounded-xl shadow-2xl overflow-hidden transform transition-all duration-300 p-6 relative"
                    >
                      <!-- Close Button -->
                      <button
                        @click="togglePopup(null)"
                        class="absolute top-3 right-3 text-gray-600 hover:text-red-500 dark:text-gray-300"
                      >
                        <v-icon name="md-close" class="w-6 h-6" />
                      </button>

                      <!-- Email Content -->
                      <div class="text-sm space-y-4 text-gray-800 dark:text-gray-200">
                        <!-- Header -->
                        <div class="space-y-1 border-b border-gray-200 dark:border-gray-700 pb-4">
                          <p><span class="font-semibold">From:</span> {{ email.from }}</p>
                          <p><span class="font-semibold">To:</span> {{ email.recipients.join(', ') }}</p>
                          <p><span class="font-semibold">Subject:</span> {{ email.subject }}</p>
                          <p class="text-xs text-gray-500 dark:text-gray-400">{{ formatDate(email.date) }} — {{ new Date(email.date).toLocaleTimeString() }}</p>
                        </div>

                        <!-- Body -->
                        <div class="whitespace-pre-line leading-relaxed text-[15px]">
                          {{ email.body }}
                        </div>

                        <!-- Attachments -->
                        <div class="pt-4 border-t border-gray-200 dark:border-gray-700">
                          <p class="font-semibold">Attachments:</p>
                          <ul class="list-disc ml-5">
                            <li
                              v-for="file in email.attachments"
                              :key="file"
                              class="text-blue-600 hover:underline dark:text-blue-400"
                            >
                              {{ file }}
                            </li>
                            <li v-if="!email.attachments.length" class="italic text-gray-400 dark:text-gray-500">No attachments</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </Transition>

              </td>
            </tr>

            <tr v-if="filteredEmails.length === 0">
              <td colspan="6" class="text-center py-4 text-gray-500 dark:text-gray-400">
                No emails found.
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </section>
</template>

<style scoped>
.fade-scale-enter-active,
.fade-scale-leave-active {
  transition: all 0.3s ease;
}
.fade-scale-enter-from,
.fade-scale-leave-to {
  opacity: 0;
  transform: scale(0.95);
}
.fade-scale-enter-to,
.fade-scale-leave-from {
  opacity: 1;
  transform: scale(1);
}
</style>
