<script lang="ts" setup>
import { computed, ref } from 'vue';
import Dialog from 'primevue/dialog';

const props = defineProps<{
  show: boolean;
  destination: object;
  selectionMode: 'checkbox' | 'single';
}>();

const emit = defineEmits<{
  (e: 'cancel'): void;
  (e: 'apply', data: any): void;
  (e: 'keyChange', data: any): void;
}>();

const destinationTemp = ref<any>({});

const show = computed(() => props.show);
</script>

<template>
  <Dialog
    v-model:visible="show"
    modal
    style="width: 271px"
    :draggable="false"
    header="Select Group"
    @show="() => (destinationTemp = props.destination ? props.destination : {})"
    @hide="() => (destinationTemp = {})"
    :closable="false"
  >
    <GroupTree
      :selection-mode="props.selectionMode"
      v-model:selected-keys="destinationTemp"
      @key-change="emit('keyChange', $event)"
    />
    <template #footer>
      <div class="d-flex justify-content-end gap-2">
        <Button
          label="Cancel"
          text
          severity="secondary"
          @click="emit('cancel')"
        />
        <Button
          label="Apply"
          severity="success"
          @click="emit('apply', destinationTemp)"
        />
      </div>
    </template>
  </Dialog>
</template>
