<script setup lang="ts">
defineProps<{
  message: string;
}>();
</script>
<template>
  <small class="validator-message" id="dd-error">{{ message }}</small>
</template>
