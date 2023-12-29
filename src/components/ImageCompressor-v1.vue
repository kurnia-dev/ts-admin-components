<!-- eslint-disable vue/component-api-style -->
<script>
import base64toblob from 'base64toblob';
import ImagePreview from 'primevue/image';

export default {
  data() {
    return {
      file: {},
      result: {},
      reader: {},
      imgSrc: '',
      scale: 50,
      quality: 50,
      finalResult: {},
      preview: {},
      previewUrl: undefined,
      isLoading: false,
    };
  },
  components: { ImagePreview },
  props: {
    showPreview: {
      type: Boolean,
      default: false,
    },
    showInput: {
      type: Boolean,
      default: true,
    },
    id: {
      type: String,
      default: 'compressor'
    }
  },
  emits: ['final'],

  methods: {
    openCompressor() {
      const compressor = document.querySelector(`#${this.id}`);
      compressor.click();
    },
    /*
        When Input File has changed
      */
    onChange(e) {
      this.isLoading = true;
      // If There's no file choosen
      let file = e.target.files[0];
      if (!file) return false;

      // get the file
      this.file = e.target.files[0];

      // Validation
      let type = this.file.type;
      let valid = type.indexOf('image') !== -1;

      if (!valid) throw 'File Type Is Not Supported. Upload an image instead';

      // Make new FileReader
      this.reader = new FileReader();

      // Convert the file to base64 text
      this.reader.readAsDataURL(this.file);

      // on reader load somthing...
      this.reader.onload = this.fileOnLoad;
    },

    /*
        Draw And Compress The Image
        @params {String} imgUrl
      */
    async drawImage(imgUrl) {
      try {
        this.isLoading = true;
        // Recreate Canvas Element
        let canvas = document.createElement('canvas');
        this.canvas = canvas;

        // Set Canvas Context
        let ctx = this.canvas.getContext('2d');

        // Create New Image
        let img = new Image();
        img.src = imgUrl;
        await img.decode();

        // Image Size After Scaling
        let scale = this.scale / 100;
        let width = img.width * scale;
        let height = img.height * scale;

        // Set Canvas Height And Width According to Image Size And Scale
        this.canvas.setAttribute('width', width);
        this.canvas.setAttribute('height', height);

        ctx.drawImage(img, 0, 0, width, height);

        // Quality Of Image
        let quality = this.quality ? this.quality / 100 : 1;

        // If all files have been proceed
        let base64 = this.canvas.toDataURL('image/jpeg', quality);
        let fileName = Date.now() + '.jpg';

        let objToPass = {
          canvas: this.canvas,
          original: this.result,
          compressed: {
            blob: this.toBlob(base64),
            base64: base64,
            name: fileName,
            file: this.buildFile(base64, fileName),
            newFile: await this.blobToFile(this.toBlob(base64), fileName), // upload this field
          },
        };

        objToPass.compressed.size =
          Math.round(objToPass.compressed.file.size / 1000) + ' kB';
        objToPass.compressed.type = 'image/jpeg';
        this.$emit('final', objToPass);
        this.preview = objToPass;
        this.previewUrl = objToPass.compressed.blob;
        console.log('preview', this.previewUrl);
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error(error);
      } finally {
        this.isLoading = false;
      }
    },

    /*
        Redraw the canvas
      */
    redraw() {
      if (this.result.base64) {
        this.drawImage(this.result.base64);
      }
    },

    /*
        When The File in loaded
      */
    async fileOnLoad() {
      // The File
      let { file } = this;

      // Make a fileInfo Object
      let fileInfo = {
        name: file.name,
        type: file.type,
        size: Math.round(file.size / 1000) + ' kB',
        base64: this.reader.result,
        file: file,
      };

      // Push it to the state
      this.result = fileInfo;

      // DrawImage
      await this.drawImage(this.result.base64);
    },

    // Convert Base64 to Blob
    toBlob(imgUrl) {
      let blob = base64toblob(imgUrl.split(',')[1], 'image/jpeg');
      let url = window.URL.createObjectURL(blob);
      return url;
    },

    // Convert Blob To File
    buildFile(blob, name) {
      return new File([blob], name, { type: 'image/jpeg' });
    },

    async blobToFile(url, name) {
      const file = await fetch(url)
        .then((f) => f.blob())
        .then((blobFile) => new File([blobFile], name, { type: 'image/jpeg' }));
      return file;
    },
  },

  computed: {
    previewLabel() {
      return this.preview.original
        ? this.preview.original.name
        : 'Choose Image';
    },
  },
};
</script>

<template>
  <div>
    <div class="input-group" @click="openCompressor">
      <div class="custom-file d-none">
        <input
          type="file"
          accept="image/*"
          @change="onChange"
          :id="id"
          class="form-control"
        />
        <label class="custom-file-label">{{
          this.preview.compressed ? this.preview.compressed.name : 'Browse'
        }}</label>
      </div>
      <div class="p-inputgroup" :class="showInput ? '' : 'd-none'">
        <span class="p-inputgroup-addon px-2 cursor-pointer">Browse</span>
        <InputText v-model="previewLabel" readonly />
      </div>
    </div>
    <ImagePreview
      v-if="previewUrl && showPreview"
      :src="previewUrl"
      alt="Image"
      class="my-4"
      imageStyle="width: 10vw; height: 10vw; object-fit: cover;"
      preview
    />
    <!-- <div class="vld-parent">
      <Loading :active.sync="isLoading" :is-full-page="true" />
    </div> -->
  </div>
</template>

<style scoped>
.cursor-pointer {
  cursor: pointer;
}
</style>
