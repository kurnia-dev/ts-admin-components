<script lang="ts" setup>
import { isObjectEmpty } from '@/utils';
import { ref, computed, onMounted, onBeforeMount, watch, useAttrs } from 'vue';
import CustomTree from '@/components/CustomTree/Tree.vue';
import CategoryAPIs from '@/services/category.service';

const attrs: any = useAttrs();

onBeforeMount(async () => {
  await fetchTreeList();
});

onMounted(() => {
  expandedKeys.value = { '-1': true };
});

const selectedKey = ref<any>(null);
const expandedKeys = ref<any>({});
const isLoading = ref(false);
const nodes = ref<any>();
const disabledKeys = ref<number[] | string[]>([]);

const selectedKeyProps = computed(() => attrs['selected-keys']);

const onNodeChange = (event: any) => {
  if (attrs['selection-mode'] === 'single') {
    const key = event.key;
    selectedKey.value = {};
    selectedKey.value[key] = true;
    attrs['onKeyChange'](event);
  }
  attrs['onUpdate:selectedKeys'](selectedKey.value);
};

const fetchTreeList = async () => {
  try {
    isLoading.value = true;
    const response = await CategoryAPIs.getCategoryTreeList();
    const treeList = response.data.data;
    const trees = [...treeList];
    nodes.value = trees;
    if (attrs['onFetched']) {
      attrs['onFetched'](trees);
    }
    if (attrs['readonly']) {
      disabledKeys.value = getAllCategoryKeys();
    }
  } catch (error) {
    console.error('failed to fetch category tree');
  } finally {
    isLoading.value = false;
  }
};

const getAllCategoryKeys = () => {
  const keys: string[] = [];

  // walk on the tree (something like recursive)
  JSON.stringify(nodes.value, (key, value) => {
    if (key === 'key') keys.push(value);
    return value;
  });

  const filterredKeys = [...new Set(keys)];
  return filterredKeys;
};

const stop = watch(
  selectedKeyProps,
  (val: any) => {
    if (!isObjectEmpty(val)) {
      selectedKey.value = JSON.parse(JSON.stringify(val));
      stop();
    }
  },
  { immediate: true }
);
</script>

<template>
  <CustomTree
    :value="nodes"
    :loading="isLoading"
    v-model:expandedKeys="expandedKeys"
    v-model:selectionKeys="selectedKey"
    :disabled-keys="disabledKeys || $attrs['disabled-keys']"
    :selectionMode="($attrs['selection-mode'] as string)"
    class="w-full"
    @node-select="onNodeChange"
    @node-unselect="onNodeChange"
  />
</template>
