<script setup lang="ts">
import { onMounted, reactive, ref, watch } from 'vue';
import { useField } from 'vee-validate';
import { formatVowelSoundLabel } from '@/utils/textFormater.util';
import { FieldValidation } from '@/types/fieldValidation.type';
import ValidatorMessage from '../Input/InputValidatorMessage.vue';

interface TSCalendarProps {
  /**
   * TSCalendar modelValue is date timestamp: 1706423635731
   */
  modelValue?: number | number[];
  /**
   * Display label on top of Date Input.
   */
  label?: string;
  /**
   * Whether single date or date range model value.
   */
  mode?: 'range' | 'single';
  /**
   * Enable Validator using vee-validate. Combine with TSForm that handle form validation.
   */
  useValidator?: boolean;
  /**
   * When used as field in From Validation using TSForm,
   * specify the unique field name, match with your needs for API request.
   */
  fieldName?: string;
  /**
   * Whether this field should be filled or not.
   */
  mandatory?: boolean;
  /**
   * Set the custom validator message.
   * By default each field has preserved with its validator message, you don't need to worrying about the message.
   */
  validatorMessage?: string;
}

const props = defineProps<TSCalendarProps>();

const emit = defineEmits<{
  'update:modelValue': [date: number | number[]];
}>();

onMounted(() => {
  setValidator();
});

const field = reactive<FieldValidation>({});

const date = ref<string | string[]>();

watch(
  () => props.modelValue,
  () => {
    date.value = parseDateFromProps();
  }
);

onMounted(() => {
  date.value = parseDateFromProps();
})

const getGMTTime = (dateString: string): number => {
  return new Date(new Date(dateString).toUTCString()).getTime();
};

const getLocalTime = (timeStamp?: number): string => {
  if (timeStamp) {
    return new Date(timeStamp).toLocaleDateString();
  }

  return '';
};

const parseDateFromProps = (): string | string[] => {
  if (!Array.isArray(props.modelValue)) return getLocalTime(props.modelValue);
  return props.modelValue.map((timeStamp) => getLocalTime(timeStamp)).join('-');
};

const parseDate = (dateToParse: string | string[]): number | number[] => {
  if (!Array.isArray(dateToParse)) return getGMTTime(dateToParse);

  return [
    getGMTTime(dateToParse[0]),
    getGMTTime(dateToParse[1] ?? dateToParse[0]),
  ];
};

const setClass = (): void => {
  const highlights = document.querySelectorAll(
    '.p-datepicker span.p-highlight'
  );
  highlights[0]?.classList.add('first-and-last');
  highlights[highlights.length - 1]?.classList.add('first-and-last');
};

const setValidator = (): void => {
  if (props.useValidator) {
    Object.assign(
      field,
      useField(props.fieldName ?? '', (value: string) => {
        if (props.mandatory) return setValidatorMessage(value);
        return true;
      })
    );

    field.value = props.modelValue;
  }
};

const setValidatorMessage = (value: string): boolean | string => {
  if (!value) {
    return (
      props.validatorMessage ??
      `Please pick ${formatVowelSoundLabel(props.label)} date!`
    );
  }

  return true;
};
</script>

<template>
  <div class="field_wrapper">
    <label v-if="label" data-test="label">
      {{ label }}
      <span v-if="mandatory" class="text-danger" data-test="mandatory">*</span>
    </label>
    <div class="input_wrapper">
      <Calendar
        v-model="date"
        :pt="{
          root: { class: 'ts-calendar' },
          panel: { class: 'ts-datepicker' },
          input: { class: 'ts-dateinput' },
        }"
        :selection-mode="mode ?? 'single'"
        @show="setClass"
        @update:model-value="(field.value = parseDate($event)), setClass()"
        hide-on-range-selection
        icon-display="input"
        placeholder="Select date"
        show-icon
      />
      <ValidatorMessage
        v-show="field.errorMessage"
        :message="field.errorMessage"
        data-test="ts-calendar-validator-message"
      />
    </div>
  </div>
</template>
<style lang="scss">
@import 'scss/var';
@import '~rfs/scss';

.ts-calendar {
  border-radius: 4px;
  border: 1px solid $general-body;
  width: 100%;
  max-height: 26px;
  display: flex;
  padding: 4px 12px;
  align-items: center;
  align-self: stretch;
  gap: 5px;
  background: $general-bg-white;

  .p-inputtext {
    border: none;
    height: auto !important;
    background: none !important;
    padding: 0 !important;
  }

  .p-datepicker-trigger {
    width: 20px !important;
    height: 20px !important;

    .p-icon {
      width: 14px;
      height: 14px;
      flex-shrink: 0;
    }
  }

  .p-inputtext:enabled:hover {
    outline: none;
    border-color: none;
  }

  .p-button.p-datepicker-trigger,
  .p-button.p-datepicker-trigger:hover {
    background: none;
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
  max-width: 272px;
  min-width: unset !important;

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
      font-style: normal;
      font-weight: 500;
      line-height: normal;
      text-transform: capitalize;

      button.p-link {
        padding: 0;
        margin-right: 0;
      }

      > * {
        @include font-size(12px !important);
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

    tbody tr td:hover:active span:not(.p-disabled),
    .p-datepicker-prev:hover,
    .p-datepicker-next:hover,
    .p-datepicker-today span {
      background: $primary-bg-strong;
    }

    tbody tr td:hover:active span.first-and-last,
    tbody tr td span.first-and-last {
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

  .p-monthpicker-month,
  .p-yearpicker-year {
    @include font-size(12px !important);
  }
}
</style>
