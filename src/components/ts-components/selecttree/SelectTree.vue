<script setup lang="ts">
import { ref, onMounted, computed, watch, Ref, reactive } from 'vue';
import { useToast } from 'primevue/usetoast';
import TSButton from '@/components/TSButtons/Button.vue';
import { handleError } from '@/utils';
import { TSTreeNode } from '@/types/treenode.type';
import Tree, { TreeNode, TreeState } from 'primevue/tree';
import CategoriesServices from '@/services/category.service';
import GroupsServices from '@/services/group.service';
import NameContainer from '@/components/NameContainer.vue';
import { useField } from 'vee-validate';
import { FieldValidation } from '@/types/fieldValidation.type';

type SelectedKeys = {
  [key: number]: {
    checked: boolean;
  };
};

type SelectedKey = {
  [key: number]: boolean;
};

const toast = useToast();

const props = defineProps<{
  show: boolean;
  type: 'Category' | 'Group';
  actionMode?: 'Add' | 'Edit';
  disabled?: boolean;
  hideButton?: boolean;
  selectedNodes?: TSTreeNode[];
  selectionMode?: 'checkbox' | 'single';
  fieldName?: string;
  mandatory?: boolean;
  tooltip?: string;
  useValidator?: boolean;
  validatorMessage?: string;
}>();

const emit = defineEmits<{
  'keyChange': [payload: TreeNode];
  'multiChange': [payload: number[]];
  'update:show': [payload: boolean];
}>();

onMounted(() => {
  if (props.selectedNodes?.length) {
    selectKeys.value = props.selectedNodes.map((node) => node.key as number);
  }

  if (props.hideButton) fetchTree();

  if (props.useValidator) {
    Object.assign(
      field,
      useField(props.fieldName ?? 'selectTree', (value: number[]) => {
        return setValidatorMessage(value);
      })
    );
  }
});

const field = reactive<FieldValidation>({ value: {} });

const showDialog = ref<boolean>(false);
const loading = ref<boolean>(false);

const tree = ref<TreeState>();
const treeFilterValue = ref<string>('');
const selectedKeys = ref<TreeNode>({});
const selectKeys = ref<number[]>([]);
const selectName = ref<string>('');
const treeNodeOptions = ref<TreeNode[]>([]);
const parents: Ref<{ [x: string]: number[] }> = ref({});
const initialExpandedKeys = ref({ '-1': true, '1': true, '2': true });

/**
 * Basically this computed exist because it's needed to adjust selected data as flexible as possible.
 * Prioritize use value from selected tree node, if tree nodes were not selected then use value from props, if there's no props then it's empty array.
 *
 * @computed
 */
const actionValue = computed(() => {
  if (selectKeys.value.length) return selectKeys.value;
  if (props.selectedNodes?.length) {
    return props.selectedNodes.map((node) => node.key as number);
  }
  return [];
});

/**
 * Basically this computed exist because it's needed to adjust label text to what action value contains & selection mode.
 *
 * @computed
 */
const labelText = computed(() => {
  if (actionValue.value.length < 1) return `Select ${props.type}`;

  if (props.selectionMode === 'checkbox') {
    return `${
      actionValue.value.length
    } ${props.type.toLowerCase()}(s) selected`;
  }

  return selectName.value || props.selectedNodes?.at(0)?.name;
});

const setValidatorMessage = (value: number[]): boolean | string => {
  if (!value && props.mandatory) {
    return (
      props.validatorMessage ?? `You must pick a ${props.type.toLowerCase()}!`
    );
  } else if (props.validatorMessage) {
    return props.validatorMessage;
  }

  return true;
};

/**
 * Sets the initial checked state for the tree nodes based on the selected nodes and selection mode.
 * If the selection mode is "single", sets the checked state for the first selected node.
 * If the selection mode is "checkbox", traverses the tree and sets the checked state for each node based on the selected nodes.
 *
 * @returns {void}
 */
const setInitialChecked = (): void => {
  if (props.selectionMode === 'single') {
    selectedKeys.value[JSON.stringify(props.selectedNodes?.at(0)?.key)] = true;
  } else {
    const traverse = (nodes: TreeNode[], parentKey?: string): void => {
      nodes.forEach((node) => {
        const key = JSON.stringify(node.key);

        const allSelectedNodes =
          props.selectedNodes?.map((propsNode: TSTreeNode) => propsNode.key) ??
          [];

        const checked = allSelectedNodes.includes(Number(node.key));
        selectedKeys.value[key] = { checked };
        if (node.children?.length) traverse(node.children, key);
        if (parentKey) setInitialParent(parentKey);
      });
    };

    traverse(treeNodeOptions.value);
  }
};

/**
 * Sets the checked and partial checked state for the parent node based on the checked state of its children.
 *
 * @param {string} parentKey - The key of the parent node.
 * @returns {void}
 */
const setInitialParent = (parentKey: string): void => {
  selectedKeys.value[parentKey] = {
    checked: selectedKeys.value[parentKey].checked
      ? selectedKeys.value[parentKey].checked
      : isAllChildrenChecked(parentKey),
    partialChecked:
      !isAllChildrenChecked(parentKey) && isSomeChildrenChecked(parentKey),
  };
};

