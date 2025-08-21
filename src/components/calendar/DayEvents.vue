<script setup>
import { ref } from 'vue';

// --- Props & Emits ---
const props = defineProps({
  isOpen: Boolean,
  date: String,
  events: Array,
});

const emit = defineEmits(['close', 'add-event']);

// --- State ---
const expandedEventId = ref(null);

// --- Methods ---
const formatTime = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

const toggleExpand = (eventId) => {
  expandedEventId.value = expandedEventId.value === eventId ? null : eventId;
};
</script>

<template>
  <Transition name="modal-fade">
    <div v-if="isOpen" class="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        class="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm"
        @click="emit('close')"
      ></div>

      <div
        class="relative bg-white dark:bg-darkBlue rounded-xl shadow-2xl p-8 w-full max-w-xl max-h-[800px] border dark:border-lightBlue border-clientPurple"
      >
        <!-- Header -->
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-xl font-bold dark:text-white text-gray-800">
            Events for {{ date }}
          </h2>
          <button
            @click="emit('close')"
            class="text-gray-500 dark:text-gray-300 hover:text-gray-700 dark:hover:text-white text-2xl"
          >
            &times;
          </button>
        </div>

        <!-- Add Event Button -->
        <div class="my-4 text-right">
          <button
            class="dark:bg-darkGreen bg-pigmentGreen border dark:border-lightGreen border-lightGreen dark:text-lightGreen text-white px-4 py-2 rounded shadow-outer transition"
            @click="emit('add-event')"
          >
            + Add Event
          </button>
        </div>

        <!-- Events List -->
        <div v-if="events.length > 0" class="space-y-3 overflow-y-auto max-h-[600px]">
          <div
            v-for="event in events"
            :key="event.id"
            class="px-4 py-3 rounded shadow cursor-pointer flex justify-between items-start"
            :style="{ backgroundColor: event.bgColor, color: event.textColor }"
            @click="toggleExpand(event.id)"
          >
            <div class="flex-1">
              <div class="font-semibold">{{ event.title }}</div>
              <div class="text-xs">{{ formatTime(event.date) }}</div>

              <!-- Description -->
              <transition name="fade">
                <div
                  v-if="expandedEventId === event.id && event.note"
                  class="mt-2 text-sm text-gray-100 dark:text-gray-200"
                >
                  {{ event.note }}
                </div>
              </transition>
            </div>

            <!-- External Link Button -->
            <div class="ml-3">
              <a
                :href="event.link || '#'"
                target="_blank"
                class="p-2"
                @click.stop
              >
                <v-icon name="oi-link-external" scale="1.2" class="dark:text-white text-gray-700"></v-icon>
              </a>
            </div>
          </div>
        </div>

        <!-- Empty State -->
        <div v-else class="text-gray-400 text-center py-6">
          No events for this day.
        </div>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.3s ease;
}
.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}

.fade-enter-active,
.fade-leave-active {
  transition: all 0.2s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  max-height: 0;
}

::-webkit-scrollbar {
  display: none;
}
</style>
