<script setup lang="ts">
import { computed, onMounted, reactive, ref, watch } from 'vue';
import { TOptionSelection } from '@/types/optionSelection.type';
import { useField } from 'vee-validate';
import { FieldValidation } from '@/types/fieldValidation.type';
import { formatVowelSoundLabel } from '@/utils/textFormater.util';
import ValidatorMessage from '../Input/InputValidatorMessage.vue';
import { MultiSelectChangeEvent } from 'primevue/multiselect';
import { DropdownChangeEvent } from 'primevue/dropdown';

type SelectOptionsValue = string | number | boolean | object | (string | number | boolean | object)[];

interface SelectOptionsProps {
  modelValue?: SelectOptionsValue;
  options?: TOptionSelection[];
  useValidator?: boolean;
  mandatory?: boolean;
  validatorMessage?: string;
  mode: 'single' | 'multi';
  label?: string;
  fieldName?: string;
  placeholder?: string;
  closable?: boolean;
  loading?: boolean;
  filter?: boolean;
  optionLabel?: string;
  /**
   * Weether the options value is the option object itself.
   */
  optionValueObject?: boolean;
}

const props = withDefaults(defineProps<SelectOptionsProps>(), {
  modelValue: undefined,
});

const emit = defineEmits<{
  'update:modelValue': [value: SelectOptionsValue];
  'show': [];
}>();

onMounted(() => {
  setOption(props.options);
  setValidator();
});

const dropdownOptions = ref<TOptionSelection[]>();

const field = reactive<FieldValidation>({});
const defaultMessage = computed(() => {
  return props.mode == 'single'
    ? 'You must pick ' + formatVowelSoundLabel(props.label)
    : 'You must pick at least ' + formatVowelSoundLabel(props.label);
});

const setValidator = () => {
  console.log('start', props.label, field.value, props.modelValue);
  if (props.useValidator) {
    Object.assign(
      field,
      useField(
        props.fieldName ?? '',
        (value: string | string[] | number | number[]) => {
          const hasValue =
            (value != null && value !== '') ||
            (Array.isArray(value) && value.length);

          if (!hasValue && props.mandatory) {
            return props.validatorMessage ?? defaultMessage.value;
          }

          return true;
        }
      )
    );

    // field.value = props.modelValue;
    console.log('end', props.label, field.value, props.modelValue);
  }
};

const updateFieldValue = (
  event: DropdownChangeEvent | MultiSelectChangeEvent
) => {
  const { value } = event;
  if (props.mode === 'multi') {
    !value?.length && (field.value = undefined);
  }

  emit('update:modelValue', value);
};

watch(
  () => props.options,
  (options) => setOption(options)
);

const setOption = (options?: TOptionSelection[]) => {
  dropdownOptions.value = options;
};

const optionValue = computed<'label' | 'value' | undefined>(() => {
  if(props.optionValueObject) return undefined;

  const value = dropdownOptions.value?.[0]?.value;
  return value != null ? 'value' : 'label';
});
</script>
<template>
  <div class="field_wrapper">
    <label v-if="label">
      {{ label }}
      <span class="text-danger" v-if="mandatory">*</span>
    </label>
    <div class="input_wrapper">
      <MultiSelect
        v-if="mode === 'multi'"
        v-model="field.value"
        :loading="props.loading"
        :filter="true"
        :options="dropdownOptions"
        :placeholder="loading ? 'Loading...' : placeholder ?? `Select ${label}`"
        :class="[{ 'p-invalid': field.errorMessage }, 'w-100']"
        :pt="{
          closeButton: { style: !closable && 'display: none' },
        }"
        @change="updateFieldValue($event)"
        @show="emit('show')"
        aria-describedby="dd-error"
        filter-placeholder="Search"
        option-label="label"
        :option-value="optionValue"
        display="chip"
        class="ts-multiselect"
      >
        <template #filtericon>
          <i
            class="ri-search-2-line p-icon p-multiselect-filter-icon filter-icon"
          />
        </template>
      </MultiSelect>
      <Dropdown
        v-else
        v-model="field.value"
        :loading="props.loading"
        :options="dropdownOptions"
        :placeholder="loading ? 'Loading...' : placeholder ?? `Select ${label}`"
        :class="[{ 'p-invalid': field.errorMessage }, 'w-100']"
        @change="updateFieldValue($event)"
        @show="emit('show')"
        aria-describedby="dd-error"
        optionLabel="label"
        :optionValue="optionValue"
        :filter="filter"
        filter-placeholder="Search"
        class="ts-dropdown"
      >
        <template #option="optionProps">
          <span
            :class="
              optionProps.option.visible === false ? 'p-dropdown-invisible' : ''
            "
            >{{ optionProps.option.label }}</span
          >
        </template>
        <template #filtericon>
          <i class="ri-search-2-line filter-icon" />
        </template>
      </Dropdown>
      <ValidatorMessage
        v-show="field.errorMessage"
        :message="field.errorMessage"
      />
    </div>
  </div>
