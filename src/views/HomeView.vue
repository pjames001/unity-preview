<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue';
import { useRouter } from 'vue-router';
import PivotHighchartsPyramid from '@/components/home/PivotHighchartsPyramid.vue';
import RoundedChart from '@/components/home/RoundedChart.vue';
import Metric from '@/components/home/Metric.vue';
import LeadsFilter from '@/components/home/LeadsFilter.vue';
import ClientFilter from '@/components/home/ClientFilter.vue';
import TableLayoutCustomizer from '@/components/TableLayoutCustomizer.vue';
import AddLead from '@/components/home/AddLead.vue';

const router = useRouter();

// Modals and State
const isUploadModalOpen = ref(false);
const uploadMode = ref('lead');
const isAddModalOpen = ref(false);
const addMode = ref('lead');
const isFilterOpen = ref(false);
const isCustomizeLayoutOpen = ref(false);
const isModalOpen = ref(false);

// View and Selections
const currentView = ref('leads');
const selectedLeads = ref([]);
const selectedClients = ref([]);
const leadActionsDropdown = ref(null);
const clientActionsDropdown = ref(null);

// Table Data
const allLeadsColumns = [
  'Company Name', 'Phone Number', 'Email', 'Lead Status', 'Sub Status', 'Opener', 'Closer', 'Account Number',
  'Medical', 'Zip Code', 'Business Type', 'Batch Number', 'Account Type', 'Address', 'Address 2',
  'Country', 'City', 'State', 'Updated At', 'Fax Number', 'Fax Number Extension', 'Cell Phone',
  'Other Email', 'Reffered By', 'Website', 'Contact Name', 'Source', 'Money Expected',
  'Accounts Expected', 'Client Size', 'Created By', 'Created At', 'Interest (Client)',
  'Interest(Agency)', 'Late Fees(Client)', 'Late Fees(Agency)', 'Card Convenience Fees',
  'Over One Year', 'Under One Year', 'Legal And Under 10000', 'Import Date', 'Last Attempt',
  'Last Meeting', 'Last Reach', 'SIC Code', 'SIC Description', 'AEM Bounce Back', 'AEM Opt Out',
];
const currentLeadsColumns = ref(['Company Name', 'Lead Status', 'Sub Status', 'Closer', 'Actions']);

const allClientsColumns = [
  'Client Name', 'Industry', 'Contact', 'Status', 'Phone Number', 'Email', 'Address', 'City',
  'State', 'Country', 'Created At', 'Updated At', 'Website', 'Account Manager', 'Actions',
];
const currentClientsColumns = ref(['Client Name', 'Industry', 'Contact', 'Status', 'Actions']);

// Helper Functions
const toggleUploadModal = (mode) => {
  uploadMode.value = mode;
  isUploadModalOpen.value = !isUploadModalOpen.value;
};

const toggleAddModal = (mode) => {
  addMode.value = mode;
  isAddModalOpen.value = !isAddModalOpen.value;
};

const handleSaveLeadsLayout = (newLayout) => {
  currentLeadsColumns.value = newLayout;
  isModalOpen.value = false;
};

const handleSaveClientsLayout = (newLayout) => {
  currentClientsColumns.value = newLayout;
  isModalOpen.value = false;
};

const toggleCheckbox = (list, index) => {
  const i = list.value.indexOf(index);
  if (i > -1) {
    list.value.splice(i, 1);
  } else {
    list.value.push(index);
  }
};

const toggleSelectAll = (list, count) => {
  if (list.value.length === count) {
    list.value = [];
  } else {
    list.value = Array.from({ length: count }, (_, i) => i);
  }
};

// Global Click Handler for dropdowns
const handleGlobalClick = (event) => {
  const isInsideLeadDropdown = event.target.closest('.lead-actions-dropdown') || event.target.closest('.lead-dots-icon');
  const isInsideClientDropdown = event.target.closest('.client-actions-dropdown') || event.target.closest('.client-dots-icon');

  if (!isInsideLeadDropdown) leadActionsDropdown.value = null;
  if (!isInsideClientDropdown) clientActionsDropdown.value = null;
};

