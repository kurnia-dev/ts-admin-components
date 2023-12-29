import type { App } from 'vue';
import PrimeVue from 'primevue/config';
import CToastService from 'primevue/toastservice';
import {
  HelloWorld,
  DynamicDialog,
  DynamicTable,
  GroupNameContainer,
  MultiInputText,
  NameContainer,
  SearchButton,
  VCalendar,
  VCheckbox,
  VDropdown,
  VInput,
  VMultiSelect,
  VRadioButtons,
  CustomMultiSelect,
  CustomOverlayPanel,
  CustomTree,
  CustomTreeNode,
  GroupTree,
  CategoryTree,
  ScanRFID,
  ScanQR,
  ImageCompressorV1,
  ImageCompressor,
  SelectGroup,
  SelectCategory,
  DateText,
  ButtonScanQR,
  AssetNameDropDown,
  BrandDropDown,
  ModelDropDown,
  GroupTreeSelect,
  UserDropdown,
  TagTypeIdentifier,
  StaticTable,
  ButtonCopy,
  ImagePreview,
} from '@/components';

import DropdownOption from './DropdownOption/DropdownOption.vue';
import DateUtils from '@/utils/date.util';
import StringUtils from '@/utils/string.util';

export default {
  install: (app: App) => {
    app.use(PrimeVue);
    app.use(CToastService);

    app.component('HelloWorld', HelloWorld);
    app.component('DynamicDialog', DynamicDialog);
    app.component('DynamicTable', DynamicTable);
    app.component('GroupNameContainer', GroupNameContainer);
    app.component('MultiInputText', MultiInputText);
    app.component('NameContainer', NameContainer);
    app.component('SearchButton', SearchButton);
    app.component('VCalendar', VCalendar);
    app.component('VCheckbox', VCheckbox);
    app.component('VDropdown', VDropdown);
    app.component('VInput', VInput);
    app.component('VMultiSelect', VMultiSelect);
    app.component('VRadioButtons', VRadioButtons);
    app.component('CustomMultiSelect', CustomMultiSelect);
    app.component('CustomOverlayPanel', CustomOverlayPanel);
    app.component('CustomTree', CustomTree);
    app.component('CustomTreeNode', CustomTreeNode);
    app.component('GroupTree', GroupTree);
    app.component('CategoryTree', CategoryTree);
    app.component('ScanRFID', ScanRFID);
    app.component('ScanQR', ScanQR);
    app.component('ImageCompressor', ImageCompressor);
    app.component('ImageCompressorV1', ImageCompressorV1);
    app.component('SelectGroup', SelectGroup);
    app.component('SelectCategory', SelectCategory);
    app.component('DateText', DateText);
    app.component('ButtonScanQR', ButtonScanQR);
    app.component('AssetNameDropDown', AssetNameDropDown);
    app.component('BrandDropDown', BrandDropDown);
    app.component('ModelDropDown', ModelDropDown);
    app.component('GroupTreeSelect', GroupTreeSelect);
    app.component('UserDropdown', UserDropdown);
    app.component('TagTypeIdentifier', TagTypeIdentifier);
    app.component('StaticTable', StaticTable);
    app.component('ButtonCopy', ButtonCopy);
    app.component('ImagePreview', ImagePreview);
    app.component('DropdownOption', DropdownOption);
  },
};

export {
  CToastService,
  HelloWorld,
  DynamicDialog,
  DynamicTable,
  GroupNameContainer,
  MultiInputText,
  NameContainer,
  SearchButton,
  VCalendar,
  VCheckbox,
  VDropdown,
  VInput,
  VMultiSelect,
  VRadioButtons,
  CustomMultiSelect,
  CustomOverlayPanel,
  CustomTree,
  CustomTreeNode,
  GroupTree,
  CategoryTree,
  ScanRFID,
  ScanQR,
  ImageCompressorV1,
  ImageCompressor,
  SelectGroup,
  SelectCategory,
  DateText,
  ButtonScanQR,
  AssetNameDropDown,
  BrandDropDown,
  ModelDropDown,
  GroupTreeSelect,
  UserDropdown,
  TagTypeIdentifier,
  StaticTable,
  ButtonCopy,
  ImagePreview,
  DateUtils,
  StringUtils,
  DropdownOption,
};
