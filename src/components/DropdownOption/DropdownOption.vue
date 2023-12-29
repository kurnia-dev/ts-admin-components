<script setup lang="ts">
import { onMounted, ref, watch } from 'vue';
import { TDropdownOption } from '@/types/dropdownOption';
import { useField } from 'vee-validate';

const props = defineProps<{
  modelValue: string | string[];
  options: TDropdownOption[];
  mandatory?: boolean;
  message?: string;
  mode: 'single' | 'multi';
  label: string;
  placeholder?: string;
}>();

defineEmits<{
  'update:modelValue': [value: string];
}>();

onMounted(() => setOption(props.options));

const dropdownOptions = ref<TDropdownOption[]>()

const { value, errorMessage } = useField(props.label, (value: any) => {

  if (!value) {
      return props.message ?? '';
  }

  return true;
});

watch(() => props.options, (options) => setOption(options));

const setOption = (options: TDropdownOption[]) => {
  if (!dropdownOptions.value) (dropdownOptions.value = options);
}
</script>
<template>
  <div class="field_wrapper">
    <label>
      {{ label }}
      <span class="text-danger" v-if="mandatory">*</span>
    </label>
    <MultiSelect
      v-if="mode === 'multi'"
      v-model="value"
      :filter="true"
      :options="dropdownOptions"
      :placeholder="placeholder ?? `Select ${label}`"
      :class="[{ 'p-invalid': errorMessage }, 'w-100']"
      @update:modelValue="$emit('update:modelValue', $event)"
      aria-describedby="dd-error"
      filter-placeholder="Search"
      option-label="label"
      option-lalue="value"
      display="chip"
    />
    <Dropdown
      v-else
      v-model="value"
      :options="dropdownOptions"
      :placeholder="placeholder ?? `Select ${label}`"
      :class="[{ 'p-invalid': errorMessage }, 'w-100']"
      @update:modelValue="$emit('update:modelValue', $event)"
      aria-describedby="dd-error"
      optionLabel="label"
      optionValue="value"
    />
    <small class="p-error" id="dd-error" v-if="errorMessage">{{ errorMessage }}</small>
  </div>
</template>
<style lang="scss">
@import 'scss/var';
.field_wrapper {
  display: flex;
  flex-direction: column;
  gap: 4px;
  align-items: start;
  justify-content: start;

  label {
    color: $dark;
    text-transform: capitalize;
    margin-bottom: 4px;

    font-size: 11.2px;
    font-style: normal;
    font-weight: 500;
    line-height: 16.8px;
  }

  .p-error {
    width: 100%;
    text-align: right;
  }
}
</style>
