import { createRouter, createWebHashHistory } from 'vue-router';

// Initialize empty route so that can using router-link component
const router = createRouter({
  routes: [],
  history: createWebHashHistory(),
});

export default router;
