<script setup lang="ts">
import { onMounted, reactive } from 'vue';
import { useField } from 'vee-validate';
import { FieldValidation } from '@/types/fieldValidation.type';

const props = withDefaults(
  defineProps<{
    modelValue?: string;
    label: string;
    fieldName?: string;
    mandatory?: boolean;
    useValidator?: boolean;
    validatorMessage?: string;
    placeholder?: string;
    type?: 'email' | 'text';
  }>(),
  {
    type: 'text',
  }
);

defineEmits<{
  'update:modelValue': [value?: string];
}>();

const field = reactive<FieldValidation>({});

onMounted(() => {
  if (props.useValidator) {
    Object.assign(
      field,
      useField(props.fieldName ?? '', (value: string) => {
        if (props.mandatory) return setValidatorMessage(value);
        else return true;
      })
    );
  }
});

const setValidatorMessage = (value: string): boolean | string => {
  if (!value) {
    return props.validatorMessage ?? `${props.label} must not be empty!`;
  } else if (value.length > 30) {
    return 'Max. 30 characters!';
  } else if (props.type === 'email') {
    const emailRegexp = /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/;
    return emailRegexp.test(value) ? true : 'Email format is incorrect!';
  } else {
    return true;
  }
};
</script>
<template>
  <div class="field_wrapper">
    <label>
      {{ label }}
      <span class="text-danger" v-if="mandatory">*</span>
    </label>
    <div class="input_wrapper">
      <InputText
        v-model="field.value"
        @update:modelValue="$emit('update:modelValue', $event)"
        :placeholder="placeholder ?? `Input ${label.toLowerCase()}`"
        :class="[{ 'p-invalid': field.errorMessage }, 'w-100']"
        class="ts-inputtext"
      />
      <small class="validator-message" id="dd-error" v-if="field.errorMessage">{{
        field.errorMessage
      }}</small>
    </div>
  </div>
</template>
