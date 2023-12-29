<script lang="ts" setup>
import { useField } from 'vee-validate';

const props = defineProps<{
  name: string;
  placeholder?: string;
  class?: string;
}>();

const { errorMessage, value } = useField(() => props.name);
</script>

<template>
  <Calendar
    :modelValue="(value as any)"
    @update:modelValue="(event:any)=> value = event"
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
