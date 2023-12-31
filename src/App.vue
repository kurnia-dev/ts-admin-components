<script setup lang="ts">
import DropdownOptionUsageTest from './components/OptionSelectionField/OptionSelectionFieldUsageTest.vue';
import ImageCompressorUsageTest from '@/components/ImageCompressor/ImageCompressorUsageTest.vue';
import NameContainerUsageTest from '@/components/NameContainer/NameContainerUsageTest.vue';
import BreadcrumbUsageExample from './components/Breadcrumb/BreadcrumbUsageExample.vue';
import SelectGroupUsageTest from './components/SelectGroup/SelectGroupUsageTest.vue';
import TSButtonUsageExample from './components/TSButtons/TSButtonUsageExample.vue';
import TSCalendar from '@/components/Calendar/TSCalendar.vue';
import HelloWorld from './components/HelloWorld.vue';
import { ref } from 'vue';
import { ScanQR, ScanRFID } from './components';
import Card from 'primevue/card';
import DynamicTableUsageExample from './components/DynamicTable/DynamicTableUsageExample.vue';

const dateStringified = ref<string>();
</script>

<template>
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
  <Card style="width: 80vw">
    <template #content>
      <DynamicTableUsageExample />
    </template>
  </Card>

  <div class="d-flex flex-column gap-4" style="margin: 32px 0">
    <TSButtonUsageExample />
    <div class="row">
      <div class="col-3">
        <TSCalendar
          v-model="dateStringified"
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
        <ScanRFID />
        <ScanRFID label-only label="Start Scan" />
        <ScanQR />
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

  label {
    color: $dark;
    text-transform: capitalize;

    font-size: 11.2px;
    font-style: normal;
    font-weight: 500;
    line-height: 16.8px;
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

  .text-left {
    text-align: left;
  }
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
}

.ts-button {
  all: unset;
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
  transition: 0.1s all ease;
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
  background: $general-bg-white !important;
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
  background: $general-bg-white !important;
  border: none !important;
}

.ts-button.button-default {
  color: $general-header-weak !important;
  background: $general-bg-white;
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
</style>
