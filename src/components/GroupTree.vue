<script lang="ts" setup>
import { isObjectEmpty } from '@/utils';
import { ref, computed, onMounted, onBeforeMount, watch, useAttrs } from 'vue';
// import GroupAPIs from '@/services/group.service';
import Tree, { TreeState } from 'primevue/tree';

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
    // const response = await GroupAPIs.getGroupTreeList(attrs['params']);
    // const treeList = response.data.data;
    const formattedTreeList = [
      {
        _id: null,
        key: -1,
        name: 'All',
        label: 'All',
        parent: null,
        children: [
          {
            key: '1',
            label: 'Indonesia',
            name: 'Indonesia',
            children: [
              { key: '11', label: 'Jakarta', name: 'Jakarta' },
              { key: '12', label: 'Bandung', name: 'Bandung' },
            ],
          },
          {
            key: '2',
            label: 'Malaysia',
            name: 'Malaysia',
            children: [
              {
                key: '21',
                label: 'Kuala Lumpur',
                name: 'Kuala Lumpur',
              },
              { key: '22', label: 'Penang', name: 'Penang' },
            ],
          },
        ],
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
    console.error('failed to fetch group tree', error);
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

const tree = ref<TreeState>();
const treeFilterValue = ref<string>('');
const onFilterKeydown = (event: KeyboardEvent) => {
  if (event.key === 'Enter') {
    event.preventDefault();
  }
};
</script>

<template>
  <div class="ts-grouptree">
    <div class="p-tree-filter-container">
      <div class="tree-search-bar">
        <span class="w-100 p-input-icon-left flex-fill">
          <Icon width="14" height="14" icon="ri-search-2-line" />
          <InputText
            v-model="treeFilterValue"
            @update:model-value="tree && (tree.filterValue = treeFilterValue)"
            autocomplete="off"
            class="p-tree-filter"
            placeholder="Search"
            @keydown="onFilterKeydown"
          />
        </span>
        <Icon
          class="reset-filter"
          v-show="treeFilterValue"
          icon="ri:close-line"
          @click="treeFilterValue = '', tree && (tree.filterValue = treeFilterValue)"
        />
      </div>
    </div>
    <Tree
      ref="tree"
      :value="nodes"
      :loading="isLoading"
      :disabled-keys="disabledKeys || $attrs['disabled-keys']"
      v-model:expandedKeys="expandedKeys"
      v-model:selectionKeys="selectedKey"
      :selectionMode="($attrs['selection-mode'] as 'checkbox' | 'single')"
      class="ts-tree"
      @node-select="onNodeChange"
      @node-unselect="onNodeChange"
    />
  </div>
</template>
<style lang="scss">
@import '~rfs/scss';
@import 'scss/var';

.ts-grouptree {
  display: flex;
  flex-direction: column;
  gap: 12px;

}

.ts-tree {
  border: none !important;
  padding: 0 !important;
  
  .p-treenode {
    padding: 5px 0 0!important;

    .p-treenode-content {
      padding: 4.6px 9.6px !important;
      gap: 6.4px;

      > * {
        margin-right: 0 !important;
      }

      .p-checkbox {
        width: max-content !important;
        height: max-content !important;
      }
      .p-tree-toggler.p-link {
        width: 12.8px !important;
        height: 12.8px !important;
      }

      .p-tree-toggler.p-link:hover {
        background: none !important;
      }
    }

    .p-treenode-content:hover {
      background: $primary-weak !important;
    }

    .p-treenode-icon {
      display: none !important;
    }

    .p-treenode-label {
      color: $general-label;

      font-size: 11.2px;
      font-style: normal;
      font-weight: 500;
      line-height: 16.8px;
      letter-spacing: 0.224px;
    }
  }
}

.p-tree-filter-container {
  position: relative;
  display: block;
  width: 100%;
  border-radius: 4px;
  border: 1px solid $general-body;

  .tree-search-bar {
    @include font-size(11.2px);

    .p-inputtext {
      padding-left: 32px;
      @include padding-top(10px);
      @include padding-bottom(10px);
      color: $general-placeholder;

      font-size: 11.2px;
      font-style: normal;
      font-weight: 300;
      line-height: 16px;
      letter-spacing: 0.224px;
    }

    .p-input-icon-left > svg:first-of-type, .p-input-icon-left > i:first-of-type {
      left: 8px;
    }

    .p-button {
      height: 20px;
      width: 20px;
      @include padding(0 10px);
      @include margin-left(5px);
      &:hover {
        box-shadow: none;
      }
    }
  }
}

.p-tree-filter-icon,
.reset-filter {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  cursor: pointer;
}

.reset-filter {
  right: 9px;
  font-size: 0.9rem;
}

.p-tree-loading {
  position: relative;
}

.p-tree .p-tree-loading-overlay {
  position: absolute;
  z-index: 1;
  display: flex;
  align-items: center;
  justify-content: center;
}

.p-tree-flex-scrollable {
  display: flex;
  flex: 1;
  height: 100%;
  flex-direction: column;
}

.p-tree-flex-scrollable .p-tree-wrapper {
  flex: 1;
}

.loader {
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
