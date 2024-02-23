<script lang="ts" setup>
import { withDefaults, useSlots } from 'vue';
import Button from '../TSButtons/Button.vue';

type Severity = 'success' | 'danger';

const props = withDefaults(
  defineProps<{
    header: string;
    severity: Severity;
    icon?: string;
    lists?: string[] | object[];
    listLabel?: string;
    body?: string;
    closeAfterConfirm?: boolean;
    closable?: boolean;
    confirmLabel?: string;
    cancelLabel?: string;
  }>(),
  {
    cancelLabel: 'Cancel',
    confirmLabel: 'Yes, Continue',
    closeAfterConfirm: true,
    closable: true,
  }
);

const emit = defineEmits<{
  'confirm': [data?: any[]];
  'update:visible': [state: boolean];
}>();

const slots = useSlots();

const closeDialog = (): void => emit('update:visible', false);

const confirm = (): void => {
  emit('confirm', props.lists);
  props.closeAfterConfirm && closeDialog();
};
</script>

<template>
  <Dialog ref="dialog" :header="header" :draggable="false" :closable="closable" :pt="{
    root: { class: 'ts-confirm-dialog' },
    header: { class: 'ts-dialog-header' },
  }" @update:visible="emit('update:visible', $event)" class="ts-dialog" modal>
    <template #header>
      <i v-if="icon" :class="[
        severity === 'danger' ? 'text-danger' : '',
        severity === 'success' ? 'text-success' : '',
        icon,
        'fs-4 ts-dialog-title-icon',
      ]"></i>
      <span class="ts-dialog-title">{{ header }}</span>
    </template>
    <slot name="body" :items="lists">
      <ul v-if="lists">
        <li v-for="(list, index) in lists" :key="index">
          {{ listLabel && typeof list !== 'string' ? (list as Record<string, string>)[listLabel] : list }}
        </li>
      </ul>
      <template v-if="slots.body">
        <slot name="body" />
      </template>
      <p v-else class="mb-0">{{ body }}</p>
    </slot>
    <template #footer>
      <slot name="footer">
        <Button @click="closeDialog" :label="cancelLabel" text-only />
        <Button :severity="severity" :label="confirmLabel" @click="confirm" />
      </slot>
    </template>
  </Dialog>
</template>
<style lang="scss">
@import 'scss/var';
@import '~rfs/scss';

.ts-confirm-dialog {
  background: $general-bg-white;
  width: 400px;
}

.ts-dialog {
  .ts-dialog-header {
    padding: 24px 24px 12px !important;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    gap: 8px;
    height: 60px;

    .ts-dialog-title {
      color: $general-header-weak;
      text-align: center;

      @include font-size(14px);
      font-style: normal;
      font-weight: 700;
      line-height: 18px;
      letter-spacing: 0.28px;
    }

    .p-dialog-header-icons {
      margin-left: auto !important;
    }

    .ts-dialog-title-icon {
      margin-right: 0px !important;
    }

    .p-dialog-header-close {
      width: 24px !important;
      height: 24px !important;

      .p-dialog-header-close-icon {
        width: 12px;
        height: 12px;
      }
    }
  }

  .p-dialog-content {
    color: $general-header-weak;

    @include font-size(11.2px);
    font-weight: 500;
    line-height: 16.8px;
    padding: 0 24px 12px;
    display: flex;
    gap: 12px;
    flex-direction: column;

    > * {
      margin-bottom: 0 !important;
    }

    ul {
      margin-bottom: 0 !important;
      padding-left: 16px;
    }
  }

  .p-dialog-footer {
    display: flex;
    align-items: end;
    justify-content: end;
    gap: 12px !important;
  }
}
</style>
