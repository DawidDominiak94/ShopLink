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
  import { toast } from 'vue-sonner';
  const shoppingListName = ref<string>();

  async function addToShoppingList()
  {
    if( !shoppingListName.value )
      toast.error('Nazwa listy musi zostać podana!');
    else
    {
      const userId : string | null = useUserStore().getLoggedInUser.userId;
      const tempList : ShoppingList | undefined = await useShoppingListRepo().addShoppingList(shoppingListName.value);

      if (!tempList || !userId) 
      {
        toast.error('Nie udało się dodać listy zakupów.');
        throw new Error('Nie udało się dodać listy zakupów.');
      }
      
      const supabaseList : ShoppingList = await useUseShoppingListSupabase().addListToSupabase(tempList, userId);
      await useShoppingListRepo().updateAsSynced(supabaseList);

      if( supabaseList )
      {
        await navigateTo({ name:'shopping-list-id', params: { id: supabaseList.uuid } })
      }
      else
      {
        toast.error('Nie udało się dodać listy zakupów.');
        throw new Error('Nie udało się dodać listy zakupów.');
      }
    }
  }
</script>

<style>

</style>