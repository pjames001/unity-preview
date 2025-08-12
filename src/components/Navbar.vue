<script setup>
import { ref } from 'vue'

// State for open menus
const openMenu = ref(null)
const openSubMenu = ref(null)

// Toggle parent menu
const toggleMenu = (idx) => {
  openMenu.value = openMenu.value === idx ? null : idx
  openSubMenu.value = null
}

// Toggle submenu
const toggleSubMenu = (key) => {
  openSubMenu.value = openSubMenu.value === key ? null : key
}

// Close all menus when mouse leaves the sidebar
const closeAllMenus = () => {
  openMenu.value = null
  openSubMenu.value = null
}

// Menu structure with icons for each submenu item
const menu = [
  {
    title: 'Home',
    icon: 'md-dashboard-sharp',
    link: '/'
  },
  {
    title: 'Search',
    icon: 'bi-search',
    link: '/search'
  },
  {
    title: 'Calendar',
    icon: 'bi-calendar-day-fill',
    link: '/calendar'
  },
  {
    title: 'HR',
    icon: 'bi-person-badge',
    children: [
      {
        title: 'Human Resources',
        icon: 'la-plane-departure-solid',
        children: [
          { title: 'Employees', icon: 'md-approval', link: '/employees' },
          { title: 'Bulk Upload Employee', icon: 'md-approval', link: '/upload-employee' },
        ],
      },
      {
        title: 'Attendance Managemnent',
        icon: 'la-plane-departure-solid',
        children: [
          { title: 'Public Holidays', icon: 'md-approval', link: '/public-holidays' },
          { title: 'Breaks', icon: 'md-approval', link: '/breaks' },
          { title: 'Day Schedule', icon: 'md-approval', link: '/day-schedule' },
          { title: 'Week Schedule', icon: 'md-approval', link: '/week-schedule' },
          { title: 'Attendance Groups', icon: 'md-approval', link: '/attendance-groups' },
          { title: 'HR Calendar', icon: 'md-approval', link: '/hr-calendar' },
          { title: 'Who Is In', icon: 'md-approval', link: '/who-is-in' },
          { title: 'Attendance Report', icon: 'md-approval', link: '/attendance-report' },
        ],
      },
      {
        title: 'Leave Management',
        icon: 'la-plane-departure-solid',
        children: [
          { title: 'Leave Types', icon: 'md-approval', link: '/leave-types' },
          { title: 'Leave Group', icon: 'md-approval', link: '/leave-groups' },
          { title: 'My Leave Request', icon: 'md-approval', link: '/leave-request' },
          { title: 'All Leave Request', icon: 'md-approval', link: '/all-leave-requests' },
          { title: 'Leave Balance', icon: 'md-approval', link: '/leave-balance' },
        ],
      },
      {
        title: 'Payroll',
        icon: 'la-plane-departure-solid',
        children: [
          { title: 'Manage Salaries', icon: 'md-approval', link: '/manage-salaries' },
        ],
      },
      {
        title: 'Benefits',
        icon: 'la-plane-departure-solid',
        children: [
          { title: 'Benefit Types', icon: 'md-approval', link: '/benefit-types' },
          { title: 'Benefits', icon: 'md-approval', link: '/benefits' },
          { title: 'Benefit Reports', icon: 'md-approval', link: '/benefit-reports' },
        ],
      },
      {
        title: 'HR Tools',
        icon: 'la-tools-solid',
        children: [
          { title: 'Training Materials', icon: 'md-modeltraining-sharp', link: '/training-materials' },
          { title: 'Employee Handbook', icon: 'bi-book', link: '/employee-handbook' },
          { title: 'Compliance', icon: 'bi-check-all', link: '/compliance' },
        ],
      },
    ],
  },
  {
    title: 'Settings',
    icon: 'md-settings',
    children: [
      {
        title: 'Email Settings',
        icon: 'md-email-outlined',
        children: [
          { title: 'Email Signatures', icon: 'md-email-outlined', link: '/email-signature' },
          { title: 'Email Templates', icon: 'hi-template', link: '/email-templates' },
          { title: 'Merge Document', icon: 'hi-document-duplicate', link: '/merge-document' },
        ],
      },
      {
        title: 'Help',
        icon: 'io-help-circle-sharp',
        children: [
          { title: 'User Manual', icon: 'la-users-cog-solid', link: '/user-manual' },
          { title: 'Support Ticket', icon: 'bi-ticket-perforated', link: '/support-ticket' },
        ],
      },
    ],
  },
]
</script>


