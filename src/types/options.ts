export type MenuOption = {
  label: string;
  command: (data?: any) => any;
  icon?: string;
  items?: any[];
  class?: string;
  disabled?: boolean | any
  danger?: boolean
};
