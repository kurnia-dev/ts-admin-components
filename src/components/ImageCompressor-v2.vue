<script lang="ts" setup>
import 'vue-advanced-cropper/dist/style.css';
import { ref, onUnmounted, onMounted, reactive } from 'vue';
import { Cropper } from 'vue-advanced-cropper';
import base64toblob from 'base64toblob';
import Dialog from 'primevue/dialog';
import ImagePreview from 'primevue/image';
import { useField } from 'vee-validate';
import { FieldValidation } from '@/types/fieldValidation.type';

const props = defineProps({
  showInput: {
    type: Boolean,
    default: true,
  },
  inputId: {
    type: String,
    default: 'compressor',
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  compressedBlob: {
    type: String || Blob,
    default: undefined,
  },
  imagePreviewSize: {
    type: String as () => 'small' | 'big',
    default: 'big',
  },
  mandatory: {
    type: Boolean,
    default: false,
  },
  useValidator: {
    type: Boolean,
    default: false,
  },
  validatorMessage: {
    type: String,
    default: 'Photo must be uploaded',
  },
  label: {
    type: String,
  },
  fieldName: {
    type: String,
  },
  imagePreviewUrl: {
    type: String,
  },
  /**
   * Hide the requirement information section
   */
  hideInfo: {
    type: Boolean,
    default: false,
  },
  hideValidatorMessage: {
    type: Boolean,
    default: false,
  },
  imagePreviewType: {
    type: String as () => 'circle' | 'rounded',
    default: 'rounded',
  },
});

const emit = defineEmits<{ final: [value: any]; delete: [] }>();

onMounted(() => {
  previewUrl.value = props.compressedBlob ?? props.imagePreviewUrl ?? '';

  setField();
});

onUnmounted(() => {
  // Revoke the object URL, to allow the garbage collector to destroy the uploaded before file
  if (image.value.src) {
    URL.revokeObjectURL(image.value.src);
  }
});

type Image = {
  src: any;
  type: any;
};

const image = ref<Image>({
  src: null,
  type: null,
});

const cropper = ref<any>();
const inputFile = ref<any>();
const result = ref<any>();
const canvas = ref<any>();
const scale = ref(60);
const quality = ref(60);
const preview = ref<any>({});
const previewUrl = ref<string | Blob>('');
const isError = ref(false);
const showAdjustPhoto = ref(false);
const inputKey = ref(0);
const imageUploadErrorMessage = ref<string>();

const field = reactive<FieldValidation>({});

const setField = () => {
  if (props.useValidator) {
    Object.assign(
      field,
      useField(props.fieldName ?? '', (value: any) => {
        if (!value && props.mandatory) {
          preview.value.message = undefined;
          return props.validatorMessage;
        }

        return true;
      })
    );
  }
};

const crop = async () => {
  const imgResult = cropper.value.getResult();
  const base64 = imgResult.canvas.toDataURL('image/jpeg');

  await drawImage(base64);
};

const resetCropper = () => {
  image.value = {
    src: null,
    type: null,
  };
};

const reset = () => {
  preview.value = { message: 'File has been deleted' };
  imageUploadErrorMessage.value = undefined;
  field.value = undefined;
  previewUrl.value = '';
  sendData();
};

const loadImage = (event: any) => {
  resetCropper();

  // Reference to the DOM input element
  const { files } = event.target;

  // Ensure that you have a file before attempting to read it
  if (files[0]) {
    // Check file type
    if (!isImage(files[0].type)) {
      isError.value = true;
      preview.value = { message: 'File type is not image' };
      imageUploadErrorMessage.value = preview.value.message;
      previewUrl.value = '';
      sendData();
      return;
    }

    // Check file size
    if (isExceededLimit(files[0].size)) {
      isError.value = true;
      preview.value = { message: 'File size too big! Max. 1 MB' };
      imageUploadErrorMessage.value = preview.value.message;
      previewUrl.value = props.compressedBlob ?? props.imagePreviewUrl ?? '';
      sendData();
      return;
    }

    // 1. Revoke the object URL, to allow the garbage collector to destroy the uploaded before file
    if (image.value.src) {
      URL.revokeObjectURL(image.value.src);
    }

    // 2. Create the blob link to the file to optimize performance:
    const blob = URL.createObjectURL(files[0]);

    // 3. The steps below are designated to determine a file mime type to use it during the
    // getting of a cropped image from the canvas. You can replace it them by the following string,
    // but the type will be derived from the extension and it can lead to an incorrect result:
    //
    // this.image = {
    //    src: blob;
    //    type: files[0].type
    // }

    // Create a new FileReader to read this image binary data
    const reader = new FileReader();

    // Define a callback function to run, when FileReader finishes its job
    reader.onload = (e) => {
      // Note: arrow function used here, so that "this.image" refers to the image of Vue component
      image.value = {
        // Set the image source (it will look like blob:http://example.com/2c5270a5-18b5-406e-a4fb-07427f5e7b94)
        src: blob,
        // Determine the image type to preserve it during the extracting the image from canvas:
        type: getMimeType(e?.target?.result, files[0].type),
      };
    };

    // Start the reader job - read file as a data url (base64 format)
    reader.readAsArrayBuffer(files[0]);

    // Adjust photo in dialog
    showAdjustPhoto.value = true;

    isError.value = false;
  }
  inputKey.value += 1;
};

const isExceededLimit = (size: number) => size > 1000000;

const isImage = (type: string) => type.includes('image');

// This function is used to detect the actual image type,
const getMimeType = (file: any, fallback = null) => {
  const byteArray = new Uint8Array(file).subarray(0, 4);
  let header = '';
  for (const element of byteArray) {
    header += element.toString(16);
  }
  switch (header) {
    case '89504e47':
      return 'image/png';
    case '47494638':
      return 'image/gif';
    case 'ffd8ffe0':
    case 'ffd8ffe1':
    case 'ffd8ffe2':
    case 'ffd8ffe3':
    case 'ffd8ffe8':
      return 'image/jpeg';
    default:
      return fallback;
  }
};

const drawImage = async (imgUrl: string) => {
  try {
    // Recreate Canvas Element
    canvas.value = document.createElement('canvas');

    // Set Canvas Context
    let ctx = canvas.value.getContext('2d');

    // Create New Image
    let img = new Image();
    img.src = imgUrl;
    await img.decode();

    // Image Size After Scaling
    let formattedScale = scale.value / 100;
    let width = img.width * formattedScale;
    let height = img.height * formattedScale;

    // Set Canvas Height And Width According to Image Size And Scale
    canvas.value.setAttribute('width', width);
    canvas.value.setAttribute('height', height);

    ctx.drawImage(img, 0, 0, width, height);

    // Quality Of Image
    let formattedQuality = quality.value ? quality.value / 100 : 1;

    // If all files have been proceed
    let base64 = canvas.value.toDataURL('image/jpeg', formattedQuality);
    let fileName = Date.now() + '.jpg';

    let objToPass = {
      canvas: canvas.value,
      original: result.value,
      compressed: {
        blob: toBlob(base64),
        base64: base64,
        name: fileName,
        file: buildFile(base64, fileName),
        newFile: await blobToFile(toBlob(base64), fileName), // upload this field
        size: '',
        type: '',
      },
    };

    objToPass.compressed.size =
      Math.round(objToPass.compressed.file.size / 1000) + ' kB';
    objToPass.compressed.type = 'image/jpeg';
    preview.value = { ...objToPass, message: 'File has been compressed' };
    previewUrl.value = objToPass.compressed.blob;

    // 'value' is a Ref ariable from useField vee-validate
    field.value = objToPass.compressed.newFile;
    sendData();
  } catch (error) {
    console.error(error);
  }
};

// Convert Base64 to Blob
const toBlob = (imgUrl: string) => {
  let blob = base64toblob(imgUrl.split(',')[1], 'image/jpeg');
  let url = window.URL.createObjectURL(blob);
  return url;
};

// Convert Blob To File
const buildFile = (blob: any, name: string) => {
  return new File([blob], name, { type: 'image/jpeg' });
};

const blobToFile = async (url: string, name: string) => {
  const file = await fetch(url)
    .then((f) => f.blob())
    .then((blobFile) => new File([blobFile], name, { type: 'image/jpeg' }));
  return file;
};

const applyImage = async () => {
  await crop();
  showAdjustPhoto.value = false;
};

const sendData = () => {
  emit('final', preview.value);
};

const openCropper = () => {
  if (props.disabled) {
    return;
  }
  inputFile.value.click();
};
</script>

<template>
  <div class="d-flex flex-column gap-1 field_wrapper">
    <label>
      {{ label }}
      <span class="text-danger" v-if="mandatory">*</span>
    </label>
    <div class="image-compressor">
      <template v-if="props.showInput">
        <div v-if="previewUrl" class="">
          <ImagePreview
            :src="previewUrl"
            :preview="true"
            :imageStyle="
              'object-fit:cover; border-radius:8px;' +
              (props.imagePreviewSize === 'small'
                ? 'height:80px; width:80px;'
                : 'height:125px; width:125px;') +
              (props.imagePreviewType === 'circle' ? 'border-radius:50%;' : '')
            "
            :class="['image', 'img-preview-md', imagePreviewType]"
            :pt="{
              mask: { style: 'z-index: 99999999' },
              rotateRightButton: { class: 'd-none' },
              rotateLeftButton: { class: 'd-none' },
              zoomOutButton: { class: 'd-none' },
              zoomInButton: { class: 'd-none' },
            }"
          >
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
          </ImagePreview>
          <div class="mt-2">
            <Button
              icon="ri-pencil-line"
              label="Edit"
              @click="openCropper"
              text
              style="padding: 0.15rem 0.3rem"
            />
            <Button
              @click="reset()"
              icon="ri-delete-bin-6-line"
              label="Delete"
              text
              severity="danger"
              style="padding: 0.15rem 0.3rem"
            />
          </div>
        </div>
        <div
          v-else
          class="input-trigger d-flex align-items-center justify-content-center"
          :class="{
            'input-trigger-disabled': props.disabled,
            'small': props.imagePreviewSize === 'small',
            'p-invalid': field.errorMessage ?? imageUploadErrorMessage,
          }"
          @click="openCropper"
        >
          <i
            class="ri-add-circle-line input-trigger-icon"
            :class="{ 'input-trigger-icon-disabled': props.disabled }"
          ></i>
        </div>

        <div
          v-if="!hideInfo"
          class="d-flex"
          :class="{ 'text-danger': isError, 'disabled': props.disabled }"
        >
          <ul class="requirements">
            <li>Max. 1 MB</li>
            <li>Must be image format</li>
          </ul>
        </div>
      </template>
      <div class="d-none" :key="inputKey">
        <input
          class="d-none"
          type="file"
          ref="inputFile"
          @change="loadImage($event)"
          accept="image/*"
          :id="props.inputId"
          :key="inputKey"
        />
      </div>
      <Dialog
        v-model:visible="showAdjustPhoto"
        modal
        :draggable="false"
        header="Adjust Photo"
        :style="{ width: '840px' }"
        :auto-z-index="false"
        @hide="resetCropper"
        @show="resetCropper"
        :pt="{
          root: { style: 'z-index: 99999999; width: 840px' },
          mask: { style: 'z-index: 99999999' },
        }"
      >
        <Cropper
          ref="cropper"
          class="upload-example-cropper h-400"
          imageClass="h-400"
          backgroundClass="h-400"
          foregroundClass="h-400"
          :src="image.src"
          :stencil-props="{
            aspectRatio: 1 / 1,
          }"
        />
        <div class="col-12 d-flex justify-content-end" style="margin-top: 12px">
          <Button
            label="Cancel"
            class="mx-3"
            @click="() => (showAdjustPhoto = false)"
            text
            plain
          />
          <Button
            label="Apply"
            severity="success"
            type="button"
            @click="applyImage"
          />
        </div>
      </Dialog>
    </div>
    <small
      class="validator-message text-left"
      v-show="
        !props.hideValidatorMessage &&
        !preview.compressed &&
        (imageUploadErrorMessage ?? field.errorMessage)
      "
      >{{ imageUploadErrorMessage ?? field.errorMessage }}</small
    >
  </div>
