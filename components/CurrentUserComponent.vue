<template>
  <div class="rounded-3xl bg-primary/40 w-full flex flex-col pt-2 pb-2">
    <div v-if="activeUser" class="self-center p-4">
      
      <div class="flex sm:flex-col">
          <div>
            <img class="rounded w-25 h-25" :src=" data.image ?? '/dummy.jpg' " alt="Avatar profilowy użytkownika" />
          </div>
          <div class="flex pl-4 flex-col">
              <h1 class="text-2xl font-extrabold"> {{ activeUser.data.userEmail }}</h1>
              <p>Konto utworzono: {{ formatDateLong( activeUser.data.createdAt! ) }}</p>
              <p>Ostatnie logowanie: {{ formatDateLong( activeUser.data.lastLoggedIn! ) }}</p>
          </div>
      </div>    
    </div>

  </div>
  <div class="rounded-3xl bg-red-500/40 w-full flex flex-col mt-4 p-4 text-center cursor-pointer" @click="logoutAction()">
      Wyloguj
  </div>
  <div class="rounded-3xl bg-green-500/40 w-full flex flex-col mt-4 p-4 text-center cursor-pointer" @click="showQrCode()">
      Udostępnij swój identyfikator
  </div>

  <dialog id="shareMyIdModal" class="modal">
    <div class="modal-box">
      <h3 class="text-lg font-bold text-center">Mój identyfikator</h3>
      <p class="py-4 justify-items-center">
        <img class="mt-6 mb-2 rounded border" :src="qrcode" alt="QR Code">
      </p>
      <div class="modal-action">
        <form method="dialog">
          <button class="btn">Zamknij</button>
        </form>
      </div>
    </div>
  </dialog>
</template>

<script lang="ts" setup>
  import { useQRCode } from '@vueuse/integrations/useQRCode';
  const activeUser = defineProps<{data: UserStoreState, logoutAction: Function }>();
  const qrcode = useQRCode( activeUser.data.userId! , {
    errorCorrectionLevel: 'H',
    margin: 3,
  });

  function showQrCode()
  {
    shareMyIdModal.showModal();
  }

</script>

<style>

</style>