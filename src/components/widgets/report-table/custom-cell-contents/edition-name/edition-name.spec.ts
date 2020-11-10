import { tick } from 'svelte';
import { render } from '@testing-library/svelte';
import { editions } from '../../../../../stores/editions';
import EditionName from './edition-name.svelte';

jest.mock('../../../../../stores/editions');
describe('EditionName', () => {
  it('should initially render with an edition id', async () => {
    ((editions.fetch as unknown) as jest.Mock).mockResolvedValue({
      name: 'test-edition-name',
    });
    const { container } = render(EditionName, {
      editionId: '0f590113-9733-4446-abcd-a103d17a2063',
    });
    expect(container.firstChild).toMatchSnapshot();
  });
  it('should render and resolve an edition name', async () => {
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
