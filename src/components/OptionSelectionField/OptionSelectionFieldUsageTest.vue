<script setup lang="ts">
import { ref, reactive } from 'vue';
import DropdownOption from './OptionSelectionField.vue';
import { useForm } from 'vee-validate';
import Button from 'primevue/button';
import TextField from '../TextField/TextField.vue';
import InputTextarea from '@/components/Input/InputTextarea.vue';
import InputEmail from '@/components/Input/InputEmail.vue';
import InputNumber from '@/components/Input/InputNumber.vue';
import TSCalendar from '../Calendar/TSCalendar.vue';

const { handleSubmit } = useForm();
const value1 = ref<any>();
const value2 = ref<any>();
const value3 = ref<any>();

const cities = ref([
  { label: 'New York', value: 'NY' },
  { label: 'Rome', value: 'RM' },
  { label: 'London', value: 'LDN' },
  { label: 'Istanbul', value: 'IST' },
  { label: 'Paris', value: 'PRS' },
]);

const onSubmit = handleSubmit((values) => {
  if (values) console.log(values);
});

const texts = reactive<any>({});
const initial = ref<number>(0);
const dateStringified = ref<string>();

setTimeout(() => {
  initial.value = 1;
}, 2000);
</script>

<template>
  <form @submit="onSubmit" class="row gap-2 align-items-end">
    <DropdownOption
      class="col-3"
      v-model="value1"
      :options="cities"
      label="option"
      fieldName="option"
      mode="single"
      use-validator
      mandatory
      validator-message="You must select an option"
    />
    <DropdownOption
      class="col-3"
      v-model="value2"
      :options="cities"
      mode="multi"
      label="other option"
      fieldName="otherOption"
      mandatory
      use-validator
    />
    <TextField
      v-model="texts.text1"
      @update:model-value="console.log($event)"
      class="col-3"
      mandatory
      use-validator
      label="Text field"
      field-name="textField"
    />
    <TextField
      v-model="texts.text2"
      @update:model-value="console.log($event)"
      class="col-3"
      label="Not mandatory"
      field-name="notMandatory"
      use-validator
    />
    <InputEmail
      v-model="texts.email"
      @update:model-value="console.log($event)"
      class="col-3"
      label="Email"
      field-name="email"
      use-validator
      mandatory
    />
    <InputTextarea
      v-model="texts.textarea"
      @update:model-value="console.log($event)"
      class="col-3"
      label="Text area"
      field-name="textarea"
      use-validator
      mandatory
    />
    <InputNumber
      class="col-3"
      :max="10"
      :initial-value="1"
      label="Number input"
      use-validator
      mandatory
      field-name="number"
    />
    <TSCalendar
      class="col-3"
      v-model="dateStringified"
      label="Range Select"
      field-name="rangeDate"
      mode="range"
      mandatory
      use-validator
      @update:model-value="console.log($event)"
    />
    <Button
      class="col-1"
      severity="success"
      type="submit"
      label="Submit"
    ></Button>
  </form>
  <DropdownOption
    :options="cities"
    v-model="value3"
    label="status"
    mode="multi"
  />
</template>
