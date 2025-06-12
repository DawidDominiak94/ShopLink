<template>
  <div class="rounded-3xl bg-primary/40 w-full flex flex-col pt-2 pb-2">
    <h1 class="p-4">Obecnie zalogowany:</h1>
    <div v-if="activeUser" class="self-center">
      <div>
        Użytkownik: {{ activeUser.data.user.email }}
      </div>
      
      <div>
        Ostatnio zalogowany: {{ activeUser.data.user.last_sign_in_at }}
      </div>
      
      <div>
        Zarejestrowany dnia: {{ activeUser.data.user.created_at }}
      </div>
      
    </div>

  </div>
</template>

<script lang="ts" setup>
  const activeUser = ref();

  onMounted(async () => {
      activeUser.value = await useUseAuth().getCurrentUser();
  });

</script>

<style>

</style>