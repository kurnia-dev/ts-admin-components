<script setup lang="ts">
import DropdownOptionUsageTest from './components/OptionSelectionField/OptionSelectionFieldUsageTest.vue';
import SelectGroupUsageTest from './components/SelectGroup/SelectGroupUsageTest.vue';
import NameContainerUsageTest from '@/components/NameContainer/NameContainerUsageTest.vue';
import ImageCompressorUsageTest from '@/components/ImageCompressor/ImageCompressorUsageTest.vue';
import HelloWorld from './components/HelloWorld.vue';
import TSCalendar from '@/components/Calendar/TSCalendar.vue';
import BreadcrumbUsageExample from './components/Breadcrumb/BreadcrumbUsageExample.vue';
import { ref } from 'vue';
import { ScanQR, ScanRFID } from './components';

const dateStringified = ref<string>();
</script>

<template>
  <BreadcrumbUsageExample />
  <div>
    <a href="https://vitejs.dev" target="_blank">
      <img src="/vite.svg" class="logo" alt="Vite logo" />
    </a>
    <a href="https://vuejs.org/" target="_blank">
      <img src="./assets/vue.svg" class="logo vue" alt="Vue logo" />
    </a>
  </div>
  <div class="d-flex flex-column gap-4 mb-10">
    <HelloWorld msg="Component Testing and Preview" />
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
  height: 26px;
  @include padding(7.6px 12px);
  gap: 4px;

  background-color: $primary-bg;
  color: $primary-color;
  border-radius: 4px;

  .ts-button-icon {
    @include font-size(8px);
    width: max-content;
    height: max-content;
  }

  .ts-button-label {
    @include font-size(9px);
    font-weight: 500;
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
</style>
./components/OptionSelectionField/DropdownOptionUsageTest.vue
