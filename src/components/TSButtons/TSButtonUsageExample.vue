<script setup lang="ts">
import { ref, watch } from 'vue';
import ButtonDefault from './ButtonDefault.vue';
import ButtonPrimary from './ButtonPrimary.vue';
import ButtonPrimaryOutline from './ButtonPrimaryOutline.vue';
import ButtonDanger from './ButtonDanger.vue';
import ButtonDangerOutline from './ButtonDangerOutline.vue';
import ButtonSuccess from './ButtonSuccess.vue';
import ButtonSuccessOutline from './ButtonSuccessOutline.vue';
import ButtonTextPrimary from './ButtonTextPrimary.vue';
import Button from './Button.vue';
import InputSwitch from '@/components/Input/InputSwitch.vue';
import TSBulkAction from './TSBulkAction.vue';
import { MenuOption } from '@/types/options';
import SelectGroup from '../SelectGroup/SelectGroup.vue';
const isOn = ref<boolean>(true);
watch(isOn, (on) => console.log(on));

const bulkLabel = ref<string>('Bulk action');
const showGroupDialog = ref(false);
const groups = ref<number[]>([]);
const bulkOptions = ref<MenuOption[]>([
  {
    label: 'Assign Group',
    icon: 'ri-group-line',
    command: (): void => {
      showGroupDialog.value = true;
    },
  },
  {
    label: 'Delete',
    icon: 'ri-delete-bin-line',
    danger: true,
    command: (): void => {
      console.log('Delete')
    },
  },
]);
</script>
<template>
  <label style="text-align: left">Tag Samurai Button with Riple Effect</label>
  <div class="preview">
    <Button label="TS Button" severity="primary" />
    <Button label="TS Button" severity="danger" />
    <Button label="TS Button" severity="success" />
    <Button label="TS Button" severity="primary" outlined />
    <Button label="TS Button" severity="danger" outlined />
    <Button label="TS Button" severity="success" outlined />
    <Button label="TS Button" severity="primary" text-only />
    <Button label="TS Button" severity="danger" text-only />
    <Button label="TS Button" severity="success" text-only />
    <Button label="TS Button" />
    <Button icon="ri-filter-line" />
    <Button icon="ri-filter-line" label="Filter" severity="success" />
    <Button icon="ri-file-text-line" />
    <Button icon="ri-download-2-line" severity="secondary" outlined />
  </div>
  <div class="d-flex gap-3">
    <ButtonDefault label="Default" />
    <ButtonTextPrimary label="Text" />
    <ButtonPrimary label="Primary" />
    <ButtonDanger label="Danger" />
    <ButtonSuccess label="Succes" />
    <ButtonPrimaryOutline label="Primary" />
    <ButtonDangerOutline label="Danger" />
    <ButtonSuccessOutline label="Success" />
    <InputSwitch v-model="isOn" @change="console.log('change', $event)" @update:model-value="console.log('update', $event)"/>
    <TSBulkAction
      :selected-datas="[{ id: 'assas' }]"
      :options="bulkOptions"
      naming="asset"
    />
    <SelectGroup
      v-model="groups"
      v-model:show-dialog="showGroupDialog"
      selection-mode="checkbox"
      hide-button
      @update:model-value="console.log($event)"
    />
  </div>
</template>
