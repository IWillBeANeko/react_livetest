import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { Login } from './login';

describe('Login', () => {
  test('renders login with default title', () => {
    render(<MemoryRouter initialEntries={['/login']}>
                    <Login />
                </MemoryRouter>)
    expect(screen.getByLabelText('Email')).toBeInTheDocument();
    expect(screen.getByLabelText('Password')).toBeInTheDocument();
    expect(screen.getByText(/LOGIN/i)).toBeInTheDocument();
  })
})
