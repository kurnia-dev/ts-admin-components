<script setup lang="ts">
import { computed, onMounted, reactive, ref, watch } from 'vue';
import { TOptionSelection } from '@/types/optionSelection.type';
import { useField } from 'vee-validate';
import { FieldValidation } from '@/types/fieldValidation.type';

const props = defineProps<{
  modelValue: string | string[];
  options: TOptionSelection[];
  useValidator?: boolean;
  mandatory?: boolean;
  validatorMessage?: string;
  mode: 'single' | 'multi';
  label: string;
  fieldName?: string;
  placeholder?: string;
}>();

defineEmits<{
  'update:modelValue': [value: string];
}>();

onMounted(() => setOption(props.options));

const dropdownOptions = ref<TOptionSelection[]>();

const field = reactive<FieldValidation>({ value: '' });
const defaultMessage = computed(() => {
  return props.mode == 'single'
    ? 'You must pick an item'
    : 'You must pick at least an item';
})

onMounted(() => {
  if (props.useValidator) {
    Object.assign(
      field,
      useField(props.fieldName ?? '', (value) => {
        if (!value && props.mandatory) {
          return props.validatorMessage ?? defaultMessage.value;
        }

        return true;
      })
    );
  }
});

watch(
  () => props.options,
  (options) => setOption(options)
);

const setOption = (options: TOptionSelection[]) => {
  if (!dropdownOptions.value) dropdownOptions.value = options;
};
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
      @update:modelValue="
        $emit('update:modelValue', $event), console.log($event)
      "
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
    <small class="validator-message" id="dd-error" v-if="field.errorMessage">{{
      field.errorMessage
    }}</small>
  </div>
</template>
@/types/optionSelection.type