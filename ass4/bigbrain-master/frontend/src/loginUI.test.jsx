import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import App from './App';

describe('App', () => {
  test('renders the component', async () => {
    render(
                <App />
    );
    const change = screen.getByText('Sign up');
    fireEvent.click(change);
    const success = await screen.findByText('Register');
    expect(success).toBeInTheDocument();
    const email = screen.getByLabelText('Email');
    const password = screen.getByLabelText('Password');
    const name = screen.getByLabelText('Name');
    fireEvent.change(email, { target: { value: '123@gmail.com' } });
    fireEvent.change(password, { target: { value: '123' } });
    fireEvent.change(name, { target: { value: 'Hayden' } });

    const loginButton = screen.getByText('Register');
    fireEvent.click(loginButton);
  });
});
