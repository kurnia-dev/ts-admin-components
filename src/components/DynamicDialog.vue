<script lang="ts" setup>
import { PropType, ref, useSlots } from 'vue';

type Severity = 'success' | 'danger' | 'info' | 'secondary';

const dialog = ref();

const props = defineProps({
  icon: String,
  severity: String as PropType<Severity>,
  header: String,
  lists: Array as PropType<any[]>,
  listLabel: String as PropType<string>,
  body: String,
  state: String,
  closeAfterConfirm: {
    type: Boolean,
    default: true,
  },
  closeable: {
    type: Boolean,
    default: true,
  },
});

const slots = useSlots();

const emit = defineEmits<{
  (e: 'confirm', data?: any[]): void;
}>();

const closeDialog = () => {
  dialog.value.close();
};

const confirm = () => {
  emit('confirm', props.lists);
  if (props.closeAfterConfirm) {
    dialog.value.close();
  }
};
</script>

<template>
  <Dialog :modal="true" :draggable="false" ref="dialog" :closable="closeable" style="width: 400px">
    <template #header>
      <div class="d-flex gap-1 align-items-center">
        <i
          v-if="icon"
          :class="{
            'text-danger': severity === 'danger',
            'text-success': severity === 'success',
            [icon]: icon,
          }"
          class="fs-4"
        ></i>
        <span class="p-dialog-title">{{ header }}</span>
      </div>
    </template>
    <slot name="body" :items="lists">
      <ul v-if="lists">
        <li v-for="(list, index) in lists" :key="index">
          {{ listLabel ? list[listLabel] : list }}
        </li>
      </ul>
      <div v-if="slots.body">
        <slot name="body"></slot>
      </div>
      <p v-else>{{ body }}</p>
    </slot>
    <template #footer>
      <slot name="footer">
        <div class="d-flex align-items-center justify-content-end">
          <Button
            text
            severity="secondary"
            label="Cancel"
            @click="closeDialog"
          />
          <Button
            :severity="severity"
            :label="`Yes, ${state}`"
            @click="confirm"
          />
        </div>
      </slot>
    </template>
  </Dialog>
</template>
