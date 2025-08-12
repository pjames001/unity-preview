<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue';
import { useRouter } from 'vue-router';
import PivotHighchartsPyramid from '@/components/home/PivotHighchartsPyramid.vue';
import RoundedChart from '@/components/home/RoundedChart.vue';
import Metric from '@/components/home/Metric.vue';
import LeadsFilter from '@/components/home/LeadsFilter.vue';
import ClientFilter from '@/components/home/ClientFilter.vue';
import LeadsCustomizeLayout from '@/components/home/LeadsCustomizeLayout.vue';
import ClientCustomizeLayout from '@/components/home/ClientCustomizeLayout.vue';
import AddLead from '@/components/home/AddLead.vue';

const router = useRouter()
const isUploadModalOpen = ref(false);
const uploadMode = ref('lead');
const selectAllLeads = ref([])
const selectAllClients = ref([])
const leadActionsDropdown = ref(null)
const clientActionsDropdown = ref(null)
const isFilterOpen = ref(false);
const isCustomizeLayoutOpen = ref(false);
const isAddModalOpen = ref(false);
const addMode = ref('lead'); 
const currentView = ref<'leads' | 'clients'>('leads');


//handling the upload modal
const openUploadModal = (mode) => {
  uploadMode.value = mode;
  isUploadModalOpen.value = true;
};

const closeUploadModal = () => {
  isUploadModalOpen.value = false;
};

//actions dropdown handling
const handleLeadDotsClick = (index) => {
  leadActionsDropdown.value = leadActionsDropdown.value === index ? null : index;
};

const handleClientDotsClick = (index) => {
  clientActionsDropdown.value = clientActionsDropdown.value === index ? null : index;
};

const handleBlacklist = (type: 'lead' | 'client', index: number) => {
  //blacklist logic here
  console.log(`Blacklist ${type} at index`, index);
  if (type === 'lead') leadActionsDropdown.value = null;
  else clientActionsDropdown.value = null;
};

const handleDelete = (type, index) => {
  // Add your delete logic here

  if (type === 'lead') leadActionsDropdown.value = null;
  else clientActionsDropdown.value = null;
};
//handling closing the dropdown when clicking outside
const handleGlobalClick = (event) => {
  // Only close if the click is outside any dropdown or dots icon
  const leadDropdowns = document.querySelectorAll('.lead-actions-dropdown, .lead-dots-icon');
  const clientDropdowns = document.querySelectorAll('.client-actions-dropdown, .client-dots-icon');
  let clickedInside = false;

  leadDropdowns.forEach(el => {
    if (el.contains(event.target as Node)) clickedInside = true;
  });
  clientDropdowns.forEach(el => {
    if (el.contains(event.target as Node)) clickedInside = true;
  });

  if (!clickedInside) {
    leadActionsDropdown.value = null;
    clientActionsDropdown.value = null;
  }
};

onMounted(() => {
  window.addEventListener('click', handleGlobalClick);
});
onBeforeUnmount(() => {
  window.removeEventListener('click', handleGlobalClick);
});

//add a client/lead modal
const openAddModal = (mode) => {
  addMode.value = mode;
  isAddModalOpen.value = true;
};

const handleSubmitAdd = (data) => {
  console.log('Submitted form:', data);
  // TODO: Send to backend or update local state
};

// Toggles
const handleFilterBtn = () => {
  isFilterOpen.value = !isFilterOpen.value;
};

const handleSaveLayout = (newColumns: string[]) => {
  console.log('Layout Saved:', newColumns);
};

const switchToLeads = () => {
  currentView.value = 'leads';
  selectAllClients.value = [];
};

const switchToClients = () => {
  currentView.value = 'clients';
  selectAllLeads.value = []
};

const goToLeadPage = id => {
  router.push(`/leads/${id}`)
}

const goToClientPage = id => {
  router.push(`/clients/${id}`)
}
</script>

