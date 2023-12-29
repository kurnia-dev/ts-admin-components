<script lang="ts" setup>
import { ref } from 'vue';

const props = defineProps<{
  title: string;
  description: string;
}>();

const dialog = ref();

const closeDialog = () => dialog.value.close();
</script>

<template>
  <Dialog
    ref="dialog"
    modal
    header="Scan RFID"
    :closable="false"
    :style="{ width: '400px' }"
    :pt="{
      header: { class: 'dialog-header' },
      content: { class: 'dialog-content' },
    }"
  >
    <template #header>
      <div class="d-flex align-items-center justify-content-center col-12">
        <i class="ri-rfid-line"></i>
        <span class="p-dialog-title">Scan RFID</span>
      </div>
    </template>
    <div class="text-danger bg-light" style="padding: 10px">
      <span class="title">{{ props.title }}</span>
      <br />
      <div class="description">{{ props.description }}</div>
    </div>
    <template #footer>
      <Button label="Close" @click="closeDialog()" plain text />
    </template>
  </Dialog>
</template>

<style lang="scss">
@import '~rfs/scss';

// p {
//   @include font-size(9px);
// }
.title {
  font-weight: 700;
}

.dialog-header {
  padding: 24px 24px 0 24px !important;
}

.dialog-content {
  padding: 12px 24px !important;
}
</style>
