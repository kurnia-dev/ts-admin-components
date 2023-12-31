<script setup lang="ts">
import axios from 'axios';
import Tree, { TreeNode } from 'primevue/tree';
import { useToast } from 'primevue/usetoast';
import { onMounted, ref } from 'vue';
import ProgressSpinner from 'primevue/progressspinner';

interface GroupOptions {
  _id: string;
  name: string;
  key: number;
}

const props = withDefaults(
  defineProps<{
    modelValue?: any;
    multi?: boolean;
  }>(),
  {
    multi: false,
  }
);

const emit = defineEmits<{
  'close': [];
  'update:modelValue': [value: any];
}>();

onMounted(async () => {
  await fetchGroupTreeOptions();
  if (props.modelValue) {
    if (props.multi) {
      for (const value of props.modelValue) {
        selectedKeys.value[JSON.stringify(value)] = {
          checked: true,
          partialChecked: false,
        };
      }
    } else {
      selectedKeys.value[JSON.stringify(props.modelValue)] = true;
    }
  }
});

const user = JSON.parse(localStorage.getItem('user')!);
const toast = useToast();

const loading = ref(false);
const isError = ref(false);

const parseToTreeNode = (data: Record<string, any>[]): TreeNode[] => {
  return data.map((d) => ({
    key: JSON.stringify({
      _id: d._id,
      name: d.name,
      key: d.key,
      children: [],
    }),
    label: d.name,
    children: parseToTreeNode(d.children),
  }));
};
const fetchGroupTreeOptions = async () => {
  try {
    loading.value = true;

    const res = await axios.get(
      'https://dev-api-settings.tagsamurai.com/v2/groups/tree',
      {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      }
    );

    if (props.multi) {
      groupOptions.value = parseToTreeNode([
        {
          _id: '-1',
          name: 'All',
          key: -1,
          children: res.data.data,
        },
      ]);
    } else {
      groupOptions.value = parseToTreeNode(res.data.data);
    }

    console.log(groupOptions.value);
  } catch {
    toast.add({
      severity: 'error',
      detail: 'Error, failed load group data.',
      life: 3000,
    });
    isError.value = true;
  } finally {
    loading.value = false;
  }
};
const groupOptions = ref();
const selectedKeys = ref<Record<string, unknown>>({});

const onSave = () => {
  if (selectedKeys.value && Object.keys(selectedKeys.value).length > 0) {
    if (props.multi) {
      const key = Object.keys(selectedKeys.value);
      const parsedKey = key
        .filter((k) => (selectedKeys.value[k] as Record<string, any>).checked)
        .map((k) => JSON.parse(k));

      emit('update:modelValue', parsedKey);
    } else {
      const key = Object.keys(selectedKeys.value)[0];
      const parsedKey: GroupOptions = JSON.parse(key);

      emit('update:modelValue', parsedKey);
    }
  } else {
    emit('update:modelValue', null);
  }
  emit('close');
};
</script>

<template>
  <div>
    <ProgressSpinner v-if="loading" />

    <Tree
      v-else
      v-model:selectionKeys="selectedKeys"
      :value="groupOptions"
      :selectionMode="multi ? 'checkbox' : 'single'"
      class="w-full md:w-30rem"
    >
      <template #default="slotProps">
        <div class="py-2">
          {{ slotProps.node.label || 'A' }}
        </div>
      </template>
    </Tree>

    <div class="d-flex justify-content-end">
      <Button label="Cancel" text plain class="me-2" @click="emit('close')" />

      <Button label="Save" severity="success" @click="onSave" />
    </div>
  </div>
</template>

<style scoped>
:deep(.p-tree-toggler) {
  width: 12px !important;
  height: 12px !important;
  margin-right: 0.5rem !important;
  margin-left: 0.5rem !important;
}
</style>
