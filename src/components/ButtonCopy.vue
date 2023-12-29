<script lang="ts" setup>
import { ToastServiceMethods } from 'primevue/toastservice';

const props = defineProps<{
  toast: ToastServiceMethods;
  text: string;
}>();

const copyToClipboard = (text: string) => {
  navigator.clipboard.writeText(text);
};

const copy = () => {
  copyToClipboard(props.text);
  props.toast.add({
    severity: 'success',
    detail: 'Copied to clipboard',
    life: 3000,
  });
};
</script>

<template>
  <button
    class="p-button p-component p-button-icon-only p-button-secondary p-button-text"
    type="button"
    @click="copy"
  >
    <span class="p-button-icon ri-file-copy-line copy-icon"></span>
    <span class="p-button-label">&nbsp;</span>
  </button>
</template>

<style lang="scss" scoped>
@import '~rfs/scss';

.copy-icon {
  @include font-size(16px !important);
}
</style>
