<script setup lang="ts">
import { onBeforeUnmount, ref } from 'vue';
import { useToast } from 'primevue/usetoast';
import Toast from 'primevue/toast';
import ProgressSpinner from 'primevue/progressspinner';

onBeforeUnmount(() => {
  stopScan();
});

const props = withDefaults(
  defineProps<{
    label?: string;
    id?: string;
    bulk?: boolean;
    useIndicator?: boolean;
  }>(),
  {
    label: 'Scan QR',
    id: 'scan-qr-button',
    useIndicator: true,
  }
);

const emit = defineEmits<{
  scan: [value: string];
}>();

const toast = useToast();

const isScanning = ref(false);
const scanQrField = ref();

const focusToScanField = () => {
  scanQrField.value.focus();
};

const startScan = () => {
  isScanning.value = true;
  focusToScanField();
  toast.add({
    severity: 'info',
    group: 'scan-qr',
    closable: false,
  });

  window.addEventListener('click', focusToScanField);
};

const stopScan = () => {
  isScanning.value = false;
  window.removeEventListener('click', focusToScanField);
  toast.removeGroup('scan-qr');
};

const onScan = () => {
  emit('scan', scanQrField.value.value);
  scanQrField.value.value = '';

  if (!props.bulk) {
    stopScan();
  }
};

defineExpose({
  stopScan,
});
</script>

<template>
  <div class="position-relative">
    <Button :id="id" :disabled="isScanning" @click="startScan">
      <i class="ri-qr-code-line me-2"></i>
      <label class="me-2" style="font-size: calc(8px + 0.15vw)">
        {{ label }}
      </label>
      <i
        v-if="props.useIndicator"
        class="ri-checkbox-blank-circle-fill"
        style="font-size: 6px"
        :style="{ color: isScanning ? '#53CE93' : '#FF0022' }"
      ></i>
    </Button>

    <input
      type="text"
      class="position-absolute"
      style="top: -10000px"
      ref="scanQrField"
      @change="onScan"
    />

    <Toast position="bottom-right" group="scan-qr">
      <template #message>
        <div class="d-flex align-items-center justify-content-between w-100">
          <div class="d-flex align-items-center">
            <ProgressSpinner class="me-2" style="width: 20px; height: 20px" />
            <label> Scanning QR Code </label>
          </div>
          <Button label="Stop scan" severity="danger" @click="stopScan" />
        </div>
      </template>
    </Toast>
  </div>
</template>

<style scoped></style>
