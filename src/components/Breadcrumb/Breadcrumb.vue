<script lang="ts" setup>
import { computed } from 'vue';
import { navigateToUrl } from 'single-spa';
import { BreadcrumbMenu } from './breadcrumb.type';

const props = defineProps<{
  menus: BreadcrumbMenu[];
}>();

const lastIndex = computed(() => props.menus.length - 1);
</script>

<template>
  <div class="d-flex align-items-baseline breadcrumb">
    <div
      v-for="(menu, index) in props.menus"
      :key="index"
      class="d-flex align-items-baseline"
    >
      <div v-if="index !== lastIndex" class="d-flex align-items-end">
        <a
          v-if="menu.route"
          :href="menu.route"
          @click="navigateToUrl(menu.route)"
          class="text-decoration-none breadcrumb-label"
          style="cursor: pointer"
        >
          {{ menu.name }}
        </a>
        <div
          v-else-if="!index && !menu.route"
          class="first-menu-no-route breadcrumb-label"
        >
          {{ menu.name }}
        </div>
        <i class="ri-arrow-right-s-line breadcrumb-separator" />
      </div>
      <div v-else class="no-route breadcrumb-label">
        {{ menu.name }}
      </div>
    </div>
  </div>
</template>
<style lang="scss" scoped>
@import '~rfs/scss';
@import 'scss/var';

.breadcrumb {
  margin-bottom: 8px;
}

.breadcrumb-label {
  @include font-size(12px);
  font-weight: 500;
}

.first-menu-no-route {
  color: $primary-strong;
  font-weight: 600;
  cursor: default;
}

.no-route {
  color: $general-label;
  font-weight: 600;
  cursor: default;
}

.breadcrumb-separator {
  @include font-size(14px);
  font-weight: 500;
  margin-left: 5px;
  margin-right: 5px;
  line-height: 1.1;
  color: $general-header-weak;
}
</style>