/**
 * Checks if all childrens of a parent node are checked.
 *
 * @param {string} parentKey - The key of the parent node.
 * @returns {boolean} - True if all children are checked, false otherwise.
 */
const isAllChildrenChecked = (parentKey: string): boolean => {
  return parents.value[parentKey]?.every((child: number) => {
    const childKey = JSON.stringify(child);
    return selectedKeys.value[childKey]?.checked;
  });
};

/**
 * Checks if some children(s) of a parent node are checked or partially checked.
 *
 * @param {string} parentKey - The key of the parent node.
 * @returns {boolean} - True if some children are checked or partially checked, false otherwise.
 */
const isSomeChildrenChecked = (parentKey: string): boolean => {
  return parents.value[parentKey]?.some((child: number) => {
    const childKey = JSON.stringify(child);

    return (
      selectedKeys.value[childKey]?.checked ||
      selectedKeys.value[childKey]?.partialChecked
    );
  });
};

/**
 * Maps the response data from the backend to a TreeNode array.
 * Sets the parent-child relationship between nodes and stores the parent keys in the "parents" ref object.
 *
 * @param {TreeNode[]} datas - The response data from the backend.
 * @returns {TreeNode[]} - The mapped TreeNode array.
 */
const responseMapping = (datas: TreeNode[]): TreeNode[] => {
  return datas.map((data) => {
    const mappedNode: TreeNode = {
      label: data.name,
      key: data.key,
      disabled: true,
    };

    if (data.children?.length) {
      parents.value = {
        ...parents.value,
        [data.key as string]: data.children.map((child) => Number(child.key)),
      };

      mappedNode.children = responseMapping(data.children);
    }

    return mappedNode;
  });
};

/**
 * Fetches the tree data from the backend and sets the treeNodeOptions value.
 * If there is an error, handles it using the handleError function from utils.
 * If there are selected nodes, sets the initial checked state for the tree nodes.
 *
 * @returns {Promise<void>}
 */
const fetchTree = async (): Promise<void> => {
  try {
    loading.value = true;

    const { data } =
      props.type === 'Category'
        ? await CategoriesServices.getCategories()
        : await GroupsServices.getGroups();

    if (data) treeNodeOptions.value = responseMapping(data.data);
  } catch (error) {
    console.log(error);
    handleError({
      toast,
      error,
      activity: `fetch ${props.type.toLowerCase()}`,
    });
  } finally {
    if (props.selectedNodes?.length) setInitialChecked();
    loading.value = false;
  }
};

/**
 * When click a selected node, then emit & change the button label based on selected node
 *
 * @param {TreeNode} e - The emitted event.
 * @returns {void}
 */
const selectionNameHandler = (e: TreeNode): void => {
  emit('keyChange', e);
  selectName.value = e.label ?? '';
};

/**
 * Prepares the data to be sent to the parent component.
 * Converts the checked state of the tree nodes to an array of numbers before emitting.
 *
 * @param {SelectedKeys | SelectedKey} e - The selected keys or key.
 * @returns {void}
 */
const selectionKeyHandler = (e: SelectedKeys | SelectedKey): void => {
  const selectKey: SelectedKeys | SelectedKey = e;

  if (props.selectionMode === 'checkbox') {
    selectKeys.value = getKeyMulti(selectKey as SelectedKeys);
  } else {
    selectKeys.value = [getKeySingle(selectKey as SelectedKey)];
  }
};

/**
 * Gets an array of numbers from an object of selected keys when the selection mode is "checkbox".
 *
 * @param {SelectedKeys} obj - The object of selected keys.
 * @returns {number[]} - The array of numbers.
 */
const getKeyMulti = (obj: SelectedKeys): number[] => {
  const result: number[] = [];

  for (const key in obj) {
    if (obj[key].checked === true) {
      result.push(Number(key));
    }
  }

  return result;
};

/**
 * Gets a single number from an object of selected key when the selection mode is "single".
 *
 * @param {SelectedKey} obj - The object of selected key.
 * @returns {number} - The number.
 */
const getKeySingle = (obj: SelectedKey): number => {
  let result!: number;

  for (const key in obj) {
    if (obj[key] === true) {
      result = Number(key);
    }
  }

  return result;
};

const onFilterKeydown = (event: KeyboardEvent): void => {
  if (event.key === 'Enter') {
    event.preventDefault();
  }
};

const handleShow = (): void => {
  if (treeNodeOptions.value.length < 1) fetchTree();
  showDialog.value = true;
};

/**
 * Handles the cancel action.
 * If there are selected nodes, sets the checked state for the tree nodes based on the selected nodes.
 * If there are no selected nodes, clears the checked state for all tree nodes.
 * Closes the modal.
 *
 * @returns {void}
 */
