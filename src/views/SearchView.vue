<template>
  <main class="view dark:bg-darkBlue bg-white">
    <section class="flex justify-center items-center gap-10 max-w-[1600px] mx-auto mt-10 rounded-xl shadow-outer dark:bg-darkPurple bg-[rgba(90,169,230,.35)] border dark:border-lightBlue border-clientPurple px-8 py-4 overflow-hidden transition-all duration-300 ease">
      <div class="flex flex-col gap-4 w-full">
        <label class="dark:text-white text-[#2c2c2c]" for="firstCompanyName">First Company Name</label>
        <input type="text" id="firstCompanyName" class="border p-2 rounded w-full mb-4 outline-none dark:bg-gray-800 dark:text-white dark:border-gray-600">
      </div>

      <div class="flex flex-col gap-4 w-full">
        <label class="dark:text-white text-[#2c2c2c]" for="lastName">Last Name</label>
        <input type="text" id="lastName" class="border p-2 rounded w-full mb-4 outline-none dark:bg-gray-800 dark:text-white dark:border-gray-600">
      </div>

      <div class="flex flex-col gap-4 w-full">
        <label class="dark:text-white text-[#2c2c2c]" for="accountNumber">Account Number</label>
        <input type="text" id="accountNumber" class="border p-2 rounded w-full mb-4 outline-none dark:bg-gray-800 dark:text-white dark:border-gray-600">
      </div>

      <div class="flex flex-col gap-4 w-full">
        <label class="dark:text-white text-[#2c2c2c]" for="items">Number of Items</label>
        <select name="items" id="items" class="border p-2 rounded w-full mb-4 outline-none dark:bg-gray-800 dark:text-white dark:border-gray-600">
          <option value="25">25</option>
          <option value="50">50</option>
          <option value="75">75</option>
          <option value="100">100</option>
        </select>
      </div>
      
    </section>

    <section class="max-w-[1600px] mx-auto my-10 rounded-xl shadow-outer dark:bg-darkBrown bg-[rgba(248,148,60,.5)] border dark:border-warmYellow border-darkOrange px-8 py-4 transition-all duration-300 ease">
      <table class="table-auto w-full my-10">
        <thead class="dark:text-white text-gray-800">
          <tr class="h-12">
            <th>
              Lead Name
            </th>
            <th>
              Contact
            </th>
            <th>
              Lead Status
            </th>
            <th>
              Opener
            </th>
          </tr>
        </thead>

        <tbody class="dark:bg-darkBlue bg-white shadow-inner dark:text-white text-gray-800">
          <tr class="text-center h-16">
            <td class="p-2 border-b dark:border-white border-gray-500">
              George & Joey's Towing
            </td>
            <td class="p-2 border-b dark:border-white border-gray-500">4531978654</td>
            <td class="p-2 border-b dark:border-white border-gray-500">
              <span class="py-2 px-4 text-white rounded-full bg-gray-500">N/A</span>
            </td>
            <td class="p-2 border-b dark:border-white border-gray-500">Tania Miller</td>
          </tr>

          <tr class="text-center h-16">
            <td class="p-2 border-b dark:border-white border-gray-500">
              George & Joey's Towing
            </td>
            <td class="p-2 border-b dark:border-white border-gray-500">4531978654</td>
            <td class="p-2 border-b dark:border-white border-gray-500">
              <span class="py-2 px-4 text-white rounded-full bg-gray-500">N/A</span>
            </td>
            <td class="p-2 border-b dark:border-white border-gray-500">Tania Miller</td>
          </tr>

          <tr class="text-center h-16">
            <td class="p-2 border-b dark:border-white border-gray-500">
              George & Joey's Towing
            </td>
            <td class="p-2 border-b dark:border-white border-gray-500">4531978654</td>
            <td class="p-2 border-b dark:border-white border-gray-500">
              <span class="py-2 px-4 text-white rounded-full bg-gray-500">N/A</span>
            </td>
            <td class="p-2 border-b dark:border-white border-gray-500">Tania Miller</td>
          </tr>
        </tbody>
      </table>
    </section>
  </main>
</template>

