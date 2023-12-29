<script lang="ts" setup>
import { ref, onMounted, watch, useAttrs } from 'vue';

const attrs: any = useAttrs();

onMounted(() => {
  datas.value = attrs['modelValue'];
});

const datas = ref<string[]>([]);

const addInput = () => {
  datas.value.push('');
};

const removeInput = (index: number) => {
  datas.value.splice(index, 1);
};

watch(datas, (val: string[]) => attrs['onUpdate:modelValue'](val));
</script>

<template>
  <div class="">
    <div
      v-for="(data, index) in datas"
      :key="index"
      class="d-flex align-items-center gap-2 mb-2"
    >
      <div class="flex-grow-1">
        <InputText type="text" v-model="datas[index]" class="col-12" />
      </div>
      <Button
        icon="ri-delete-bin-6-line"
        severity="danger"
        text
        @click="removeInput(index)"
      />
    </div>
    <Button icon="ri-add-line" class="" @click="addInput" />
  </div>
</template>
