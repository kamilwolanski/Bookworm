import { expect, test } from 'vitest';
import { render, screen } from '@testing-library/react';
import Emoji from './Emoji';

test('Emoji', () => {
  render(<Emoji>pl</Emoji>);
  expect(screen.getByRole('heading', { level: 1, name: 'Home' }));
});
