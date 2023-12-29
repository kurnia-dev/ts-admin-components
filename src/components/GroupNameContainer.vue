<script setup lang="ts">
import NameContainer from '@/components/NameContainer.vue';
import { onMounted, ref } from 'vue';

const props = defineProps<{
  name: string[];
  useRemoveButton?: boolean;
}>();

const emit = defineEmits<{
  (e: 'remove', index: number, name: string): void;
}>();

onMounted(() => {
  if (props.name?.length > 3) {
    totalHidden.value = props.name.length - 3;
    filterredName.value = props.name.slice(0, 3);
  }
});

const totalHidden = ref(0);
const filterredName = ref<string[]>(props.name);
</script>

<template>
  <div class="d-flex align-items-center">
    <div
      class="d-flex align-items-center me-2"
      v-for="(name, i) in filterredName"
      :key="i"
    >
      <NameContainer
        :name="name"
        :use-remove-button="props.useRemoveButton"
        @remove="emit('remove', i, name)"
      />
    </div>
    <div v-if="totalHidden" class="d-flex align-items-center me-2 text-muted text-nowrap">
      +{{ totalHidden }} more
    </div>
  </div>
</template>

<style scoped></style>
