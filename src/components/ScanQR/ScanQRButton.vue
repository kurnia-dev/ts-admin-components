<script lang="ts" setup>
import { onUnmounted, ref } from 'vue';
import { useToast } from 'primevue/usetoast';
import Toast from 'primevue/toast';
import ScanAPIs from '@/services/scanner.service';
import ErrorDialog from './ScanQRErrorDialog.vue';

const toast = useToast();

onUnmounted(async () => {
  await stop();
});

const props = defineProps<{
  modelValue?: string;
  label?: string;
  bulk?: boolean;
  id?: string;
  powerbank?: boolean;
  disabled?: boolean;
  btnClass?: string;
  btnStyle?: string;
}>();

const emit = defineEmits<{
  (e: 'update:modelValue', qr: string): void;
  (e: 'connect', data?: any): void;
  (e: 'connected', data?: any): void;
  (e: 'scan', qr: string): void;
}>();

const isConnected = ref(false);
const dialog = ref({
  incompatible: false,
  driverNotFound: false,
  scannerNotDetected: false,
});
const isButtonDisabled = ref(false);
const controller = ref(new AbortController());
const socket = ref<WebSocket>();
const scanner = ref<any>(null);

const start = async () => {
  try {
    toast.add({
      severity: 'info',
      detail: 'Connecting QR...',
      group: 'qrConnecting',
      life: 3000,
    });
    await stopScan(); // stop any scans before start another scan
    isButtonDisabled.value = true;
    if (!isWindows()) {
      dialog.value.incompatible = true;
      isButtonDisabled.value = false;
      return;
    }
    await connect();
    if (isConnected.value) {
      if (props.bulk) {
        bulkScan();
      } else {
        await scan();
      }
    }
  } catch (error) {
    isButtonDisabled.value = false;
  }
};

const connect = async () => {
  try {
    emit('connect');
    const devices = localStorage.getItem('devices');
    const { data } = await ScanAPIs.connect();
    if (devices && data) {
      const decoded = atob(devices);
      const parsed = JSON.parse(decoded);
      scanner.value = parsed?.selected?.qr;
      if (scanner.value) {
        isConnected.value = true;
        emit('connected', scanner.value);
      } else {
        dialog.value.scannerNotDetected = true;
        isButtonDisabled.value = false;
        isConnected.value = false;
      }
    } else {
      dialog.value.scannerNotDetected = true;
      isButtonDisabled.value = false;
      isConnected.value = false;
    }
  } catch (error: any) {
    if (error.response) {
      if (
        error.response.status === 500 &&
        (error.response.data['Error'] === 'Device is not connected' ||
          error.response.data['Error'] === 'There is no connected devices')
      ) {
        localStorage.removeItem('devices');
        dialog.value.scannerNotDetected = true;
      }
    } else {
      dialog.value.driverNotFound = true;
    }
    isButtonDisabled.value = false;
    isConnected.value = false;
  } finally {
    toast.removeGroup('qrConnecting');
  }
};

const isWindows = () => {
  const { userAgent } = navigator;
  return userAgent.includes('Windows');
};

const scan = async () => {
  try {
    controller.value = new AbortController();
    toast.add({
      severity: 'info',
      group: 'qrScanning',
      closable: false,
    });
    const { data } = await ScanAPIs.scanQr(
      controller.value.signal,
      scanner.value.serialNumber
    );
    if (data) {
      emit('update:modelValue', data.code);
    }
  } catch (error: any) {
    if (error?.response?.data?.Error === 'QR Code tidak dikenali') {
      emit('update:modelValue', 'error');
    }
    stop();
  } finally {
    stop();
  }
};

// currently doesn't provide bulk scan QR yet
const bulkScan = () => {
  toast.add({
    severity: 'info',
    group: 'qrScanning',
    closable: false,
  });
  socket.value = new WebSocket('wss://localhost:9002');
  socket.value.onopen = (event) => {
    socket.value?.send(`v1/qrbulkscan/${scanner.value.serialNumber}`);
  };
  socket.value.onmessage = (event) => {
    const { data } = event;
    if (data !== 'Scan is stopped' && data !== 'QR Code tidak dikenali') {
      emit('scan', data);
    }
  };
  socket.value.onclose = async (event) => {
    await stopScan();
  };
  socket.value.onerror = (error) => {
    // console.log('socket error', error);
  };
};

const closeSocketConnection = () => socket.value?.close();

const stopScan = async () => {
  try {
    await ScanAPIs.stopScan();
    toast.removeGroup('qrScanning');
    isButtonDisabled.value = false;
    controller.value.abort();
  } catch (error: any) {
    console.error(error.code);
  }
};

const stop = async () => {
  closeSocketConnection();
  await stopScan();
};

defineExpose({
  stop,
});
</script>

<template>
  <button
    type="button"
    class="p-button p-component p-button-icon-left"
    :class="btnClass"
    :style="btnStyle"
    :disabled="props.disabled || isButtonDisabled"
    :id="props.id || 'qrScanBtn'"
    @click="start"
  >
    <span class="p-button-icon p-button-icon-left ri-qr-code-line"></span>
    <span class="p-button-label">{{
      props.label ? props.label : 'Scan QR'
    }}</span>
    <!--
    <span
      class="custom-badge"
      :class="{ 'bg-success': isConnected, 'bg-danger': !isConnected }"
    ></span>
    -->
  </button>

  <ErrorDialog
    v-model:visible="dialog.incompatible"
    title="The detected OS is not compatible"
    description="Please check the OS compatibility list in our product information page"
  />

  <ErrorDialog
    v-model:visible="dialog.driverNotFound"
    title="Scanner driver not found"
    description="The scanner driver is either not installed or not running properly in your device. Please contact your administrator"
  />

  <ErrorDialog
    v-model:visible="dialog.scannerNotDetected"
    title="Scanner not detected"
    description="The scanner is either not detected or not identified in our system."
    select-scanner
  />

  <Toast position="bottom-right" group="qrConnecting" />
  <Toast position="bottom-right" group="qrScanning">
    <template #message>
      <div class="d-flex align-items-center justify-content-between col-12">
        <div class="d-flex gap-2 align-items-center">
          <span class=""><i class="pi pi-spin pi-spinner"></i></span>
          <div class=""><i class="ri-qr-code-line"></i>QR Scanning...</div>
        </div>
        <div class="d-flex gap-2 align-items-center">
          <div class="">do not leave this page</div>
          <Button severity="danger" label="Stop Scan" @click="stop()" />
        </div>
      </div>
    </template>
  </Toast>
</template>

<style lang="scss" scoped>
@import '~rfs/scss';

.custom-badge {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  @include margin-left(0.5rem);
}
</style>

<style>
.p-toast {
  z-index: 2000000 !important;
}
</style>
