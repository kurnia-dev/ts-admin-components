<script setup lang="ts">
import { ref, computed, watch, onMounted, nextTick } from 'vue';
import { TableColumn } from '@/types/columns';
import { MenuOption } from '@/types/options';
import type Menu from 'primevue/menu';
import DataTable, {
  DataTablePageEvent,
  DataTableSelectAllChangeEvent,
  DataTableSortEvent
} from 'primevue/datatable';

type Data = Record<string, any>;

const props = defineProps<{
  /**
   * An array of table columns to display.
   */
  columns: TableColumn[];
  /**
   * An array of objects to display in the table.
   */
  datas: Data[];
  /**
   * The key of the data object to use as a unique identifier.
   */
  dataKey: string;
  /**
   * The number of rows to display per page.
   * @defaultValue 5
   */
  rows?: number;
  /**
   * Whether all rows are selected or not.
   */
  isSelectedAll?: boolean;
  /**
   * Whether to display a loading animation on the table.
   */
  loading?: boolean;
  /**
   * The total number of records in the table.
   * Defaults to the length of `datas` when not defined.
   */
  totalRecords?: number;
  /**
   * Whether to enable checkbox multi-selection.
   */
  useSelection?: boolean;
  /**
   * The name of the property in each item of the `datas` array that determines whether the checkbox for that row should be enabled or disabled.
   * If a row's value for the `selectionKey` property is truthy, the checkbox for that row will be enabled. If it is falsy, the checkbox will be disabled.
   */
  selectionKey?: string;
  /**
   * An array of selected objects from `datas`.
   */
  selectedDatas?: Data[];
  /**
   * Whether to display an options menu for each row or not.
   * The options menu will be displayed on the right side of the table row.
   */
  useOption?: boolean;
  /**
   * The options that will be visible for each row data.
   */
  options?: MenuOption[];
  /**
   * Whether to enable single selection or not.
   * If enabled, clicking a row will trigger the `rowSelect` event with the corresponding data object passed as a parameter.
   *
   * @note Do not combine `singleSelect` with `useSelection`, as it may lead to unexpected behavior.
   */
  singleSelect?: boolean;
  /**
   * Wether display pagination under the table or not.
   */
  usePaginator?: boolean;
}>();

const emit = defineEmits<{
  'setDetail': [data: Data];
  'selectDatas': [data: Data[]];
  'rowSelect': [data: Data];
  /**
   * Event emitted when the `isSelectedAll` property is updated.
   *
   * @event update:isSelectedAll
   * @param {boolean} data - The updated value of `isSelectedAll`.
   *
   * @example
   * <DynamicTable v-model:is-selected-all="isSelectedAll" />
   *
   * This will update the `isSelectedAll` value when one of checkbox is unchecked.
   */
  'update:isSelectedAll': [data: boolean];
  'selectAllChange': [data: DataTableSelectAllChangeEvent];
  /**
   * Event emitted when the page changes in the data table.
   *
   * @event page
   * @param {DataTablePageEvent} data - The event data containing information about the new page.
   *
   * @example
   * <DynamicTable @page="handlePageChange" />
   *
   * This will call the `handlePageChange` method whenever the page changes in the data table.
   */
  'page': [data: DataTablePageEvent];

  /**
   * Event emitted when the sort order changes in the data table.
   *
   * @event sort
   * @param {DataTableSortEvent} data - The event data containing information about the new sort order.
   *
   * @example
   * <DynamicTable @sort="handleSortChange" />
   *
   * This will call the `handleSortChange` method whenever the sort order changes in the data table.
   */
  'sort': [data: DataTableSortEvent];
  /**
   * Event emitted when the `selectedDatas` property is updated.
   *
   * @event update:selectedDatas
   * @param {Data[]} datas - The updated array of selected data objects.
   *
   * @example
   * <DynamicTable v-model:selected-datas="selectedDatas" />
   *
   * This will update the `selectedDatas` value whenever a row is selected or deselected.
   */
  'update:selectedDatas': [datas: Data[]];
}>();

const tableOptions = ref<Menu | null>(null);
const customColumn = ref<Menu | null>(null);
const tableOffsetTop = ref<number>(0);
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

/**
 * Filter the disabled row data.
 */
const filterSelectedDatas = (datas?: Data[]) => {
  return (datas ?? []).filter(
    (data: any) => !disabledRows.value.includes(data[props.dataKey])
  );
};

const selectedDatas = computed({
  get() {
    return filterSelectedDatas(props.selectedDatas);
  },
  set(newSelectedDatas: Data[]) {
    const filtered = filterSelectedDatas(newSelectedDatas);
    emit('selectDatas', filtered);
    emit('update:selectedDatas', filtered);
    const total = props.totalRecords ?? props.datas?.length ?? 0;
    const checked = total == filtered.length + disabledRows.value.length;
    emit('update:isSelectedAll', checked);
  },
});

const onRowClick = (event: any) => {
  emit('rowSelect', event);
};

const toggleOptions = (event: any, data: any) => {
  emit('setDetail', data);
  tableOptions.value?.toggle(event);
};

const toggleCustomColumn = async (event: any) => {
  customColumn.value?.toggle(event);
  await nextTick();
  const menu = document.querySelector('#custom_column_menu') as HTMLDivElement;
  if (menu) menu.style.top = tableOffsetTop.value + 40 + 'px';
};

