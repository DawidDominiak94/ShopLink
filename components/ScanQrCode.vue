<template>
  <div class="flex flex-col gap-4 text-center">
    <qrcode-stream @detect="onDetect"></qrcode-stream>
  </div>
</template>

<script lang="ts" setup>
  import { QrcodeStream, QrcodeDropZone, QrcodeCapture } from 'vue-qrcode-reader'

  function onDetect (detectedCodes : any) 
  {
    console.log(detectedCodes);
  }
</script>

<style>

</style>