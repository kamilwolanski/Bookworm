import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import AddBookStepperDialog from './AddBookStepperDialog';
import { Review } from '@prisma/client';
import { UserEditionDto } from '@/lib/user';
import { EditionDto } from '@/lib/books';

const baseProps = {
  bookId: 'b1',
  bookSlug: 'ksiazka-1',
  editions: [{ id: 'e1', title: 'Wydanie 1' }] as EditionDto[],
  dialogTitle: 'Dodaj książkę',
  userReviews: [{ id: 'r1' }] as Review[],
  userEditions: [{ editionId: 'e1' }] as UserEditionDto[],
};

vi.mock('@/components/book/addBookStepper/AddBookForm', () => ({
  default: (props: { afterSuccess: () => void }) => (
    <form>
      MockAddBookForm
      <button onClick={() => props.afterSuccess?.()}>MOCK_SUCCESS</button>
    </form>
  ),
}));

describe('AddBookStepperDialog', () => {
  it('renders an add button without opening a dialog', () => {
    render(<AddBookStepperDialog {...baseProps} />);
    expect(screen.queryByText('Dodaj')).toBeInTheDocument();
    expect(screen.queryByText('Dodaj książkę')).not.toBeInTheDocument();
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('renders a dialog after the user clicks', async () => {
    const user = userEvent.setup();
    render(<AddBookStepperDialog {...baseProps} />);
    const addButton = screen.getByText('Dodaj');
    await user.click(addButton);
    expect(screen.queryByText('Dodaj książkę')).toBeInTheDocument();
    expect(screen.queryByRole('dialog')).toBeInTheDocument();
  });

  it('closes the dialog after a successful action', async () => {
    const user = userEvent.setup();
    render(<AddBookStepperDialog {...baseProps} />);
    await user.click(screen.getByRole('button', { name: /dodaj/i }));
    expect(screen.getByText('Dodaj książkę')).toBeInTheDocument();
    await user.click(screen.getByText('MOCK_SUCCESS'));
    expect(screen.queryByText('Dodaj książkę')).not.toBeInTheDocument();
  });

  it('uses the provided afterSuccess instead of the default closeDialog', async () => {
    const user = userEvent.setup();
    const afterSuccess = vi.fn();
    render(<AddBookStepperDialog {...baseProps} afterSuccess={afterSuccess} />);
    await user.click(screen.getByRole('button', { name: /dodaj/i }));
    await user.click(screen.getByText('MOCK_SUCCESS'));
    expect(afterSuccess).toBeCalled();
  });
});
