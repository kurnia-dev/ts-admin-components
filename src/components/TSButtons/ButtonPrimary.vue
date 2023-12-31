<script setup lang="ts">
defineProps<{
  label: string;
}>();
</script>
<template>
  <button ref="button" class="ts-button ts-button-primary">
    {{ label }}
  </button>
</template>
