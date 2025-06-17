<template>
  <div class="w-full h-dvh">
    <div class="max-h-[calc(100dvh-10rem)] min-h-[calc(100dvh-5rem)] overflow-y-auto">
      <slot />
    </div>
   
    <div class="bg-secondary w-full h-20">
      <AppNavbar/>
    </div>
  </div>
</template>

<script lang="ts" setup>

</script>

<style>

</style>