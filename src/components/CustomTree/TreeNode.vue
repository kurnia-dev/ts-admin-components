<script>
/* eslint-disable vue/component-api-style */
import Ripple from 'primevue/ripple';
import { DomHandler } from 'primevue/utils';

export default {
  name: 'TreeNode',
  emits: ['node-toggle', 'node-click', 'checkbox-change', 'toggle-options'],
  props: {
    node: {
      type: null,
      default: null,
    },
    useCustomElement: {
      type: Boolean,
      default: false,
    },
    useOptions: {
      type: Boolean,
      default: false,
    },
    options: {
      type: null,
      default: null,
    },
    disabledKeys: {
      type: null,
      default: null,
    },
    expandedKeys: {
      type: null,
      default: null,
    },
    selectionKeys: {
      type: null,
      default: null,
    },
    selectionMode: {
      type: String,
      default: null,
    },
    templates: {
      type: null,
      default: null,
    },
    level: {
      type: Number,
      default: null,
    },
    index: {
      type: Number,
      default: null,
    },
  },
  data() {
    return {
      visibilityCustomEl: true,
    };
  },
  nodeTouched: false,
  mounted() {
    const hasTreeSelectParent = this.$refs.currentNode.closest(
      '.p-treeselect-items-wrapper'
    );

    if (hasTreeSelectParent) {
      this.setAllNodesTabIndexes();
    }
  },
  methods: {
    showCustomEl(mouseStatus) {
      if (mouseStatus === 'in') {
        if (this.useOptions) {
          this.visibilityCustomEl = false;
        }
        return;
      }
      this.visibilityCustomEl = true;
    },
    toggleOptions(event, node) {
      this.$emit('toggle-options', event, node);
    },
    toggle() {
      this.$emit('node-toggle', this.node);
    },
    label(node) {
      return typeof node.label === 'function' ? node.label() : node.label;
    },
    onChildNodeToggle(node) {
      this.$emit('node-toggle', node);
    },
    onClick(event, disabled = false) {
      const root = ['All', 'Semua', 'Ungroup'];
      if (
        root.includes(event.target.textContent) &&
        !this.isCheckboxSelectionMode()
      )
        return;
      if (
        DomHandler.hasClass(event.target, 'p-tree-toggler') ||
        DomHandler.hasClass(event.target.parentElement, 'p-tree-toggler')
      ) {
        return;
      }

      if (this.isCheckboxSelectionMode()) {
        if (!disabled) {
          this.toggleCheckbox();
        }
      } else {
        this.$emit('node-click', {
          originalEvent: event,
          nodeTouched: this.nodeTouched,
          node: this.node,
        });
      }

      this.nodeTouched = false;
    },
    onChildNodeClick(event) {
      this.$emit('node-click', event);
    },
    onTouchEnd() {
      this.nodeTouched = true;
    },
    onKeyDown(event) {
      if (!this.isSameNode(event)) return;

      switch (event.code) {
        case 'Tab':
          this.onTabKey(event);

          break;

        case 'ArrowDown':
          this.onArrowDown(event);

          break;

        case 'ArrowUp':
          this.onArrowUp(event);

          break;

        case 'ArrowRight':
          this.onArrowRight(event);

          break;

        case 'ArrowLeft':
          this.onArrowLeft(event);

          break;

        case 'Enter':
        case 'Space':
          this.onEnterKey(event);

          break;

        default:
          break;
      }
    },
    onArrowDown(event) {
      const nodeElement = event.target;
      const listElement = nodeElement.children[1];

      if (listElement) {
        this.focusRowChange(nodeElement, listElement.children[0]);
      } else {
        if (nodeElement.nextElementSibling) {
          this.focusRowChange(nodeElement, nodeElement.nextElementSibling);
        } else {
          let nextSiblingAncestor = this.findNextSiblingOfAncestor(nodeElement);

          if (nextSiblingAncestor) {
            this.focusRowChange(nodeElement, nextSiblingAncestor);
          }
        }
      }

      event.preventDefault();
    },
    onArrowUp(event) {
      const nodeElement = event.target;

      if (nodeElement.previousElementSibling) {
        this.focusRowChange(
          nodeElement,
          nodeElement.previousElementSibling,
          this.findLastVisibleDescendant(nodeElement.previousElementSibling)
        );
      } else {
        let parentNodeElement = this.getParentNodeElement(nodeElement);

        if (parentNodeElement) {
          this.focusRowChange(nodeElement, parentNodeElement);
        }
      }

      event.preventDefault();
    },
    onArrowRight(event) {
      if (this.leaf || this.expanded) return;

      event.currentTarget.tabIndex = -1;

      this.$emit('node-toggle', this.node);
      this.$nextTick(() => {
        this.onArrowDown(event);
      });
    },
    onArrowLeft(event) {
      const togglerElement = DomHandler.findSingle(
        event.currentTarget,
        '.p-tree-toggler'
      );

      if (this.level === 0 && !this.expanded) {
        return false;
      }

      if (this.expanded && !this.leaf) {
        togglerElement.click();

        return false;
      }

      const target = this.findBeforeClickableNode(event.currentTarget);

      if (target) {
        this.focusRowChange(event.currentTarget, target);
      }
    },
    onEnterKey(event) {
      this.setTabIndexForSelectionMode(event, this.nodeTouched);
      this.onClick(event);

      event.preventDefault();
    },
    onTabKey() {
      this.setAllNodesTabIndexes();
    },
    setAllNodesTabIndexes() {
      const nodes = DomHandler.find(
        this.$refs.currentNode.closest('.p-tree-container'),
        '.p-treenode'
      );

      const hasSelectedNode = [...nodes].some(
        (node) =>
          node.getAttribute('aria-selected') === 'true' ||
          node.getAttribute('aria-checked') === 'true'
      );

      [...nodes].forEach((node) => {
        node.tabIndex = -1;
      });

      if (hasSelectedNode) {
        const selectedNodes = [...nodes].filter(
          (node) =>
            node.getAttribute('aria-selected') === 'true' ||
            node.getAttribute('aria-checked') === 'true'
        );

        selectedNodes[0].tabIndex = 0;

        return;
      }

      [...nodes][0].tabIndex = 0;
    },
    setTabIndexForSelectionMode(event, nodeTouched) {
      if (this.selectionMode !== null) {
        const elements = [
          ...DomHandler.find(
            this.$refs.currentNode.parentElement,
            '.p-treenode'
          ),
        ];

        event.currentTarget.tabIndex = nodeTouched === false ? -1 : 0;

        if (elements.every((element) => element.tabIndex === -1)) {
          elements[0].tabIndex = 0;
        }
      }
    },
    focusRowChange(
      firstFocusableRow,
      currentFocusedRow,
      lastVisibleDescendant
    ) {
      firstFocusableRow.tabIndex = '-1';
      currentFocusedRow.tabIndex = '0';

      this.focusNode(lastVisibleDescendant || currentFocusedRow);
    },
    findBeforeClickableNode(node) {
      const parentListElement = node.closest('ul').closest('li');

      if (parentListElement) {
        const prevNodeButton = DomHandler.findSingle(
          parentListElement,
          'button'
        );

        if (prevNodeButton && prevNodeButton.style.visibility !== 'hidden') {
          return parentListElement;
        }

        return this.findBeforeClickableNode(node.previousElementSibling);
      }

      return null;
    },
    toggleCheckbox() {
      let _selectionKeys = this.selectionKeys ? { ...this.selectionKeys } : {};
      const _check = !this.checked;

      this.propagateDown(this.node, _check, _selectionKeys);

      this.$emit('checkbox-change', {
        node: this.node,
        check: _check,
        selectionKeys: _selectionKeys,
      });
    },
    propagateDown(node, check, selectionKeys) {
      if (check)
        selectionKeys[node.key] = { checked: true, partialChecked: false };
      else delete selectionKeys[node.key];

      if (node.children && node.children.length) {
        for (let child of node.children) {
          this.propagateDown(child, check, selectionKeys);
        }
      }
    },
    propagateUp(event) {
      let check = event.check;
      let _selectionKeys = { ...event.selectionKeys };
      let checkedChildCount = 0;
      let childPartialSelected = false;

      for (let child of this.node.children) {
        if (_selectionKeys[child.key] && _selectionKeys[child.key].checked)
          checkedChildCount++;
        else if (
          _selectionKeys[child.key] &&
          _selectionKeys[child.key].partialChecked
        )
          childPartialSelected = true;
      }

      if (check && checkedChildCount === this.node.children.length) {
        _selectionKeys[this.node.key] = {
          checked: true,
          partialChecked: false,
        };
      } else {
        if (!check) {
          delete _selectionKeys[this.node.key];
        }

        if (
          childPartialSelected ||
          (checkedChildCount > 0 &&
            checkedChildCount !== this.node.children.length)
        )
          _selectionKeys[this.node.key] = {
            checked: false,
            partialChecked: true,
          };
        else delete _selectionKeys[this.node.key];
      }

      this.$emit('checkbox-change', {
        node: event.node,
        check: event.check,
        selectionKeys: _selectionKeys,
      });
    },
    onChildCheckboxChange(event) {
      this.$emit('checkbox-change', event);
    },
    findNextSiblingOfAncestor(nodeElement) {
      let parentNodeElement = this.getParentNodeElement(nodeElement);

      if (parentNodeElement) {
        if (parentNodeElement.nextElementSibling)
          return parentNodeElement.nextElementSibling;
        else return this.findNextSiblingOfAncestor(parentNodeElement);
      } else {
        return null;
      }
    },
    findLastVisibleDescendant(nodeElement) {
      const childrenListElement = nodeElement.children[1];

      if (childrenListElement) {
        const lastChildElement =
          childrenListElement.children[childrenListElement.children.length - 1];

        return this.findLastVisibleDescendant(lastChildElement);
      } else {
        return nodeElement;
      }
    },
    getParentNodeElement(nodeElement) {
      const parentNodeElement = nodeElement.parentElement.parentElement;

      return DomHandler.hasClass(parentNodeElement, 'p-treenode')
        ? parentNodeElement
        : null;
    },
    focusNode(element) {
      element.focus();
    },
    isCheckboxSelectionMode() {
      return this.selectionMode === 'checkbox';
    },
    isSameNode(event) {
      return (
        event.currentTarget &&
        (event.currentTarget.isSameNode(event.target) ||
          event.currentTarget.isSameNode(event.target.closest('.p-treenode')))
      );
    },
  },
  computed: {
    hasChildren() {
      return this.node.children && this.node.children.length > 0;
    },
    expanded() {
      return this.expandedKeys && this.expandedKeys[this.node.key] === true;
    },
    leaf() {
      return this.node.leaf === false
        ? false
        : !(this.node.children && this.node.children.length);
    },
    selectable() {
      return this.node.selectable === false
        ? false
        : this.selectionMode != null;
    },
    selected() {
      return this.selectionMode && this.selectionKeys
        ? this.selectionKeys[this.node.key] === true
        : false;
    },
    containerClass() {
      return ['p-treenode', { 'p-treenode-leaf': this.leaf }];
    },
    contentClass() {
      return [
        'p-treenode-content',
        this.node.styleClass,
        {
          'p-treenode-selectable': this.selectable,
          'p-highlight': this.checkboxMode ? this.checked : this.selected,
        },
      ];
    },
    icon() {
      return ['p-treenode-icon', this.node.icon];
    },
    toggleIcon() {
      return [
        'p-tree-toggler-icon pi pi-fw',
        this.expanded
          ? this.node.expandedIcon || 'pi-chevron-down'
          : this.node.collapsedIcon || 'pi-chevron-right',
      ];
    },
    checkboxClass() {
      return [
        'p-checkbox-box',
        { 'p-highlight': this.checked, 'p-indeterminate': this.partialChecked },
      ];
    },
    checkboxIcon() {
      return [
        'p-checkbox-icon',
        { 'pi pi-check': this.checked, 'pi pi-minus': this.partialChecked },
      ];
    },
    checkboxMode() {
      return (
        this.selectionMode === 'checkbox' && this.node.selectable !== false
      );
    },
    checked() {
      return this.selectionKeys
        ? this.selectionKeys[this.node.key] &&
            this.selectionKeys[this.node.key].checked
        : false;
    },
    partialChecked() {
      return this.selectionKeys
        ? this.selectionKeys[this.node.key] &&
            this.selectionKeys[this.node.key].partialChecked
        : false;
    },
    ariaChecked() {
      return this.selectionMode === 'single' ||
        this.selectionMode === 'multiple'
        ? this.selected
        : undefined;
    },
    ariaSelected() {
      return this.checkboxMode ? this.checked : undefined;
    },
  },
  directives: {
    ripple: Ripple,
  },
};
</script>

