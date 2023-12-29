<script lang="ts" setup>
import { computed, ref } from 'vue';
import CategoryTree from '../CategoryTree.vue';

const props = defineProps<{
  show: boolean;
  category: object;
  selectionMode: 'checkbox' | 'single';
  readonly?: boolean;
}>();

const emit = defineEmits<{
  (e: 'cancel'): void;
  (e: 'apply', data: any): void;
  (e: 'keyChange', data: any): void;
}>();

const categoryTemp = ref<any>({});
const filter = ref(false);

const show = computed(() => props.show);
</script>

<template>
  <Dialog
    v-model:visible="show"
    modal
    style="width: 400px"
    :draggable="false"
    :header="props.readonly ? 'Selected Category' : 'Select Category'"
    @show="() => (categoryTemp = props.category ? props.category : {})"
    @hide="() => (categoryTemp = {})"
    :closable="false"
    :base-z-index="99999999"
  >
    <div class="d-flex justify-content-end" v-if="!filter">
      <Button
        icon="ri-search-2-line"
        class="sidebar-header-item h-auto"
        severity="secondary"
        @click="() => (filter = !filter)"
        text
        rounded
      />
    </div>
    <CategoryTree
      :filter="filter"
      filter-by="label"
      filterPlaceholder="Search"
      :selection-mode="props.selectionMode"
      :readonly="props.readonly"
      v-model:selected-keys="categoryTemp"
      @key-change="emit('keyChange', $event)"
      @toggle-search-bar="() => (filter = !filter)"
    />
    <template #footer>
      <div v-if="props.readonly" class="d-flex justify-content-end gap-2">
        <Button
          label="Close"
          text
          severity="secondary"
          @click="emit('cancel')"
        />
      </div>
      <div v-else class="d-flex justify-content-end">
        <Button
          label="Cancel"
          text
          severity="secondary"
          @click="emit('cancel')"
          class="mx-1"
        />
        <Button
          label="Apply"
          severity="success"
          :disabled="
            selectionMode === 'single' && !Object.keys(categoryTemp).length
          "
          @click="emit('apply', categoryTemp)"
        />
      </div>
    </template>
  </Dialog>
</template>
