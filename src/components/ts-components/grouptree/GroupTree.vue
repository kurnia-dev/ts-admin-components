<script lang="ts" setup>
import { ref, computed, onMounted, onBeforeMount, useAttrs, watch} from 'vue';
import Tree, { TreeNode, TreeSelectionKeys, TreeState } from 'primevue/tree';
import Menu from 'primevue/menu';
import GroupServices from '../services/group.service';
import { ConnectedOverlayScrollHandler } from 'primevue/utils';

const attrs = useAttrs();

const props = defineProps<{
  selectedKeys?: TreeSelectionKeys;
}>();

const emit = defineEmits<{
  'update:selectedKeys': [keys: TreeSelectionKeys];
}>();

onBeforeMount(async () => {
  await fetchTreeList();
});

onMounted(() => {
  if (tree.value) {
    expandedKeys.value = { '-1': true };
  }
});

const selectedKey = computed({
  get: () => props.selectedKeys ?? {},
  set: (newValue: TreeSelectionKeys) => {
    emit('update:selectedKeys', newValue);
  },
});

const isLoading = ref<boolean>(false);
const nodes = ref<TreeNode[]>([]);
const expandedKeys = ref<TreeSelectionKeys>({});
const disabledKeys = ref<number[] | string[]>([]);
const selectionMode = computed((): 'checkbox' | 'single' => {
  return attrs['selection-mode'] as 'checkbox' | 'single';
});

const onNodeChange = (node: TreeNode): void => {
  if (attrs['selection-mode'] === 'single') {
    const { key = '' } = node;
    selectedKey.value = {};
    selectedKey.value[key] = true;
    (attrs as { [key: string]: (changedNode: TreeNode) => void })[
      'onKeyChange'
    ](node);
  }
};

const fetchTreeList = async (): Promise<void> => {
  try {
    isLoading.value = true;
    const { data } = await GroupServices.getGroupTreeList();
    const { data: groupTreeList } = data;

    if (groupTreeList) {
      nodes.value = groupTreeList;
      selectedKey.value = props.selectedKeys ?? {};

      if (attrs['onFetched']) {
        (attrs as { [key: string]: (data: Array<TreeNode>) => void })[
          'onFetched'
        ](groupTreeList);
      }
  
      if (attrs['readonly']) {
        disabledKeys.value = getAllGroupKeys();
      }
    }


  } finally {
    isLoading.value = false;
  }
};

/**
 * Needs to loop over the nodes and check the parent node, wheter should be partial checked or not.
 * Because selectionKeys prop may only have the child node selection keys.
 */
const updateSelectionKeys = () => {
  const keys = Object.keys(props.selectedKeys ?? {});
  const keysModel: TreeSelectionKeys = {};

  const isPartialChecked = (node: TreeNode): boolean => {
    if (node.children) {
      /**
       * If there is at least one child checked and not all children checked, mean partial checked.
       * IF no children checked or all children checked, means not partial checked.
       */
      const thereIsChildrenChecked = node.children.some((childNode) => keys.includes(childNode.key ?? ''));
      const areAllChildrenChecked = node.children.every((childNode) => keys.includes(childNode.key ?? ''));

      /**
       * If there is at least a child that partial checked, mean partial checked.
       */

      // const thereIsChildrenPartialChecked = node.children.some(())

      return thereIsChildrenChecked && !areAllChildrenChecked;
    }

    return false;
  };

  const traverseNodes = (childNodes: TreeNode[]): void => {
    childNodes.forEach((node) => {
      if (node.key) {
        keysModel[node.key.toString()] = {
          checked: keys.includes(node.key),
          partialChecked: isPartialChecked(node),
        };
      }

      // If the node has children, recursively traverse them
      if (node.children) {
        traverseNodes(node.children);
      }
    });
  };

  traverseNodes(nodes.value);
  selectedKey.value =  keysModel;
}

