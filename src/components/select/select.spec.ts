import { render } from '@testing-library/svelte';
import Select from './select.svelte';

describe('Select', () => {
  it('should render an empty Select component when no options are passed', async () => {
    const onChange = jest.fn();
    const { container } = render(Select, {
      selectedOption: 'b',
      onChange,
      className: 'test-class',
    });

    expect(container.firstChild).toMatchSnapshot();
  });
  it('should render an Select component when options are passed and display selected option', async () => {
    const onChange = jest.fn();
    const { container } = render(Select, {
      selectedOption: 'b',
      options: [
        { key: 'a', value: 'a' },
        { key: 'b', value: 'b' },
        { key: 'c', value: 'c' },
      ],
      onChange,
      className: 'test-class',
      label: 'Select',
    });

    expect(container.firstChild).toMatchSnapshot();
  });

  it('should render a Select component when the keys are different and the selected value is passed', async () => {
    const onChange = jest.fn();
    const { container } = render(Select, {
      selectedOption: 'b',
      options: [
        { key: 'key1', value: 'a' },
        { key: 'key2', value: 'b' },
        { key: 'key3', value: 'c' },
      ],
      onChange,
      className: 'test-class',
      label: 'Select',
    });

    expect(container.firstChild).toMatchSnapshot();
  });

  it('should update the selected option when ', async () => {
    const onChange = jest.fn();
    render(Select, {
      selectedOption: 'a',
      options: [
        { key: 'a', value: 'a' },
        { key: 'b', value: 'b' },
        { key: 'c', value: 'c' },
      ],
      onChange,
      className: 'select-test-class',
    });

    const selectElement = document.querySelector('.select-test-class');
    const selectInput = document.querySelector(
      '.select-test-class input[type=hidden]'
    );

    expect((selectInput as HTMLInputElement).value).toEqual('a');

    (selectElement as HTMLElement).click();

    const selectMenuItems = document.querySelectorAll(
      '.mdc-list-item:not(.mdc-list-item--selected)'
    );

    (selectMenuItems[0] as HTMLElement).click();

    const mutatedSelectInput = document.querySelector(
      '.select-test-class input[type=hidden]'
    );

    expect((mutatedSelectInput as HTMLInputElement).value).toEqual('b');
  });
});
