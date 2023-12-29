<script setup lang="ts">
import { ref } from 'vue';
import DropdownOption from './DropdownOption.vue';
import { useForm } from 'vee-validate';
import Button from 'primevue/button';

const { handleSubmit } = useForm();
const value1 = ref<any>();
const value2 = ref<any>();
const value3 = ref<any>();

const cities = ref([
  { label: 'New York', value: 'NY' },
  { label: 'Rome', value: 'RM' },
  { label: 'London', value: 'LDN' },
  { label: 'Istanbul', value: 'IST' },
  { label: 'Paris', value: 'PRS' }
]);

const onSubmit = handleSubmit((values) => {
console.log(values);
});
</script>

<template>
  <form @submit="onSubmit" style="display: flex; flex-direction: column; gap: 1.2rem">
    <DropdownOption 
      :options="cities"
      v-model="value1"
      label="option"
      mode='single'
    />
    <DropdownOption
      v-model="value2"
      mandatory
      message="You must select an option"
      :options="cities"
      label="other option"
      mode='single'
    />
    <Button severity="success" type="submit" label="Submit"></Button>
  </form>
  <DropdownOption
    :options="cities"
    v-model="value3"
    label="status"
    mode="multi"
  />
</template>
