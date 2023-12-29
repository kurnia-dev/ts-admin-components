import { Component } from 'vue';

export type TableColumn = {
  header: string;
  field: string;
  style?: string;
  sortable?: boolean;
  bodyStyle?: (props: any) => string;
  bodyTemplate?: (data: any) => string;
  bodyComponent?: (data: any) => {
    component: string | Component;
    props?: any;
    model?: any;
    events?: any;
    onChange?: any;
    disabled?: boolean;
  };
  headerTemplate?: () => string;
  headerComponent?: () => {
    component: string | Component;
    props?: any;
    model?: any;
    events?: any;
    onChange?: any;
    disabled?: boolean;
  };
};
