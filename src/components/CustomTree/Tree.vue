<script setup>
/* eslint-disable vue/component-api-style */
import { useAttrs } from 'vue';

const attrs = useAttrs();
const toggleOptions = (event, node) => {
  attrs['onToggleOptions'](event, node);
};
</script>

<script>
import { ObjectUtils } from 'primevue/utils';
import TreeNode from './TreeNode.vue';

export default {
  name: 'Tree',
  emits: [
    'node-expand',
    'node-collapse',
    'update:expandedKeys',
    'update:selectionKeys',
    'node-select',
    'node-unselect',
    'toggle-search-bar',
  ],
  props: {
    'useOptions': {
      type: Boolean,
      default: false,
    },
    'useCustomElement': {
      type: Boolean,
      default: false,
    },
    'value': {
      type: null,
      default: null,
    },
    'expandedKeys': {
      type: null,
      default: null,
    },
    'selectionKeys': {
      type: null,
      default: null,
    },
    'selectionMode': {
      type: String,
      default: null,
    },
    'metaKeySelection': {
      type: Boolean,
      default: true,
    },
    'loading': {
      type: Boolean,
      default: false,
    },
    'loadingIcon': {
      type: String,
      default: 'pi pi-spinner',
    },
    'filter': {
      type: Boolean,
      default: false,
    },
    'filterBy': {
      type: String,
      default: 'label',
    },
    'filterMode': {
      type: String,
      default: 'lenient',
    },
    'filterPlaceholder': {
      type: String,
      default: null,
    },
    'filterLocale': {
      type: String,
      default: undefined,
    },
    'scrollHeight': {
      type: String,
      default: null,
    },
    'level': {
      type: Number,
      default: 0,
    },
    'aria-labelledby': {
      type: String,
      default: null,
    },
    'aria-label': {
      type: String,
      default: null,
    },
    'options': {
      type: null,
      default: null,
    },
  },
  data() {
    return {
      d_expandedKeys: this.expandedKeys || {},
      filterValue: null,
    };
  },
  watch: {
    expandedKeys(newValue) {
      this.d_expandedKeys = newValue;
    },
  },
  methods: {
    onNodeToggle(node) {
      const key = node.key;

      if (this.d_expandedKeys[key]) {
        delete this.d_expandedKeys[key];
        this.$emit('node-collapse', node);
      } else {
        this.d_expandedKeys[key] = true;
        this.$emit('node-expand', node);
      }

      this.d_expandedKeys = { ...this.d_expandedKeys };
      this.$emit('update:expandedKeys', this.d_expandedKeys);
    },
    onNodeClick(event) {
      if (this.selectionMode != null && event.node.selectable !== false) {
        const metaSelection = event.nodeTouched ? false : this.metaKeySelection;
        const _selectionKeys = metaSelection
          ? this.handleSelectionWithMetaKey(event)
          : this.handleSelectionWithoutMetaKey(event);

        this.$emit('update:selectionKeys', _selectionKeys);
      }
    },
    onCheckboxChange(event) {
      this.$emit('update:selectionKeys', event.selectionKeys);

      if (event.check) this.$emit('node-select', event.node);
      else this.$emit('node-unselect', event.node);
    },
    handleSelectionWithMetaKey(event) {
      const originalEvent = event.originalEvent;
      const node = event.node;
      const metaKey = originalEvent.metaKey || originalEvent.ctrlKey;
      const selected = this.isNodeSelected(node);
      let _selectionKeys;

      if (selected && metaKey) {
        _selectionKeys = this.handleSelectedNodeWithMetaKey(node);
      } else {
        _selectionKeys = this.handleUnselectedNodeWithMetaKey(node, metaKey);
      }

      return _selectionKeys;
    },

    handleSelectedNodeWithMetaKey(node) {
      let _selectionKeys;

      if (this.isSingleSelectionMode()) {
        _selectionKeys = {};
      } else {
        _selectionKeys = { ...this.selectionKeys };
        delete _selectionKeys[node.key];
      }

      this.$emit('node-unselect', node);

      return _selectionKeys;
    },

    handleUnselectedNodeWithMetaKey(node, metaKey) {
      let _selectionKeys;

      if (this.isSingleSelectionMode()) {
        _selectionKeys = {};
      } else if (this.isMultipleSelectionMode()) {
        _selectionKeys = this.handleMultipleSelection(metaKey);
      }

      _selectionKeys[node.key] = true;
      this.$emit('node-select', node);

      return _selectionKeys;
    },

    handleMultipleSelection(metaKey) {
      let _selectionKeys;

      if (!metaKey) {
        _selectionKeys = {};
      } else {
        _selectionKeys = this.selectionKeys ? { ...this.selectionKeys } : {};
      }

      return _selectionKeys;
    },
    handleSelectionWithoutMetaKey(event) {
      const node = event.node;
      const selected = this.isNodeSelected(node);
      let _selectionKeys;

      if (this.isSingleSelectionMode()) {
        if (selected) {
          _selectionKeys = {};
          this.$emit('node-unselect', node);
        } else {
          _selectionKeys = {};
          _selectionKeys[node.key] = true;
          this.$emit('node-select', node);
        }
      } else {
        // This block has Refactored due to 
        // ""'If' statement should not be the only statement in 'else' 
        // blocksonarlint(javascript:S6660)"
        const doIfSelected = () => {
          _selectionKeys = { ...this.selectionKeys };
          delete _selectionKeys[node.key];

          this.$emit('node-unselect', node);
        }

        const doOtherwise= () => {
          _selectionKeys = this.selectionKeys ? { ...this.selectionKeys } : {};
          _selectionKeys[node.key] = true;

          this.$emit('node-select', node);
        }

        selected ? doIfSelected() : doOtherwise();
      }

      return _selectionKeys;
    },
    isSingleSelectionMode() {
      return this.selectionMode === 'single';
    },
    isMultipleSelectionMode() {
      return this.selectionMode === 'multiple';
    },
    isNodeSelected(node) {
      return this.selectionMode && this.selectionKeys
        ? this.selectionKeys[node.key] === true
        : false;
    },
    isChecked(node) {
      return this.selectionKeys?.[node.key]?.checked ?? false;
    },
    isNodeLeaf(node) {
      return node.leaf || !node.children?.length;
    },
    onFilterKeydown(event) {
      if (event.which === 13) {
        event.preventDefault();
      }
    },
    findFilteredNodes(node, paramsWithoutNode) {
      if (node) {
        let matched = false;

        if (node.children) {
          let childNodes = [...node.children];

          node.children = [];

          for (let childNode of childNodes) {
            let copyChildNode = { ...childNode };

            if (this.isFilterMatched(copyChildNode, paramsWithoutNode)) {
              matched = true;
              node.children.push(copyChildNode);
            }
          }
        }

        if (matched) {
          return true;
        }
      }
    },
    isFilterMatched(node, { searchFields, filterText, strict }) {
      let matched = false;

      for (let field of searchFields) {
        let fieldValue = String(
          ObjectUtils.resolveFieldData(node, field)
        ).toLocaleLowerCase(this.filterLocale);

        if (fieldValue.indexOf(filterText) > -1) {
          matched = true;
        }
      }

      if (!matched || (strict && !this.isNodeLeaf(node))) {
        matched =
          this.findFilteredNodes(node, { searchFields, filterText, strict }) ||
          matched;
      }

      return matched;
    },
  },
  computed: {
    containerClass() {
      return [
        'p-tree p-component',
        {
          'p-tree-selectable': this.selectionMode != null,
          'p-tree-loading': this.loading,
          'p-tree-flex-scrollable': this.scrollHeight === 'flex',
        },
      ];
    },
    loadingIconClass() {
      return ['p-tree-loading-icon pi-spin', this.loadingIcon];
    },
    filteredValue() {
      let filteredNodes = [];
      const searchFields = this.filterBy.split(',');
      const filterText = this.filterValue
        .trim()
        .toLocaleLowerCase(this.filterLocale);
      const strict = this.filterMode === 'strict';

      for (let node of this.value) {
        let _node = { ...node };
        let paramsWithoutNode = { searchFields, filterText, strict };

        if (
          (strict &&
            (this.findFilteredNodes(_node, paramsWithoutNode) ||
              this.isFilterMatched(_node, paramsWithoutNode))) ||
          (!strict &&
            (this.isFilterMatched(_node, paramsWithoutNode) ||
              this.findFilteredNodes(_node, paramsWithoutNode)))
        ) {
          filteredNodes.push(_node);
        }
      }

      return filteredNodes;
    },
    valueToRender() {
      if (this.filterValue && this.filterValue.trim().length > 0)
        return this.filteredValue;
      else return this.value;
    },
  },
  components: {
    TreeNode: TreeNode,
  },
};
</script>