<template>
  <li
    ref="currentNode"
    :class="containerClass"
    role="treeitem"
    :aria-label="label(node)"
    :aria-selected="ariaSelected"
    :aria-expanded="expanded"
    :aria-setsize="node.children ? node.children.length : 0"
    :aria-posinset="index + 1"
    :aria-level="level"
    :aria-checked="ariaChecked"
    :tabindex="index === 0 ? 0 : -1"
    @keydown="onKeyDown"
  >
    <div
      :class="contentClass"
      @touchend="onTouchEnd"
      :style="node.style"
      style="height: 25.6px"
      @mouseenter="showCustomEl('in')"
      @mouseleave="showCustomEl('out')"
    >
      <button
        v-ripple
        type="button"
        class="p-tree-toggler p-link"
        @click="toggle"
        tabindex="-1"
        aria-hidden="true"
      >
        <span :class="toggleIcon"></span>
      </button>
      <div
        v-if="checkboxMode"
        @click="
          onClick($event, disabledKeys && disabledKeys.includes(node.key))
        "
        class="p-checkbox p-component"
        aria-hidden="true"
        :class="
          disabledKeys && disabledKeys.includes(node.key)
            ? 'p-checkbox-disabled'
            : ''
        "
      >
        <div :class="checkboxClass" role="checkbox">
          <span :class="checkboxIcon"></span>
        </div>
      </div>
      <span
        v-if="node.icon"
        :class="icon"
        style="font-size: 14px; margin-right: 8px"
      ></span>
      <span v-if="checkboxMode" class="p-treenode-label">
        <component
          v-if="templates[node.type] || templates['default']"
          :is="templates[node.type] || templates['default']"
          :node="node"
        />
        <!-- <template v-else>{{ label(node) }}</template> -->
        <div class="d-flex align-items-center">
          <div
            class="label-container hola-check"
            @click="
              onClick($event, disabledKeys && disabledKeys.includes(node.key))
            "
          >
            {{ node.label || node.name }}
          </div>
          <div
            v-if="useCustomElement && visibilityCustomEl"
            class="custom-element d-flex align-items-center justify-content-center"
          >
            <slot name="custom-element" :data="node" check="check"></slot>
          </div>
          <div
            v-if="useOptions && !visibilityCustomEl"
            class="ellipsis-container"
            style=""
          >
            <Button
              icon="pi pi-ellipsis-h"
              class="ellipsis-button dropdown-toggle"
              severity="secondary"
              text
              @click="$emit('toggle-options', $event, node)"
            />
            <!-- <div v-else class="" style="width: 25.6px; height: 25.6px"></div> -->
          </div>
          <!-- <div v-else class="" style="width: 25.6px; height: 25.6px"></div> -->
        </div>
      </span>
      <span v-else class="p-treenode-label">
        <component
          v-if="templates[node.type] || templates['default']"
          :is="templates[node.type] || templates['default']"
          :node="node"
        />
        <!-- <template v-else>{{ label(node) }}</template> -->
        <div class="d-flex align-items-center">
          <div class="label-container" @click="onClick">
            {{ node.label || node.name }}
          </div>
          <div
            v-if="useCustomElement && visibilityCustomEl"
            class="custom-element d-flex align-items-center justify-content-center"
          >
            <slot name="custom-element" :data="node" check="check"></slot>
          </div>
          <div
            v-if="useOptions && !visibilityCustomEl"
            class="ellipsis-container"
            style=""
          >
            <Button
              icon="pi pi-ellipsis-h"
              class="ellipsis-button dropdown-toggle"
              severity="secondary"
              text
              @click="$emit('toggle-options', $event, node)"
            />
          </div>
          <!-- <div v-else class="" style="width: 25.6px; height: 25.6px"></div> -->
        </div>
      </span>
    </div>
    <ul v-if="hasChildren && expanded" class="p-treenode-children" role="group">
      <TreeNode
        v-for="childNode of node.children"
        :key="childNode.key"
        :node="childNode"
        :templates="templates"
        :level="level + 1"
        :expandedKeys="expandedKeys"
        @node-toggle="onChildNodeToggle"
        @node-click="onChildNodeClick"
        :selectionMode="selectionMode"
        :selectionKeys="selectionKeys"
        :useOptions="useOptions"
        :useCustomElement="useCustomElement"
        @checkbox-change="propagateUp"
        @toggle-options="toggleOptions"
        :disabled-keys="disabledKeys"
      >
        <template #custom-element="{ data }" v-if="useCustomElement">
          <slot name="custom-element" :data="data" check="check"></slot>
        </template>
      </TreeNode>
    </ul>
  </li>
</template>

<style lang="scss" scoped>
.v-none {
  visibility: none !important;
}
.label-container {
  width: 100%;
  text-wrap: nowrap;
}

.custom-element {
  // right: 10px;
  // position: absolute;
  right: 0px;
  position: sticky;
  visibility: visible;
  // width: 26px;
  // height: 26px;
}

.ellipsis-container {
  // right: 10px;
  // position: absolute;
  right: 0px;
  position: sticky;
  visibility: hidden;
}

.ellipsis-button {
  width: 16px;
  height: 16px;
  padding: 12px;
}

.p-tree .p-tree-container .p-treenode .p-treenode-content:hover {
  .ellipsis-container {
    visibility: visible;
  }
}
.dropdown-toggle::after {
  display: none;
}
</style>
