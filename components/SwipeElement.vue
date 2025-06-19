<template>
  <div class="relative overflow-hidden w-full max-w-md">
    <!-- przycisk po prawej -->
    <div class="absolute right-0 top-0 h-full flex items-center bg-red-600 px-4 text-white z-0">
      <button @click="emitDelete()">🗑 Usuń</button>
    </div>

    <!-- główna zawartość -->
    <div
      class="relative bg-base-100 p-4 shadow-md z-10 transition-transform duration-200 touch-pan-x"
      :style="{ transform: `translateX(${translateX}px)` }"
      @touchstart="onTouchStart"
      @touchmove.prevent="onTouchMove"
      @touchend="onTouchEnd"
    >
      <input type="checkbox" :checked="item.bought" class="checkbox checkbox-xl checkbox-primary mr-4" />
      {{ item.text }} [{{ item.unit }} {{ item.quantity }}]
    </div>
  </div>
</template>

<script setup lang="ts">
  const { item } = defineProps<{ item : ShoppingItem}>();
  const output = defineEmits<{ deleteItem : [string] }>();
  const translateX = ref(0)
  const startX = ref(0)

  const onTouchStart = (e: TouchEvent) => {
    startX.value = e.touches[0].clientX
  }

  const onTouchMove = (e: TouchEvent) => {
    const delta = e.touches[0].clientX - startX.value
    // ograniczamy przesuwanie tylko w lewo (ujemnie)
    translateX.value = Math.max(Math.min(delta, 0), -100) // max 100px w lewo
  }

  const onTouchEnd = () => {
    // jeśli przesunięcie jest wystarczające, zostaje otwarte
    translateX.value = translateX.value < -60 ? -100 : 0
  }

  const emitDelete = () =>
  {
    output('deleteItem', item.id );
  }
</script>