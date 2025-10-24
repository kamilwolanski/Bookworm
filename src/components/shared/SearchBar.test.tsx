import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { SearchBar } from './SearchBar';
import { Sheet } from '@/components/ui/sheet';

const mockReplaceUseRouter = vi.fn();
const mockUseSearchParams = vi.fn();

vi.mock('next/navigation', () => {
  return {
    useRouter: () => ({ replace: mockReplaceUseRouter }),
    useSearchParams: () => mockUseSearchParams(),
  };
});

describe('SearchBar', () => {
  beforeEach(() => {
    mockUseSearchParams.mockReturnValue(new URLSearchParams());
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('renders placeholder', () => {
    render(
      <Sheet>
        <SearchBar placeholder={'testowy placeholder'} />
      </Sheet>
    );

    const input = screen.getByRole('textbox');
    expect(input).toHaveAttribute('placeholder', 'testowy placeholder');
  });

  it('sets an initial value of the input from search params', () => {
    mockUseSearchParams.mockReturnValue(new URLSearchParams('search=iphone'));
    render(
      <Sheet>
        <SearchBar placeholder={'search...'} />
      </Sheet>
    );

    const input = screen.getByRole('textbox');
    expect(input).toHaveValue('iphone');
  });

  it('Sets the proper value after typing in the input and resets page to 1', async () => {
    const user = userEvent.setup();
    render(
      <Sheet>
        <SearchBar placeholder={'search...'} />
      </Sheet>
    );

    const input = screen.getByRole('textbox');
    await user.type(input, 'example');

    expect(mockReplaceUseRouter).not.toBeCalled();
    await waitFor(
      () => {
        expect(mockReplaceUseRouter).toHaveBeenCalledTimes(1);
      },
      { timeout: 500 }
    );

    const calledUrl = mockReplaceUseRouter.mock.calls[0][0];
    expect(calledUrl).toContain('search=example');
    expect(calledUrl).toContain('page=1');
  });

  it('should remove the search parameter after clearing the input value.', async () => {
    const user = userEvent.setup();

    mockUseSearchParams.mockReturnValue(new URLSearchParams('search=iphone'));
    render(
      <Sheet>
        <SearchBar placeholder={'search...'} />
      </Sheet>
    );

    const input = screen.getByRole('textbox');
    expect(input).toHaveValue('iphone');
    await user.type(input, 'example');
    await user.clear(input);
    expect(input).toHaveValue('');
    await waitFor(
      () => {
        expect(mockReplaceUseRouter).toHaveBeenCalledTimes(1);
      },
      { timeout: 500 }
    );
    const calledUrl = mockReplaceUseRouter.mock.calls[0][0];
    expect(calledUrl).not.toContain('search');
  });
});
