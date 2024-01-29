<script setup lang="ts">
import DropdownOptionUsageTest from './components/OptionSelectionField/OptionSelectionFieldUsageTest.vue';
import ImageCompressorUsageTest from '@/components/ImageCompressor/ImageCompressorUsageTest.vue';
import NameContainerUsageTest from '@/components/NameContainer/NameContainerUsageTest.vue';
import BreadcrumbUsageExample from './components/Breadcrumb/BreadcrumbUsageExample.vue';
import SelectGroupUsageTest from './components/SelectGroup/SelectGroupUsageTest.vue';
import TSButtonUsageExample from './components/TSButtons/TSButtonUsageExample.vue';
import TSCalendar from '@/components/Calendar/TSCalendar.vue';
import HelloWorld from './components/HelloWorld.vue';
import { onMounted, ref } from 'vue';
import ScanQR from './components/ScanQR/ScanQRButton.vue';
import ScanRFID from './components/ScanRFID/ScanRFIDButton.vue';
import Card from 'primevue/card';
import DataTableUsageExample from './components/TSDataTable/DataTableUsageExample.vue';
import TSConfirmDialogUsageExample from './components/TSConfirmDialog/TSConfirmDialogUsageExample.vue';
import { handleSuccess } from './utils/toast.util';
import Toast from 'primevue/toast';
const dateRange = ref<number[]>();

const menus = ref([
  {
    label: 'Stock',
    to: '/',
  },
  {
    label: 'Transaction History',
    to: '/reader/transaction-history',
  },
]);

onMounted(() => {
  handleSuccess({ activity: 'success' });
});
</script>

<template>
  <Toast position="bottom-right" />
  <div style="margin-bottom: 50px">
    <div>
      <a href="https://vitejs.dev" target="_blank">
        <img src="/vite.svg" class="logo" alt="Vite logo" />
      </a>
      <a href="https://vuejs.org/" target="_blank">
        <img src="./assets/vue.svg" class="logo vue" alt="Vue logo" />
      </a>
    </div>
    <HelloWorld msg="Component Testing and Preview" />
  </div>
  <BreadcrumbUsageExample />
  <Card>
    <template #content>
      <TabMenu :model="menus" :exact="false" />
      <DataTableUsageExample />
    </template>
  </Card>
  <Card>
    <template #content>
      <div class="d-flex flex-column gap-4" style="margin: 32px 0">
        <TSButtonUsageExample />
        <label>Confirm Dialog</label>
        <TSConfirmDialogUsageExample />
        <div class="row">
          <div class="col-3">
            <TSCalendar
              v-model="dateRange"
              label="Single Select"
              mode="range"
              mandatory
              @update:model-value="console.log($event)"
            />
          </div>
          <div class="col-3">
            <TSCalendar label="Range Select" />
          </div>
          <div class="col-6 d-flex gap-2">
            <ScanRFID disabled />
            <ScanRFID label-only label="Start Scan" @scan="console.log($event)" />
            <ScanQR disabled />
            <ScanQR label-only label="Start Scan" />
          </div>
        </div>
        <ImageCompressorUsageTest />
        <DropdownOptionUsageTest />
        <h2>Select Group</h2>
        <SelectGroupUsageTest />

        <h2>Name Container</h2>
        <NameContainerUsageTest />
      </div>
    </template>
  </Card>
  <Toast position="top-right" />
</template>
<style>
@import '~primevue/resources/themes/lara-light-blue/theme.css';
</style>
<style lang="scss">
@import 'scss/index';
.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}
.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}
.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}

*:focus {
  box-shadow: none !important;
}

::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}

::-webkit-scrollbar-thumb {
  background-color: #d9d9d9;
  border-radius: 20px;
}

.p-dialog .p-dialog-header,
.p-dialog .p-dialog-content {
  padding-bottom: 0.75rem !important;
}

.p-dialog .p-dialog-footer {
  display: flex;
  justify-content: end;
  gap: 8px;

  button {
    margin: 0 !important;
  }
}

.p-tabmenu .p-tabmenu-nav .p-tabmenuitem .p-menuitem-link {
  @include padding(11.2px 8px !important);
  border-width: 0 0 2px 0 !important;
  text-decoration: none;
  height: 35.4px;

  .p-menuitem-text {
    @include font-size(11.2px);
    font-weight: 500;
    color: $general-placeholder;
    width: max-content;
  }
}

.p-tabmenu-nav .p-tabmenuitem .p-menuitem-link:not(.p-disabled):focus {
  box-shadow: none;
}

.p-tabmenu .p-tabmenu-nav,
.p-tabmenuitem .p-menuitem-link {
  height: 35.4px;
  border-width: 0 0 2px 0 !important;
  color: $general-placeholder;
}

.p-tabmenuitem.p-highlight .p-menuitem-text {
  color: $primary !important;
}

.row {
  gap: 1rem !important;
}

.row > * {
  padding: 0;
}

.field_wrapper {
  display: flex;
  flex-direction: column;
  gap: 4px;
  align-items: start;
  justify-content: start;
  position: relative;

  .input_wrapper {
    width: 100%;
    position: relative;
  }

  label {
    color: $dark;
    text-transform: capitalize;

    font-size: 11.2px;
    font-style: normal;
    font-weight: 500;
    line-height: 16.8px;
  }

  .text-left {
    text-align: left;
  }
}

.validator-message {
  color: $danger;
  font-weight: 300;
  width: 100%;
  text-align: right;
  position: absolute;
  top: calc(100% + 4px);
  left: 50%;
  transform: translateX(-50%);
  @include font-size(11.2px);
}

