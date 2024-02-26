<script setup lang="ts">
import { onMounted, reactive, watch } from 'vue';
import { useField } from 'vee-validate';
import InputNumber, { InputNumberInputEvent } from 'primevue/inputnumber';
import { FieldValidation } from '@/types/fieldValidation.type';
import { Nullable } from 'primevue/ts-helpers';
import ValidatorMessage from '@/components/Input/InputValidatorMessage.vue';

const props = defineProps<{
  modelValue?: number;
  initialValue?: number;
  label?: string;
  addonLabel?: string;
  max?: number;
  fieldName?: string;
  mandatory?: boolean;
  useValidator?: boolean;
  validatorMessage?: string;
  placeholder?: string;
  size?: 'small' | 'normal' | 'full';
  showButtons?: boolean;
  mode?: 'decimal' | 'currency';
  useGrouping?: boolean;
}>();

const emit = defineEmits<{
  'update:modelValue': [value?: number];
}>();

const field = reactive<FieldValidation>({});

onMounted(() => {
  if (props.useValidator) {
    Object.assign(
      field,
      useField(props.fieldName ?? '', (value: Nullable<number>) => {
        return setValidatorMessage(value);
      })
    );

    field.value = props.initialValue;
  }
});

const setValidatorMessage = (value: Nullable<number>) => {
  if (!value && props.mandatory) {
    return props.validatorMessage ?? 'Must not be empty!';
  } else if (props.max && value && value > props.max) {
    return `Exceed ${props.label} stock!`;
  } else {
    return true;
  }
};

const onInput = (e: InputNumberInputEvent) => {
  const value = e.value as number | undefined;
  emit('update:modelValue', value);
  field.value = value;
};

watch(
  () => props.initialValue,
  (value) => {
    field.value = value;
  }
);
</script>
<template>
  <div class="field_wrapper">
    <label>
      {{ label }}
      <span class="text-danger" v-if="mandatory">*</span>
    </label>
    <div
      :class="[
        'input_wrapper d-flex',
        { 'input-addon-wrapper': props.addonLabel },
      ]"
    >
      <InputNumber
        :model-value="field.value"
        @input="onInput"
        :showButtons="showButtons"
        :placeholder="placeholder"
        :min="undefined"
        :class="['ts-inputnumber', { full: props.size === 'full' }]"
        :pt="{
          input: { class: props.size ?? 'small' },
        }"
        inputId="minmax-buttons"
        :mode="props.mode"
        :useGrouping="props.useGrouping"
      />
      <span v-if="props.addonLabel" class="p-inputgroup-addon">{{
        addonLabel
      }}</span>
      <ValidatorMessage
        v-show="field.errorMessage"
        :message="field.errorMessage ?? ''"
      />
    </div>
  </div>
</template>
<style lang="scss">
@import 'scss/var';

.ts-inputnumber {
  border: 1px solid $general-body;
  border-radius: 4px;
  height: 26px;

  .p-inputnumber-input {
    border: none;
    padding: 6.4px;
    height: 100% !important;
    width: 100% !important;
  }

  .p-inputnumber-button-group {
    border: none;

    .p-button.p-button-icon-only {
      padding: 0;
      width: max-content;
      height: max-content;
      background: none;
      border: none;

      .p-icon {
        color: $general-label;
        width: 20px;
        height: 15px;
      }
    }

    .p-inputnumber-button-up {
      align-items: flex-start;
    }

    .p-inputnumber-button-down {
      align-items: flex-end;
    }
  }
}

.input-addon-wrapper {
  .ts-inputnumber {
    border-radius: 4px 0 0 4px;
  }
  .p-inputgroup-addon {
    border: 1px solid $general-body;
    border-left: 0px;
    border-radius: 0 4px 4px 0;
    color: $general-body;
    height: 26px;
    width: max-content;
    font-size: 11.2px;
    font-weight: 500;
    line-height: 16.8px;
    letter-spacing: 2%;
  }
}

.small {
  width: 26px;
}

.normal {
  width: 100px;
}

.full {
  width: 100%;
}
</style>
