import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { Register } from './login';

describe('Register', () => {
  test('renders register with default title', () => {
    render(<MemoryRouter initialEntries={['/register']}>
            <Register />
          </MemoryRouter>)
    expect(screen.getByLabelText('Email')).toBeInTheDocument();
    expect(screen.getByLabelText('Password')).toBeInTheDocument();
    expect(screen.getByLabelText('Name')).toBeInTheDocument();
    expect(screen.getByText(/REGISTER/i)).toBeInTheDocument();
  })
})