onMounted(() => {
  window.addEventListener('click', handleGlobalClick);
});
onBeforeUnmount(() => {
  window.removeEventListener('click', handleGlobalClick);
});

// View switching and navigation
const switchToLeads = () => {
  currentView.value = 'leads';
  selectedClients.value = [];
};

const switchToClients = () => {
  currentView.value = 'clients';
  selectedLeads.value = [];
};

const goToLeadPage = (id) => router.push(`/leads/${id}`);
const goToClientPage = (id) => router.push(`/clients/${id}`);
</script>

<template>
  <main class="view dark:bg-darkBlue bg-white">
    <section class="flex justify-center items-center max-w-[1600px] mx-auto mt-10 rounded-xl shadow-outer dark:bg-darkPurple bg-[rgba(90,169,230,.35)] border dark:border-lightBlue border-clientPurple px-8 py-4 transition-all duration-300 ease">
      <Metric />
    </section>

    <section class="max-w-[1600px] mx-auto my-10 rounded-xl shadow-outer dark:bg-darkBrown bg-[rgba(248,148,60,.5)] border dark:border-warmYellow border-darkOrange px-8 py-4 transition-all duration-300 ease">
      <div class="flex justify-between items-center flex-wrap gap-4 mb-6">
        <div class="flex items-center gap-4 flex-wrap">
          <span class="dark:text-white text-gray-800 text-lg font-semibold">
            Showing {{ currentView === 'leads' ? '150 Leads' : '42 Clients' }}
          </span>

          <button @click="toggleUploadModal(currentView)" class="flex items-center dark:bg-darkBlue bg-lightBlue border dark:border-lightBlue border-blue-700 dark:text-lightBlue text-white font-bold px-4 py-2 rounded-xl shadow-outer hover:scale-105 transition-all">
            Upload {{ currentView === 'leads' ? 'Lead' : 'Client' }}
            <v-icon name="bi-upload" scale="1.5" class="ml-2" />
          </button>

          <button @click="toggleAddModal(currentView)" class="flex items-center dark:bg-darkGreen bg-pigmentGreen border dark:border-lightGreen border-lightGreen dark:text-lightGreen text-white font-bold px-4 py-2 rounded-xl shadow-outer hover:scale-105 transition-all">
            Add {{ currentView === 'leads' ? 'Lead' : 'Client' }}
            <v-icon name="bi-plus-lg" scale="1.5" class="ml-2" />
          </button>

          <button
            @click="isFilterOpen = !isFilterOpen"
            class="text-white flex items-center gap-2 dark:bg-darkBrown bg-warmYellow/80 py-2 px-4 rounded-xl border border-darkOrange shadow-outer hover:scale-105 transition-all"
          >
            <span class="font-bold text-lg dark:text-darkOrange text-white">Filters</span>
            <v-icon name="bi-filter" scale="1.8" class="dark:text-darkOrange text-white" />
          </button>
        </div>

        <div class="flex items-center gap-4 flex-wrap">
          <button
            class="text-white flex items-center gap-2 dark:bg-darkRed bg-lightRed py-2 px-4 rounded-xl border dark:border-lightRed border-rawRed shadow-outer hover:scale-105 transition-all"
            :class="(currentView === 'leads' ? selectedLeads.length : selectedClients.length) > 0 ? 'flex' : 'hidden'"
          >
            <span class="font-bold text-lg dark:text-lightRed text-white">Delete Selected {{ currentView === 'leads' ? selectedLeads.length : selectedClients.length }}</span>
            <v-icon name="bi-trash" scale="1.8" class="dark:text-lightRed text-white" />
          </button>

          <button @click="isModalOpen = true" class="dark:text-white text-gray-800">
            <v-icon name="md-settings" scale="1.5" />
          </button>

          <div class="flex items-center">
            <button class="dark:bg-btnBlue bg-newPurple border dark:border-newPurple border-darkPurple p-2 rounded-tl-xl rounded-bl-xl shadow-inner">
              <v-icon name="bi-search" scale="1.5" class="text-white" />
            </button>
            <input
              type="text"
              placeholder="Search..."
              class="p-[10px] border-t-2 border-b-2 border-r-2 rounded-br-xl rounded-tr-xl border-newPurple shadow-inner outline-none"
            />
          </div>

          <div class="flex items-center gap-2">
            <button
              @click="switchToLeads"
              :class="[
                'px-4 py-2 rounded-xl font-bold shadow-outer transition-all',
                currentView === 'leads'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white dark:bg-darkBlue text-gray-800 dark:text-white border border-gray-400'
              ]"
            >
              Leads
            </button>
            <button
              @click="switchToClients"
              :class="[
                'px-4 py-2 rounded-xl font-bold shadow-outer transition-all',
                currentView === 'clients'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white dark:bg-darkBlue text-gray-800 dark:text-white border border-gray-400'
              ]"
            >
              Clients
            </button>
          </div>
        </div>
      </div>

      <Transition name="fade-slide" mode="out-in" appear>
        <table v-if="currentView === 'leads'" class="table-auto w-full my-10">
          <thead class="dark:text-white text-gray-800">
            <tr class="h-12 text-center">
              <th>
                <input
                  type="checkbox"
                  :checked="selectedLeads.length === 3"
                  @change="toggleSelectAll(selectedLeads, 3)"
                />
              </th>
              <th v-for="column in currentLeadsColumns" :key="column">{{ column }}</th>
            </tr>
          </thead>
          <tbody class="dark:bg-darkBlue bg-white dark:text-white text-gray-800">
            <tr
              class="text-center h-16 border-b border-gray-400 cursor-pointer dark:hover:bg-gray-800 hover:bg-gray-300 transition duration-300 ease"
              @click="goToLeadPage(index)"
              v-for="(lead, index) in 3"
              :key="index"
            >
              <td @click.stop>
                <input
                  type="checkbox"
                  :checked="selectedLeads.includes(index)"
                  @change="toggleCheckbox(selectedLeads, index)"
                />
              </td>
              <td><span class="py-2 px-4 text-white rounded-full bg-blue-800">Cold Lead</span></td>
              <td><span class="py-2 px-4 text-white rounded-full bg-gray-500">Not Interested</span></td>
              <td>United Legal Group</td>
              <td>Tania Miller</td>
              <td class="relative">
                <v-icon
                  name="bi-three-dots-vertical"
                  scale="1.5"
                  @click.stop="leadActionsDropdown = leadActionsDropdown === index ? null : index"
                  class="cursor-pointer p-1 rounded-full dark:hover:bg-gray-300 dark:hover:text-gray-700 hover:bg-white lead-dots-icon"
                />
                <div
                  v-if="leadActionsDropdown === index"
                  class="absolute right-0 mt-2 w-32 bg-white dark:bg-darkBlue border border-gray-300 dark:border-gray-700 rounded shadow-lg z-50 lead-actions-dropdown"
                >
                  <button
                    class="block w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-800"
                    @click.stop="console.log('Blacklist lead', index)"
                  >Blacklist</button>
                  <button
                    class="block w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-800 text-red-600"
                    @click.stop="console.log('Delete lead', index)"
                  >Delete</button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>

        <table v-else class="table-auto w-full my-10">
          <thead class="dark:text-white text-gray-800">
            <tr class="h-12">
              <th>
                <input
                  type="checkbox"
                  :checked="selectedClients.length === 5"
                  @change="toggleSelectAll(selectedClients, 5)"
                />
              </th>
              <th v-for="column in currentClientsColumns" :key="column">{{ column }}</th>
            </tr>
          </thead>
          <tbody class="dark:bg-darkBlue bg-white dark:text-white text-gray-800">
            <tr
              class="text-center h-16 border-b border-gray-400 cursor-pointer dark:hover:bg-gray-800 hover:bg-gray-300 transition duration-300 ease"
              @click="goToClientPage(index)"
              v-for="(client, index) in 5"
              :key="index"
            >
              <td @click.stop>
                <input
                  type="checkbox"
                  :checked="selectedClients.includes(index)"
                  @change="toggleCheckbox(selectedClients, index)"
                />
              </td>
              <td>ACME Inc.</td>
              <td>Legal Services</td>
              <td>Jane Doe</td>
              <td><span class="px-4 py-2 bg-green-600 text-white rounded-full">Active</span></td>
              <td class="relative">
                <v-icon
                  name="bi-three-dots-vertical"
                  scale="1.5"
                  @click.stop="clientActionsDropdown = clientActionsDropdown === index ? null : index"
                  class="cursor-pointer p-1 rounded-full hover:bg-white client-dots-icon"
                />
                <div
                  v-if="clientActionsDropdown === index"
                  class="absolute right-0 mt-2 w-32 bg-white dark:bg-darkBlue border border-gray-300 dark:border-gray-700 rounded shadow-lg z-50 client-actions-dropdown"
                >
                  <button
                    class="block w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-800"
                    @click.stop="console.log('Blacklist client', index)"
                  >Blacklist</button>
                  <button
                    class="block w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-800 text-red-600"
                    @click.stop="console.log('Delete client', index)"
                  >Delete</button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </Transition>
    </section>

    <Transition name="modal-fade">
      <div v-if="isUploadModalOpen" class="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center backdrop-blur-sm z-50">
        <div class="bg-white dark:bg-darkBlue rounded-2xl p-8 w-full max-w-md shadow-2xl relative animate-modal-pop">
          <button
            @click="toggleUploadModal(uploadMode)"
            class="absolute top-4 right-4 text-gray-400 hover:text-gray-700 dark:hover:text-white text-2xl"
            aria-label="Close"
          >
            &times;
          </button>
          <h2 class="text-2xl font-extrabold mb-6 text-center text-blue-700 dark:text-lightBlue tracking-wide">
            Upload {{ uploadMode === 'lead' ? 'Lead' : 'Client' }}
          </h2>
          <div class="flex flex-col items-center gap-4">
            <input type="file" class="mb-4 w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus-ring-blue-400" />
            <div class="flex justify-end gap-2 w-full">
              <button @click="toggleUploadModal(uploadMode)" class="px-4 py-2 rounded bg-gray-300 dark:bg-gray-700 text-gray-800 dark:text-white font-semibold hover:bg-gray-400 dark:hover:bg-gray-600 transition">
                Cancel
              </button>
              <button class="px-4 py-2 rounded bg-blue-600 hover:bg-blue-700 text-white font-bold shadow transition">
                Upload
              </button>
            </div>
          </div>
        </div>
      </div>
    </Transition>

    <LeadsFilter v-if="currentView === 'leads'" :is-open="isFilterOpen" @close="isFilterOpen = false" />
    <ClientFilter v-else :is-open="isFilterOpen" @close="isFilterOpen = false" />

    <TableLayoutCustomizer
      v-if="isModalOpen"
      :title="`Customize ${currentView === 'leads' ? 'Leads' : 'Clients'} Table`"
      :isOpen="isModalOpen"
      :initialColumns="currentView === 'leads' ? currentLeadsColumns : currentClientsColumns"
      :allColumnOptions="currentView === 'leads' ? allLeadsColumns : allClientsColumns"
      @close="isModalOpen = false"
      @save-layout="currentView === 'leads' ? handleSaveLeadsLayout : handleSaveClientsLayout"
    />

    <AddLead
      :is-open="isAddModalOpen"
      :mode="addMode"
      @close="isAddModalOpen = false"
      @submit="console.log('Submitted form:', $event)"
    />
  </main>
</template>

<style>
.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: all 0.3s ease;
}

.fade-slide-enter-from {
  opacity: 0;
  transform: translateY(10px);
}

.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.3s;
}
.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}
.modal-fade-enter-to,
.modal-fade-leave-from {
  opacity: 1;
}

@keyframes modal-pop {
  0% {
    transform: scale(0.95) translateY(20px);
    opacity: 0;
  }
  100% {
    transform: scale(1) translateY(0);
    opacity: 1;
  }
}
.animate-modal-pop {
  animation: modal-pop 0.3s cubic-bezier(.4,2,.3,1) both;
}
</style>