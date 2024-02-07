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
      :key="index"
      v-for="(menu, index) in props.menus"
      class="d-flex align-items-baseline"
    >
      <div v-if="index !== lastIndex" class="d-flex align-items-end">
        <a
          v-if="menu.route"
          :href="menu.route"
          @click="navigateToUrl(menu.route!)"
          class="text-decoration-none breadcrumb-label cursor-pointer"
        >
          {{ menu.name }}
        </a>
        <div
          v-else-if="!index && !menu.route"
          class="first-menu-no-route breadcrumb-label"
        >
          {{ menu.name }}
        </div>
        <span class="breadcrumb-separator">></span>
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
  line-height: 21px;
  letter-spacing: 0.24px;
}

.cursor-pointer {
  cursor: pointer;
}
.first-menu-no-route {
  color: $primary-strong;
  font-weight: 600;
  cursor: default;
}

.no-route {
  color: $general-label;
  font-weight: 700;
  cursor: default;
}

.breadcrumb-separator {
  color: $general-header-weak;
  @include font-size(14px);
  font-weight: 500;
  margin-left: 5px;
  margin-right: 5px;
  line-height: 21px;
  display: flex;
  align-items: center;
  justify-content: center;
  letter-spacing: 0.28px;
}
</style>
