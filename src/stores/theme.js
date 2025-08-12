// stores/theme.js
import { defineStore } from 'pinia';
import { ref, watch } from 'vue';

export const useThemeStore = defineStore('theme', () => {
  // Initialize from localStorage, default to false (light mode)
  const isDarkMode = ref(localStorage.getItem('theme') === 'dark');

  // Watch for changes in isDarkMode and update localStorage and the HTML class
  watch(isDarkMode, (newValue) => {
    if (newValue) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, { immediate: true }); // Run immediately to set initial theme

  // Action to toggle the theme
  function toggleDarkMode() {
    isDarkMode.value = !isDarkMode.value;
  }

  return {
    isDarkMode,
    toggleDarkMode
  };
});