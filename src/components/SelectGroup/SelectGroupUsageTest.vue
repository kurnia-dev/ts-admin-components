<script setup lang="ts">
import SelectGroup from './SelectGroup.vue';
import SelectGroupNew from '../ts-components/selectgroup/SelectGroup.vue';
import { ref, watch } from 'vue';
import Button from '../TSButtons/Button.vue';
import SelectTree from '../ts-components/selecttree/SelectTree.vue';

const group = ref<number[]>([]);
const group2 = ref<number[]>([2]);
const groupKey = ref<number>(0);

// SelectTree show
const showCategoryAddMulti = ref<boolean>(false);
const showCategoryEditMulti = ref<boolean>(false);
const showCategoryAddSingle = ref<boolean>(false);
const showCategoryEditSingle = ref<boolean>(false);
const showGroupAddMulti = ref<boolean>(false);
const showGroupEditMulti = ref<boolean>(false);
const showGroupAddSingle = ref<boolean>(false);
const showGroupEditSingle = ref<boolean>(false);

// SelectTree example edit mode
const multiCategoryEdit = [
  {
    _id: '65656ff29fd4ddca06124eb8',
    key: 6,
    name: 'Short Range',
  },
  {
    _id: '656570219fd4ddca06124ec3',
    key: 9,
    name: 'Desktop',
  },
  {
    _id: '656570269fd4ddca06124ec6',
    key: 10,
    name: 'Box',
  },
];
const singleCategoryEdit = [
  {
    _id: '65656ff29fd4ddca06124eb8',
    key: 6,
    name: 'Short Range',
  },
];
const multiGroupEdit = [
  {
    _id: '65d085006e98e3b0d2c79996',
    name: 'Sulawesi Tengah',
    key: 5,
  },
  {
    _id: '65d088856e98e3b0d2c799b5',
    name: 'Sulawesi Tengah tengahnya lagi',
    key: 6,
  },
];
const singleGroupEdit = [
  {
    _id: '656fec3313a0a2bc624c297c',
    name: 'Jambi',
    key: 1,
  },
];

watch(groupKey, () => {
  console.log(groupKey.value);
});
</script>
<template>
  <div class="d-flex gap-4">
    <SelectGroupNew selectionMode="single" dialogHeader="Assign Group" />
    <SelectGroup
      :key="groupKey"
      v-model="group"
      selectionMode="checkbox"
      :params="{ full: true }"
    />
    <SelectGroup
      singleSelectedGroupName="Group XYZ"
      v-model="group2"
      selectionMode="single"
      :params="{ full: true }"
    />
  </div>
  <div>
    <!-- SelectTree component usage test -->
    <h1>Select Tree</h1>
    <h3>Category</h3>
    <div class="d-flex gap-4">
      <div>
        <label>Add Multi</label>
        <SelectTree
          :key="groupKey"
          v-model:show="showCategoryAddMulti"
          @multi-change="console.log($event)"
          action-mode="Add"
          selection-mode="checkbox"
          type="Category"
        />
      </div>
      <div>
        <label>Edit Multi</label>
        <SelectTree
          :key="groupKey"
          v-model:show="showCategoryEditMulti"
          :selected-nodes="multiCategoryEdit"
          @multi-change="console.log($event)"
          action-mode="Edit"
          selection-mode="checkbox"
          type="Category"
        />
      </div>
      <div>
        <label>Add Single</label>
        <SelectTree
          :key="groupKey"
          v-model:show="showCategoryAddSingle"
          @multi-change="console.log($event)"
          action-mode="Add"
          selection-mode="single"
          type="Category"
        />
      </div>
      <div>
        <label>Edit Single</label>
        <SelectTree
          :key="groupKey"
          v-model:show="showCategoryEditSingle"
          :selected-nodes="singleCategoryEdit"
          @multi-change="console.log($event)"
          action-mode="Edit"
          selection-mode="single"
          type="Category"
        />
      </div>
    </div>
    <h3>Group</h3>
    <div class="d-flex gap-4">
      <div>
        <label>Add Multi</label>
        <SelectTree
          :key="groupKey"
          v-model:show="showGroupAddMulti"
          @multi-change="console.log($event)"
          action-mode="Add"
          selection-mode="checkbox"
          type="Group"
        />
      </div>
      <div>
        <label>Edit Multi</label>
        <SelectTree
          :key="groupKey"
          v-model:show="showGroupEditMulti"
          :selected-nodes="multiGroupEdit"
          @multi-change="console.log($event)"
          action-mode="Edit"
          selection-mode="checkbox"
          type="Group"
        />
      </div>
      <div>
        <label>Add Single</label>
        <SelectTree
          :key="groupKey"
          v-model:show="showGroupAddSingle"
          @multi-change="console.log($event)"
          action-mode="Add"
          selection-mode="single"
          type="Group"
        />
      </div>
      <div>
        <label>Edit Single</label>
        <SelectTree
          :key="groupKey"
          v-model:show="showGroupEditSingle"
          :selected-nodes="singleGroupEdit"
          @multi-change="console.log($event)"
          action-mode="Edit"
          selection-mode="single"
          type="Group"
        />
      </div>
    </div>
    <h3>Disabled/Read-only example</h3>
    <div class="d-flex">
      <div>
        <label>Read only Single</label>
        <SelectTree
          :key="groupKey"
          v-model:show="showGroupEditMulti"
          :disabled="true"
          :selected-nodes="multiGroupEdit"
          action-mode="Edit"
          selection-mode="single"
          type="Group"
        />
      </div>
      <div>
        <label>Read only Multi</label>
        <SelectTree
          :key="groupKey"
          v-model:show="showGroupEditMulti"
          :disabled="true"
          :selected-nodes="multiGroupEdit"
          action-mode="Edit"
          selection-mode="checkbox"
          type="Group"
        />
      </div>
    </div>
  </div>
  <Button label="reset" @click="groupKey++" />
</template>
