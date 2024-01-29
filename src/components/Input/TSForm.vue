<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useForm } from 'vee-validate';
import Button from '../TSButtons/Button.vue';
import ValidatorMessage from './InputValidatorMessage.vue';
import { FormPayload } from '@/types/tsForm.type';

const { handleSubmit, values } = useForm();

type FormButton = 'clear' | 'submit' | 'save' | 'cancel';
type ButtonsTemplate = FormButton[];

const props = defineProps<{
  columnPerRow?: number;
  buttonsTemplate?: ButtonsTemplate;
  hideStayCheckbox?: boolean;
  stickyButtons?: boolean;
}>();

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

  setOuterFieldsWrapperHeight();
  if (props.stickyButtons) setDialogClass();
});

const showValidator = ref<boolean>(false);
const validated = ref<boolean>(false);
const fieldsKey = ref<number>(0);
const footer = ref<HTMLDivElement>();

const fieldsWrapper = ref<HTMLDivElement | null>(null);
const outerFieldsWrapper = ref<HTMLDivElement | null>(null);
const stayAfterSubmit = ref<boolean>(false);

const setOuterFieldsWrapperHeight = () => {
  const footerHeight = footer.value?.offsetHeight;
  if (outerFieldsWrapper.value)
    outerFieldsWrapper.value.style.height = `calc(100% - ${
      (footerHeight ?? 0) + 20
    }px)`;
};

const setDialogClass = (): void => {
  const dialog = document.querySelector('.p-dialog') as HTMLDivElement;
  if (dialog) dialog.classList.add('form-dialog-sticky-buttons');
};

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
  <form
    @submit="onSubmit"
    :class="['ts-form', { 'sticky-buttons': props.stickyButtons }]"
    @input="showValidator = false"
  >
    <div ref="outerFieldsWrapper" class="ts-form-fields-outer-wrapper">
      <div ref="fieldsWrapper" class="ts-form-fields">
        <slot name="fields" :key="fieldsKey" />
      </div>
    </div>
    <div class="ts-form-footer" ref="footer">
      <div class="ts-form-stay-checkbox" v-if="!hideStayCheckbox">
        <div class="ts-form-stay-checkbox-wrapper">
          <Checkbox
            inputId="stay-after-submit"
            v-model="stayAfterSubmit"
            binary
          />
          <label for="stay-after-submit">
            Stay on this form after submitting
          </label>
        </div>
      </div>
      <div class="ts-form-action-buttons">
        <div class="button-wrapper">
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
        </div>
        <ValidatorMessage
          v-show="showValidator"
          class="ts-form-validator-message"
          message="Please input all required field!"
        />
      </div>
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
    gap: 20px 24px;
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

  .ts-form-footer {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  &-action-buttons {
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    justify-content: flex-end;
    gap: 4px;

    .button-wrapper {
      display: flex;
      align-items: flex-end;
      justify-content: flex-end;
      gap: 12px;
    }
  }
}

.ts-form.sticky-buttons {
  height: 100%;
  position: relative;

  .ts-form-fields-outer-wrapper {
    height: 100%;
    overflow: auto;
    margin-right: -12px;
    padding-right: 12px;
  }

  .ts-form-fields {
    height: 100%;
    box-sizing: content-box;
  }

  .ts-form-footer {
    position: absolute;
    bottom: 0;
    width: 100%;
    background: $general-bg-white;
    padding-top: 12px;
  }
}

.p-dialog.form-dialog-sticky-buttons {
  height: 100% !important;
  box-shadow: none;

  .p-dialog-header {
    margin-top: auto;
  }

  .p-dialog-content {
    margin-bottom: auto;
  }
}

.ts-form-validator-message {
  position: static;
  width: max-content;
}
</style>
