<template>
  <div class="p-4">
    <h1 class="text-2xl font-bold w-full">ShopLink - nowa lista</h1>
    <form @submit.prevent="addToShoppingList()">
      <label class="floating-label pb-1">
        <input type="text" v-model="shoppingListName" placeholder="Wpisz nazwę" class="input input-xl w-full" />
        <span>Nazwa</span>
      </label>
      <button class="btn btn-primary w-full" type="submit">Dodaj</button>
    </form>
  </div>
</template>

<script lang="ts" setup>
  const { addShoppingList } = useShoppingListRepo();
  const shoppingListName = ref<string>();

  async function addToShoppingList()
  {
    const tempList : ShoppingList | undefined = await addShoppingList(shoppingListName.value!);

    if( tempList )
      await navigateTo({ name:'shopping-list-id', params: { id: tempList.id } })
  }
</script>

<style>

</style>