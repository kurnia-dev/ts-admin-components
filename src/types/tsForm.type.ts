export type FormPayload = {
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
