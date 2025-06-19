<template>
  <div class="flex flex-col gap-4 text-center">
    <div>
    TEST:{{ test }}
    </div>
    <qrcode-stream @detect="onDetect"></qrcode-stream>
  </div>
</template>

<script lang="ts" setup>
  import { QrcodeStream } from 'vue-qrcode-reader'
  const test = ref<QrCodeData[]>();

  function onDetect (detectedCodes : any) 
  {
    test.value = detectedCodes;
  }
</script>

<style>

</style>