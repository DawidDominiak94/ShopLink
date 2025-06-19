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
    if( typeof route.params == 'string' )
    {
      const data = await useSupabaseRepo().linkConnection( route.params.connectionId!, userId )
      if( data.guest_id )
      {
        toast.success('Połączono użytkowników');
        navigateTo('/');
      }
    }

  }
</script>

<style>

</style>