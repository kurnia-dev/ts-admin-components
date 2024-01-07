<script lang="ts" setup>
import { ref, reactive, Ref, computed } from 'vue';
import { MenuOption } from '@/types/options';
import { TableColumn } from '@/types/columns';
import ScanRFID from '@/components/ScanRFID/ScanRFIDButton.vue';
import DynamicTable from './DataTable.vue';
import NameContainer from '../NameContainer.vue';
import FilterContainer from '@/components/FilterContainer/FilterContainer.vue';
import OptionSelectionField from '../OptionSelectionField/OptionSelectionField.vue';
import InputSwitch from '../Input/InputSwitch.vue';
import TSCalendar from '../Calendar/TSCalendar.vue';
import ButtonFilter from '../TSButtons/ButtonFilter.vue';
import SearchButton from '@/components/SearchButton.vue';

const data = [
  {
    image: 'https://loremflickr.com/640/480',
    isDefault: true,
    isActive: true,
    name: 'name 1',
    sku: 'sku 1',
    category: 'category 1',
    brand: 'brand 1',
    model: 'model 1',
    stock: 67,
    lastTransaction: 'lastTransaction 1',
    transactionQty: 40,
    company: 'company 1',
    manager: 'manager 1',
    transactionDate: 'transactionDate 1',
    _id: '1',
  },
  {
    image: 'https://loremflickr.com/640/480',
    isDefault: true,
    isActive: true,
    name: 'name 2',
    sku: 'sku 2',
    category: 'category 2',
    brand: 'brand 2',
    model: 'model 2',
    stock: 61,
    lastTransaction: 'lastTransaction 2',
    transactionQty: 47,
    company: 'company 2',
    manager: 'manager 2',
    transactionDate: 'transactionDate 2',
    _id: '2',
  },
  {
    image: 'https://loremflickr.com/640/480',
    isDefault: false,
    isActive: false,
    name: 'name 3',
    sku: 'sku 3',
    category: 'category 3',
    brand: 'brand 3',
    model: 'model 3',
    stock: 61,
    lastTransaction: 'lastTransaction 3',
    transactionQty: 80,
    company: 'company 3',
    manager: 'manager 3',
    transactionDate: 'transactionDate 3',
    _id: '3',
  },
  {
    image: 'https://loremflickr.com/640/480',
    isDefault: false,
    isActive: true,
    name: 'name 4',
    sku: 'sku 4',
    category: 'category 4',
    brand: 'brand 4',
    model: 'model 4',
    stock: 13,
    lastTransaction: 'lastTransaction 4',
    transactionQty: 52,
    company: 'company 4',
    manager: 'manager 4',
    transactionDate: 'transactionDate 4',
    _id: '4',
  },
  {
    image: 'https://loremflickr.com/640/480',
    isDefault: true,
    isActive: true,
    name: 'name 5',
    sku: 'sku 5',
    category: 'category 5',
    brand: 'brand 5',
    model: 'model 5',
    stock: 83,
    lastTransaction: 'lastTransaction 5',
    transactionQty: 27,
    company: 'company 5',
    manager: 'manager 5',
    transactionDate: 'transactionDate 5',
    _id: '5',
  },
];

const useColumns = (): Ref<TableColumn[]> => {
  return ref<TableColumn[]>([
    {
      field: 'name',
      header: 'Device Name',
      sortable: false,
      fixed: true,
      bodyComponent: (data: any) => {
        return {
          component: InputSwitch,
          model: data.isActive,
          props: {
            disabled: data.isDefault,
          },
          events: {
            'update:modelValue': (e: boolean) => {
              data.isActive = e;
            },
          },
        };
      },
    },
    {
      field: 'name',
      header: 'Device Name',
      sortable: true,
      fixed: true,
      bodyTemplate: (data: any) => data.name,
    },
    {
      field: 'sku',
      header: 'SKU',
      fixed: true,
      sortable: true,
    },
    {
      field: 'category',
      header: 'Category',
      sortable: true,
      bodyComponent(data: any) {
        return {
          component: NameContainer,
          props: {
            isDefault: true,
            isActive: true,
            name: data.category,
          },
        };
      },
    },
    {
      field: 'brand',
      header: 'Brand',
      sortable: true,
      bodyComponent(data: any) {
        return {
          component: NameContainer,
          props: {
            isDefault: true,
            isActive: true,
            name: data.brand,
          },
        };
      },
    },
    {
      field: 'model',
      header: 'Model/Type',
      sortable: true,
      bodyComponent(data: any) {
        return {
          component: NameContainer,
          props: {
            isDefault: true,
            isActive: true,
            name: data.model,
          },
        };
      },
    },
    {
      field: 'stock',
      header: 'Current Stock',
      sortable: true,
    },
    {
      field: 'lastTransaction',
      header: 'Last Transaction',
      sortable: true,
    },
    {
      field: 'transactionQty',
      header: 'Transaction Qty',
      sortable: true,
      bodyTemplate: (data: any) =>
        data.transactionQty ? data.transactionQty : 0,
    },
    {
      field: 'company',
      header: 'Partner/Client',
      sortable: true,
      bodyTemplate: (data: any) => (data.company ? data.company : '-'),
    },
    {
      field: 'manager',
      header: 'Manager',
      sortable: true,
      bodyTemplate: (data: any) => (data.manager ? data.manager : '-'),
    },
    {
      field: 'transactionDate',
      header: 'Transaction Date',
      sortable: true,
    },
  ]);
};

