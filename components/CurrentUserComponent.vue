<template>
  <div class="rounded-3xl bg-primary/40 w-full flex flex-col pt-2 pb-2">
    <h1 class="p-4">Obecnie zalogowany:</h1>
    <div v-if="activeUser" class="self-center">
      <div>
        Użytkownik: {{ activeUser.userEmail }}
      </div>
      
      <div>
        Ostatnio zalogowany: {{ activeUser.lastLoggedIn }}
      </div>
      
      <div>
        Zarejestrowany dnia: {{ activeUser.createdAt }}
      </div>
      
    </div>

  </div>
</template>

<script lang="ts" setup>
  const activeUser = ref<UserStoreState>();
  const store = useUserStore();

  onMounted(async () => {
      await store.refreshUser();
      activeUser.value = store.getLoggedInUser;
  });

</script>

<style>

</style>