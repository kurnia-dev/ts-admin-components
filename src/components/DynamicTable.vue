<script setup lang="ts">
import { ref, computed } from 'vue';
import { TableColumn } from '@/types/columns';
import { MenuOption } from '@/types/options';
import type Menu from 'primevue/menu';

const props = defineProps<{
  columns: TableColumn[];
  dataKey: string;
  datas: any;
  rows: number;
  selectedColumns?: TableColumn[];
  isSelectedAll?: boolean;
  loading?: boolean;
  totalRecords?: number;
  useSelection?: boolean;
  selectedDatas?: any;
  useOption?: boolean;
  options?: MenuOption[];
  singleSelect?: boolean;
}>();

const emit = defineEmits<{
  'setDetail': [data: any];
  'selectDatas': [data: any];
  'rowSelect': [data: any];
  'selectAllChange': [data: any];
  'update:isSelectedAll': [data: boolean];
  'page': [data: any];
  'sort': [data: any];
}>();

const tableOptions = ref<Menu | null>(null);
const customColumn = ref<Menu | null>(null);
const rowsPerPageOptions = ref([5, 10, 20, 50]);
const selectedColumns = ref<TableColumn[]>(props.columns);

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
    emit('selectDatas', newSelectedDatas);
  },
});

const onRowClick = (event: any) => {
  emit('rowSelect', event);
};

const toggleOptions = (event: any, data: any) => {
  emit('setDetail', data);
  tableOptions.value?.toggle(event);
};

const toggleCustomColumn = (event: any) => {
  customColumn.value?.toggle(event);
};

const selectColumn = (cols: TableColumn[]) => {
  selectedColumns.value = props.columns.filter((col) =>
    cols.map((col) => col.field).includes(col.field)
  );
};
</script>

<template>
  <DataTable
    v-model:selection="selectedDatas"
    :value="props.datas"
    :loading="loading"
    :lazy="true"
    :paginator="true"
    :data-key="dataKey"
    :rows="props.rows"
    :rows-per-page-options="rowsPerPageOptions"
    :total-records="totalRecords"
    :select-all="isSelectedAll"
    :selection-mode="props.singleSelect ? 'single' : undefined"
    @row-click="onRowClick"
    @page="emit('page', $event)"
    @sort="emit('sort', $event)"
    @select-all-change="emit('selectAllChange', $event)"
    @row-unselect="emit('update:isSelectedAll', false)"
    paginator-template="FirstPageLink PrevPageLink PageLinks JumpToPageInput NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
    current-page-report-template="Showing {first} to {last} of {totalRecords}"
    scrollable
    class="ts-datatable"
  >
    <template #empty> No data found. </template>
    <Column
      v-if="useSelection"
      selection-mode="multiple"
      header-style="width: 32px"
    />
    <Column
      v-for="col of selectedColumns"
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
      <template #header>
        <i class="ri-more-fill" @click="toggleCustomColumn" />
      </template>
      <template #body="{ data }">
        <Button
          @click="toggleOptions($event, data)"
          icon="ri-more-fill"
          severity="primary"
          rounded
          outlined
          class="btn-ellipsis"
        />
      </template>
    </Column>
  </DataTable>

  <Menu
    ref="tableOptions"
    v-if="useOption"
    :model="options"
    :popup="true"
    :pt="{
      root: {
        style: 'min-width: 12.5rem !important; width: auto !important',
      },
    }"
  >
    <template #item="{ item }">
      <span
        :class="['p-menuitem-icon', item.icon, { 'text-danger': item.danger }]"
      ></span>
      <span :class="['p-menuitem-text', { 'text-danger': item.danger }]">
        {{ item.label }}
      </span>
    </template>
  </Menu>
  <Menu
    v-if="useOption"
    ref="customColumn"
    :model="props.columns"
    :popup="true"
    :pt="{
      root: {
        style: 'min-width: 12.5rem !important; width: auto !important',
      },
      content: { style: 'align-items: center; padding: 0' },
    }"
  >
    <template #item="{ item }">
      <label
        :class="['p-menuitem-select-column', { disabled: item.fixed }]"
        @click.stop=""
      >
        <Checkbox
          :modelValue="selectedColumns"
          :inputId="item.field"
          :value="item"
          :disabled="item.fixed"
          @update:modelValue="selectColumn"
        />
        {{ item.header }}
      </label>
    </template>
  </Menu>
</template>
<style lang="scss">
@import '~rfs/scss';
@import 'scss/var';

