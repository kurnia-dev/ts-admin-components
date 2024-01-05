import type { App } from 'vue';
import PrimeVue from 'primevue/config';
import CToastService from 'primevue/toastservice';
import {
  ButtonCopy,
  ButtonScanQR,
  CategoryTree,
  CustomMultiSelect,
  CustomOverlayPanel,
  CustomTree,
  CustomTreeNode,
  DateText,
  DynamicTable,
  FilterContainer,
  GroupNameContainer,
  GroupTree,
  HelloWorld,
  ImageCompressor,
  ImagePreview,
  InputSwitch,
  MultiInputText,
  NameContainer,
  ScanQR,
  ScanRFID,
  SearchButton,
  SelectCategory,
  SelectGroup,
  StaticTable,
  TagTypeIdentifier,
  TSBreadcrumb,
  TSButton,
  TSButtonFilter,
  TSCalendar,
  TSConfirmDialog,
  TSInputEmail,
  TSInputText,
  TSSelectOption,
  TSTextarea,
} from '@/components';

import DateUtils from '@/utils/date.util';
import StringUtils from '@/utils/string.util';

export default {
  install: (app: App) => {
    app.use(PrimeVue);
    app.use(CToastService);

    app.component('ButtonCopy', ButtonCopy);
    app.component('ButtonScanQR', ButtonScanQR);
    app.component('CategoryTree', CategoryTree);
    app.component('CustomMultiSelect', CustomMultiSelect);
    app.component('CustomOverlayPanel', CustomOverlayPanel);
    app.component('CustomTree', CustomTree);
    app.component('CustomTreeNode', CustomTreeNode);
    app.component('DateText', DateText);
    app.component('DynamicTable', DynamicTable);
    app.component('FilterContainer', FilterContainer);
    app.component('GroupNameContainer', GroupNameContainer);
    app.component('GroupTree', GroupTree);
    app.component('HelloWorld', HelloWorld);
    app.component('ImageCompressor', ImageCompressor);
    app.component('ImagePreview', ImagePreview);
    app.component('InputSwitch', InputSwitch);
    app.component('MultiInputText', MultiInputText);
    app.component('NameContainer', NameContainer);
    app.component('ScanQR', ScanQR);
    app.component('ScanRFID', ScanRFID);
    app.component('SearchButton', SearchButton);
    app.component('SelectCategory', SelectCategory);
    app.component('SelectGroup', SelectGroup);
    app.component('StaticTable', StaticTable);
    app.component('TagTypeIdentifier', TagTypeIdentifier);
    app.component('TSBreadcrumb', TSBreadcrumb);
    app.component('TSButton', TSButton);
    app.component('TSButtonFilter', TSButtonFilter);
    app.component('TSCalendar', TSCalendar);
    app.component('TSConfirmDialog', TSConfirmDialog);
    app.component('TSInputEmail', TSInputEmail);
    app.component('TSInputText', TSInputText);
    app.component('TSSelectOption', TSSelectOption);
    app.component('TSTextarea', TSTextarea);
  },
};

export {
  CToastService,
  DateUtils,
  StringUtils,
  ButtonCopy,
  ButtonScanQR,
  CategoryTree,
  CustomMultiSelect,
  CustomOverlayPanel,
  CustomTree,
  CustomTreeNode,
  DateText,
  DynamicTable,
  FilterContainer,
  GroupNameContainer,
  GroupTree,
  HelloWorld,
  ImageCompressor,
  ImagePreview,
  InputSwitch,
  MultiInputText,
  NameContainer,
  ScanQR,
  ScanRFID,
  SearchButton,
  SelectCategory,
  SelectGroup,
  StaticTable,
  TagTypeIdentifier,
  TSBreadcrumb,
  TSButton,
  TSButtonFilter,
  TSCalendar,
  TSConfirmDialog,
  TSInputEmail,
  TSInputText,
  TSSelectOption,
  TSTextarea,
};
