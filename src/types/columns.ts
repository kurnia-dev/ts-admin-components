import { Component } from 'vue';

export type BodyComponent = {
  component: string | Component;
  props?: any;
  model?: any;
  events?: any;
  onChange?: any;
  disabled?: boolean;
}

export type HeaderComponent = BodyComponent;

export type TableColumn = {
  header: string;
  field: string;
  style?: string;
  sortable?: boolean;
  fixed?: boolean;
  bodyStyle?: (props: any) => string;
  bodyTemplate?: (data: any) => string;
  bodyComponent?: (data: any) => BodyComponent;
  headerTemplate?: () => string;
  headerComponent?: () => HeaderComponent;
};
