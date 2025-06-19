<template>
  <div class="p-2">
    <ScanQrCode @scannedText="linkUsers($event)" />
  </div>
</template>

<script lang="ts" setup>
  import { toast } from "vue-sonner";
  const route = useRoute();


  async function linkUsers( userId: string )
  {
      const connectionId = Array.isArray(route.params.connectionId) ? route.params.connectionId[0] : route.params.connectionId!;
      const data = await useSupabaseRepo().linkConnection( connectionId, userId )
      if( data.guest_id )
      {
        toast.success('Połączono użytkowników');
        navigateTo('/');
      }
  }
</script>

<style>

</style>