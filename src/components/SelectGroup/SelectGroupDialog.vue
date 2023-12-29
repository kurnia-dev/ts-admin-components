<script lang="ts" setup>
import { computed, ref } from 'vue';
import GroupTree from '../GroupTree.vue';

const props = defineProps<{
  show: boolean;
  destination: object;
  selectionMode: 'checkbox' | 'single';
  params?: object;
  readonly?: boolean;
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
    style="width: 400px"
    :draggable="false"
    :header="props.readonly ? 'Selected Group' : 'Select Group'"
    @show="() => (destinationTemp = props.destination ? props.destination : {})"
    @hide="() => (destinationTemp = {})"
    :base-z-index="99999999"
    closable
    @update:visible="!$event && emit('cancel')"
  >
    <GroupTree
      :params="props.params"
      filter-by="name"
      filterPlaceholder="Search"
      :selection-mode="props.selectionMode"
      :readonly="props.readonly"
      v-model:selected-keys="destinationTemp"
      @key-change="emit('keyChange', $event)"
    />
    <template #footer>
      <div v-if="props.readonly" class="d-flex justify-content-end gap-2">
        <Button
          label="Close"
          text
          severity="secondary"
          @click="emit('cancel')"
        />
      </div>
      <div v-else class="d-flex justify-content-end">
        <Button
          label="Cancel"
          text
          severity="secondary"
          @click="emit('cancel')"
          class="mx-1"
        />
        <Button
          label="Apply"
          severity="success"
          :disabled="
            selectionMode === 'single' && !Object.keys(destinationTemp).length
          "
          @click="emit('apply', destinationTemp)"
        />
      </div>
    </template>
  </Dialog>
</template>
