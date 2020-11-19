import {
  fireEvent,
  getByLabelText,
  getByRole,
  getByTestId,
  getByText,
  render,
} from '@testing-library/svelte';
import { Edition, Hub } from 'dc-management-sdk-js';
import { tick } from 'svelte';
import { get } from 'svelte/store';
import { dateRange, NOW } from '../../stores/date-range';
import { hub } from '../../stores/dynamic-content';
import { selectedContentItems } from '../../stores/selected-content-items';
import { selectedEdition } from '../../stores/selected-edition';
import { selectedRepository } from '../../stores/selected-repository';
import { formatDateAsISOString } from '../../utils/date-format';
import ReportFilter from './report-filter.svelte';

describe('ReportFilter component - Editions', () => {
  beforeEach(() => {
    hub.set(null);
    selectedEdition.set(null);
  });
  it('should render the ReportFilter component no selectedEdition', () => {
    const { container } = render(ReportFilter, {});
    expect(getByText(container, 'No filters applied')).toBeDefined();
    expect(container.firstChild).toMatchSnapshot();
  });

  it('should show an error message if the hub is now defined', async () => {
    const { container } = render(ReportFilter, {});
    const displayModalButton = getByTestId(container, 'display-modal-button');
    await fireEvent.click(displayModalButton);
    expect(getByText(container, 'Unable to load editions')).toBeDefined();
  });

  it('should be able to load and select an edition', async () => {
    const publishedEdition = new Edition({
      id: 'edition_id',
      name: 'edition name',
      event: {
        name: 'event name',
      },
      publishingStatus: 'PUBLISHED',
      start: '2020-01-01T00:00:00.000Z',
      end: '2020-01-31:23:59:59.000Z',
      activeEndDate: true,
    });
    await renderAndSelectEdition(publishedEdition);
    expect(get(selectedEdition)).toEqual(publishedEdition);
    expect(get(dateRange)).toMatchInlineSnapshot(`
      Object {
        "from": "2020-01-01",
        "to": "2020-01-31",
      }
    `);
  });

  it('should be able to load and select an edition (activeEndDate false)', async () => {
    const publishedEdition = new Edition({
      id: 'edition_id',
      name: 'edition name',
      event: {
        name: 'event name',
      },
      publishingStatus: 'PUBLISHED',
      start: '2020-01-01T00:00:00.000Z',
      end: '2020-01-31:23:59:59.000Z',
      activeEndDate: false,
    });
    await renderAndSelectEdition(publishedEdition);
    expect(get(selectedEdition)).toEqual(publishedEdition);
    const dates = get(dateRange);
    expect(dates.from).toEqual('2020-01-01');
    expect(dates.to).toEqual(formatDateAsISOString(new Date(NOW))); //today
  });

  it('should report there are no editions when there are no published editions', async () => {
    const mockFindByDate = jest.fn().mockResolvedValue({
      getItems: () => {
        return [
          new Edition({
            id: 'draft_edition_id',
            name: 'draft edition name',
            event: {
              name: 'draft event name',
            },
            publishingStatus: 'DRAFT',
          }),
        ];
      },
    });
    const mockHub = new Hub({
      id: 'HUB_ID',
      related: {
        editions: {
          findByDate: mockFindByDate,
        },
      },
    });
    mockHub.related.editions.findByDate = mockFindByDate;
    hub.set(mockHub);
    const { container } = render(ReportFilter, {});
    const displayModalButton = getByTestId(container, 'display-modal-button');
    await fireEvent.click(displayModalButton);
    await tick();
    await tick();
    expect(mockFindByDate).toHaveBeenCalled();
    expect(getByTestId(container, 'no-published-editions')).toBeDefined();
  });

  it('should render the ReportFilter component with a selectedEdition', async () => {
    const { container } = render(ReportFilter, {});
    await tick();
    selectedEdition.set(
      new Edition({ name: 'Test Edition', event: { name: 'Test Event' } })
    );
    await tick();
    expect(getByText(container, 'Test Event / Test Edition')).toBeDefined();
    expect(container.firstChild).toMatchSnapshot();
  });

  it('should render initial state when a selectedEdition has been removed', async () => {
    const { container } = render(ReportFilter, {});
    await tick();
    selectedEdition.set(
      new Edition({ name: 'Test Edition', event: { name: 'Test Event' } })
    );
    await tick();
    const dismissEditionButton = getByTestId(container, 'remove-chip-button');
    await fireEvent.click(dismissEditionButton);
    expect(getByText(container, 'No filters applied')).toBeDefined();
    expect(container.firstChild).toMatchSnapshot();
  });
});

describe('ReportFilter component - ContentItems', () => {
  beforeEach(() => {
    hub.set(null);
    selectedRepository.set(null);
    selectedContentItems.set([]);
  });
  it('should render the no hub state for the repository picker', async () => {
    const { container } = render(ReportFilter, {});
    const displayModalButton = getByTestId(container, 'display-modal-button');
    await fireEvent.click(displayModalButton);
    const contentRadio = getByTestId(container, 'content-radio');
    await fireEvent.change(contentRadio, { target: { checked: true } });

    expect(container.firstChild).toMatchSnapshot();
  });
});

async function renderAndSelectEdition(publishedEdition: Edition) {
  const mockFindByDate = jest.fn().mockResolvedValue({
    getItems: () => {
      return [publishedEdition];
    },
  });
  const mockHub = new Hub({
    id: 'HUB_ID',
    related: {
      editions: {
        findByDate: mockFindByDate,
      },
    },
  });
  mockHub.related.editions.findByDate = mockFindByDate;
  hub.set(mockHub);
  const { container } = render(ReportFilter, {});
  const displayModalButton = getByTestId(container, 'display-modal-button');
  await fireEvent.click(displayModalButton);
  await tick();
  await tick();
  expect(mockFindByDate).toHaveBeenCalled();
  expect(getByText(container, 'Select a recent edition...')).toBeDefined();
  fireEvent.click(getByLabelText(container, 'Recent edition'));
  await tick();
  fireEvent.click(getByRole(container, 'option'));
  await tick();
  fireEvent.click(getByText(container, 'Apply'));
  await tick();
}
