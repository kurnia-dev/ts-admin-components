<script lang="ts" setup>
import { computed, ref, watch } from 'vue';
import GroupTree from '../GroupTree.vue';
import TSButton from '../TSButtons/Button.vue';

const props = defineProps<{
  show: boolean;
  selectedGroups?: object;
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

const selectedGroupsTemp = ref<any>({});

const show = computed(() => props.show);
watch(() => props.selectedGroups, (val) => {
  if (show.value) selectedGroupsTemp.value = val;
})
</script>

<template>
  <Dialog
    v-model:visible="show"
    modal
    style="width: 400px"
    :draggable="false"
    :header="header ?? props.readonly ? 'Selected Group' : 'Select Group'"
    @hide="() => (selectedGroupsTemp = {})"
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
      v-model:selected-keys="selectedGroupsTemp"
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
            selectionMode === 'single' && !Object.keys(selectedGroupsTemp).length
          "
          @click="emit('apply', selectedGroupsTemp), console.log('apply', selectedGroupsTemp)"
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