const selectColumn = (cols: TableColumn[]) => {
  selectedColumns.value = props.columns.filter((col) =>
    cols.map((col) => col.field).includes(col.field)
  );
};

const checkboxClass = ref<string>('');
const disabledRows = computed(() => {
  return [props.datas ?? []]
    .filter((data: any) => data[props.selectionKey ?? 'isDefault'])
    .map((data: any) => data[props.dataKey]);
});

const disableCheckbox = () => {
  checkboxClass.value = 'checkbox' + +new Date();
  const checkboxes = document.getElementsByClassName(checkboxClass.value);

  nextTick(() => {
    disabledRows.value.forEach((row) => {
      const index = [props.datas ?? []].findIndex(
        (data: any) => data[props.dataKey] == row
      );

      if (index !== -1) {
        checkboxes[index]?.classList.add('disabled');
      }
    });
  });
};

onMounted(() => {
  disableCheckbox();
  const table = document.querySelector('.ts-datatable') as HTMLDivElement;
  tableOffsetTop.value = table.offsetTop;
});

watch(props, () => {
  if (props.datas?.length) {
    setTimeout(disableCheckbox, 500);
  }
});
</script>

<template>
  <DataTable
    v-model:selection="selectedDatas"
    :value="props.datas ?? []"
    :loading="loading"
    :lazy="true"
    :paginator="usePaginator"
    :data-key="dataKey"
    :rows="usePaginator ? props.rows ?? 5 : undefined"
    :rows-per-page-options="rowsPerPageOptions"
    :total-records="totalRecords ?? datas?.length ?? 0"
    :select-all="isSelectedAll"
    :selection-mode="props.singleSelect ? 'single' : undefined"
    @row-click="onRowClick"
    @page="emit('page', $event)"
    @sort="emit('sort', $event)"
    @select-all-change="
      emit('selectAllChange', $event),
        emit('update:isSelectedAll', $event.checked)
    "
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
      :body-class="checkboxClass"
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
          @change="col.bodyComponent!(data).onChange?.(data)"
          @update:modelValue="col.bodyComponent!(data).onChange?.(data)"
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
    ref="customColumn"
    id="custom_column_menu"
    v-if="useOption"
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
      <span
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
        <label :for="item.field">{{ item.header }}</label>
      </span>
    </template>
  </Menu>
</template>
<style lang="scss">
@import '~rfs/scss';
@import 'scss/var';

.ts-datatable.p-datatable {
  display: flex;
  flex-direction: column;
  gap: 10px;

  .p-datatable-thead {
    @include font-size(11.2px);
    font-style: normal;
    font-weight: 600;
    line-height: 16px;
    letter-spacing: 0.224px;

    > tr > th {
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
        white-space: nowrap;
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
      border-radius: 7px !important;
      border: 1px solid $general-body;
      width: max-content;
      height: 26.2px;
      @include padding(4px 12px);
      @include rfs(16px, line-height);
      color: $general-label;

      span {
        padding: 0;
        @include font-size(11.2px !important);
      }
    }

    .p-paginator-page-input input {
      border-color: $general-grey;
    }

    .p-dropdown {
      gap: 4px;

      .p-dropdown-label {
        padding-left: 0;
      }

      .p-dropdown-trigger {
        width: max-content;
        &-icon {
          width: 10px;
          height: 10px;
        }
      }
    }
  }

  .p-frozen-column {
    right: -1px !important;
  }

  td.p-selection-column.disabled {
    .p-checkbox .p-checkbox-box {
      border-radius: 4px !important;
      border: 2px solid $general-placeholder !important;
      background: $general-input !important;
    }
  }

  .p-checkbox .p-checkbox-box.p-highlight {
    .p-checkbox-icon {
      color: transparent;
    }
  }

  th,
  td.p-selection-column:not(.disabled) {
    .p-checkbox .p-checkbox-box.p-highlight {
      border: none !important;
      background: $primary !important;

      .p-checkbox-icon {
        color: $general-bg-white;
        width: 10px;
        height: 10px;
        position: absolute;
        top: 48%;
        transform: translate(0, -50%);
      }
    }
  }

  tr.p-highlight:has(td.disabled) {
    background: $general-bg-white;
  }

  tr:has(td.disabled):focus {
    outline: none !important;
  }

  .p-datatable-loading-overlay {
    background-color: rgba(0, 0, 0, 0.1);
  }
}

.p-menu.p-menu-overlay {
  @include padding(4px 0);

  .p-menuitem-content,
  .p-menuitem-select-column {
    display: flex;
    flex: 1 0 0;
    align-items: baseline;
    @include padding(0 0 0 16px);

    color: $general-body;

    .p-checkbox,
    .p-checkbox-box {
      width: 12.8px;
      height: 12.8px;
      border-radius: 3px;
    }

    > label {
      @include padding(11px 16px 11px 8px);
      flex-grow: 1;
      cursor: pointer;
    }

    .p-menuitem-icon {
      @include font-size(12.8px);
    }

    @include font-size(11.2px);
    font-weight: 500;
    @include rfs(16.8px, line-height);
  }

  .p-menuitem-content {
    gap: 8px;
    padding: 5.6px 12px;
    cursor: pointer;
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
      border-color: $general-placeholder !important;
      background: $general-placeholder !important;
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
