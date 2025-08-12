<script setup>
import { RouterLink, RouterView } from 'vue-router'
import Navbar from './components/Navbar.vue';
import PivotHighchartsPyramid from './components/home/PivotHighchartsPyramid.vue';
import RoundedChart from './components/home/RoundedChart.vue';
import TopNav from './components/TopNav.vue';

</script>

<template>
  <Navbar />
  <TopNav />
  <!-- <HomeView /> -->
  <RouterView />
  <header>
      <!-- <nav>
        <RouterLink to="/">Home</RouterLink>
        <RouterLink to="/about">About</RouterLink>
      </nav> -->
  </header>
  <!-- <RouterView /> -->
   <!-- <PivotHighchartsPyramid />
   <RoundedChart /> -->
</template>