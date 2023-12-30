<script setup lang="ts">
import { onMounted, ref, watch } from 'vue';
import { TDropdownOption } from '@/types/dropdownOption';
import { useField } from 'vee-validate';

const props = defineProps<{
  modelValue: string | string[];
  options: TDropdownOption[];
  useFormField?: boolean;
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

const field = ref<any>({});

onMounted(() => {
  if (props.useFormField) {
    field.value = useField(props.label, (value: any) => {
      if (!value && props.mandatory) {
          return props.message ?? '';
      }

      return true;
    });
  }
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
      v-model="field.value"
      :filter="true"
      :options="dropdownOptions"
      :placeholder="placeholder ?? `Select ${label}`"
      :class="[{ 'p-invalid': field.errorMessage }, 'w-100']"
      @update:modelValue="$emit('update:modelValue', $event), console.log($event)"
      aria-describedby="dd-error"
      filter-placeholder="Search"
      option-label="label"
      option-lalue="value"
      display="chip"
    />
    <Dropdown
      v-else
      v-model="field.value"
      :options="dropdownOptions"
      :placeholder="placeholder ?? `Select ${label}`"
      :class="[{ 'p-invalid': field.errorMessage }, 'w-100']"
      @update:modelValue="$emit('update:modelValue', $event)"
      aria-describedby="dd-error"
      optionLabel="label"
      optionValue="value"
    />
    <small class="p-error" id="dd-error" v-if="field.errorMessage">{{ field.errorMessage }}</small>
  </div>
</template>
