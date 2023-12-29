<script lang="ts" setup>
import { useField } from 'vee-validate';

const props = defineProps<{
  name: string;
  options: any[];
}>();

const { errorMessage, value } = useField(() => props.name);
</script>

<template>
  <div
    class="d-flex align-items-center"
    v-for="(option, index) in props.options"
    :key="index"
  >
    <RadioButton
      v-model="value"
      inputId="basicUser"
      name="isAdmin"
      :value="option.value"
    />
    <label class="ms-2">{{ option.label }}</label>
  </div>
  <small
    v-if="errorMessage"
    class="p-error col-12 d-flex justify-content-end"
    id="text-error"
    >{{ errorMessage }}</small
  >
</template>

<style lang="scss" scoped>
:deep(.p-radiobutton) {
  width: 12.8px !important;
  height: 12.8px !important;
}
:deep(.p-radiobutton-box) {
  width: 12.8px !important;
  height: 12.8px !important;
}

:deep(.p-radiobutton .p-radiobutton-box .p-radiobutton-icon) {
  width: 7px !important;
  height: 7px !important;
}
</style>