const getAllGroupKeys = (): string[] => {
  const keys: string[] = [];

  JSON.stringify(nodes.value, (key, value) => {
    if (key === 'key') keys.push(value);
    return value;
  });

  const filterredKeys = [...new Set(keys)];
  return filterredKeys;
};

const tree = ref<TreeState>();
const treeFilterValue = ref<string>('');

const onFilterKeydown = (event: KeyboardEvent): void => {
  if (event.key === 'Enter') {
    event.preventDefault();
  }
};

const menu = ref<Menu>();
const items = [
  {
    label: 'Refresh',
    icon: 'pi pi-refresh',
  },
  {
    label: 'Export',
    icon: 'pi pi-upload',
  },
];

const toggle = (event: MouseEvent): void => {
  menu.value?.toggle(event);
};
</script>

<template>
  <div class="ts-grouptree">
    <div class="p-tree-filter-container">
      <div class="tree-search-bar">
        <span class="w-100 p-input-icon-left flex-fill">
          <i class="ri-search-2-line" height="14" width="14" />
          <InputText
            v-model="treeFilterValue"
            @keydown="onFilterKeydown"
            @update:model-value="tree && (tree.filterValue = treeFilterValue)"
            autocomplete="off"
            class="p-tree-filter-input"
            placeholder="Search"
          />
        </span>
        <i
          v-show="treeFilterValue"
          @click="
            (treeFilterValue = ''), tree && (tree.filterValue = treeFilterValue)
          "
          class="reset-filter ri-close-line"
        />
      </div>
    </div>
    <Tree
      ref="tree"
      v-model:expandedKeys="expandedKeys"
      v-model:selectionKeys="selectedKey"
      :disabled-keys="disabledKeys || $attrs['disabled-keys']"
      :loading="isLoading"
      :selection-mode="selectionMode"
      :value="nodes"
      @node-select="onNodeChange"
      @node-unselect="onNodeChange"
      @update:selection-keys="(selectedKey = $event), console.log($event)"
      class="ts-tree"
      filter-by="name"
    >
      <template #togglericon>
        <i class="p-togglericon pi pi-chevron-right" />
      </template>
      <template #default="slotProps">
        {{ slotProps.node.name }}
        <template v-if="false">
          <i @click="toggle" class="ri-more-2-line" />
          <Menu ref="menu" :model="items" :popup="true" />
        </template>
      </template>
    </Tree>
  </div>
</template>
<style lang="scss">
@import 'rfs/scss';
@import 'var';

.ts-selectgroup-dialog {
  .ts-grouptree {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }
  
  .ts-tree {
    border: none !important;
    padding: 0 !important;
  
    .p-treenode {
      padding: 3px 0 0 !important;
  
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
  
          .p-togglericon {
            font-size: 9px;
          }
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
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: space-between;
  
        i {
          visibility: hidden;
          background-color: white;
          width: 20px;
          height: 20px;
          border-radius: 7px;
          position: relative;
        }
  
        i::before {
          position: absolute;
          top: 50%;
          transform: translate(-50%, -50%);
          left: 50%;
        }
      }
  
      .p-treenode-label:hover i {
        visibility: visible;
      }
    }
  
  
    .p-treenode-children {
      padding: 0 0 0 8px !important;
    }
  
    .p-treenode[aria-expanded='true'] {
      > .p-treenode-content .p-tree-toggler .p-togglericon {
        rotate: 90deg;
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
  
      .ri-search-2-line {
        font-size: 1rem;
        line-height: 1;
      }
  
      > span {
        width: 100%;
      }
  
      .p-tree-filter-input {
        border: none;

        @include padding(4px 8px 4px 28px);
        color: $general-body !important;
        width: 100%;
  
        font-size: 11.2px;
        font-style: normal;
        font-weight: 400;
        line-height: 16px;
        letter-spacing: 0.224px;
        
        &::placeholder {
          font-weight: 300;
          color: $general-placeholder
        }
      }
  
      .p-input-icon-left > svg:first-of-type,
      .p-input-icon-left > i:first-of-type {
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
}
</style>
