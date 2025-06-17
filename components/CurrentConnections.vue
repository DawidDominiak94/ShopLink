<template>
  <div class="rounded-3xl bg-primary/40 w-full flex flex-col mb-4">
    <div class="p-4">
      <fieldset class="fieldset">
        <legend class="fieldset-legend">Opis powiązania</legend>
        <textarea v-model="desciption" class="textarea w-full resize-none" rows="10" placeholder="Opis powiązania"></textarea>
      </fieldset>
    </div>
    <div class="self-center text-center p-4 hover:bg-primary/30 w-full rounded-3xl" @click="createConnection()">Utwórz powiazanie</div>
  </div>

  <div class="rounded-3xl bg-primary/40 w-full flex flex-col pt-2 pb-2">
    <div class="self-center p-4">Obecne powiązania</div>
    <div>
      <ul>
        <li v-for="element of syncedUsersData" :key="element.id" class="flex w-full p-4 justify-items-center items-center">
          <div class="w-10 h-10 cursor-pointer flex"  @click="showQrCode(element)">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 0 1 3.75 9.375v-4.5ZM3.75 14.625c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5a1.125 1.125 0 0 1-1.125-1.125v-4.5ZM13.5 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 0 1 13.5 9.375v-4.5Z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 6.75h.75v.75h-.75v-.75ZM6.75 16.5h.75v.75h-.75v-.75ZM16.5 6.75h.75v.75h-.75v-.75ZM13.5 13.5h.75v.75h-.75v-.75ZM13.5 19.5h.75v.75h-.75v-.75ZM19.5 13.5h.75v.75h-.75v-.75ZM19.5 19.5h.75v.75h-.75v-.75ZM16.5 16.5h.75v.75h-.75v-.75Z" />
            </svg>
          </div>
          <div class="fieldset w-full text-2xl text-center">
            {{ element.description }}
          </div>
          <div class="w-10 h-10 text-red-500 cursor-pointer flex">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-10">
              <path stroke-linecap="round" stroke-linejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
            </svg>
          </div>
        </li>
      </ul>
    </div>
  </div>
  <dialog id="my_modal_1" class="modal">
    <div class="modal-box">
      <h3 class="text-lg font-bold text-center">Kod QR do sparowania kont</h3>
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

  const syncedUsersData = ref<SyncedUsers[]>([]);
  const text = shallowRef('https://vueuse.org')
  const qrcode = useQRCode(text, {
    errorCorrectionLevel: 'H',
    margin: 3,
  });

  const id = ref<string>();

  onMounted( () => {
    fetchData();
  })

  const desciption = ref<string>('');

  async function fetchData()
  {
    syncedUsersData.value = await useSupabaseRepo().getSyncedUsers();
  }

  async function createConnection()
  {
    await useSupabaseRepo().createConnection( desciption.value );
    fetchData();
  }

  function showQrCode(element: SyncedUsers)
  {
    my_modal_1.showModal();
    text.value = element.id;
  }

</script>

<style>

</style>