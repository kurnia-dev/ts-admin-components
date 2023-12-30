<script setup lang="ts">
import { ref } from 'vue';
import DropdownOption from './OptionSelectionField.vue';
import { useForm } from 'vee-validate';
import Button from 'primevue/button';
import TextField from '../TextField/TextField.vue';

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
      class="col-3"
      mandatory
      use-validator
      label="Text field"
      field-name="textField"
    />
    <TextField
      class="col-3"
      label="Not mandatory"
      field-name="notMandatory"
      use-validator
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
