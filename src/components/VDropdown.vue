<script lang="ts" setup>
import { ref } from 'vue';
import { useField } from 'vee-validate';

const props = defineProps<{
  name: string;
  options: any[];
  optionLabel?: string;
  optionValue?: string;
  placeholder?: string;
  class?: string;
}>();

const { errorMessage, value, setValue } = useField(() => props.name);

const dropdownValue = ref({ ...value });

const updateValue = (event: any) => {
  console.log('EVENT', event);

  dropdownValue.value = event;
  if (typeof event === 'object' && event !== null) {
    setValue(event.value);
    return;
  }
  setValue(event);
};

const getSelectedOptionLabel = (value: any) => {
  const selectedOption = props.options.find(
    (option: any) => option.value === value
  );

  return selectedOption.label;
};
</script>

<template>
  <Dropdown
    :modelValue="dropdownValue"
    @update:modelValue="updateValue"
    :options="props.options"
    :optionLabel="props.optionLabel"
    :optionValue="props.optionValue"
    :placeholder="props.placeholder"
    :class="props.class"
  >
    <template #value="slotProps">
      <div v-if="slotProps.value">
        <template v-if="getSelectedOptionLabel(slotProps.value).icon">
          <i :class="getSelectedOptionLabel(slotProps.value).icon"></i>
          <label class="ms-2">{{
            getSelectedOptionLabel(slotProps.value).text
          }}</label>
        </template>
        <template v-else>
          <label>{{ getSelectedOptionLabel(slotProps.value) }}</label>
        </template>
      </div>
      <span v-else>
        {{ slotProps.placeholder }}
      </span>
    </template>
    <template #option="slotProps">
      <div v-if="slotProps.option.label?.icon" class="flex align-items-center">
        <i :class="slotProps.option.label.icon"></i>
        <label class="ms-2">{{ slotProps.option.label.text }}</label>
      </div>
      <div v-else class="flex align-items-center">
        <label>{{ slotProps.option.label }}</label>
      </div>
    </template>
  </Dropdown>
  <small
    v-if="errorMessage"
    class="p-error col-12 d-flex justify-content-end"
    id="text-error"
    >{{ errorMessage }}</small
  >
</template>
