<script setup lang="ts">
import { ref, computed } from 'vue';
import { TableColumn } from '@/types/columns';
import { MenuOption } from '@/types/options';

const props = defineProps<{
  columns: TableColumn[];
  selectedColumns?: TableColumn[];
  isSelectedAll?: boolean;
  dataKey: string;
  datas: any;
  rows: number;
  loading?: boolean;
  totalRecords?: number;
  useSelection?: boolean;
  selectedDatas?: any;
  useOption?: boolean;
  options?: MenuOption[];
  singleSelect?: boolean;
}>();

const emit = defineEmits<{
  (e: 'set-detail', data: any): void;
  (e: 'select-datas', data: any): void;
  (e: 'row-select', data: any): void;
  (e: 'select-all-change', data: any): void;
  (e: 'update:isSelectedAll', data: boolean): void;
  (e: 'page', data: any): void;
  (e: 'sort', data: any): void;
}>();

const rowsPerPageOptions = ref([5, 10, 20, 50]);
const tableOptions = ref();
const isSelectedAll = computed({
  get() {
    return props.isSelectedAll;
  },
  set(isSelectedAll: boolean) {
    emit('update:isSelectedAll', isSelectedAll);
  },
});

const selectedDatas = computed({
  get() {
    return props.selectedDatas;
  },
  set(newSelectedDatas: any) {
    emit('select-datas', newSelectedDatas);
  },
});

const onRowClick = (event: any) => {
  emit('row-select', event);
};

const toggleOptions = (event: any, data: any) => {
  emit('set-detail', data);
  tableOptions.value.toggle(event);
};
</script>

<template>
  <div class="">
    <!-- DATATABLE -->
    <DataTable
      :value="props.datas"
      v-model:selection="selectedDatas"
      :loading="loading"
      :lazy="true"
      :paginator="true"
      :dataKey="dataKey"
      :rows="props.rows"
      :rowsPerPageOptions="rowsPerPageOptions"
      :totalRecords="totalRecords"
      :selectAll="isSelectedAll"
      :selectionMode="props.singleSelect ? 'single' : undefined"
      @rowClick="onRowClick"
      @page="emit('page', $event)"
      @sort="emit('sort', $event)"
      @select-all-change="emit('select-all-change', $event)"
      @row-unselect="emit('update:isSelectedAll', false)"
      paginatorTemplate="FirstPageLink PrevPageLink PageLinks JumpToPageInput NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
      currentPageReportTemplate="Showing {first} to {last} of {totalRecords}"
      scrollable
    >
      <template #empty> No data found. </template>
      <Column
        v-if="useSelection"
        selectionMode="multiple"
        headerStyle="width: 32px"
      ></Column>
      <Column
        v-for="col of props.columns"
        :key="col.field"
        :field="col.field"
        :header="col.header"
        :style="col.style ? col.style : 'min-width: 120px'"
        :sortable="col.sortable"
      >
        <template #header v-if="col.headerComponent || col.headerTemplate">
          <template v-if="col.headerComponent">
            <component
              :is="col.headerComponent!().component"
              v-bind="col.headerComponent!().props"
              v-on="col.headerComponent!().events ? col.headerComponent!().events : {}"
            ></component>
          </template>
          <template v-else-if="col.headerTemplate">
            {{ col.headerTemplate }}
          </template>
        </template>

        <template v-if="col.bodyComponent" #body="{ data }">
          <component
            :is="col.bodyComponent!(data).component"
            :disabled="col.bodyComponent!(data).disabled"
            v-bind="col.bodyComponent!(data).props"
            v-model="col.bodyComponent!(data).model"
            v-on="col.bodyComponent!(data).events ? col.bodyComponent!(data).events : {}"
            @change="col.bodyComponent!(data).onChange(data)"
          ></component>
        </template>
        <template v-else-if="col.bodyTemplate" #body="{ data }">
          {{ col.bodyTemplate && col.bodyTemplate(data) }}
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

    <!-- TABLE OPTIONS -->
    <Menu
      v-if="useOption"
      ref="tableOptions"
      :model="options"
      :popup="true"
      :pt="{
        root: {
          style: 'min-width: 12.5rem !important; width: auto !important',
        },
      }"
    >
      <template #item="{ item }">
        <a
          :class="`p-menuitem-link text-nowrap`"
          tabindex="-1"
          aria-hidden="true"
        >
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
  </div>
</template>

<style lang="scss" scoped>
@import '../assets/var.scss';
@import '~rfs/scss';

:deep(.p-datatable) {
  @include margin(10px 0);
  .p-sortable-column .p-sortable-column-icon {
    @include font-size(9px);
    height: 9px;
  }
  .p-datatable-thead tr th {
    @include padding(6px 9.6px);
  }
  .p-datatable-tbody tr td {
    @include padding(6px 9.6px);
  }
  .p-paginator {
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
</style>
