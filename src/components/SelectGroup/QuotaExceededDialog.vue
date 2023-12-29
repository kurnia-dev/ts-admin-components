<script lang="ts" setup>
import { computed } from 'vue';

const props = defineProps<{
  show: boolean;
  groupName?: string;
}>();

const emit = defineEmits<(e: 'close') => void>();

const show = computed(() => props.show);
</script>

<template>
  <Dialog
    v-model:visible="show"
    modal
    style="width: 400px"
    header="Group Quota Exceeded"
    :closable="false"
  >
    <template #header>
      <div class="d-flex gap-2 align-items-center">
        <i class="ri-error-warning-line text-danger"></i>
        <span class="p-dialog-title">Group Quota Exceeded</span>
      </div>
    </template>
    <div class="">
      Quota in {{ props.groupName || 'group' }} is full. Please add more quota
      or select other group.
    </div>
    <template #footer>
      <div class="d-flex justify-content-end">
        <Button
          label="Close"
          text
          severity="secondary"
          @click="emit('close')"
        />
      </div>
    </template>
  </Dialog>
</template>
