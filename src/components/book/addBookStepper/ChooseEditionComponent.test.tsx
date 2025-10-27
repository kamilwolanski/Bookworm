import { render, screen, within } from '@testing-library/react';
import ChooseEditonComponent from './ChooseEditionComponent';
import { ReactNode } from 'react';
import { FormProvider } from 'react-hook-form';
import { EditionDto, UserEditionDto } from '@/lib/userbooks';
import { useActionForm } from '@/app/hooks/useActionForm';
import {
  AddBookToShelfInput,
  chooseEditionSchema,
} from '@/lib/validations/addBookToShelfValidation';

const editions: EditionDto[] = [
  {
    id: 'ed1',
    title: 'Wydanie 1',
    coverUrl: 'https://example.com/cover1.jpg',
    language: 'pl',
    publishers: [
      {
        publisher: {
          id: '123',
          slug: 'helion',
          name: 'Helion',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        editionId: '',
        order: null,
        publisherId: '',
      },
    ],
    publicationDate: new Date(),
    isbn10: '1234567890',
    format: null,
    subtitle: null,
    isbn13: null,
    reviews: [],
  },
  {
    id: 'ed2',
    title: 'Wydanie 2',
    coverUrl: 'https://example.com/cover1.jpg',
    language: 'pl',
    publishers: [
      {
        publisher: {
          id: '123',
          slug: 'helion',
          name: 'Helion',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        editionId: '',
        order: null,
        publisherId: '',
      },
    ],
    publicationDate: new Date(),
    isbn10: '1234567890',
    format: null,
    subtitle: null,
    isbn13: null,
    reviews: [],
  },
];
const mockUseSession = vi.hoisted(() => vi.fn());
const goNext = vi.fn();

vi.mock('next-auth/react', () => ({
  useSession: mockUseSession,
  SessionProvider: ({ children }: { children: ReactNode }) => children,
}));

const userEditions: UserEditionDto[] = [
  { editionId: 'ed1', readingStatus: 'WANT_TO_READ' },
];

export function renderWithForm(ui: React.ReactElement) {
  const Wrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { form } = useActionForm<AddBookToShelfInput>({
      action: vi.fn(),
      schema: chooseEditionSchema,
      defaultValues: {
        editionId: 'ed1',
        readingStatus: 'WANT_TO_READ',
        rating: undefined,
      },
      onSuccess: vi.fn(),
    });
    return <FormProvider {...form}>{children}</FormProvider>;
  };
  return render(ui, { wrapper: Wrapper });
}

describe('ChooseEditionComponent', () => {
  beforeEach(() => {
    mockUseSession.mockReturnValue({ status: 'unauthenticated', data: null });
  });
  it('renders only two editions', () => {
    renderWithForm(
      <ChooseEditonComponent
        editions={editions}
        bookSlug="slug"
        userEditions={userEditions}
        goNext={goNext}
      />
    );
    const links = screen.getAllByRole('link');
    expect(links).toHaveLength(2);
  });

  it('does not render the dodaj button when you are not logged in', () => {
    renderWithForm(
      <ChooseEditonComponent
        editions={editions}
        bookSlug="slug"
        userEditions={userEditions}
        goNext={goNext}
      />
    );
    expect(screen.queryByText(/Dodaj/)).not.toBeInTheDocument();
  });

  it('renders the dodaj button when you are logged in', () => {
    mockUseSession.mockReturnValue({ status: 'authenticated', data: null });

    renderWithForm(
      <ChooseEditonComponent
        editions={editions}
        bookSlug="slug"
        userEditions={userEditions}
        goNext={goNext}
      />
    );
    expect(screen.queryByText(/Dodaj/)).toBeInTheDocument();
  });

  it('renders the “Na półce” copy when you are logged in and have a certain book on a shelf.', () => {
    mockUseSession.mockReturnValue({ status: 'authenticated', data: null });

    renderWithForm(
      <ChooseEditonComponent
        editions={editions}
        bookSlug="slug"
        userEditions={userEditions}
        goNext={goNext}
      />
    );
    expect(screen.queryByText(/na półce/i)).toBeInTheDocument();
    expect(screen.queryByText(/dodaj/i)).toBeInTheDocument();
  });

  it('renders the “Na półce” copy when you are logged in and have a certain book on a shelf.', () => {
    mockUseSession.mockReturnValue({ status: 'authenticated', data: null });

    const { container } = renderWithForm(
      <ChooseEditonComponent
        editions={editions}
        bookSlug="slug"
        userEditions={userEditions}
        goNext={goNext}
      />
    );
    const link = container.querySelector(
      'a[href="/books/slug/ed1"]'
    ) as HTMLElement;
    expect(link).toBeInTheDocument();
    const badge = within(link!).getByText(/na półce/i);
    expect(badge).toBeInTheDocument();
  });
});
