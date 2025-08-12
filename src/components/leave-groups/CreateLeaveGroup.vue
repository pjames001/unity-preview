<script setup>
import { reactive, watch } from 'vue';

const props = defineProps({
  isOpen: {
    type: Boolean,
    required: true
  }
});

const emit = defineEmits(['close', 'save']);

// A local directive to handle clicks outside the modal
const vClickOutside = {
  mounted(el, binding) {
    el.clickOutsideEvent = (event) => {
      // Check if the click is outside the element itself
      if (!(el === event.target || el.contains(event.target))) {
        binding.value();
      }
    };
    document.addEventListener('mousedown', el.clickOutsideEvent);
  },
  unmounted(el) {
    document.removeEventListener('mousedown', el.clickOutsideEvent);
  },
};

const formData = reactive({
  name: '',
  status: 'regular',
  description: '',
  leaveTypes: [],
});

const availableLeaveTypes = ['Annual Leave', 'Paternity Leave', 'Sick Leave', 'Maternity Leave', 'Unpaid Leave'];

// Watch for the modal to open and reset the form
watch(() => props.isOpen, (newValue) => {
  if (newValue) {
    resetForm();
  }
});

const resetForm = () => {
  Object.assign(formData, {
    name: '',
    status: 'regular',
    description: '',
    leaveTypes: [],
  });
};

const closeModal = () => {
  emit('close');
};

const saveForm = () => {
  console.log('Saving form data:', formData);
  emit('save', { ...formData });
  closeModal();
};
</script>

<template>
  <Transition name="modal-fade">
    <div
      v-if="isOpen"
      
      class="fixed inset-0 bg-gray-900 bg-opacity-50 dark:bg-opacity-70 flex justify-center items-center z-50 p-4"
    >
      <div
        class="bg-white dark:bg-gray-900 rounded-2xl shadow-outer dark:shadow-inner max-h-[90vh] overflow-y-auto w-full max-w-2xl transform transition-all duration-300 ease-out"
        v-click-outside="closeModal"
        @click.stop
      >
        <div class="p-8">
          <!-- Modal Header -->
          <div class="flex justify-between items-center mb-6">
            <h2 class="text-2xl font-bold text-gray-800 dark:text-white">Add Leave Group</h2>
            <button @click="closeModal" class="text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-white">
              <v-icon name="md-close" class="w-6 h-6" />
            </button>
          </div>

          <form @submit.prevent="saveForm" class="space-y-6">

            <!-- Name and Status Section -->
            <div class="space-y-4">
              <div class="flex flex-col">
                <label for="group-name" class="label-style">Name</label>
                <input type="text" id="group-name" v-model="formData.name" class="input-style" required />
              </div>
              
              <div class="flex flex-col">
                <label class="label-style">Default Status</label>
                <div class="flex items-center space-x-6 mt-2">
                  <label class="flex items-center space-x-2">
                    <input
                      type="radio"
                      id="default-group"
                      value="default"
                      v-model="formData.status"
                      name="status"
                      class="text-blue-500"
                    />
                    <span class="text-gray-700 dark:text-gray-200">Default Group</span>
                  </label>
                  <label class="flex items-center space-x-2">
                    <input
                      type="radio"
                      id="regular-group"
                      value="regular"
                      v-model="formData.status"
                      name="status"
                      class="text-blue-500"
                    />
                    <span class="text-gray-700 dark:text-gray-200">Regular Group</span>
                  </label>
                </div>
              </div>
            </div>

            <!-- Description Field -->
            <div class="space-y-4">
              <div class="flex flex-col">
                <label for="description" class="label-style">Description</label>
                <textarea id="description" v-model="formData.description" class="input-style" rows="3"></textarea>
              </div>
            </div>

            <!-- Leave Types Multi-select Dropdown -->
            <div class="space-y-4">
              <div class="flex flex-col">
                <label for="leave-types" class="label-style">Leave Types</label>
                <select
                  multiple
                  id="leave-types"
                  v-model="formData.leaveTypes"
                  class="input-style h-48"
                >
                  <option
                    v-for="type in availableLeaveTypes"
                    :key="type"
                    :value="type"
                  >
                    {{ type }}
                  </option>
                </select>
                <span class="text-xs text-gray-500 dark:text-gray-400 mt-1">Hold Ctrl (Windows) or Cmd (Mac) to select multiple options.</span>
              </div>
            </div>

            <!-- Action Buttons -->
            <div class="flex justify-end gap-4 border-t border-gray-200 dark:border-gray-700 pt-6">
              <button
                type="button"
                @click="closeModal"
                class="px-4 py-2 rounded-md font-semibold dark:bg-gray-700 bg-gray-200 text-gray-700 dark:text-gray-300 shadow-outer hover:shadow-inner transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                class="px-4 py-2 rounded-md font-semibold dark:bg-darkGreen bg-pigmentGreen border dark:border-lightGreen border-lightGreen dark:text-lightGreen text-white shadow-outer hover:shadow-inner transition"
              >
                Save
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </Transition>
</template>



<style scoped>
.label-style {
  @apply text-sm font-medium mb-1 text-gray-700 dark:text-gray-200;
}

.input-style {
  @apply px-3 py-2 border dark:border-gray-300 border-gray-400 rounded-lg bg-white text-gray-900 dark:bg-gray-800 dark:border-gray-600 dark:text-white outline-none;
}

.form-radio {
  appearance: none;
  -webkit-appearance: none;
  -moz-appearance: none;
  width: 1.25rem;
  height: 1.25rem;
  border: 2px solid #9ca3af;
  border-radius: 9999px; /* full circle */
  cursor: pointer;
  transition: all 0.2s ease-in-out;
}


.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}

.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.3s ease-in-out, transform 0.3s ease-in-out;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>