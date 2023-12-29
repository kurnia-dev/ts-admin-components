<script lang="ts" setup>
const props = defineProps<{
  qr: boolean;
  rfid: boolean;
}>();

const isActive = (active: boolean) => {
  if (active) {
    return 'text-primary';
  }
  return 'text-muted-custom';
};
</script>

<template>
  <div
    class="d-flex justify-content-between align-items-center tag-type-container"
  >
    <div class="d-flex align-items-center" :class="isActive(props.rfid)">
      <span class="ri-rfid-line"></span>
      <span>RFID</span>
    </div>
    <div class="d-flex align-items-center" :class="isActive(props.qr)">
      <span class="ri-qr-code-line"></span>
      <span>QR</span>
    </div>
  </div>
</template>

<style scoped>
.tag-type-container {
  width: 77px;
}
.text-muted-custom {
  color: #a0a3bd;
}
</style>
