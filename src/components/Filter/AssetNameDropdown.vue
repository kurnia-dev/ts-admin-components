<script setup lang="ts">
import axios from 'axios';
import { computed, onMounted, ref, watch } from 'vue';
import { useToast } from 'primevue/usetoast';
import Dropdown from 'primevue/dropdown';
import MultiSelect from 'primevue/multiselect';

onMounted(() => {
  fetchOptions();
});

interface AssetNameOptions {
  _id: string;
  key: number;
  name: string;
}

const props = withDefaults(
  defineProps<{
    label?: string;
    placeholder?: string;
    modelValue?: any;
    multi?: boolean;
    optionLabel?: keyof AssetNameOptions;
    optionValue?: keyof AssetNameOptions;
  }>(),
  {
    label: 'Asset Name',
    multi: false,
    optionLabel: 'name',
    optionValue: 'key',
  }
);

const emit = defineEmits<{
  'update:modelValue': [value: any];
}>();

const user = JSON.parse(localStorage.getItem('user')!);
const toast = useToast();

const selected = computed({
  get() {
    return props.modelValue;
  },
  set(newValue) {
    emit('update:modelValue', newValue);
  },
});

const isLoading = ref(false);

const options = ref<AssetNameOptions[]>([]);
const fetchOptions = async () => {
  try {
    isLoading.value = true;

    const res = await axios.get(
      'https://dev-api-settings.tagsamurai.com/v2/policy-assets/filter-options',
      {
        params: {
          filterType: 'name',
        },
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      }
    );

    options.value = res.data.data.options;
  } catch {
    toast.add({
      severity: 'error',
      detail: 'Error, failed load asset name.',
      life: 3000,
    });
  } finally {
    isLoading.value = false;
  }
};
</script>

<template>
  <div>
    <label class="fw-semibold mb-2">
      {{ label }}
    </label>

    <Dropdown
      v-if="!multi"
      v-model="selected"
      :options="options"
      :optionLabel="optionLabel"
      :optionValue="optionValue"
      :placeholder="placeholder || `Select ${label.toLowerCase()}`"
      :loading="isLoading"
      filter
      filterPlaceholder="Search"
      filterIcon="ri-search-line"
    />
    <MultiSelect
      v-else
      v-model="selected"
      :options="options"
      :optionLabel="optionLabel"
      :optionValue="optionValue"
      :placeholder="placeholder || `Select ${label.toLowerCase()}`"
      :loading="isLoading"
      filter
      filterPlaceholder="Search"
      filterIcon="ri-search-line"
      display="chip"
    />
  </div>
</template>

<style scoped></style>