.ts-rfid-button,
.ts-qr-button {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  @include padding(7.6px 12px !important);
  gap: 4px;

  background-color: $primary-bg;
  color: $primary-color;
  border-radius: 4px;

  @include font-size(9px !important);
  @include rfs(10.8px !important, line-height);

  font-weight: 500;

  .ts-button-icon {
    @include font-size(8px);
    width: 9px;
    height: 9px;
  }

  .indicator {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    border: 0.5px solid white;
    position: absolute;
    left: 2px;
    top: 2px;
  }

  &:disabled {
    background: $general-grey;
    pointer-events: none;
  }
}

.ts-button {
  all: unset;
  box-sizing: border-box;
  position: relative;
  overflow: hidden;
  display: flex;
  width: max-content !important;
  @include padding(6.5px 12px);
  justify-content: center;
  align-items: center;
  border-radius: 4px;
  gap: 4px;

  color: $general-bg-white;
  text-align: center;

  @include font-size(11.2px);
  @include rfs(11.4px, line-height);
  font-style: normal;
  font-weight: 500;
  white-space: nowrap;
  transition: 0.1s all ease;
  height: 26px;
}

.ts-button-success {
  background: $success;
}

.ts-button-primary {
  background: $primary;
}

.ts-button-danger {
  background: $danger;
}

.ts-button.outlined {
  border: 1px solid;
  background: transparent !important;
}

.ts-button-success.outlined,
.ts-button-success.text-only {
  color: $success !important;
}

.ts-button-primary.outlined,
.ts-button-primary.text-only {
  color: $primary !important;
}

.ts-button-danger.outlined,
.ts-button-danger.text-only {
  color: $danger !important;
}

.ts-button.text-only {
  background: transparent !important;
  border: none !important;
}

.ts-button.button-default {
  color: $general-header-weak !important;
  background: transparent;
}

.ts-button.icon-only {
  width: 26px !important;
  height: 26px !important;
}

.ts-button.icon-right {
  flex-direction: row-reverse;
}

.ts-button.button-default.icon-only {
  border: 1px solid $general-body;
  color: $general-label !important;
}

.ts-button:hover {
  background: $primary-strong !important;
}

.ts-button-success:hover {
  background: $success-strong !important;
}

.ts-button-danger:hover {
  background: $danger-strong !important;
}

.ts-button-success.outlined:hover,
.ts-button-success.text-only:hover {
  background: $success-weak !important;
}

.ts-button-primary.outlined:hover,
.ts-button-primary.text-only:hover {
  background: $primary-weak !important;
}

.ts-button-danger.outlined:hover,
.ts-button-danger.text-only:hover {
  background: $danger-weak !important;
}

.ts-button.button-default:hover {
  background: $dark-thin !important;
}

.ts-button-filter.ts-button.ts-button-secondary {
  background: $general-label !important;
  color: $general-bg-white !important;
  border: none;
  transition: 0.1s;
}

.ts-button-filter.ts-button.ts-button-secondary:hover {
  background: $general-label-hover;
}

.ts-button-filter.ts-button.ts-button-secondary.outlined,
.ts-button.ts-button-secondary.outlined {
  background: $general-bg-white !important;
  color: $general-label !important;
  border: 1px solid $general-body;
}

.ts-button-filter.ts-button.ts-button-secondary.outlined:hover,
.ts-button.ts-button-secondary.outlined:hover {
  background: $dark-thin !important;
}

span.ripple {
  position: absolute;
  border-radius: 50%;
  transform: scale(0);
  animation: ripple 0.25s linear;
  background-color: rgba(255, 255, 255, 0.363);
}

@keyframes ripple {
  to {
    transform: scale(2);
    opacity: 0;
  }
}

.p-card {
  background: $general-bg-white !important;
  box-shadow: none !important;

  .p-card-body {
    @include padding(12px 24px);
    border-radius: 8px;
  }

  .p-card-content {
    padding: 0 !important;
    display: flex;
    flex-direction: column;
    gap: 10px;
  }
}

.p-inputtext {
  color: $general-body !important;
  border-radius: 4px !important;
}

.ts-inputtext,
.ts-textarea {
  color: $general-body !important;
  border-radius: 4px;
  border: 1px solid !important;
  background: $general-bg-white;
}

.ts-inputtext.p-inputtext.p-component::placeholder {
  color: $general-placeholder !important;
  font-size: 0.7rem;
  font-style: normal;
  font-weight: 300;
  opacity: 1;
}

.ts-textarea {
  height: unset;
  min-height: 70px;
  @include rfs(8px 12px, padding);
}

.p-checkbox .p-checkbox-box {
  width: 12.8px !important;
  height: 12.8px !important;
  border-radius: 4px !important;
  border: 2px solid $general-line !important;
  background: $general-bg-white !important;
}

.p-checkbox:not(.p-checkbox-disabled) .p-checkbox-box.p-focus {
  box-shadow: 0 0 0 1px $primary-weak !important;
}

.p-checkbox .p-checkbox-box.p-highlight {
  border: none !important;
  background: $primary !important;

  .p-checkbox-icon {
    transition: 0.1s;
    color: $general-bg-white;
    width: 10px !important;
    height: 10px !important;
    position: absolute;
    top: 48%;
    transform: translate(0, -50%);
  }
}

.p-multiselect-filter,
.p-dropdown-filter {
  border-radius: 6px;
  border: 1px solid $general-body !important;
  background: $general-bg-white;
  height: 32px !important;

  .p-multiselect-filter-icon,
  .p-dropdown-filter-icon {
    width: 12px !important;
    height: 12px !important;
    top: 50% !important;
    margin-top: 0 !important;
    font-size: 12px;
    transform: translateY(-50%);
  }
}

.p-dialog {
  height: max-content !important;
  max-height: 90vh !important;
}
</style>
