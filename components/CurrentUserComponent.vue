<template>
  <div class="rounded-3xl bg-primary/40 w-full flex flex-col pt-2 pb-2">
    <div v-if="activeUser" class="self-center p-4">
      
      <div class="flex">
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
</template>

<script lang="ts" setup>
  const activeUser = defineProps<{data: UserStoreState, logoutAction: Function }>();

</script>

<style>

</style>