<script setup lang="ts">
import TextField from '../TextField/TextField.vue';

defineProps<{
  modelValue?: string;
  label: string;
  fieldName?: string;
  mandatory?: boolean;
  useValidator?: boolean;
  validatorMessage?: string;
  placeholder?: string;
  tooltip?: string;
}>();

defineEmits<{
  'update:modelValue': [value?: string];
}>();
</script>
<template>
  <TextField
    :model-value="modelValue"
    @update:model-value="$emit('update:modelValue', $event)"
    :label="label"
    :field-name="fieldName"
    :mandatory="mandatory"
    :use-validator="useValidator"
    :validator-message="validatorMessage"
    :placeholder="placeholder"
    type="email"
    :tooltip="tooltip"
  />
</template>
