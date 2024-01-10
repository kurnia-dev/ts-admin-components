<script setup lang="ts">
import { computed, ref } from 'vue';
import Button from './Button.vue';
import Menu from 'primevue/menu';
import { MenuOption } from '@/types/options';

const props = defineProps<{
  selectedDatas: object[];
  options: MenuOption[];
  disabled?: boolean;
  naming?: string;
}>();

defineEmits<{
  apply: [];
}>();

const menu = ref<Menu>();
const selectedOption = ref<MenuOption>();

const label = computed(() => selectedOption.value?.label ?? 'Bulk action');
const command = computed(() => selectedOption.value?.command);
const disabled = computed(() => props.disabled);

const severity = computed(() => {
  return selectedOption.value ? 'primary' : undefined;
});

const toggleMenu = (e: Event): void => {
  menu.value?.toggle(e);
};
</script>

<template>
  <div class="ts-bulkaction">
    <Button
      :label="label"
      :disabled="!selectedDatas.length || disabled"
      @click="toggleMenu"
      class="ts-bulkaction-button"
      :severity="severity"
      icon="pi pi-angle-down"
      icon-pos="right"
      outlined
    />
    <Menu
      ref="menu"
      v-if="selectedDatas.length"
      :model="options"
      :popup="true"
      class="ts-bulkaction-menu"
    >
      <template #item="{ item }">
        <div
          :class="{ 'text-danger': item.danger }"
          class="ts-bulkaction-menu-item"
          @click.stop="(selectedOption = item as MenuOption), toggleMenu($event)"
        >
          <i :class="item.icon" />
          <span>{{ item?.label }}</span>
        </div>
      </template>
    </Menu>
    <slot name="addition" />
    <template v-if="selectedDatas.length && selectedOption">
      <Button
        @click="
          command?.({ originalEvent: $event, item: selectedOption }),
            (selectedOption = undefined),
          $emit('apply')
        "
        label="Apply"
        severity="primary"
      />
    </template>
    <span v-show="selectedDatas.length" class="ts-selection-message">
      {{ selectedDatas.length }} {{ naming ?? 'Data(s)' }} Selected
    </span>
  </div>
</template>

<style lang="scss">
@import 'scss/var';

.ts-bulkaction {
  display: flex;
  gap: 8px;
  align-items: baseline;
  color: $general-body;

  .ts-bulkaction-button {
    height: 26px;
    align-items: flex-end;

    .ts-button-icon {
      font-size: 10.2px;
    }
  }

  .ts-bulkaction-button:disabled {
    opacity: 0.6;
    cursor: default;
  }

  .ts-selection-message {
    width: max-content;
    text-transform: capitalize;
    font-size: 11.2px;
  }
}

.ts-bulkaction-menu {
  .p-menuitem-content {
    padding: 0 !important;

    .ts-bulkaction-menu-item {
      width: 100%;
      cursor: pointer;
      display: flex;
      padding: 5.5px 16px;
      align-items: center;
      gap: 8px;
    }
  }
}
</style>
