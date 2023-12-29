<script lang="ts" setup>
import { useField } from 'vee-validate';

const props = defineProps<{
  name: string;
  label: string;
}>();

const { errorMessage, value } = useField(() => props.name);
</script>

<template>
  <Checkbox v-model="value" :binary="true" />
  <span class="mx-1"> {{ props.label }} </span>
  <small
    v-if="errorMessage"
    class="p-error col-12 d-flex justify-content-end"
    id="text-error"
    >{{ errorMessage }}</small
  >
</template>
