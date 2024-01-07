<script setup lang="ts">
import { ref, watchEffect } from 'vue';
import Button from '@/components/TSButtons/Button.vue';

defineEmits<{
  search: [query?: string];
}>();
const showSearchInput = ref(false);
const query = ref<string>();

watchEffect(() => !query.value?.length && (query.value = undefined));
</script>

<template>
  <div class="ts-searchbox">
    <Button
      :icon="showSearchInput ? 'ri-close-line' : 'ri-search-2-line'"
      :severity="showSearchInput ? 'danger' : undefined"
      outlined
      @click="showSearchInput = !showSearchInput"
      :class="['ts-searchbox-togglebutton', { close: showSearchInput }]"
    />
    <form
      :class="{ show: showSearchInput }"
      class="ts-searchbox-form"
      @submit.prevent="$emit('search', query)"
    >
      <i class="ri-search-2-line ts-searchbox-icon" />
      <input
        placeholder="Search"
        v-model="query"
        class="ts-searchbox-input"
      />
      <button type="submit" class="ts-searchbox-button-hidden"></button>
    </form>
  </div>
</template>

<style lang="scss">
@import 'scss/var';

.ts-searchbox {
  display: flex;
  width: max-content;
  align-items: center;
  flex-direction: row-reverse;

  .ts-searchbox-togglebutton.close {
    border-radius: 0 4px 4px 0;
    border-color: $general-body;
  }

  .ts-searchbox-form {
    width: 0;
    opacity: 0;
    padding: 0;
    border: none;
    font-size: 11.2px;
    color: $general-body;
    border: 1px solid;
    border-radius: 4px 0 0 4px;
    border-right: none;
    height: 26px;
    transition: all 0.1s ease;
    box-sizing: border-box;

    > * {
      display: none;
      height: 18px;
    }

    display: flex;
    align-items: center;
    gap: 8px;

    .ts-searchbox-input {
      color: $general-body;
      border: none;
    }

    .ts-searchbox-input:focus,
    .ts-searchbox-input:hover {
      outline: none;
    }

    .ts-searchbox-input::placeholder {
      color: $general-placeholder;
    }

    .ts-searchbox-button-hidden {
      display: none;
    }

    .ts-searchbox-icon {
      width: 12px;
      font-size: 12px;
    }
  }

  .ts-searchbox-form.show {
    width: 100%;
    opacity: 1;
    padding: 0 10px;

    > *:not(.ts-searchbox-button-hidden) {
      display: block;
    }
  }
}
</style>
