<template>
  <ClientOnly>
        <Button
          v-if="$pwa?.showInstallPrompt && !$pwa?.offlineReady"
          class="mt-4"
          size="sm"
          @click="installPwa"
        >
      Install Application
      </Button>
  </ClientOnly>

  <div class="p-4">
    <h1 class="text-2xl font-bold">ShopLink</h1>    
    <div class="grid grid-cols-2 gap-4 mt-4">
      <NuxtLink :to="{ name: 'shopping-list-new' }" class="rounded-4xl border-2 h-30 text-center content-center border-dashed border-secondary">
        <div class="justify-center flex text-secondary">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
        </div>
      </NuxtLink>
      <NuxtLink :to="{ name: 'shopping-list-id', params: { id: item.id } }" v-for="item in items" :key="item.id" class="rounded-4xl border-2 h-30 text-center content-center border-dashed" :class="[  getListBorderByStatus(item) ]">
          {{ item.name }} 
      </NuxtLink>
    </div>

  </div>
</template>

<script setup lang="ts">
  const { fetchShoppingList } = useShoppingListRepo();
  const items = ref<ShoppingList[]>([]);

  useHead({
    link: [
      {
        rel: 'apple-touch-icon',
        href: '/icons/512x512.png'
      },
      {
        rel: 'manifest',
        href: '/manifest.webmanifest'
      }
    ],
    meta: [
      { name: 'apple-mobile-web-app-capable', content: 'yes' },
      { name: 'apple-mobile-web-app-status-bar-style', content: 'default' },
      { name: 'apple-mobile-web-app-title', content: 'ShopLink' }
    ]
  })

  onMounted(async () => {
    await fetchShoppingLists();
  })

  async function fetchShoppingLists()
  {
    items.value = await fetchShoppingList();
  }

  function getListBorderByStatus( list : ShoppingList ) : string
  {
    switch( list.status )
    {
      case EShoppingListStatus.ACTIVE: return 'border-primary';
      case EShoppingListStatus.COMPLETED: return 'border-green-600';
      case EShoppingListStatus.ARCHIVED: return 'border-gray-600';
      default: return 'border-red-600';
    };
  }

  const nuxtApp = useNuxtApp();
  const installPwa = () => {
    const pwa = nuxtApp.$pwa
    if (pwa?.showInstallPrompt) {
      pwa.install()
    } else {
      throw createError({
        statusCode: 400,
        message: 'Something went wrong installing the application, please try again later or contact support.',
      })
    }
  }

</script>