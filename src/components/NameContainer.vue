<script setup lang="ts">
import { computed } from 'vue';
import StringUtils from '@/utils/string.util';

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
      return StringUtils.formatUserName(props.name);
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
  <div
    v-if="hasValue"
    class="border d-inline-flex text-nowrap"
    :class="setSeverity()"
    style="padding: 4px 4px; border-radius: 4px"
  >
    <span
      class="text-nowrap"
      style="font-size: 9px; line-height: 12px; text-wrap: nowrap"
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
  </div>
  <div v-else>-</div>
</template>

<style scoped>
.remove-btn {
  width: 16px;
  height: 16px !important;
  margin-left: 3px;
}
</style>
