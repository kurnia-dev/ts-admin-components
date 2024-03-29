import { createRouter, createWebHashHistory } from 'vue-router';

const router = createRouter({
  routes: [
    {
      path: '/',
      name: 'index',
      component: () => import('@/layout/Layout.vue'),
      redirect: '/home',
      children: [
        {
          path: '/home',
          component: () => import('@/components/TSDataTable/DataTableUsageExample.vue'),
          name: 'Home',
        }
      ]
    },
  ],
  history: createWebHashHistory(),
});

export default router;
