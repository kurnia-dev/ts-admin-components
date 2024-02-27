<!-- eslint-disable vue/html-indent -->
<script lang="ts" setup>
import { computed, ref, watch } from 'vue';
import GroupTree from '../grouptree/GroupTree.vue';
import TSButton from '@/components/TSButtons/Button.vue';
import { TreeSelectionKeys } from 'primevue/tree';

/**
 * There is still a bug with partial checked on readonly group tree
 */

const props = defineProps<{
  show: boolean;
  selectedGroups?: object | number[];
  selectionMode: 'checkbox' | 'single';
  header?: string;
  buttonLabel?: string;
  params?: object;
  readonly?: boolean;
}>();

const emit = defineEmits<{
  (e: 'cancel'): void;
  (e: 'apply', data?: TreeSelectionKeys): void;
  (e: 'keyChange', data?: object): void;
  (e: 'update:show', data: boolean): void;
}>();

const selectedGroupsTemp = ref<TreeSelectionKeys>();

const show = computed({
  get: () => props.show,
  set: (value) => {
    emit('update:show', value);
  },
});

const disableApply = computed(() => {
  return (
    props.selectionMode === 'single' && !Object.keys(selectedGroupsTemp).length
  );
});

/**
 * To convert number array of group keys into TreeSelectionKeys format { '1': { checked: true } }
 * This will show the already selected groups on the tre.
 */
const parseSelectionKeys = (keys: number[]) => {
  const keysModel: TreeSelectionKeys = {};

  keys.forEach((key) => {
    keysModel[key] = {
      checked: true,
      partialChecked: false,
    };
  });

  return keysModel;
}

watch(
  [(): boolean => props.show, (): object | number[] | undefined => props.selectedGroups],
  ([isShow, groupKeys]) => {
    if (isShow && Array.isArray(groupKeys) && props.readonly) {
      selectedGroupsTemp.value = parseSelectionKeys(groupKeys);
    }
  },
);
</script>

<template>
  <Dialog
    v-model:visible="show"
    :base-z-index="99999999"
    :draggable="false"
    :header="header ?? props.readonly ? 'Selected Group' : 'Select Group'"
    @update:visible="!$event && emit('cancel')"
    closable
    modal
    class="ts-selectgroup-dialog"
  >
    <GroupTree
      v-model:selected-keys="selectedGroupsTemp"
      :params="props.params"
      :readonly="props.readonly"
      :selection-mode="props.selectionMode"
      @key-change="emit('keyChange', $event)"
      filter-by="name"
      filter-placeholder="Search"
    />
    <template #footer>
      <template v-if="props.readonly">
        <TSButton
          @click="emit('cancel')"
          label="Close"
          severity="secondary"
          text-only
        />
      </template>
      <template v-else>
        <TSButton @click="emit('cancel'), emit('update:show', false)" label="Cancel" text-only />
        <TSButton
          :disabled="disableApply"
          :label="buttonLabel ?? 'Apply'"
          @click="emit('apply', selectedGroupsTemp)"
          severity="success"
        />
      </template>
    </template>
  </Dialog>
</template>

<style lang="scss">
@import 'scss/var';

.ts-selectgroup-dialog {
  width: 400px;
  padding: 24px;
  background: $general-bg-white;

  ::-webkit-scrollbar {
    width: 6px;
    height: 6px;
  }

  ::-webkit-scrollbar-thumb {
    background-color: #d9d9d9;
    border-radius: 20px;
  }

  .p-dialog-header,
  .p-dialog-content,
  .p-dialog-footer {
    padding: 0 !important;
  }

  .p-dialog-header {
    .p-dialog-title {
      font-size: 14px !important;
      font-weight: 700;
      line-height: 18px;
      letter-spacing: 0.02em;
      text-align: left;
    }

    .p-dialog-header-icon {
      width: 24px;
      height: 24px;

      svg {
        width: 14px;
        height: 14px;
      }
    }
  }
}
</style>