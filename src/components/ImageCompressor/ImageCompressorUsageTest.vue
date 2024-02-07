<script setup lang="ts">
import { ref } from 'vue';
import ImageCompressor from '../ImageCompressor-v2.vue';
import { useForm } from 'vee-validate';

const { handleSubmit } = useForm();

const form = ref<any>({});
const imageBlob = ref<any>();
const imageCompressorKey = ref(0);
const setImage = (e: any) => {
  if (e.compressed?.newFile) {
    form.value.documentation = e.compressed?.newFile;
  }

  console.log(form.value);
  imageBlob.value = e.compressed?.blob;
};

const imageBlob2 = ref<any>();
const imageCompressorKey2 = ref(0);

const imageCompressorKey3 = ref(0);

const onSubmit = handleSubmit((values) => {
  // it will executed only if all required field has filled 
  console.log(values);
});

const previewUrl = ref<string | undefined>('https://assets-a1.kompasiana.com/statics/crawl/552b01886ea83423038b4567.jpeg')
</script>
<template>
  <form class="d-flex gap-4 align-items-start" @submit="onSubmit">
    <ImageCompressor
      :key="imageCompressorKey"
      :image-preview-url="previewUrl"
      label="image-1"
      field-name="image-1"
      hide-validator-message
      hide-info
      @delete="imageCompressorKey++, previewUrl = undefined, console.log(previewUrl)"
    />
    <ImageCompressor
      image-preview-size="small"
      label="image-2"
      field-name="image-2"
      image-preview-type="circle"
      use-validator
      mandatory
    />
    <Button type="submit" severity="success" label="submit" />
  </form>
  <ImageCompressor
    :key="imageCompressorKey3"
    @final="setImage"
    label="no-validate"
  />
</template>