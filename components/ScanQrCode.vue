<template>
  <div class="flex flex-col gap-4 text-center">
    <div>
    Scanned code value:
      <template v-if="qr">
        {{ qr[0].rawValue }}
      </template>
    </div>
    <qrcode-stream @detect="onDetect"></qrcode-stream>
  </div>
</template>

<script lang="ts" setup>
  import { QrcodeStream } from 'vue-qrcode-reader';
  const output = defineEmits<{ scannedText: [string] }>();
  
  const qr = ref<QrCodeData[]>();

  async function onDetect (detectedCodes : any) 
  {
    qr.value = detectedCodes;
    if( qr.value )
      if( qr.value[0].rawValue )
      {
         output('scannedText', qr.value[0].rawValue);
      }
  }
</script>

<style>

</style>