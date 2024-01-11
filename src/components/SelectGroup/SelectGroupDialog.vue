<script lang="ts" setup>
import { computed, ref } from 'vue';
import GroupTree from '../GroupTree.vue';
import TSButton from '../TSButtons/Button.vue';

const props = defineProps<{
  show: boolean;
  destination?: object;
  selectionMode: 'checkbox' | 'single';
  header?: string;
  buttonLabel?: string;
  params?: object;
  readonly?: boolean;
}>();

const emit = defineEmits<{
  (e: 'cancel'): void;
  (e: 'apply', data: any): void;
  (e: 'keyChange', data: any): void;
}>();

const destinationTemp = ref<any>({});

const show = computed(() => props.show);
</script>

<template>
  <Dialog
    v-model:visible="show"
    modal
    style="width: 400px"
    :draggable="false"
    :header="header ?? props.readonly ? 'Selected Group' : 'Select Group'"
    @show="() => (destinationTemp = props.destination ? props.destination : {})"
    @hide="() => (destinationTemp = {})"
    :base-z-index="99999999"
    closable
    @update:visible="!$event && emit('cancel')"
  >
    <GroupTree
      :params="props.params"
      filter-by="name"
      filterPlaceholder="Search"
      :selection-mode="props.selectionMode"
      :readonly="props.readonly"
      v-model:selected-keys="destinationTemp"
      @key-change="emit('keyChange', $event)"
    />
    <template #footer>
      <template v-if="props.readonly">
        <TSButton
          label="Close"
          text-only
          severity="secondary"
          @click="emit('cancel')"
        />
      </template>
      <template v-else>
        <TSButton
          label="Cancel"
          text-only
          @click="emit('cancel')"
        />
        <TSButton
          :label="buttonLabel ?? 'Apply'"
          severity="success"
          :disabled="
            selectionMode === 'single' && !Object.keys(destinationTemp).length
          "
          @click="emit('apply', destinationTemp)"
        />
      </template>
    </template>
  </Dialog>
</template>
<style scoped lang="scss">
::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}

::-webkit-scrollbar-thumb {
  background-color: #d9d9d9;
  border-radius: 20px;
}

:deep(.p-dialog .p-dialog-header),
:deep(.p-dialog .p-dialog-content) {
  padding-bottom: 0.75rem !important;
}

:deep(.p-dialog .p-dialog-footer) {
  display: flex;
  justify-content: end;
  gap: 8px;

  button {
    margin: 0 !important;
  }
}
</style>