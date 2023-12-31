<script setup lang="ts">
defineProps<{
  label: string;
}>();
</script>
<template>
  <button class="ts-button ts-button-primary text-only">
    {{ label }}
  </button>
</template>