.ts-datatable {
  display: flex;
  flex-direction: column;
  gap: 10px;

  .p-datatable-thead {
    @include font-size(11.2px);
    font-style: normal;
    font-weight: 600;
    line-height: 16px;
    letter-spacing: 0.224px;

    th.p-sortable-column,
    th.p-frozen-column {
      height: 28px;
      padding: 6px 9.6px;
      border-bottom: 1px solid $general-line;
      background: $primary-weak;
    }

    th.p-frozen-column {
      padding: 0;

      i.ri-more-fill {
        padding: 6px 9.6px;
        width: 100%;
        text-align: center;
      }
    }

    th.p-frozen-column .p-column-header-content {
      cursor: pointer;
      justify-content: center;
    }

    th.p-sortable-column:hover,
    th.p-frozen-column:hover {
      background: $primary-bg-strong;
    }

    .p-column-header-content {
      gap: 6.4px;
      color: $general-header-weak;

      .p-column-title {
        width: max-content;
        white-space: nowrap;
      }

      span:last-child {
        height: 16px;
      }

      .p-sortable-column-icon {
        width: 12.8px;
        height: 12.8px;
        color: $general-header-weak;
        margin-left: 0;
      }
    }
  }

  .p-datatable-tbody {
    tr {
      color: $general-body !important;

      @include font-size(11.2px);
      font-style: normal;
      font-weight: 500;
      line-height: 16.8px;
      outline: none;

      td {
        border: none !important;
        padding: 6px 9.6px !important;
      }

      .p-frozen-column {
        .p-button-icon-only.btn-ellipsis {
          padding: 0 !important;
          height: 1rem;
          width: 1rem;

          .pi {
            @include font-size(9px);
          }
        }
      }
    }
  }

  .p-paginator-bottom {
    .p-paginator {
      padding: 0;
      justify-content: start;
    }

    button.p-paginator-element.p-link {
      min-width: unset;
      font-weight: 500;
      padding: 8px;
      font-size: 11px;
      width: 24px;
      height: 24px;
      color: $general-placeholder;

      .p-icon.p-paginator-icon {
        flex-shrink: 0;
      }
    }

    button.p-paginator-element.p-link.p-highlight {
      color: $primary;
    }

    button.p-paginator-element.p-link:hover {
      background: $primary-weak;
    }

    button.p-paginator-element.p-link:active {
      color: $primary;
      background: $primary-bg-strong;
    }

    .p-paginator-current {
      color: $general-header-weak;
      @include font-size(11.2px);
      font-style: normal;
      font-weight: 300;
      line-height: 16px;
      min-width: unset;
      height: unset;
    }

    .p-paginator-rpp-options,
    .p-paginator-page-input input {
      border-radius: 7px;
      border: 1px solid $general-body;
      width: max-content;
      height: max-content;
      @include padding(4px 12px);
      @include rfs(16px, line-height);
      color: $general-label;

      span {
        @include font-size(11.2px !important);
      }
    }

    .p-dropdown {
      gap: 4px;

      .p-dropdown-label {
        padding-left: 0;
      }

      .p-dropdown-trigger {
        width: max-content;
      }
    }
  }

  .p-frozen-column {
    right: -1px !important;
  }
}

.p-menu.p-menu-overlay {
  @include padding(4px 0);

  .p-menuitem-content,
  .p-menuitem-select-column {
    display: flex;
    flex: 1 0 0;
    align-items: baseline;
    cursor: pointer;
    @include padding(11px 16px);
    @include rfs(8px, gap);

    color: $general-body;

    .p-checkbox,
    .p-checkbox-box {
      width: 12.8px;
      height: 12.8px;
      border-radius: 3px;
    }

    .p-menuitem-icon {
      @include font-size(12.8px);
    }

    @include font-size(11.2px);
    font-weight: 500;
    @include rfs(16.8px, line-height);
  }

  .p-menuitem-content:hover {
    color: $general-body;
    background: $primary-weak !important;
  }

  .p-menuitem-select-column {
    align-items: center;
  }

  .p-menuitem-select-column.disabled {
    cursor: default;

    .p-checkbox-box {
      border-color: $general-placeholder;
      background: $general-placeholder;
    }
  }

  .p-menuitem-select-column.disabled:hover {
    background: #a0a3bd1a;
  }
}

.p-menu .p-menuitem:not(.p-highlight):not(.p-disabled).p-focus {
  > .p-menuitem-content {
    background: none !important;
  }

  > .p-menuitem-content:hover {
    color: $general-body;
    background: $primary-weak !important;
  }
}
</style>
