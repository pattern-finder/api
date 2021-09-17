import { cleanup, render } from '@testing-library/react';
import { LoginPage } from './pages/LoginPage';

afterEach(cleanup);

test('LoginPage proposes to login before proposing to register.', () => {
  const { queryAllByText } = render(<LoginPage />);

  expect(queryAllByText(/Login/i)).toBeTruthy();
});
