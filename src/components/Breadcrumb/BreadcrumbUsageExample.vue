<script setup lang="ts">
import { ref } from 'vue';
import { BreadcrumbMenu } from './breadcrumb.type';
import Breadcrumb from './Breadcrumb.vue';

const breadcrumbMenu = ref<BreadcrumbMenu[]>([
  {
    name: 'Admin',
  },
  {
    name: 'Component',
    route: '/',
  },
  {
    name: 'Disposal Approval',
  },
]);
</script>
<template>
  <Breadcrumb :menus="breadcrumbMenu" />
</template>