<template>
  <main class="view dark:bg-darkBlue bg-white">
    <!-- Metrics Section -->
    <section class="flex justify-center items-center max-w-[1600px] mx-auto mt-10 rounded-xl shadow-outer dark:bg-darkPurple bg-[rgba(90,169,230,.35)] border dark:border-lightBlue border-clientPurple px-8 py-4 transition-all duration-300 ease">
      <Metric />
    </section>

    <!-- Data Controls & Table Section -->
    <section class="max-w-[1600px] mx-auto my-10 rounded-xl shadow-outer dark:bg-darkBrown bg-[rgba(248,148,60,.5)] border dark:border-warmYellow border-darkOrange px-8 py-4 transition-all duration-300 ease">
      <div class="flex justify-between items-center flex-wrap gap-4 mb-6">
        <!-- Left Controls -->
        <div class="flex items-center gap-4 flex-wrap">
          <span class="dark:text-white text-gray-800 text-lg font-semibold">
            Showing {{ currentView === 'leads' ? '150 Leads' : '42 Clients' }}
          </span>

          <button v-if="currentView === 'leads'" @click="openUploadModal('lead')" class="flex items-center dark:bg-darkBlue bg-lightBlue border dark:border-lightBlue border-blue-700 dark:text-lightBlue text-white font-bold px-4 py-2 rounded-xl shadow-outer hover:scale-105 transition-all">
            Upload Lead
            <v-icon name="bi-upload" scale="1.5" class="ml-2" />
          </button>

          <button v-else @click="openUploadModal('client')" class="flex items-center dark:bg-darkBlue bg-lightBlue border dark:border-lightBlue border-blue-700 dark:text-lightBlue text-white font-bold px-4 py-2 rounded-xl shadow-outer hover:scale-105 transition-all">
            Upload Client
            <v-icon name="bi-upload" scale="1.5" class="ml-2" />
          </button>

          <button v-if="currentView === 'leads'" @click="openAddModal('lead')" class="flex items-center dark:bg-darkGreen bg-pigmentGreen border dark:border-lightGreen border-lightGreen dark:text-lightGreen text-white font-bold px-4 py-2 rounded-xl shadow-outer hover:scale-105 transition-all">
            Add Lead
            <v-icon name="bi-plus-lg" scale="1.5" class="ml-2" />
          </button>

          <button v-else @click="openAddModal('client')" class="flex items-center dark:bg-darkGreen bg-pigmentGreen border dark:border-lightGreen border-lightGreen dark:text-lightGreen text-white font-bold px-4 py-2 rounded-xl shadow-outer hover:scale-105 transition-all">
            Add Client
            <v-icon name="bi-plus-lg" scale="1.5" class="ml-2" />
          </button>

          <button
            @click="handleFilterBtn"
            class="text-white flex items-center gap-2 dark:bg-darkBrown bg-warmYellow/80 py-2 px-4 rounded-xl border border-darkOrange shadow-outer hover:scale-105 transition-all"
          >
            <span class="font-bold text-lg dark:text-darkOrange text-white">Filters</span>
            <v-icon name="bi-filter" scale="1.8" class="dark:text-darkOrange text-white" />
          </button>
        </div>

        <!-- Right Controls -->
        <div class="flex items-center gap-4 flex-wrap">

          <button
            class="text-white flex items-center gap-2 dark:bg-darkRed bg-lightRed py-2 px-4 rounded-xl border dark:border-lightRed border-rawRed shadow-outer hover:scale-105 transition-all"
            :class="selectAllClients.length > 0 || selectAllLeads.length > 0 ? 'flex' : 'hidden'"
          >
            <span class="font-bold text-lg dark:text-lightRed text-white">Delete Selected {{ currentView === 'leads' ? selectAllLeads.length : selectAllClients.length}}</span>
            <v-icon name="bi-filter" scale="1.8" class="dark:text-lightRed text-white" />
          </button>

          <button @click="isCustomizeLayoutOpen = true" class="dark:text-white text-gray-800">
            <v-icon name="md-settings" scale="1.5" />
          </button>

          <!-- Search -->
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

          <!-- View Switcher -->
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
        <!-- Leads Table -->
        <table v-if="currentView === 'leads'" class="table-auto w-full my-10">
          <thead class="dark:text-white text-gray-800">
            <tr class="h-12 text-center">
              <th>
                <input 
                  type="checkbox"
                  :checked="selectAllLeads.length === 3"
                  @change="selectAllLeads.length === 3 ? selectAllLeads.splice(0) : selectAllLeads.splice(0, selectAllLeads.length, 0, 1, 2)" />
              </th>
              <th>Lead Status</th>
              <th>Sub Status</th>
              <th>Company Name</th>
              <th>Closer</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody class="dark:bg-darkBlue bg-white dark:text-white text-gray-800">
            <tr class="text-center h-16 border-b border-gray-400 cursor-pointer dark:hover:bg-gray-800 hover:bg-gray-300 transition duration-300 ease" @click="goToLeadPage(index)" v-for="(lead, index) in 3" :key="index">
              <td @click.stop>
                <input 
                type="checkbox"
                :checked="selectAllLeads.includes(index)"
                @change="selectAllLeads.includes(index) ? selectAllLeads.splice(selectAllLeads.indexOf(index), 1) : selectAllLeads.push(index)" />
              </td>
              <td><span class="py-2 px-4 text-white rounded-full bg-blue-800">Cold Lead</span></td>
              <td><span class="py-2 px-4 text-white rounded-full bg-gray-500">Not Interested</span></td>
              <td>United Legal Group</td>
              <td>Tania Miller</td>
              <td class="relative">
                <v-icon 
                name="bi-three-dots-vertical"
                scale="1.5"
                @click.stop="handleLeadDotsClick(index)"
                class="cursor-pointer p-1 rounded-full dark:hover:bg-gray-300 dark:hover:text-gray-700 hover:bg-white" />
                <div
                  v-if="leadActionsDropdown === index"
                  class="absolute right-0 mt-2 w-32 bg-white dark:bg-darkBlue border border-gray-300 dark:border-gray-700 rounded shadow-lg z-50 lead-actions-dropdown"
                >
                  <button
                    class="block w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-800"
                    @click.stop="handleBlacklist('lead', index)"
                  >Blacklist</button>
                  <button
                    class="block w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-800 text-red-600"
                    @click.stop="handleDelete('lead', index)"
                  >Delete</button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>

        <!-- Clients Table -->
        <table v-else class="table-auto w-full my-10">
          <thead class="dark:text-white text-gray-800">
            <tr class="h-12">
              <th>
                <input
                  type="checkbox"
                  :checked="selectAllClients.length === 5"
                  @change="selectAllClients.length === 5 ? selectAllClients.splice(0) : selectAllClients.splice(0, selectAllClients.length, 0, 1, 2, 3, 4)" />
              </th>
              <th>Client Name</th>
              <th>Industry</th>
              <th>Contact</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody class="dark:bg-darkBlue bg-white dark:text-white text-gray-800">
            <tr class="text-center h-16 border-b border-gray-400 cursor-pointer dark:hover:bg-gray-800 hover:bg-gray-300 transition duration-300 ease" @click="goToClientPage(index)" v-for="(client, index) in 5" :key="index">
              <td @click.stop>
                <input 
                type="checkbox"
                :checked="selectAllClients.includes(index)"
                @change="selectAllClients.includes(index) ? selectAllClients.splice(selectAllClients.indexOf(index), 1) : selectAllClients.push(index)" />
              </td>
              <td>ACME Inc.</td>
              <td>Legal Services</td>
              <td>Jane Doe</td>
              <td><span class="px-4 py-2 bg-green-600 text-white rounded-full">Active</span></td>
              <td class="relative">
                <v-icon 
                name="bi-three-dots-vertical" 
                scale="1.5"
                @click.stop="handleClientDotsClick(index)"
                class="cursor-pointer p-1 rounded-full hover:bg-white client-dots-icon"
                 />
                 <div
                v-if="clientActionsDropdown === index"
                class="absolute right-0 mt-2 w-32 bg-white dark:bg-darkBlue border import { onMounted, onBeforeUnmount } from 'vue';border-gray-300 dark:border-gray-700 rounded shadow-lg z-50 client-actions-dropdown"
                >
                <button
                  class="block w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-800"
                  @click.stop="handleBlacklist('client', index)"
                >Blacklist</button>
                <button
                  class="block w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-800 text-red-600"
                  @click.stop="handleDelete('client', index)"
                >Delete</button>
              </div>
              </td>
            </tr>
          </tbody>
        </table>
      </Transition>
    </section>

    <!-- Modals -->
    <!-- Upload Modal -->
      <Transition name="modal-fade">
        <div v-if="isUploadModalOpen" class="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center backdrop-blur-sm z-50">
          <div class="bg-white dark:bg-darkBlue rounded-2xl p-8 w-full max-w-md shadow-2xl relative animate-modal-pop">
            <button
              @click="closeUploadModal"
              class="absolute top-4 right-4 text-gray-400 hover:text-gray-700 dark:hover:text-white text-2xl"
              aria-label="Close"
            >
              &times;
            </button>
            <h2 class="text-2xl font-extrabold mb-6 text-center text-blue-700 dark:text-lightBlue tracking-wide">
              {{ uploadMode === 'lead' ? 'Upload Lead' : 'Upload Client' }}
            </h2>
            <div class="flex flex-col items-center gap-4">
              <input type="file" class="mb-4 w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400" />
              <div class="flex justify-end gap-2 w-full">
                <button @click="closeUploadModal" class="px-4 py-2 rounded bg-gray-300 dark:bg-gray-700 text-gray-800 dark:text-white font-semibold hover:bg-gray-400 dark:hover:bg-gray-600 transition">
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
    <LeadsFilter v-if="currentView === 'leads'" :is-open="isFilterOpen" @close="handleFilterBtn" />
    <ClientFilter v-else :is-open="isFilterOpen" @close="handleFilterBtn" />
    <LeadsCustomizeLayout
      v-if="currentView === 'leads'"
      :is-open="isCustomizeLayoutOpen"
      @close="isCustomizeLayoutOpen = false"
      @save-layout="handleSaveLayout"
      :initial-columns="['Lead Status', 'Sub Status', 'Company Name', 'Closer', 'Actions']"
    />
    <ClientCustomizeLayout
      v-else
      :is-open="isCustomizeLayoutOpen"
      @close="isCustomizeLayoutOpen = false"
      @save-layout="handleSaveLayout"
      :initial-columns="['Client Name', 'Industry', 'Contact', 'Status', 'Actions']"
    />
    <AddLead
      :is-open="isAddModalOpen"
      :mode="addMode"
      @close="isAddModalOpen = false"
      @submit="handleSubmitAdd"
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