<template>
  <div :class="containerClass">
    <template v-if="loading">
      <div class="loader">
        <Icon width="22" height="22" icon="line-md:loading-twotone-loop" />
      </div>
    </template>
    <template v-else>
      <div class="p-tree-filter-container">
        <div class="tree-search-bar">
          <span class="w-100 p-input-icon-left flex-fill">
            <Icon width="14" height="14" icon="ri-search-2-line" />
            <InputText
              v-model="filterValue"
              autocomplete="off"
              class="p-tree-filter"
              :placeholder="filterPlaceholder"
              @keydown="onFilterKeydown"
            />
          </span>
          <Icon class="reset-filter" v-show="filterValue" icon="ri:close-line" @click="filterValue = ''" />
        </div>
      </div>
      <div class="p-tree-wrapper" :style="{ maxHeight: scrollHeight }">
        <ul
          class="p-tree-container"
          role="tree"
          :aria-labelledby="ariaLabelledby"
          :aria-label="ariaLabel"
        >
          <TreeNode
            v-for="(node, index) of valueToRender"
            :key="node.key"
            :node="node"
            :templates="$slots"
            :level="level + 1"
            :index="index"
            :expandedKeys="d_expandedKeys"
            @node-toggle="onNodeToggle"
            @node-click="onNodeClick"
            :selectionMode="selectionMode"
            :selectionKeys="selectionKeys"
            @checkbox-change="onCheckboxChange"
            :useOptions="useOptions"
            :useCustomElement="useCustomElement"
            @toggle-options="toggleOptions"
            :disabled-keys="$attrs['disabled-keys']"
          >
            <template #custom-element="{ data }" v-if="useCustomElement">
              <slot name="custom-element" :data="data" hola="haduh"></slot>
            </template>
          </TreeNode>
        </ul>
      </div>
    </template>
  </div>
