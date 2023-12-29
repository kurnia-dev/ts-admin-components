<script lang="ts" setup>
import { isObjectEmpty } from '@/utils';
import { ref, computed, onMounted, onBeforeMount, watch, useAttrs } from 'vue';
import GroupAPIs from '@/services/group.service';
import CustomTree from './CustomTree/Tree.vue';

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
    const response = await GroupAPIs.getGroupTreeList(attrs['params']);
    const treeList = response.data.data;
    const formattedTreeList = [
      {
        _id: null,
        key: -1,
        name: 'All',
        label: 'All',
        parent: null,
        children: [...treeList],
      },
    ];
    nodes.value = formattedTreeList;
    if (attrs['onFetched']) {
      attrs['onFetched'](formattedTreeList);
    }
    if (attrs['readonly']) {
      disabledKeys.value = getAllGroupKeys();
    }
  } catch (error) {
    console.error('failed to fetch group tree');
  } finally {
    isLoading.value = false;
  }
};

const getAllGroupKeys = () => {
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
    if (val && !isObjectEmpty(val)) {
      selectedKey.value = val;
      stop();
    }
  },
  { immediate: true, flush: 'post' }
);
</script>

<template>
  <CustomTree
    :value="nodes"
    :loading="isLoading"
    :disabled-keys="disabledKeys || $attrs['disabled-keys']"
    v-model:expandedKeys="expandedKeys"
    v-model:selectionKeys="selectedKey"
    :selectionMode="($attrs['selection-mode'] as string)"
    class="w-full"
    @node-select="onNodeChange"
    @node-unselect="onNodeChange"
  />
</template>
