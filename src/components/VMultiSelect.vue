<script lang="ts" setup>
import { useField } from 'vee-validate';

const props = defineProps<{
  name: string;
  options: any[];
  optionLabel?: string;
  optionValue?: string;
  placeholder?: string;
  class?: string;
}>();

const { errorMessage, value } = useField(() => props.name);
</script>

<template>
  <MultiSelect
    v-model="value"
    :options="props.options"
    :optionLabel="props.optionLabel"
    :optionValue="props.optionValue"
    :placeholder="props.placeholder"
    :class="props.class"
  />
  <small
    v-if="errorMessage"
    class="p-error col-12 d-flex justify-content-end"
    id="text-error"
    >{{ errorMessage }}</small
  >
</template>
