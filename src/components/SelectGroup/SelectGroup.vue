<script setup lang="ts">
import { computed, ref, watch, watchEffect } from 'vue';
import { isObjectEmpty } from '@/utils';
import SelectGroupDialog from './SelectGroupDialog.vue';
import QuotaExceededDialog from './QuotaExceededDialog.vue';
import TSButton from '../TSButtons/Button.vue';
import NameContainer from '../NameContainer.vue';

/**
 * Define the props for the Vue component
 * @property {boolean} show - A boolean prop to control the visibility of the component
 * @property {object} destination - An object prop to specify the destination
 * @property {'checkbox' | 'single'} selectionMode - A string prop to specify the selection mode, which can be either 'checkbox' or 'single'
 * @property {string} [dialogHeader] - An optional string prop to specify the header text
 * @property {string} [dialogFooterButtonLabel] - The footer action button label - default to 'Apply'
 * @property {object} [params] - An optional object prop to pass additional parameters for getting the grub
 * @property {boolean} [readonly] - No select mode - view only
 */
const props = defineProps<{
  dialogHeader?: string;
  dialogFooterButtonLabel?: string;
  modelValue?: number[];
  selectionMode: 'checkbox' | 'single';
  params?: object;
  checkQuota?: boolean;
  readonly?: boolean;
  singleSelectedGroupName?: string;
  btnClass?: object | string;
  btnStyle?: object | string;
  btnPassThrough?: object;
  disabled?: boolean;
  hideButton?: boolean;
  showDialog?: boolean;
}>();

const emit = defineEmits<{
  'update:modelValue': [keys: number[]];
  'update:exceeded': [data: boolean];
  'applySingleMode': [group: any];
  'update:showDialog': [state: boolean];
}>();

const showGroups = ref(false);
const showExceededDialog = ref(false);
const showExceededLabel = ref(false);
const groupTemp = ref({});
const singleSelectedGroupTemp = ref<any>(null);
const singleSelectedGroup = ref<any>(null);

const modelValue = computed(() => props.modelValue);
const groupKeysCount = computed(() => props.modelValue?.length);
const buttonLabel = computed(() => {
  if (groupKeysCount.value) {
    return `${groupKeysCount.value} Group(s) Selected`;
  }

  return 'Select Group';
});

const showGroupDialog = () => {
  showGroups.value = true;
  console.log('grouupTemp', groupTemp.value);
};

const filterSelectedTreeKeys = (keys: any) => {
  const formatted = Object.entries(keys);
  const filtered = formatted
    .filter((data: any) => data[1].checked && !data[1].partialChecked)
    .map((data) => parseInt(data[0]));
  return filtered;
};

const setGroups = (data: any) => {
  if (props.selectionMode === 'checkbox') {
    const keys = filterSelectedTreeKeys(data);
    groupTemp.value = data;
    showGroups.value = false;
    emit('update:modelValue', keys);
  } else {
    if (!singleSelectedGroupTemp.value) {
      return;
    }
    singleSelectedGroup.value = singleSelectedGroupTemp.value;
    emit('update:modelValue', [singleSelectedGroup.value?.key]);
    emit('applySingleMode', singleSelectedGroup.value);
    emit('update:exceeded', false);
    if (props.checkQuota) {
      const { total, used } = singleSelectedGroup.value.quota;
      if (total !== -1 && !(total - used)) {
        showExceededDialog.value = true;
        showExceededLabel.value = true;
        emit('update:exceeded', true);
      } else {
        showExceededLabel.value = false;
      }
    }
    showGroups.value = false;
  }
};

const onNodeClick = (data: any) => {
  singleSelectedGroupTemp.value = data;
};

const singleActiveGroup = ref<any>({});

const setActiveGroup = (selectedGroup: any) => {
  const key = selectedGroup?.key;
  singleActiveGroup.value = {};
  if (key) {
    singleActiveGroup.value[key] = true;
  }
};

watch(
  modelValue,
  (values) => {
    if (!values?.length) {
      groupTemp.value = {};
    } else {
      const selectedGroup: any = {};
      for (const element of values) {
        const val = element;
        selectedGroup[val] = { checked: true };
      }
      groupTemp.value = selectedGroup;
    }
  },
  { immediate: true }
);

watch(showGroups, (val) => {
  if (val) {
    singleSelectedGroupTemp.value = singleSelectedGroup.value;
    setActiveGroup(singleSelectedGroup.value);
  }

  if (props.showDialog !== undefined) {
    emit('update:showDialog', val);
    groupTemp.value = {};
    singleSelectedGroupTemp.value = {};
  }
});

watch(singleSelectedGroupTemp, (val) => {
  if (!isObjectEmpty(val)) {
    setActiveGroup(val);
  }
});

watch(() => props.showDialog, (state: boolean | undefined) => {
  if (state !== undefined) showGroups.value = state;
});

// watchEffect(() => {
//   console.log('showGroups:', showGroups.value);
//   console.log('showExceededDialog:', showExceededDialog.value);
//   console.log('showExceededLabel:', showExceededLabel.value);
//   console.log('groupTemp:', groupTemp.value);
//   console.log('singleSelectedGroupTemp:', singleSelectedGroupTemp.value);
//   console.log('singleSelectedGroup:', singleSelectedGroup.value);
//   console.log('modelValue:', modelValue.value);
//   console.log('groupKeysCount:', groupKeysCount.value);
//   console.log('buttonLabel:', buttonLabel.value);
//   console.log('singleActiveGroup:', singleActiveGroup.value);
// });
</script>

<template>
  <template v-if="!props.hideButton">
    <template v-if="props.selectionMode === 'single'">
      <TSButton
        v-if="isObjectEmpty(singleActiveGroup)"
        :label="buttonLabel"
        @click="showGroupDialog"
        :disabled="disabled"
        :class="btnClass"
        :style="btnStyle"
        :pt="btnPassThrough"
        severity="primary"
        type="button"
      />
      <div v-else class="d-flex align-item-center gap-1">
        <NameContainer
          :name="singleSelectedGroup?.name || props.singleSelectedGroupName"
        />
        <Button
          @click="showGroupDialog"
          :disabled="disabled"
          severity="primary"
          class="edit-group"
          text
          rounded
          type="button"
        >
          <i class="ri-edit-2-line" />
        </Button>
        <span v-if="showExceededLabel" class="ms-1 text-danger"
          >Group Quota Exceeded</span
        >
      </div>
    </template>
    <TSButton
      v-else
      :label="buttonLabel"
      @click="showGroupDialog"
      class="d-block w-100"
      :disabled="disabled"
      :class="btnClass"
      severity="primary"
      type="button"
    />
  </template>
  <SelectGroupDialog
    :header="dialogHeader"
    :button-label="dialogFooterButtonLabel"
    :show="showGroups"
    :selectedGroups="
      props.selectionMode === 'checkbox' ? groupTemp : singleActiveGroup
    "
    :params="props.params"
    :selection-mode="props.selectionMode"
    :readonly="props.readonly"
    @key-change="onNodeClick"
    @cancel="() => (showGroups = false)"
    @apply="setGroups"
  />

  <QuotaExceededDialog
    :show="showExceededDialog"
    :group-name="singleSelectedGroup?.name"
    @close="() => (showExceededDialog = false)"
  />
</template>
<style scoped lang="scss">
.p-button-rounded.edit-group {
  padding: 2px;
  border-radius: 50%;
  height: 1.2rem;
  width: 1.2rem;

  .ri-edit-2-line {
    font-size: 0.925rem;
  }
}
</style>