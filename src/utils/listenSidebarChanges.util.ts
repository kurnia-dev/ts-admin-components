/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable promise/prefer-await-to-callbacks */

import { SidebarEvent } from '@/types/sidebarEvent.type';

const listenSidebarChanges = (
  type: 'group' | 'category',
  callback: (e: SidebarEvent) => any
): void => {
  window.addEventListener(
    type === 'group' ? 'groupSidebarChanged' : 'categorySidebarChanged',
    callback
  );
};

declare global {
  interface WindowEventMap {
    groupSidebarChanged: SidebarEvent;
    categorySidebarChanged: SidebarEvent;
  }
}

export default listenSidebarChanges;
