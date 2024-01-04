<script setup lang="ts">
import { ref } from 'vue';
import TSConfirmDialog from './TSConfirmDialog.vue';
import Button from '../TSButtons/Button.vue';
const showDialog = ref(false);
</script>
<template>
  <Button label="Show" severity="primary" @click="showDialog = true"/>
  <TSConfirmDialog
    v-model:visible="showDialog"
    header="Confirm Dialog"
    severity="danger"
    confirm-label="Continue"
    body="Are you sure want to continue?"
  />
</template>
