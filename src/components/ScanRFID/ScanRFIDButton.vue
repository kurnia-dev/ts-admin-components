<script lang="ts" setup>
import { onUnmounted, ref } from 'vue';
import { useToast } from 'primevue/usetoast';
import Toast from 'primevue/toast';
import ScanAPIs from '@/services/scanner.service';
import ErrorDialog from './ScanRFIDErrorDialog.vue';
import { faker } from '@faker-js/faker';

const toast = useToast();

onUnmounted(async () => {
  await stop();
});

interface ScanRFIDPProps {
  /**
   * The value of the input (RFID tag).
   */
  modelValue?: string;
  /**
   *  The label of the input.
   */
  label?: string;
  /**
   *  Whether the scanner is in bulk mode.
   */
  bulk?: boolean;
  /**
   *  The id of the button element.
   */
  id?: string;
  /**
   *  Whether the scanner is a powerbank.
   */
  powerbank?: boolean;
  /**
   * Wether the button should be disabled.
   */
  disabled?: boolean;
  /**
   * A string template classes to be atched on button element.
   */
  btnClass?: string;
  /**
   * A string template styles to be atched on button element.
   */
  btnStyle?: string;
  /**
   * Display the label only (wihout icon).
   */
  labelOnly?: boolean;
}

const props = defineProps<ScanRFIDPProps>();

const emit = defineEmits<{
  (e: 'update:modelValue', rfid: string): void;
  (e: 'connect', data?: any): void;
  (e: 'connected', data?: any): void;
  (e: 'scan', rfid: string): void;
  (e: 'stop'): void;
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

const onBeforeStartScan = () => {
  if (window.Cypress) {
    startScanForTest();
  } else {
    start()
  }
};

const startScanForTest = () => {
  toast.add({
    severity: 'info',
    detail: 'Connecting RFID...',
    group: 'rfidConnecting',
    life: 3000,
  });

  setTimeout(() => {
    emit('connect');
    toast.add({
      severity: 'info',
      group: 'rfidScanning',
      closable: false,
    });
    emit('connected', faker.string.uuid());
    console.log('bulk mode:', props.bulk);

    if (props.bulk) {
      emit('scan', faker.string.uuid());
    } else {
      emit('update:modelValue', faker.string.uuid());
      stopScan();
    }
  }, 3000);
};

const start = async () => {
  try {
    toast.add({
      severity: 'info',
      detail: 'Connecting RFID...',
      group: 'rfidConnecting',
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
      scanner.value = parsed?.selected?.rfid;
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
    toast.removeGroup('rfidConnecting');
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
      group: 'rfidScanning',
      closable: false,
    });
    const { data } = await ScanAPIs.scan(
      controller.value.signal,
      scanner.value.serialNumber,
      scanner.value.API
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

const bulkScan = () => {
  toast.add({
    severity: 'info',
    group: 'rfidScanning',
    closable: false,
  });
  socket.value = new WebSocket('wss://localhost:9002');
  socket.value.onopen = (event) => {
    socket.value?.send(
      `${scanner.value.API}/bulkscan/${scanner.value.serialNumber}`
    );
  };
  socket.value.onmessage = (event) => {
    const { data } = event;
    if (data !== 'Scan is stopped') {
      emit('scan', data);
    }
  };
  socket.value.onclose = async (event) => {
    await stopScan();
  };
  socket.value.onerror = (error) => {
    console.log('socket error', error);
  };
};

const closeSocketConnection = () => socket.value?.close();

const stopScan = async () => {
  try {
    if (!window.Cypress) {
      await ScanAPIs.stopScan();
      controller.value.abort();
    }

    isButtonDisabled.value = false;
    toast.removeGroup('rfidScanning');
    emit('stop');
  } catch (error: any) {
    console.error(error.code, error);
  }
};

const stop = async () => {
  console.log('Stop Scann Called')
  closeSocketConnection();
  await stopScan();
};

defineExpose({
  stop,
});
</script>

<template>
  <button
    :class="btnClass"
    :style="btnStyle"
    :disabled="props.disabled || isButtonDisabled"
    :id="props.id || 'rfidScanBtn'"
    @click="onBeforeStartScan"
    class="ts-button ts-rfid-button ts-button-primary"
    type="button"
  >
    <i v-if="!labelOnly" class="ts-button-icon ri-rfid-line" />
    {{ props.label ?? 'Scan RFID' }}

    <i
      class="indicator"
      :class="{ 'bg-success': isConnected, 'bg-danger': !isConnected }"
    ></i>
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

  <Toast position="bottom-right" group="rfidConnecting" />
  <Toast position="bottom-right" group="rfidScanning">
    <template #message>
      <div class="d-flex align-items-center justify-content-between col-12">
        <div class="d-flex gap-2 align-items-center">
          <span class=""><i class="pi pi-spin pi-spinner"></i></span>
          <div class=""><i class="ri-rfid-line"></i>RFID Scanning...</div>
        </div>
        <div class="d-flex gap-2 align-items-center">
          <div class="">do not leave this page</div>
          <Button severity="danger" label="Stop Scan" @click="stop()" />
        </div>
      </div>
    </template>
  </Toast>
</template>

<style>
.p-toast {
  z-index: 2000000 !important;
}
</style>
