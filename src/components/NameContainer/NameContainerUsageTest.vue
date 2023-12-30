<script setup lang="ts">
import NameContainer from '../NameContainer.vue';

</script>
<template>
  <div class="d-flex gap-4">
    <NameContainer name="Name Container" use-remove-button />
    <NameContainer name="Name Container" severity="success" />
  </div>
</template>
