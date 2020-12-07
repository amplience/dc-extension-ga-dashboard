import {
  fireEvent,
  getAllByRole,
  getByLabelText,
  getByRole,
  getByTestId,
  getByText,
  render,
} from '@testing-library/svelte';
import {
  ContentItem,
  ContentRepository,
  ContentType,
  Edition,
  Hub,
} from 'dc-management-sdk-js';
import { tick } from 'svelte';
import { get } from 'svelte/store';
import { dateRange, NOW } from '../../stores/date-range';
import { hub } from '../../stores/dynamic-content';
import { selectedContentItems } from '../../stores/filter/selected-content-items';
import { selectedEdition } from '../../stores/filter/selected-edition';
import { selectedContentRepository } from '../../stores/filter/selected-content-repository';
import { formatDateAsISOString } from '../../utils/date-format';
import ReportFilter from './report-filter.svelte';
import { FILTERS, selectedFilter } from '../../stores/filter/selected-filter';
import {
  breakdown,
  contentItemIdMapping,
  editionIdMapping,
  slotIdMapping,
} from './../../stores/google-analytics';

describe('ReportFilter component - Editions', () => {
  beforeEach(() => {
    hub.set(null);
    selectedEdition.set(null);
    selectedContentItems.set([]);
    selectedContentRepository.set(null);
    editionIdMapping.set('EDITION_ID_MAPPING');
    contentItemIdMapping.set('CONTENT_ITEM_ID_MAPPING');
    slotIdMapping.set('SLOT_ID_MAPPING');
  });
  it('should render the ReportFilter component no selectedEdition', () => {
    const { container } = render(ReportFilter, {});
    expect(getByText(container, 'No filters applied')).toBeDefined();
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
    selectedFilter.set(FILTERS.EDITION);
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
    selectedFilter.set(FILTERS.EDITION);
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
    selectedContentRepository.set(null);
    selectedContentItems.set([]);
    editionIdMapping.set('EDITION_ID_MAPPING');
    contentItemIdMapping.set('CONTENT_ITEM_ID_MAPPING');
    slotIdMapping.set('SLOT_ID_MAPPING');
  });
  it('should render the no hub state for the repository picker', async () => {
    const firstContentRepo = new ContentRepository({
      id: 'FIRST_CONTENT_REPOSITORY_ID',
      name: 'Content Repository',
      contentTypes: [
        {
          hubContentTypeId: 'CONTENT_TYPE_ID',
          contentTypeUri: 'http://example.com/schema.json',
        },
      ],
      features: [],
    });

    const secondContentRepo = new ContentRepository({
      id: 'SECOND_CONTENT_REPOSITORY_ID',
      name: 'Content Repository',
      contentTypes: [
        {
          hubContentTypeId: 'CONTENT_TYPE_ID',
          contentTypeUri: 'http://example.com/schema.json',
        },
      ],
      features: [],
    });
    const contentItem = new ContentItem({
      id: 'CONTENT_ITEM_ID',
      label: 'Content Item',
      body: {
        _meta: {
          schema: 'http://example.com/schema.json',
        },
      },
    });
    firstContentRepo.related.contentItems.list = jest.fn().mockResolvedValue({
      getItems: () => [contentItem],
    });
    const mockHub = new Hub({
      id: 'HUB_ID',
    });
    mockHub.related.contentRepositories.list = jest.fn().mockResolvedValue({
      getItems: () => {
        return [
          new ContentRepository({
            id: 'FIRST_CONTENT_REPOSITORY_ID',
            name: 'Content Repository',
          }),
        ];
      },
    });

    mockHub.related.contentRepositories.list = jest.fn().mockResolvedValue({
      getItems: () => {
        return [firstContentRepo, secondContentRepo];
      },
    });

    mockHub.related.contentTypes.get = jest.fn().mockResolvedValue(
      new ContentType({
        id: 'CONTENT_TYPE_ID',
        settings: {
          label: 'Content Type',
        },
      })
    );
    hub.set(mockHub);

    selectedFilter.set(FILTERS.CONTENT);
    const { container } = render(ReportFilter);
    const displayModalButton = getByTestId(container, 'display-modal-button');
    await fireEvent.click(displayModalButton);
    await tick();
    await tick();
    expect(getByLabelText(container, 'Repository')).toBeDefined();
    await tick();
    await tick();

    await tick();
    await tick();

    expect(getByLabelText(container, 'Content Item')).toBeDefined();

    fireEvent.click(getByText(container, 'Content Item')); // buggy
    await tick();

    fireEvent.click(getByText(container, 'Apply'));
    await tick();

    expect(get(selectedContentRepository)).toEqual(firstContentRepo);

    // this should work, but the content item (smui list) component is buggy and doesn't respond to click events in test
    // expect(get(selectedContentItems)).toEqual([contentItem]);
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
  expect(getByText(container, 'Select a recent edition')).toBeDefined();
  fireEvent.click(getByLabelText(container, 'Recent edition'));
  await tick();
  fireEvent.click(getAllByRole(container, 'option')[1]);
  await tick();
  fireEvent.click(getByText(container, 'Apply'));
  await tick();
}
