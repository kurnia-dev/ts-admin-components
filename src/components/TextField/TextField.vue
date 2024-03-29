<script setup lang="ts">
import { onMounted, reactive } from 'vue';
import { useField } from 'vee-validate';
import { FieldValidation } from '@/types/fieldValidation.type';

interface InputTextProps {
  modelValue?: string;
  label?: string;
  maxLength?: number;
  fieldName?: string;
  mandatory?: boolean;
  useValidator?: boolean;
  validatorMessage?: string;
  placeholder?: string;
  type?: 'email' | 'text';
  disabled?: boolean;
  invalid?: boolean;
  tooltip?: string;
}

const props = withDefaults(defineProps<InputTextProps>(), {
  maxLength: 30,
  fieldName: 'inputText',
});

defineEmits<{
  'update:modelValue': [value?: string];
  'input': [value?: string];
}>();

const field = reactive<FieldValidation>({ value: props.modelValue });

onMounted(() => {
  if (props.useValidator) {
    Object.assign(
      field,
      useField(props.fieldName, (value: string) => {
        return setValidatorMessage(value);
      })
    );
  }
});

const setValidatorMessage = (value: string): boolean | string => {
  if (!value && props.mandatory) {
    return props.validatorMessage ?? `${props.label} must not be empty!`;
  } else if (value && value.length > props.maxLength) {
    return `Max. ${props.maxLength} characters!`;
  } else if (props.type === 'email') {
    const emailRegexp = /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/;
    return emailRegexp.test(value) ? true : 'Email format is incorrect!';
  } else if (props.validatorMessage) {
    return props.validatorMessage;
  }

  return true;
};
</script>
<template>
  <div class="field_wrapper">
    <label class="input_label">
      {{ label }}
      <span v-if="mandatory" class="text-danger">*</span>
      <i
        v-if="tooltip"
        v-tooltip="tooltip"
        class="pi pi-info-circle info-tooltip"
      />
    </label>
    <div class="input_wrapper">
      <InputText
        v-model="field.value"
        :class="[{ 'p-invalid': field.errorMessage || props.invalid }, 'w-100']"
        :disabled="disabled"
        :placeholder="
          placeholder ?? `Input ${label ? label.toLowerCase() : 'text'}`
        "
        @update:model-value="$emit('update:modelValue', $event)"
        @input="$emit('input', ($event.target as HTMLInputElement).value)"
        class="ts-inputtext"
      />
      <small id="dd-error" v-if="field.errorMessage" class="validator-message">
        {{ field.errorMessage }}
      </small>
    </div>
  </div>
</template>
<style lang="scss">
@import 'scss/var';

.p-inputtext:disabled {
  background-color: $general-input;
  border-color: $general-body;
}

.input_label {
  position: relative;
}

.info-tooltip {
  right: -4px;
  top: -4px;
  position: relative;
  color: $primary !important;
  font-size: 10px !important;
  &:hover {
    cursor: pointer;
  }
}
</style>
