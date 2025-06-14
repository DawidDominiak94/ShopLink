<template>
  <NuxtLayout>
    <Toaster position="top-right" richColors/>  
    <NuxtPage />
  </NuxtLayout>
</template>

<script lang="ts" setup>
  import { Toaster } from 'vue-sonner';
  import 'vue-sonner/style.css';
</script>