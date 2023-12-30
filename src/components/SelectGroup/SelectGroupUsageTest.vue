<script setup lang="ts">
import SelectGroup from './SelectGroup.vue';
import { ref } from 'vue';

const group = ref<number[]>([]);
const group2 = ref<number[]>([2]);
</script>
<template>
  <div class="d-flex gap-4">
    <SelectGroup
      v-model="group"
      selectionMode="checkbox"
      :params="{ full: true }"
    />
    <SelectGroup
      singleSelectedGroupName="Group XYZ"
      v-model="group2"
      selectionMode="single"
      :params="{ full: true }"
    />
    </div>
</template>
