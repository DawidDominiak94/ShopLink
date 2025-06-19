<template>
  <div class="flex flex-col gap-4 text-center">
    <div>
    TEST:
      <template v-if="test">
        {{ test[0].rawValue }}
      </template>
    </div>
    <qrcode-stream @detect="onDetect"></qrcode-stream>
  </div>
</template>

<script lang="ts" setup>
  import { QrcodeStream } from 'vue-qrcode-reader'
  const test = ref<QrCodeData[]>();

  async function onDetect (detectedCodes : any) 
  {
    test.value = detectedCodes;
    if( test.value )
      if( test.value[0].rawValue )
      {
        useSupabaseRepo().linkConnection( test.value[0].rawValue )
      }
  }
</script>

<style>

</style>