<script setup lang="ts">
defineProps<{
  label: string;
}>();
</script>
<template>
  <button class="ts-button button-default">
    {{ label }}
  </button>
</template>
