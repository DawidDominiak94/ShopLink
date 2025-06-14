<template>
  <div class="rounded-3xl bg-primary/40 w-full flex flex-col pt-2 pb-2">
    <h1 class="p-4">Rejestracja</h1>
    <div class="w-full p-2">
      <input type="text" v-model="dane.email" placeholder="Email" class="input w-full" />
    </div>
    <div class="w-full p-2">
      <input type="password" v-model="dane.password" placeholder="Hasło" class="input w-full" />
    </div>
    <div class="w-full p-2">
      <button class="btn btn-success w-full" @click="onRegister()">Zarejestruj się</button>
    </div>
  </div>
</template>

<script lang="ts" setup>
  const dane = reactive<{ email: string, password: string }>({ email:"", password: "" });
  const store = useUserStore();

  async function onRegister()
  {
    store.register( dane.email, dane.password );
  }
  

</script>

<style>

</style>