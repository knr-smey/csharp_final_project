<template>
    <aside class="w-64 h-screen bg-indigo-700 text-white flex flex-col p-5">

    <!-- Logo -->
    <div class="flex items-center mb-10">
      <div class="w-10 h-10 bg-orange-400 rounded-lg flex items-center justify-center font-extrabold text-3xl">
        A
      </div>
      <span class="text-3xl font-bold ml-3">Akademi</span>
    </div>

    <!-- Menu -->
    <nav class="flex flex-col space-y-2">

      <RouterLink
        to="/courses"
        class="flex items-center p-3 rounded-lg hover:bg-indigo-600 transition"
      >
        <span class="mr-3">📚</span>
        <span class="flex-1">Course</span>
        <span class="opacity-60 text-3xl">›</span>
      </RouterLink>

      <RouterLink
        to="/categories"
        class="flex items-center p-3 rounded-lg hover:bg-indigo-600 transition"
      >
        <span class="mr-3">📂</span>
        <span class="flex-1">Category</span>
        <span class="opacity-60 text-3xl">›</span>
      </RouterLink>

      <RouterLink
        to="/subcategories"
        class="flex items-center p-3 rounded-lg hover:bg-indigo-600 transition"
      >
        <span class="mr-3">🗂</span>
        <span class="flex-1">SubCategory</span>
        <span class="opacity-60 text-3xl">›</span>
      </RouterLink>

    </nav>

  </aside>
</template>

<script setup>
import { RouterLink } from "vue-router"
</script>