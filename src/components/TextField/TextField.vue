<script setup lang="ts">
import { onMounted, reactive } from 'vue';
import { useField } from 'vee-validate';
import { FieldValidation } from '@/types/fieldValidation.type';

const props = defineProps<{
  label: string;
  fieldName?: string;
  mandatory?: boolean;
  useValidator?: boolean;
  validatorMessage?: string;
  placeholder?: string;
}>();

const field = reactive<FieldValidation>({});

onMounted(() => {
  if (props.useValidator) {
    Object.assign(
      field,
      useField(props.fieldName ?? '', (value) => {
        if (!value && props.mandatory)
          return props.validatorMessage ?? "This field can't be empty";
        else return true;
      })
    );
  }
});
</script>
<template>
  <div class="field_wrapper">
    <label>
      {{ label }}
      <span class="text-danger" v-if="mandatory">*</span>
    </label>
    <InputText
      v-model="field.value"
      :placeholder="placeholder ?? `Input ${label.toLowerCase()}`"
      :class="[{ 'p-invalid': field.errorMessage }, 'w-100']"
    />
    <small class="validator-message" id="dd-error" v-if="field.errorMessage">{{
      field.errorMessage
    }}</small>
  </div>
</template>
