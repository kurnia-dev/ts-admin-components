<script setup lang="ts">
import { useForm } from 'vee-validate';
import Button from '../TSButtons/Button.vue';
import { onMounted, ref } from 'vue';
import ValidatorMessage from './InputValidatorMessage.vue';

const { handleSubmit, values } = useForm();

type FormButton = 'clear' | 'submit' | 'save' | 'cancel';
type ButtonsTemplate = FormButton[];

const props = defineProps<{
  columnPerRow?: number;
  buttonsTemplate?: ButtonsTemplate;
}>();

type FormPayload = {
  stayAfterSubmit: boolean;
  formValues: Record<
    string,
    | string
    | string[]
    | number
    | number[]
    | boolean
    | boolean[]
    | object
    | object[]
  >;
};

const emit = defineEmits<{
  submit: [values: FormPayload];
  save: [values: FormPayload];
  clear: [];
  cancel: [];
}>();

onMounted(() => {
  const chilren = fieldsWrapper.value!.children;
  const childCount = fieldsWrapper.value!.childElementCount;
  const colCount = props.columnPerRow ?? 2;

  fieldsWrapper.value!.style.gridTemplateColumns = `repeat(${colCount}, 1fr)`;

  let [rowPos, colPos] = [1, 1];
  for (const i in Array.from({ length: childCount })) {
    chilren[i].setAttribute('style', `grid-area: ${rowPos}/${colPos}`);

    if (++colPos > colCount) {
      colPos = 1;
      rowPos++;
    }
  }
});

const showValidator = ref<boolean>(false);
const validated = ref<boolean>(false);
const fieldsKey = ref<number>(0);

const fieldsWrapper = ref<HTMLDivElement | null>(null);
const stayAfterSubmit = ref<boolean>(false);

const onSubmit = handleSubmit((formValues) => {
  validated.value = true;
  fieldsKey.value += 1;

  const payload: FormPayload = {
    stayAfterSubmit: stayAfterSubmit.value,
    formValues,
  };

  emit('submit', payload);
});

const onSave = () => {
  const formValues = values;
  const payload: FormPayload = {
    stayAfterSubmit: stayAfterSubmit.value,
    formValues,
  };

  emit('save', payload);
};
</script>
<template>
  <form @submit="onSubmit" class="ts-form" @input="showValidator = false">
    <div ref="fieldsWrapper" class="ts-form-fields">
      <slot name="fields" :key="fieldsKey" />
    </div>
    <div class="ts-form-stay-checkbox">
      <div class="ts-form-stay-checkbox-wrapper">
        <Checkbox inputId="stay-after-submit" v-model="stayAfterSubmit" binary />
        <label for="stay-after-submit">
          Stay on this form after submitting
        </label>
      </div>
    </div>
    <div class="ts-form-action-buttons">
      <Button
        label="Cancel"
        v-if="props.buttonsTemplate?.includes('cancel')"
        @click="$emit('cancel')"
        type="button"
      />
      <Button
        v-if="props.buttonsTemplate?.includes('clear')"
        label="Clear Field"
        @click="fieldsKey++, $emit('clear')"
        type="button"
        severity="primary"
        text-only
      />
      <Button
        v-if="props.buttonsTemplate?.includes('save')"
        label="Save"
        outlined
        severity="success"
        type="button"
        @click="onSave"
      />
      <Button
        v-if="props.buttonsTemplate?.includes('submit')"
        severity="success"
        type="submit"
        label="Submit"
        @click="!validated && (showValidator = true)"
      />
      <ValidatorMessage
        v-show="showValidator"
        message="Please input all required field!"
      />
    </div>
  </form>
</template>
<style lang="scss">
@import 'scss/var';

.ts-form {
  display: flex;
  flex-direction: column;
  gap: 12px;
  color: $general-body;

  font-size: 11.2px;
  font-style: normal;
  font-weight: 500;
  line-height: 16.8px;

  &-fields {
    display: grid;
    gap: 12px 24px;
    grid-template-columns: repeat(2, 1fr);
  }

  &-stay-checkbox {
    &-wrapper {
      cursor: pointer;
      display: flex;
      gap: 8px;
      width: max-content;
      margin-left: auto;
      align-items: center;

      .p-checkbox {
        width: max-content;
        height: max-content;
      }

      label {
        cursor: pointer;
      }
    }

  }

  &-action-buttons {
    display: flex;
    align-items: flex-end;
    justify-content: flex-end;
    gap: 12px;
    position: relative;
  }
}
</style>
