<script setup>
defineProps({
  isOpen: Boolean,
  date: String,
  events: Array,
});
defineEmits(['close', 'add-event']);
</script>

<template>
  <Transition name="modal-fade">
    <div v-if="isOpen" class="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div class="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm" @click="$emit('close')"></div>
      <div class="relative bg-white dark:bg-darkBlue rounded-xl shadow-2xl p-8 w-full max-w-xl max-h-[800px] border dark:border-lightBlue border-clientPurple">
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-xl font-bold dark:text-white text-gray-800">Events for {{ date }}</h2>
          <button @click="$emit('close')" class="text-gray-500 dark:text-gray-300 hover:text-gray-700 dark:hover:text-white text-2xl">&times;</button>
        </div>
        <div class="my-4 text-right">
          <button class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition" @click="$emit('add-event')">
            + Add Event
          </button>
        </div>
        <div v-if="events.length > 0" class="space-y-3 overflow-y-auto max-h-[600px]">
          <div v-for="event in events" :key="event.id" class="px-4 py-2 rounded shadow" :style="{ backgroundColor: event.bgColor, color: event.textColor }">
            <div class="font-semibold">{{ event.title }}</div>
            <div class="text-xs">{{ new Date(event.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }}</div>
          </div>
        </div>
        <div v-else class="text-gray-400 text-center py-6">No events for this day.</div>
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

::-webkit-scrollbar {
  display: none;
}
</style>