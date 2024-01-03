<script setup lang="ts">
import { onMounted, ref } from 'vue';
import Button from '../TSButtons/Button.vue';

const container = ref<HTMLDivElement | null>(null);

/**
 * This component is used to generate a dynamic grid-based layout for any count of filter fields.
 * It calculates the number of children in the container and sets their grid area style dynamically.
 * The grid layout is determined by the row and column position, which are incremented based on the child count.
 * If the child count is odd and the child is the last one (wich is Buttons Action),
 * it is placed in the 4th column.
 */
defineEmits<{
  apply: [];
  clear: [];
}>();

const contentKey = ref<number>(0);

onMounted(() => {
  const chilren = container.value!.children;
  const childCount = container.value!.childElementCount;
  const isOdd = childCount % 4;

  let [rowPos, colPos] = [1, 1];
  for (const i in Array.from({ length: childCount })) {
    const isLast = Number(i) == childCount - 1;
    chilren[i].setAttribute(
      'style',
      `grid-area: ${rowPos}/${isLast && isOdd ? 4 : colPos}`
    );

    if (++colPos > 4) {
      colPos = 1;
      rowPos++;
    }
  }
});
</script>
<template>
  <div class="ts-filter-container" ref="container">
    <slot name="content" :key="contentKey"></slot>
    <div class="ts-filter-action-button">
      <Button
        label="Clear Field"
        severity="primary"
        text-only
        @click="$emit('clear'), contentKey++"
      />
      <Button label="Apply" severity="success" @click="$emit('apply')" />
    </div>
  </div>
</template>
<style lang="scss">
@import '~rfs/scss';

.ts-filter-container {
  display: grid;
  @include padding(12px !important);
  gap: 1rem;
  align-items: flex-end;
  background-color: #f5f5f5;
  grid-template-columns: repeat(4, 1fr);

  > * {
    width: 100%;
    min-width: 0;
  }

  .ts-filter-action-button {
    display: flex;
    align-items: baseline;
    justify-content: flex-end;
    gap: 4px;
  }
}
</style>