</template>

<style lang="scss">
@import '~rfs/scss';

.p-tree-container,
.p-treenode-children {
  margin: 0;
  padding: 0;
  list-style-type: none;
  overflow: hidden;
}

.p-treenode-children {
  overflow: hidden;
}

.tree-search-bar {
  @include font-size(11.2px);
  .p-inputtext {
    padding-left: 32px;
    @include padding-top(10px);
    @include padding-bottom(10px);
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

.label-container,
.p-tree-filter {
  width: 100%;
}

.ellipsis-container {
  right: 0px;
  position: sticky;
  visibility: hidden;
}

.ellipsis-button,
.p-tree-toggler {
  width: 16px;
  height: 16px;
  padding: 12px;
}

.p-tree {
  border: 0;
  padding: 0 !important;
  @include font-size(11.2px);
  font-weight: 500;
  .p-tree-container {
    width: 100%;
    display: table;
    .p-treenode {
      padding: 0;
      .p-treenode-content {
        padding: 0;
        .p-tree-toggler {
          @include margin-right(2px);
        }
        .p-treenode-label {
          width: 100%;
        }
        .p-link:focus {
          box-shadow: none;
        }
        .p-treenode-icon {
          margin: 0;
        }
        .pi-fw,
        .pi-ellipsis-h {
          @include font-size(8.5px);
        }
      }
    }
  }
  .p-treenode-children {
    @include padding(0 0 0 10px);
  }
}

.p-tree .p-tree-container .p-treenode .p-treenode-content:hover {
  .ellipsis-container {
    visibility: visible;
  }
}

.dropdown-toggle::after {
  display: none;
}

.p-tree-wrapper,
.p-tree-flex-scrollable {
  overflow: auto;
}

.p-treenode-selectable,
.p-tree-toggler {
  cursor: pointer;
  user-select: none;
}

.p-treenode-leaf > .p-treenode-content .p-tree-toggler {
  visibility: hidden;
}

.p-treenode-content {
  display: flex;
  align-items: center;
}

.p-tree-filter-container {
  position: relative;
  display: block;
  width: 100%;
  margin-bottom: 0.75rem !important;
}

.p-tree-filter-icon,
.reset-filter {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
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
