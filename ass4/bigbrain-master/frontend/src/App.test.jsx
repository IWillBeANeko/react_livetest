import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './app';

describe('App', () => {
  it('renders Dashboard with default title', () => {
    render(<App />)
    expect(screen.getByText('Sign in')).toBeInTheDocument();
    expect(screen.getByText('Sign up')).toBeInTheDocument();
    expect(screen.getByLabelText('Email')).toBeInTheDocument();
    expect(screen.getByLabelText('Password')).toBeInTheDocument();
    expect(screen.getByText(/LOGIN/i)).toBeInTheDocument();
  })
})
