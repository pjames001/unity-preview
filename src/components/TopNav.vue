<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import DarkModeToggle from './DarkModeToggle.vue'

const route = useRoute()

const pageTitle = computed(() => route.name === 'Home' ? 'Dashboard' : route.name)
</script>

<template>
  <nav
    class="fixed top-0 left-[80px] z-40 shadow-outer border-b border-[#666666] w-[calc(100vw-80px)] h-20 dark:bg-navBlue bg-lightBlue flex justify-between item-center px-10 transition-all duration-300 ease"
  >
    <div class="flex items-center gap-6">
      <h1 class="text-4xl text-white">{{ pageTitle }}</h1>
      <span class="text-4xl dark:text-gray-500 text-white">|</span>
      <span class="text-xl dark:text-gray-500 text-white">Welcome Back Philip</span>
    </div>

    <div class="flex items-center gap-6">
      <DarkModeToggle />

      <button class="text-white dark:bg-navBlue bg-lightBlue rounded-lg text-2xl p-3 shadow-outer relative">
        <v-icon name="bi-bell" scale="1.5"></v-icon>
        <span class="absolute bottom-0 right-0 bg-red-600 w-4 h-4 rounded-full text-xs">3</span>
      </button>

      <button class="text-white dark:bg-navBlue bg-lightBlue rounded-lg text-2xl p-3 shadow-outer">
        <v-icon name="bi-person-circle" scale="1.5"></v-icon>
      </button>
    </div>
  </nav>
</template>