const handleCancel = (): void => {
  if (props.selectedNodes) {
    selectName.value = props.selectedNodes?.at(0)?.name ?? '';
    selectKeys.value = props.selectedNodes.map((node) => node.key as number);
    selectedKeys.value = {};
    setInitialChecked();
  } else {
    selectKeys.value = [];
    selectedKeys.value = {};
  }
};

/**
 * Handles every close action (close when cancel, close when submit, or close when click "X")
 * If the flag param is defined as submit then SelectTree won't reset value.
 * For every flag besides "submit", it'll considered as "cancel action" then will reset value.
 *
 * @param {string} flag - The state that decides what to do when close
 * @returns {void}
 */
const handleClose = (flag?: string): void => {
  if (flag !== 'submit') handleCancel();
  emit('update:show', false);
  showDialog.value = false;
};

const handleEmit = (): void => {
  emit('multiChange', selectKeys.value);
  field.value = selectKeys.value;
  handleClose('submit');
};

watch(
  () => props.show,
  (newValue) => {
    showDialog.value = newValue;
  }
);
</script>

<template>
  <div
    v-if="!props.hideButton"
    class="d-flex flex-column justify-content-center align-items-start gap-1"
    data-test="selecttree-button"
  >
    <label class="input_label">
      {{ type }}
      <span v-if="mandatory" class="text-danger">*</span>
      <i
        v-if="tooltip"
        v-tooltip="tooltip"
        class="pi pi-info-circle info-tooltip"
      />
    </label>
    <span
      v-if="actionValue.length > 0 && selectionMode === 'single' && labelText"
      class="d-flex align-items-center"
    >
      <NameContainer
        :name="labelText"
        @click="handleShow"
        class="styled-cursor-pointer"
      />
      <TSButton
        @click="handleShow"
        class="styled-font-16"
        icon="ri-edit-2-line"
        severity="primary"
        text-only
        type="button"
      />
    </span>
    <TSButton
      v-else
      :label="labelText"
      @click="handleShow"
      severity="primary"
      type="button"
    />
    <small
      id="dd-error"
      v-if="field.errorMessage"
      class="selecttree-validator-message"
    >
      {{ field.errorMessage }}
    </small>
  </div>
  <Dialog
    v-model:visible="showDialog"
    :closable="true"
    :draggable="false"
    :header="hideButton ? `Assign ${type}` : `Select ${type}`"
    :pt="{
      root: {
        style: 'width: 400px;',
      },
    }"
    @update:visible="
      {
        $emit('update:show', $event);
        handleClose();
      }
    "
    class="ts-selecttree-dialog"
    data-test="selecttree-dialog"
    modal
  >
    <div class="d-flex flex-column gap-3 ts-tree-container">
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
              (treeFilterValue = ''),
                tree && (tree.filterValue = treeFilterValue)
            "
            class="reset-filter ri-close-line"
          />
        </div>
      </div>
      <Tree
        ref="tree"
        v-model:selection-keys="selectedKeys"
        :class="{
          'p-disabled': disabled,
          'p-checkbox-disabled': disabled,
        }"
        :expanded-keys="initialExpandedKeys"
        :loading="loading"
        :meta-key-selection="true"
        :selection-mode="selectionMode"
        :value="treeNodeOptions"
        @node-select="selectionNameHandler"
        @update:selection-keys="selectionKeyHandler"
        class="w-full p-component ts-tree"
        filter-mode="lenient"
      >
        <template #togglericon>
          <i class="p-togglericon pi pi-chevron-right" />
        </template>
      </Tree>
    </div>
    <template #footer>
      <template v-if="!disabled">
        <TSButton @click="handleClose" label="Cancel" type="button" />
        <TSButton
          :label="hideButton ? 'Assign' : 'Select'"
          @click="handleEmit"
          severity="success"
          type="button"
        />
      </template>
      <template v-else>
        <TSButton @click="handleClose" label="Close" type="button" />
      </template>
    </template>
  </Dialog>
</template>

<style lang="scss">
@import 'rfs/scss';
@import 'var';

.styled-gap-10 {
  gap: 10px;
}

.selecttree-validator-message {
  color: $danger;
  font-weight: 300;
  width: 100%;
  text-align: right;
  font-size: 11.2px;
}

.styled-font-badge {
  font-size: 8.89px;
  font-style: normal;
  font-weight: 600;
  line-height: 12px; /* 134.983% */
  letter-spacing: 0.267px;
}

.styled-font-16 {
  font-size: 16px;
}

:deep(.ts-searchbox) {
  width: 100%;
}

:deep(.ts-searchbox-input) {
  width: 100% !important;
}

.ts-selecttree-dialog {
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

  .ts-tree-container {
    display: flex;
    flex-direction: column;
    gap: 12px;

    .p-disabled {
      opacity: 1;
    }
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
          color: $general-placeholder;
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

.styled-cursor-pointer {
  cursor: pointer;
}

button.ts-button > .ts-button-icon {
  font-size: 16px;
}

.info-tooltip {
  right: -4px;
  top: -4px;
  position: relative;
  color: $primary !important;
  font-size: 10px !important;
  &:hover {
    cursor: pointer;
  }
}
</style>
