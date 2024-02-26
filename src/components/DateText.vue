<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';

onMounted(() => {
  if (userStr) {
    const user = JSON.parse(userStr);

    if (user.generalSetting.dateFormat) {
      dateFormat.value = user.generalSetting.dateFormat;
    }

    if (user.generalSetting.timeFormat) {
      timeFormat.value = user.generalSetting.timeFormat;
    }

    if (user.generalSetting.timezone) {
      timeZone.value = user.generalSetting.timezone;
    }
  }
});

const props = withDefaults(
  defineProps<{
    date: Date | string;
    useTime?: boolean;
  }>(),
  {
    useTime: false,
  }
);

interface DateFormat {
  locale: string;
  year: string;
  month: string;
  day: string;
  weekday?: string;
}
const dateFormat = ref<DateFormat>({
  locale: 'en-gb',
  year: '2-digit',
  month: '2-digit',
  day: '2-digit',
});

const timeFormat = ref(false);

const timeZone = ref<string>();

const userStr = localStorage.getItem('user');

const formatedDate = computed(() => {
  if (!props.date) return '-';

  let options: Record<string, any> = {
    year: dateFormat.value.year,
    month: dateFormat.value.month,
    day: dateFormat.value.day,
    weekday: dateFormat.value.weekday,
    hour12: timeFormat.value,
    timeZone: timeZone.value,
  };

  if (props.useTime) {
    options = {
      ...options,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    };
  }

  return new Date(props.date).toLocaleString(dateFormat.value.locale || 'en-gb', options);
});
</script>

<template>
  <div class="text-nowrap">
    {{ formatedDate }}
  </div>
</template>

<style scoped></style>
