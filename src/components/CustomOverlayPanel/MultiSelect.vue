<script lang="ts" setup>
import { ref, onMounted, useAttrs, watch } from 'vue';
import OverlayPanel from './OverlayPanel.vue';

const attrs: any = useAttrs();

onMounted(() => {
  // console.log('attrs', attrs);
  getSelected();
});

const props = defineProps<{
  placeholder?: string;
  context?: string;
  confirmLabel?: string;
}>();

const emit = defineEmits<{
  (e: 'update:selectedItems', data: any): void;
}>();

const op = ref();
const selectedItems = ref<any[]>([]);
const showRemoveConfirm = ref(false);
const willBeRemoveItem = ref<any>({});

const toggleOP = (event: any) => op.value.toggle(event);

const getSelected = () => {
  if (attrs.optionValue) {
    selectedItems.value = attrs.options.filter((option: any) =>
      attrs.selectedItems.includes(option[attrs.optionValue])
    );
    return;
  }
  selectedItems.value = [...attrs.selectedItems];
};

const openRemoveConfirm = (item: any) => {
  willBeRemoveItem.value = item;
  showRemoveConfirm.value = true;
};

const removeItem = () => {
  if (attrs.optionValue) {
    const filteredItems = selectedItems.value
      .map((item: any) => item[attrs.optionValue])
      .filter(
        (itemValue: any) =>
          itemValue !== willBeRemoveItem.value[attrs.optionValue]
      );
    // attrs['onUpdate:selectedItems'](filteredItems);
    emit('update:selectedItems', filteredItems);
  } else {
    const foundIndex = selectedItems.value.findIndex(
      (item: any) =>
        item[attrs.dataKey] === willBeRemoveItem.value[attrs.dataKey]
    );
    if (typeof foundIndex == 'number') {
      const filteredItems = [...selectedItems.value];
      filteredItems.splice(foundIndex, 1);
      // attrs['onUpdate:selectedItems'](filteredItems);
      emit('update:selectedItems', filteredItems);
    }
  }
  showRemoveConfirm.value = false;
};

watch(
  () => attrs,
  (newVal: any) => {
    getSelected();
  },
  { deep: true }
);
</script>

<template>
  <div
    class="d-flex align-items-center"
    :class="{ 'text-muted': ($attrs as any).disabled }"
  >
    <Button
      icon="ri-add-line"
      style="margin: 0 24px"
      @click="toggleOP"
      :disabled="($attrs as any).disabled"
    />
    <div
      v-if="($attrs as any).selectedItems.length"
      class="d-flex align-items-center flex-wrap gap-2"
    >
      <div
        v-for="(item, index) in selectedItems"
        :key="index"
        class="border border-primary text-primary d-flex align-items-center name-container bg-primary-weak"
        :class="{
          'text-muted': ($attrs as any).disabled,
          'border-muted': ($attrs as any).disabled,
        }"
      >
        <span style="padding-left: 2px">{{ item[attrs.optionLabel] }}</span>
        <Button
          icon="ri-close-line"
          class="remove-btn"
          @click="openRemoveConfirm(item)"
          text
          rounded
          :disabled="($attrs as any).disabled"
        />
      </div>
    </div>
    <span v-else>{{ props.placeholder }}</span>

    <OverlayPanel
      ref="op"
      v-bind="$attrs"
      @update:selected-items="emit('update:selectedItems', $event)"
    />

    <Dialog
      v-model:visible="showRemoveConfirm"
      modal
      header="Remove User"
      :style="{ width: '400px' }"
      :closable="false"
    >
      <template #header>
        <div class="d-flex align-items-center">
          <i class="ri-error-warning-line text-danger"></i>
          <span class="p-dialog-title">
            <!-- props -->
            Remove User
          </span>
        </div>
      </template>
      <div class="">
        <ul>
          <li>{{ willBeRemoveItem[attrs.optionLabel] }}</li>
        </ul>
      </div>
      <div class="" style="margin: 12px 0">
        {{ props.context || 'Are you sure want to delete this user?' }}
      </div>
      <div class="col-12 d-flex justify-content-end">
        <Button
          label="Cancel"
          text
          class="mx-3"
          severity="secondary"
          @click="showRemoveConfirm = false"
        />
        <Button
          :label="props.confirmLabel || 'Yes, Delete'"
          severity="danger"
          @click="removeItem"
        />
      </div>
    </Dialog>
  </div>
</template>

<style lang="scss" scoped>
@import '~rfs/scss';

.name-container {
  @include padding(4px);
  @include font-size(9px);
  border-radius: 4px;
}
.remove-btn {
  min-width: 16px !important;
  width: 16px !important;
  height: 16px !important;
  margin-left: 3px;
}
.border-muted {
  border-color: rgba(59, 130, 246, 0.3) !important;
}
</style>
