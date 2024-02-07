<script setup lang="ts">
import { computed } from 'vue';
import { formatUserName } from '@/utils';

type TSeverity = 'success' | 'danger' | 'warning' | 'dark' | 'primary';
type TType = 'user' | 'status';

const props = withDefaults(
  defineProps<{
    name: string;
    useRemoveButton?: boolean;
    severity?: TSeverity;
    type?: TType;
  }>(),
  { severity: 'primary' }
);

const emit = defineEmits<{
  (e: 'remove'): void;
}>();

const hasValue = computed(() => {
  const type = typeof props.name;
  let valid = false;
  if (type === 'number') {
    valid = true;
  } else if (type === 'string') {
    valid =
      props.name && props.name.length && props.name !== '-' ? true : false;
  } else {
    valid = false;
  }
  return valid;
});

const formattedText = computed(() => {
  if (hasValue.value) {
    if (props.type === 'status') {
      return props.name;
    }
    if (props.type === 'user') {
      return formatUserName(props.name);
    }
    if (props.name.length > 12) {
      const firstWord = props.name.slice(0, 5);
      const lastWord = props.name.slice(
        props.name.length - 5,
        props.name.length
      );
      return `${firstWord}..${lastWord}`;
    }
    return props.name;
  }
  return '-';
});

const setSeverity = (): string[] => {
  let classes: string[];
  switch (props.severity) {
    case 'success':
      classes = ['text-success', 'border-success', 'bg-success-weak'];
      break;
    case 'danger':
      classes = ['text-danger', 'border-danger', 'bg-danger-weak'];
      break;
    case 'warning':
      classes = ['text-warning', 'border-warning', 'bg-warning-weak'];
      break;
    case 'dark':
      classes = ['text-dark', 'border-dark', 'bg-dark-weak'];
      break;
    default:
      classes = ['text-primary', 'border-primary', 'bg-primary-weak'];
      break;
  }
  return classes;
};
</script>

<template>
  <span
    v-if="hasValue"
    class="name-container"
    :class="setSeverity()"
  >
    <span
      class="name-container-name"
      >{{ formattedText }}</span
    >
    <Button
      v-if="props.useRemoveButton"
      @click="emit('remove')"
      icon="ri-close-line"
      class="remove-btn"
      text
      rounded
    />
  </span>
  <span v-else>-</span>
</template>

<style scoped lang="scss">
.name-container {
  display: flex;
  width: max-content;
  padding: 4px;
  justify-content: center;
  align-items: flex-start;
  gap: 4px;
  height: 20px;

  border-radius: 4px;
  border: 1px solid;
  .name-container-name {
    font-size: 9px;
    line-height: 1;
    text-wrap: nowrap;
    white-space: nowrap !important;
  }

  .remove-btn {
    width: 12px !important;
    height: 12px !important;
    padding: 0 !important;
  }
}

</style>
