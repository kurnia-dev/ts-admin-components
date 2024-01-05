<script setup lang="ts">
import { onMounted, ref, computed } from 'vue';

const props = defineProps<{
  label?: string;
  severity?: 'primary' | 'danger' | 'success' | 'secondary';
  outlined?: boolean;
  textOnly?: boolean;
  icon?: string;
}>();

type ButtonEvent = MouseEvent & {
  currentTarget: HTMLButtonElement;
};

onMounted(() => {
  if (button.value) {
    button.value.addEventListener('click', (event: MouseEvent) => {
      const buttonEvent = event as unknown as ButtonEvent;
      createRipple(buttonEvent);
    });
  }
});

const button = ref<HTMLButtonElement | null>(null);
const iconOnly = computed<boolean>(() => !!props.icon && !props.label);

const severityClass = computed(() => {
  switch (props.severity) {
    case 'primary':
      return 'ts-button-primary';
    case 'danger':
      return 'ts-button-danger';
    case 'success':
      return 'ts-button-success';
    case 'secondary':
      return 'ts-button-secondary'
    default:
      return 'button-default';
  }
});

const createRipple = (event: ButtonEvent): void => {
  const button = event.currentTarget;

  const circle = document.createElement('span');
  const diameter = Math.max(button.clientWidth, button.clientHeight);
  const radius = diameter / 2;

  circle.style.width = circle.style.height = `${diameter}px`;
  circle.style.left = `${event.clientX - button.offsetLeft - radius}px`;
  circle.style.top = `${event.clientY - button.offsetTop - radius}px`;
  circle.classList.add('ripple');

  const ripple = button.getElementsByClassName('ripple')[0] as HTMLSpanElement;

  if (ripple) {
    ripple.remove();
  }

  button.appendChild(circle);
};
</script>

<template>
  <button
    ref="button"
    class="ts-button"
    :class="[
      severityClass,
      { outlined },
      { 'text-only': textOnly },
      { 'icon-only': iconOnly },
    ]"
  >
    <i v-if="props.icon" :class="props.icon" class="ts-button-icon" />
    {{ props.label }}
  </button>
</template>
