<script setup lang="ts">
import { ref } from 'vue';

const date = ref<string>();

defineProps<{
  modelValue?: string;
  label?: string;
  mandatory?: boolean;
  mode?: 'range' | 'single';
}>();

const setClass = () => {
  const hls = document.querySelectorAll('.p-datepicker span.p-highlight');
  hls[0]?.classList.add('first-and-last');
  hls[hls.length - 1]?.classList.add('first-and-last');
};
</script>

<template>
  <div class="field_wrapper">
    <label v-if="label">
      {{ label }}
      <span class="text-danger" v-if="mandatory">*</span>
    </label>
    <Calendar
      v-model="date"
      showIcon
      iconDisplay="input"
      :selection-mode="mode ?? 'single'"
      hide-on-range-selection
      placeholder="Select date" 
      @update:modelValue="setClass"
      @show="setClass"
      :pt="{ root: { class: 'ts-calendar' }, panel: { class: 'ts-datepicker' }}"
    />
  </div>
</template>
<style lang="scss">
@import 'scss/var';
@import '~rfs/scss';

.ts-calendar {
  border-radius: 4px;
  border: 1px solid $general-body;

  .p-inputtext {
    border: none;
  }
  
  .p-inputtext:enabled:hover {
    outline: none;
    border-color: none;
  }

  .p-button.p-datepicker-trigger,
  .p-button.p-datepicker-trigger:hover {
      background: white;
    border: none;
    color: $general-label;
  }
}

.p-calendar-w-btn:hover {
  border-color: $primary;
}

.p-datepicker.ts-datepicker {
  padding: 24px;
  width: auto;

  .p-datepicker-header {
    border: none;
    padding: 0;
    height: 26.8px;

    .p-link .p-icon {
      width: 0.9rem;
      height: 0.9rem;
    }

    .p-datepicker-prev,
    .p-datepicker-next {
      width: 1.5rem;
      height: 1.5rem;
    }

    .p-datepicker-prev:hover,
    .p-datepicker-next:hover {
      background: $primary-bg-strong !important;
    }

    .p-datepicker-title {
      display: flex;
      gap: 12px;
      color: $general-header-weak;
      @include font-size(12px);
      font-style: normal;
      font-weight: 500;
      line-height: normal;
      text-transform: capitalize;

      button.p-link {
        padding: 0;
        margin-right: 0;
      }
    }
  }

  .p-datepicker-calendar {
    margin-bottom: 0;

    th,
    td {
      padding: 0;
      text-align: center;
    }

    thead tr th span,
    tbody tr td span:not(.p-disabled) {
      color: $general-header-weak;
      font-style: normal;
      font-weight: 500;
      line-height: normal;
      text-transform: capitalize;
    }

    thead tr th span,
    tbody tr td span {
      display: flex;
      justify-content: center;
      align-items: center;
      @include font-size(12px);
      width: 32px;
      height: 26.8px;
      border-radius: 5px;
      margin: 0;
    }

    tbody tr td:hover span:not(.p-disabled),
    .p-datepicker-prev:hover,
    .p-datepicker-next:hover,
    .p-datepicker-today span {
      background: $primary-bg-strong;
    }

    tbody tr td:hover span.first-and-last,
    tbody tr td span.first-and-last{
      color: white;
      background: $primary;
    }

    tbody tr td:hover span.first-and-last {
      opacity: 0.95;
    }

    .p-highlight:not(.first-and-last) {
      border-radius: 0;
    }
  }

  .p-yearpicker .p-yearpicker-year:hover,
  .p-monthpicker .p-monthpicker-month:hover {
    background: $primary-bg-strong !important;
  }
}
</style>
