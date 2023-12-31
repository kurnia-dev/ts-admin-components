<script setup lang="ts">
defineProps<{
  label: string;
}>();
</script>
<template>
  <button class="ts-button ts-button-primary outlined">
    {{ label }}
  </button>
</template>
