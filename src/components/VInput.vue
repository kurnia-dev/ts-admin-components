<script lang="ts" setup>
import { useField } from 'vee-validate';

const props = defineProps<{
  name: string;
  type: string;
  placeholder?: string;
  label?: string;
}>();

const { errorMessage, value, meta } = useField(() => props.name);
</script>

<template>
  <input
    v-if="!label"
    :type="type"
    v-model="value"
    class="p-inputtext p-component col-12 "
    :placeholder="props.placeholder"
    :class="{ 'p-invalid': errorMessage && meta.dirty}"
  />
  <div class="p-inputgroup" v-else>
    <input
      :type="type"
      v-model="value"
      class="p-inputtext p-component col-12 "
      :placeholder="props.placeholder"
      :class="{ 'p-invalid': errorMessage && meta.dirty}"
    />
    <span class="p-inputgroup-addon border-start-0">{{
      label
    }}</span>
  </div>
  <small
    v-if="errorMessage && meta.dirty"
    class="p-error col-12 d-flex justify-content-end"
    id="text-error"
    >{{ errorMessage }}</small
  >
</template>
