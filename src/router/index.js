import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'Home',
      component: HomeView,
    },
    {
      path: '/search',
      name: 'Search',
      component: () => import('../views/SearchView.vue'),
    },
    {
      path: '/calendar',
      name: 'Calendar',
      component: () => import('../views/CalendarView.vue'),
    },
    {
      path: '/leads/:leadId',
      name: 'Lead Details',
      component: () => import('../views/LeadDetailsView.vue')
    },
    {
      path: '/public-holidays',
      name: 'Public Holidays',
      component: () => import('../views/PublicHolidaysView.vue')
    },
    {
      path: '/breaks',
      name: 'Breaks',
      component: () => import('../views/BreaksView.vue')
    },
    {
      path: '/week-schedule',
      name: 'Week Schedule',
      component: () => import('../views/WeekScheduleView.vue')
    },
    {
      path: '/week-schedule/:weekScheduleId',
      name: 'View Schedule',
      component: () => import('../views/ViewScheduleView.vue'),
      props: true
    },
    {
      path: '/attendance-groups',
      name: 'Attendance Groups',
      component: () => import('../views/AttendanceGroupsView.vue'),
    },
    {
      path: '/hr-calendar',
      name: 'HR Calendar',
      component: () => import('../views/HRCalendarView.vue'),
    },
    {
      path: '/leave-request',
      name: 'Leave Request',
      component: () => import('../views/LeaveRequestView.vue')
    },
    {
      path: '/leave-types',
      name: 'Leave Types',
      component: () => import('../views/LeaveTypesView.vue')
    },
    {
      path: '/leave-groups',
      name: 'Leave Groups',
      component: () => import('../views/LeaveGroupsView.vue')
    },
    {
      path: '/all-leave-requests',
      name: 'All Leave Requests',
      component: () => import('../views/AllLeaveRequestsView.vue')
    },
    {
      path: '/leave-balance',
      name: 'Leave Balance',
      component: () => import('../views/LeaveBalanceView.vue')
    },
    // {
    //   path: '/clients/:clientId',
    //   name: 'ClientDetails',
    //   component: () => import('../views/ClientDetailsView.vue')
    // },
  ],
})

export default router
