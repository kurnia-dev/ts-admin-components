<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { isObjectEmpty } from '@/utils';
import SelectGroupDialog from './SelectGroupDialog.vue';
import QuotaExceededDialog from './QuotaExceededDialog.vue';

const props = defineProps<{
  modelValue: number[];
  selectionMode: 'checkbox' | 'single';
  params?: object;
  checkQuota?: boolean;
  readonly?: boolean;
  singleSelectedGroupName?: string;
  btnClass?: object | string;
  btnStyle?: object | string;
  btnPassThrough?: object;
  disabled?: boolean;
}>();

const emit = defineEmits<{
  (e: 'update:modelValue', keys: number[]): void;
  (e: 'update:exceeded', data: boolean): void;
  (e: 'applySingleMode', group: any): void;
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
});

watch(singleSelectedGroupTemp, (val) => {
  if (!isObjectEmpty(val)) {
    setActiveGroup(val);
  }
});
</script>

<template>
  <div v-if="props.selectionMode === 'single'">
    <Button
      v-if="isObjectEmpty(groupTemp)"
      :label="buttonLabel"
      @click="showGroupDialog"
      :disabled="disabled"
      :class="btnClass"
      :style="btnStyle"
      :pt="btnPassThrough"
    />
    <div v-else class="">
      <NameContainer
        :name="singleSelectedGroup?.name || props.singleSelectedGroupName"
        class="me-1"
      />
      <Button
        @click="showGroupDialog"
        :disabled="disabled"
        icon="ri-edit-2-line"
        severity="secondary"
        class="mx-1"
        text
        rounded
      />
      <span v-if="showExceededLabel" class="mx-1 text-danger"
        >Group Quota Exceeded</span
      >
    </div>
  </div>
  <Button
    v-else
    :label="buttonLabel"
    @click="showGroupDialog"
    class="d-block w-100"
    :disabled="disabled"
    :class="btnClass"
    :style="btnStyle || { padding: '0.2rem 0.75rem' }"
    :pt="btnPassThrough || { label: { style: 'font-size: 11.2px' } }"
  />

  <SelectGroupDialog
    :show="showGroups"
    :destination="
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
