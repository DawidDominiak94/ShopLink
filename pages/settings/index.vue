<template>
  <div class="p-4">
    <h1 class="text-2xl font-bold">ShopLink - Ustawienia</h1>  

      <template v-if="userData.userId.value">
        <div class="p-2">
          <CurrentUserComponent
            :data="{
              userId: userData.userId.value,
              userEmail: userData.userEmail.value,
              lastLoggedIn: userData.lastLoggedIn.value,
              createdAt: userData.createdAt.value,
              image: userData.image.value
            }"

            :logout-action="userStore.logOut"
          />
        </div>

        <div class="p-2">
          <CurrentConnections />
        </div>

      </template>
      <template v-else>
        <div class="p-2">
          <RegisterComponent />
        </div>
        
        <div class="p-2">
          <LogInComponent />
        </div>
      </template>


      

      
  </div>
</template>

<script lang="ts" setup>
  const userStore = useUserStore();
  const userData = storeToRefs(userStore);

    onMounted(async () => {
      await userStore.refreshUser();
  });
</script>

<style>

</style>