<template>
  <nav
    class="group w-20 hover:w-64 h-screen fixed shadow-outer border-r border-[#666666] top-0 left-0 z-50 dark:bg-navBlue bg-lightBlue transition-all duration-300 flex flex-col items-center justify-between py-4"
    @mouseleave="closeAllMenus"
  >
    <ul class="flex flex-col gap-2 w-full mx-auto">
      <li v-for="(item, idx) in menu" :key="item.title" class="relative">
        <!-- Main Menu Item -->
        <component
          :is="item.link ? 'router-link' : 'div'"
          :to="item.link"
          class="flex items-center p-2 cursor-pointer hover:bg-blue-900 rounded transition-colors"
          @click="!item.link && toggleMenu(idx)"
        >
          <span class="text-white dark:bg-navBlue bg-lightBlue rounded-lg text-2xl p-3 ml-1 shadow-outer">
            <v-icon :name="item.icon" scale="1.5" />
          </span>
          <span class="ml-4 text-white text-lg font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap flex items-center">
            {{ item.title }}
          </span>
          <span
            v-if="item.children"
            class="ml-auto hidden opacity-0 group-hover:block group-hover:opacity-100 text-white"
          >
            <v-icon
              :name="openMenu === idx ? 'md-keyboardarrowup' : 'md-keyboardarrowdown'"
              scale="1.2"
            />
          </span>
        </component>

        <!-- Submenu -->
        <ul
          v-if="item.children"
          :class="[
            'shadow-submenu w-full z-10 mt-2 overflow-hidden transition-all duration-300 ease',
            openMenu === idx ? 'max-h-[500px] translate-y-0' : 'max-h-0 -translate-y-2 pointer-events-none'
          ]"
        >
          <li v-for="(sub, subIdx) in item.children" :key="sub.title" class="relative">
            <component
              :is="sub.link ? 'router-link' : 'div'"
              :to="sub.link"
              class="flex items-center p-2 cursor-pointer hover:bg-blue-800 rounded transition-colors"
              @click="!sub.link && toggleSubMenu(`${idx}-${subIdx}`)"
            >
              <span class="text-white mr-2">
                <v-icon :name="sub.icon" scale="1.2" />
              </span>
              <span class="text-white text-lg font-medium flex items-center">
                {{ sub.title }}
              </span>
              <span v-if="sub.children" class="ml-auto text-white">
                <v-icon
                  :name="openSubMenu === `${idx}-${subIdx}` ? 'md-keyboardarrowup' : 'md-keyboardarrowdown'"
                  scale="1.2"
                />
              </span>
            </component>

            <!-- Sub-submenu -->
            <ul
              v-if="sub.children"
              :class="[
                'shadow-submenu w-full z-10 mt-2 overflow-hidden transition-all duration-300 ease',
                openSubMenu === `${idx}-${subIdx}` ? 'max-h-[500px] translate-y-0' : 'max-h-0 -translate-y-2 pointer-events-none'
              ]"
            >
              <li
                v-for="child in sub.children"
                :key="child.title"
                class="flex items-center p-2 cursor-pointer hover:bg-blue-700 rounded transition-colors"
              >
                <router-link
                  :to="child.link"
                  class="flex items-center text-white w-full"
                >
                  <span class="text-white mr-2">
                    <v-icon :name="child.icon" scale="1.1" />
                  </span>
                  <span class="text-white text-base font-medium flex items-center">
                    {{ child.title }}
                  </span>
                </router-link>
              </li>
            </ul>
          </li>
        </ul>
      </li>
    </ul>

    <ul class="flex flex-col justify-center pl-6 gap-6 w-full mx-auto text-white">
      <v-icon name="bi-telephone" scale="1.5"></v-icon>
      <v-icon name="si-gmail" scale="1.5"></v-icon>
      <v-icon name="bi-chat-dots" scale="1.5"></v-icon>
      <v-icon name="bi-power" scale="1.5"></v-icon>
    </ul>
  </nav>
</template>

