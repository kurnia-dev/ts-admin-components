<script setup lang="ts">
import { onMounted, reactive } from 'vue';
import { useField } from 'vee-validate';
import { FieldValidation } from '@/types/fieldValidation.type';
import Textarea from 'primevue/textarea';

const props = defineProps<{
  modelValue?: string;
  label: string;
  fieldName?: string;
  mandatory?: boolean;
  useValidator?: boolean;
  validatorMessage?: string;
  placeholder?: string;
}>();

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

const setValidatorMessage = (value: string) => {
  if (!value) {
    return props.validatorMessage ?? props.label + ' must not be empty';
  } else if (value.length > 120) {
    return 'Max. 120 characters';
  }

  return true;
};
</script>
<template>
  <div class="field_wrapper">
    <label>
      {{ label }}
      <span class="text-danger" v-if="mandatory">*</span>
    </label>
    <Textarea
      v-model="field.value"
      @update:modelValue="$emit('update:modelValue', $event)"
      :placeholder="placeholder ?? `Input ${label.toLowerCase()}`"
      :class="[{ 'p-invalid': field.errorMessage }, 'w-100']"
      class="ts-textarea"
    />
    <small class="validator-message" id="dd-error" v-if="field.errorMessage">{{
      field.errorMessage
    }}</small>
  </div>
</template>
