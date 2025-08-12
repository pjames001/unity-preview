<script setup>
import { useThemeStore } from '../stores/theme';
import { computed } from 'vue';

const themeStore = useThemeStore();

// Computed property to determine the visual state of the toggle
const isChecked = computed(() => themeStore.isDarkMode);

// Function to handle the toggle click
const handleToggle = () => {
  themeStore.toggleDarkMode();
};
</script>

<template>
  <button
    @click="handleToggle"

    class="relative inline-flex h-7 w-14 flex-shrink-0 cursor-pointer rounded-full bg-white shadow-inner transition-colors duration-200 ease-in-out "
    role="switch"
    :aria-checked="isChecked.toString()"
  >
    <span class="sr-only">Toggle dark mode</span>
    <span
      aria-hidden="true"
      :class="{
        'translate-x-7 bg-navBlue': isChecked, // Move right for dark mode
        'translate-x-0 bg-lightBlue': !isChecked, // Stay left for light mode
      }"
      class="pointer-events-none absolute top-1 left-1 inline-block h-5 w-5 transform rounded-full shadow-outer shadow ring-0 transition duration-200 ease-in-out"
    ></span>
  </button>
</template>