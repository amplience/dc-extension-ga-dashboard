import { render } from '@testing-library/svelte';
import PercentOfLabel from './currency-label.svelte';
import { locale, currencyCode } from '../../../../../stores/localization';

describe('CurrencyLabel', () => {
  beforeEach(() => {
    locale.set('en-GB');
    currencyCode.set('GBP');
  });
  it('should render a CurrencyLabel component', () => {
    const { container } = render(PercentOfLabel, { value: 12 });

    expect(container.firstChild).toMatchSnapshot();
  });
});
