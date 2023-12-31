import type { App } from 'vue';
import PrimeVue from 'primevue/config';
import CToastService from 'primevue/toastservice';
import * as TSComponents from '@/components';

import DateUtils from '@/utils/date.util';
import StringUtils from '@/utils/string.util';

export default {
  install: (app: App) => {
    app.use(PrimeVue);
    app.use(CToastService);

    for (const [name, component] of Object.entries(TSComponents)) {
      app.component(name, component);
    }
  },
};

export const TSAdminComponent = {
  CToastService,
  DateUtils,
  StringUtils,
  ...TSComponents,
};
