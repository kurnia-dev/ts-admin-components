<script lang="ts" setup>
import { computed, ref, watch } from 'vue';
import ScanAPIs from '@/services/scanner.service';

const props = defineProps<{
  title: string;
  description: string;
  selectScanner?: boolean;
}>();

const dialog = ref();
const loading = ref(false);
const deviceList = ref<any[]>([]);
const form = ref<any>({
  rfid: undefined,
  qr: undefined,
});

const scanner = computed(() => {
  const none = { label: 'None', serialNumber: 0, API: 0 };
  return {
    rfid: deviceList.value.length
      ? deviceList.value
          .filter((device) => device.rfidScan)
          .map((device) => ({
            ...device,
            label: `${device.jenisDevice} - ${device.serialNumber}`,
          }))
      : [none],
    qr: deviceList.value.length
      ? deviceList.value
          .filter((device) => device.qrScan)
          .map((device) => ({
            ...device,
            label: `${device.jenisDevice} - ${device.serialNumber}`,
          }))
      : [none],
  };
});
const rfidScanners = computed(() => scanner.value.rfid);
const qrScanners = computed(() => scanner.value.qr);
const selectedRfid = computed(() => form.value.rfid);
const selectedQr = computed(() => form.value.qr);

const closeDialog = () => {
  dialog.value.close();
  deviceList.value = [];
};

const connectDevice = async () => {
  try {
    loading.value = true;
    const { data } = await ScanAPIs.connectDevice();
    if (data) {
      deviceList.value = data.deviceList;
    }
  } catch (error) {
    deviceList.value = [];
  } finally {
    loading.value = false;
    saveDevices();
  }
};

const saveDevices = () => {
  if (!deviceList.value.length) {
    return;
  }
  const devices = {
    selected: {
      rfid: selectedRfid.value,
      qr: selectedQr.value,
    },
    options: deviceList.value,
  };
  const encoded = btoa(JSON.stringify(devices));
  localStorage.setItem('devices', encoded);
};

watch(
  rfidScanners,
  (val) => {
    if (val) {
      const hasSelectedValue = val.some(
        (v) => v.serialNumber === form.value.rfid?.serialNumber
      );
      if (!hasSelectedValue) {
        form.value.rfid = val[0];
      }
    }
  },
  { deep: true, immediate: true }
);

watch(
  qrScanners,
  (val) => {
    if (val) {
      const hasSelectedValue = val.some(
        (v) => v.serialNumber === form.value.qr?.serialNumber
      );
      if (!hasSelectedValue) {
        form.value.qr = val[0];
      }
    }
  },
  { deep: true, immediate: true }
);

watch(
  selectedQr,
  () => {
    saveDevices();
  },
  { deep: true }
);

watch(
  selectedRfid,
  () => {
    saveDevices();
  },
  { deep: true }
);
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
    <div
      class="text-danger bg-danger-weak"
      style="padding: 10px; margin-bottom: 12px"
    >
      <span class="title">{{ props.title }}</span>
      <br />
      <div class="description">{{ props.description }}</div>
    </div>
    <div class="" v-if="props.selectScanner">
      <Button
        class="text-nowrap"
        icon="ri-refresh-line"
        label="Sync"
        outlined
        :loading="loading"
        :pt="{ label: { style: 'font-size: 11.2px' } }"
        style="margin-bottom: 12px"
        @click="connectDevice"
      />
      <div class="row">
        <div class="col-6 form-group">
          <label for="">RFID Scanner</label>
          <Dropdown
            v-model="form.rfid"
            :options="scanner.rfid"
            optionLabel="label"
            placeholder="Select a scanner"
          />
        </div>
        <div class="col-6 form-group">
          <label for="">QR Scanner</label>
          <Dropdown
            v-model="form.qr"
            :options="scanner.qr"
            optionLabel="label"
            placeholder="Select a scanner"
          />
        </div>
      </div>
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