</template>

<style lang="scss" scoped>
@import 'scss/var';

.image-compressor {
  display: flex;
  gap: 8px;
  flex-wrap: nowrap;
}
.h-400 {
  height: 400px;
}

.p-image-preview-container {
  width: max-content;
  height: max-content;
  border-radius: 8px;
}

.circle {
  border-radius: 50%;
}

.input-trigger {
  height: 125px;
  width: 125px;
  border-radius: 8px;
  border: 1px solid #ced4da;
  background: #fff;
  cursor: pointer;
}

.p-invalid {
  border-color: #e24c4c;
}

.input-trigger-icon {
  color: #ced4da;
  font-size: 24px;
}

.input-trigger.small {
  height: 80px;
  width: 80px;
}

.requirements {
  color: $dark;
  font-size: 0.7rem;
  font-style: normal;
  font-weight: 500;
  line-height: 16.8px;
  padding-left: 1rem;
  margin: 0;
  max-width: 121px;

  li {
    text-align: left;
  }
}

.validator-message {
  text-align: left;
  font-size: 0.7rem;
  font-style: normal;
  font-weight: 300;
  line-height: 16px;
}

.input-trigger-disabled {
  border: 1px solid #e6e9ec !important;
}

.input-trigger-icon-disabled {
  color: $general-label;
}

.disabled {
  color: #a0a3bd !important;
}
</style>

<style lang="scss">
.p-image-mask {
  z-index: 999999999999999999 !important;
}
</style>
