<script setup>
import { ref, watch, defineProps, defineEmits, computed, reactive } from 'vue';
import { leadsSteps, clientsSteps } from '../../stores/leadForm';

const props = defineProps({
  isOpen: Boolean,
  mode: String // 'lead' or 'client'
});

const emit = defineEmits(['close', 'submit']);

const currentEntityType = ref('leads');
const step = ref(1);

const isPhoneField = (key) => ['leadsCompanyPhoneNumber', 'leadsContactPhoneNumber', 'leadsContactMobileNumber', 'clientCompanyPhoneNumber', 'leadPhone'].includes(key);

const onPhoneInput = (e, key) => {
  const raw = (e.target).value;
  const digits = raw.replace(/\D/g, '');

  const limitedDigits = digits.startsWith('1') ? digits.slice(0, 11) : '1' + digits.slice(0, 10);

  form[currentEntityType.value][key] = '+1' + limitedDigits.slice(1); // Save as "+1XXXXXXXXXX"
}

const formattedPhone = (value) => {
  const digits = value?.replace(/\D/g, '') || '';

  if (!digits.startsWith('1')) return '+1 ';
  const clean = digits.slice(1, 11); // Max 10 digits after '1'

  let result = '+1';
  if (clean.length >= 1) result += ' ' + clean.slice(0, 3);
  if (clean.length >= 4) result += '-' + clean.slice(3, 6);
  if (clean.length >= 7) result += '-' + clean.slice(6, 10);
  return result;
}

const onExtensionInput = (e, key ) => {
  const val = (e.target).value.replace(/\D/g, '').slice(0, 3);
  form[currentEntityType.value][key + '_ext'] = val;
}


const form = reactive({
  leads: {},
  clients: {}
})



//to prevent the user from moving forward to the next step until he fills everything required in the current leadsForm
const validateStep = () => {
  const currentSteps = steps.value;
  const currentForm = form[currentEntityType.value];

  const currentFields = currentSteps[step.value - 1].fields;
  for (const field of currentFields) {
    if (field.required) {
      const value = currentForm[field.key];
      if (
        value === '' ||
        value === null ||
        value === undefined ||
        (field.type === 'dual-number' && (!value.client || !value.agency)) ||
        (field.type === 'select' && value === '')
      ) {
        return false;
      }
    }
  }
  return true;
};

const initFormFields = (entityType, stepData) => {
  form[entityType] = {
    ...form[entityType],
    status: '',
    substatus: '',
    opener: '',
    closer: ''
  };

  stepData.forEach(step =>
    step.fields.forEach(field => {
      if (field.type === 'dual-number') {
        form[entityType][field.key] = { client: '', agency: '' };
      } else {
        form[entityType][field.key] = '';
      }
    })
  );
};



const nextStep = () => {
  console.log(JSON.parse(JSON.stringify(form[currentEntityType.value])));

  if (!validateStep()) {
    alert('Please complete all required fields before continuing.');
    return;
  }
  step.value++;
};

//to switch between clients and leads
const steps = computed(() =>
  currentEntityType.value === 'clients' ? clientsSteps : leadsSteps
);

watch(
  () => props.mode,
  (newMode) => {
    currentEntityType.value = newMode === 'client' ? 'clients' : 'leads';
  },
  { immediate: true }
);

watch(
  () => props.isOpen,
  (open) => {
    if (open) {
      step.value = 1;
      const type = currentEntityType.value;
      const stepData = steps.value;
      initFormFields(type, stepData);

      const formKey = currentEntityType.value;
      const currentSteps = steps.value;

      form[formKey] = {};

      currentSteps.forEach((s) =>
        s.fields.forEach((f) => {
          if (f.type === 'dual-number') {
            form[formKey][f.key] = { client: '', agency: '' };
          } else {
            form[formKey][f.key] = '';
          }
        })
      );
    }
  }
);


const close = () => emit('close');

const submit = () => {
  emit('submit', form[currentEntityType.value]);
  emit('close');
};

</script>

