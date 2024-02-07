<script setup lang="ts">
import SelectGroup from './SelectGroup.vue';
import { ref, watch } from 'vue';
import Button from '../TSButtons/Button.vue';

const group = ref<number[]>([]);
const group2 = ref<number[]>([2]);
const groupKey = ref<number>(0);

watch(groupKey, () => {
  console.log(groupKey.value)
})
</script>
<template>
  <div class="d-flex gap-4">
    <SelectGroup
      :key="groupKey"
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
    <Button label="reset" @click="groupKey++" />
</template>
