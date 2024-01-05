<script lang="ts" setup>
import { ref } from 'vue';
import Button from './Button.vue';

defineProps<{
  showFilter?: boolean;
}>();

const emit = defineEmits<{
  'update:showFilter': [state: boolean];
}>();

const active = ref<boolean>(false);
const filterIcon = ref<string>('ri-filter-line');

const toggleFilterPanel = (): void => {
  active.value = !active.value;
  filterIcon.value = active.value ? 'ri-filter-fill' : 'ri-filter-line';

  emit('update:showFilter', active.value);
};
</script>

<template>
  <Button
    :icon="filterIcon"
    :outlined="!active"
    @click="toggleFilterPanel"
    severity="secondary"
    class="ts-button-filter"
  />
</template>
