<script setup lang="ts">
import { onMounted, reactive, ref, computed } from 'vue';
import { useField } from 'vee-validate';
import axios from 'axios';
import { Nullable } from 'primevue/ts-helpers';
import { FieldValidation } from '@/types/fieldValidation.type';
import ValidatorMessage from '@/components/Input/InputValidatorMessage.vue';
import InputNumber from 'primevue/inputnumber';
import Dropdown from 'primevue/dropdown';

type Country = { name: string; code: number; flag: string };

const countryData = ref<Country[]>([]);

const props = defineProps<{
  phoneNumber?: number;
  label: string;
  fieldName?: string;
  mandatory?: boolean;
  useValidator?: boolean;
  validatorMessage?: string;
  placeholder?: string;
}>();

defineEmits<{
  'update:phoneNumber': [value?: number];
}>();

const field = reactive<FieldValidation>({});
const numberInput = ref<number>();
const selectedCountry = ref<Country>();

const countryCode = computed<number | undefined>(
  () => selectedCountry.value?.code
);
const fullPhoneNumber = computed<number>(() =>
  Number(`${countryCode.value}${numberInput.value ?? ''}`)
);

onMounted(async () => {
  setValidator();
  await fetchCountry();
  parsePhoneNumber();
});

const parsePhoneNumber = () => {
  if (props.phoneNumber) {
    const phoneNumberStr = props.phoneNumber.toString();
    const foundCountry = countryData.value.find((country) =>
      phoneNumberStr.startsWith(country.code.toString())
    );

    if (foundCountry) {
      selectedCountry.value = foundCountry;
      numberInput.value = Number(
        phoneNumberStr.slice(foundCountry.code.toString().length)
      );
      field.value = fullPhoneNumber.value;
    }
  }
};

const setValidator = (): void => {
  if (props.useValidator) {
    Object.assign(
      field,
      useField(props.fieldName ?? '', (value: Nullable<number>) => {
        if (props.mandatory) return setValidatorMessage(value);
        else return true;
      })
    );
  }
};

const fetchCountry = async (): Promise<void> => {
  try {
    const { data } = await axios.get('https://restcountries.com/v3.1/all');
    countryData.value = data.flatMap((country: any) =>
      country.idd.suffixes
        ? country.idd.suffixes.map((suffix: string) => ({
            name: country.name.common,
            code: Number(`${country.idd.root}${suffix}`),
            flag: country.flags.svg,
          }))
        : [
            {
              name: country.name.common,
              code: Number(`${country.idd.root}`),
              flag: country.flags.svg,
            },
          ]
    );
  } catch (error) {
    console.error(error);
  }
};

const setValidatorMessage = (value: Nullable<number>): boolean | string => {
  if (!value && !countryCode.value) {
    return props.validatorMessage ?? props.label + ' must not be empty!';
  } else if (fullPhoneNumber.value.toString().length > 15) {
    return `Max. 15 characters!`;
  } else if (!field.value && countryCode.value) {
    return 'Phone number format is incorrect!';
  } else {
    return true;
  }
};
</script>
<template>
  <div class="field_wrapper" :class="$attrs.class">
    <label>
      {{ label }}
      <span class="text-danger" v-if="mandatory">*</span>
    </label>
    <div class="input_wrapper">
      <div class="ts-inputgroup ts-phoneinput">
        <Dropdown
          v-model="selectedCountry"
          :options="countryData"
          placeholder="Phone Code"
          class="ts-dropdown ts-select-country-code"
          filter
          option-label="name"
          filter-placeholder="Search"
          panelClass="select-code-panel"
        >
          <template #value="slotProps">
            <template v-if="slotProps.value">
              <img
                :alt="slotProps.value.name"
                :src="slotProps.value.flag"
                class="mr-2"
                style="height: 12px; border: 1px solid #0a0a0a68"
              />
              <label class="phone-code">(+{{ slotProps.value.code }})</label>
            </template>
          </template>
          <template #option="slotProps">
            <template v-if="slotProps.option">
              <img
                :alt="slotProps.option.name"
                :src="slotProps.option.flag"
                class="mr-2"
                style="width: 18px"
              />
              <label>{{ slotProps.option.name }}</label>
              <label class="phone-code">(+{{ slotProps.option.code }})</label>
            </template>
          </template>
          <template #filtericon>
            <i class="pi pi-search p-dropdown-filter-icon" />
          </template>
        </Dropdown>

        <InputNumber
          :model-value="numberInput"
          :useGrouping="false"
          :disabled="!selectedCountry"
          @input="
            (numberInput = $event.value as number),
              (field.value = fullPhoneNumber),
              $emit('update:phoneNumber', fullPhoneNumber)
          "
          class="ts-inputnumber"
          placeholder="Phone Number"
        />
      </div>
      <ValidatorMessage
        v-show="field.errorMessage"
        :message="field.errorMessage ?? ''"
      />
    </div>
  </div>
</template>
<style lang="scss">
@import 'scss/var';

.ts-inputgroup.ts-phoneinput {
  display: flex;
  align-items: center;
  border-radius: 4px;
  width: 100%;

  .ts-select-country-code {
    width: 100px !important;
    border-radius: 4px 0 0 4px !important;
  }

  .p-inputnumber {
    border-width: 1px 1px 1px 0 !important;
    border-radius: 0 4px 4px 0 !important;
    width: 100%;

    input:disabled {
      background: none;
    }
  }
}

.select-code-panel {
  z-index: 999999 !important;
}
</style>
