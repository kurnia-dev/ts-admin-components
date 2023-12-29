import { Component } from 'vue';

export type TableColumn = {
  header: string;
  field: string;
  style?: string;
  sortable?: boolean;
  bodyStyle?: (props: any) => string;
  bodyTemplate?: (data: any) => string | undefined;
  bodyComponent?: (data: any) => {
    component: string | Component;
    props?: any;
    model?: any;
    events?: any;
    onChange?: any;
    disabled?: boolean;
  };
};

export type TableOption = {
  label?: string;
  command?: (data?: any) => any;
  icon?: string;
  items?: any[];
  class?: string;
  disabled?: boolean | any;
  separator?: boolean;
  danger?: boolean;
  visible?: boolean | any;
};
