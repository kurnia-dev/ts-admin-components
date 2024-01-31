<script setup lang="ts">
import { ref } from 'vue';
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

const value3 = ref<any>();

const cities = ref([
  { label: 'New York', value: 'NY' },
  { label: 'Rome', value: 'RM' },
  { label: 'London', value: 'LDN' },
  { label: 'Istanbul', value: 'IST' },
  { label: 'Paris', value: 'PRS' },
]);

const initial = ref<number>(0);

setTimeout(() => {
  initial.value = 0;
}, 2000);
const showDialog = ref<boolean>(true);
type Group = {
  name?: string;
}

const selectedGroupKeys = ref<number[]>([])
const selectedGroup = ref<Group>({});
const dateSingle = ref<number>(+new Date());
</script>

<template>
  <Dialog v-model:visible="showDialog" header="Testing Dialog" closable modal>
    <TSForm
      @save="console.log($event)"
      :buttons-template="['clear', 'save']"
      @clear="console.log('clear')"
      sticky-buttons
    >
      <template #fields>
        <TSCalendar field-name="dateSingle" label="Single Select" v-model="dateSingle" use-validator mandatory />
        <TextField
          mandatory
          use-validator
          label="Text field"
          field-name="textField"
        />
        <DropdownOption
          :options="cities"
          label="option"
          fieldName="option"
          mode="single"
          use-validator
          mandatory
          validator-message="You must select an option"
        />
        <DropdownOption
          :options="cities"
          mode="multi"
          label="other option"
          fieldName="otherOption"
          mandatory
          use-validator
        />
        <TextField
          label="Not mandatory"
          field-name="notMandatory"
          use-validator
        />
        <InputEmail label="Email" field-name="email" use-validator mandatory />
        <InputTextarea
          label="Text area"
          field-name="textarea"
          use-validator
          mandatory
        />
        <InputNumber
          :max="10"
          :initial-value="1"
          label="Number input"
          use-validator
          mandatory
          field-name="number"
          size="full"
          placeholder="input"
        />
        <InputPhone
          :max="10"
          label="Phone input"
          use-validator
          mandatory
          field-name="phone"
        />
        <TSCalendar
          label="Range Select"
          field-name="rangeDate"
          mode="range"
          mandatory
          use-validator
        />
        <SelectGroup
          selectionMode="single"
          v-model="selectedGroupKeys"
          :single-selected-group-name="selectedGroup.name"
          @apply-single-mode="(event) => {
            selectedGroup = event;
            console.log(selectedGroup);
          }"
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
