<script lang="ts" setup>
import Image from 'primevue/image';
import { ref } from 'vue';

defineProps<{
  thumbnail?: string;
  preview?: string;
  type?: 'circle' | 'rounded';
  size: 'small' | 'normal';
}>();

const imgFallback = ref(
  'https://upload.wikimedia.org/wikipedia/commons/3/3f/Placeholder_view_vector.svg'
);
</script>

<template>
  <div class="">
    <Image
      alt="Image"
      :preview="!!thumbnail && !!preview"
      :pt="{
        rotateRightButton: { class: 'd-none' },
        rotateLeftButton: { class: 'd-none' },
        zoomOutButton: { class: 'd-none' },
        zoomInButton: { class: 'd-none' },
        mask: { style: 'z-index: 9999999999999 !important' },
        previewContainer: { style: 'z-index: 9999999999999 !important' },
        preview: { style: 'z-index: 9999999999999 !important' },
      }"
    >
      <template #image>
        <img
          :src="thumbnail || imgFallback"
          alt="image"
          :class="[
            'image',
            type,
            {
              'image-small': size === 'small',
              'image-normal': size === 'normal',
            },
          ]"
        />
      </template>
      <template #preview>
        <img :src="preview || imgFallback" alt="preview" />
      </template>
      <template #refresh>
        <div class="d-none"></div>
      </template>
      <template #undo>
        <div class="d-none"></div>
      </template>
      <template #zoomout>
        <div class="d-none"></div>
      </template>
      <template #zoomin>
        <div class="d-none"></div>
      </template>
    </Image>
  </div>
</template>

<style scoped>
.image {
  border: 1px solid #a0a3bd;
}

.image-small {
  width: 36px;
  height: 36px;
  object-fit: cover;
  border-radius: 10px;
}

.image-normal {
  height: 125px;
  width: 125px;
  border-radius: 10px;
  object-fit: cover;
}

.circle {
  border-radius: 50% !important;
}
</style>

<style lang="scss">
.p-image-mask {
  z-index: 999999999999999999 !important;
}
</style>
