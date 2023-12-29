<script setup lang="ts">
import { getImgURL } from '@/utils';
import { ref } from 'vue';

const noLogoIcon = ref(getImgURL('no-logo.png'));
const timeoutIcon = ref(getImgURL('timeout.svg'));
</script>

<template>
  <div
    class="container d-flex align-items-center justify-content-center flex-column"
  >
    <img
      :src="noLogoIcon"
      alt="Image"
      style="height: 60px; width: auto; margin-bottom: 20px"
    />
    <p id="item_1" class="text-object item">404 Not Found</p>
    <img id="item_2" class="item" :src="timeoutIcon" alt="Image" />
    <p id="item_3" class="text-object item">
      Maybe the link to this page has expired or you don't have the right to
      access this page
    </p>
  </div>
</template>

<style scoped>
.container {
  position: relative;
  height: 100vh;
}
#item_1 {
  font-size: 30px;
  font-family: 'Manrope', sans-serif;
  font-weight: Medium;
  color: rgba(0, 0, 0, 1);
}
#item_2 {
  left: 470px;
  top: 257.82px;
  width: 340px;
  height: 240.36px;
}
#item_3 {
  font-size: 14px;
  font-family: 'Manrope', sans-serif;
  color: rgba(0, 0, 0, 1);
}
</style>
