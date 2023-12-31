<script lang="ts" setup>
import { ref, reactive, Ref, computed } from 'vue';
import { MenuOption } from '@/types/options';
import { TableColumn } from '@/types/columns';
import ScanRFID from '@/components/ScanRFID/ScanRFIDButton.vue';
import DynamicTable from '../DynamicTable.vue';
import NameContainer from '../NameContainer.vue';
import FilterContainer from '@/components/FilterContainer/FilterContainer.vue';
import OptionSelectionField from '../OptionSelectionField/OptionSelectionField.vue';

const useColumns = (): Ref<TableColumn[]> => {
  return ref<TableColumn[]>([
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

// import { data } from './stock';
const columns = useColumns();
const stock = ref([]);
const totalRecords = ref<number>(100);
const companyList = computed(() =>
  stock.value?.reduce((option: string[], item: any) => {
    if (!option.includes(item.company)) {
      option.push(item.company);
    }

    return option;
  }, []).map((option: any) => {
    return {
      label: option,
      value: option,
    }
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

const companyField = ref<string[]>([]);
</script>
<template>
  <div class="table__toolbar">
    <ScanRFID />
  </div>
  <FilterContainer>
    <template #content>
      <OptionSelectionField v-model="companyField" :options="companyList" mode="multi" label="Company" />
      <OptionSelectionField v-model="companyField" :options="companyList" mode="multi" label="Company" />
      <OptionSelectionField v-model="companyField" :options="companyList" mode="multi" label="Company" />
    </template>
  </FilterContainer>
  <DynamicTable
    :columns="columns"
    :datas="stock"
    dataKey="_id"
    :rows="5"
    :totalRecords="totalRecords"
    :useOption="true"
    :options="options"
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
  />
</template>
