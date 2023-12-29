<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { isObjectEmpty } from '@/utils';
import SelectCategoryDialog from './SelectCategoryDialog.vue';

const props = defineProps<{
  modelValue: number[];
  selectionMode: 'checkbox' | 'single';
  readonly?: boolean;
  singleSelectedCategoryName?: string;
  btnClass?: object | string;
  btnStyle?: object | string;
  btnPassThrough?: object;
  disabled?: boolean;
}>();

const emit = defineEmits<{
  (e: 'update:modelValue', keys: number[]): void;
  (e: 'applySingleMode', group: any): void;
}>();

const showCategories = ref(false);
const categoryTemp = ref({});
const singleSelectedCategoryTemp = ref<any>(null);
const singleSelectedCategory = ref<any>(null);

const modelValue = computed(() => props.modelValue);
const categoryKeysCount = computed(() => props.modelValue?.length);
const buttonLabel = computed(() => {
  if (categoryKeysCount.value) {
    return `${categoryKeysCount.value} Category(s) Selected`;
  }

  return 'Select Category';
});

const showCategoryDialog = () => {
  showCategories.value = true;
};

const filterSelectedTreeKeys = (keys: any) => {
  const formatted = Object.entries(keys);
  const filtered = formatted
    .filter((data: any) => data[1].checked && !data[1].partialChecked)
    .map((data) => parseInt(data[0]));
  return filtered;
};

const setCategories = (data: any) => {
  if (props.selectionMode === 'checkbox') {
    const keys = filterSelectedTreeKeys(data);
    categoryTemp.value = data;
    showCategories.value = false;
    emit('update:modelValue', keys);
  } else {
    if (!singleSelectedCategoryTemp.value) {
      return;
    }
    singleSelectedCategory.value = singleSelectedCategoryTemp.value;
    emit('update:modelValue', [singleSelectedCategory.value?.key]);
    emit('applySingleMode', singleSelectedCategory.value);
    showCategories.value = false;
  }
};

const onNodeClick = (data: any) => {
  singleSelectedCategoryTemp.value = data;
};

const singleActiveCategory = ref<any>({});

const setActiveCategory = (selectedCategory: any) => {
  const key = selectedCategory?.key;
  singleActiveCategory.value = {};
  if (key) {
    singleActiveCategory.value[key] = true;
  }
};

watch(
  modelValue,
  (values) => {
    if (!values?.length) {
      categoryTemp.value = {};
    } else {
      const selectedCategory: any = {};
      for (const element of values) {
        const val = element;
        selectedCategory[val] = { checked: true };
      }
      categoryTemp.value = selectedCategory;
    }
  },
  { immediate: true }
);

watch(showCategories, (val) => {
  if (val) {
    singleSelectedCategoryTemp.value = singleSelectedCategory.value;
    setActiveCategory(singleSelectedCategory.value);
  }
});

watch(singleSelectedCategoryTemp, (val) => {
  if (!isObjectEmpty(val)) {
    setActiveCategory(val);
  }
});
</script>

<template>
  <div v-if="props.selectionMode === 'single'">
    <Button
      v-if="isObjectEmpty(categoryTemp)"
      :label="buttonLabel"
      @click="showCategoryDialog"
      :disabled="disabled"
      :class="btnClass"
      :style="btnStyle"
      :pt="btnPassThrough"
    />
    <div v-else class="">
      <NameContainer
        :name="
          singleSelectedCategory?.label || props.singleSelectedCategoryName
        "
        class="me-1"
      />
      <Button
        @click="showCategoryDialog"
        :disabled="disabled"
        icon="ri-edit-2-line"
        severity="secondary"
        class="mx-1"
        text
        rounded
      />
    </div>
  </div>
  <Button
    v-else
    :label="buttonLabel"
    @click="showCategoryDialog"
    class="d-block w-100"
    :disabled="disabled"
    :class="btnClass"
    :style="btnStyle || { padding: '0.2rem 0.75rem' }"
    :pt="btnPassThrough || { label: { style: 'font-size: 11.2px' } }"
  />

  <SelectCategoryDialog
    :show="showCategories"
    :category="
      props.selectionMode === 'checkbox' ? categoryTemp : singleActiveCategory
    "
    :selection-mode="props.selectionMode"
    :readonly="props.readonly"
    @key-change="onNodeClick"
    @cancel="() => (showCategories = false)"
    @apply="setCategories"
  />
</template>