</template>
<style lang="scss">
@import 'scss/var';
@import '~rfs/scss';

.ts-multiselect,
.ts-dropdown {
  display: flex;
  height: 26px;
  padding: 4px 4px 4px 12px;
  justify-content: space-between;
  align-items: center;
  align-self: stretch;
  border-radius: 4px !important;
  border: 1px solid $general-body !important;
  background: $general-bg-white !important;

  .p-multiselect-label.p-placeholder,
  .p-dropdown-label.p-placeholder {
    color: $general-placeholder !important;
    height: 20px !important;
    line-height: 18px;

    @include font-size(11.2px);
    font-style: normal;
    font-weight: 300;
    letter-spacing: 0.224px;
    padding: 0;
    text-align: left;
  }

  .p-multiselect-label {
    display: flex;
    gap: 2px;
    padding: 0 !important;
  }

  .p-multiselect-trigger,
  .p-dropdown-trigger {
    width: 20px !important;
    height: 20px !important;

    .p-multiselect-trigger-icon,
    .p-dropdown-trigger-icon {
      width: 11.2px;
    }
  }

  .p-dropdown-label {
    @include font-size(11.2px);
    text-align: left;
    padding: 0;
    height: 20px !important;
    display: flex;
    align-items: center;
    gap: 4px;

    .phone-code {
      font-weight: 500;
    }
  }

  .p-multiselect-token {
    display: flex;
    height: 19px;
    padding: 4px !important;
    margin-right: 0 !important;
    justify-content: center;
    align-items: center;
    gap: 2px !important;
    border-radius: 4px !important;
    border: 1px solid;
    background: $general-bg-white !important;
    color: $general-header-weak !important;

    &-label {
      text-align: center;
      color: inherit;

      font-size: 8.89px;
      font-style: normal;
      font-weight: 600;
      line-height: 12px;
      letter-spacing: 0.267px;
    }
  }

  .p-multiselect-token-icon {
    display: flex;
    width: 10.13px !important;
    height: 10.13px !important;
    margin-left: 0 !important;
    justify-content: center;
    align-items: center;
  }
}

.p-dropdown-items {
  li.p-dropdown-item {
    display: flex;
    padding: 5.5px 16px !important;
    align-items: center;
    gap: 8px;
    align-self: stretch;
    @include font-size(11.2px);
    color: $general-body;
    line-height: 1rem;
  }

  li.p-dropdown-item:has(.p-dropdown-invisible) {
    display: none;
  }
}
.p-multiselect-panel {
  .p-multiselect-header {
    display: flex;
    padding: 12px 16px !important;
    align-items: center;
    gap: 8px;
    align-self: stretch;

    .p-checkbox {
      width: max-content;
      margin-right: 0 !important;
    }
  }

  li.p-multiselect-item {
    display: flex;
    padding: 5.5px 16px !important;
    align-items: center;
    gap: 8px;
    align-self: stretch;
    @include font-size(11.2px);
    color: $general-body;
    line-height: 1rem;

    .p-checkbox {
      width: max-content;
      margin-right: 0 !important;
    }
  }
}

.filter-icon {
  font-size: 12px;
  color: $general-body;
}
</style>
