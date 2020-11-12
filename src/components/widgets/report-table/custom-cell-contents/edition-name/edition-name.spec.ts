import { tick } from 'svelte';
import { render } from '@testing-library/svelte';
import { editions } from '../../../../../stores/editions';
import { hub } from '../../../../../stores/dynamic-content';
import { sdkExtensionConfiguration } from '../../../../../stores/sdk-extension-configuration';
import EditionName from './edition-name.svelte';
import { Hub } from 'dc-management-sdk-js';
import type { SdkExtensionConfiguration } from '../../../../../services/extension-sdk/extension-sdk.service';

jest.mock('../../../../../stores/editions');
describe('EditionName', () => {
  beforeEach(() => {
    hub.set(
      new Hub({
        name: 'hub-name',
      })
    );
    sdkExtensionConfiguration.set({
      params: {
        locationHref: 'http://example.com',
      },
    } as SdkExtensionConfiguration);
  });

  it('should initially render with an edition id', async () => {
    ((editions.fetch as unknown) as jest.Mock).mockResolvedValue({
      name: 'test-edition-name',
    });
    const { container } = render(EditionName, {
      editionId: '0f590113-9733-4446-abcd-a103d17a2063',
    });
    expect(container.firstChild).toMatchSnapshot();
  });

  it('should render and resolve an edition name an edition link href', async () => {
    ((editions.fetch as unknown) as jest.Mock).mockResolvedValue({
      id: 'edition-id',
      name: 'test-edition-name',
      eventId: 'event-id',
    });
    const { container } = render(EditionName, {
      editionId: '0f590113-9733-4446-abcd-a103d17a2063',
    });

    await tick();
    expect(editions.fetch).toBeCalledWith(
      '0f590113-9733-4446-abcd-a103d17a2063'
    );
    expect(container.firstChild).toMatchSnapshot();
  });
  it('should render and resolve an edition name when we cannot generate an edition link href', async () => {
    sdkExtensionConfiguration.set({ params: {} } as SdkExtensionConfiguration);
    ((editions.fetch as unknown) as jest.Mock).mockResolvedValue({
      name: 'test-edition-name',
    });
    const { container } = render(EditionName, {
      editionId: '0f590113-9733-4446-abcd-a103d17a2063',
    });

    await tick();
    expect(editions.fetch).toBeCalledWith(
      '0f590113-9733-4446-abcd-a103d17a2063'
    );
    expect(container.firstChild).toMatchSnapshot();
  });

  it('should render with an edition id when edition fetch throws an error', async () => {
    ((editions.fetch as unknown) as jest.Mock).mockRejectedValue({});
    const { container } = render(EditionName, {
      editionId: '0f590113-9733-4446-abcd-a103d17a2063',
    });
    expect(container.firstChild).toMatchSnapshot();
  });
});
