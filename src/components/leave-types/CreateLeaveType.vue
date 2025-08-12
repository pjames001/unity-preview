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

const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

const formData = reactive({
  // Basic Information
  name: '',
  daysAllocated: 0,
  description: '',
  payment: 'Paid',
  folder: '',

  // Eligibility Configuration
  gender: 'Both',
  availableDuringProbation: false,
  
  // Carry Forward
  canBeCarriedForward: false,
  maxCarryForwardDays: 0,

  // Weekend and Holidays
  countHolidays: false,
  countSundays: false,
  countSaturdays: false,
  saturdaysAsHalfDays: false,

  // Limit and Restrictions
  maxConsecutiveDays: null,
  minDaysNotice: null,

  // Accrual Configuration
  anniversaryMonth: 'January',
  isAccrued: false,
  accrualFrequency: 'Monthly',
  maxAccrualDays: 0,
});

// Watch for the modal to open and reset the form
watch(() => props.isOpen, (newValue) => {
  if (newValue) {
    resetForm();
  }
});

const resetForm = () => {
  Object.assign(formData, {
    name: '',
    daysAllocated: 0,
    description: '',
    payment: 'Paid',
    folder: '',
    gender: 'Both',
    availableDuringProbation: false,
    canBeCarriedForward: false,
    maxCarryForwardDays: 0,
    countHolidays: false,
    countSundays: false,
    countSaturdays: false,
    saturdaysAsHalfDays: false,
    maxConsecutiveDays: null,
    minDaysNotice: null,
    anniversaryMonth: 'January',
    isAccrued: false,
    accrualFrequency: 'Monthly',
    maxAccrualDays: 0,
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
      class="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm dark:bg-opacity-50 flex justify-center items-center z-50 p-4"
    >
      <div
        v-click-outside="closeModal"
        class="bg-white dark:bg-gray-900 rounded-2xl max-h-[90vh] overflow-y-auto w-full max-w-2xl transform transition-all duration-300 ease-out"
        @click.stop
      >
        <div class="p-8">
          <!-- Modal Header -->
          <div class="flex justify-between items-center mb-6">
            <h2 class="text-2xl font-bold text-gray-800 dark:text-white">Create Leave Type</h2>
            <button @click="closeModal" class="text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-white">
              <v-icon name="md-close" class="w-6 h-6" />
            </button>
          </div>

          <form @submit.prevent="saveForm" class="space-y-6">

            <!-- Basic Information Section -->
            <div class="space-y-4">
              <h3 class="text-lg font-semibold text-gray-800 dark:text-white">Basic Information</h3>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div class="flex flex-col">
                  <label for="name" class="label-style">Name</label>
                  <input type="text" id="name" v-model="formData.name" class="input-style" required />
                </div>
                <div class="flex flex-col">
                  <label for="daysAllocated" class="label-style">Days Allocated</label>
                  <input type="number" id="daysAllocated" v-model.number="formData.daysAllocated" class="input-style" min="0" required />
                </div>
              </div>
              <div class="flex flex-col">
                <label for="description" class="label-style">Description</label>
                <textarea id="description" v-model="formData.description" class="input-style" rows="3"></textarea>
              </div>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div class="flex flex-col">
                  <label for="payment" class="label-style">Paid or Unpaid</label>
                  <select id="payment" v-model="formData.payment" class="input-style">
                    <option value="Paid">Paid</option>
                    <option value="Unpaid">Unpaid</option>
                  </select>
                </div>
                <div class="flex flex-col">
                  <label for="folder" class="label-style">Select Folder</label>
                  <select id="folder" v-model="formData.folder" class="input-style">
                    <option value="" disabled>Select a folder</option>
                    <option value="General">General</option>
                    <option value="HR">HR</option>
                  </select>
                </div>
              </div>
            </div>

            <!-- Eligibility Configuration Section -->
            <div class="space-y-4">
              <h3 class="text-lg font-semibold text-gray-800 dark:text-white">Eligibility Configuration</h3>
              
              <!-- Gender & Probation -->
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div class="flex flex-col">
                  <label for="gender" class="label-style">Gender</label>
                  <select id="gender" v-model="formData.gender" class="input-style">
                    <option value="Both">Both</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </select>
                </div>
                <div class="flex items-center mt-6">
                  <input type="checkbox" id="availableDuringProbation" v-model="formData.availableDuringProbation" class="form-checkbox" />
                  <label for="availableDuringProbation" class="label-style ml-2">Available During Probation</label>
                </div>
              </div>

              <!-- Carry Forward Settings -->
              <div class="border-t border-gray-200 dark:border-gray-700 pt-4 space-y-4">
                <h4 class="text-base font-medium text-gray-800 dark:text-white">Carry Forward Settings</h4>
                <div class="flex items-center">
                  <input type="checkbox" id="canBeCarriedForward" v-model="formData.canBeCarriedForward" class="form-checkbox" />
                  <label for="canBeCarriedForward" class="label-style ml-2">Can be carried forward</label>
                </div>
                <div v-if="formData.canBeCarriedForward" class="flex flex-col transition-all duration-300 ease-in-out">
                  <label for="maxCarryForwardDays" class="label-style">Max Carry Forward Days</label>
                  <input type="number" id="maxCarryForwardDays" v-model.number="formData.maxCarryForwardDays" class="input-style" min="0" required />
                </div>
              </div>

              <!-- Weekend and Holidays Settings -->
              <div class="border-t border-gray-200 dark:border-gray-700 pt-4 space-y-4">
                <h4 class="text-base font-medium text-gray-800 dark:text-white">Weekend and Holidays Settings</h4>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div class="flex items-center">
                    <input type="checkbox" id="countHolidays" v-model="formData.countHolidays" class="form-checkbox" />
                    <label for="countHolidays" class="label-style ml-2">Count Holidays</label>
                  </div>
                  <div class="flex items-center">
                    <input type="checkbox" id="countSundays" v-model="formData.countSundays" class="form-checkbox" />
                    <label for="countSundays" class="label-style ml-2">Count Sundays</label>
                  </div>
                  <div class="flex items-center">
                    <input type="checkbox" id="countSaturdays" v-model="formData.countSaturdays" class="form-checkbox" />
                    <label for="countSaturdays" class="label-style ml-2">Count Saturdays</label>
                  </div>
                  <div v-if="formData.countSaturdays" class="flex items-center ml-4 transition-all duration-300 ease-in-out">
                    <input type="checkbox" id="saturdaysAsHalfDays" v-model="formData.saturdaysAsHalfDays" class="form-checkbox" />
                    <label for="saturdaysAsHalfDays" class="label-style ml-2">Saturdays as half days</label>
                  </div>
                </div>
              </div>

              <!-- Limit and Restrictions -->
              <div class="border-t border-gray-200 dark:border-gray-700 pt-4 space-y-4">
                <h4 class="text-base font-medium text-gray-800 dark:text-white">Limit and Restrictions</h4>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div class="flex flex-col">
                    <label for="maxConsecutiveDays" class="label-style">Max Consecutive Days</label>
                    <input type="number" id="maxConsecutiveDays" v-model.number="formData.maxConsecutiveDays" class="input-style" min="0" />
                  </div>
                  <div class="flex flex-col">
                    <label for="minDaysNotice" class="label-style">Min Days Notice</label>
                    <input type="number" id="minDaysNotice" v-model.number="formData.minDaysNotice" class="input-style" min="0" />
                  </div>
                </div>
              </div>
              
              <!-- Accrual Configuration -->
              <div class="border-t border-gray-200 dark:border-gray-700 pt-4 space-y-4">
                <h4 class="text-base font-medium text-gray-800 dark:text-white">Accrual Configuration</h4>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div class="flex flex-col">
                    <label for="anniversaryMonth" class="label-style">Leave Anniversary Month</label>
                    <select id="anniversaryMonth" v-model="formData.anniversaryMonth" class="input-style">
                      <option v-for="(month, index) in months" :key="index" :value="month">{{ month }}</option>
                    </select>
                  </div>
                  <div class="flex items-center">
                    <input type="checkbox" id="isAccrued" v-model="formData.isAccrued" class="form-checkbox" />
                    <label for="isAccrued" class="label-style ml-2">Is Accrued</label>
                  </div>
                </div>
                
                <Transition name="fade" mode="out-in">
                  <div v-if="formData.isAccrued" class="grid grid-cols-1 md:grid-cols-2 gap-4 transition-all duration-300 ease-in-out">
                    <div class="flex flex-col">
                      <label for="accrualFrequency" class="label-style">Accrual Frequency</label>
                      <select id="accrualFrequency" v-model="formData.accrualFrequency" class="input-style">
                        <option value="Monthly">Monthly</option>
                        <option value="Quarterly">Quarterly</option>
                        <option value="Semi-annual">Semi-annual</option>
                        <option value="Annual">Annual</option>
                      </select>
                    </div>
                    <div class="flex flex-col">
                      <label for="maxAccrualDays" class="label-style">Max Accrual Days</label>
                      <input type="number" id="maxAccrualDays" v-model.number="formData.maxAccrualDays" class="input-style" min="0" />
                    </div>
                  </div>
                </Transition>
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
::-webkit-scrollbar {
  display: none;
}

.label-style {
  @apply text-sm font-medium mb-1 text-gray-700 dark:text-gray-200;
}

.input-style {
  @apply px-3 py-2 h-[42px] border dark:border-gray-300 border-gray-400 rounded-lg bg-white text-gray-900 dark:bg-gray-800 dark:border-gray-600 dark:text-white outline-none;
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