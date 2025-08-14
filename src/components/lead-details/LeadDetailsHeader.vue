<script setup>
import { RouterLink } from 'vue-router';

</script>

<template>
  <header class="grid grid-cols-2 p-4 w-full bg-transparent relative">
    <div class="flex flex-col justify-end gap-2 px-4">
      <RouterLink to="/leads"
        class="w-max flex justify-center items-center gap-2 dark:bg-darkRed bg-lightRed border dark:border-rawRed border-rawRed dark:text-rawRed text-white text-sm font-bold px-4 py-2 rounded-xl shadow-outer hover:scale-105 transition-all">
        <v-icon name="md-keyboardarrowleft" scale="1.1"></v-icon>
        Back to Leads
      </RouterLink>

      <div class="grid grid-cols-2 gap-6 my-6 w-[500px] bg-transparent">
        <div>
          <label for="opener" class="dark:text-white text-gray-700 mr-2 font-medium block">Opener:</label>
          <select name="opener" id="opener"
            class="p-2 border border-gray-400 rounded bg-white  dark:bg-darkBlue text-gray-700 dark:text-white outline-none">
            <option value="tanyaMiller">Tanya Miller</option>
            <option value="joeWhite">Joe White</option>
            <option value="jadeFergeson">Jade Fergeson</option>
          </select>
        </div>

        <div>
          <label for="status" class="dark:text-white text-gray-700 mr-2 font-medium block">Status:</label>
          <select name="status" id="status"
            class="p-2 border border-gray-400 rounded bg-white  dark:bg-darkBlue text-gray-700 dark:text-white outline-none">
            <option value="tanyaMiller">Tanya Miller</option>
            <option value="joeWhite">Joe White</option>
            <option value="jadeFergeson">Jade Fergeson</option>
          </select>
        </div>

        <div>
          <label for="closer" class="dark:text-white text-gray-700 mr-2 font-medium block">Closer:</label>
          <select name="closer" id="closer"
            class="p-2 border border-gray-400 rounded bg-white  dark:bg-darkBlue text-gray-700 dark:text-white outline-none">
            <option value="tanyaMiller">Tanya Miller</option>
            <option value="joeWhite">Joe White</option>
            <option value="jadeFergeson">Jade Fergeson</option>
          </select>
        </div>

        <div>
          <label for="subStatus" class="dark:text-white text-gray-700 mr-2 font-medium block">Sub Status:</label>
          <select name="subStatus" id="subStatus"
            class="p-2 border border-gray-400 rounded bg-white  dark:bg-darkBlue text-gray-700 dark:text-white outline-none">
            <option value="tanyaMiller">Tanya Miller</option>
            <option value="joeWhite">Joe White</option>
            <option value="jadeFergeson">Jade Fergeson</option>
          </select>
        </div>
      </div>
    </div>

    <div class="flex flex-col justify-center items-center gap-3 absolute left-1/2 top-2 -translate-x-1/2">
      <h1
        class="text-center text-4xl dark:bg-darkBlue bg-lightBlue dark:text-lightBlue text-gray-200 py-4 px-8 rounded-lg border dark:border-lightBlue border-blue-700 shadow-outer font-medium">
        Dummy Lead</h1>
      <span class="dark:text-gray-200 text-gray-700 text-sm py-2 px-4 ">0 Years 21 Days</span>
      <span class="dark:text-gray-200 text-gray-700 text-lg"><span class="dark:text-white text-gray-800 font-semibold">Account Number:</span> L-20250709-0003</span>

      <div class="flex items-center gap-2 my-4">
        <v-icon name="md-keyboarddoublearrowleft-round" scale="1.6" title="Last"
          class="p-1 rounded-full dark:text-white text-gray-800 border dark:border-lightBlue border-gray-800 cursor-pointer"></v-icon>
        <v-icon name="md-keyboardarrowleft" scale="1.6" title="Previous"
          class="p-1 rounded-full dark:text-white text-gray-800 border dark:border-lightBlue border-gray-800 cursor-pointer"></v-icon>
        <v-icon name="md-keyboardarrowright" scale="1.6" title="Next"
          class="p-1 rounded-full dark:text-white text-gray-800 border dark:border-lightBlue border-gray-800 cursor-pointer"></v-icon>
        <v-icon name="md-keyboarddoublearrowright-round" scale="1.6" title="First"
          class="p-1 rounded-full dark:text-white text-gray-800 border dark:border-lightBlue border-gray-800 cursor-pointer"></v-icon>
        <v-icon name="md-email-outlined" scale="1.6" title="Email"
          class="p-1 rounded-full dark:text-white text-gray-800 border dark:border-lightBlue border-gray-800 cursor-pointer"></v-icon>
        <v-icon name="bi-telephone" scale="1.6" title="Phone"
          class="p-1 rounded-full dark:text-white text-gray-800 border dark:border-lightBlue border-gray-800 cursor-pointer"></v-icon>
      </div>
    </div>

    <div class="flex justify-end items-start gap-3">
      <button
        class="flex items-center justify-center gap-2 text-sm dark:bg-darkGreen bg-pigmentGreen border dark:border-lightGreen border-lightGreen dark:text-lightGreen text-white font-bold px-4 py-2 rounded-xl shadow-outer hover:scale-105 transition-all">
        <v-icon name="bi-clock-history" scale="1.1"></v-icon>
        Add Reminder
      </button>

      <button
        class="flex items-center justify-center gap-2 text-sm dark:bg-darkBrown bg-warmYellow/80 py-2 px-4 rounded-xl border border-darkOrange dark:text-darkOrange text-white font-bold px-4 py-2 rounded-xl shadow-outer hover:scale-105 transition-all">
        <v-icon name="bi-check-all" scale="1.1"></v-icon>
        Save
      </button>

      <button
        class="flex items-center justify-center gap-2 text-sm dark:bg-btnBlue bg-newPurple border dark:border-newPurple border-darkPurple dark:text-newPurple text-white font-bold px-4 py-2 rounded-xl shadow-outer hover:scale-105 transition-all">
        <v-icon name="la-recycle-solid" scale="1.1"></v-icon>
        Convert to Client
      </button>
    </div>
  </header>
</template>