const columns = useColumns();
const stock = ref(data);
const totalRecords = ref<number>(data.length);
const companyList = computed(() =>
  stock.value
    ?.reduce((option: string[], item: any) => {
      if (!option.includes(item.company)) {
        option.push(item.company);
      }

      return option;
    }, [])
    .map((option: any) => {
      return {
        label: option,
        value: option,
      };
    })
);

/**
 * To store the item's _id on set-detail event
 */
const _id = ref<string>('');

const options = ref<MenuOption[]>([
  {
    label: 'Add Stock Add Stock Add Stock',
    icon: 'ri-add-line',
    command: () => {
      //
    },
  },
  {
    label: 'Detail',
    icon: 'ri-file-info-line',
    command: () => {
      showDetail.value = true;
    },
  },
]);

const showDetail = ref<boolean>(false);

/**
 * Defining type for filter params for fetching datas
 */

interface FilterParams {
  name?: string;
  brand?: string;
  model?: string;
  stock?: number;
  lastTransaction?: string;
  transactionQty?: number;
  company?: string;
  manager?: string;
  transactionDate?: string;
}

/**
 * Type of params included in fetch API
 *
 * @extends FilterParams - Include all of the filter parameter
 */
interface FetchParams extends FilterParams {
  search?: string;
  page?: number;
  limit?: number;
  sortOrder?: number;
  sortField?: string;
}

const fetchParams = reactive<FetchParams>({});

const sortTable = (data: any) => {
  fetchParams.sortOrder = data.sortOrder;
  fetchParams.sortField = data.sortField;
};

const selectedDatas = ref<any[]>();
const isSelectedAll = ref<boolean>(false);
const filter = reactive<any>({});
const clear = () => {
  const keys = Object.keys(filter);
  keys.forEach((key: string) => {
    delete filter[key];
  });

  console.log(filter);
};

const showFilter = ref<boolean>(false);
</script>
<template>
  <div class="d-flex gap-2 justify-content-end">
    <ScanRFID />
    <SearchButton @search="console.log($event)" />
    <ButtonFilter v-model:show-filter="showFilter" />
  </div>
  <FilterContainer
    v-show="showFilter"
    @clear="clear"
    @apply="console.log(filter)"
  >
    <template #content>
      <OptionSelectionField
        v-model="filter.companyField"
        :options="companyList"
        mode="single"
        label="Company"
      />
      <TSCalendar v-model="filter.date" label="Single Select" mode="single" />
      <OptionSelectionField
        v-model="filter.company"
        :options="companyList"
        mode="multi"
        label="Company"
      />
    </template>
  </FilterContainer>
  <DynamicTable
    :columns="columns"
    :datas="stock"
    v-model:selected-datas="selectedDatas"
    v-model:is-selected-all="isSelectedAll"
    dataKey="_id"
    :rows="5"
    :totalRecords="totalRecords"
    :useOption="true"
    :options="options"
    use-paginator
    @page="(data: any) => {
      fetchParams = Object.assign(fetchParams, {
        page: data.page + 1,
        limit: data.rows,
      })
    }"
    @sort="sortTable"
    @set-detail="(item: any) => {
      _id = item._id;
    }"
    use-selection
    @select-all-change="selectedDatas = $event.checked ? data : []"
  />
  <DynamicTable
    :columns="columns"
    :datas="stock"
    v-model:selected-datas="selectedDatas"
    v-model:is-selected-all="isSelectedAll"
    dataKey="_id"
    :useOption="true"
    :options="options"
    @sort="sortTable"
    @set-detail="(item: any) => {
      _id = item._id;
    }"
    use-selection
    @select-all-change="selectedDatas = $event.checked ? data : []"
  />
</template>
