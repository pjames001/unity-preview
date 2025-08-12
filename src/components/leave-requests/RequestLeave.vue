<script setup>
import { reactive } from 'vue';

const emit = defineEmits(['close', 'submit']);

const props = defineProps({
  isOpen: Boolean,
});

const form = reactive({
  leaveType: '',
  fromDate: '',
  toDate: '',
  details: '',
  document: null,
});

const handleFileUpload = (event) => {
  form.document = event.target.files[0];
}

const submitForm = () => {
  if (!form.leaveType || !form.fromDate || !form.toDate || !form.details) return;

  emit('submit', { ...form });
  emit('close');
}
</script>

<template>
  <Transition name="fade">
    <div
      v-if="isOpen"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 backdrop-blur-sm"
    >
      <div
        class="bg-white dark:bg-darkBlue rounded-2xl p-6 w-full max-w-xl shadow-xl relative overflow-y-auto max-h-[90vh]"
      >
        <h2 class="text-xl font-semibold mb-4 text-gray-800 dark:text-white">Request Leave</h2>

        <!-- Form -->
        <form @submit.prevent="submitForm" class="space-y-4">
          <!-- Leave Type -->
          <div>
            <label class="block text-gray-800 dark:text-white mb-1">Leave Type</label>
            <select
              v-model="form.leaveType"
              required
              class="w-full p-2 border border-gray-300 rounded-lg bg-white dark:bg-gray-800 text-gray-800 dark:text-white outline-none"
            >
              <option value="" disabled>Select leave type</option>
              <option value="Annual Leave">Annual Leave</option>
              <option value="Paternity Leave">Paternity Leave</option>
            </select>
          </div>

          <!-- From / To Dates -->
          <div class="flex gap-4">
            <div class="flex-1">
              <label class="block text-gray-800 dark:text-white mb-1">From Date</label>
              <input
                type="date"
                v-model="form.fromDate"
                required
                class="w-full p-2 border border-gray-300 rounded-lg bg-white dark:bg-gray-800 text-gray-800 dark:text-white outline-none"
              />
            </div>
            <div class="flex-1">
              <label class="block text-gray-800 dark:text-white mb-1">To Date</label>
              <input
                type="date"
                v-model="form.toDate"
                required
                class="w-full p-2 border border-gray-300 rounded-lg bg-white dark:bg-gray-800 text-gray-800 dark:text-white outline-none"
              />
            </div>
          </div>

          <!-- Leave Details -->
          <div>
            <label class="block text-gray-800 dark:text-white mb-1">Leave Details</label>
            <textarea
              v-model="form.details"
              required
              rows="4"
              class="w-full p-2 border border-gray-300 rounded-lg bg-white dark:bg-gray-800 text-gray-800 dark:text-white outline-none resize-none"
            ></textarea>
          </div>

          <!-- Supporting Documents -->
          <div>
            <label class="block text-gray-800 dark:text-white mb-1">Supporting Documents (optional)</label>
            <input
              type="file"
              @change="handleFileUpload"
              class="w-full p-2 border border-gray-300 rounded-lg bg-white dark:bg-gray-800 text-gray-800 dark:text-white outline-none"
            />
          </div>

          <!-- Actions -->
          <div class="flex justify-end gap-3 pt-4">
            <button
              type="button"
              @click="$emit('close')"
              class="px-4 py-2 rounded-xl bg-gray-300 text-gray-800 dark:bg-gray-700 dark:text-white font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              class="dark:bg-darkGreen bg-pigmentGreen border dark:border-lightGreen border-lightGreen dark:text-lightGreen text-white font-bold px-4 py-2 rounded-xl shadow-outer"
            >
              Submit Request
            </button>
          </div>
        </form>
      </div>
    </div>
  </Transition>
</template>



<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
