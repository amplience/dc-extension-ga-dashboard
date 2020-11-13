/* eslint-disable @typescript-eslint/no-empty-function */

import { getByTestId, render } from '@testing-library/svelte';
import { Edition, Hub } from 'dc-management-sdk-js';
import { tick } from 'svelte';
import { get } from 'svelte/store';
import type { ManagementSdkService } from '../../../../../services/management-sdk/management-sdk.service';
import {
  hub,
  managementSdkService,
} from '../../../../../stores/dynamic-content';
import EditionName from './edition-name.svelte';

describe('EditionName', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  it('should initially render with id', async () => {
    managementSdkService.set(({
      getAppLinkForResource: () => new Promise(() => {}),
    } as unknown) as ManagementSdkService);

    const { container } = render(EditionName, {
      editionId: 'EDITION_ID',
    });
    expect(getByTestId(container, 'loading-1')).toMatchSnapshot();
  });

  it('should render the link', async () => {
    const mockHub = new Hub();
    hub.set(mockHub);
    managementSdkService.set(({
      getAppLinkForResource: jest.fn(() => Promise.resolve('LINK')),
      client: {
        editions: {
          get: jest.fn(() =>
            Promise.resolve(new Edition({ name: 'EDITION_NAME' }))
          ),
        },
      },
    } as unknown) as ManagementSdkService);

    const { container } = render(EditionName, {
      editionId: 'EDITION_ID',
    });
    expect(getByTestId(container, 'loading-1')).toMatchSnapshot();
    await tick();
    expect(getByTestId(container, 'loading-2')).toMatchSnapshot();
    await tick();
    expect(getByTestId(container, 'loaded')).toMatchSnapshot();
    expect(container.firstChild).toMatchSnapshot();

    expect(get(managementSdkService).getAppLinkForResource).toBeCalledWith(
      mockHub,
      Edition,
      'EDITION_ID'
    );

    expect(get(managementSdkService).client.editions.get).toBeCalledWith(
      'EDITION_ID'
    );
  });

  it('should render fallback to the id if no app link is found', async () => {
    managementSdkService.set(({
      getAppLinkForResource: jest.fn().mockRejectedValue(new Error('test')),
    } as unknown) as ManagementSdkService);

    const { container } = render(EditionName, {
      editionId: 'EDITION_ID',
    });
    await tick();
    expect(getByTestId(container, 'error')).toMatchSnapshot();
  });
});