<template>
  <Transition name="leads-fade" mode="out-in">
    <div v-if="isOpen" class="fixed inset-0 bg-black bg-opacity-40 backdrop-blur-sm flex items-center justify-center z-50">
      <div
        class="bg-white dark:bg-darkBlue rounded-2xl p-6 w-full max-w-2xl max-h-[80vh] shadow-xl relative overflow-y-auto">
        <h2 class="text-xl font-bold mb-4 text-gray-800 dark:text-white">
          {{ mode === 'lead' ? 'Add New Lead' : 'Add New Client' }}
        </h2>

        <!-- Step Indicator -->
        <div class="flex items-center justify-center mb-8">
          <div v-for="n in 3" :key="n" class="flex items-center">
            <!-- Circle with step number -->
            <div
              class="relative z-10 flex items-center justify-center w-8 h-8 rounded-full border-2 text-sm font-semibold shadow-inner transition-all duration-300 ease"
              :class="{
                ' bg-lightBlue border-lightBlue text-white': step >= n,
                'bg-white border-gray-300 text-gray-500': step < n
              }"
            >
              {{ n }}
            </div>

            <!-- Line between steps -->
            <div
              v-if="n < 3"
              class="w-60 h-1"
              :class="step > n ? 'bg-lightBlue' : 'bg-gray-300'"
            ></div>
          </div>
        </div>

        <div class="flex justify-evenly items-center mb-6">
          <div class="flex flex-col gap-4">
            <div class="flex flex-col gap-2">
              <label for="status" class="text-gray-700 dark:text-gray-300 text-sm">Status</label>
              <select name="status" id="status"
                class="p-2 border border-gray-400 rounded bg-white  dark:bg-darkBlue text-gray-700 dark:text-white outline-none"
                v-model="form[currentEntityType].status">
                <option value="coldLead">Cold Lead</option>
                <option value="warmLead">Warm Lead</option>
                <option value="hotLead">Hot Lead</option>
              </select>
            </div>

            <div class="flex flex-col gap-2">
              <label for="substatus" class="text-gray-700 dark:text-gray-300 text-sm">Sub Status</label>
              <select name="substatus" id="substatus"
                class="p-2 border border-gray-400 rounded bg-white  dark:bg-darkBlue text-gray-700 dark:text-white outline-none"
                v-model="form[currentEntityType].substatus">
                <option value="coldLead">Cold Lead</option>
                <option value="warmLead">Warm Lead</option>
                <option value="hotLead">Hot Lead</option>
              </select>
            </div>
          </div>

          <div class="flex flex-col gap-4">
            <div class="flex flex-col gap-2">
              <label for="opener" class="text-gray-700 dark:text-gray-300 text-sm">Opener</label>
              <select name="opener" id="opener"
                class="p-2 border border-gray-400 rounded bg-white dark:bg-darkBlue text-gray-700 dark:text-white outline-none"
                v-model="form[currentEntityType].opener">
                <option value="ellenNewsome">Ellen Newsome</option>
                <option value="taniaMiller">Tania Miller</option>
                <option value="roseWhite">Rose White</option>
              </select>
            </div>

            <div class="flex flex-col gap-2">
              <label for="closer" class="text-gray-700 dark:text-gray-300 text-sm">Closer</label>
              <select name="closer" id="closer"
                class="p-2 border border-gray-400 rounded bg-white dark:bg-darkBlue text-gray-700 dark:text-white outline-none"
                v-model="form[currentEntityType].closer">
                <option value="ellenNewsome">Ellen Newsome</option>
                <option value="taniaMiller">Tania Miller</option>
                <option value="roseWhite">Rose White</option>
              </select>
            </div>
          </div>
        </div>

        <Transition name="step-fade" mode="out-in">
          <div :key="step" class="space-y-4">
            <!-- Step Title -->
            <h2 class="text-2xl text-center font-semibold text-gray-700 dark:text-gray-200 mb-2">
              {{ steps[step - 1].title }}
            </h2>

            <!-- Dynamic Fields -->
            <div class="space-y-4">
              <template v-for="field in steps[step - 1].fields" :key="field.key">
                <!-- Phone with Extension -->
                <div v-if="isPhoneField(field.key)">
                  <label :for="field.key" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    {{ field.label }}<span v-if="field.required" class="text-red-500 text-lg">*</span>
                  </label>
                  <div class="flex gap-2">
                    <!-- Phone Number -->
                    <input
                      :id="field.key"
                      type="tel"
                      :value="formattedPhone(form[currentEntityType][field.key])"
                      @input="onPhoneInput($event, field.key)"
                      placeholder="+1 555-555-5555"
                      class="flex-1 p-2 border border-gray-400 dark:text-gray-300 text-gray-700 bg-transparent rounded outline-none"
                      :required="field.required"
                    />

                    <!-- Extension -->
                    <input
                      :id="field.key + '_ext'"
                      type="text"
                      :value="form[currentEntityType][field.key + '_ext']"
                      @input="onExtensionInput($event, field.key)"
                      maxlength="3"
                      placeholder="Ext"
                      class="w-20 p-2 border dark:text-gray-300 text-gray-700 border-gray-400 bg-transparent rounded outline-none"
                    />
                  </div>
                </div>

                <!-- Radio Buttons -->
                <div v-else-if="field.type === 'radio'">
                  <label :for="field.key" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    {{ field.label }}<span v-if="field.required" class="text-red-500 text-lg">*</span>
                  </label>
                  <div class="space-y-1">
                    <div v-for="option in field.options" :key="option.value" class="flex items-center gap-2">
                      <input type="radio" :id="field.key + '_' + option.value" :name="field.key" :value="option.value"
                        v-model="form[currentEntityType][field.key]" :required="field.required" />
                      <label :for="field.key + '_' + option.value" class="text-sm text-gray-700 dark:text-gray-300">
                        {{ option.label }}
                      </label>
                    </div>
                  </div>
                </div>

                <!-- Dual Number Inputs -->
                <div v-else-if="field.type === 'dual-number'">
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    {{ field.label }}<span v-if="field.required" class="text-red-500 text-lg">*</span>
                  </label>
                  <div class="grid grid-cols-2 gap-4">
                    <div>
                      <label :for="field.key + '-client'" class="block text-sm text-gray-700 dark:text-gray-300 mb-1">
                        Client
                      </label>
                      <input type="number" :id="field.key + '-client'" v-model="form[currentEntityType][field.key].client"
                        :placeholder="field.placeholder" class="w-full bg-transparent p-2 border dark:text-gray-300 text-gray-700 border-gray-400 rounded outline-none"
                        :required="field.required" />
                    </div>
                    <div>
                      <label :for="field.key + '-agency'" class="block text-sm text-gray-700 dark:text-gray-300 mb-1">
                        Agency
                      </label>
                      <input type="number" :id="field.key + '-agency'" v-model="form[currentEntityType][field.key].agency"
                        :placeholder="field.placeholder" class="w-full bg-transparent p-2 dark:text-gray-300 text-gray-700 border border-gray-400 rounded outline-none"
                        :required="field.required" />
                    </div>
                  </div>
                </div>

                <!-- Select -->
                <div v-else-if="field.type === 'select'">
                  <label :for="field.key" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    {{ field.label }}<span v-if="field.required" class="text-red-500 text-lg">*</span>
                  </label>
                  <select v-model="form[currentEntityType][field.key]" :id="field.key"
                    class="w-full p-2 border border-gray-400 rounded bg-white dark:bg-darkBlue text-gray-700 dark:text-white outline-none"
                    :required="field.required">
                    <option disabled value="">{{ field.placeholder || 'Select an option' }}</option>
                    <option v-for="option in field.options" :key="option.value" :value="option.value">
                      {{ option.label }}
                    </option>
                  </select>
                </div>

                <!-- Normal Input -->
                <div v-else>
                  <label :for="field.key" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    {{ field.label }}<span v-if="field.required" class="text-red-500 text-lg">*</span>
                  </label>
                  <input :type="field.type" :id="field.key" v-model="form[currentEntityType][field.key]" :placeholder="field.placeholder"
                    class="w-full p-2 border border-gray-400 dark:text-gray-300 text-gray-700 bg-transparent rounded outline-none" :required="field.required" />
                </div>
              </template>

            </div>
          </div>
        </Transition>


        <!-- Navigation Buttons -->
        <div class="mt-6 flex justify-between">
          <button @click="step > 1 ? step-- : close()"
            class="px-4 py-2 rounded-xl bg-gray-300 dark:bg-gray-700 border border-gray-600 text-gray-800 dark:text-white shadow-inner">
            {{ step === 1 ? 'Cancel' : 'Back' }}
          </button>
          <button @click="step === 3 ? submit() : nextStep()" class="px-4 py-2 rounded-xl font-bold dark:bg-btnBlue bg-lightBlue border border-blue-700  dark:border-lightBlue dark:text-lightBlue text-white shadow-inner">
            {{ step === 3 ? 'Submit' : 'Next' }}
          </button>
        </div>
      </div>
    </div>
  </Transition>
</template>



<style scoped>
::-webkit-scrollbar {
  display: none;
}

.leads-fade-enter-active,
.leads-fade-leave-active {
  transition: opacity 0.3s ease;
}

.leads-fade-enter-from,
.leads-fade-leave-to {
  opacity: 0;
}

.step-fade-enter-active,
.step-fade-leave-active {
  transition: all 0.3s ease;
}

.step-fade-enter-from {
  opacity: 0;
  transform: translateX(20px);
}

.step-fade-leave-to {
  opacity: 0;
  transform: translateX(-20px);
}
</style>