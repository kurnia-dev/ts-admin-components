<script lang="ts" setup>
import { computed, ref, useAttrs, watch } from 'vue';

const attrs: any = useAttrs();

const showSearchInput = ref(false);

const togglerId = computed(() => attrs['togglerId'] || attrs['toggler-id']);

const onInput = (event: any) => {
  attrs['onUpdate:modelValue'](event.target.value);
};

watch(showSearchInput, (val) => {
  if (attrs['onToggleInput']) {
    attrs['onToggleInput'](val);
  }
});
</script>

<template>
  <div class="" v-if="!showSearchInput">
    <Button
      icon="ri-search-2-line"
      severity="secondary"
      outlined
      class="btn-icon"
      @click="showSearchInput = true"
    />
  </div>
  <div v-else>
    <form class="p-inputgroup" @submit.prevent="$attrs.onSearch">
      <input
        placeholder="Search"
        :value="$attrs.modelValue"
        @input="onInput"
        class="w-100 p-inputtext p-component"
      />
      <button
        class="p-button p-component p-button-icon-only p-button-secondary p-button-outlined btn-icon"
        type="button"
        style="
          border-width: 1px 1px 1px 0;
          border-color: #ced4da;
          border-radius: 0 4px 4px 0;
        "
        @click="showSearchInput = false"
        :id="togglerId"
      >
        <span
          class="p-button-icon ri-search-2-line"
          data-pc-section="icon"
        ></span
        ><span class="p-button-label" data-pc-section="label">&nbsp;</span>
      </button>
      <button type="submit" class="d-none"></button>
    </form>
  </div>
</template>

<style lang="scss">
.icon-btn-search {
  border: 1px solid #ced4da !important;
}
</style>
