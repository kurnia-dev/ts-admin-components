import { MenuItem } from 'primevue/menuitem';

export type MenuOption = Omit<MenuItem, 'label'> & {
  label?: string;
  danger?: boolean;
};
