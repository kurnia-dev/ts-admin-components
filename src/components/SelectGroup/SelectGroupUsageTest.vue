<script setup lang="ts">
import SelectGroup from './SelectGroup.vue';
import { ref } from 'vue';

const group = ref<number[]>([]);
</script>
<template>
  <SelectGroup
    v-model="group"
    selectionMode="checkbox"
    :params="{ full: true }"
  />
</template>
