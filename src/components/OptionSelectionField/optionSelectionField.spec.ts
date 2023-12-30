import { mount } from '@vue/test-utils';
import { nextTick } from 'vue';
import Component from './OptionSelectionField.vue';

describe('Component', () => {
  it('renders correctly', async () => {
    const wrapper = mount(Component, {
      props: {
        modelValue: 'test',
        options: [{ label: 'Option 1', value: '1' }],
        mandatory: true,
        message: 'This field is required',
        mode: 'single',
        label: 'Test Label',
        placeholder: 'Select an option',
      },
    });

    await nextTick();

    expect(wrapper.html()).toMatchSnapshot();
  });

  it('emits update:modelValue event when value changes', async () => {
    const wrapper = mount(Component, {
      props: {
        modelValue: 'test',
        options: [{ label: 'Option 1', value: '1' }],
        mandatory: true,
        message: 'This field is required',
        mode: 'single',
        label: 'Test Label',
        placeholder: 'Select an option',
      },
    });

    await wrapper.find('select').setValue('1');
    await nextTick();

    expect(wrapper.emitted('update:modelValue')).toBeTruthy();
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['1']);
  });

  it('displays error message when value is empty and mandatory is true', async () => {
    const wrapper = mount(Component, {
      props: {
        modelValue: '',
        options: [{ label: 'Option 1', value: '1' }],
        mandatory: true,
        message: 'This field is required',
        mode: 'single',
        label: 'Test Label',
        placeholder: 'Select an option',
      },
    });

    await nextTick();

    expect(wrapper.find('.validator-message').text()).toBe('This field is required');
  });
});