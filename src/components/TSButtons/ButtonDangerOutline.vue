<script setup lang="ts">
defineProps<{
  label: string;
}>();
</script>
<template>
  <button class="ts-button ts-button-danger outlined">
    {{ label }}
  </button>
</template>
