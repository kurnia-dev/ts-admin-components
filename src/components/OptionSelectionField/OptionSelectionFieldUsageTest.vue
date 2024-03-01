<script setup lang="ts">
import { onMounted, ref } from 'vue';
import DropdownOption from './OptionSelectionField.vue';
import TextField from '../TextField/TextField.vue';
import InputTextarea from '@/components/Input/InputTextarea.vue';
import InputEmail from '@/components/Input/InputEmail.vue';
import InputNumber from '@/components/Input/InputNumber.vue';
import TSCalendar from '../Calendar/TSCalendar.vue';
import InputPhone from '../Input/InputPhone.vue';
import TSForm from '@/components/Input/TSForm.vue';
import Dialog from 'primevue/dialog';
import SelectGroup from '../SelectGroup/SelectGroup.vue';
import SelectTree from '../ts-components/selecttree/SelectTree.vue';

const value3 = ref<any>();

const cities = ref([
  { label: 're', value: 72, visible: false },
  { label: 'brand category iot', value: 71 },
  { label: 'brand dikit category', value: 70 },
  { label: 'new brandd', value: 69 },
  { label: 'tambah brand lagi', value: 67 },
  { label: 'Biar brand lebih dari 10', value: 66 },
  { label: 'Brand Baru lagii', value: 65 },
  { label: 'Brand Neww', value: 64 },
  { label: 'Test model', value: 63 },
  { label: 'tes', value: 61 },
  { label: 'Regular', value: 60 },
  { label: 'Ming', value: 59 },
  { label: 'brand baru', value: 50 },
]);

const initial = ref<number>(0);

const showCategoryAddMulti = ref<boolean>(false);
const showCategoryAddSingle = ref<boolean>(false);

setTimeout(() => {
  initial.value = 0;
}, 2000);
const showDialog = ref<boolean>(true);
type Group = {
  name?: string;
};

const selectedGroupKeys = ref<number[]>([]);
const selectedGroup = ref<Group>({});
const dateSingle = ref<number>(+new Date());
const phoneNumber = ref<number>();

onMounted(() => {
  // setTimeout(() => {
  //   phoneNumber.value = 255678672423;
  // }, 3000);
});
</script>

<template>
  <Dialog v-model:visible="showDialog" header="Testing Dialog" closable modal>
    <TSForm
      @save="console.log($event)"
      :buttons-template="['clear', 'save', 'submit']"
      @clear="console.log('clear')"
    >
      <template #fields>
        <InputPhone
          :max="10"
          :phone-number="phoneNumber"
          label="Phone input"
          use-validator
          mandatory
          field-name="phone"
        />
        <!-- <TSCalendar field-name="dateSingle" label="Single Select" v-model="dateSingle" use-validator mandatory />
        <TextField
          mandatory
          use-validator
          label="Text field"
          field-name="textField"
        /> -->
        <DropdownOption
          :options="cities"
          mode="multi"
          label="other option"
          fieldName="otherOption"
          mandatory
          use-validator
        />
        <!-- Example usage of new SelectTree component -->
        <SelectTree
          v-model:show="showCategoryAddMulti"
          @multi-change="console.log($event)"
          action-mode="Add"
          field-name="categories"
          selection-mode="checkbox"
          type="Category"
          use-validator
        />
        <SelectTree
          v-model:show="showCategoryAddSingle"
          @multi-change="console.log($event)"
          action-mode="Add"
          field-name="category"
          mandatory
          selection-mode="single"
          type="Category"
          use-validator
        />
      </template>
    </TSForm>
  </Dialog>
  <DropdownOption
    :options="cities"
    v-model="value3"
    @update:model-value="console.log($event)"
    label="status"
    mode="multi"
  />
</template>
