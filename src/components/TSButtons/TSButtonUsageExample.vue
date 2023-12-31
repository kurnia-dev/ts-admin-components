<script setup lang="ts">
import ButtonDefault from './ButtonDefault.vue';
import ButtonPrimary from './ButtonPrimary.vue';
import ButtonPrimaryOutline from './ButtonPrimaryOutline.vue';
import ButtonDanger from './ButtonDanger.vue';
import ButtonDangerOutline from './ButtonDangerOutline.vue';
import ButtonSuccess from './ButtonSuccess.vue';
import ButtonSuccessOutline from './ButtonSuccessOutline.vue';
import ButtonTextPrimary from './ButtonTextPrimary.vue';
import Button from './Button.vue';
</script>
<template>
  <label style="text-align: left">Tag Samurai Button with Riple Effect</label>
  <div class="d-flex gap-3">
    <Button label="TS Button" severity="primary" />
    <Button label="TS Button" severity="danger" />
    <Button label="TS Button" severity="success" />
    <Button label="TS Button" severity="primary" outlined />
    <Button label="TS Button" severity="danger" outlined />
    <Button label="TS Button" severity="success" outlined />
    <Button label="TS Button" severity="primary" text-only />
    <Button label="TS Button" severity="danger" text-only />
    <Button label="TS Button" severity="success" text-only />
    <Button label="TS Button" />
  </div>
  <div class="d-flex gap-3">
    <ButtonDefault label="Default" />
    <ButtonTextPrimary label="Text" />
    <ButtonPrimary label="Primary" />
    <ButtonDanger label="Danger" />
    <ButtonSuccess label="Succes" />
    <ButtonPrimaryOutline label="Primary" />
    <ButtonDangerOutline label="Danger" />
    <ButtonSuccessOutline label="Success" />
  </div>
</template>
