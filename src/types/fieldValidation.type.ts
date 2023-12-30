import { FieldContext } from 'vee-validate';
import { Ref } from 'vue';

export type FieldValidation =
  | { value?: any; errorMessage?: Ref<string | undefined> }
  | FieldContext;
