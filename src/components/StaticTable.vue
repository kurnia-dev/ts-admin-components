<script lang="ts" setup>
import { TableColumn } from '@/types/columns';
import { MenuOption } from '@/types/options';
import { computed, ref } from 'vue';

const props = defineProps<{
  columns: TableColumn[];
  datas: any[];
  dataKey: string;
  selectedDatas?: any[];
  useOption?: boolean;
  filters?: any;
  options?: MenuOption[];
  useSelection?: boolean;
  usePaginator?: boolean;
}>();

const emit = defineEmits<{
  (e: 'select-data', data: any): void;
  (e: 'select-datas', data: any): void;
}>();

const selectedDatas = computed({
  get() {
    return props.selectedDatas;
  },
  set(newSelectedDatas: any) {
    emit('select-datas', newSelectedDatas);
  },
});

const filters = computed(() => props.filters);
const globalFilterFields = computed(() =>
  props.columns.map((column) => column.field)
);

const rowsPerPageOptions = ref([5, 10, 20, 50]);

const menu = ref();
const paginator = computed<boolean>(() =>
  props.usePaginator !== null ? props.usePaginator : true
);

const toggleOptions = (event: any, data: any) => {
  menu.value.toggle(event);
  emit('select-data', data);
};
</script>

<template>
  <DataTable
    :value="datas"
    :dataKey="dataKey"
    v-model:selection="selectedDatas"
    :paginator="paginator"
    :rows="5"
    :rowsPerPageOptions="rowsPerPageOptions"
    paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
    currentPageReportTemplate="Showing {first} to {last} of {totalRecords}"
    scrollable
    v-model:filters="filters"
    :globalFilterFields="globalFilterFields"
  >
    <template #empty> No data found. </template>
    <Column
      v-if="useSelection"
      selectionMode="multiple"
      headerStyle="width: 32px"
    ></Column>
    <Column
      v-for="(column, index) in columns"
      :key="index"
      :field="column.field"
      :header="column.header"
      :sortable="column.sortable"
      :style="column.style ? column.style : 'min-width: 120px'"
    >
      <template #body="{ data }" v-if="column.bodyComponent">
        <component
          :is="column.bodyComponent!(data).component"
          v-bind="column.bodyComponent!(data).props"
          v-model="column.bodyComponent!(data).model"
          v-on="column.bodyComponent!(data).events ? column.bodyComponent!(data).events : {}"
        ></component>
      </template>
      <template v-else-if="column.bodyTemplate" #body="{ data }">
        {{ column.bodyTemplate && column.bodyTemplate(data) }}
      </template>
    </Column>
    <Column v-if="useOption" style="width: 35px" frozen alignFrozen="right">
      <template #body="{ data }">
        <Button
          icon="pi pi-ellipsis-h"
          severity="primary"
          rounded
          outlined
          @click="toggleOptions($event, data)"
          class="btn-ellipsis"
        />
      </template>
    </Column>
  </DataTable>
  <Menu v-if="useOption" ref="menu" :model="options" :popup="true">
    <template #item="{ item }">
      <a :class="`p-menuitem-link`" tabindex="-1" aria-hidden="true">
        <span
          :class="`p-menuitem-icon ${item.icon} ${
            item.danger && 'text-danger'
          }`"
        ></span>
        <span :class="`p-menuitem-text ${item.danger && 'text-danger'}`">{{
          item.label
        }}</span>
      </a>
    </template>
  </Menu>
</template>

<style>
.p-datatable .p-sortable-column .p-sortable-column-icon {
  font-size: 9px !important;
  height: 9px !important;
}
</style>

<style scoped lang="scss">
@import '~rfs/scss';

:deep(.p-datatable .p-sortable-column .p-sortable-column-icon) {
  @include font-size(9px !important);
  height: 9px !important;
}

:deep(.p-datatable) {
  @include margin(10px 0);
  .p-sortable-column .p-sortable-column-icon {
    @include font-size(9px);
    height: 9px;
  }
}
:deep(.p-datatable-thead tr th) {
  @include padding(6px 9.6px);
}
:deep(.p-datatable-tbody tr td) {
  @include padding(6px 9.6px);
}

:deep(.p-paginator) {
  @include font-size(11px);
  @include padding(0.5rem 0);
  .p-paginator-first,
  .p-paginator-prev,
  .p-paginator-next,
  .p-paginator-last,
  .p-paginator-pages .p-paginator-page {
    @include font-size(11px);
    min-width: 0;
    width: 24px;
    height: 24px;
  }
}

:deep(.p-column-title) {
  @include font-size(11.2px !important);
}

:deep(.p-datatable-tbody) {
  @include font-size(11.2px !important);
}

:deep(
    .p-dropdown.p-component.p-inputwrapper.p-inputwrapper-filled.p-paginator-rpp-options
  ) {
  width: 48px !important;
  height: 26.2px !important;
}

:deep(.p-dropdown-trigger) {
  width: 18px !important;
  height: 26.2px !important;
}

:deep(.p-dropdown-label.p-inputtext) {
  @include font-size(11px !important);
  display: flex;
  justify-content: center;
  align-items: center;
}

:deep(.p-dropdown-trigger-icon.pi.pi-chevron-down) {
  @include font-size(5.66px !important);
}

:deep(.p-paginator-bottom) {
  display: flex !important;
  justify-content: start !important;
  align-items: center !important;
}

:deep(.btn-ellipsis.p-button) {
  width: 20px;
  height: 20px !important;
  display: flex;
  justify-content: center;
  align-content: center;
  .pi {
    @include font-size(9px);
  }
}
:deep(img) {
  width: 36px;
  border-radius: 8px;
}
</style>
