<script setup lang="ts">
defineProps<{
  modelValue: boolean;
  disabled?: boolean;
}>();

defineEmits<{
  'update:modelValue': [state: boolean];
  'change': [state: boolean];
}>();
</script>

<template>
  <label class="ts-input-switch">
    <input
      :checked="modelValue"
      :disabled="disabled"
      @change="
        $emit('update:modelValue', ($event.target as HTMLInputElement)?.checked)
      "
      class="hidden-input"
      type="checkbox"
    />
    <span class="slider" />
  </label>
</template>

<style lang="scss">
@import 'scss/var';
.ts-input-switch {
  position: relative;
  display: inline-block;
  width: 33.61px;
  height: 18.33px;
  text-align: center;

  input.hidden-input {
    opacity: 0;
    width: 0;
    height: 0;
  }

  input.hidden-input:disabled ~ .slider {
    background: $general-grey;
  }

  .slider {
    position: absolute;
    cursor: pointer;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    border-radius: 61.102px;
    border: 0.611px solid $general-line;
    transition: 0.4s;
  }

  .slider:before {
    position: absolute;
    content: '';
    height: 12.5px;
    width: 12.5px;
    bottom: 50%;

    transform: translate(calc(-100% - 1px), 50%);
    background-color: $general-line;
    border-radius: 50%;
    transition: 0.4s;
  }

  input:checked + .slider {
    background-color: $primary;
    border: none;
  }

  input:checked + .slider:before {
    transform: translate(1px, 50%);
    background: $general-bg-white;
  }
}
</style>
