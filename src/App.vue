<script setup>
import Sidebar from './components/Sidebar.vue';
</script>

<template>
  <div class="flex h-screen overflow-hidden">
    <!-- Sidebar - Fixed height -->
    <Sidebar />

    <!-- Main content - Scrollable -->
    <main class="flex-1 bg-gray-100 overflow-y-auto scrollbar-hidden">
      <div class="p-6">
        <router-view />
      </div>
    </main>
  </div>
</template>

<style>
.scrollbar-hidden::-webkit-scrollbar{
  display:none;
}
.scrollbar-hidden{
  -ms-overflow-style: none;
  scrollbar-width: none;
}
* {
  scroll-behavior: smooth;
}
</style>