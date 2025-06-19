<template>
  <div class="p-4">
    <div class="flex mb-8 w-full">
      <h1 class="text-2xl font-bold w-full">ShopLink - {{ lista?.name }}</h1>
      <div class="text-red-600 content-center cursor-pointer" @click="deleteList()">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
          <path stroke-linecap="round" stroke-linejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
        </svg>
      </div>
    </div>

    <div>
      <h2>Elementy na liście:</h2>
      <div class="mb-4">
        <div v-for="(element,_index) of items" :key="element.id" class="border-b border-primary pt-4 pb-4" :class="[_index===0 ? 'border-t' : '']" @click="markItemAsDone(element)">
          <input type="checkbox" :checked="element.bought" class="checkbox checkbox-xl checkbox-primary mr-4" />
          {{ element.text }} [{{ element.unit }} {{ element.quantity }}]
        </div>
      </div>
      <form  @submit.prevent="addItemsToShoppingList()">
        <label class="floating-label pb-1">
          <input type="text" v-model="newElementModel.item.text" placeholder="Wpisz nazwę" class="input input-xl w-full" />
          <span>Nazwa</span>
        </label>
        <div class="flex">
          <select class="select select-xl w-full" v-model="newElementModel.item.unit">
            <option v-for="unit of useUnitComposable().getUnits()" :value="unit.value">{{unit.label}}</option>
          </select>
          <label class="floating-label pb-1">
            <input type="text" v-model="newElementModel.item.quantity" placeholder="Wpisz nazwę" class="input input-xl w-full" />
            <span>Ilość</span>
          </label>
        </div>

        <button class="btn btn-primary w-full" type="submit">Dodaj</button>
      </form>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { v4 as uuidv4 } from 'uuid';

  const route = useRoute();
  const userId : string | null = useUserStore().getLoggedInUser.userId;
  const listaUuid = route.params.id.toString();
  const lista = ref<ShoppingList>();
  const items = ref<ShoppingItem[]>();

  const newElementModel = reactive<{item : ShoppingItem}>({ item : shoppingListItemNew() })

  useHead({
    title: `Szczegóły - ${route.params.id}`
  })

  onMounted(() => {
    loadList();
  })

  function shoppingListItemNew() : ShoppingItem
  {
    return {
      id: uuidv4(),
      text: '',
      createdAt: 0,
      bought: false,
      quantity:1,
      unit: EShoppingItemUnit.PIECE
    }
  }

  async function deleteList()
  {
      useSupabaseRepo().deleteShoppingList(listaUuid);
  }

  async function loadList()
  {
    const tmpLista = await useSupabaseRepo().getShoppingListByUuid(listaUuid);

    if( tmpLista )
    {
      lista.value = tmpLista;
      items.value = await useSupabaseRepo().getShoppingListItems(listaUuid);
    }
      
  }

  async function addItemsToShoppingList()
  {
    const tmpItem = await useSupabaseRepo().addShoppingListItem( listaUuid, newElementModel.item );
    items.value?.push(tmpItem);
  }

  async function markItemAsDone( item : ShoppingItem )
  {
    item.bought = !item.bought;

    await useSupabaseRepo().updateShoppingListItem( listaUuid, item.id, item );
  }
</script>

<style>

</style>