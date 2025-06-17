<template>
  <div class="flex flex-col gap-4 text-center">
    TEST:{{ test }}
    <qrcode-stream @detect="onDetect"></qrcode-stream>
  </div>
</template>

<script lang="ts" setup>
  import { QrcodeStream, QrcodeDropZone, QrcodeCapture } from 'vue-qrcode-reader'
  const test = ref();

  function onDetect (detectedCodes : any) 
  {
    test.value = detectedCodes;
  }
</script>

<style>

</style>