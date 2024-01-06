<script setup lang="ts">
import { onMounted, reactive, watch } from 'vue';
import { useField } from 'vee-validate';
import InputNumber from 'primevue/inputnumber';
import { FieldValidation } from '@/types/fieldValidation.type';
import { Nullable } from 'primevue/ts-helpers';
import ValidatorMessage from '@/components/Input/InputValidatorMessage.vue';

const props = defineProps<{
  modelValue?: number;
  initialValue?: number;
  label?: string;
  max?: number;
  fieldName?: string;
  mandatory?: boolean;
  useValidator?: boolean;
  validatorMessage?: string;
  placeholder?: string;
  size?: 'small' | 'normal' | 'full';
}>();

defineEmits<{
  'update:modelValue': [value?: number];
}>();

const field = reactive<FieldValidation>({});

onMounted(() => {
  if (props.useValidator) {
    Object.assign(
      field,
      useField(props.fieldName ?? '', (value: Nullable<number>) => {
        if (props.mandatory) return setValidatorMessage(value);
        else return true;
      })
    );
  }
  field.value = props.initialValue ?? 0;
});

const setValidatorMessage = (value: Nullable<number>) => {
  if (!value) {
    return props.validatorMessage ?? 'Must not be empty!';
  } else if (props.max && value > props.max) {
    return `Exceed ${props.label} stock!`;
  } else {
    return true;
  }
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
    <InputNumber
      v-model="field.value"
      @update:modelValue="$emit('update:modelValue', $event)"
      inputId="minmax-buttons"
      mode="decimal"
      showButtons
      :min="0"
      :class="['ts-inputnumber', { full: props.size === 'full' }]"
      :pt="{
        input: { class: props.size ?? 'small' },
      }"
    />
    <ValidatorMessage
      v-show="field.errorMessage"
      :message="field.errorMessage ?? ''"
    />
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
</style>
